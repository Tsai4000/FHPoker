import pymongo
import sys
import os
import random

from flask import Flask, jsonify, abort, request, render_template, make_response
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["DEBUG"] = True
app.config["threaded"] = True
app.config["TEMPLATES_AUTO_RELOAD"] = True

socketio = SocketIO(app)

myclient = None
pokerDB = None
userCollection = None

deck = [card + 1 for card in range(52)]
pool = 0
bet = 10
players = []


def initDB():
    global myclient, pokerDB, userCollection
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    pokerDB = myclient['poker']
    userCollection = pokerDB['users']
    if None in [myclient, pokerDB, userCollection]:
        print("monogo Failed")
        os._exit(0)
    else:
        print("mongo init success")

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

@app.route("/create_user", methods=['POST'])
def upload():
    if not request.json:
        abort(400)
    global userCollection
    req = request.get_json()
    user = {
        "name": req['name'],
        "userCode": req['userCode'],
        "money": 5000
    }
    userCollection.insert_one(user)
    return make_response(jsonify(user), 200)

@socketio.on('disconnect')
def client_disconnect():
    players.remove(request.sid)
    socketio.emit('online_user', {"playerList": players})
    print('Client disconnected', file=sys.stderr)

@socketio.on('connect')
def client_connect():
    players.append(request.sid)
    join_room('default', request.sid)
    socketio.emit('online_user', {"playerList": players})
    print('Client '+request.sid+' connected', file=sys.stderr)

@socketio.on('player_join')
def player_join(data):
    global userCollection
    user = userCollection.find_one({"name": data['name'], "userCode": data['userCode']})
    socketio.emit('user_connect', {"name": user["name"], "money": user['money']}, room=request.sid)
    print('Client '+request.sid+' connected', file=sys.stderr)

@socketio.on('raise')
def client_raise(data):
    global userCollection, bet, pool
    print("raise", data, request.sid, file=sys.stderr)
    bet = bet * 2
    userCollection.update_one({"name": data['name']}, {"$set": {"money": data['money']-bet}})
    pool = pool + bet
    socketio.emit('money_update', {"money": data['money']-bet}, room=request.sid)
    socketio.emit('bet_update', {"bet": bet})
    socketio.emit('pool_update', {"pool": pool})

@socketio.on('start')
def client_deal(data):
    playerCards = [deck.pop() for _ in range(2)]
    print(request.sid, playerCards, file=sys.stderr)
    socketio.emit('card_update', {"cards": playerCards}, room=request.sid)

@socketio.on('call')
def client_call(data):
    global userCollection, bet, pool
    print("call", request.sid, file=sys.stderr)
    userCollection.update_one({"name": data['name']}, {"$set": {"money": data['money']-bet}})
    pool = pool + bet
    socketio.emit('money_update', {"money": data['money']-bet}, room=request.sid)
    socketio.emit('pool_update', {"pool": pool})

if __name__ == "__main__":
    players = []
    initDB()
    initCard()
    socketio.run(app, debug=True, host='127.0.0.1', port=5000)