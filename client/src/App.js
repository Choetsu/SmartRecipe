import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Recherche from "./components/Recherche";
import Recette from "./components/Recette";
import Login from "./components/Login";
import logo from "./assets/logo.png";
import RecetteDetails from "./components/RecetteDetails";
import Favoris from "./components/Favoris";
import Seasons from "./components/Seasons";
import Register from "./components/Register";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        setIsLoggedIn(!!userId);
    }, []);

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <img src={logo} alt="logo" />
                        </li>
                        <li>
                            <Link to="/">Accueil</Link>
                        </li>
                        <li>
                            <Link to="/recette">Recettes</Link>
                        </li>
                        <li>
                            <Link to="/seasons">Recettes saisonnières</Link>
                        </li>
                        <li>
                            {isLoggedIn ? (
                                <Link to="/favoris">Favoris</Link>
                            ) : (
                                ""
                            )}
                        </li>
                        <li>
                            {isLoggedIn ? (
                                <Link
                                    onClick={() => {
                                        localStorage.removeItem("userId");
                                        setIsLoggedIn(false);
                                    }}
                                >
                                    Déconnexion
                                </Link>
                            ) : (
                                <Link to="/login">Connexion</Link>
                            )}
                        </li>
                        <li>
                            {isLoggedIn ? (
                                ""
                            ) : (
                                <Link to="/register">Inscription</Link>
                            )}
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Recherche />} />
                    <Route path="/recette" element={<Recette />} />
                    <Route
                        path="/login"
                        element={<Login setIsLoggedIn={setIsLoggedIn} />}
                    />
                    <Route
                        path="/recipe-details/:id"
                        element={
                            <RecetteDetails setIsLoggedIn={setIsLoggedIn} />
                        }
                    />
                    <Route path="/favoris" element={<Favoris />} />
                    <Route path="/seasons" element={<Seasons />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
