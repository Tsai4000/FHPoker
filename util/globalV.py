cards = {}
clients = []
players = []
onseat = []
ready = []
deck = []
pool = 0
bet = 0
button = ""
startPlayer = ""
startPlayerBet = 0
turn = ""

myclient = None
pokerDB = None
userCollection = None

def init():
    global cards, clients, players, onseat, ready, pool, bet, button, startPlayer, startPlayerBet, turn, deck, myclient, pokerDB, userCollection
    cards = {}
    clients = []
    players = []
    onseat = []
    ready = []
    deck = []
    pool = 0
    bet = 0
    button = ""
    startPlayer = ""
    startPlayerBet = 0
    turn = ""

    myclient = None
    pokerDB = None
    userCollection = None