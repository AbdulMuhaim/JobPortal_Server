const jobModel = require('../models/jobModel');
const chatModel = require('../models/chatModel')
const user = require('../models/userModel')
const { default: mongoose } = require("mongoose");
const messageModel = require('../models/messageModel');


const accessChat = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).send('Bad Request');
        }
        let employeeId;
        let employerId;

        if(req.payload.role === 'Employee'){
            console.log("emply");
            const data = await jobModel.findOne({_id: id},{employerId : 1})
            employerId =  data.employerId
            employeeId = new mongoose.Types.ObjectId(req.payload.id)
        }
        if(req.payload.role === 'Employer'){
          console.log("reqrtr");
          const data = await user.findOne({_id: id},{_id : 1})
          employeeId = data._id
          employerId = new mongoose.Types.ObjectId(req.payload.id)
        } 
        const findQuery = {
            employeeId: employeeId,
            employerId: employerId
        };
        const isChat = await chatModel.findOne(findQuery);
        if (isChat) {
            res.sendStatus(200);
        } else {
            const chatData = {
               employeeId: employeeId,
               employerId: employerId
            };
            await chatModel.create(chatData);
            res.sendStatus(200);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const fetchChats=async(req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.payload.id)
        const userRole = req.payload.role === 'Employee' ? "employeeId" : "employerId"
        
        const chats = await chatModel
            .find({[userRole]: userId })
            .populate({ path: 'employeeId', select: 'name image email' })
            .populate({ path: 'employerId', select: 'name email' })
            .populate({ path: 'latestMessage', populate: { path: 'senderId', select: 'name image email' } })
            .sort({ updatedAt: -1 });
        res.status(200).json({chats})
    } catch (error) {
        console.log(error);
        return res.status(500)
    }
}

const sendMessage = async (Message) => {
    console.log("100001");
    console.log(Message);
    try {
        const newMessage = {
            senderId: new mongoose.Types.ObjectId(Message.senderId._id),
            content: Message.content,
            chat: new mongoose.Types.ObjectId(Message.chatId),
            senderType: Message.role
        }
        let message = await messageModel.create(newMessage);
        await chatModel.findByIdAndUpdate(Message.chatId, {
            latestMessage: message
        })
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const allMessages = async(req,res)=>{
    try {
      const messages = await messageModel.find({chat : req.query.chatId})
        .populate("senderId","name image email")
        .populate("chat")
         res.status(200).json({result:messages})
    } catch (error) {
        console.log(error);
        return res.status(500)
    }
}



module.exports = {
    accessChat,
    sendMessage,
    fetchChats,
    allMessages,
    
}