import React from 'react';
import { useSelector } from "react-redux";
import CreateRoomButton from './CreateRoomButton';
import RoomJoinButton from './RoomJoinButton';
import ParticipantsVideos from './ParticipantsVideos';

// * Bir obje olarak tutulan oda bilgilerini bir diziye dönüştürür. 
// * Her bir oda nesnesi, üç özelliğe sahiptir: oda kimliği, oluşturan kullanıcının kullanıcı adı ve 
// * odadaki katılımcı sayısı
const convertRoomsToArray = (videoRooms) => {
    const rooms = [];
    Object.entries(videoRooms).forEach(([key, value]) => {
        rooms.push({
            id: key,
            creatorUsername: value.participants[0].username,
            amountOfParticipants: value.participants.length,
        });
    });
    return rooms;
};

// * Redux store'da depolanan video odalarını listelemek için kullanılır. 
// * Video odalarının dizisini alır. Daha sonra, convertRoomsToArray fonksiyonunu kullanarak video odalarını 
// * bir diziye dönüştürür. Bu dönüştürülmüş dizi, map fonksiyonu ile işlenir ve her bir video oda öğesi
// * için bir RoomJoinButton bileşeni oluşturulur. RoomJoinButton bileşeni, bir video odasına katılmak için 
// * bir düğme gösterir. 
const RoomsList = () => {
    const rooms = useSelector((store) => store.videoRooms.rooms);

    return (
        <div className="map_page_v_rooms_list">
            <CreateRoomButton />
            {convertRoomsToArray(rooms).map((room) => (<RoomJoinButton key={room.id}
                creatorUsername={room.creatorUsername}
                roomId={room.id} amountOfParticipants={room.amountOfParticipants} />
            ))}
        </div>
    )
};

// * İki alt bileşeni birleştirir ve sayfadaki video odalarını ve katılımcı videolarını görüntüler.
const VideoRooms = () => {
    return (
        <>
            <RoomsList />
            <ParticipantsVideos />
        </>
    );
};

export default VideoRooms;
