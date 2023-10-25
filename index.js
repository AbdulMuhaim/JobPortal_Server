const express= require("express")
const cors= require("cors")
const bodyParser=require("body-parser")
const cookieParser=require("cookie-parser")
const connectDatabase = require("./database/database")
const employerRoutes=require("./routes/employerRoutes")
const adminRoutes= require("./routes/adminRoutes")
const userRoutes=require("./routes/userRoutes") 
require('dotenv').config()
const chatController = require('./controllers/chatController')


const app= express()

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/',userRoutes)
app.use('/employer',employerRoutes)
app.use('/admin',adminRoutes)

connectDatabase()


const PORT = process.env.PORT

const server=app.listen(PORT,()=>{
    console.log(`server is runnig at PORT ${PORT}`);
});

const io = require('socket.io')(server,{
    pingTimeout : 60000,
    cors:{
        origin : process.env.FRONT_END_URL
    }
})

io.on('connection',(socket)=>{
    console.log('socket connected');
    socket.on('error',(error)=>{
        console.log(error);
    })

    socket.on('joinroom',(chatId,senderId)=>{
        console.log(chatId, 'sender:',senderId ,'joined in room');
        socket.on('error',(error)=>{
            console.log(error);
        })
        socket.join(chatId)
    })

    socket.on('send message',(newmessage,chatId)=>{
        console.log(newmessage);
        socket.on('error',(error)=>{
            console.log(error);
        })
        io.to(chatId).emit('response',newmessage)
        chatController.sendMessage(newmessage)
        
    })
})
