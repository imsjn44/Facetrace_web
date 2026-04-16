import React from "react";
import CallIcon from "@mui/icons-material/Call";
import Avatar from "@mui/material/Avatar";
import SendIcon from '@mui/icons-material/Send';
import TextField from "@mui/material/TextField";
import { Container, Box, Typography } from "@mui/material";

const Posts = () => {
  
  return (
    <>
      <React.Fragment>
        <Container>
          <Box sx={{ justifyContent: "center", display: "flex", mt: 5 }}>
            <Box
              sx={{
                boxShadow: 24,
                maxWidth: "380px",
                borderRadius: "15px",
              }}
            >
              <Box sx={{ display: "flex", padding: 3 }}>
                {" "}
                <Avatar
                  sx={{ borderRadius: "360px" }}
                  alt="Remy Sharp"
                  src="https://upload.wikimedia.org/wikipedia/en/0/06/Nepal_Police_logo.png"
                />
                <Typography>
                  <Typography sx={{ padding: 0.2, paddingLeft: 1 }}>
                    Nepal Police
                  </Typography>
                  <Typography
                    sx={{ paddingLeft: 1.2, fontSize: 12, color: "gray" }}
                  >
                    Kathmandu, Head office
                  </Typography>
                </Typography>
                <CallIcon
                  sx={{
                    marginLeft: "auto",
                    border: "2px dotted black",
                    borderRadius: "360px",
                    padding: 1,
                    color: "green",
                    cursor: "pointer",
                  }}
                />
              </Box>
              <Typography sx={{ paddingLeft: 2, paddingRight: 2 }}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos
                optio labore vel? At cumque fugit modi praesentium ducimus
                explicabo veniam distinctio, neque voluptas fugiat voluptatum
                vitae possimus nihil architecto deserunt.
              </Typography>{" "}
              <Box
                sx={{ mb: 1 }}
                maxWidth="380px"
                component="img"
                src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202210/untitled_design_-_2022-10-31t122306.087-sixteen_nine.png?VersionId=OqgLce4SB0vXbl8tLYwDJff5rN5xUJd3&size=690:388"
              />
             
             <Box paddingLeft="20px" sx={{display:"flex"}}> 
             <TextField
             multiline
             fullWidth
                id="standard-basic"
                label="Comment if you have seen"
                variant="standard"
                sx={{ mb: 2, textAlign: "center",}}
                
              />
               <SendIcon sx={{padding:3,cursor:"pointer"}} />
              </Box>
            </Box>
          </Box>
        </Container>
      </React.Fragment>
    </>
  );
};

export default Posts;
