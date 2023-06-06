import React from "react";

// * LoginInput tanımlanır. 
// * Kullanıcı adı girişi için kullanılan bir form alanını içerir. Bu bileşen, bir kullanıcının girdiği 
// * kullanıcı adını alır ve Parent bileşenindeki state'i güncellemek için bir handler fonksiyonu çağırır.
// * Bu şekilde, Parent bileşeni güncellenir ve yeni kullanıcı adı alanı render edilir.
const LoginInput = (props) => {
    const { username, setUsername } = props;

    const handleValueChange = (e) => {
        setUsername(e.target.value);
    };

    return (
        <input className="l_page_input" placeholder="username" value={username} onChange={handleValueChange} />
    );
};

export default LoginInput;