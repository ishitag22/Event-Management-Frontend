import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styles from '../Feedback/FeedbackForm.module.css';
import sty from '../Login/Login.css';
import { toast } from 'react-toastify';
import { AlignCenter } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [globalError, setGlobalError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ? ""
            : "Please enter a valid email address.";
    
    const validatePassword = (password) =>
        password.length >= 8 ? "" : "Password must be at least 8 characters.";



    const handleLogin = async (e) => {
        e.preventDefault();
        setGlobalError("");
        setShowErrors(true);

        const emailError = validateEmail(email);
        const passError = validatePassword(password);

        if (emailError || passError) {
            setErrors({ email: emailError, password: passError });
            setGlobalError("Please fix the errors in the form.");
            return;
        }
        
        setErrors({});

        try {
            const response = await axios.post(
                "https://localhost:7283/api/Users/login",
                { email, password }
            );
            const { token, role, userId } = response.data;

            login(token, role, userId);
            
            toast.success("Login successful!", {
              position: 'top-center'
              
            });
            const from = location.state?.from || "/dashboard";
            navigate(from);
        } catch (err) {
            console.error(err);
            setGlobalError("Login failed. Check your email and password.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        const emailError = validateEmail(resetEmail);
        if (emailError) {
            toast.error(emailError);
            return;
        }

        const passError = validatePassword(newPassword);
        if (passError) {
            toast.error(passError);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.put("https://localhost:7283/api/Users/reset-password", { 
                Email: resetEmail, 
                NewPassword: newPassword,
                ConfirmPassword: confirmPassword
            });
            setResetSuccess(true);
            setEmail(resetEmail);
            setTimeout(() => {
                setShowResetModal(false);
                setResetEmail("");
                setNewPassword("");
                setConfirmPassword("");
                setResetSuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Reset password error:', err);
            let errorMsg = "Failed to reset password. Please try again.";
            
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMsg = err.response.data;
                } else if (err.response.data.errors) {
                    const errors = err.response.data.errors;
                    const firstError = Object.values(errors)[0];
                    errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
                } else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                } else if (err.response.data.title) {
                    errorMsg = err.response.data.title;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }
            
            toast.error(errorMsg, {
                position: 'top-center',
                autoClose: 4000,
                hideProgressBar: false
            });
        }
    };

    return (
      <div className="authBackground">
         <div className="welcome-box">
         <h1>Welcome to <span>SIMBA Events</span></h1>
         <p>Explore, manage, and create unforgettable experiences.</p>
        </div>
        
        {!showResetModal ? (
            <div className={`${styles.container} auth-card`} style={{ maxWidth: '400px', marginTop: '50px' }}>
                <h2>Login</h2>
                {globalError && <p style={{ color: 'red', textAlign: 'center' }}>{globalError}</p>}
                
                <form onSubmit={handleLogin} className={styles.form}>
                
                    {showErrors && errors.email && <small style={{ color: 'red', display: 'block', marginBottom: '5px' }}>{errors.email}</small>}
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={styles.inputField}
                        required
                    />

                    {showErrors && errors.password && <small style={{ color: 'red', display: 'block', marginBottom: '5px', marginTop: '10px' }}>{errors.password}</small>}
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className={styles.inputField}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className={styles.primaryButton}>Login</button>
                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button 
                            type="button" 
                            onClick={() => setShowResetModal(true)}
                            style={{ background: 'none', border: 'none', color: 'var(--simba-orange-dark)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                        >
                            Forgot Password?
                        </button>
                    </p>
                    <p style={{ textAlign: 'center' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--simba-orange-dark)' }}>Sign up</Link>
                    </p>
                </form>
            </div>
        ) : (
            <div className={`${styles.container} auth-card`} style={{ maxWidth: '450px', marginTop: '50px' }}>
                <h2>Reset Password</h2>
                {resetSuccess ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p style={{ color: '#28a745', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>✓ Password reset successfully!</p>
                        <p style={{ color: '#666' }}>Please login with your new password.</p>
                    </div>
                ) : (
                    <>
                        <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>Enter your email and new password to reset your account.</p>
                        <form onSubmit={handleResetPassword} className={styles.form}>
                    <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Email"
                        className={styles.inputField}
                        autoComplete="email"
                        required
                    />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password (min 8 characters)"
                        className={styles.inputField}
                        autoComplete="new-password"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className={styles.inputField}
                        autoComplete="new-password"
                        required
                    />
                            <div className="reset-buttons" styles={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                <button type="submit" className="reset-btn">Reset Password</button>
                                <button type="button" className="reset-btn" onClick={() => { setShowResetModal(false); setResetEmail(""); setNewPassword(""); setConfirmPassword(""); }}>Back to Login</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        )}
        
      </div>
    );
};

export default Login;