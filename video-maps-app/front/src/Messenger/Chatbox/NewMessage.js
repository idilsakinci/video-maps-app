import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendChatMessage } from '../../store/actions/MessengerActions';

// * Yeni mesaj yazma bileşenini oluşturur. 
const NewMessage = ({ socketId }) => {
    // * Stateler tanımlanıp boş bir string ile başlatılıyorç
    const [message, setMessage] = useState("");
    const [inputDisabled, setInputDisabled] = useState("");

    const onlineUsers = useSelector((state) => state.map.onlineUsers);

    // * Inputa girilen mesajı almak için kullanılır. Bu fonksiyon, inputa girilen değeri setMessage 
    // * fonksiyonuyla değiştirir.
    const handleMessageValueChange = (event) => {
        setMessage(event.target.value);
    };

    // *  Klavyeden tuşa basıldığında tetiklenir. Eğer kullanıcı "Enter" tuşuna basarsa ve mesajın
    // * uzunluğu 0'dan büyükse, proceedChatMessage fonksiyonu çağrılır.
    const handleKeyPressed = (event) => {
        if (event.code === "Enter" && message.length > 0) {
            proceedChatMessage();
            setMessage("");
        }
    };

    // * Kullanıcının mesajı göndermesini sağlar. Eğer onlineUsers state'inde bir kullanıcı varsa, 
    // * mesajın alıcısına gönderilmesini sağlar. Eğer alıcı offline ise, mesajı göndermek için inputDisabled
    // * state'i true olarak değiştirir.
    const proceedChatMessage = () => {
        if (onlineUsers.find((user) => user.socketId === socketId)) {
            sendChatMessage(socketId, message);
        } else {
            setInputDisabled(true);
        }
    };

    // * Input elementi oluşturulur. 
    return (
        <div className="chatbox_new_message_container">
            <input type="text" placeholder="Type your message..." className="chatbox_new_message_input"
                value={message} onChange={handleMessageValueChange} onKeyDown={handleKeyPressed}
                disabled={inputDisabled} />
        </div>
    );
};

export default NewMessage;
