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
    if(not glo.userCollection.find_one({"name": req['name']})):
        abort(400)
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
    for seat in glo.onseat:
        if(glo.onseat[seat]['id'] == request.sid):
            glo.onseat.pop(seat, None)
    socketio.emit('player_update', glo.onseat)
    socketio.emit('online_client', {"clientList": glo.clients})
    print('Client '+request.sid+' disconnected', file=sys.stderr)

@socketio.on('connect')
def client_connect():
    glo.clients.append(request.sid)
    join_room('default', request.sid)
    socketio.emit('online_client', {"clientList": glo.clients})
    print('Client '+request.sid+' connected', file=sys.stderr)
# TODO: handle player join and playerdata match
@socketio.on('player_join')
def player_join(data):
    user = glo.userCollection.find_one({
        "name": data['name'], 
        "userCode": data['userCode']
    })
    if(user==None):
        print('Join failed', file=sys.stderr)
    else:
        glo.players.append(request.sid)
        socketio.emit('user_connect', {
            "name": user["name"], 
            "money": user['money']
        }, room=request.sid)
        socketio.emit('online_user', {"playerList": glo.players})
        print('Player '+user['name']+' joined', file=sys.stderr)

@socketio.on('sit')
def player_sit(data):
    user = glo.userCollection.find_one({"name": data['name']})
    glo.onseat[data.seat] = {"name": data.name, "money": user['money'], "bet": 0, "isReady": False, "isFold": False, "id": request.sid}
    socketio.emit('player_update', glo.onseat)
    print('Seat:', glo.onseat, file=sys.stderr)

@socketio.on('click_ready')
def player_ready(data):
    glo.isReady += -1 if glo.onseat[data.seat]['isReady'] else 1
    glo.onseat[data.seat]['isReady'] = not glo.onseat[data.seat]['isReady']
    if(len(glo.onseat) == glo.isReady and len(glo.onseat) != 1):
        glo.onseat = ut.sortSeat(glo.onseat)
        if(glo.firstRound):
            glo.button = sorted(glo.onseat.keys())[0]
        else:
            glo.rounds += 1
            glo.button = sorted(glo.onseat.keys())[glo.rounds%len(glo.onseat)]

        sb = glo.onseat[glo.onseat[glo.button]['nextSeat']]
        glo.onseat[glo.onseat[glo.button]['nextSeat']]['money'] -= 10
        glo.startPlayer = glo.onseat[sb['nexzSeat']]
        glo.startPlayer = glo.turn
        glo.userCollection.update_one(
            {"name": sb["name"]}, 
            {"$set": {"money": sb['money']-10}}
        )
        glo.pool += 10
        socketio.emit('table_update', {"turn": glo.turn, "button": glo.button, "sb": sb})
    socketio.emit('player_update', glo.onseat)
        # TODO: deal

@socketio.on('raise')
def client_raise(data):
    print("raise", data, request.sid, file=sys.stderr)
    if(glo.onseat[data.seat]['money']+glo.onseat[data.seat]['bet']>=glo.bet*2):
        glo.bet = glo.bet * 2
        glo.userCollection.update_one(
            {"name": glo.onseat[data.seat]['name']}, 
            {"$set": {"money": glo.onseat[data.seat]['money']-(glo.bet+glo.onseat[data.seat]['bet'])}}
        )
        glo.pool = glo.pool + glo.bet - glo.onseat[data.seat]['bet']
        glo.onseat[data.seat]['bet'] = glo.bet
        glo.onseat[data.seat]['money'] = glo.onseat[data.seat]['money']-(glo.bet+glo.onseat[data.seat]['bet'])
        # TODO: need check
        socketio.emit('player_update', glo.onseat)
        socketio.emit('bet_update', {"bet": glo.bet})
        socketio.emit('pool_update', {"pool": glo.pool})

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

@socketio.on('fold')
def client_fold(data):
    print('fold ', data.seat, file=sys.stderr)
    glo.onseat[data.seat]['isFold'] = True

@socketio.on('check')
def client_check(data):
    print('check ', request.sid, file=sys.stderr)
    glo.players.remove(request.sid)

if __name__ == "__main__":
    glo.init()
    ut.initDB()
    ut.initDeck()
    socketio.run(app, debug=True, host='127.0.0.1', port=5000)