import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export function AdminRoute ({children}){
    const {user , loading } = useAuth();

    if(loading ) return null;

    if(!user || user.role !== "ADMIN"){
        return <Navigate to="/" replace/>;
    }

    return children;
}