from flask import Flask, send_from_directory, jsonify
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop, PeriodicCallback

app = Flask(__name__, static_url_path='')

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

# =============================
#  Files
# =============================

@app.route('/files.json')
def files_list(path):
    return jsonify({ "files": [] })
    
@app.route('/files/<path:path>')
def send_files(path):
    return send_from_directory('files', path)

if __name__ == "__main__":
    http_server = HTTPServer(WSGIContainer(app))
    http_server.listen(9002)
    IOLoop.instance().start()