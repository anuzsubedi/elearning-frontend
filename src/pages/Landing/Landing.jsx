import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Welcome to Next Academy</h1>
      <button className={styles.button} onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
};

export default Landing;
