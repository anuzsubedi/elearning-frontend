import React from "react";
import styles from "./Dialog.module.css";

const Dialog = ({ message, type, onClose }) => {
  return (
    <div className={styles.backdrop}>
      <div className={`${styles.dialog} ${styles[type]}`}>
        <p>{message}</p>
        <button onClick={onClose} className={styles.closeBtn}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Dialog;
