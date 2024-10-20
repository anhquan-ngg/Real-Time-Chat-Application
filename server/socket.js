import {Server as SocketIOServer} from 'socket.io';
import Message from './models/MessagesModel.js';
import Channel from './models/ChannelModel.js';

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()){
            if (socketId === socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
    }
    
    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
        console.log(message.sender);
        const createdMessage = new Message({
            sender: message.sender,
            recipient: message.recipient,
            messageType: message.messageType,
            content: message.content,
            fileUrl: message.fileUrl,
        });
        await createdMessage.save();
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");


        if (recipientSocketId){
            io.to(recipientSocketId).emit('receiveMessage', messageData);
        }
        if (senderSocketId){
            io.to(senderSocketId).emit('receiveMessage', messageData);
        }
    }

    const sendChannelMessage = async (message) => {
        const channelId = message.channelId;

        const createdMessage = new Message({
            sender: message.sender,
            content: message.content,
            messageType: message.messageType,
            fileUrl: message.fileUrl,
            timestamp: new Date(),
        });

        await createdMessage.save();
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color");

        await Channel.findByIdAndUpdate(channelId, {
            $push: {messages: createdMessage._id},
        });

        const channel = await Channel.findById(channelId).populate("members");

        const finalData = {...messageData._doc, channelId: channelId};

        if (channel && channel.members){
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId){
                    io.to(memberSocketId).emit('receive-channel-message', finalData);
                }
            });
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId){
                io.to(adminSocketId).emit('receive-channel-message', finalData);
            }
        }
    }

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket Id: ${socket.id}`);
        } else {
            console.log('User ID not provided during connection');
        }

        socket.on('sendMessage',(message) =>  sendMessage(message));
        socket.on('send-channel-message', (message) => sendChannelMessage(message));
        socket.on('disconnect', () => disconnect(socket));
    });
};

export default setupSocket;