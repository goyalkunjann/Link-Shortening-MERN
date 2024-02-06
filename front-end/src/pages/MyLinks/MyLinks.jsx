import SnackBar from "awesome-snackbar";
import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import ErrorPage from "../../components/Error/ErrorPage";
import NotAuthenticated from "../../components/NotAuthenticated/NotAuthenticated";
import AuthContext from "../../contexts/AuthContext";
import getSnackBarStyles from "../../entities/snackBarStyles";
import "./MyLinks.css";

export default function MyLinks() {
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [links, setLinks] = useState([]);

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/link/user", {
                headers: {
                    Authorization: "Bearer " + auth?.accessToken,
                },
                withCredentials: true,
            });
            const data = res.data;
            setLinks(data);
        } catch (error) {
            console.log(error);
            setError(true)
            return new SnackBar(
                error?.response?.data?.message || "Could Not Get Your Links",
                {
                    position: "bottom-right",
                    style: getSnackBarStyles(true),
                }
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchLinks();
    }, []);

    const copyToClipboard = (value) => {
        console.log(value);
        navigator.clipboard.writeText(value);
        return new SnackBar("Copied To Clipboard", {
            position: "bottom-right",
            style: getSnackBarStyles(false),
        });
    };

    const deleteLink = async (id) => {
        try {
            const res = await axios.delete("/link/" + id, {
                headers: {
                    Authorization: "Bearer " + auth?.accessToken,
                },
                withCredentials: true,
            });
            const data = res.data;
            fetchLinks();
            return new SnackBar("Link Deleted SuccessFully", {
                position: "bottom-right",
                style: getSnackBarStyles(false),
            });
        } catch (error) {
            return new SnackBar(
                error?.response?.data?.message || "Could Not Delete Your Link",
                {
                    position: "bottom-right",
                    style: getSnackBarStyles(true),
                }
            );
        }
    };

    if (error){
        return <ErrorPage />
    }

    return (
        <div className="my_links">
            <table>
                <thead style={{ borderTop: "4px solid #00ff93" }}>
                    <tr>
                        <td>Link</td>
                        <td>URL</td>
                        <td>Views</td>
                        <td>Details</td>
                    </tr>
                </thead>
                <tbody>
                    {links.map((link) => {
                        return (
                            <tr>
                                <td>{link.url}</td>
                                <td
                                    onClick={() => {
                                        copyToClipboard(
                                            import.meta.env
                                                .VITE_BACKEND_SERVER + '/'+
                                                link.shortenedUrl
                                        );
                                    }}
                                >
                                    {import.meta.env.VITE_BACKEND_SERVER + '/'+
                                        link.shortenedUrl}
                                </td>
                                <td>{link.views.length}</td>
                                <td
                                    style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                        color: "rgb(0, 255, 219)",
                                    }}
                                >
                                    <Link to={"/link/" + link._id}>
                                        <i
                                            class="fa-solid fa-chart-simple"
                                            style={{ marginInline: "1rem" }}
                                        >
                                        </i>
                                    </Link>
                                    <i
                                        class="fa-regular fa-trash-can"
                                        style={{
                                            marginInline: "1rem",
                                            color: "red",
                                        }}
                                        onClick={() => {
                                            deleteLink(link._id);
                                        }}
                                    >
                                    </i>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button
                className="btn-primary"
                type="submit"
                disabled={loading}
                onClick={fetchLinks}
            >
                {loading ? (
                    <i className="fa-solid fa-rotate rotate"></i>
                ) : (
                    "Refresh"
                )}
            </button>
        </div>
    );
}
