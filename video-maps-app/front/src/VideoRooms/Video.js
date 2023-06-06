import React, { useRef, useEffect } from 'react'

// * Bir video öğesi oluşturur ve öğeye bir stream öğesi atar. 
// * useRef kancası, video öğesini yakalamak için kullanılır ve useEffect kancası, video öğesi hazır olduğunda
// * stream öğesinin atanmasını ve video oynatmanın başlamasını sağlar.
// * stream öğesi, bir WebRTC bağlantısı aracılığıyla elde edilen akışı temsil eder. 
// * videoEl bir ref değişkenidir ve video öğesini içinde saklar. useEffect içinde, video öğesi hazır olduğunda,
// * srcObject öğesine stream atanır ve ardından video oynatılır.
const Video = ({ stream, muted }) => {

    const videoEl = useRef();

    useEffect(() => {
        const video = videoEl.current;
        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
            video.play();
        };
    }, [stream]);

    return (
        <div className="map_page_v_rooms_video_container">
            <video ref={videoEl} width="98%" height="98%" playsInline autoPlay muted={muted} />
        </div>
    )
}

export default Video
