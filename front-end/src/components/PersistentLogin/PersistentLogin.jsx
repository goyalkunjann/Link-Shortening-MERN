import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useContext } from "react";
import axios from "../../api/axios";
import getSnackBarStyles from "../../entities/snackBarStyles";
import SnackBar from "awesome-snackbar";

export default function PersistentLogin() {
    const { setAuth } = useContext(AuthContext);
    const [loading,setLoading] = useState(true)
    useEffect(() => {
        const refresh = async () => {
            try {
                const res = await axios.post(
                    "/auth/refresh",
                    {},
                    {
                        withCredentials: true,
                    }
                );
                const data = res.data;
                setAuth({
                    username: data.username,
                    accessToken: data.accessToken,
                });
            } finally {
                setLoading(false)
            }
        };
        // setTimeout(refresh,5000)
        refresh();
    }, []);

    return <>{loading ? (
        <div style={{width: '100vw', height: '100vh',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
            <i className="fa-solid fa-rotate rotate" style={{fontSize: "3rem",color: "#00ff93"}}></i>
        </div>
        ) : <Outlet />}</>;
}
