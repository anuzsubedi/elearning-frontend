import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Dialog from "../../components/Dialog";
import styles from "./Landing.module.css";

const Landing = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [dialog, setDialog] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // Clear user data
    setDialog({ message: "You have been logged out.", type: "success" });
  };

  const closeDialog = () => {
    setDialog(null);
    navigate("/"); // Stay on the landing page after logout
  };

  return (
    <div className={styles.container}>
      <h1>Welcome, {user ? user.full_name : "Guest"}!</h1>
      {user ? (
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      ) : (
        <a href="/login" className={styles.loginBtn}>
          Login
        </a>
      )}
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

export default Landing;
