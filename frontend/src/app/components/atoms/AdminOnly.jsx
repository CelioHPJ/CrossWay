import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export function AdminOnly({children}){

    const { user } = useContext(AuthContext);
    
    if(user?.role === "ADMIN"){
        return children;
    }

    return null
}