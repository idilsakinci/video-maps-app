import React from 'react';
import { useSelector } from 'react-redux';
import { calculateDistanceBetweenCoords } from '../../utils/location';
import ActionButtons from './ActionButtons';

// * Kullanıcı adı için bir alan tanımlar.
const Label = ({ fontSize, text }) => {
    return (
        <p className="map_page_card_label" style={{ fontSize }}>{text}</p>
    );
};

// *Bir kullanıcının adını, konumunu ve sohbet düğmesi içeren bir kart oluşturur.
const UserInfoCard = ({ username, userLocation, socketId }) => {
    const myLocation = useSelector((state) => state.map.myLocation);

    // * calculateDistanceBetweenCoords fonksiyonu kullanıcının ve kullanıcının konumunun 
    // * koordinatlarını alır ve ikisi arasındaki mesafeyi hesaplar. 
    // * Sohbet başlatmak için bir buton tanımlar.
    return (
        <div className="map_page_card_container">
            <Label text={username} fontSize="22px" />
            <Label text={`${calculateDistanceBetweenCoords(myLocation, userLocation)} km`} fontSize="18px" />
            <ActionButtons socketId={socketId} username={username} />
        </div>
    )
}

export default UserInfoCard;
