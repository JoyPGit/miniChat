var app = require('express')();//() is required
var server = require('http').Server(app);
var io = require('socket.io')(server);

let users = [];
let connections = [];

server.listen(3200);

app.get('/',(req,res)=>{res.sendFile(__dirname + '/index.html')});
console.log('hi world');

io.on('connection',(socket)=>{
    console.log(socket.id);
    connections.push(socket);
    let socket1 = socket;
    console.log('connected : %s sockets connected', connections.length);

    socket.on('new-user',(data,callback)=>{//(data,callback)
        callback(true);
        //console.log(socket);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
        let chatObject = {username:data,socketId:socket};
    })

    socket.on('disconnect',(data)=>{
        users.splice(users.indexOf(socket.username),1)
        connections.splice(connections.indexOf(socket),1);
        console.log('disconnected : %s sockets connected', connections.length)
    })

    socket.on('send-message',(data)=>{
        let y = JSON.stringify(data);
        console.log(y);
        io.emit('new-message',data);
    })


    let updateUserNames = ()=>{
        io.emit('get-users',users)
    }

    socket.on('room',(data)=>{
        console.log('line 47');
        socket.join('joy');
        //console.log(`line 48 : joined ${r}`);
        console.log(`line 49 which logs from frontend ${data}`);
    })

    socket.on('room-message',(data)=>{
        console.log(`line 53 ${JSON.stringify(data)}`);
        //let d = data;
        socket.broadcast.to('joy').emit('updatechat',data)// 'SERVER', socket.username+' has joined this room');
        console.log('inside room1');
        //socket.emit
    })

})
