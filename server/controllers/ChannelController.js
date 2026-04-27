import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";
import Message from "../models/MessagesModel.js"
import mongoose from "mongoose";

export const createChannel = async (req, res, next) =>  {
    try {
        const {name, members} = req.body;
        const userId = req.userId;

        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).send("Admin user not found");
        }

        const validMembers = await User.find({_id: {$in: members}});
        if ( validMembers.length !== members.length){
            return res.status(400).send("Some members are not valid users");
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();
        return res.status(201).send({channel: newChannel});
    } catch(error) {
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
}

export const getUserChannels = async (req, res, next) =>  {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({
           $or: [{admin: userId}, {members: userId}],
        }).sort({updatedAt: -1});

        return res.status(201).send({channels: channels});
    } catch(error) {
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
}

export const getChannelMessages = async (req, res, next) => {
    try{
        const {channelId} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const channel = await Channel.findById(channelId).populate({
            path:"messages",
            options: {
                sort: { timestamp: -1 },
                skip: skip,
                limit: limit
            },
            populate: {
                path: "sender",
                select: "firstName lastName email _id image color",
            },
        });

        if (!channel) {
            return res.status(404).send("Channel not found");
        }

        const isMember = channel.members.some(memberId => memberId.toString() === req.userId);
        const isAdmin = channel.admin.toString() === req.userId;

        if (!isMember && !isAdmin) {
            return res.status(403).send("You don't have access to this channel's messages");
        }

        const messages = channel.messages.reverse();
        return res.status(201).json({messages});
    } catch(error){
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
}

export const deleteChannel = async (req, res, next) => {
    try{
        const {channelId} = req.params;
        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).send("Channel not found");
        }

        if (channel.admin.toString() !== req.userId) {
            return res.status(403).send("Only admin can delete the channel");
        }

        await Message.deleteMany({ _id: { $in: channel.messages } });
        await Channel.deleteOne({_id: channelId});
        return res.status(200).send("Delete channel successfully");
    } catch(error){
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
}