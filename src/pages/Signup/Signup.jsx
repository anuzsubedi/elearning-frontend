import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "../../components/Dialog";
import { signup, checkEmail } from "../../services/signupService";
import styles from "./Signup.module.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false); // Track redirect condition
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = async (email) => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    setIsCheckingEmail(true);
    const result = await checkEmail(email);
    setIsCheckingEmail(false);

    if (result.exists) {
      setEmailError(result.message);
    } else {
      setEmailError("");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (emailError) {
      setDialog({
        message: "Fix email errors before submitting.",
        type: "error",
      });
      return;
    }

    const result = await signup(formData);
    setDialog({
      message: result.message,
      type: result.success ? "success" : "error",
    });

    if (result.success) {
      setRedirectToLogin(true);
    }
  };

  const closeDialog = () => {
    setDialog(null);
    if (redirectToLogin) {
      navigate("/login");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign up to NextAcademy</h1>
      <form onSubmit={handleSignup} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
          {isCheckingEmail && <p className={styles.info}>Checking email...</p>}
          {emailError && <p className={styles.error}>{emailError}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        <button
          type="submit"
          className={styles.createAccountBtn}
          disabled={emailError || isCheckingEmail}
        >
          Create Account
        </button>
      </form>
      <p className={styles.signinText}>
        Already have an account?{" "}
        <span className={styles.signinLink} onClick={() => navigate("/login")}>
          Login
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

export default Signup;
