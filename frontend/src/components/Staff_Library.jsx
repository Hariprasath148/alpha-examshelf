import baseURL from "../constant/constant";
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/staffLibrary.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Site from "../assets/images/home/Site.png"
import { useNavigate } from "react-router-dom";

// Fetch subjects from backend
export const fetchSubjects = async () => {
  const response = await fetch(`${baseURL}/api/questionpaper/get-subject`); 
  if (!response.ok) throw new Error("Failed to fetch subjects");
  return response.json();
};
// Add a new subject
const addSubject = async (subject) => {
  const response = await fetch(`${baseURL}/api/questionpaper/add-subject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });
  if (!response.ok) throw new Error("Failed to add subject");
  return response.json();
};
// Fetch question papers based on subject code
export const fetchQuestionPapers = async (subjectCode) => {
  const response = await fetch(`${baseURL}/api/questionpaper/get-questionPaper?Subject_code=${subjectCode}`);
  if (!response.ok) throw new Error("Failed to fetch question papers");
  return response.json();
};

// Delete a question paper
export const deleteQuestionPaper = async (QuestionPaper_ID) => {
  const response = await fetch(`${baseURL}/api/questionpaper/delete-questionPaper`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ QuestionPaper_ID }),
  });
  if (!response.ok) throw new Error("Failed to delete question paper");
  return response.json();
};

export const Staff_Library = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteQuestionPaper,
    onSuccess: () => {
      queryClient.invalidateQueries(["questionPapers", activeSubjectCode]);
    },
  });

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Do you want to remove this Question Paper");
    if (isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  useEffect(() => {
    if (subjects.length > 0 && activeSubject === null) {
      setnewActiveSubject(subjects[0]._id);
      setActiveSubjectCode(subjects[0].Subject_code);
      setActiveSubject(subjects[0]);
    }
  }, [subjects]);

    // Mutation to add a new subject
    const mutation = useMutation({
      mutationFn: addSubject,
      onSuccess: () => {
        queryClient.invalidateQueries(["subjects"]);
        setNewSubject("");
        setSubjectCode("");
        setIsModalOpen(false);
      },
    });
      // Add new subject
    const handleAddSubject = () => {
      if (newSubject.trim() && subjectCode.trim()) {
      mutation.mutate({ Subject_name: newSubject, Subject_code: subjectCode });
      }
    };
    // Store the full subject object
    const handleSubjectClick = (subject) => {
      setActiveSubject(subject); 
      setnewActiveSubject(subject._id);
      setActiveSubjectCode(subject.Subject_code);
    };
    //navigate to next page
    const navigate = useNavigate();

    const handleNavigate = () => {
      navigate("/staff/add-new-question-paper", { state: { subject: activeSubject.Subject_name , subjectCode: activeSubject.Subject_code } });
    };
  return (
    <>
      <div className="container-xxl rounded-4 overflow-hidden p-3 staff-container mt-5" id="staff-card">
        <div className="card m-0 rounded-0 border-0">
          <div className="card-header row m-0 p-0 justify-content-between bg-transparent border-0">
            <div className="col-md-4 col-6 d-flex p-0 ps-2 align-items-center">
              <div className="vr h-100 side-line rounded opacity-100"></div>
              <div id="staff-label" className="card-header bg-transparent h5 border-0 fw-normal text-wrap ps-2 p-0">Question Paper Library</div>
            </div>
            <div className="col-md-3 col-6 d-flex justify-content-end align-items-center gap-2 p-0">
              <NavLink id="generate-btn" className="p-2 px-3 text-light text-decoration-none rounded" to="/staff/generate-new-question-paper">Generate</NavLink>
            </div>
          </div>
        </div>
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
          <button className="cus_but" onClick={() => setIsModalOpen(true)}>+ Add Subject</button>
        </div>
         {/* Modal to Add a Subject */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add a New Subject</h2>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Enter Subject Name"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Enter Subject Code"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={() => setIsModalOpen(false)} className="cancel-button">Cancel</button>
              <button onClick={handleAddSubject} className="submit-button" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

        <div className="mt-2 ms-2 me-2 d-flex gap-4 flex-wrap row justify-content-md-start justify-content-center">
          {isLoadingPapers && <p>Loading question papers...</p>}
          {questionPapers?.questionPaper?.length === 0 && 
            <div className="d-flex flex-column align-items-center justify-contend-center">
              <img src={Site} alt="" style={{width:"400px",height:"200px"}}/>
              <h5>There is no Question paper available</h5>
              <button className="bt3 mt-4" onClick={handleNavigate}>
                + Add New Question Paper
              </button>
            </div>
          }
          {questionPapers?.questionPaper?.map((paper, index) => (
            <div key={index} className="cards p-4 border-primary text-center" style={{ maxWidth: "350px", position: "relative" }}>
              <div className="card-body">
                <h5 className="card-title border-bottom pb-3 pt-3 text-wrap">{paper.topic}</h5>
                <button style={{ border: "none", background: "none" }} onClick={() => handleDelete(paper.QuestionPaper_ID)}>
                  <Trash2 className="Trash-icon" size={24} color="red"/>
                </button>
                <div className="d-flex justify-content-between mt-3">
                  <NavLink to={paper.preViewLink} target="_blank" rel="noopener noreferrer" className="bt1">
                    View
                  </NavLink>
                  <NavLink to={paper.downloadLink} target="_blank" rel="noopener noreferrer" className="bt2">
                    Download
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
          {questionPapers?.questionPaper?.length !== 0 && 
            <div className="qn_card p-4 border-primary d-flex flex-column justify-content-center align-items-center" style={{ maxWidth: "350px",height:"180px",backgroundColor:"var(--86)"}} onClick={handleNavigate}>
              <div className="text-center h1">+</div>
              <div className="h5 text-center">Add New Question Paper </div>
            </div>
          }
        </div>
      </div>
    </>
  );
};