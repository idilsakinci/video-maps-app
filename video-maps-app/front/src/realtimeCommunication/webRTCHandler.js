import { setLocalStream, setRemoteStream } from "./videoRoomsSlice";
import store from "../store/store";
import { Peer } from "peerjs";

// * WebRTC kullanarak bir bağlantı kurmak için gereken nesneler tanımlanır.
let peer;
let peerId;

export const getPeerId = () => {
    return peerId;
};

// * Tarayıcıdan kullanıcının kamera ve mikrofonuna erişim sağlar.
// * Kullanıcının cihazındaki mikrofon ve kamerayı kullanarak bir yerel medya akışı (localStream) elde eder.
export const getAccessToLocalStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });

    if (localStream) {
        store.dispatch(setLocalStream(localStream));
    }

    // * Eğer getAccess fonksiyonu başarılı olursa true, başarısız olursa false döner.
    return Boolean(localStream);
};

// * PeerJS sunucusuna bağlanarak, yeni bir peer nesnesi oluşturur. 
export const connectWithPeerServer = () => {
    peer = new Peer(undefined, {
        host: "localhost",
        port: 9000,
        path: "/peer",
    });

    // * Oluşturulan peer nesnesi, "open" olayını dinleyerek, bir peer id ataması yapar ve bu peer id, "peerId" 
    // * değişkenine atanır. 
    peer.on("open", (id) => {
        console.log("my peer id is: " + id);
        peerId = id;
    });

    // * Çağrı geldiğinde diğer kullanıcıyla bağlantı kurmak için çağrıyı yanıtlamak ve gelen veri akışını 
    // * (remote stream) göstermek için kullanılır.
    // * localStream değişkeni, Redux deposundaki videoRooms dilimindeki localStream değerini alır. 
    // * Daha sonra, call nesnesi ile answer() yöntemi kullanılarak çağrı yanıtlanır ve gelen veri akışı 
    // * Redux deposundaki videoRooms dilimindeki remoteStream değerine ayarlanır.
    peer.on("call", async (call) => {
        const localStream = store.getState().videoRooms.localStream;

        call.answer(localStream);
        call.on("stream", (remoteStream) => {
            console.log("remote stream came");
            store.dispatch(setRemoteStream(remoteStream));
        });
    });
};

// * Verilen data objesindeki newParticipantPeerId değerine sahip kullanıcıya çağrı yapmak için kullanılır. 
// * İlk olarak, store'dan yerel akışa (localStream) erişilir ve ardından peer.call fonksiyonu çağrılır. 
// * Bu çağrı, verilen newParticipantPeerId'ye sahip kullanıcıya yapılan çağrıdır ve yerel akış (localStream) 
// * kullanarak yapılır. Son olarak, çağrı başarıyla kurulduğunda, çağrının uzak akışını (remoteStream) 
// * setRemoteStream eylemi kullanarak depolanması için store'a gönderilir.
export const call = (data) => {
    const { newParticipantPeerId } = data;

    const localStream = store.getState().videoRooms.localStream;

    const peerCall = peer.call(newParticipantPeerId, localStream);

    peerCall.on("stream", (remoteStream) => {
        console.log("remote stream came");
        store.dispatch(setRemoteStream(remoteStream));
    });
};

// * peer nesnesinin bağlı olduğu tüm peerlerin bağlantısını keser. Bu özellik, mevcut bağlantıların her 
// * peer için bir dizi olarak saklanmasını sağlar. peer.connections özelliği ile her bir bağlantıya erişilir 
// * ve bağlantı kapatılır. Ardından, setRemoteStream eylemi çağrılarak, önceki akışı sıfırlar ve null olarak
// * ayarlar.
export const disconnect = () => {
    for (let conns in peer.connections) {
        peer.connections[conns].forEach((c) => {
            console.log("closing connection");
            c.peerConnection.close();

            if (c.close) c.close();
        });
    }

    store.dispatch(setRemoteStream(null));
};