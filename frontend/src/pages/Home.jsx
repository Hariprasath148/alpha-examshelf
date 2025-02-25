import React from 'react'
import "../style/index.css"
import backgroundimg from "../assets/images/home/background-img.png"
import {NavLink} from "react-router-dom"
import image from "../assets/images/home/gnc-logo.png"
export const Home = () => {
  return (
      <>
        <header className="Gnc_header px-lg-5 px-sm-0 py-1 ">
            <div className="container-fluid px-3 py-2 mb-3 mb-lg-0 mb-md-0">
                <div className="row align-items-center">
                    <div className="col-12 col-md-9 d-flex flex-column flex-md-row align-items-center ">
                        <img
                            src={image}
                            alt="Guru Nanak College Logo"
                            className="img-fluid me-0 me-lg-3 me-md-3 d-flex justify-content-center "
                            style={{ maxWidth: "100px" }} 
                        />
                        <div>
                        <h2 className="Gnc_h1 fw-bold mb-3 mt-0 mb-sm-4 mb-md-0 my-0 mb-sm-4  mb-lg-0 mb-xl-0 text-center text-sm-start">Guru Nanak College(Autonomous)</h2>
                        <h6 className="Gnc_h1 mb-0 d-none d-md-block">Affiliated to University of Madras</h6>
                            <h6 className="Gnc_h1 mb-0 d-none d-md-block">Accredited at ‘A++’ Grade by NAAC | ISO 9001:2015 Certified Institution</h6>
                            <h6 className="Gnc_h1 mb-0 d-none d-md-block">Guru Nanak Salai, Velachery, Chennai-600 042</h6>
                        </div>
                    </div>
                    <div className="col-12 col-md-3 text-center text-md-end mb-0 mb-md-3 mb-sm-3 mt-0 mt-sm-3">
                        <NavLink to="/login" id="Login_button">
                            Teacher Login
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
        <div className='row mx-0'>
            <div className='col mt-3 mt-lg-5 mt-sm-5 ms-2 ms-lg-5'>
                <h1 className='Library_head'>GNC QUESTION PAPER</h1>
                <h5 className="Border_contend ps-4 mt-4">
                    Using the previous year’s question paper as a reference is an effective way to prepare for exams.
                    It helps you understand the question patterns, exam format, and key topics often emphasized.
                    By analyzing these papers,you can identify areas needing more focus and gain familiarity with the exam style.
                    Once you’ve reviewed the paper, you can create a new set of practice questions. 
                    These can be rephrased versions of the original questions, expanded variations,
                    or entirely new ones that test the same concepts differently. 
                    This approach not only strengthens your understanding but also enhances your confidence for the actual exam.               
                </h5>
                <NavLink to="/student-library" className="Library_button mt-4 mb-4">
                    Get Into Library
                </NavLink>
            </div> 
            <div className="col-5 d-none d-lg-block">
                <img src={backgroundimg} alt="" className="Library_img img-fluid" />
            </div>
        </div>
    </>
  )
};
