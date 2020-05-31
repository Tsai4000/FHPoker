import pymongo
import sys
import os

from flask import Flask, jsonify, abort, request, render_template, make_response
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["DEBUG"] = True
app.config["threaded"] = True

socketio = SocketIO(app)

@app.route('/' ,methods=['GET'])
def index():
    return render_template('poker.html',  async_mode=socketio.async_mode)

@app.route("/status", methods=['POST'])
def upload():
    if not request.json:
        abort(400)

    d = request.json.get("data", 0)
    print("receive data:{}".format(d), file=sys.stderr)
    # do something

    # 回傳給前端
    socketio.emit('status_response', {'data': d})
    return jsonify({"response": "ok"})

@socketio.on('connect_event')
def test(msg):
    emit('server_response', {'data': msg['data']})

@socketio.on('disconnect')
def client_disconnect():
    print('Client disconnected', file=sys.stderr)

@socketio.on('connect')
def client_connect():
    print('Client connected', file=sys.stderr)

socketio.run(app, debug=True, host='127.0.0.1', port=5000)