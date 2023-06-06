import React from 'react';
import { useDispatch } from 'react-redux';
import { addChatbox } from "../../Messenger/messengerSlice";
import chatIcon from "../../resources/images/chat-icon.svg";

// * ChatButton, bir sohbet kutusu eklemek için kullanıcının tıklamasına yanıt verir. 
// * Bu düğmeye tıklanınca, addChatbox fonksiyonu kullanılarak bir sohbet kutusu eklenir. 
// * Bu fonksiyona socketId ve username parametreleri geçirilir.
const ChatButton = ({ socketId, username }) => {
    const dispatch = useDispatch();

    const handleAddChatbox = () => {
        dispatch(addChatbox({
            username,
            socketId,
        }));
    };

    return (
        <img src={chatIcon} className="map_page_card_img" onClick={handleAddChatbox}></img>
    )
};

export default ChatButton;
