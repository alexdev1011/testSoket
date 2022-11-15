const express = require("express")
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: '*' } });
const path = require('node:path');
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config();

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
const { Subject } = require('rxjs')

$emitList = new Subject();
$alertas = new Subject();
io.on("connection", (socket) => {
    socket.on('chat message', (msg) => {
        console.log(msg);
    });
    console.log("conectado");
    $emitList.subscribe(res => {
        socket.emit("lista actualizada", { data: res });
    })
    $alertas.subscribe(res => {
        socket.emit("alerta", { message: res })
    })
    socket.on("disconnect", (socket) => {
        console.log("Clientes conectados", socket);
    })

    console.log("Clientes conectados", socket.server.eio.clientsCount);
});


app.post("/set/list", (req, res) => {
    $emitList.next(req.body.data);
    res.status(200).json({ message: "datos enviados" })
})
app.get("/alerta", (req, res) => {
    console.log(req.query);
    $alertas.next(req.query.message);
    res.status(200).json({ message: "datos enviados" })
})
const port = 8000

// Starting a server
server.listen(port, () => {
    console.log(`App is running at ${port}`)
});