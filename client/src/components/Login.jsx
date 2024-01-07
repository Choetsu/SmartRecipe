import { useState } from "react";
import axios from "axios";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:4000/users/login`,
                {
                    email,
                    password,
                }
            );

            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem("userId", data.id);
                setIsLoggedIn(true);
                window.location = "/";
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Connexion
                </h1>
                <form onSubmit={login} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            loading
                                ? "bg-blue-400"
                                : "bg-blue-600 hover:bg-blue-700"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    <span className="text-gray-500">
                        Vous n'avez pas de compte ?
                    </span>
                    <a
                        href="/register"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        S'inscrire
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
