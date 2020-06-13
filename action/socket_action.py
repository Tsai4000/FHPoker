import util.utils as ut
import util.globalV as glo
import sys
import os


def playerReady():
    glo.onseat = ut.sortSeat(glo.onseat)

    glo.button = sorted(glo.onseat.keys())[glo.rounds % len(glo.onseat)]
    glo.rounds += 1

    sb = glo.onseat[glo.onseat[glo.button]['nextSeat']]
    glo.onseat[glo.onseat[glo.button]['nextSeat']]['money'] -= 10
    glo.startPlayer = glo.onseat[sb['nexzSeat']]
    glo.startPlayer = glo.turn
    glo.userCollection.update_one(
        {"name": sb["name"]},
        {"$set": {"money": sb['money']-10}}
    )
    glo.pool += 10
    return sb


def raiseBet(data):
    glo.bet = glo.bet * 2
    glo.userCollection.update_one(
        {"name": glo.onseat[data.seat]['name']},
        {"$set": {"money": glo.onseat[data.seat]
                  ['money']-(glo.bet+glo.onseat[data.seat]['bet'])}}
    )
    glo.pool = glo.pool + glo.bet - glo.onseat[data.seat]['bet']
    glo.onseat[data.seat]['bet'] = glo.bet
    glo.onseat[data.seat]['money'] = glo.onseat[data.seat]['money'] - \
        (glo.bet+glo.onseat[data.seat]['bet'])


def allinBet(data):
    user = glo.userCollection.find_one({"name": data['name']})
    glo.pool = glo.pool + user['money']
    glo.bet = user['money'] if user['money'] >= glo.bet else glo.bet
    glo.onseat[data.seat]['isAllin'] = True
    glo.userCollection.update_one(
        {"name": data['name']}, {"$set": {"money": 0}})


def foldCard(data):
    glo.cards.pop(data.seat, None)
    glo.onseat[data.seat]['isFold'] = True
    prevSeat = glo.onseat[data.seat]['prevSeat']
    nextSeat = glo.onseat[data.seat]['nextSeat']
    if(glo.startPlayer == data.seat):
        glo.startPlayer = prevSeat
    glo.turn = glo.onseat[glo.turn]['nextSeat']
    glo.onseat[prevSeat]['nextSeat'] = nextSeat
    glo.onseat[nextSeat]['prevSeat'] = prevSeat


def isRoundEnd():
    return (glo.onseat[glo.turn]['nextSeat'] == glo.startPlayer
            and (glo.bet == glo.onseat[glo.onseat[glo.turn]['nextSeat']]['bet']
                 or glo.onseat[glo.onseat[glo.turn]['nextSeat']]['isAllin']))


def isGameSet():
    return len(glo.publicCards) >= 5


def showDown():
    for player in glo.cards:
        glo.onseat[player]['hand'] = glo.cards[player]
