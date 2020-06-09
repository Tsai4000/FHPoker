import globalV as glo
import random
import pymongo
import os

COEF = {'37': 97425, 
        '34': 28239, 
        '26': 4568, 
        '24': 929, 
        '23': 325, 
        '22': 97, 
        '18': 19, 
        '14': 4, 
        '10':1
}

def initDeck():
    glo.deck = [card + 1 for card in range(52)]
    times = random.randint(50, 100)
    for _ in range(times):
        for j in range(51):
            a = random.randint(0, 100)
            b = random.randint(0, 100)
            if(a > b):
                temp = glo.deck[j]
                glo.deck[j] = glo.deck[j+1]
                glo.deck[j+1] = temp

def initDB():
    glo.myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    glo.pokerDB = glo.myclient['poker']
    glo.userCollection = glo.pokerDB['users']
    if None in [glo.myclient, glo.pokerDB, glo.userCollection]:
        print("monogo Failed")
        os._exit(0)
    else:
        print("mongo init success")

def sortSeat(seats):
    temp = {}
    for seat in sorted(seats.keys()):
        temp[seat] = seats[seat]
    seatList = sorted(temp.keys(), reverse=True)
    for i in range(-1, len(seatList)-1):
        temp[seatList[i]]["nextSeat"] = seatList[i+1]
        temp[seatList[i]]["prevSeat"] = seatList[i-1]
    return temp

def dealPublicCard3():
    glo.deck.pop()
    glo.publicCards.append(glo.deck.pop())
    glo.publicCards.append(glo.deck.pop())
    glo.publicCards.append(glo.deck.pop())

def dealPublicCard1():
    glo.deck.pop()
    glo.publicCards.append(glo.deck.pop())

def dealPlayerCard():
    for seat in sorted(glo.onseat.keys()):
        glo.cards[seat] = [glo.deck.pop()]
    for seat in sorted(glo.onseat.keys()):
        glo.cards[seat].append(glo.deck.pop())

def getWinner(cards):
    score = sorted(cards.values(), reverse=True)[0]
    winner = []
    for card in cards:
        if cards[card]==score:
            winner.append(card)
    return winner

def prizePool():
    while(glo.pool>0):
        winner = getWinner(glo.cards)
        money = 0
        bet = min([glo.onseat[player]['bet'] for player in winner if glo.onseat[player]['bet'] > 0])
        for player in winner:
            if(glo.onseat[player].get('isAllin', None)):
                money = bet*len(glo.cards)//len(winner)
                money = money if money<=glo.pool else glo.pool
            else:
                money = glo.pool
            glo.pool -= money
            glo.userCollection.update_one(
                {"name": glo.onseat[player]['name']}, 
                {"$inc": {"money": money}}
            )
            glo.onseat[player]['money']+=money
        for seat in glo.onseat:
            glo.onseat[seat]['bet'] -= bet if glo.onseat[seat]['bet']>0 else 0
            if glo.onseat[seat]['bet']<=0:
                glo.cards.popItem(seat, None)     

def cardHandle(cards):
    cardNum = "KA23456789TJQ"
    cardSuit = 'CDHS'
    mycard = ""
    for card in cards:
        suit = cardSuit[(card-1)//13]
        num = cardNum[card%13]
        mycard = mycard+f"{num}{suit} "
    return mycard

def cardScore(cards):
    CARD = "23456789TJQKA"
    values = ''.join(sorted(cards[::3], key=CARD.index))
    suits = set(cards[1::3])
    is_flush = len(suits) == 1
    is_straight = values in CARD or values == 'A2345'
    coIdx = 2 * sum(values.count(card) for card in values)+ 13 * is_straight + 14 * is_flush
    return (sum(COEF[str(coIdx)]*(CARD.index(card)+2) for card in values[::-1]),
        [CARD.index(card)+2 for card in values[::-1]],
        coIdx)

def gameResult():
    for index ,seat in enumerate(glo.cards):
        maxScore = 0
        maxCards = None
        maxCardType = 0
        hand= []
        hand = glo.cards[seat]+glo.publicCards
        for i in range(0,5):
            for j in range(i+1,6):
                cards = cardHandle(hand[:i]+hand[i+1:j]+hand[j+1:])
                (score, cards, cardType) = cardScore(cards)
                if(score>=maxScore):
                    maxScore = score
                    maxCards = cards
                    maxCardType = cardType
        glo.cards[seat] = (maxScore, maxCards, maxCardType)

# def main():
#     glo.publicCards = [14,26,12,11,3]
#     glo.cards["seat1"] = [27,4]
#     glo.cards['seat2'] = [40,5]
#     glo.cards['seat3'] = [19,29]
#     glo.cards['seat4'] = [51,33]
#     glo.cards['seat5'] = [25,40]
#     print(glo.cards, glo.publicCards)

#     gameResult()
#     print(glo.cards)

# main()
