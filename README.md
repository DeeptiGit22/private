import "./Header.css";
// import logodark from "../../../assets/images/smart-logo-dark.png";
// import logolight from "../../../assets/images/smart-logo-light.svg";
import logolight from "../../../assets/images/header-logo-light1.png";
import logodark from "../../../assets/images/header-logo-dark1.png";
import poweredlight from "../../../assets/images/powered-by-light.png";
import powereddark from "../../../assets/images/powered-by-dark.png";
import { api } from "../../core/apis/configs/axiosUtils";
import userDark from "../../../assets/images/account-logo-dark.png";
import userLight from "../../../assets/images/account-logo-light.png";
import { Select } from "antd";
import { Stack, Switch, Typography, styled, Box, Tooltip } from "@mui/material";
import { withTheme } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
// import AskMeAything from "../AskMeAnything";
import { loginClient } from "../../common-partner-login-sdk";
import { HeaderView } from "./LogOut";
import process from "process";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { auditLogAPI } from "../../core/apis/SummaryOneAPI";
import PricingModal from "../ProFeature/PricingModal";
import ProFeature from "../ProFeature/ProFeature";
import MessageModal from "../ProFeature/MessageModal";
import reqPending from '../../../assets/images/req-pending.png'

// import { runLogOutTimer } from "../LandingPage/Auth";
const MuiAppBar = styled(withTheme("div"))((props) => ({
  backgroundColor: props.theme.palette.mode === "dark" ? "#1B1E23" : "#F8F8F8",
  padding: "20px 20px 20px 20px",
  boxShadow: 0,
}));

