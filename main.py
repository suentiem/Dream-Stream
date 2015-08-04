from flask import Flask, send_from_directory, send_file, jsonify, request
from io import BytesIO
from os import walk, listdir, remove
from os.path import join, isfile
from window import Gui
from threading import Event
from time import sleep
from settings import HOST, PORT, PORT_WS
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
from json import loads, dumps

from gevent.wsgi import WSGIServer
from gevent import monkey, sleep as gsleep; monkey.patch_all()

from ws4py.server.geventserver import WebSocketWSGIApplication, \
     WebSocketWSGIHandler, WSGIServer
from ws4py.websocket import EchoWebSocket

app = Flask(__name__, static_url_path='')

PATH_FILES = './files/'
PATH_SETTINGS = './settings/'
PATH_SETTINGS_DEFAULT = PATH_SETTINGS + '_default_'

# =============================
#  Logging
# =============================

import logging
logging.basicConfig(level=logging.INFO)
logging.getLogger('tornado.access').setLevel(logging.INFO)

# =============================
#  App
# =============================

@app.route('/app/')
def send_app_index():
    return send_from_directory('app', 'index.html')
    
@app.route('/app/<path:path>')
def send_app_files(path):
    return send_from_directory('app', path)

@app.route('/config/')
def send_config_index():
    return send_from_directory('config', 'index.html')
    
@app.route('/config/<path:path>')
def send_config_files(path):
    return send_from_directory('config', path)
    
@app.route('/framework/<path:path>')
def send_framework_files(path):
    return send_from_directory('framework', path)

# =============================
#  Settings
# =============================

@app.route('/settings.json')
def settings():
    try:
        current_settings_name = open(PATH_SETTINGS_DEFAULT, 'rb').read()
        current_settings_raw = open(PATH_SETTINGS + current_settings_name, 'rb+').read()
        current_settings = loads(current_settings_raw)
    except:
        current_settings_name = 'Default'
        current_settings = {}

    return jsonify({
        'settings': current_settings,
        'name': current_settings_name
    })

@app.route('/settings/list.json')
def settings_list():
    try:
        current_settings_name = open(PATH_SETTINGS_DEFAULT, 'rb').read()[:-5]
    except:
        current_settings_name = None

    files = [ f[:-5] for f in listdir(PATH_SETTINGS) if isfile(join(PATH_SETTINGS,f)) and '.json' in f ]
    return jsonify({ "settings": files, "default": current_settings_name })

@app.route('/settings/swap.json', methods=['PUT', 'POST'])
def settings_swap():
    _input = request.get_json()
    name = _input.get('name', '')

    open(PATH_SETTINGS_DEFAULT, 'wb+').write(name + '.json')

    return jsonify({ "success": True })

@app.route('/settings/save.json', methods=['PUT', 'POST'])
def settings_save():
    _input = request.get_json()

    settings = _input.get('settings', {})
    name = _input.get('name', None)

    if name is None:
        try:
            name = open(PATH_SETTINGS_DEFAULT, 'rb').read()
        except:
            name = 'Default.json'
            open(PATH_SETTINGS_DEFAULT, 'wb+').write(name)
    else:
        name += '.json'

    open(PATH_SETTINGS + name, 'wb+').write(dumps(settings))

    return jsonify({ "success": True })

# =============================
#  Files
# =============================

@app.route('/files.json')
def files_list():
    files_output = []
    for path, subdirs, files in walk(PATH_FILES):
        for name in files:
            if not name.lower() in ('thumbs.db', 'empty'):
                _path = path.replace('\\', '/').replace(PATH_FILES, '')
                _path = _path + '/' if _path else ''
                files_output.append(_path + name)
    return jsonify({ "files": files_output })
    
@app.route('/files/<path:path>')
def send_files(path):
    return send_from_directory('files', path)

# =============================
#  Import/Export
# =============================

@app.route('/export.zip', methods=['POST'])
def export():
    name = request.form.get('name')
    settings = loads(open(PATH_SETTINGS + name + '.json', 'rb').read())

    # Build list of needed resources
    resources = []
    for listener in settings.get('listeners', []):
        for effect in listener.get('effects', []):
            resource = effect.get('resource', {}).get('source')
            if type(resource) is list:
                resources = resources + resource
            else:
                resources.append(resource)

    # Create ZIP with all files
    memory_file = BytesIO()
    with ZipFile(memory_file, 'w') as zf:
        # Resources
        for resource in resources:
            path = PATH_FILES + resource
            data = ZipInfo('files/' + resource)
            data.compress_type = ZIP_DEFLATED
            zf.writestr(data, open(path, 'rb').read())

        # Config
        data = ZipInfo('settings/' + name + '.json')
        data.compress_type = ZIP_DEFLATED
        zf.writestr(data, open(PATH_SETTINGS + name + '.json', 'rb').read())
    memory_file.seek(0)
    
    return send_file(memory_file, attachment_filename=name + '.zip', as_attachment=True)

@app.route('/import.json', methods=['POST'])
def import_pack():
    file = request.files['file']
    if file:
        file.save('./temp.zip')
        zip = ZipFile('./temp.zip')
        zip.extractall()
        filenames = zip.namelist()
        zip.close()
        remove('./temp.zip')

        # Set default settings
        for filename in filenames:
            if 'settings/' in filename:
                name = filename[9:]
                open(PATH_SETTINGS_DEFAULT, 'wb+').write(name)


        return jsonify({'success': True, 'files': filenames})
    else:
        return jsonify({'success': False})


# =============================
#  Talk Socket
# =============================

class BroadcastWebSocket(EchoWebSocket):
    def opened(self):
        app = self.environ['ws4py.app']
        app.clients.append(self)

    def received_message(self, m):
        app = self.environ['ws4py.app']
        for client in app.clients:
            client.send(m)
        pass

    def closed(self, code, reason=None):
        app = self.environ.pop('ws4py.app')
        if self in app.clients:
            app.clients.remove(self)

class EchoWebSocketApplication(object):
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.ws = WebSocketWSGIApplication(handler_cls=BroadcastWebSocket)
        self.clients = []

    def __call__(self, environ, start_response):
        if environ['PATH_INFO'] == '/favicon.ico':
            return self.favicon(environ, start_response)

        if environ['PATH_INFO'] == '/ws':
            environ['ws4py.app'] = self
            return self.ws(environ, start_response)

        return None

    def favicon(self, environ, start_response):
        status = '200 OK'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        return ""

if __name__ == "__main__":
    kill_event = Event()
    gui = Gui(kill_event)
    gui.start()
    gui.set_status_server(True)

    http_server = WSGIServer((HOST, PORT), app)
    http_server.start()
    
    websocket_application = EchoWebSocketApplication(HOST, PORT_WS)
    websocket_server = WSGIServer((HOST, PORT_WS), websocket_application)
    websocket_server.start()

    while not kill_event.is_set():
        gsleep(0.1)

    http_server.stop()