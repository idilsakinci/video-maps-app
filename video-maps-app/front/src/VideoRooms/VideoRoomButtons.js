import React from 'react';
import { useSelector, useDispatch } from "react-redux";

import { leaveVideoRoom } from '../store/actions/videoRoomActions';
import { setIsMicOn, setIsCameraOn } from '../realtimeCommunication/videoRoomsSlice';

import micIcon from "../resources/images/mic-icon.svg";
import micOffIcon from "../resources/images/mic-off-icon.svg";
import cameraIcon from "../resources/images/camera-icon.svg";
import cameraOffIcon from "../resources/images/camera-off-icon.svg";
import disconnectIcon from "../resources/images/call-disconnect-icon.svg";

// * Bir video odasındaki kullanıcıların mikrofon, kamera vb. özelliklerini kontrol etmek için kullanılan
// * butonlar yer alır.
// * isMicOn ve isCameraOn state değerleri, kullanıcının mikrofon ve kamerasının açık olup olmadığını 
// * belirtmek için kullanılır. 
// * handleLeaveRoom fonksiyonu, kullanıcının video odasından ayrılmasını sağlar. 
// * handleMuteUnmuteChange fonksiyonu, kullanıcının mikrofonunu açıp kapamasını sağlar. 
// * handleCameraOnOffChange fonksiyonu, kullanıcının kamerasını açıp kapamasını sağlar. 
// * Butonların duruma göre değişimi sağlanır.
const VideoRoomButtons = ({ inRoom }) => {

    const isMicOn = useSelector((state) => state.videoRooms.isMicOn);
    const isCameraOn = useSelector((state) => state.videoRooms.isCameraOn);

    const localStream = useSelector((state) => state.videoRooms.localStream);

    const dispatch = useDispatch();

    const handleLeaveRoom = () => {
        leaveVideoRoom(inRoom);
    };

    const handleMuteUnmuteChange = () => {
        localStream.getAudioTracks()[0].enabled = !(localStream.getAudioTracks()[0].enabled);
        dispatch(setIsMicOn(!isMicOn));
    };

    const handleCameraOnOffChange = () => {
        localStream.getVideoTracks()[0].enabled = !(localStream.getVideoTracks()[0].enabled);
        dispatch(setIsCameraOn(!isCameraOn));
    };

    return (
        <div className="m_page_v_rooms_video_buttons_container">
            <button className="m_page_v_rooms_video_button" onClick={handleMuteUnmuteChange}>
                <img src={isMicOn ? micIcon : micOffIcon} width="25px" height="25px" />
            </button>
            <button className="m_page_v_rooms_video_button" onClick={handleLeaveRoom}>
                <img src={disconnectIcon} width="25px" height="25px" />
            </button>
            <button className="m_page_v_rooms_video_button" onClick={handleCameraOnOffChange}>
                <img src={isCameraOn ? cameraIcon : cameraOffIcon} width="25px" height="25px" />
            </button>
        </div>
    )
}

export default VideoRoomButtons
