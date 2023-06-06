import React from "react";

// *  LoginButton bileşeni oluşturur. 
const LoginButton = ({ onClickHandler, disabled }) => {
    return (
        <button disabled={disabled} className="l_page_login_button" onClick={onClickHandler}>Login</button>
    );
};

export default LoginButton;