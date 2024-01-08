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
                <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
                    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/">
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="h-14 border-2 border-blue-500 rounded-full"
                                />
                            </Link>
                        </div>

                        <div className="flex items-center space-x-6">
                            <Link
                                to="/"
                                className="text-gray-800 hover:text-blue-600 transition duration-300"
                            >
                                Accueil
                            </Link>
                            <Link
                                to="/recettes"
                                className="text-gray-800 hover:text-blue-600 transition duration-300"
                            >
                                Recettes
                            </Link>
                            <Link
                                to="/recettes-saisonnieres"
                                className="text-gray-800 hover:text-blue-600 transition duration-300"
                            >
                                Recettes saisonnières
                            </Link>
                            {isLoggedIn && (
                                <Link
                                    to="/favoris"
                                    className="text-gray-800 hover:text-blue-600 transition duration-300"
                                >
                                    Favoris
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            {isLoggedIn ? (
                                <Link
                                    onClick={() => {
                                        localStorage.removeItem("userId");
                                        setIsLoggedIn(false);
                                    }}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                                >
                                    Déconnexion
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
                                    >
                                        Inscription
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="pt-18">
                    <Routes>
                        <Route path="/" element={<Recherche />} />
                        <Route path="/recettes" element={<Recette />} />
                        <Route
                            path="/login"
                            element={<Login setIsLoggedIn={setIsLoggedIn} />}
                        />
                        <Route
                            path="/recettes-details/:id"
                            element={
                                <RecetteDetails setIsLoggedIn={setIsLoggedIn} />
                            }
                        />
                        <Route path="/favoris" element={<Favoris />} />
                        <Route
                            path="/recettes-saisonnieres"
                            element={<Seasons />}
                        />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
