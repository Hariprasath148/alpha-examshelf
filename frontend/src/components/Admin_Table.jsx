import React, { useState } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useMutation, useQuery , useQueryClient } from '@tanstack/react-query';
import baseURL from '../constant/constant';
import "../style/Staff_card.css"
import "../style/admin_table.css"
import { toast } from 'react-hot-toast';

export const Admin_Table = ({Staff}) => {

  const [newFormData , setNewFormData] = useState({
      staffname : "",
      staffId : "",
      email : "",
      password : "staff123",
      department : "",
      role : "Staff"
    });

  const queryClient = useQueryClient();  
  const [ removingEmail , setRemovingEmail ] = useState(null);

  const { data : allStaff , isLoading : allStaffLoading , isError : allStaffisError , error  : allStaffError} = useQuery({
    queryKey : ["getAllStaff"],
    queryFn : async() => {
      try {
        const res = await fetch(`${baseURL}/api/staff/get-all-staff`,{
          method : "GET",
          credentials :"include",
          headers : {
             "Content-Type" : "application/json"
          }
        });
        const data = await res.json();

        if(!res.ok) {
          throw new Error(data.error || "Something went Wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry : false
  });

  const { mutate : removeStaff  , isError : removeisError , error : removeError } = useMutation({
    mutationFn : async(email) => {
      try {
        const res = await fetch(`${baseURL}/api/staff/remove-staff`,{
          method : "POST",
          credentials : "include", 
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({ email })
        });

        const data = await res.json();

        if(!res.ok){

          throw new Error( data.error || "Something Wne Wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess : () => {
      toast.success('Deleted Successfully!');
      setRemovingEmail(null);
      queryClient.invalidateQueries(["getAllStaff"]);
    },onError: (error) => {
      toast.error("Unable to Delete the record");
      setRemovingEmail(null);
      console.error("Error deleting staff:", error);
    },
  });

  const { mutate : addNewStaff , isPending : newStaffIsPending , isError : newStaffIsError , error : newStaffError } = useMutation({
    mutationFn : async({staffname , staffId , email , password , department , role}) => {
      try {
        const res = await fetch(`${baseURL}/api/auth/add-user`,{
          method : "POST",
          credentials : "include", 
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({ staffname , staffId , email , password , department , role })
        });

        const data = await res.json();

        if(!res.ok){
          throw new Error( data.error || "Something Wne Wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess : () => {
      toast.success('Added Successfully!');
      queryClient.invalidateQueries(["getAllStaff"]);
      setNewFormData({
        staffname : "",
        staffId : "",
        email : "",
        password : "staff123",
        department : "",
        role : "Staff"
      });
      document.querySelector("#newStaffForm").reset();
    },onError: (error) => {
      toast.error("Unable to Add the record");
      console.error("Error Add staff:", error);
    },
  })

  function removeRecord(e){
    const removeEmail =e.target.getAttribute("data-staffemail");
    setRemovingEmail(removeEmail);
    removeStaff(removeEmail);
  }

  function handlenewFormInput(e) {
    setNewFormData({...newFormData,[e.target.name]:e.target.value});
  }

  function handleSave(e){
    e.preventDefault();
    addNewStaff(newFormData);
  }

  return (
    <>
      <div className="container-xxl rounded-4 overflow-hidden p-3 staff-container mt-5" id="staff-table">
        <div className="card m-0 rounded-0 border-0">
          <div className="card-header row m-0 p-0 justify-content-start bg-transparent border-0">
            <div className="col-md-4 col-12 d-flex p-0 ps-2 align-items-center">
              <div className="vr h-100 side-line rounded opacity-100"></div>
              <div id="table-label" className="card-header bg-transparent h5 border-0 fw-normal text-wrap ps-2 p-0">Admin table</div>
            </div>
          </div>
        </div>
        <div className="card-body p-3">
          <div className="table-responsive rounded-2 mt-4" style={{maxHeight : "300px"}} >
            <table className={`table table-striped m-0 ${ Staff.theme === "dark" ? "table-dark" : "" }`} >
              <thead>
                <tr>
                  <th scope="col">S.no</th>
                  <th scope="col">Staffname</th>
                  <th scope="col">StaffId</th>
                  <th scope="col">Email</th>
                  <th scope="col">Department</th>
                  <th scope="col">Role</th>
                  <th scope="col">Remove</th>
                </tr>
              </thead>
              <tbody>
                {removeisError && <tr>
                  <td colSpan="7" className="text-center full-text-table">{removeError.message}</td>
                  </tr>}
                <tr>
                  <td colSpan="7" className="text-center full-text-table h5">Your's Detail</td>
                </tr>
                <tr>
                  <td className="text-nowrap">1</td>
                  <td className="text-nowrap">{Staff.staffname}</td>
                  <td className="text-nowrap">{Staff.staffId}</td>
                  <td className="text-nowrap">{Staff.email}</td>
                  <td className="text-nowrap">{Staff.department}</td>
                  <td className="text-nowrap">{Staff.role}</td>
                  <td className="text-nowrap text-center text-success">Current</td>
                </tr>
                <tr>
                  <td colSpan="7" className="text-center full-text-table h5">Other's Detail</td>
                </tr>
                {  allStaffLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <div className="spinner-border" role="status"></div>
                    </td>
                  </tr>
                ) : allStaffisError ? (
                  <tr>
                    <td colSpan="7" className="text-center">{allStaffError.message}</td>
                  </tr>
                )
                 : (
                  (allStaff.allStaff.length == 0) ? (
                    <tr>
                      <td colSpan="7" className="text-center text-body-secondary" id="noStaffMessage">No Staff Found</td>
                    </tr>
                  ) : (
                    allStaff.allStaff.map((staff , index) => {
                      return (
                        <tr key={index+1}>
                          <td className="text-nowrap">{index +1 }</td>
                          <td className="text-nowrap">{staff.staffname}</td>
                          <td className="text-nowrap">{staff.staffId}</td>
                          <td className="text-nowrap">{staff.email}</td>
                          <td className="text-nowrap">{staff.department}</td>
                          <td className="text-nowrap">{staff.role}</td>
                          <td className="text-nowrap text-center text-danger">{ removingEmail === staff.email ? "Removing.." : <button className="btn bg-transpraent p-0 m-0 text-danger" data-staffemail={staff.email} onClick={(e) => removeRecord(e)}>Remove</button> }</td>
                        </tr>
                      )
                    })
                  )
                  )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card m-0 mt-4 rounded-0 border-0">
          <div className="card-header row m-0 p-0 justify-content-start bg-transparent border-0">
            <div className="col-md-4 col-12 d-flex p-0 ps-2 align-items-center">
              <div className="vr h-100 side-line rounded opacity-100"></div>
              <div id="table-label" className="card-header bg-transparent h5 border-0 fw-normal text-wrap ps-2 p-0">Add new Staff or Admin</div>
            </div>
          </div>
        </div>
        <div className="card-body p-3">
          <div className="conatiner-fluid">
            <form action="#" onSubmit={handleSave} id="newStaffForm" >
              <div className="form-group mt-3">
                <label htmlFor="newStaffName">Enter the Staff Name</label>
                <input type="text" className="form-control mt-2" id="newStaffName" name="staffname" aria-describedby="helpStaffName" onChange={handlenewFormInput} autoComplete="off" required/>
                <small id="helpStaffName" className=" form-text text-muted d-block mt-2 ">Enter the Staff Name</small>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="newStaffId">Enter the StaffId</label>
                <input type="text" className="form-control mt-2" id="newStaffId" name="staffId" aria-describedby="helpStaffId" onChange={handlenewFormInput} autoComplete="off" required/>
                <small id="helpStaffId" className=" form-text text-muted d-block mt-2 ">Enter the Unique StaffId</small>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="newStaffEmail">Enter the Staff Email address</label>
                <input type="email" className="form-control mt-2" id="newStaffEmail"  name="email" aria-describedby="helpStaffEmail" onChange={handlenewFormInput} autoComplete="off" required/>
                <small id="helpStaffEmail" className=" form-text text-muted d-block mt-2 ">Enter the valid email address to send Invitation</small>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="newStaffPassword">Enter the Password</label>
                <input type="text" className="form-control mt-2" id="newStaffPassword"  name="password" aria-describedby="helpStaffPassword" value={newFormData.password} onChange={handlenewFormInput} autoComplete="off" required/>
                <small id="helpStaffPassword" className=" form-text text-muted d-block mt-2 ">Defalut password Staff123</small>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="newStaffDepartment">Enter the Deparment</label>
                <input type="text" className="form-control mt-2" id="newStaffDepartment" name="department" aria-describedby="helpStaffDepartment" onChange={handlenewFormInput} autoComplete="off" required/>
                <small id="helpStaffDepartment" className=" form-text text-muted d-block mt-2 ">Enter the Department</small>
              </div>
              <div className="form-group mt-3">
                <label>Enter the Role</label>
                <div className="d-flex gap-5 mt-2">
                  <div className="form-group">
                    <input className="form-check-input" type="radio" name="role" id="newstaffRoleStaff" value="Staff" checked={newFormData.role==="Staff"} onChange={handlenewFormInput}/>
                    <label className="ps-2 form-check-label" htmlFor="newstaffRoleStaff">Staff</label>
                  </div>
                  <div className="form-group">
                    <input className="form-check-input" type="radio" name="role" id="newstaffRoleAdmin" value="Admin" onChange={handlenewFormInput} checked={newFormData.role==="Admin"}/>
                    <label className="ps-2 form-check-label" htmlFor="newstaffRoleAdmin">Admin</label>
                  </div>
                </div>
                <small id="" className="form-text text-muted d-block mt-2">Enter the valid email address to send Invitation</small>
              </div>
              {newStaffIsError && <div className='error-text mb-3 form-text text-decoration-underline text-danger mt-3'>{newStaffError.message}</div>}
              <div className="form-group mt-3">
                  <button type='submit' id='save-btn' className='btn text-center px-3'>{newStaffIsPending ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

