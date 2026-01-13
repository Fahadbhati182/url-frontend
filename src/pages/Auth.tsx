import { useState } from "react";
import { useAppContext } from "../context/AppContext";

type Mode = "login" | "register";

const Auth = () => {

  const { loginUser, registerUser } = useAppContext();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        loginUser(email, password);
        
      } else {
        registerUser(name, email, password);
      }
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[380px] p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        {mode === "register" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Register"}
        </button>

        <p className="text-sm text-center mt-4">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
            className="ml-1 text-blue-600 cursor-pointer"
          >
            {mode === "login" ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
