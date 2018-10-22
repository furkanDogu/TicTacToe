const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 3000;
var app = express();
var server = http.createServer(app); // creating http server with express object.
var io = socketIO(server); // attaching the server to socketIO.


let gameStore = {}; //this object will hold our room and player information as shown below.


/* 
 {
    roomNumber: {
        player1: sth,
        player2: sth,
        currentPlayerID: sth
    }
 }
 */

 // This method creates a listener on the specified port or path. (3000 in our case).
server.listen(port, () => { 
    console.log(port, 'is up');
});

// this method will be opened once a socket is connected to the server (same as client's 'connect' action).
io.on('connection', (socket) => {
    console.log('new user connected');
    
    // creates new object with roomNumber and adds it to gameStore. Finally, specifies the player1 as creator of room. 
    socket.on('createRoom', (roomNumber) => {
        gameStore[roomNumber] = {};
        gameStore[roomNumber]["player1"] = socket.id;
        socket.join(roomNumber); // adding the room creator to the room.

    });

    socket.on('joinRoom', (roomNumber) => {
        // this function can only be fired for player2 because player1 is already in room (aka room creator).
        // going on same process by taking socked.id and adding user to the room. We also check if the roomNumber is valid.
        // Also we add the second player to the room.
        if (gameStore.hasOwnProperty(roomNumber)) {
            gameStore[roomNumber]["player2"] = socket.id;
            socket.join(roomNumber);
            gameStore[roomNumber]["currentPlayerID"] = gameStore[roomNumber]["player1"];
            io.in(roomNumber).emit("startGame", gameStore[roomNumber].currentPlayerID);
        } else {
            socket.emit('wrongNumber');
            console.log('wrongNumber');
        }
    });

    socket.on('clickedTable', (data) => {
        gameStore[data.roomNumber]["mathTable"] = data.mathTable;
        // finding new current player after click event.
        if (gameStore[data.roomNumber].currentPlayerID === gameStore[data.roomNumber].player1) {
            gameStore[data.roomNumber].currentPlayerID = gameStore[data.roomNumber].player2;
        } else {
            gameStore[data.roomNumber].currentPlayerID = gameStore[data.roomNumber].player1;
        }
        // sending new mathTable to the users which  are in the same room.
        io.in(data.roomNumber).emit('updateTable', { 
            mathTable: [...data.mathTable],
            currentPlayerID: gameStore[data.roomNumber].currentPlayerID
        });
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });

    socket.on('clickedRestart', (roomNumber) => {
        socket.broadcast.to(roomNumber).emit('wantToPlayAgain'); //broadcasting all the players in a room except the one who clicked to the restart button
    });

    socket.on('handshakeDone', (roomNumber) => { // if other player wants to play too, handshake is done, we can start a new game.
        io.in(roomNumber).emit('initGame');
    });

    // when the direction of timebar is changed, this will be caught and it will send new action to both users in room to change bar direction.
    socket.on('moveTheBar',(data) => {
        io.in(data.roomNumber).emit('barStartsMoving', data.tableValue);
    });

    // stops the bar of both users when the game is finished.
    socket.on('stopTheBar', (data) => {
        io.in(data.roomNumber).emit('stopTheBar');
    });


});





