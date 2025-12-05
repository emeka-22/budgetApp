import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiUrl from '../../constants/apiUrl';


const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    const registerUrl = `${apiUrl}/auth/register`;
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      //reshaping the data from the form to fit the API requirements
      const data = {
        name: formData.fullname,
        email: formData.email,
        password: formData.password,
      }

      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json();
        // Show specific validation errors if available
        if (errorData.errors && errorData.errors.length > 0) {
          const errorMessages = errorData.errors.map(err => err.msg).join(', ');
          throw new Error(errorMessages);
        } else if (errorData.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error('Failed to create account. Please try again.');
        }
      }

      const responseData = await response.json();
      // console.log(responseData);

      //update the auth state
      login(responseData.user, responseData.token);

      // Navigate to the dashboard or another page after successful signup
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-requirements" style={{
              backgroundColor: '#e3f2fd',
              border: '1px solid #2196f3',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '10px',
              fontSize: '0.875rem',
              color: '#1565c0'
            }}>
              <strong>Password must contain:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>At least 8 characters</li>
                <li>One uppercase letter (A-Z)</li>
                <li>One lowercase letter (a-z)</li>
                <li>One number (0-9)</li>
                <li>One special character (e.g., !, @, #, $, %, /, etc.)</li>
              </ul>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="8"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;