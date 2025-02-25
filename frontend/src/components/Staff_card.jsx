import { useMutation , useQueryClient } from '@tanstack/react-query'
import React from 'react'
import baseURL from '../constant/constant';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/staff_card.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { House } from 'lucide-react';
import {NavLink} from "react-router-dom";

export const Staff_card = ({ Staff }) => {

  const queryClient = useQueryClient();

  const { mutate  : logout } = useMutation({
    mutationFn : async ()=>{
      try {
        const res = await fetch(`${baseURL}/api/auth/logout`,{
          method : "POST",
          credentials : "include",
          headers : {
            "Content-Type" : "application/json"
          }
        });
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "Something Went Wrong")
        }
      }
      catch (error) {
        throw error;
      }
    },
    onSuccess : () =>{
      toast.success("Logout Successfully")
      queryClient.invalidateQueries({
        queryKey : ["authStaff"]
      });
    }
  });

  const { mutate  : changeThemeColor } = useMutation({
    mutationFn : async ({email , theme})=>{
      try {
        const res = await fetch(`${baseURL}/api/staff/change-theme`,{
          method : "POST",
          credentials : "include",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({email , theme})
        });
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "Something Went Wrong")
        }
      }
      catch (error) {
        throw error;
      }
    },
    onSuccess : () =>{
      queryClient.invalidateQueries({
        queryKey : ["authStaff"]
      });
      location.reload();
      toast("Theme Changed")
    }
  });

  function changeTheme(e) {
    const theme = e.target.getAttribute("data-value");
    const chageEmail = Staff.email;
    changeThemeColor({ email : chageEmail , theme});
  }
  
  return (
    <>
      <div className="container-xxl rounded-4 overflow-hidden p-3 staff-container" id="staff-card">
        <div className="card m-0 rounded-0 border-0">
          <div className="card-header row m-0 p-0 justify-content-between bg-transparent border-0">
            <div className="col-md-4 col-6 d-flex p-0 ps-2 align-items-center">
              <div className="vr h-100 side-line rounded opacity-100"></div>
              <div id="staff-label" className="card-header bg-transparent h5 border-0 fw-normal text-wrap ps-2 p-0">{Staff.role} Info</div>
            </div>
            <div className="col-md-3 col-6 d-flex justify-content-end align-items-center gap-2 p-0">
              <div className="dropdown">
                <a className="btn dropdown-toggle" id="btn-theme" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Theme</a>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" data-value="light" onClick={changeTheme}>Light</button></li>
                  <li><button className="dropdown-item" data-value="dark" onClick={changeTheme}>Dark</button></li>
                </ul>
              </div>
              <button id="btn-logout" type="button" className="btn btn-primary" onClick={(e)=>{ e.preventDefault(); logout(); }}>logout</button>
            </div>
          </div>
        </div>
        <div className="card-body p-3">
          <div className="card-title h3 mt-3">{Staff.staffname}</div>
          <div className="row justify-content-around mt-4 gap-2">
            <div className="col-12 col-sm-5 info-box py-2 pxl-3 rounded-2">
              <div className="info-title fw-light mb-1">StaffID:</div>
              <div className="info-data overflow-auto fs-6">{Staff.staffId}</div>
            </div>
            <div className="col-12 col-sm-5 info-box py-2 pxl-3 rounded-2">
                <div className="info-title fw-light mb-1">Role :</div>
                <div className="info-data fs-6 overflow-auto">{Staff.role}</div>
            </div>
            <div className="row collapse justify-content-around mt-3 gap-2 p-0" id="Collapse-staff-Info">
              <div className="col-12 text-center mb-3">More Information</div>
              <div className="col-12 col-sm-5 info-box py-2 pxl-3 rounded-2">
                <div className="info-title fw-light mb-1">Email :</div>
                <div className="info-data fs-6 overflow-auto w-100">{Staff.email}</div>
              </div>
              <div className="col-12 col-sm-5 info-box py-2 pxl-3 rounded-2">
                <div className="info-title fw-light mb-1">Department :</div>
                <div className="info-data overflow-auto fs-6">{Staff.department}</div>
              </div>
            </div>
            <div className="row mt-3 justify-content-center">
              <button type="button" className="btn btn-link w-25" id="collapse-btn" data-bs-toggle="collapse" href="#Collapse-staff-Info" role="button" aria-expanded="false" aria-controls="Collapse-staff-Info">More</button>
            </div>
          </div>
        </div>  
      </div>
      <div className="back-to-button">
          <NavLink to="/" className="back-to-home-link">
            <House size={32} strokeWidth={1} className="back-to-home-icon" />
          </NavLink>
      </div>
    </>
  )
}
