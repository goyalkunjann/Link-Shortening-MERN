import React, { useState,useContext } from "react";
import { Link } from "react-router-dom";
import CoverImage from "../../assets/Cover.png";
import AuthContext from "../../contexts/AuthContext";
import "../authStyles.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { register,auth } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await register(username, email, password, setLoading);
        let isError = await login(auth.email,auth.password,setLoading);
        if (!isError) navigate("/");
    };

    return (
        <div className="auth">
            <h1 className="auth-header">G Shortly</h1>
            <div className="auth-form">
                <img
                    src={CoverImage}
                    alt="Cover Image"
                    className="auth-image"
                />
                <form onSubmit={handleSubmit}>
                    <div className="auth-text">Register</div>
                    <div className="main-input-container">
                        <label for="username" className="logo-set">
                            <i class="fa-solid fa-user"></i>
                        </label>
                        <input
                            type="text"
                            className="main-input"
                            placeholder="Enter The Username"
                            name="username"
                            id="username"
                            value={username}
                            disabled={loading}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                    </div>
                    <div className="main-input-container">
                        <label for="email" className="logo-set">
                            <i class="fa-solid fa-envelope"></i>
                        </label>
                        <input
                            type="email"
                            className="main-input"
                            placeholder="Enter The Email"
                            name="email"
                            id="email"
                            value={email}
                            disabled={loading}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div className="main-input-container">
                        <label for="password" className="logo-set">
                            <i class="fa-solid fa-key"></i>
                        </label>
                        <input
                            type="password"
                            className="main-input"
                            placeholder="Enter The Password"
                            name="password"
                            id="password"
                            value={password}
                            disabled={loading}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? (
                            <i className="fa-solid fa-rotate rotate"></i>
                        ) : (
                            "Register"
                        )}
                    </button>
                    <div className="input-info">
                        <Link to="/register">Already have an account?</Link>
                        <Link to="/">Continue without account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
