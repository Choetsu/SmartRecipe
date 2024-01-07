import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [firstname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const register = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:3000/users/register`,
                {
                    email,
                    password,
                    firstname,
                    lastname,
                }
            );

            if (response.status === 201) {
                const data = response.data;
                localStorage.setItem("userId", data.id);
                window.location = "/login";
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Inscription
                </h1>
                <form onSubmit={register} className="space-y-4">
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

                    <div>
                        <label
                            htmlFor="firstname"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Prénom
                        </label>
                        <input
                            type="text"
                            id="firstname"
                            value={firstname}
                            onChange={(event) =>
                                setFirstname(event.target.value)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="lastname"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nom
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            value={lastname}
                            onChange={(event) =>
                                setLastname(event.target.value)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                        disabled={loading}
                    >
                        {loading ? "Inscription..." : "S'inscrire"}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Vous avez déjà un compte ?{" "}
                    <Link
                        to="/login"
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Connectez-vous
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
