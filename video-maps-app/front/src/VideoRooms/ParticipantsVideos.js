import React from 'react';
import { useSelector } from 'react-redux';
import Video from "./Video"
import VideoRoomButtons from './VideoRoomButtons';

// * Bir video konferans odasındaki katılımcıların videolarını gösterir.
// * <Video> bileşeni, localStream ve remoteStream prop'larındaki video akışlarını gösterir. 
// * localStream prop'u, kullanıcının kendi video akışını gösterir.
// * remoteStream prop'u kullanıcının konuştuğu kişinin video akışını gösterir.
const ParticipantsVideos = () => {
    const inRoom = useSelector((state) => state.videoRooms.inRoom);
    const localStream = useSelector((state) => state.videoRooms.localStream);
    const remoteStream = useSelector((state) => state.videoRooms.remoteStream);

    return (
        <div className="map_page_v_rooms_videos_container">
            {inRoom && <VideoRoomButtons inRoom={inRoom} />}

            {inRoom && localStream && <Video stream={localStream} muted />}
            {/* İki kullanıcı da aynı bilgisayarda ses dinlediği için ikinciyi de muted yapıldı
            ama gerçek zamanlı uygulamada bu muted olmamalı */}
            {inRoom && remoteStream && <Video stream={remoteStream} muted />}
        </div>
    );
};

export default ParticipantsVideos
