// * Express kütüphanesini index.js dosyasına dahil eder.
const express = require("express");
// * Express uygulamasını oluşturur.
const app = express();
// * Node.js'nin yerleşik bir modülü olan http kütüphanesini kullanarak bir HTTP sunucusu oluşturur.
const http = require("http");
// * Cross-origin resource sharing (CORS) kütüphanesini index.js dosyasına dahil eder. Bu, farklı kök URL'lere sahip kaynaklar 
// * arasında veri alışverişinin nasıl gerçekleştirileceğini kontrol etmek için kullanılır.
const cors = require("cors");
// * Socket.IO kütüphanesini kullanarak WebSocket sunucusu oluşturur. Socket.IO, gerçek zamanlı uygulamalar için iki yönlü 
// * iletişim sağlamak için kullanılır.
const { Server } = require("socket.io");
// * PeerJS kütüphanesini kullanarak WebRTC sunucusu oluşturur. PeerJS, eşler arası (P2P) bağlantılar oluşturmak için kullanılır.
const { PeerServer } = require("peer");

// * Express uygulamasını kullanarak HTTP sunucusunu oluşturur
const server = http.createServer(app);

// * Tüm isteklere CORS izni verir
app.use(cors());

// * WebSocket sunucusunun oluşturulması için gereken temel ayarları sağlar. 
// * Origin ayarı * olarak ayarlandığı için herhangi bir kaynak sunucuya bağlanabilir. 
// * Methods ayarı, GET ve POST HTTP metodlarını izin verir.
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// * Bu kod sunucunun çalışıp çalışmadığını kontrol etmek için kullanılır.
app.get("/", (req, res) => {
    res.send("Server is started.");
});

// * onlineUsers, kullanıcıların çevrimiçi olduğunu belirten bir nesnedir. 
// * videoRooms, oluşturulan video odalarını temsil eden bir nesnedir. 
let onlineUsers = {};
let videoRooms = {};

// * Socket.IO üzerinden gerçekleştirilen bağlantı olaylarını ele alır ve olaylara özel işlevler atanır. 
// * io.on("connection", (socket) => { ... } ifadesi, herhangi bir istemci sunucuya bağlandığında gerçekleştirilen bağlantı olayını dinler.
// * Hangi istemcinin bağlandığını belirlemek için bir kimlik kullanır.
// * Bu olaylara atanan işlevler:  İstemci tarafından kullanıcının giriş yapması, İstemci tarafından gönderilen sohbet mesajı verisi,
// * Yeni bir video odası oluşturulması, İstemci tarafından belirtilen bir video odasına katılma, İstemcinin bir video odasından 
// * ayrılması, İstemci bağlantısı kesilmesi
// * Her bir olay, Socket.IO'nun içindeki socket nesnesi üzerinden işlevlere bağlanır. Bu nesne, olayı tetikleyen istemciyle 
// * ilgili bilgiler içerir.
io.on("connection", (socket) => {
    console.log(`user connected of the id: ${socket.id}`);
    socket.on("user-login", (data) => loginEventHandler(socket, data));

    socket.on("chat-message", (data) => chatMessageHandler(socket, data));

    socket.on("video-room-create", (data) => videoRoomCreateHandler(socket, data));

    socket.on("video-room-join", (data) => {
        videoRoomJoinHandler(socket, data);
    });

    socket.on("video-room-leave", (data) => {
        videoRoomLeaveHandler(socket, data);
    });

    socket.on("disconnect", () => {
        disconnectEventHandler(socket);
    });
});

// * "peer" protokolünü kullanarak peer-to-peer bağlantılarını yönetmek için bir PeerServer oluşturulur ve 9000 numaralı bağlantı 
// * noktasına bağlanacak şekilde yapılandırılır.
const peerServer = PeerServer({ port: 9000, path: "/peer" });

// * Sunucunun çalışacağı port numarası belirlenir. Bu değişken belirtilmemişse, varsayılan olarak 3003 numaralı port kullanılır.
const PORT = process.env.PORT || 3003;

