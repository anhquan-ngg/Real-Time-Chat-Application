import {useAppStore} from "@/store/index.js";
import {Avatar, AvatarImage} from "@/components/ui/avatar.jsx";
import {DELETE_CHANNEL_ROUTE, HOST} from "@/utils/constants.js";
import {getColor} from "@/lib/utils.js";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {apiClient} from "@/lib/api-client.js";

// eslint-disable-next-line react/prop-types
const ContactList = ({contacts, isChannel = false}) => {
    const {selectedChatData, setSelectedChatType, setSelectedChatData, setSelectedChatMessages, removeChannel} = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
    }

    const handleDeleteContact = async (contact) => {
        try {
            const response = await apiClient.delete(
                `${DELETE_CHANNEL_ROUTE}/${contact._id}`,
                {withCredentials: true},
            );
            if (response.status === 200){
                removeChannel(contact);
                if (selectedChatData === contact) {
                    setSelectedChatData([]);
                }
            }
        } catch (error) {
            console.log({error});
        }
    }

    return (
        <div className="mt-5">
            {
                // eslint-disable-next-line react/prop-types
                contacts.map((contact) => (
                    <div key={contact._id}
                         className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
                                        ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`}
                         onClick={() => handleClick(contact)}
                    >
                        {
                            !isChannel && <div className="flex gap-5 items-center justify-start text-neutral-300">
                                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                    {contact.image ? (
                                        <AvatarImage
                                            src={`${HOST}/${contact.image}`}
                                            alt="profile"
                                            className="object-cover w-full h-full bg-black"
                                        />
                                    ) : (
                                        <div
                                            className={`${
                                                selectedChatData &&
                                                selectedChatData._id === contact._id
                                                    ? "bg-[#ffffff22] border border-white/70"
                                                    : getColor(contact.color)}
                                            uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}
                                        >
                                            {contact.firstName
                                                ? contact.firstName.split("").shift()
                                                : contact.email.split("").shift()}
                                        </div>
                                    )}
                                </Avatar>
                                <span>{contact.firstName} {contact.lastName}</span>
                            </div>
                        }
                        {
                            isChannel &&
                                <ContextMenu>
                                    <ContextMenuTrigger>
                                        <div className="flex gap-5 items-center justify-start text-neutral-300">
                                            <div
                                                className="flex bg-[#ffffff22] h-10 w-10 items-center justify-center rounded-full">
                                                #
                                            </div>
                                            <span>{contact.name}</span>
                                        </div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent className="bg-[#000000] text-white border-none">
                                        <ContextMenuItem onClick = {() => handleClick(contact)}>Open</ContextMenuItem>
                                        <ContextMenuItem className="text-red-500" onClick = {() => handleDeleteContact(contact)}>Delete</ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                        }
                    </div>
                ))
            }
        </div>)
}
export default ContactList;