const MuiButton = styled(withTheme("Button"))((props) => ({
  border: "1px solid #366EFF",
  width: "115px",
  padding: "5px",
  color: "#366EFF",
  backgroundColor: props.theme.palette.primary.secondary,
  borderRadius: "4px",
  fontSize: "12px",
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: theme.palette.mode === "dark" ? "#000" : "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const Header = (props) => {
  const ThemeState = useSelector((state) => state.themeState.theme);
  const userEmail = useSelector((state) => state.filterTwo.useremail);
  const [persona, setPersona] = useState(localStorage.getItem("user_persona"));
  const sourcePersona = localStorage.getItem("user_source_persona");
  const location = useLocation();
  // const socketmessage = useSelector((state) => state.filterTwo.socketmessage);
  const [mode, setMode] = useState("");
  const [username, setusername] = useState(userEmail || "");
  const cleanedName = localStorage.getItem("Data_API_name").replace(/^(MR\. |MS\. MRS\.)\s*/i, '').trim();
  const headerTitle = `${cleanedName}, ${localStorage.getItem("Data_API_vertical")}, ${localStorage.getItem("Data_API_department_code")}`;
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const navVal = useSelector((state) => state.themeState.showNav);
  const token = localStorage && localStorage.getItem("token");
  const currentTimeAsMs = Date.now();
  const timecheck =
    token && jwtDecode(token).exp < (currentTimeAsMs + 1000 * 60 * 30) / 1000;
  const [showPlans, setShowPlans] = useState(false);
  const [countAiReportGenerated, setCountAiReportGenerated] = useState(() => {
    return Number(localStorage.getItem("countAiReportGenerated")) || 0;
  });
  const [planStatus,setPlanStatus] = useState('');
const [showPendingReqModal, setShowPendingReqModal] = useState(false);
const[showViewPlans,setShowViewPlans] = useState(false);

  useEffect(() => {
    setMode(ThemeState);
  }, [ThemeState]);

  useEffect(() => {
    if (props?.propstate === "route1") {
      if (localStorage.getItem("token")) {
        // const token = localStorage.getItem("token");
        if (timecheck) {
          let url = process.env.REACT_APP_ENV_KEY;
          localStorage.clear();
          window.location.href = `https://msil-adfs-auth-server.auth.ap-south-1.amazoncognito.com/logout?client_id=363lfg0p4c54q92ean80uqn9mq&logout_uri=${url}`;
        }
      }
    }
  }, [timecheck, props?.propstate]);

  useEffect(() => {
    setusername(localStorage.getItem("emailToken"));
    dispatch({
      type: "USER_EMAIL",
      useremail: localStorage.getItem("emailToken"),
    });
  }, [userEmail, dispatch]);

  useEffect(() => {
    dispatch({
      type: "PERSONACOUNTRY",
      persona: localStorage.getItem("user_persona"),
    });
    setPersona((prevState) => localStorage.getItem("user_persona"));
  }, [location]);



  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePersonaChange = async (val) => {
    setPersona((prevState) => val);
    localStorage.setItem("user_persona", val);
    const payload = {
      api: "persona_change",
      page: "header",
      persona_changed: val,
    };
    await auditLogAPI.post(payload);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    // dispatch(expandSidebar(!drawerOpen));
  };

  const appLogoClick = () => {
    // navigate(config.routes.home.root);
  };

  const logout = () => {
    let url = process.env.REACT_APP_ENV_KEY;
    localStorage.clear();
    loginClient.federatedLogout("363lfg0p4c54q92ean80uqn9mq", url);
  };

  const handleViewPlans = () => {
    // setShowPlans(true);
    // console.log(showPlans,'showplan');
    localStorage.setItem('countAiReportGenerated', countAiReportGenerated + 1);
    setCountAiReportGenerated((prev) => prev + 1);
  }

  useEffect(() => {
    localStorage.setItem('countAiReportGenerated', countAiReportGenerated);
    localStorage.setItem('planStatus', 'NA')
    setPlanStatus(localStorage.getItem('planStatus'))
  }, [])


  return (
    <MuiAppBar>
      <div
        className="App-logo"
        style={{ gridTemplateColumns: navVal ? "15% 85%" : "15% 85%" }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ width: ThemeState === "dark" ? "140px" : "140px" }}>
            {ThemeState === "dark" ? (
              <img src={logodark} alt="logo" />
            ) : (
              <img src={logolight} alt="logo" />
            )}
          </div>
          {/* <AskMeAything /> */}
        </div>
        <div className="power-logo-block">
          {/* {(sourcePersona !== "All" && persona) ? (
            <div className="persona-section">
              <Typography
                style={{
                  fontSize: "12px",
                }}
              >
                Persona:
              </Typography>
              <Typography
                style={{
                  fontSize: "12px",
                }}
              >
                {persona}
              </Typography>
            </div>
          ) : (
            <></>
          )} */}
          {
            (
              <div className="persona-choose-section">
                <Typography
                  style={{
                    fontSize: "12px",
                  }}
                >
                  Persona
                </Typography>
                <Select
                  placeholder="Persona"
                  variant="filled"
                  className={ThemeState === "dark" ? "persona-select-dark" : "persona-select-light"}
                  popupClassName={ThemeState === "dark" ? "persona-select-popup-dark" : "persona-select-popup-light"}
                  value={persona}
                  style={{ width: "160px" }}
                  options={[

                    { label: "Engineering", value: "Engineering" },
                    { label: "International Marketing", value: "International Marketing" },
                    { label: "Product Planning", value: "Product Planning" },
                    { label: "Enterprise", value: "Enterprise" }

                  ]}
                  onChange={(val) => handlePersonaChange(val)}
                />
              </div>
            )
          }
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              style={{
                fontSize: "10px",
                display: mode === "dark" ? "none" : "block",
              }}
            >
              LIGHT MODE
            </Typography>
            <Typography
              style={{
                fontSize: "10px",
                display: mode === "light" ? "none" : "block",
              }}
            >
              DARK MODE
            </Typography>
            <AntSwitch
              onChange={() => {
                dispatch({
                  type: "THEME_CHANGE",
                  themeValue: mode === "dark" ? "light" : "dark",
                });
              }}
              checked={mode === "dark" ? true : false}
              inputProps={{ "aria-label": "ant design" }}
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              style={{
                fontSize: "12px",
                letterSpacing: "2px",
                border: "2px solid #2D3394",
                padding: "6px 20px",
                borderRadius: "7px",
                color: "#2D3394",
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={handleViewPlans}

            >
              {/* Needs to get this value dynamically */}
              LITE
            </Typography>
            {/* {showPlans && <PricingModal onClose={() => setShowPlans(false)}/>} */}
            {/* {countAiReportGenerated == 1 && <ProFeature count={countAiReportGenerated} />} */}
            {planStatus == '' || 'NA' ? countAiReportGenerated == 1 ? <ProFeature count={countAiReportGenerated} /> : showPlans && <PricingModal onClose={() => setShowPlans(false)} /> :
              planStatus == 'pending' ? <MessageModal
                imgSrc={reqPending}
                title="Subscription Upgrade Lite to Pro Approval pending"
                description="Good things take time: Your Upgrade request is under review."
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "20px",
                    width: "100%",
                  }}
                >
                  <button
                    style={{
                      padding: "8px 16px",
                      width: "100%",
                      backgroundColor: "#484848",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    onClick={() => {
                      setShowViewPlans(true);
                      setShowPendingReqModal(false);
                    }}
                  >
                    View Plans
                  </button>
                  <button
                    style={{
                      padding: "8px 16px",
                      width: "100%",
                      backgroundColor: "#484848",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Logout
                  </button>
                </div>
              </MessageModal> : ''}
          </Stack>
          <div>
            {/* <HeaderView
              userEmail={username || ""}
              handlers={{
                handleMenu,
                handleClose,
                handleDrawerOpen,
                appLogoClick,
                logout,
              }}
              anchorEl={anchorEl}
              ThemeState={ThemeState}
            /> */}

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              padding="5px"
              border={`1.2px solid ${ThemeState === "dark" ? "#fff" : "#000"}`}
              borderRadius="8px"
              maxWidth="200px"
              overflow="hidden"
              height="35px"
            >
              <Box>
                <Tooltip title={headerTitle} arrow>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "150px",
                      color: ThemeState === "dark" ? "#fff" : "#000",
                      fontWeight: "bold",
                      fontSize: "10px",
                    }}
                  >
                    {headerTitle}
                  </Typography>
                </Tooltip>
              </Box>
              <img
                src={ThemeState === "dark" ? userDark : userLight}
                className="header-profile-icon"
                alt="profileIcon"
              />
            </Box>
          </div>
          <div
            style={{ width: "110px", marginTop: "-8px", marginLeft: "10px" }}
          >
            {ThemeState === "dark" ? (
              <img src={powereddark} alt="logo" />
            ) : (
              <img src={poweredlight} alt="logo" />
            )}
          </div>
        </div>
      </div>
    </MuiAppBar>

  );
};

export default Header;
