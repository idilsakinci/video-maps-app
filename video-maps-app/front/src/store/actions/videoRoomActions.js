import { v4 as uuid } from "uuid";
import store from "../store";
import { setInRoom, setRooms } from "../../realtimeCommunication/videoRoomsSlice";
import * as socketConn from "../../socketConnection/socketConn";
import { disconnect, getAccessToLocalStream, getPeerId } from "../../realtimeCommunication/webRTCHandler";

// * Bir video odası oluşturmak için kullanılır. 
// * ullanıcının kamerası ve mikrofonuna erişim izni verilip verilmediğini kontrol eder. Eğer erişim izni 
// * verilmişse, yeni odanın kimliği oluşturulur ve oda kimliği Redux'a kaydedilir.
// * Sunucuya bir video odası oluşturulması için istek gönderilir.
export const createVideoRoom = async () => {

    const success = await getAccessToLocalStream();

    if (success) {
        const newRoomId = uuid();

        store.dispatch(setInRoom(newRoomId));

        socketConn.createVideoRoom({
            peerId: getPeerId(),
            newRoomId,
        });
    }
};

// * Kullanıcının bir video odasına katılmasını sağlayan bir işlev içerir. İşlev, öncelikle kullanıcının
// * yerel akışına erişimini sağlamak için getAccessToLocalStream() fonksiyonunu çağırır ve bu başarılıysa,
// * kullanıcının odaya katılmasına izin verir.
export const joinVideoRoom = async (roomId) => {
    const success = await getAccessToLocalStream();

    if (success) {
        store.dispatch(setInRoom(roomId));
        socketConn.joinVideoRoom({
            roomId,
            peerId: getPeerId(),
        });
    }
};

// * Sunucudan gelen video odaları listesini alır ve Redux store'da videoRooms dilimindeki mevcut oda
// * listesini günceller.
export const videoRoomsListHandler = (videoRooms) => {
    store.dispatch(setRooms(videoRooms));
};

// * Kullanıcının mevcut video odasından ayrılmasını sağlar. Mevcut RTCPeerConnection'ı kapatır. 
// * Kullanıcının ayrıldığı odanın kimliği sunucuya gönderilir. ,
// * Redux store'da inRoom dilimi false olarak ayarlanır, böylece kullanıcı bir oda içinde değil olarak
// * işaretlenir.
export const leaveVideoRoom = (roomId) => {
    disconnect();
    socketConn.leaveVideoRoom({
        roomId,
    });

    store.dispatch(setInRoom(false));
};