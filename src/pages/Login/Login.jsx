import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import Dialog from "../../components/Dialog";
import styles from "./Login.module.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [dialog, setDialog] = useState(null);
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(credentials);

    if (result.success) {
      loginUser(result.user);
      navigate("/");
    } else {
      setDialog({ message: result.message, type: "error" });
    }
  };

  const closeDialog = () => setDialog(null);

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.signInBtn}>
          Login
        </button>
      </form>
      <p className={styles.signupText}>
        Don’t have an account?{" "}
        <span className={styles.signupLink} onClick={() => navigate("/signup")}>
          Sign up
        </span>
      </p>
      {dialog && (
        <Dialog
          message={dialog.message}
          type={dialog.type}
          onClose={closeDialog}
        />
      )}
    </div>
  );
};

export default Login;
