import "./Header.css";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthContext";

export default function Header() {
    const { auth, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    return (
        <header className="header">
            <Link to="/" className="head-text">
            LinkSwift
            </Link>
            <div className="left-section">
                {auth?.username ? (
                    <>
                        <nav className="nav">
                            <ul className="nav-list">
                                <li className="nav-item">
                                    <NavLink
                                        to="/"
                                        className={(activeClass) =>
                                            activeClass.isActive
                                                ? "active-item item"
                                                : "item"
                                        }
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/my_links"
                                        className={(activeClass) =>
                                            activeClass.isActive
                                                ? "active-item item"
                                                : "item"
                                        }
                                    >
                                        My Links
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                        <Link onClick={() => {logout(setLoading)}} className="btn-primary" disabled={loading}>
                            {loading ? (
                                <i className="fa-solid fa-rotate rotate"></i>
                            ) : (
                                "Log out"
                            )}
                        </Link>
                    </>
                ) : (
                    <Link to="/login" className="btn-primary">
                        Sign In
                    </Link>
                )}
            </div>
        </header>
    );
}
