import { createSlice } from "@reduxjs/toolkit";

// * myLocation özelliği, kullanıcının konumunu içeren bir nesne olarak tanımlanır. onlineUsers özelliği, 
// * harita üzerindeki diğer çevrimiçi kullanıcıları içeren bir dizi olarak tanımlanır. cardChosenOption 
// * özelliği, bir kullanıcının profil kartının açık olup olmadığını belirleyen bir nesne olarak tanımlanır.
const initialState = {
    myLocation: null,
    onlineUsers: [],
    cardChosenOption: null,
};

// * Slice'ın reducers özelliği altında dört fonksiyon tanımlanmıştır. 
// * setMyLocation: myLocation özelliğini ayarlar
// * setOnlineUsers: onlineUsers özelliğini ayarlar
// * removeDisconnectedUser: Verilen action.payload'a sahip kullanıcıyı onlineUsers listesinden çıkarır
// * setCardChosenOption: cardChosenOption özelliğini ayarlar
export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setMyLocation: (state, action) => {
            state.myLocation = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        removeDisconnectedUser: (state, action) => {
            state.onlineUsers = state.onlineUsers.filter((onlineUser) => onlineUser.socketId !== action.payload);
        },
        setCardChosenOption:(state, action) => {
            state.cardChosenOption = action.payload;
        },
    },
});

// * mapSlice.actions bir obje döndürür. 
export const { setMyLocation, setOnlineUsers, removeDisconnectedUser, setCardChosenOption } = mapSlice.actions;

export default mapSlice.reducer;