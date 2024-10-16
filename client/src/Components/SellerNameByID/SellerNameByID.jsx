import { useEffect, useState } from "react";
import api from "../../api/api";

function SellerNameByID({sellerID}) {

const [sellerName, setSellerName] = useState()

useEffect(() => {
    getSellerName()
},[])

async function getSellerName(){
    try {
        const response = await api('GET', `/user/nameById/${sellerID}`);
        const backendMsg = await response.json();
    
        
        if(backendMsg.success == true){
            setSellerName(backendMsg.username)
            return backendMsg.username
        } else{
            console.log("Falha ao carregar informações do vendedor")
            setSellerName("Error")
        }
    } catch (error) {
        console.log("Falha na requisição dos dados do vendedor")
    }
}

  return (
    <p>{sellerName}</p>
  );
}

export default SellerNameByID;