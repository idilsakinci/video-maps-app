import React from 'react';
import { useSelector } from 'react-redux';
import Chatbox from './Chatbox/Chatbox';
import "./Messenger.css";

// * Messenger bileşeni oluşturulur.
const Messenger = () => {
    const chatboxes = useSelector((state) => state.messenger.chatboxes);

    // * "chatboxes" adlı bir dizi prop'una sahiptir. Bu prop, chat kutularını alır ve her bir chat kutusu 
    // * için "Chatbox" adlı başka bir bileşen oluşturur. Chatbox bileşeni, bir kullanıcının adını ve 
    // * sohbet kutusunun kimle ilgili olduğunu temsil etmek için kullanılır.
    return (
        <div className="messenger_container">
            {chatboxes.map((chatbox) => (<Chatbox key={chatbox.socketId} socketId={chatbox.socketId}
                username={chatbox.username} />))}
        </div>
    )
};

export default Messenger;