// * Server nesnesi belirtilen PORT numarası üzerinde dinlemeye başlar. Dinleme başarıyla başlatılırsa, konsola mesaj yazar.
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// * Socket.io ile bağlantı kurulduğunda tetiklenecek user-login olayını işler. İşlev, socket ve data adında iki parametre alır. 
// * Socket parametresi, bağlantıyı başlatan soketi temsil ederken, data parametresi, kullanıcının giriş yaparken gönderdiği verileri 
// * içeren bir nesnedir. OnlineUsers nesnesine yeni bir kullanıcı eklenir. Bu kullanıcının socket.id'si, kullanıcı adı ve koordinatları 
// * bu nesnede tutulur.
// * "logged-users" odasına bağlı olan tüm soketlere, onlineUsers nesnesinin bir dizisini göndermek için online-users olayı yayınlanır.
// * Mevcut video odalarının bilgilerini tüm kullanıcılara yayınlar.
const loginEventHandler = (socket, data) => {
    socket.join("logged-users");

    onlineUsers[socket.id] = {
        username: data.username,
        coords: data.coords,
    };
    console.log(onlineUsers);

    io.to("logged-users").emit("online-users", convertOnlineUsersToArray());

    broadcastVideoRooms();
};

// * Kullanıcının ayrılması durumunda gerçekleştirilecek işlemleri tanımlar. 
// * Kullanıcının bir çağrı içinde olup olmadığı kontrol edilir.
// * Kullanıcının online kullanıcılar listesinden çıkarılması ve diğer kullanıcılara ayrılma detaylarının yayınlanması gerçekleşir.
const disconnectEventHandler = (socket) => {
    console.log(`user disconnected of the id: ${socket.id}`);
    checkIfUserIsInCall(socket);
    removeOnlineUser(socket.id);
    broadcastDisconnectedUserDetails(socket.id);
};

// * Data parametresi mesajın alıcısı, içeriği ve kimliği gibi bilgiler içerir.
// * Mesajın alıcısının soket kimliği alınır.
// * OnlineUsers nesnesi kullanılarak alıcının çevrimiçi olup olmadığı kontrol edilir. Eğer alıcı çevrimiçiyse, mesaj alıcısına gönderilir.
// * Mesaj gönderilirken gönderenin soket kimliği, mesajın içeriği ve kimliği de gönderilir.
// * Mesajın gönderildiği ve alındığına dair bilgi yazdırılır.
const chatMessageHandler = (socket, data) => {
    const { receiverSocketId, content, id } = data;

    if (onlineUsers[receiverSocketId]) {
        console.log("message received");
        console.log("sending message to other user");

        io.to(receiverSocketId).emit("chat-message", {
            senderSocketId: socket.id,
            content,
            id,
        });
    }
};

// * Kullanıcının yeni bir video odası oluşturmasını işler. Data, kullanıcının benzersiz kimlik bilgisi (peerId) ve yeni oda kimliğini
// * (newRoomId) içerir.
// * Yeni bir video odası ekleyerek videoRooms nesnesine kaydeder. Oda, katılımcıların bir dizisini içerir ve katılımcılar da bir nesne 
// * olarak temsil edilir. Katılımcı nesnesi, soket kimliği, kullanıcı adı ve peer kimliği içerir.
// * Oda başarıyla oluşturulduktan sonra, mevcut video odalarının tüm kullanıcılara yayınlanması sağlanır. 
const videoRoomCreateHandler = (socket, data) => {
    const { peerId, newRoomId } = data;

    videoRooms[newRoomId] = {
        participants: [
            {
                socketId: socket.id,
                username: onlineUsers[socket.id].username,
                peerId,
            },
        ],
    };

    broadcastVideoRooms();

    console.log("new room", data);
};

// * Bir kullanıcının bir video odasına katılması durumunda ne yapılacağını belirler.
// * İlk olarak, data değişkeninden roomId ve peerId alınır. Ardından, videoRooms dizisinde roomId ile eşleşen bir oda var mı kontrol 
// * edilir. Eğer varsa, bu odaya katılan tüm katılımcılara yeni bir katılımcının katıldığına dair bilgi verilir. 
// * videoRooms[roomId].participants dizisine yeni bir nesne eklenir. Bu nesne, katılan kullanıcının socketId, kullanıcı adı ve 
// * peerId bilgilerini içerir. videoRooms dizisindeki değişiklikler tüm kullanıcılara iletilir.
const videoRoomJoinHandler = (socket, data) => {
    const { roomId, peerId } = data;

    if (videoRooms[roomId]) {
        videoRooms[roomId].participants.forEach((participant) => {
            socket.to(participant.socketId).emit("video-room-init", {
                newParticipantPeerId: peerId,
            });
        });

        videoRooms[roomId].participants = [...videoRooms[roomId].participants,
        {
            socketId: socket.id,
            username: onlineUsers[socket.id].username,
            peerId,
        },
        ];

        broadcastVideoRooms();
    }
};

