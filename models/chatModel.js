const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    employeeId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    employerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'employer'
    },
    latestMessage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'message'
    }
},
{
    timestamps : true
}
)

const chatModel = mongoose.model('chat',chatSchema)
module.exports = chatModel