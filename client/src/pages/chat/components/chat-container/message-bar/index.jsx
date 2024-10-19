import EmojiPicker from 'emoji-picker-react';
import {useRef, useState, useEffect} from 'react';
import {GrAttachment} from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import {RiEmojiStickerLine} from 'react-icons/ri';
import { useSocket } from '@/Context/SocketContext';
import { useAppStore } from '@/store';
import {UPLOAD_FILE_ROUTE} from "@/utils/constants.js";
import {apiClient} from "@/lib/api-client.js";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();  
  const {selectedChatType, selectedChatData, userInfo} = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event){
      if (emojiRef.current && !emojiRef.current.contains(event.target)){
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  }

  const handleSendMessage = async () => {
    if (selectedChatType === "contact"){
      socket.emit("sendMessage", {
        sender: userInfo.id,
        recipient: selectedChatData._id,
        messageType: "text",
        content: message,
        fileUrl: undefined,
      });
    }
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file){
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(UPLOAD_FILE_ROUTE,
            formData,
            {withCredentials: true});

        if (response.status === 200 && response.data){
          if (selectedChatType === "contact"){
            socket.emit("sendMessage", {
              sender: userInfo.id,
              recipient: selectedChatData._id,
              messageType: "file",
              content: undefined,
              fileUrl: response.data.filePath,
            });
          }
        }
      }
    } catch (error){
      console.log({error});
    }

  }

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
            type="text"
            className="flex-1 p-5 bg-transparent round-md focus:border-none focus:outline-none"
            placeholder="Enter Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />
        <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl"/>
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange}/>
        <div className="relative">
          <button
              className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
              onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl"/>
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
          className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:hover:bg-[#741bda]  focus:outline-none focus: text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl"/>
      </button>

    </div>
  );
};

export default MessageBar;