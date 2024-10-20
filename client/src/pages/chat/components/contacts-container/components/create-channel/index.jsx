import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {FaPlus} from "react-icons/fa";
import {useState, useEffect} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import Lottie from "react-lottie";
import {animationDefaultOptions, getColor} from "@/lib/utils.js";
import {apiClient} from "@/lib/api-client.js";
import {GET_ALL_CONTACTS_ROUTES, HOST, SEARCH_CONTACT_ROUTES} from "@/utils/constants.js";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {Avatar, AvatarImage} from "@/components/ui/avatar.jsx";
import {useAppStore} from "@/store/index.js";
import {Button} from "@/components/ui/button.jsx"
import MultipleSelector from "@/components/ui/multipleselect.jsx";

const CreateChannel = () => {
    const {setSelectedChatType, setSelectedChatData} = useAppStore();
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");


    useEffect(() => {
        const getData = async() => {
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
                withCredentials: true,
            });
            setAllContacts(response.data.contacts);
        }

        getData();
    },[]);

    const createChannel = () => {

    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90
                            hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setNewChannelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        Create New Channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            Please fill up the details for new channel.
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={e => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts}
                            placeholder="Search Contacts"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600">
                                    No results found
                                </p>
                            }
                        />
                    </div>
                    <div>
                        <Button
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={createChannel}
                        >
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
};
export default CreateChannel;