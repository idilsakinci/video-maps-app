import io from 'socket.io-client';
import { onlineUsersHandler, userDisconnectedHandler } from '../store/actions/usersActions';
import { chatMessageHandler } from '../store/actions/MessengerActions';
import { videoRoomsListHandler } from '../store/actions/videoRoomActions';
import { call, disconnect } from "../realtimeCommunication/webRTCHandler";

// * Socket.IO istemcisine bağlantı yapılır

let socket = null;

// * Bağlantı kurulduğunda, "connect" olayı dinleyicisi tetiklenir.
// * "online-users" olayı dinlenir ve sunucuda çevrimiçi olan kullanıcılar kaydedilir.
// * Kullanıcının mesaj gönderdiğinde ne yapacağı belirlenir.
// * Sunucuda mevcut olan video odaları depolanır.
// * WebRTC kullanarak kullanıcının diğer kullanıcılarla video görüşmesi yapmasına olanak tanınır.
// * Kullanıcının video görüşmesini sonlandırması sağlanır.
// * Sunucudan çevrimdışı olan kullanıcılar silinir.
export const connectWithSocketIOServer = () => {
    socket = io('http://localhost:3003');

    socket.on('connect', () => {
        console.log("Connected to socket server");
    });

    socket.on("online-users", (usersData) => {
        onlineUsersHandler(socket.id, usersData);
    });

    socket.on("chat-message", (messageData) => {
        chatMessageHandler(messageData);
    });

    socket.on("video-rooms", (videoRooms) => {
        videoRoomsListHandler(videoRooms);
    });

    socket.on("video-room-init", (data) => {
        call(data);
    });

    socket.on("video-call-disconnect", () => {
        disconnect();
    });

    socket.on("user-disconnected", (disconnetedUserSocketId) => {
        userDisconnectedHandler(disconnetedUserSocketId);
    });
};

// * Kullanıcının oturum açtığını sunucuya bildirir.
export const login = (data) => {
    socket.emit("user-login", data);
};

// * Sunucuya bir sohbet mesajı göndermek için kullanılır.
export const sendChatMessage = (data) => {
    socket.emit("chat-message", data);
};

// * Yeni bir video odası oluşturmak için sunucuya istek gönderir.
export const createVideoRoom = (data) => {
    console.log("emitting");
    socket.emit("video-room-create", data);
};

// * Bir video odasına katılmak için sunucuya istek gönderir.
export const joinVideoRoom = (data) => {
    console.log("emitting event to join a room ");
    console.log(data);
    socket.emit("video-room-join", data);
};

// * Bir video odasından ayrılmak için sunucuya istek gönderir.
export const leaveVideoRoom = (data) => {
    socket.emit("video-room-leave", data);
};