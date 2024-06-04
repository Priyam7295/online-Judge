import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProblemDetails.css";

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [activeButton, setActiveButton] = useState("p_desc");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [showCodingScreen, setShowCodingScreen] = useState(true);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("input");

const sampleCodes = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main(){\n\n   cout<<"Hello, World!"<<endl; \n\n   return 0;  \n}; `,
  py: `print("Hello, World!")`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
};

  const [code, setCode] = useState(sampleCodes[selectedLanguage]);
  useEffect(() => {
    setCode(sampleCodes[selectedLanguage]);
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/problems/${id}`,
          {
            withCredentials: true,
          }
        );
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem details:", error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  async function Code_Run() {
    const data_to_send = { language: selectedLanguage, code: code, input };

    try {
        const response = await axios.post(
            "http://localhost:5000/run",
            data_to_send,
            {
                withCredentials: true,
            }
        );

        console.log("code is->", response.data);
        console.log("code is->", response.data.output);
        // Assuming the response contains the output of the code
        if (response.status === 404) {
            console.log(response.status);
            setOutput("Noy");
        }
        setOutput(response.data.output);

        // Show the output section
        setShowCodingScreen(false);
        setActiveTab("output"); // Switch to the output tab
    } catch (error) {
        if (error.response && error.response.status === 404) {
            setOutput(`Currently ${selectedLanguage} is  not supported.`);
        } else {
            setOutput("There must be some Error With your Code");
            console.log("Geror", error);
        }
    }
}


  const toggleTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      {problem ? (
        <div>
          <div className="navbar">
            <header className="header">
              <h1 className="logo">
                <a href="#">Crack the Code</a>
              </h1>
              <ul className="main-nav">
                <li>
                  <a href="#">Account</a>
                </li>
                <li>
                  <a href="#">Report an issue</a>
                </li>
              </ul>
            </header>
          </div>

          <div className="container_prob">
            <div className="Item-1_des">
              <div className="desc_and_hint">
                <button
                  type="button"
                  className={`  p_desc ${
                    activeButton === "p_desc" ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick("p_desc")}
                >
                  Description
                </button>
                <button
                  type="button"
                  className={`  p_hint ${
                    activeButton === "p_hint" ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick("p_hint")}
                >
                  Hint
                </button>

                <button className="my_sub">Submissions</button>
              </div>

              <div>
                <div className="name_and_tags">
                  <div className="prob_name">{problem.name}</div>
                  <div className="tags_name">{problem.tags}</div>
                </div>
                <button className={`p_level${problem.difficulty}`}>
                  {problem.difficulty}
                </button>
                <div className="reviewQ">
                  <img
                    className="upvote"
                    src="https://www.svgrepo.com/show/11343/like.svg"
                    alt=""
                  />
                  <img
                    className="devote"
                    src="https://tse2.mm.bing.net/th?id=OIP.gIIID9Dl1jE_KJpOfoNfcgHaHa&pid=Api&P=0&h=180"
                    alt=""
                  />
                </div>
                <div className="prob_info">
                  <h2 className="prob_state">Problem Statement</h2>
                  <div className="prob_description">{problem.description}</div>

                  <h2 className="tc_heading">Test Cases</h2>
                  <div>
                    {problem.testcase1 && (
                      <>
                        <div className="enclose_ftc">
                          <h3 className="tc_num">Test Case 1:</h3>
                          <div className="tc_out">
                            {problem.testcase1.inputs.map((input, index) => (
                              <p key={index}>
                                {input.key}: {input.value}
                              </p>
                            ))}
                            <p>
                              Expected Output:{" "}
                              {problem.testcase1.expectedOutput}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    {problem.testcase2 && (
                      <>
                        <div className="enclose_ftc">
                          <h3 className="tc_num">Test Case 2:</h3>
                          <div className="tc_out">
                            {problem.testcase2.inputs.map((input, index) => (
                              <p key={index}>
                                {input.key}: {input.value}
                              </p>
                            ))}
                            <p>
                              Expected Output:{" "}
                              {problem.testcase2.expectedOutput}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="Item-2_prob">
              <div className="choose_language">
                <select
                  name=""
                  id=""
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                  }}
                >
                  <option value="cpp">CPP</option>
                  <option value="py">PYTHON</option>
                  <option value="java">JAVA</option>
                </select>
              </div>

              <textarea
                value={code}
                className="code_block"
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here"
                spellCheck="false"
              ></textarea>

              <div className="sample_io_section">
                <div className="sample_io_headings">
                  <div
                    className={`sample_io_heading ${
                      activeTab === "input" ? "active" : ""
                    }`}
                    onClick={() => toggleTab("input")}
                  >
                    INPUT
                  </div>
                  <div
                    className={`sample_io_heading ${
                      activeTab === "output" ? "active" : ""
                    }`}
                    onClick={() => toggleTab("output")}
                  >
                    OUTPUT
                  </div>
                  <div
                    className={`sample_io_heading ${
                      activeTab === "testcases" ? "active" : ""
                    }`}
                    onClick={() => toggleTab("testcases")}
                  >
                    ON TWO TESTCASES
                  </div>
                </div>
                <div className="sample_io_content">
                  {activeTab === "input" && (
                    <textarea
                      className="input_area"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  )}
                  {activeTab === "output" && (
                    <div className="output_area">{output}</div>
                  )}
                  {activeTab === "testcases" && (
                    <div className="testcases">
                      {/* Render your test cases here */}
                    </div>
                  )}
                </div>
              </div>

              <div className="button-group">
                <button className="run-tc-button" onClick={Code_Run}>
                  Run Sample TC
                </button>
                <button className="run-button" onClick={Code_Run}>
                  Run
                </button>
                <button className="submit-button">Submit</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProblemDetails;