from flask import Flask, jsonify, abort, request, render_template, make_response
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import cross_origin
import action.socket_action as sa
import util.utils as ut
import util.globalV as glo
import sys
import os
import random

app = Flask(__name__)
app.config["DEBUG"] = True
app.config["threaded"] = True
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["CORS_ALLOWED_ORIGINS"] = True
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/', methods=['GET'])
def index():
    return render_template('poker.html')


@app.route("/create_user", methods=['POST'])
def upload():
    if not request.json:
        abort(400)
    req = request.get_json()
    if(glo.userCollection.find_one({"name": req['name']})):
        abort(400)
    user = {
        "name": req['name'],
        "userCode": req['userCode'],
        "money": 5000
    }
    glo.userCollection.insert_one(user)
    return make_response(jsonify(user), 200)


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    if not request.json:
        abort(400)
    req = request.get_json()
    user = glo.userCollection.find_one(
        {'name': req['name'], "userCode": req['userCode']})
    if(not user):
        make_response(jsonify({
            "message": 'Login failed'
        }), 400)
    else:
        return make_response(jsonify({
            "name": user['name'],
            "money": user['money']
        }), 200)


@socketio.on('disconnect')
def client_disconnect():
    glo.clients.remove(request.sid)
    for seat in glo.onseat.copy():
        if(glo.onseat[seat]['id'] == request.sid):
            glo.onseat.pop(seat, None)
    socketio.emit('player_update', glo.onseat)
    socketio.emit('online_client', {"clientList": glo.clients})
    print('Client '+request.sid+' disconnected', file=sys.stderr)


@socketio.on('connect')
def client_connect():
    glo.clients.append(request.sid)
    join_room('default', request.sid)
    socketio.emit('player_update', glo.onseat)
    print('Client '+request.sid+' connected', file=sys.stderr)


@socketio.on('player_join')
def player_join(data):
    user = glo.userCollection.find_one({
        "name": data['name'],
        "userCode": data['userCode']
    })
    if(user == None):
        socketio.emit('user_connect', {'success': False}, room=request.sid)
        print('Join failed', file=sys.stderr)
    else:
        glo.players.append(request.sid)
        socketio.emit('user_connect', {
            'success': True,
            "name": user["name"],
            "money": user['money']
        }, room=request.sid)
        socketio.emit('online_user', {"playerList": glo.players})
        print('Player '+user['name']+' joined', file=sys.stderr)


@socketio.on('sit')
def player_sit(data):
    user = glo.userCollection.find_one({"name": data['name']})
    seatList = [glo.onseat[seat]['name'] for seat in glo.onseat]
    if(data['seat'] not in glo.onseat and data['name'] not in seatList):
        glo.onseat[data['seat']] = {
            "name": user['name'],
            "money": user['money'],
            "bet": 0,
            'hand': [-1, -1],
            "isReady": False,
            "isFold": False,
            "id": request.sid
        }
    elif(data['seat'] not in glo.onseat and data['name'] in seatList): 
        for seat in glo.onseat.copy():
            if(glo.onseat[seat]['name'] == data['name']):
                glo.onseat[data['seat']] = glo.onseat[seat]
                glo.onseat.pop(seat, None)
                break
    socketio.emit('player_update', glo.onseat)
    print('Seat:', glo.onseat, file=sys.stderr)


@socketio.on('click_ready')
def player_ready(data):
    glo.isReady += -1 if glo.onseat[data['seat']]['isReady'] else 1
    glo.onseat[data['seat']]['isReady'] = not glo.onseat[data['seat']]['isReady']
    if(len(glo.onseat) == glo.isReady and len(glo.onseat) != 1):
        sb = sa.playerReady()
        ut.dealPlayerCard()
        socketio.emit('table_update', {
                      "turn": glo.turn, "button": glo.button, "sb": sb['name'], "publicCards": glo.publicCards})
    socketio.emit('player_update', glo.onseat)


def afterBetCheck():
    if(sa.isRoundEnd()):
        if(len(glo.publicCards) == 0):
            for seat in sorted(glo.cards.keys()):
                socketio.emit('cards_update', {
                              "selfCard": glo.cards[seat]}, room=glo.onseat[seat]['id'])
            ut.dealPublicCard3()
        if(not sa.isGameSet()):
            ut.dealPublicCard1()
        else:
            sa.showDown()
            socketio.emit('player_update', glo.onseat)
            ut.gameResult()
            socketio.emit('result_update', glo.cards)
            ut.prizePool()
    glo.turn = glo.onseat[glo.turn]['nextSeat']
    socketio.emit('table_update', {
                  "turn": glo.turn, "publicCards": glo.publicCards, "pool": glo.pool, "bet": glo.bet})
    socketio.emit('player_update', glo.onseat)


@socketio.on('raise')
def client_raise(data):
    print("raise", data, request.sid, file=sys.stderr)
    if(data['seat'] == glo.turn and glo.onseat[data['seat']]['money']+glo.onseat[data['seat']]['bet'] >= glo.bet+glo.bb):
        sa.raiseBet(data)
        afterBetCheck()


@socketio.on('call')
def client_call(data):
    print("call", request.sid, file=sys.stderr)
    if(data['seat'] == glo.turn and glo.onseat[data['seat']]['money']+glo.onseat[data['seat']]['bet'] >= glo.bet):
        glo.userCollection.update_one(
            {"name": data['name']},
            {"$set": {"money": data['money']-glo.bet}}
        )
        glo.pool = glo.pool + glo.bet
        afterBetCheck()


@socketio.on('allin')
def client_allin(data):
    print("allin", request.sid, file=sys.stderr)
    if(data['seat'] == glo.turn):
        sa.allinBet(data)
        afterBetCheck()


@socketio.on('fold')
def client_fold(data):
    print('fold ', data['seat'], file=sys.stderr)
    if(data['seat'] == glo.turn):
        sa.foldCard(data)
        if(glo.onseat[data['seat']]['nextSeat'] == glo.onseat[data['seat']]['prevSeat'] and len(glo.cards) == 1):
            print("end")
            glo.userCollection.update_one(
                {"name": glo.onseat[glo.cards.keys()[0]]['name']},
                {"$inc": {"money": glo.pool}}
            )
            glo.pool = 0
        socketio.emit('table_update', {
                      "turn": glo.turn, "publicCards": glo.publicCards, "pool": glo.pool})
        socketio.emit('player_update', glo.onseat)


@socketio.on('check')
def client_check(data):
    print('check ', request.sid, file=sys.stderr)
    if(data['seat'] == glo.turn and glo.bet == glo.onseat[data['seat']]['bet']):
        afterBetCheck()


if __name__ == "__main__":
    glo.init()
    ut.initDB()
    ut.initDeck()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
