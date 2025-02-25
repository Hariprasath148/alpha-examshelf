import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/login.css";
import gnc_logo from "../assets/images/login/gnc.png";
import gnc_banner from "../assets/images/login/main-backdrop.png";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import baseURL from "../constant/constant.js";
import { toast } from 'react-hot-toast';

export const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const queryClient = useQueryClient();

  const { mutate: login, isPending, isError, error } = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
    },
    onSuccess: () => {
      toast.success('Login Successfully');
      queryClient.invalidateQueries({
        queryKey: ["authStaff"]
      });
    }
  });

  function handleLogin(event) {
    event.preventDefault();
    login(formData);
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="login-main-container w-100 vh-100 row m-0">
        <div className="login-form-container d-flex justify-content-center align-items-start flex-column vh-100 p-4 col-12 col-sm-5 col-lg-3">
          <div className='d-flex justify-content-center align-items-center w-100'>
            <img id='clg-logo' src={gnc_logo} alt="" />
          </div>
          <div className="header h2 mb-4 text-center">Log in to your account</div>
          <form className='w-100' onSubmit={handleLogin}>
            <div className="mb-3 form-group">
              <label htmlFor="email" className='mb-2'>Enter your email:</label>
              <input type="text" className="form-control mb-2" id="email" name='email' onChange={handleInputChange} aria-describedby="staffhelp" autoComplete="username" />
              <div id='staffhelp' className='form-text'>Example: example@domain.com</div>
            </div>
            <div className="mb-2 form-group">
              <label htmlFor="staffpassword" className='mb-2'>Enter your password:</label>
              <input type="password" className="form-control" id="staffpassword" name='password' onChange={handleInputChange} aria-describedby="staffhelp" autoComplete="current-password" />
            </div>
            {isError && <div className='error-text mb-3 text-decoration-underline text-danger'>{error.message}</div>}
            <div className='form-group mt-3'>
              <button type='submit' id='login-btn' className='btn text-center px-3'>{isPending ? "Loading" : "Login"}</button>
            </div>
          </form>
        </div>
        <div className='login-banner vh-100 col-9 col-sm-7 col-lg-9 p-0'>
          <img className='w-100 h-100' src={gnc_banner} alt="" />
        </div>
      </div>
    </>
  );
};
