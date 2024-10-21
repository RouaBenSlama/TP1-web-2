import { auth } from "./Firebase";
import { create } from "zustand";

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    changeChat: (chatId, user) => {
        set({
            chatId,
            user,
            isCurrentUserBlocked: false, // Set as false since you don't have the blocked logic
            isCurrentReceiverBlocked: false, // Set as false as well
        });
    },
    changeBlock: () =>{
        set(state =>({...state,isCurrentReceiverBlocked: !state.isCurrentReceiverBlocked}))
    }



    

}))