import React from "react";
import styles from "./Signup.module.css";

const Signup = () => {
  return (
    <div className={styles.container}>
      <h1>Signup</h1>
      <form className={styles.form}>
        <input type="text" placeholder="Full Name" className={styles.input} />
        <input type="email" placeholder="Email" className={styles.input} />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
        />
        <button className={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
