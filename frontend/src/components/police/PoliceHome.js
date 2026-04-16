import { Grid, Paper, Box, Typography, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import MissingPersonGridCommon from "./MissingPersonGridCommon";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CurrentMissingGrid from "./CurrentMissingGrid";
import MatchPage from "./MatchPage";
import FoundPeople from "./FoundPeople";
import { useSnackbar } from "notistack";

const NoticeTab = () => {
  const noticeTab = [
    "Missing Person Request",
    "Missing People",
    "Found People",
    "FaceTrace",
  ];
  const status = ["pending", "accepted", "matched"];
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [peopleData, setPeopleData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPeopleData(0);
  }, []);

  const fetchPeopleData = async (i) => {
    setSelectedItemIndex(i);
    if (i >= 2) {
      return;
    }
    try {
      const token = localStorage.getItem("access_token");
      console.log("TOKEN:", token);
      const response = await axios.post(
        "http://localhost:8000/api/victims",
        { status: status[i] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPeopleData(response.data);
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Authentication Failed", { variant: "error" });
      navigate("/login");
    }
  };

  const renderComponent = () => {
    if (selectedItemIndex === 3) {
      return <MatchPage />;
    } else if (selectedItemIndex === 2) {
      return <FoundPeople />;
    }
    return (
      <MissingPersonGridCommon
        type={noticeTab[selectedItemIndex]}
        peopleData={peopleData}
        setPeopleData={setPeopleData}
      />
    );
    // switch (selectedItemIndex) {
    //   case 0:
    //     return <MissingPersonGridCommon peopleData={peopleData} setPeopleData={setPeopleData}/>;
    //   case 1:
    //     return <CurrentMissingGrid peopleData={peopleData} setPeopleData={setPeopleData} />;
    //   case 2:
    //     return <FoundPerson peopleData={peopleData} setPeopleData={setPeopleData} />;
    //   case 3:
    //     return < FoundPerson />;
    //   default:
    //     return null;
    // }
  };

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: { sm: 6, md: 1 },
          pl: 5,
          pl: 5,
        }}
      >
        {noticeTab.map((noticetab, index) => (
          <Grid
            item
            md={3}
            key={index}
            sx={{
              p: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={() => fetchPeopleData(index)}
              disableRipple={true}
            >
              <Paper
                sx={{
                  "&:hover": {
                    backgroundColor: "rgb(30, 127, 178)",
                    "& .icon, & .text": {
                      color: "white",
                    },
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                    transform: "translateY(-10px)",
                  },
                  width: "300px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition:
                    "background-color 0.3s boxShadow 0.3s transform 0.5s",
                  backgroundColor: "transparent",
                  transform: "translateY(0)",
                }}
              >
                <CampaignIcon
                  className="icon"
                  sx={{ fontSize: "1.7rem", color: "rgb(30, 127, 178)" }}
                />
                <Typography
                  className="text"
                  variant="body2"
                  sx={{ marginLeft: "8%", color: "rgb(30, 127, 178)" }}
                  style={{ fontWeight: "bold" }}
                >
                  {noticetab}
                </Typography>
              </Paper>
            </IconButton>
          </Grid>
        ))}
      </Grid>
      {selectedItemIndex !== null && renderComponent()}
    </>
  );
};

export default NoticeTab;
