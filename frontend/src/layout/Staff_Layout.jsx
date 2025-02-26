import React from 'react'
import { Staff_card } from '../components/Staff_card'
import { Staff_Library } from '../components/Staff_Library'
import { Admin_Table } from "../components/Admin_Table"
import { useState } from 'react'
import "../style/staff_card.css"
import baseURL from '../constant/constant';
import { useQuery , useQueryClient } from '@tanstack/react-query'

export const Staff_layout = () => {
  
    const { data : Staff , isLoading } = useQuery({
      queryKey : ["Staff"],
      queryFn : async () => {
        try {
          const res = await fetch(`${baseURL}/api/auth/getStaff`, {
            method : "GET",
            credentials : "include" ,
            headers : {
              "Content-Type" : "application/json"
            }
          });
          const data = await res.json();
          if(data.error) {
              return null;
          }
          if(!res.ok){
            throw new Error(data.error || "Something went Wrong");
          }
          return data;
        } catch (error) {
          throw error;
        }
      },
      retry : false
    });

    if(isLoading) {
      return <div className="loader vh-100 wh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border" role="status"></div>
      </div>
    }

    return (
      <div id="Staff-layout" className={`p-3 pt-5 min-vh-100 ${Staff.theme}`}>
        <Staff_card Staff={Staff}/>
        {Staff.role == "Admin" && <Admin_Table Staff={Staff} />}
        <Staff_Library />
      </div>
    )
};
