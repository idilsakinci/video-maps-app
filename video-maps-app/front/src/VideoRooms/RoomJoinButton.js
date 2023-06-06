import React from 'react';
import { useSelector } from "react-redux";
import { joinVideoRoom } from '../store/actions/videoRoomActions';

// * Video odasına katılmak için kullanılan bir düğme bileşenini tanımlar. 
// * Props olarak, odanın oluşturucusunun kullanıcı adı, odanın kimliği ve odadaki katılımcıların sayısı verilir.
// * handleJoinRoom fonksiyonu, oda dolu veya kullanıcı zaten bir odada bulunuyorsa uyarı gösterir. 
// * Aksi takdirde, joinVideoRoom işlevi çağrılır ve kullanıcının odaya katılması sağlanır. 
// * Bileşen, kullanıcının adının ilk harfini simge olarak gösteren bir düğme olarak gösterilir.
const RoomJoinButton = ({ creatorUsername, roomId, amountOfParticipants }) => {
    const inRoom = useSelector((state) => state.videoRooms.inRoom);

    const handleJoinRoom = () => {
        if (inRoom) {
            return alert("Already in room.");
        }

        if (amountOfParticipants > 1) {
            return alert("Room is full");
        }

        joinVideoRoom(roomId);
    };

    return (
        <button onClick={handleJoinRoom} className="map_page_v_rooms_join_button">
            {creatorUsername[0]}
        </button>
    );
};

export default RoomJoinButton;
