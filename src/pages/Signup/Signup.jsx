import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Sign up to NextAcademy</h1>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className={styles.input} required />
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
        <button type="submit" className={styles.createAccountBtn}>
          Create Account
        </button>
      </form>
      <p className={styles.signinText}>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} className={styles.signinLink}>
          Sign In
        </span>
      </p>
    </div>
  );
};

export default Signup;
