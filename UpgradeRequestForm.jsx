import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import process from "process";
import Draggable from "react-draggable";
import Button from "antd/es/button";
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Modal, Select } from "antd";
import Chatbot from "./Chatbot";
import { useDispatch, useSelector } from "react-redux";
import { Typography, IconButton } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import { useNavigate } from "react-router-dom";
import smartBotIcon from "../../../assets/images/smartBotIcon.svg";
import smartBotHeaderIcon from "../../../assets/images/chatbot-header-logo.svg";
import brainIcon from "../../../assets/images/brainIcon.svg";
import webIcon from "../../../assets/images/webIcon.svg";
import smartBotSendMsgIcon from "../../../assets/images/smartBotSendMsgIcon.svg";
import smartBotIconWithWhiteCircle from "../../../assets/images/chatbot-chat-logo.svg";
import userChatIcon from "../../../assets/images/userIconWhiteBlue.svg";
import icon from "../../../assets/images/chatbot-button-logo.svg";
import closeIcon from "../../../assets/images/closeIcon.svg";
import moment from "moment";
import "./Chatbot.css";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { chatBotAuditLogAPI } from ".././../core/apis/SummaryOneAPI";
import { incrementApiInteraction } from "../../core/actions/couter.action";
import {Lock} from 'lucide-react';
const { Option } = Select;

const WebSearchSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(14px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '4px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
    backgroundColor: '#9e9e9e',
  },
  '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
    backgroundColor: '#fff',
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2,
    backgroundColor: '#fff',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#fff',
    }),
  },
}));

