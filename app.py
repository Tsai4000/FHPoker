import pymongo
import sys
import os
import random

from flask import Flask, jsonify, abort, request, render_template, make_response
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["DEBUG"] = True
app.config["threaded"] = True
app.config["TEMPLATES_AUTO_RELOAD"] = True

socketio = SocketIO(app)

deck = [card + 1 for card in range(52)]
money = 100
bet = 10
players = []


def initCard():
    deck = [card + 1 for card in range(52)]
    times = random.randint(50, 100)
    for _ in range(times):
        for j in range(51):
            a = random.randint(0,100)
            b = random.randint(0,100)
            if(a>b):
                temp = deck[j]
                deck[j] = deck[j+1]
                deck[j+1] = temp

@app.route('/' ,methods=['GET'])
def index():
    return render_template('poker.html')

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

@socketio.on('disconnect')
def client_disconnect():
    print('Client disconnected', file=sys.stderr)

@socketio.on('connect')
def client_connect():
    print('Client '+request.sid+' connected', file=sys.stderr)

@socketio.on('raise')
def client_raise(data):
    global money, bet
    # username and rasie stake
    print("raise", data, request.sid, file=sys.stderr)
    bet = bet + 10
    socketio.emit('money_update', {"money": money})
    socketio.emit('bet_update', {"bet": bet})

@socketio.on('start')
def client_deal(data):
    playerCards = [deck.pop() for _ in range(2)]
    print(request.sid, playerCards, file=sys.stderr)
    socketio.emit('card_update', {"cards": playerCards})


initCard()
socketio.run(app, debug=True, host='127.0.0.1', port=5000)