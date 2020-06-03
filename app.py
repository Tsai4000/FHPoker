import sys
import os
import random

sys.path.insert(1, './util')
sys.path.insert(1, './controller')
import globalV as glo
import utils as ut

from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import Flask, jsonify, abort, request, render_template, make_response

app = Flask(__name__)
app.config["DEBUG"] = True
app.config["threaded"] = True
app.config["TEMPLATES_AUTO_RELOAD"] = True

socketio = SocketIO(app)

@app.route('/', methods=['GET'])
def index():
    return render_template('poker.html')

@app.route("/create_user", methods=['POST'])
def upload():
    if not request.json:
        abort(400)
    req = request.get_json()
    user = {
        "name": req['name'],
        "userCode": req['userCode'],
        "money": 5000
    }
    glo.userCollection.insert_one(user)
    return make_response(jsonify(user), 200)

@socketio.on('disconnect')
def client_disconnect():
    glo.clients.remove(request.sid)
    socketio.emit('online_user', {"clientList": glo.clients})
    print('Client disconnected', file=sys.stderr)

@socketio.on('connect')
def client_connect():
    glo.clients.append(request.sid)
    join_room('default', request.sid)
    socketio.emit('online_user', {"clientList": glo.clients})
    print('Client '+request.sid+' connected', file=sys.stderr)

@socketio.on('player_join')
def player_join(data):
    user = glo.userCollection.find_one({
        "name": data['name'], 
        "userCode": data['userCode']
    })
    glo.players.append(request.sid)
    socketio.emit('user_connect', {
        "name": user["name"], 
        "money": user['money']
    }, room=request.sid)
    socketio.emit('onseat_user', {"playerList": glo.players})
    print('Player '+user['name']+' joined', file=sys.stderr)

@socketio.on('raise')
def client_raise(data):
    print("raise", data, request.sid, file=sys.stderr)
    glo.bet = glo.bet * 2
    glo.userCollection.update_one(
        {"name": data['name']}, 
        {"$set": {"money": data['money']-glo.bet}}
    )
    glo.pool = glo.pool + glo.bet
    socketio.emit('money_update', {"money": data['money']-glo.bet}, room=request.sid)
    socketio.emit('glo.bet_update', {"glo.bet": glo.bet})
    socketio.emit('glo.pool_update', {"glo.pool": glo.pool})

@socketio.on('start')
def client_deal(data):
    playerCards = [glo.deck.pop() for _ in range(2)]
    print(request.sid, playerCards, file=sys.stderr)
    socketio.emit('card_update', {"cards": playerCards}, room=request.sid)

@socketio.on('call')
def client_call(data):
    print("call", request.sid, file=sys.stderr)
    glo.userCollection.update_one(
        {"name": data['name']}, 
        {"$set": {"money": data['money']-glo.bet}}
    )
    glo.pool = glo.pool + glo.bet
    socketio.emit('money_update', {"money": data['money']-glo.bet}, room=request.sid)
    socketio.emit('glo.pool_update', {"glo.pool": glo.pool})

@socketio.on('allin')
def client_allin(data):
    print("allin", request.sid, file=sys.stderr)
    user = glo.userCollection.find_one({"name": data['name']})
    glo.userCollection.update_one({"name": data['name']}, {"$set": {"money": 0}})
    glo.pool = glo.pool + user['money']
    socketio.emit('money_update', {"money": 0}, room=request.sid)
    socketio.emit('glo.pool_update', {"glo.pool": glo.pool})

@socketio.on('check')
def client_fold(data):
    print('fold ', request.sid, file=sys.stderr)
    glo.players.remove(request.sid)

if __name__ == "__main__":
    glo.init()
    ut.initDB()
    ut.initDeck()
    socketio.run(app, debug=True, host='127.0.0.1', port=5000)