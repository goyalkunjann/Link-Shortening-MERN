import { useContext, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import "./App.css";
import MyLinks from "./pages/MyLinks/MyLinks";
import AuthContext from "./contexts/AuthContext";
import PersistentLogin from "./components/PersistentLogin/PersistentLogin";
import LinkDetails from "./pages/LinkDetails/LinkDetails";
import Page404 from "./components/404/404";
import NotAuthenticated from "./components/NotAuthenticated/NotAuthenticated";


function App() {
    const url="https://link-shortening-mern-backend-yt.onrender.com";
    const [count, setCount] = useState(0);
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="app">
            <Routes>
                <Route element={<PersistentLogin />}>
                    <Route
                        path="/"
                        element={
                            <>
                                <Header />
                                <Main />
                            </>
                        }
                    ></Route>

                    <Route
                        path="/my_links"
                        element={
                            <>
                                <Header />
                                {auth.username ? (
                                    <MyLinks />
                                ) : (
                                    <NotAuthenticated/>
                                )}
                            </>
                        }
                    ></Route>
                    <Route
                        path="/link/:id"
                        element={
                            <>
                                <Header />
                                {auth.username ? (
                                    <LinkDetails />
                                ) : (
                                    <NotAuthenticated/>
                                )}
                            </>
                        }
                    ></Route>
                </Route>

                <Route element={<Login />} path="/login" />
                <Route element={<Register />} path="/register" />
                <Route
                    element={
                        <>
                            <Header />
                            <Page404 />
                        </>
                    }
                    path="/*"
                />
            </Routes>
        </div>
    );
}

export default App;
