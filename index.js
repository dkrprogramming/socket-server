require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ['GET','POST']
    }
});
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const redis = new Redis();
redis.subscribe('lumen_database_eventchange');

redis.on('message', function (channel, message){
    io.emit('eventChanged',message);
})

io.on('connection', function (socket){
    const token = socket.handshake.auth;
    if(token === ""){
        socket.disconnect();
    }
    try {
        const decoded = jwt.verify(token.token, process.env.JWT_TOKEN);
    }catch {
        socket.disconnect();
    }
});
httpServer.listen(process.env.PORT)