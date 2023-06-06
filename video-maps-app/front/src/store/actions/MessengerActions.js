import { v4 as uuid } from "uuid";
import store from "../store";
import { addChatMessage, addChatbox } from "../../Messenger/messengerSlice";
import * as socketConn from "../../socketConnection/socketConn";

// * Kullanıcının bir mesaj gönderme işlemi gerçekleştirmesini sağlar. 
// * Alıcıya ve mesaj içeriğine sahip bir mesaj nesnesi oluşturur ve bu nesneyi socketConn modülündeki 
// * sendChatMessage fonksiyonuna gönderir. Daha sonra store üzerinden addChatMessage fonksiyonu çağrılır
// * ve mesajın alıcı soket kimliği, içeriği ve benzersiz bir kimliği ile birlikte Messenger özelliğindeki 
// * messengerSlice'a eklenir. Bu işlemin sonucunda, kullanıcının mesajları arayüzde görüntülenir.
export const sendChatMessage = (receiverSocketId, content) => {
    const message = {
        content,
        receiverSocketId,
        id: uuid(),
    };

    socketConn.sendChatMessage(message);

    store.dispatch(addChatMessage(
        {
            socketId: receiverSocketId,
            content: content,
            myMessage: true,
            id: message.id,
        }));
};

// * Gelen sohbet mesajlarını ele almak için kullanılır.  
// * Redux store'daki sohbet mesajlarına ekleme yapar. Daha sonra açık bir sohbet kutusu varsa, sohbet 
// * kutusunu açar. 
export const chatMessageHandler = (messageData) => {
    store.dispatch(addChatMessage({
        socketId: messageData.senderSocketId,
        content: messageData.content,
        myMessage: false,
        id: messageData.id,
    }));

    openChatboxIfClosed(messageData.senderSocketId);
};

// * Eğer açık olmayan bir sohbet kutusu varsa, yeni bir sohbet kutusu açmak için kullanılır. 
// * Store'un messenger bölümünde chatboxes adlı bir dizi aranır ve bu dizi, ilgili sohbet kutusunun olup
// * olmadığını kontrol eder. Böyle bir sohbet kutusu yoksa, store'a bir yeni sohbet kutusu ekler. 
const openChatboxIfClosed = (socketId) => {
    const chatbox = store.getState().messenger.chatboxes.find((c) => c.socketId === socketId);

    const username = store.getState().map.onlineUsers.find((user) => user.socketId === socketId)?.username;

    if (!chatbox) {
        store.dispatch(addChatbox({ socketId, username }))
    }
};