import React from 'react';
import ChatButton from "./ChatButton";

// * ActionButtons bileşenini tanımlar. Bu bileşen, ChatButton bileşenini kullanır ve props parametresi 
// * aracılığıyla diğer bileşenlere iletilen özelliklerin yanı sıra ChatButton bileşenine de bu 
// * özellikleri ileterek kullanır.
const ActionButtons = (props) => {
  return (
    <div className="map_page_card_buttons_container">
      <ChatButton {...props}/>
    </div>
  );
};

export default ActionButtons;