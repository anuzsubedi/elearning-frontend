import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Sign in to NextAcademy</h1>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.signInBtn}>
          Sign In
        </button>
      </form>
      <p className={styles.signupText}>
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")} className={styles.signupLink}>
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;
