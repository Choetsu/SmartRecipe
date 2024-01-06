import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Recherche from "./components/Recherche";
import Recette from "./components/Recette";
import Login from "./components/Login";
import logo from "./assets/logo.png";
import RecetteDetails from "./components/RecetteDetails";
import Favoris from "./components/Favoris";

function App() {
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
                            <Link to="/favoris">Favoris</Link>
                        </li>
                        <li>
                            <Link to="/login">Connexion</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Recherche />} />
                    <Route path="/recette" element={<Recette />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/recipe-details/:id"
                        element={<RecetteDetails />}
                    />
                    <Route path="/favoris" element={<Favoris />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
