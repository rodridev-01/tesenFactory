import React, { useState } from "react";
import { login } from "../services/authService"; 
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";
import { FaUser, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      alert("Ingrese usuario/email y contraseña");
      return;
    }

    setLoading(true);
    try {
      await login(usernameOrEmail, password); 
      navigate("/dashboard"); 
    } catch (err) {
      alert("Error al iniciar sesión: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-container">
    <div className="login-image-section">
      <img src="/images/banner.jpg" alt="Login visual" />
    </div>

    <div className="login-form-section">
      <img src="/images/tesen.png" alt="Logo" className="login-logo" />
      <h2>¡Hola de nuevo!</h2>

      <div className="input-icon">
        <FaUser className="icon" />
        <input
          placeholder="Usuario o Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
      </div>

      <div className="input-icon">
        <FaKey className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Cargando..." : "Iniciar Sesión"}
      </button>

      <div className="login-help-text">
        ¿Necesitas ayuda? <a href="https://www.instagram.com/tesenfactory/" target="_blank" rel="noopener noreferrer">Contáctanos</a>
      </div>
    </div>
  </div>
  );
}

export default Login;
