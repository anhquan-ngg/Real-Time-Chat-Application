import {createContext, useContext, useEffect, useRef} from 'react';
import {useAppStore} from "@/store";
import {io} from "socket.io-client";
import {HOST} from "@/utils/constants.js";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({children}) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo && userInfo.id) {
            socket.current = io(HOST, {
                withCredentials: true, 
                query: {userId: userInfo.id},
            });
            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            const handleReceiveMessage = (message) => {
                const {selectedChatType, selectedChatData, addMessage, addContactsInDMContacts} = useAppStore.getState();
                if (selectedChatType !== undefined && selectedChatData &&
                    (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    addMessage(message);
                }
                addContactsInDMContacts(message);
            };

            const handleReceiveChannelMessage = (message) => {
                const {selectedChatType, selectedChatData, addMessage, addChannelInChannelList} = useAppStore.getState();
                if (selectedChatType !== undefined  && selectedChatData._id === message.channelId){
                    addMessage(message);
                }
                addChannelInChannelList(message);
            }

            socket.current.on("receiveMessage",(message) => handleReceiveMessage(message));
            socket.current.on("receive-channel-message",(message) =>  handleReceiveChannelMessage(message));

            return () => {
                    socket.current.disconnect();
            };
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
};