const AskMeAything = (props) => {
  const ThemeState = "dark";
  const [plan, setPlan] = useState(localStorage.getItem('plan') || '');

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [messages, setMessages] = useState([{ text: { result: "Hello there, Welcome to SMART PULSE! Type down a question. I'm glad to answer.", citation: [] }, user: false, time: moment(new Date()).format("hh:mm A") }
  ]);
  const [searchType, setSearchType] = useState([]);
  const [selected, setSelected] = useState('');
  const smartAndWebModels = ["GPT 4o", "Claude"];
  const researchModels = ["DeepSeek"];
  const [selectedModel, setSelectedModel] = useState(smartAndWebModels[0]);
  const startYear = "2023";
  const calculatedStartYear = 2023;
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [models, setModels] = useState(smartAndWebModels);
  const years = Array.from({ length: currentYear - calculatedStartYear + 1 }, (_, i) => calculatedStartYear + i);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const chatEndRef = useRef(null);


  useEffect(() => {
    const handleStorageChange = () => {
      setPlan(localStorage.getItem('plan') || '');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Always show all options
    const allTypes = ["Smart Search", "Web Search", "Research"];
    setSearchType(allTypes);

    // Default to Smart Search if selected option not allowed
    if (plan === "Lite" && selected !== "Smart Search") setSelected("Smart Search");
    else if (plan === "Pro" && selected === "Research") setSelected("Smart Search");
  }, [plan]);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const nodeRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scrolls every time messages change

  useEffect(() => {
    if (selected === "Smart Search" || selected === "Web Search") {
      if (selectedModel === "DeepSeek") {
        setModels((prevState) => smartAndWebModels);
        setSelectedModel((prevState) => smartAndWebModels[0]);
      }
    }
    else {
      setModels((prevState) => researchModels);
      setSelectedModel((prevState) => researchModels[0]);
    }
  }, [selected]);

  const chatFlag = useSelector((state) => state.filterTwo.chatFlag);
  useEffect(() => {
    if (chatFlag) setVisible(true);
  }, [chatFlag]);

  const eventControl = (event, info) => {
    if (event.type === "mousemove" || event.type === "touchmove") {
      setIsDragging(true);
    }

    if (event.type === "mouseup" || event.type === "touchend") {
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    }
  };
  const sidebarValue = useSelector((state) => state.filterTwo.sidebarValue);
  // console.log(sidebarValue);

  const fetchChatbotResponse = async (userInput) => {
    let url = process.env.REACT_APP_CHAT_API_KEY;
    const apiEndpoint = `${url}`;
    const headers = {
      "Content-Type": "application/json",
    };

    const data = {
      question: userInput,
      method_type: selected === "Smart Search" ? "SmartGPT" :
        selected === "Web Search" ? "WebGPT" : "Research",
      llm_model: selectedModel,
      year: selectedYear,
      user_mail: localStorage.getItem("emailToken") || "user@maruti.co.in",
      user_name: localStorage.getItem("Data_API_name") || "user",
    };
    try {
      const response = await axios.post(apiEndpoint, data, { headers });
      const dummyData = JSON.parse(response?.data?.body);
      const auditLogPostData = {
        url: apiEndpoint,
        reqBody: data,
        resBody: dummyData,
      };
      await chatBotAuditLogAPI.post(auditLogPostData);
      let result = "Sorry, information is not available in the given data. Please try using Web Search to get the required information.";
      let itemsData = [];
      let reasoning = "";
      if (dummyData?.result) {
        dispatch(incrementApiInteraction());
        result = dummyData?.result;
        reasoning = dummyData?.reasoning;
        if (dummyData?.citation) {
          itemsData = Object.keys(dummyData?.citation)?.map((val) => {
            return {
              [val]: dummyData["citation"][val]["sentiment"].map((item, id) => {
                return {
                  sentiment: dummyData["citation"][val]["sentiment"][id],
                  comment_datetime:
                    dummyData["citation"][val]["comment_datetime"][id],
                  comments: dummyData["citation"][val]["Comments"][id],
                  url: dummyData["citation"][val]["url"][id],
                };
              }),
            };
          });
        }
      }

      const resData = {
        result: result,
        citation: itemsData,
        reasoning: reasoning,
      };
      setLoading(false);
      // console.log(response, "poo");
      return resData;
    } catch (error) {
      setLoading(false);
      console.error("Error communicating with the API:", error.message);
      console.log(error);
      return "";
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      setLoading(true);
      const userMessage = { text: message, user: true, time: moment(new Date()).format("hh:mm A") };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setMessage('');
      setDisabled(true);
      const aiMessage = { text: { result: "Loading..." }, user: false, time: moment(new Date()).format("hh:mm A") };
      // console.log("aiMessage", aiMessage);
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      const response = await fetchChatbotResponse(message);
      // console.log(response, "chatbot response");
      const newAiMessage = { text: response, user: false, time: moment(new Date()).format("hh:mm A") };
      setMessages((prevMessages) => [...prevMessages.slice(0, -1), newAiMessage]);
      setDisabled(false);
    }
  };

  const handleButtonData = (val, id) => {
    dispatch({
      type: "CHATBOT_DATA",
      data: Object.values(val)[0],
    });
    navigate("/chatbot_data");

    setVisible(false);
    dispatch({
      type: "CHATBOT_MODAL",
      chatFlag: false,
    });
  };

  const handleSwitchChange = (event) => {
    if (event.target.checked) {
      setSelected((prevState) => "web");
    }
    else {
      setSelected((prevState) => "smart");
    }
  }


  return (
    <div className={sidebarValue ? "drag-two" : "drag"}>
      {!visible && (
        // <Draggable onDrag={eventControl} onStop={eventControl}>
        //     <img
        //       onClick={isDragging ? () => {} : () => setVisible(true)}
        //       src={smartBotIcon}
        //       alt="smartbot-icon"
        //       width={"5%"}
        //       height={"10%"}
        //     />
        //   </Draggable>
        <Draggable
          nodeRef={nodeRef}
          onStart={() => setIsDragging(true)}
          onDrag={eventControl}
          onStop={(...args) => {
            setIsDragging(false);
            eventControl(...args);
          }}
        >
          <div ref={nodeRef} style={{ marginLeft: "20px" }}>
            <Button
              onClick={(e) => { if (isDragging) return; setVisible(true) }}
              id='ask-me-anything'
              className="draggable-btn"
              style={{
                backgroundColor: "#181B20",
                color: "#fff",
                fontWeight: "600",
                fontSize: "12px",
                height: "70px",
                width: "70px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ display: "inline-block", width: 40 }}>
                <img
                  src={icon}
                  alt="icon-text"
                  width="100%"
                  height="100%"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </span>
            </Button>
          </div>
        </Draggable>
      )
      }
      <Modal
        open={visible}
        onCancel={() => {
          dispatch({
            type: "CHATBOT_STATE",
            data: modalData,
          });
          setVisible(false);
        }}
        closeIcon={null}
        footer={null}
        className="chat-screen-modal"
        closable={false}
      >
        <div className="chat-screen-container">
          <div className="title-and-dropdown-section">
            <div className="title-section-left-part">
              <img src={smartBotHeaderIcon}
                alt="smartbot-icon"
                width={"20%"}
                height={"10%"} />
              <div className="title-section-left-part-heading-section">
                <Typography variant="h6" className="top-title">SMART <i>PULSE</i></Typography>
                <Typography variant="h6" className="bottom-title">AI Assistant</Typography>
              </div>
            </div>
            {
              <div className="title-section-right-part">
                <div className="dropdown-container-with-label">
                  <Typography sx={{ fontSize: "12px", color: "White", marginLeft: "10px" }}>
                    {/* Search Mode */}
                    Assistant Type
                  </Typography>
                  <Select
                    value={selected}
                    onChange={(value) => setSelected(value)}
                    dropdownStyle={{
                      backgroundColor: "#3261ad",
                      color: "#fff",
                      fontSize: 12,
                      lineHeight: 1.2,
                    }}
                    popupClassName="custom-dropdown"
                    className="search-dropdown"
                  >
                    {searchType.map((type, index) => {
                      const isDisabled =
                        (plan === "Lite" && type !== "Smart Search") ||
                        (plan === "Pro" && type === "Research");

                      return (
                        <Option
                          key={index}
                          value={type}
                          disabled={isDisabled}
                          style={{
                            color: isDisabled ? "rgba(255,255,255,0.5)" : "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            justifyContent:'space-between'
                            // cursor: isDisabled ? "not-allowed" : "pointer",
                          }}
                        >
                         <div style={{
                          display:'flex',
                          justifyContent:'space-between',
                          alignItems:'center'
                         }}>
                         <span>{type}</span>
                          {isDisabled && (
                            <Lock
                              size={14}
                              strokeWidth={1.5}
                              style={{
                                opacity: 0.6,
                                color: "#9ca3af", // neutral gray that fits dark themes
                              }}
                            />
                          )}
                         </div>
                        </Option>
                      );
                    })}


                  </Select>

                </div>
                <div className="dropdown-container-with-label">
                  <Typography sx={{ fontSize: "12px", color: "White", marginLeft: "10px" }}>Model</Typography>
                  <Select
                    defaultValue={selectedModel}
                    dropdownStyle={{ backgroundColor: "#3261ad", color: "#fff" }}
                    popupClassName="custom-dropdown"
                    className="model-dropdown"
                    value={selectedModel}
                    onChange={(value) => setSelectedModel((prevState) => value)}
                  >
                    {
                      models.map((model, index) => (
                        <Option key={index} value={model}>
                          {model}
                        </Option>
                      ))
                    }
                  </Select>
                </div>
                <div className="dropdown-container-with-label">
                  <Typography sx={{ fontSize: "12px", color: "White", marginLeft: "10px" }}>Year</Typography>
                  <Select
                    defaultValue={selectedYear}
                    dropdownStyle={{ backgroundColor: "#3261ad", color: "#fff" }}
                    popupClassName="custom-dropdown"
                    className={selected === "Smart Search" ? `year-dropdown-enabled` : `year-dropdown-disabled`}
                    value={selectedYear}
                    onChange={(value) => setSelectedYear((prevState) => value)}
                    disabled={selected !== "Smart Search"}
                  >
                    {
                      years.map((model, index) => (
                        <Option key={index} value={model}>
                          {model}
                        </Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
            }
            {/* <FormControlLabel
                      control={<WebSearchSwitch sx={{ m: 1 }} 
                      checked={selected === 'smart' ? false : true} 
                      onChange={handleSwitchChange}/>}
                      label="Web Search"
                      labelPlacement="start"
                      componentsProps={{
                        typography: {
                          sx: {color: 'white', fontSize: "12px !important"}
                        }
                      }}
                    /> */}

          </div>
          <div className="chat-screen-content-container">
            <div className="spacer-box-above-chat"></div>
            <div className="chat-content-body">
              {messages && messages.map((message, index) => {
                if (message.user == true) {
                  return (<div className="user-message-section-container">
                    <div className="user-message-section">
                      <div className="user-message-header">
                        <Typography variant="caption" className="user-message-header-text">{`You`}</Typography>
                        <img src={userChatIcon} alt="user-icon-white" className="user-msg-icon-small" />
                      </div>
                      <div className="user-message-content">
                        <Typography variant="caption" className="user-message-content-text">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >{message.text}</ReactMarkdown>
                        </Typography>
                      </div>
                      <div className="user-message-time-stamp-container">
                        <Typography variant="caption" className="user-message-header-text">{`${message.time}`}</Typography>
                      </div>
                    </div>
                  </div>)
                }
                else {
                  return (<div className="ai-message-section-container">
                    <div className="ai-message-section">
                      <div className="ai-message-header">
                        <img src={smartBotIconWithWhiteCircle} alt="smartbot-icon-white" className="msg-icon-small" />
                        <Typography variant="caption" className="ai-message-header-text">SMART <i>PULSE </i></Typography>
                      </div>
                      <div className="ai-message-content">
                        {message.text.reasoning ? (<>
                          <Typography variant="caption" className="ai-message-content-text" sx={{ fontWeight: "bold" }}>Reasoning:</Typography>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >{message.text.reasoning}</ReactMarkdown>
                          <br></br>
                        </>) : (<></>)}
                        {message.text.reasoning ? (<>
                          <Typography variant="caption" className="ai-message-content-text" sx={{ fontWeight: "bold" }}>Result:</Typography>
                        </>) : (<></>)}
                        <Typography variant="caption" className="ai-message-content-text">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >{message.text.result}</ReactMarkdown>
                        </Typography>
                        {message.text.citation?.length ? (
                          <>
                            <br></br>
                            <Typography variant="caption" className="ai-message-content-text" sx={{ fontWeight: "bold" }}>Sourced from:</Typography>
                          </>) : (
                          ""
                        )
                        }
                        <div
                          style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}
                        >
                          {message.text.citation?.map((val, id) => {
                            return (
                              <div
                                style={{
                                  borderRadius: "20px",
                                  border: "1.5px solid #2A64F8",
                                  color: "#2A64F8",
                                  padding: "5px 10px",
                                  fontWeight: "600",
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  handleButtonData(val, id);
                                }}
                              >
                                {Object.keys(val)}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <Typography variant="caption" className="ai-message-header-text">{`${message.time}`}</Typography>
                    </div>
                  </div>)
                }
              })}
              <div ref={chatEndRef} />
            </div>
          </div>
          <div className="spacer-box"></div>
          <div className="chat-input-section">
            <div className="chat-input-box">
              <textarea
                disabled={disabled}
                placeholder="Write a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="chat-input"
              />
              <button
                disabled={message.trim() === ""}
                className="send-icon"
                onClick={handleSend}
              >
                <img
                  src={smartBotSendMsgIcon}
                  alt="msg-send-icon"
                  width={"80%"}
                  height={"10%"}
                />
              </button>
            </div>
          </div>
          <div className="disclaimer-section">
            <div className="disclaimer-section-container">
              <Typography variant="caption" className="disclaimer-text" fontWeight="bold">Disclaimer : </Typography>
              <Typography variant="caption" className="disclaimer-text">The above response is generated by an AI language model. Occasionally,
                the responses could be incorrect or misleading or biased. Please refer credible sources for any critical information.</Typography>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};


export default AskMeAything;
