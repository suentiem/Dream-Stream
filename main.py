from flask import Flask, send_from_directory, jsonify, request
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop, PeriodicCallback
from os import listdir
from os.path import isfile, join
import json
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
        current_settings = json.loads(current_settings_raw)
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

    open(PATH_SETTINGS + name, 'wb+').write(json.dumps(settings))

    return jsonify({ "success": True })

# =============================
#  Files
# =============================

@app.route('/files.json')
def files_list():
    files = [ f for f in listdir(PATH_FILES) if isfile(join(PATH_FILES,f)) ]
    return jsonify({ "files": files })
    
@app.route('/files/<path:path>')
def send_files(path):
    return send_from_directory('files', path)

if __name__ == "__main__":
    http_server = HTTPServer(WSGIContainer(app))
    http_server.listen(9002)
    IOLoop.instance().start()