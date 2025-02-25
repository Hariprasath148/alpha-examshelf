import React from 'react'
import "../style/index.css"
import Site from "../assets/images/home/Site.png"
import image from "../assets/images/home/gnc-logo.png"
import baseURL from "../constant/constant";
import  { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/staffLibrary.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { NavLink } from 'react-router-dom';

// Fetch subjects from backend
export const fetchSubjects = async () => {
    const response = await fetch(`${baseURL}/api/questionpaper/get-subject`); 
    if (!response.ok) throw new Error("Failed to fetch subjects");
    return response.json();
  };
// Fetch question papers based on subject code
export const fetchQuestionPapers = async (subjectCode) => {
    const response = await fetch(`${baseURL}/api/questionpaper/get-questionPaper?Subject_code=${subjectCode}`);
    if (!response.ok) throw new Error("Failed to fetch question papers");
    return response.json();
  };

export const Student_Page = ()=> {
    const [activeSubject, setActiveSubject] = useState(null);
    const [newactiveSubject,setnewActiveSubject]=useState(null);
    const [activeSubjectCode, setActiveSubjectCode] = useState("");
    // Fetch subjects
    const { data: subjects = [], isLoading, isError } = useQuery({
      queryKey: ["subjects"],
      queryFn: fetchSubjects,
    });
  
    // Fetch question papers when activeSubjectCode changes
    const { data: questionPapers = [], isLoading: isLoadingPapers } = useQuery({
      queryKey: ["questionPapers", activeSubjectCode],
      queryFn: () => fetchQuestionPapers(activeSubjectCode),
      enabled: !!activeSubjectCode,
    });

    useEffect(() => {
      if (subjects.length > 0 && activeSubject === null) {
        setnewActiveSubject(subjects[0]._id);
        setActiveSubjectCode(subjects[0].Subject_code);
        setActiveSubject(subjects[0]);
      }
    }, [subjects]);

    // Store the full subject object
    const handleSubjectClick = (subject) => {
        setActiveSubject(subject); 
        setnewActiveSubject(subject._id);
        setActiveSubjectCode(subject.Subject_code);
    };
  return (
      <>
        <header className="Gnc_header px-lg-5 px-sm-0 py-1 ">
            <div className="container-fluid px-3 py-2 mb-3 mb-lg-0 mb-md-0 d-flex justify-content-center">
                    <div className="col-12 col-md-9 d-flex justify-content-center flex-column flex-md-row align-items-center gap-3">
                        <img
                            src={image}
                            alt="Guru Nanak College Logo"
                            className="img-fluid  me-0 me-lg-3 me-md-3 d-flex justify-content-center "
                            style={{ maxWidth: "100px" }} 
                        />
                        <div>
                        <h2 className="Gnc_h1 fw-bold mb-3 mt-0 mt-md-0 mb-sm-4 mb-md-0 my-0 mb-sm-4  mb-lg-0 mb-xl-0 text-center  text-sm-center">Guru Nanak College(Autonomous)</h2>
                        <h6 className="Gnc_h1 mb-0 d-none d-md-block text-center">Affiliated to University of Madras</h6>
                            <h6 className="Gnc_h1 mb-0 d-none d-md-block text-center">Accredited at ‘A++’ Grade by NAAC | ISO 9001:2015 Certified Institution</h6>
                            <h6 className="Gnc_h1 mb-0 d-none d-md-block text-center">Guru Nanak Salai, Velachery, Chennai-600 042</h6>
                        </div>
                    </div>
            </div>
        </header>    
        <div className="card-body p-3 mt-3">
          {isLoading && <p>Loading subjects...</p>}
          {isError && <p>Error fetching subjects.</p>}
          {subjects.length === 0 && <p>No records found.</p>}
          {subjects.map((subject, index) => (
            <button
              key={subject._id || index}
              className={`Custom_Button my-2 ${newactiveSubject === subject._id ? "active" : ""}`}
              onClick={() => {
                handleSubjectClick(subject)
              }}
            >
              {subject.Subject_name}
            </button>
          ))}
        </div>
          {isLoadingPapers && <p>Loading question papers...</p>}
          {questionPapers?.questionPaper?.length === 0 && 
              <div className="d-flex flex-column align-items-center justify-contend-center">
                <img src={Site} alt="" style={{width:"400px",height:"200px"}}/>
                <h5>There is no Question paper available</h5>
              </div>
          }
        <div className="d-flex justify-content-center flex-wrap gap-4 justify-content-sm-start ms-4 mt-2">
            {questionPapers?.questionPaper?.map((paper, index) => (
              <div
                key={index}
                className="cards p-4 border-primary text-center"
                style={{ width: "330px", position: "relative" }}
              >
                <div className="card-body">
                  <h5 className="card-title border-bottom pb-3 pt-3 text-wrap">
                    {paper.topic}
                  </h5>
                  <div className="d-flex justify-content-between mt-3">
                    <NavLink
                      to={paper.preViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bt1"
                    >
                      View
                    </NavLink>
                    <NavLink
                      to={paper.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bt2"
                    >
                      Download
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
  )
};
