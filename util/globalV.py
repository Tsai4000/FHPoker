cards = {}
clients = []
players = []
onseat = {}
ready = []
deck = []
pool = 0
bet = 0
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
    global cards, clients, players, onseat, ready, pool, bet, button, startPlayer, startPlayerBet, turn, deck, myclient, pokerDB, userCollection, isReady, rounds, publicCards
    cards = {}
    clients = []
    players = []
    onseat = {}
    ready = []
    deck = []
    pool = 0
    bet = 0
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
