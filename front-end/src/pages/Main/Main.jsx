import "./Main.css";
import axios from "../../api/axios";
import { useContext, useState } from "react";
import SnackBar from "awesome-snackbar";
import getSnackBarStyles from "../../entities/snackBarStyles";
import AuthContext from "../../contexts/AuthContext";

export default function Main() {
    const [url, setUrl] = useState("");
    const [link, setLink] = useState(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { auth } = useContext(AuthContext);

    const LINK_CREATE_URL = "/link/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const isValidURL = new RegExp(
            "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]+\\/?"
        );
        if (!isValidURL.test(url)) {
            setLoading(false);
            return new SnackBar("URL is not valid", {
                position: "bottom-right",
                style: getSnackBarStyles(true),
            });
        }
        if (name.includes(" ")) {
            setLoading(false);
            return new SnackBar("The Name cannot contain spaces", {
                position: "bottom-right",
                style: getSnackBarStyles(true),
            });
        }
        try {
            let data;
            if (name != "") {
                data = await axios.post(
                    LINK_CREATE_URL,
                    {
                        url: url,
                        name: name,
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + auth?.accessToken,
                        },
                        withCredentials: true
                    }
                );
            } else {
                data = await axios.post(
                    LINK_CREATE_URL,
                    {
                        url: url,
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + auth?.accessToken,
                        },
                        withCredentials: true
                    }
                );
            }
            data = data.data;

            setLink(import.meta.env?.VITE_BACKEND_SERVER + "/" + data.shortenedUrl);
            new SnackBar("Link Has Been Generated", {
                position: "bottom-right",
                style: getSnackBarStyles(false),
            });
            new SnackBar("Scroll Down To Copy The Link", {
                position: "bottom-right",
                style: getSnackBarStyles(false),
            });
        } catch (err) {
            console.log(err);
            new SnackBar(
                err?.response?.data?.message || "Sorry Some Error Occurred",
                {
                    position: "bottom-right",
                    style: getSnackBarStyles(true),
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link);
        return new SnackBar("Copied To Clipboard", {
            position: "bottom-right",
            style: getSnackBarStyles(false),
        });
    };
    return (
        <main>
            <div className="main-head">
                <h1>Shorten Your Links With</h1>
                <br />
                <span className="main-light">G Shortly</span>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="main-input-container">
                    <label for="url" className="logo-set">
                        <i class="fa-solid fa-globe"></i>
                    </label>
                    <input
                        type="text"
                        className="main-input"
                        placeholder="Enter The Url"
                        name="url"
                        id="url"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                        }}
                    />
                </div>
                <div className="main-input-container" title="optional">
                    <label for="name" className="logo-set">
                        <i class="fa-solid fa-link"></i>
                    </label>
                    <input
                        type="text"
                        className="main-input"
                        placeholder="Enter The Custom Url Name"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <div className="info">
                        <i class="fa-solid fa-circle-info" style={{cursor: "pointer"}}></i>
                        <div className="box">
                            Instead of Random links such as /LgzVdq you can use
                            your own link like /google.it can't have spaces
                        </div>
                    </div>
                </div>
                <button className="btn-primary" type="submit">
                    {loading ? (
                        <i className="fa-solid fa-rotate rotate"></i>
                    ) : (
                        "Create Link"
                    )}
                </button>
            </form>
            {link ? (
                <>
                    <div className="main-input-container copy-link">
                        <input
                            type="text"
                            className="main-input"
                            value={link}
                        />
                    </div>
                    <button className="btn-primary" onClick={copyToClipboard}>
                        Copy Link
                    </button>
                </>
            ) : null}
	   <p style={{
		marginTop: "1rem"	
	    }}>Made By <span className="main-light">KunjanGoyal/goyalkunjann</span></p>
        </main>
    );
}
