import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form className={styles.form}>
        <input type="email" placeholder="Email" className={styles.input} />
        <div className={styles.passwordContainer}>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className={styles.input}
          />
          <FontAwesomeIcon
            icon={passwordVisible ? faEyeSlash : faEye}
            className={styles.icon}
            onClick={() => setPasswordVisible(!passwordVisible)}
          />
        </div>
        <button className={styles.button}>Login</button>
      </form>
      <p>
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")} className={styles.link}>
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;
