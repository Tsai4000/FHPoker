cards = {}
clients = []
players = []
onseat = {}
ready = []
deck = []
pool = 0
bet = 0
bb = 10
isReady = 0
button = ""
startPlayer = ""
startPlayerBet = 0
turn = ""
rounds = 0
publicCards = []

myclient = None
pokerDB = None
userCollection = None


def init():
    global cards, clients, players, onseat, ready, pool, bet, bb
    global button, startPlayer, startPlayerBet, turn, deck
    global isReady, rounds, publicCards
    global pokerDB, userCollection, myclient
    cards = {}
    clients = []
    players = []
    onseat = {}
    ready = []
    deck = []
    pool = 0
    bet = 0
    bb = 10
    isReady = 0
    button = button
    startPlayer = ""
    startPlayerBet = 0
    turn = ""
    rounds = 0
    publicCards = []

    myclient = None
    pokerDB = None
    userCollection = None


def nextRound():
    global pool
    pool = 0
