import React, { useState , useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/questionpaper.css"
import {Pdf_loader} from "../components/Pdf_loader.jsx";
import { useMutation } from '@tanstack/react-query';
import baseURL from '../constant/constant.js';
import { toast } from 'react-hot-toast';
import { useLocation } from "react-router-dom";

export const New_Question_paper = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [topic , setTopic] = useState(null);
  const [threeMarkQuestions , setThreeMarkQuestions] = useState([]);
  const [sixMarkQuestions , setSixMarkQuestions] = useState([]);
  const [tenMarkQuestions , setTenMarkQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const location = useLocation();
  const { subject, subjectCode } = location.state || {};
  useEffect(()=>{
    function handleMouseUp (event) {
      const customContextMenu = document.getElementById('customContextMenu');
      event.preventDefault();
      var selection;
      if (window.getSelection) {
          selection = window.getSelection();
      } else if (document.selection) {
          selection = document.selection.createRange();
      }
  
      var contentText = selection.toString();
  
      if (contentText.length) {
          const { pageX: mouseX, pageY: mouseY } = event
          customContextMenu.style.left = `${mouseX}px`;
          customContextMenu.style.top = `${mouseY}px`;
          customContextMenu.style.display = 'block';
          setNewQuestion(contentText);
      } else {
          customContextMenu.style.display = 'none';
      }
    }
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  },[]);

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const addquestion = (markType) => {
    if(newQuestion != "") {
      if(markType == 3) {
        setThreeMarkQuestions((prev) => [...prev , newQuestion])
      }
      if(markType == 6) {
        setSixMarkQuestions((prev) => [...prev , newQuestion])
      }
      if(markType == 10) {
        setTenMarkQuestions((prev) => [...prev , newQuestion])
      }
    }
  };
  const addquestionbyinput = (markType,inputId) => {
      if(markType == 3) {
        let newInput = document.getElementById(inputId).value;
        if(!newInput == "") {
          setThreeMarkQuestions((prev) => [...prev , newInput]);
          document.getElementById(inputId).value = "";
        }
      }
      else if(markType == 6) {
        let newInput = document.getElementById(inputId).value;
        if(!newInput == "") { 
          setSixMarkQuestions((prev) => [...prev , newInput]);
          document.getElementById(inputId).value = "";
        }
      }
      else if(markType == 10) {
        let newInput = document.getElementById(inputId).value;
        if(!newInput == "") {
          setTenMarkQuestions((prev) => [...prev , newInput]);
          document.getElementById(inputId).value = "";
        }
      }
  };

  const removeQuestion = (index, marksType) => {
    if (marksType === "3") {
      setThreeMarkQuestions((prev) => prev.filter((_, i) => i !== index));
    } else if (marksType === "6") {
      setSixMarkQuestions((prev) => prev.filter((_, i) => i !== index));
    } else if (marksType === "10") {
      setTenMarkQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index, value, marksType) => {
    if (marksType === "3") {
      const updatedQuestions = [...threeMarkQuestions];
      updatedQuestions[index] = value;
      setThreeMarkQuestions(updatedQuestions);
    } else if (marksType === "6") {
      const updatedQuestions = [...sixMarkQuestions];
      updatedQuestions[index] = value;
      setSixMarkQuestions(updatedQuestions);
    } else if (marksType === "10") {
      const updatedQuestions = [...tenMarkQuestions];
      updatedQuestions[index] = value;
      setTenMarkQuestions(updatedQuestions);
    }
  };
  
  const handleSaveQuestionPaper = (e) =>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("topic",topic);
    formData.append("file",pdfFile);
    formData.append("Subject_code",subjectCode);
    formData.append("mark_3",JSON.stringify(threeMarkQuestions))
    formData.append("mark_6",JSON.stringify(sixMarkQuestions))
    formData.append("mark_10",JSON.stringify(tenMarkQuestions))
    saveQuestionPaper(formData)
  }

  const {mutate : saveQuestionPaper , isPending : isSaveQuestionPaperPending  , isError : isSaveQuestionError , error  : SaveQuestionPaperError} = useMutation({
    mutationFn : async (formData) => {
      const res = await fetch(`${baseURL}/api/questionpaper/save-question-paper` , {
        method : "POST",
        body : formData
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
    },
    onSuccess : () => {
      toast.success('Question Paper Saved Successfully');
      document.querySelector("#addNewQuestionPaperFrom").reset();
      setThreeMarkQuestions([]);
      setSixMarkQuestions([]);
      setTenMarkQuestions([]);
      setPdfFile(null);
      setTopic(null);
    }
  });
  return (
    <>
      <div className="sticky-top question-paper-title text-center pt-2 pb-2 fs-5">Add New Question Paper</div>
      <div className="row vh-100 m-0">
        <div  className="col-md-6 col-12 questionpaper-container p-3 overflow-auto">
          <Pdf_loader file={pdfFile}></Pdf_loader>
        </div>
        <div  className="col-md-6 col-12 p-4">
          <form onSubmit={handleSaveQuestionPaper} id="addNewQuestionPaperFrom">
            <div className="mb-3 row">
              <div className="col-md-6 col-12"><p><span className="h5 subject-info">Subject Name : </span><span className="h5 fw-normal">{subject}</span></p></div>
              <div className="col-md-6 col-12"><p><span className="h5 subject-info">Subject Code : </span><span className="h5 fw-normal">{subjectCode}</span></p></div>
            </div>
            <div className="mb-3">
              <label htmlFor="questionpaper-topic" className='form-label'>Enter The title for the question Paper</label>
              <input type="text" className="form-control" id="questionpaper-topic" aria-describedby="questionpaper-topic-help" onChange={(e)=>{setTopic(e.target.value)}}/>
              <div id="questionpaper-topic-help" className="form-text mt-2">This for the question paper discription</div>
            </div>
            <div className="mb-3">
              <label htmlFor="questionpaper-file" className='form-label'>Enter The title for the question Paper</label>
              <input type="file"  className="form-control" id="questionpaper-file" aria-describedby="questionpaper-file-help" onChange={onFileChange}/>
              <div id="questionpaper-file-help" className="form-text mt-2">This for the question paper discription</div>
            </div>
            <div className="mb-3">
              <label className="form-label">3 Marks</label>
              <div className="input-group mb-2">
                  <input type="text" id="threeNewInput" className="form-control" placeholder="Enter a questtion Manually"/>
                  <span className="input-group-text"><button className="btn-primary border-0 bg-transparent" type="button" onClick={()=>{addquestionbyinput(3,"threeNewInput")}}>Add</button></span>
              </div>
              {
                threeMarkQuestions.map((question , index) => (
                  <div className="input-group mb-2" key={index}>
                  <input type="text" className="form-control" value={question} onChange={(e) => updateQuestion(index, e.target.value, "3")}/>
                  <span className="input-group-text"><button className="btn-close" type="button" aria-label="close" onClick={() => removeQuestion(index, "3")}
                  ></button></span>
                  </div>
                ))
              }      
              <div id="questionpaper-file-help" className="form-text mt-2">This for the question paper 3 Marks</div>
            </div>
            <div className="mb-3">
              <label className="form-label">6 Marks</label>
              <div className="input-group mb-2">
                  <input type="text" id="sixNewInput" className="form-control" placeholder="Enter a questtion Manually"/>
                  <span className="input-group-text"><button className="btn-primary border-0 bg-transparent" type="button" onClick={()=>{addquestionbyinput(6,"sixNewInput")}}>Add</button></span>
              </div>
              {
                sixMarkQuestions.map((question , index) => (
                  <div className="input-group mb-2" key={index}>
                  <input type="text" className="form-control" value={question} onChange={(e) => updateQuestion(index, e.target.value, "6")}/>
                  <span className="input-group-text"><button className="btn-close" type="button" aria-label="close" onClick={() => removeQuestion(index, "6")}
                  ></button></span>
                  </div>
                ))
              } 
              <div id="questionpaper-file-help" className="form-text mt-2">This for the question paper 6 Marks</div>
            </div>
            <div className="mb-3">
              <label className="form-label">10 Marks</label>
              <div className="input-group mb-2">
                  <input type="text" id="tenNewInput" className="form-control" placeholder="Enter a questtion Manually"/>
                  <span className="input-group-text"><button className="btn-primary border-0 bg-transparent" type="button" onClick={()=>{addquestionbyinput(10,"tenNewInput")}}>Add</button></span>
              </div>
              {
                tenMarkQuestions.map((question , index) => (
                  <div className="input-group mb-2" key={index}>
                  <input type="text" className="form-control" value={question} onChange={(e) => updateQuestion(index, e.target.value, "10")}/>
                  <span className="input-group-text"><button className="btn-close" type="button" aria-label="close" onClick={() => removeQuestion(index, "10")}
                  ></button></span>
                  </div>
                ))
              } 
              <div id="questionpaper-file-help" className="form-text mt-2">This for the question paper 10 Marks</div>
            </div>
            <div className="form-group">
                <button type='submit' id="addNewQuestionPaperSubmitButton" className='btn-primary text-center px-5 py-2 border-0 rounded' disabled = {isSaveQuestionPaperPending}>{ isSaveQuestionPaperPending ? "Saving" : "save" }</button>
            </div>
          </form>
        </div>
      </div>
      <ul id="customContextMenu" className="list-unstyled">
            <li id="menuItem2" onClick={()=>{addquestion(3)}}>3 Mark</li>
            <li id="menuItem2" onClick={()=>{addquestion(6)}}>6 Mark</li>
            <li id="menuItem3" onClick={()=>{addquestion(10)}}>10 Mark</li>
        </ul>
    </>
  )
}
