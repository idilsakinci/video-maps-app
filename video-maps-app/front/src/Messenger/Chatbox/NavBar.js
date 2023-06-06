import React from 'react';
import { useDispatch } from 'react-redux';
import closeIcon from "../../resources/images/close-icon.svg";
import { removeChatbox } from '../messengerSlice';

// * Chatbox bileşenindeki NavBar bileşenindeki bir alt bileşendir. 
// * Kullanıcının adını gösterir.
const ChatboxLabel = ({ username }) => {
    return (
        <p className="chatbox_nav_bar_label">{username}</p>
    );
};

// * Sohbet kutusunu kapatmak için kullanılır. 
const CloseButton = ({ socketId }) => {
    const dispatch = useDispatch();

    const handleCloseChatbox = () => {
        dispatch(removeChatbox(socketId));
    };

    return (
        <div className="chatbox_close_icon_container">
            <img src={closeIcon} alt="close" className="chatbox_close_icon_img" onClick={handleCloseChatbox} />
        </div>
    );
};

// * NavBar bileşeni, chatbox'ın üst kısmında yer alan kısmı oluşturmak için kullanılır. ChatbocLabel ve 
// * closeButton'dan oluşur.
const NavBar = ({ username, socketId }) => {
    return (
        <div className="chatbox_nav_bar_container">
            <ChatboxLabel username={username} />
            <CloseButton socketId={socketId} />
        </div>
    );
};

export default NavBar;
