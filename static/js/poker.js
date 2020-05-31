function Manager(){
    // this.cards = []
    this.publicCards = []
    this.stake = 0
    this.pool = 0

    // for(i=0; i<52; i++){
    //     this.cards[i] = i+1
    // }
    
    // this.shuffle = function(){
    //     times = Math.random() * 5
    //     for(i=0; i<times; i++){
    //         this.cards.sort((a, b) => {
    //             a = Math.random()
    //             b = Math.random()
    //             return a-b
    //         })
    //     }
    // }


    // this.hand = function(playerList){
    //     playerList.forEach((player) => {
    //         if(playerList.length() <= 7){
    //             player.ownCards[0] = this.cards.pop()
    //             player.ownCards[1] = this.cards.pop()
    //         }
    //         else{
    //             console.log("too many people")
    //         }
    //     })
    //     this.publicCards[0] = this.cards.pop()
    //     this.publicCards[1] = this.cards.pop()
    //     this.publicCards[2] = this.cards.pop()
    // }
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

function leave(){
    socket.disconnect()
}

function Player(){
    this.ownCards = []
    this.name = ""
    this.money = 0
    this.isAllin = false

    this.raise = function(){
        console.log("raise")
    }
    this.call = function(){
        console.log("call")
    }
    this.check = function(){
        console.log("check")
    }
    this.fold = function(){
        console.log("fold")
    }
    this.allin = function(){
        console.log("allin")
    }
}

function join(){
    var socket = io.connect();
    // socket.emit('connect_event', {data: "test"})
    socket.on('server_response', function(msg) {
        var date = new Date();
        document.getElementById('status').append('<p>status: ' + msg.data + "Time:"+ date+ '</p>');
    })
    document.getElementById('join').onclick = null

    player = new Player
}
