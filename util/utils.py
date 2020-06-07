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