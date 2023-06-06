import React from 'react';
import { useSelector } from 'react-redux';
import callIcon from "../resources/images/call-icon.svg";
import { createVideoRoom } from '../store/actions/videoRoomActions';

// * Çağrı butonu görüntüsü ve oluşturma işlemini tetikler. 
// * Video odası oluşturma işlemini başlatır. Ancak, kullanıcı zaten bir odada ise, bir uyarı gösterir. 
const CreateRoomButton = () => {

    const inRoom = useSelector((state) => state.videoRooms.inRoom);

    const handleRoomCreate = () => {
        if (inRoom) {
            return alert("You're already in a room.");
        }
        createVideoRoom();
    };

    return (
        <img src={callIcon} className="map_page_card_img" onClick={handleRoomCreate}></img>
    )
}

export default CreateRoomButton
