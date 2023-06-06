import store from "../store";
import { setOnlineUsers, removeDisconnectedUser } from "../../MapPage/mapSlice";

// * socket server'dan gelen online-users event'ini dinleyerek, online olan kullanıcıların bilgilerini alır
// *  ve bu kullanıcıları Redux store'da tutar. Fonksiyona gelen ikinci parametre olan usersData, server 
// * tarafından döndürülen online kullanıcıların listesidir. Her bir kullanıcının socketId ve username bilgileri 
// * yer almaktadır. Ayrıca bu fonksiyon, kendisi de online olan kullanıcıyı diğerlerinden ayırt edebilmek için 
// * myself: true alanını da ekler.
export const onlineUsersHandler = (socketId, usersData) => {
    store.dispatch(setOnlineUsers(usersData.map(user=>{
        if(user.socketId===socketId){
            user.myself=true;
        }
        return user;
    })));
};

// * Offline olan kullanıcının socketId bilgisini alır ve bu kullanıcıyı Redux store'undan siler. 
export const userDisconnectedHandler=(disconnectedUserSocketId)=>{
    store.dispatch(removeDisconnectedUser(disconnectedUserSocketId));
};