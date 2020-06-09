function Manager() {
  // this.cards = []
  this.publicCards = []
  this.stake = 0
  this.pool = 0
}

// function test(){
//     fetch(`${window.origin}/status` ,{
//         method:'POST',
//         body:JSON.stringify({
//             data:"sss"
//         }),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
// }

let player = null

function leave() {
  socket.disconnect()
}

function Player() {
  this.ownCards = []
  this.name = ""
  this.money = 0
  this.isAllin = false
  this.seat = ""

  this.join = function () {
    console.log('join')
    name = document.getElementById('username').value
    userCode = document.getElementById('usercode').value
    socket.emit("player_join", { name: name, userCode: userCode })
  }
  this.sit = function (seat) {
    this.seat = seat
    console.log(this.seat)
    socket.emit('sit', { name: this.name, seat: this.seat })
  }
  this.raise = function () {
    console.log("raise")
    socket.emit("raise", { name: this.name, money: this.money })
  }
  this.call = function () {
    console.log("call")
    socket.emit("call", { name: this.name, money: this.money })
  }
  this.check = function () {
    console.log("check")
    socket.emit("check", { name: this.name, money: this.money })
  }
  this.fold = function () {
    console.log("fold")
    this.ownCards = []
    socket.emit("fold", { name: this.name, money: this.money })
  }
  this.allin = function () {
    console.log("allin")
    this.allin = true
    socket.emit("allin", { name: this.name, money: this.money })
  }
}

function connect() {
  socket = io.connect()
  player = new Player()
  socket.on("server_response", function (msg) {
    var date = new Date()
    document
      .getElementById("status")
      .append("<p>status: " + msg.data + "Time:" + date + "</p>")
  })
  socket.on("money_update", function (msg) {
    player.money = msg.money
    document.getElementById("money").textContent = `your money: ${msg.money}`
  })
  socket.on("bet_update", function (msg) {
    document.getElementById("bet").textContent = `bet: ${msg.bet}`
  })
  socket.on("pool_update", function (msg) {
    document.getElementById("pool").textContent = `pool: ${msg.pool}`
  })
  socket.on("card_update", function (msg) {
    cards = msg.cards.map(card => {
      console.log(card - 1)
      suit =
        parseInt((card - 1) / 13) == 0
          ? "club"
          : parseInt((card - 1) / 13) == 1
            ? "diamond"
            : parseInt((card - 1) / 13) == 2
              ? "heart"
              : parseInt((card - 1) / 13) == 3
                ? "spade"
                : "error"
      number = card % 13 != 0 ? card % 13 : 13
      return `${suit}${number}`
    })
    player.cards = cards
    document.getElementById("cards").textContent = `your cards: ${player.cards}`
  })
  socket.on("online_user", function (msg) {
    document.getElementById("players").textContent = msg.playerList
  })
  socket.on("user_connect", function (msg) {
    if (msg.success) {
      player.name = msg.name
      player.money = msg.money
      document.getElementById("name").textContent = `player: ${player.name}`
      document.getElementById("money").textContent = `your money: ${player.money}`
    } else {
      alert('join failed')
    }
  })
  socket.on('player_update', function (players) {
    console.log(players)
    // document.getElementById("players").textContent = players.seat1
  })

  document.getElementById("connect").onclick = null
}
