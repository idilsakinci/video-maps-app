import * as socketConn from "../../socketConnection/socketConn";

// * socketConn modülünden login fonksiyonunu kullanarak kullanıcı girişi işlemini gerçekleştirir.
export const proceeWidthLogin=(data)=>{
    socketConn.login(data);
};