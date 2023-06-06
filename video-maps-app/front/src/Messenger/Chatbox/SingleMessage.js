import React from 'react'

// *  Bir sohbet kutusunda gösterilecek olan bir mesajın görünümünü tanımlayan üç bileşen içerir.

// * Sağ tarafta görünecek mesajı oluşturur.
const RightMessage = ({ content }) => {
    return (
        <p className="chatbox_message_right">{content}</p>
    );
};

// * Sol tarafta görünecek mesajı oluşturur.
const LeftMessage = ({ content }) => {
    return (
        <p className="chatbox_message_left">{content}</p>
    );
};

// *  Hem sağ hem de sol mesaj bileşenlerini içeren bir öğeyi tasvir eder ve myMessage özelliğine 
// * bağlı olarak mesajın sahibini belirler. Eğer myMessage özelliği true olarak belirlenirse mesaj 
// * sağda görünür, aksi halde mesaj sol tarafta görüntülenir.
const SingleMessage = ({ content, myMessage }) => {
    return (
        <div className="chatbox_message_wrapper" style={myMessage ? { justifyContent: "flex-end" }
            : { justifyContent: "flex-start" }}>
            {myMessage ? <RightMessage content={content} /> : <LeftMessage content={content} />}
        </div>
    )
};

export default SingleMessage
