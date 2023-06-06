import React from 'react';
import NavBar from './NavBar';
import Messages from './Messages';
import NewMessage from './NewMessage';

// * Chatbox bileşeni tanımlanır.
const Chatbox = (props) => {
    const { socketId } = props;

    // * NavBar bileşeni, chat kutusunun başlığını ve kullanıcı adını içeren bir bileşendir. 
    // * Messages bileşeni, belirli bir kullanıcının mesaj geçmişini gösterir. 
    // * NewMessage bileşeni ise, belirli bir kullanıcıya yeni bir mesaj göndermek için kullanılan bir 
    // * form bileşenidir.
    return (
        <div className="chatbox_container">
            <NavBar {...props} />
            <Messages socketId={socketId} />
            <NewMessage socketId={socketId} />
        </div>
    );
};

export default Chatbox;
