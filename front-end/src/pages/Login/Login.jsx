import React, { useContext, useState } from "react";
import SnackBar from "awesome-snackbar";
import CoverImage from "../../assets/Cover.png";
import AuthContext from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "../authStyles.css";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let isError = await login(email,password,setLoading);
        if (!isError) navigate("/");
    };

    return (
        <section className="auth">
            <h1 className="auth-header">G Shortly</h1>
            <div className="auth-form">
                <img
                    src={CoverImage}
                    alt="Cover Image"
                    className="auth-image"
                />
                <form onSubmit={handleSubmit}>
                    <div className="auth-text">Sign In</div>
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
                            "Sign In"
                        )}
                    </button>
                    <div className="input-info">
                        <Link to="/register">Dont have an account?</Link>
                        <Link to="/">Continue without account</Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