// * Bir kullanıcının bir video odasından ayrılması durumunda gerçekleşecek işlemleri tanımlar.
// * roomId ile videoRooms objesindeki ilgili oda bulunur, odanın var olduğu kontrol edilir. Kullanıcının video odasındaki 
// * participants dizisinden çıkarılması sağlanır.
// * Oda içinde bir kişi kalması veya hiç kimse kalmaması durumları kontrol edilir. Eğer odada bir kişi kalırsa, o kişiye, diğer 
// * kullanıcının peer bağlantısını kesmesi gerektiği bilgisini gönderilir. Eğer odada kimse kalmazsa, oda videoRooms objesinden 
// * silinir.
const videoRoomLeaveHandler = (socket, data) => {
    const { roomId } = data;

    if (videoRooms[roomId]) {
        videoRooms[roomId].participants = videoRooms[roomId].participants.filter(
            (p) => p.socketId !== socket.id
        );
    }

    // * odada bir kişi kalırsa
    if (videoRooms[roomId].participants.length > 0) {
        socket.to(videoRooms[roomId].participants[0].socketId).emit("video-call-disconnect");
    }

    // * odada kimse kalmazsa
    if (videoRooms[roomId].participants.length < 1) {
        delete videoRooms[roomId];
    }

    broadcastVideoRooms();
};

// * onlineUsers objesi içinde bir kullanıcının varlığını kontrol eder ve varsa kullanıcıyı listeden siler.
const removeOnlineUser = (id) => {
    if (onlineUsers[id]) {
        delete onlineUsers[id];
    }
    console.log(onlineUsers);
};

// * Bir kullanıcının bir video çağrısının içinde olup olmadığını kontrol eder. Eğer kullanıcı bir çağrının içindeyse, kullanıcıyı o
// * odadan çıkarır. Bu fonksiyon, videoRooms objesi üzerinde tüm odaları döngüye alır ve her birinin içindeki katılımcıları kontrol eder. Katılımcılar arasında belirtilen kullanıcının olup olmadığını kontrol eder ve bulunursa, kullanıcıyı o odadan çıkarır.
const checkIfUserIsInCall = (socket) => {
    Object.entries(videoRooms).forEach(([key, value]) => {
        const participant = value.participants.find(
            (p) => p.socketId === socket.id
        );

        if (participant) {
            removeUserFromTheVideoRoom(socket.id, key);
        }
    });
};

// * Kullanıcının bir video odasından çıkartılması durumunda yapılacak işlemleri içerir. 
// * videoRooms nesnesindeki ilgili odadaki kullanıcıların listesinden çıkartılacak kullanıcıyı bulur ve listeye yeniden atar. 
// * Odada tek bir kullanıcı kaldıysa, o kullanıcıya PeerJS bağlantısını kapatması gerektiğini bildirir. Eğer odada hiç kullanıcı 
// * kalmamışsa, oda videoRooms nesnesinden silinir. 
// * Video odalarının güncel durumu tüm kullanıcılara gönderilir.
const removeUserFromTheVideoRoom = (socketId, roomId) => {
    videoRooms[roomId].participants = videoRooms[roomId].participants.filter(
        (p) => p.socketId !== socketId
    );

    if (videoRooms[roomId].participants.length < 1) {
        delete videoRooms[roomId];
    } else {
        io.to(videoRooms[roomId].participants[0].socketId).emit("video-call-disconnect");
    }

    broadcastVideoRooms();
};

// * Soket ID'si ile eşleşen kullanıcının çıkış yaptığını diğer kullanıcılara bildirir.
const broadcastDisconnectedUserDetails = (disconnectedUserSocketId) => {
    io.to("logged-users").emit("user-disconnected", disconnectedUserSocketId);
};

// * Mevcut video odalarının listesini diğer kullanıcılara bildirir.
const broadcastVideoRooms = () => {
    io.to("logged-users").emit("video-rooms", videoRooms);
};

// * onlineUsers nesnesinin içinde tutulan kullanıcıları bir diziye dönüştürür ve döndürür.
const convertOnlineUsersToArray = () => {
    const onlineUsersArray = [];

    Object.entries(onlineUsers).forEach(([key, value]) => {
        onlineUsersArray.push({
            socketId: key,
            username: value.username,
            coords: value.coords,
        });
    });

    return onlineUsersArray;
};