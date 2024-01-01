import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Recherche from "./components/Recherche";
import Recette from "./components/Recette";
import logo from "./assets/logo.png";


function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
                <img src={logo}  alt="logo" />
            </li>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/recette">Recettes Enregistrées</Link>
            </li>
          </ul>
        </nav>

        <Routes>
            <Route path="/" element={<Recherche />} />
            <Route path="/recette" element={<Recette />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;