import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import baseURL from "../constant/constant.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email!');
      return;
    }

    setIsLoading(true);  // Show loading state

    try {
      const res = await fetch(`${baseURL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);  // Hide loading state
    }
  };

  return (
    <div>
      <form onSubmit={handleForgotPassword}>
        <label htmlFor="email">Enter your email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
