import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import './Login.css';  // Custom CSS for styling

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPassword: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate=useNavigate()

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

  
    //Handle form submission (Login or Signup)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin
            ? 'http://localhost:4000/api/user/login'
            : 'http://localhost:4000/api/user/register';
        
        const body = isLogin
            ? { userEmail: formData.userEmail, userPassword: formData.userPassword }
            : { userName: formData.userName, userEmail: formData.userEmail, userPassword: formData.userPassword };

        try{
          const response = await axios.post(url, body, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          if (response.status === 200 || response.status === 201) {
            if (isLogin) {
                if (response.data.token) {
                  console.log(response.data)
                    localStorage.setItem('authToken', response.data.token);
                    navigate(`/userDashboard/${response.data.user._id}`);
                }
            } else {
                setSuccessMessage('Registration successful! Please log in.');
                setFormData({ userName: '', userEmail: '', userPassword: '' }); // Clear form
            }
        }
        } catch (error) {
            setErrorMessage('Something went wrong, please try again.');
        }
    };

    // Toggle between login and signup forms
    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({ userName: '', userEmail: '', userPassword: '' }); // Clear fields on toggle
        setErrorMessage(''); // Clear error message on toggle
    };

    return (
        <div className="login-page m-4">
            <div className="form-container">
                <h2 className="form-title">{isLogin ? 'Login' : 'Signup'}</h2>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Render Login Form or Signup Form based on isLogin state */}
                    {!isLogin && (
                        <>
                            <label>Name</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                placeholder="Enter your name"
                                onChange={handleInputChange}
                                required
                            />
                        </>
                    )}
                    <label>Email</label>
                    <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        placeholder="Enter your email"
                        onChange={handleInputChange}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        name="userPassword"
                        value={formData.userPassword}
                        placeholder="Enter your password"
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
                </form>

                <div className="toggle-text">
                    <p>{isLogin ? "Don't have an account?" : 'Already have an account?'}</p>
                    <button onClick={toggleForm} className="toggle-button">
                        {isLogin ? 'Signup here' : 'Login here'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
