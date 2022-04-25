import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import { normalize,denormalize,schema } from "normalizr";
import productosRouter from './routes/routes.js';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT||8080;
const server = app.listen(port, () => console.log(`Listening on ${port}`));

const io = new Server(server);
server.on("error", error => console.log(`Error en servidor ${error}`));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/api',productosRouter);
app.use(express.static('public'));

const authorSchema = new schema.Entity('author');
const messageSchema = new schema.Entity('messages',{
    author:authorSchema
});
const messagesDBSchema = new schema.Entity('messagesDB',{
    messages : [messageSchema]
});

app.use(cookieParser());
app.use(session({
    store:MongoStore.create({
        mongoUrl: 'mongodb+srv://mdavancens:D4v4nc3n5.@mariancoder.m5prr.mongodb.net/mySessionsDB?retryWrites=true&w=majority' ,
        ttl:20
    }),
    secret:'mongosecretcoderfeliz2022',
    resave:false,
    saveUninitialized:false,
}))

app.get('/login', (req,res) => {
    let cookie = req.cookies;
    if(cookie.nombre)  {
        res.redirect('/content');
    }
    res.sendFile('login.html', {
        root: './views'
      });
})

app.post('/login', (req,res) =>{
    let nombre = req.body.nombre
    res.cookie('nombre',nombre);
    res.redirect('/content');
})

app.get('/content', (req,res) => {
    let cookie;
    if (req.cookies) {cookie = req.cookies}
    if(!cookie.nombre)  {
        res.redirect('/login');
    }
    res.sendFile('index.html', {
        root: './views'
      });
});


app.post('/logout',(req,res) => {
    res.clearCookie('nombre');
    res.sendFile('logout.html', {
        root: './views'
      });
})

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log("Usuario Conectado")
    socket.on('newMessage', (data) => {
        io.emit('refreshChat',data);
    })
    socket.on('newProduct', (data) =>{
        io.emit('refreshProducts',data);
    })
})