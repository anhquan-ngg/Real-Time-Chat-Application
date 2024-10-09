export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    setSelectedChatType: (selectChatType) => set({selectChatType}),
    setSelectedChatData: (selectedChatData) => set({selectedChatData}),
    setSelectedChatMessages: (selectedChatMessages) => set({selectedChatMessages}),
    closeChat: () =>
        set({
            selectChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: [],
        }),
});