import React, { useState, useEffect } from "react";
import "../style/Login.css";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedEmail = "";
        const savedPassword = "";

        setEmail(savedEmail);
        setPassword(savedPassword);
    }, []);

    const login = async () => {
        setLoading(true);

        // try {
        //     const response = await fetch("http://localhost:5000/login", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ email, password }),
        //     });

        //     const data = await response.json();

        //     if (data.status === "ok") {
        //         console.log("Connecté");
        //     } else {
        //         console.log("Erreur");
        //     }
        // } catch (error) {
        //     console.error("Erreur lors de la connexion:", error);
        // } finally {
        //     setLoading(false);
        // }
    }
    
    return (
        <div className="Login">
            <h1>Connexion</h1>
            <form onSubmit={login}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <label htmlFor="password">Mot de passe</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button type="button">
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </div>
    );
}

export default Login;