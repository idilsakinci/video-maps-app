import React from 'react';
import { useDispatch } from "react-redux";
import locationIcon from "../resources/images/location-icon.svg";
import { setCardChosenOption } from './mapSlice';

// * Marker adında bir bileşen tanımlar. Bu bileşen, harita üzerinde bir kullanıcıyı temsil eden bir 
// * işaretleyiciyi gösterir.
const Marker = (props) => {
    const { myself, socketId, username, coords } = props;
    const dispatch = useDispatch();

    // *  Bir kullanıcının profil kartını açar.
    const handleOptionChoose = () => {
        if (!myself) {
            dispatch(setCardChosenOption({ socketId: socketId, username: username, coords: coords, }));
        }
    };

    // * Kullancı kartı tanımlanır.
    return (
        <div className="map_page_marker_container" onClick={handleOptionChoose}>
            <img src={locationIcon} alt={username} className="map_page_marker_img" />
            <p className="map_page_marker_text">{myself ? 'Me' : username}</p>
        </div>
    );
};

export default Marker
