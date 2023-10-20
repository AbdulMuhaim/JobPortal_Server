const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    senderType:{
        type: String,
        enum: ["user","employer"],
        required: true
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "senderType"
    },
    content :{
        type : String ,
        trim :true
    },
    chat :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'chat'
    },
    is_read :{
        type : Boolean,
        default : false
    }
},
{
    timestamps : true
}
)

const messageModel = mongoose.model('message',messageSchema)
module.exports = messageModel


