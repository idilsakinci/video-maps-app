import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMyLocation } from "../MapPage/mapSlice";
import { getFakeLocation } from "./FAKE_LOCATION";
import { connectWithSocketIOServer } from "../socketConnection/socketConn";
import { proceeWidthLogin } from "../store/actions/loginPageActions";
import { connectWithPeerServer } from "../realtimeCommunication/webRTCHandler";

// * Giriş sayfası Logo, LoginInput ve LoginButton bileşenlerini içerir.
import LoginButton from "./LoginButton";
import LoginInput from "./LoginInput";
import Logo from "./Logo";

import "./LoginPage.css";

// * Kullanıcı adının geçerli olup olmadığını kontrol eder. Geçerli bir kullanıcı adı, boşluk içermemeli, 
// * uzunluğu 0'dan büyük olmalı ve 10'dan küçük olmalıdır.
const isUsernameValid = (username) => {
    return username.length > 0 && username.length < 10 && !username.includes(" ");
};

// * Bir JavaScript nesnesidir ve getCurrentPosition() yöntemi ile birlikte kullanılırken 
// * konum verilerinin nasıl alınacağını belirtir. Ancak uygulama random konum alınacağı için şimdilik kullanılmaz.
const locationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


const LoginPage = () => {

    // * İki state tanımlanmıştır. setUsername fonksiyonu, username state'ini değiştirmek için kullanılırken,
    // * setLocationErrorOccurred fonksiyonu ise locationErrorOccurred state'ini değiştirmek için kullanılır.
    const [username, setUsername] = useState("");
    const [locationErrorOccurred, setLocationErrorOccurred] = useState(false);

    // * Redux store'da bulunan myLocation state'ini almak için kullanılır.
    const myLocation = useSelector((state) => state.map.myLocation);

    // * React Router tarafından sağlanan bir hook'tur ve rotalama yapmak için kullanılır.
    const navigate = useNavigate();
    // * Redux'ta bir aksiyonu tetiklemek için kullanılır. 
    const dispatch = useDispatch();

    // * "Login" butonuna tıklandığında çağrılır ve kullanıcının giriş işlemini gerçekleştirir.
    // * Kullanıcının adını ve konumunu içeren bir nesne alır ve bunu redux store'una kaydeder. Kullanıcının 
    // * /map yoluna yönlendirilmesi sağlanır.
    const handleLogin = () => {
        proceeWidthLogin({
            username,
            coords: {
                lng: myLocation.lng,
                lat: myLocation.lat,
            },
        });
        navigate('/map');
    };

    // * Kullanıcının konumunu tutan myLocation değişkenini günceller. Bu aksiyon, dispatch() yöntemi 
    // * aracılığıyla Redux depoya gönderilir.
    const onSuccess = (position) => {
        dispatch(setMyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        })
        );
    };

    // * Kullanıcının konumunu alırken bir hata meydana geldiğinde konsola bir hata mesajı yazdırır ve 
    // * setlocationErrorOccurred durumunu true olarak günceller.
    const onError = (error) => {
        console.log("Error occured when trying to get location!");
        console.log(error);
        setLocationErrorOccurred(true);
    };

    // * Sayfa yüklendiğinde sahte bir konum elde edip, kullanıcının konumunu günceller. 
    // * [] ifadesi ile useEffect() fonksiyon bir kez çalışır. Bu şekilde, bu fonksiyonun tekrarlanarak 
    // * gereksiz yere işlem yapmasının önüne geçilmiş olur.
    useEffect(() => {
        // * Random sahte konumlar çekildiği için gerçek konum algılama kapatılır.
        // navigator.geolocation.getCurrentPosition(onSuccess, onError, locationOptions);

        onSuccess(getFakeLocation());
    }, []);

    // * Eğer myLocation mevcut ise, connectWithSocketIOServer ve connectWithPeerServer fonksiyonları 
    // * çalıştırılır. Bir Socket.IO sunucusuna ve bir peer sunucusuna bağlanır ve gerçek zamanlı bir video
    // *  sohbeti başlatmak için kullanılır. Bu fonksiyonlar, myLocation'ın alınmasını beklememek için her
    // *  zaman çağrılabilirler, ancak myLocation undefined ise işe yaramazlar.
    useEffect(() => {
        if (myLocation) {
            connectWithSocketIOServer();
            connectWithPeerServer();
        }
    }, [
        myLocation
    ]);

    // * Logo, LoginInput, LoginButton bileşenleri çağırılır. 
    return (
        <div className="l_page_main_container">
            <div className="l_page_box">
                <Logo />
                <LoginInput username={username} setUsername={setUsername} />
                <LoginButton disabled={!isUsernameValid(username) || locationErrorOccurred}
                    onClickHandler={handleLogin} />
            </div>
        </div>
    )
};

export default LoginPage;