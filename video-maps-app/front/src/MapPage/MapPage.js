import React from "react";
import GoogleMapReact from "google-map-react";
import { useSelector } from "react-redux";

import Marker from "./Marker";
import UserInfoCard from "./UserInfoCard/UserInfoCard";
import Messenger from "../Messenger/Messenger";
import VideoRooms from "../VideoRooms/VideoRooms";

import "./MapPage.css";

const MapPage = () => {
    // * Değişkenler state.map içindeki ilgili alanlara erişilerek Redux store'dan alınır.
    const myLocation = useSelector((state) => state.map.myLocation);
    const onlineUsers = useSelector((state) => state.map.onlineUsers);
    const cardChosenOption = useSelector((state) => state.map.cardChosenOption);

    // * Google Maps API'sında kullanılacak varsayılan harita özelliklerini belirlemek için kullanılır. 
    // * myLocation değerini haritanın merkezi olarak ayarlar.
    const defaultMapProps = {
        center: {
            lat: myLocation.lat,
            lng: myLocation.lng,
        },
        zoom: 11,
    };

    // * Google Haritalar API'ı ile etkileşim kurarak bir harita görüntüler.
    // * onlineUsers dizisi, haritada gösterilen çevrimiçi kullanıcıların bilgilerini içerir. 
    // * Her kullanıcı için bir Marker bileşeni oluşturur.
    // * Mesajlaşma özelliği sağlar. UserInfoCard kullanıcının bilgilerini gösteren bileşeni etkinleştirir.
    // * Kart içinde kullanıcının koordinatı hakkında bilgi bulunur.
    // * Video sohbet özelliğini sağlar.
    return (
        <div className="map_page_container">

            <GoogleMapReact bootstrapURLKeys={{ key: "" }} defaultCenter={defaultMapProps.center}
                defaultZoom={defaultMapProps.zoom}>
                {onlineUsers.map(onlineUser => {
                    return (
                        <Marker lat={onlineUser.coords.lat} lng={onlineUser.coords.lng}
                            key={onlineUser.socketId} myself={onlineUser.myself} socketId={onlineUser.socketId}
                            username={onlineUser.username} coords={onlineUser.coords} />
                    );
                })}
            </GoogleMapReact>

            <Messenger />
            {cardChosenOption && <UserInfoCard socketId={cardChosenOption.socketId}
                username={cardChosenOption.username} userLocation={cardChosenOption.coords} />}

            <VideoRooms />
        </div>
    );
};

export default MapPage;