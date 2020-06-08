import globalV as glo
import random
import pymongo
import os

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
    seatLength = len(sorted(temp.keys(), reverse=True))
    for seat in sorted(seats.keys()):
        temp[seat] = seats[seat]
    for i in range(-1, seatLength-1):
        temp[seatLength[i]]["nextSeat"] = seatLength[i+1]
        temp[seatLength[i]]["prevSeat"] = seatLength[i-1]
    return temp

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
    return (2 * sum(values.count(card) for card in values) #不同卡牌计数
        + 13 * is_straight + 14 * is_flush, #顺子*13，同花*15
        [CARD.index(card)+2 for card in values[::-1]])

def gameResult():
    for seat in glo.cards:
        maxScore = 0
        maxCards = None
        hand= []
        hand = glo.cards[seat]+glo.publicCards
        for i in range(0,5):
            for j in range(i+1,6):
                cards = cardHandle(hand[:i]+hand[i+1:j]+hand[j+1:])
                (score, cards) = cardScore(cards)
                if(score>=maxScore):
                    maxScore = score
                    maxCards = cards
        glo.cards[seat] = (maxScore, maxCards)

# def main():
#     print(glo.cards, glo.publicCards)
#     glo.publicCards = [3,41,5,22,4]
#     glo.cards["seat1"] = [7,6]
#     glo.cards['seat2'] = [20,19]
#     glo.cards['seat3'] = [11,29]
#     glo.cards['seat4'] = [51,33]
#     glo.cards['seat5'] = [23,43]
#     gameResult()
#     print(glo.cards)

# main()
