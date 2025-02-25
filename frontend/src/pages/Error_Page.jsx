import React from 'react';
import "../style/error.css";
import error_img from "../assets/images/error/error.png";
import {NavLink} from "react-router-dom";

export const Error_Page = () => {
  return (
    <>
      <div className="row m-0 align-items-center justify-content-center vh-100">
        <div className="col-12 col-sm-8 col-lg-6 d-flex flex-column align-items-center justify-content-center p-3">
          <img src={error_img} alt="Error Image"  id="error-image" />
          <p className="h3 text-center mb-2">We Can't find the page you're looking for.</p>
          <p className="text-center text-muted mb-4">Page not found.It may have been moved,renamed,or temporarily uunavailable.Please check the URL or go back home.</p>
          <NavLink to="/" id="home-button" className="px-5 py-2 rounded">Back to Home</NavLink>
        </div>
      </div>
    </>
  )
}
