import React, { useContext } from "react";
import landingImage from "../images/landing.png";
import { Box, Button, Typography } from "@mui/material";
import { TransactionContext } from "../context/TransactionContext";
import Dashboard from "./Dashboard";
// import bgd from "../images/bdg.png";

const Landing = () => {
  const { connectWallet, currentAccount } = useContext(TransactionContext);
  return currentAccount ? (
    <Dashboard />
  ) : (
    <Box
    sx={{ 
      backgroundColor: "black",
      color: "white",
      height: "100vh" }}>
      <Box 
      sx={{ 
        backgroundcolor: "black",
        display: "flex", 
        flexDirection:"column",textAlign: "center", padding: "20px" }}>
        <Box sx={{ flex: 0.5 }}>
          <Typography
          fontFamily={"Kalam"}
            fontWeight={400}
            variant="h4"
            sx={{ marginTop: "20px", marginBottom: "20px" }}
          >
            Share Videos
            <br />
            Share Emotions
          </Typography>
          <img src={landingImage} width="370px" alt="landing_image" />
        </Box>

        <Box sx={{ flex: 0.5, marginTop: "60px" }}>
          <Typography 
          fontFamily={"Kalam"}
          fontWeight={600} variant="h4">
            GO INCOGNITO with WEB3
          </Typography>
          <Button
            onClick={connectWallet}
            variant="contained"
            color="primary"
            sx={{
              color:"black",
              fontFamily: "Kalam", 
              margin: "50px auto",
              height:"80px",
              width:"300px",
              fontSize:"30px",
              backgroundImage: `linear-gradient(to right, #8DF3FD, #99BFFF, #C1FCB4, #FCFFA0, #FFB4FF)`,
            }}
          >
            Connect Wallet
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
