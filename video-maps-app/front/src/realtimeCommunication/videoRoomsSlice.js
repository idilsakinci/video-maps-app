import { createSlice } from "@reduxjs/toolkit";

// * Bu objede, WebRTC tabanlı bir video konferans uygulaması için gerekli olan bazı durumlar yer almaktadır.
// * inRoom: Kullanıcının bulunduğu oda ID'si. 
// * rooms: Mevcut odaların bir listesi.
// * localStream: Kullanıcının kendi kamerasıdan aldığı akışı temsil eden MediaStream objesi.
// * remoteStream: Kullanıcının diğer kullanıcılardan aldığı akışları temsil eden MediaStream objesi.
// * isMicOn: Kullanıcının mikrofonunun açık mı kapalı mı olduğunu gösteren bir boolean değer.
// * isCameraOn: Kullanıcının kamerasının açık mı kapalı mı olduğunu gösteren bir boolean değer.
const initialState = {
    inRoom: null, 
    rooms: [],

    localStream: null,
    remoteStream: null,

    isMicOn: true,
    isCameraOn: true,
};

// * Bu kod bloğu, Redux Toolkit'in createSlice fonksiyonu ile oluşturulan bir videoRooms slice'ı tanımlar. 
// * Bu slice, video konferans uygulamasındaki odaları yönetir.
// * initialState, slice'ın başlangıç durumunu tanımlar. 
// * Reducers objesi, slice'ın durumunu güncellemek için kullanılan fonksiyonları içerir. Bu projede, 
export const videoRoomsSlice = createSlice({
    name: "videoRooms",
    initialState,
    reducers: {
        setInRoom: (state, action) => {
            state.inRoom = action.payload;
        },
        setRooms: (state, action) => {
            state.rooms = action.payload;
        },
        setLocalStream: (state, action) => {
            state.localStream = action.payload;
        },
        setRemoteStream: (state, action) => {
            state.remoteStream = action.payload;
        },
        setIsMicOn: (state, action) => {
            state.isMicOn = action.payload;
        },
        setIsCameraOn: (state, action) => {
            state.isCameraOn = action.payload;
        },
    },
});

export const { setInRoom, setRooms, setLocalStream, setRemoteStream, setIsMicOn,
    setIsCameraOn } = videoRoomsSlice.actions;

export default videoRoomsSlice.reducer;