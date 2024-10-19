import {Server as SocketIOServer} from 'socket.io';
import Message from './models/MessagesModel.js';

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

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket Id: ${socket.id}`);
        } else {
            console.log('User ID not provided during connection');
        }

        socket.on('sendMessage',(message) =>  sendMessage(message));
        socket.on('disconnect', () => disconnect(socket));
        // socket.on('fileUpload')
    });
};

export default setupSocket;