import React, { useState, useContext } from "react";
import Header from "../components/Header";
// import { API_TOKEN } from "../utils/constants";
import ReactPlayer from "react-player";
import { Box, Typography, Button, Paper } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { TransactionContext } from "../context/TransactionContext";
import { toast } from "react-toastify";
import { create } from "ipfs-http-client";

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [videoid, setVideoId] = useState("");
  const [videoname, setVideoname] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [thumbnailId, setThumbnailId] = useState("");

  const { uploadVideoData, isMining } = useContext(TransactionContext);

  function getFiles(event) {
    event.preventDefault();
    const fileInput = event.target;
    setVideo(fileInput.files[0]);
    setVideoname(fileInput.files[0].name);
  }
  function getThumbnail(event) {
    event.preventDefault();
    const fileInput = event.target;
    setThumbnailName(fileInput.files[0].name);
    setThumbnail(fileInput.files[0]);
  }

  function makeIPFSClient() {
    return create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
  }
  //upload title, thumbnail, video in ipfs
  async function storeFiles() {
    try {
      const client = makeIPFSClient();
      const cid = await client.put([video]);
      setVideoId(cid);
      console.log("stored files with cid:", cid);
      const thumbnailid = await storeThumbnail();
      setThumbnailId(thumbnailid);
      console.log("cid for thumb", thumbnailid);

      const contentHash = cid + `/${videoname}`;
      const thumbnailHash = thumbnailid + `/${thumbnailName}`;
      const detailHash = JSON.stringify({
        title: title,
        description: description,
        uploadDate: new Date(),
      });

      uploadVideoData(contentHash, thumbnailHash, detailHash);

      return cid;
    } catch (error) {
      console.log("Error storing files:", error);
    }
  }

  async function storeThumbnail() {
    try {
      const client = makeIPFSClient();
      const cid = await client.put([thumbnail]);
      console.log("thubnail cid:", cid);
      console.log("TITLE:", title);

      // some function to store on blockchain

      return cid;
    } catch (error) {
      console.log("Error storing thumbnail:", error);
    }
  }
  const handleUpload = () => {
    console.log(video, thumbnail, title);
    if (video && thumbnail && title && !isSubmitted) {
      setIsSubmitted(true);
      storeFiles();
    } else {
      window.alert("All fields are requried!");
    }
  };

  isMining && toast.loading("Mining...", { autoClose: false });

  return (
    <>
      <Header />
      <Box mt={10} pl={5} sx={{ display: "flex", flexDirection: "column", backgroundColor: "white", color: "black", leftMargin:"20px", rightMargin:"20px" }}>
        <Paper elevation={3} sx={{ background: "white", color: "black" }}>
          <Box
            p={5}
            sx={{
              display: "flex",
              gap: "20px",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              flex: 0.5,
            }}
          >
            <Box>
              <Typography fontFamily={"Kalam"} fontSize="25px" mb={1}>Upload Video</Typography>
              <input
                required
                type="file"
                accept="video/*"
                label="Video"
                onChange={getFiles}
              />
            </Box>
            <Box>
              <Typography fontFamily={"Kalam"} fontSize="25px" mb={1}>Choose thumbnail</Typography>
              <input
                required
                type="file"
                accept="image/*"
                label="Thumbnail"
                onChange={getThumbnail}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
            <Typography fontFamily={"Kalam"} fontSize="25px" mb={1}>Add Video Title</Typography>
              <TextField
                required
                label="Video Title"
                variant="outlined"
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
                sx={{ width: "100%", color: "white" }}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
            <Typography fontFamily={"Kalam"} fontSize="25px" mb={1}>Add Video Thumbnail</Typography>
              <TextField
                label="Video Description"
                variant="outlined"
                size="small"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
                sx={{ width: "100%", color: "white", border:"2px", borderColor:"white"}}
              />
            </Box>
            <Button variant="contained" onClick={handleUpload}
            sx={{
              backgroundImage: `linear-gradient(to right, #8DF3FD, #99BFFF, #C1FCB4, #FCFFA0, #FFB4FF)`,
              color: "black", // Set your text color accordingly
            }}>
              {isSubmitted ? (
                videoid && thumbnailId ? (
                  <Typography fontFamily={"Kalam"}>Uploaded</Typography>
                ) : (
                  <>
                    <Typography  fontFamily={"Kalam"} mr={5}>Uploading...</Typography>
                    <CircularProgress sx={{ color: "#ffff" }} />
                  </>
                )
              ) : (
                <Typography fontFamily={"Kalam"} fontSize="25px" backgroundImage="linear-gradient(to right, #8DF3FD, #99BFFF, #C1FCB4, #FCFFA0, #FFB4FF)">Upload</Typography>
              )}
            </Button>
          </Box>
        </Paper>
        <Box sx={{ flex: 0.5 }}></Box>
        <Box
          sx={{
            justifyContent: "center",
            alignContent: "center",
            flex: 0.4,
          }}
        >
          {videoid && thumbnailId ? (
            <ReactPlayer
              controls
              url={`https://ipfs.io/ipfs/${videoid}/${videoname}`}
              light={`https://ipfs.io/ipfs/${thumbnailId}/${thumbnailName}`}
            />
          ) : (
            <Typography marginTop={"20px"}
            fontFamily={"Kalam"}
            align="center"
            fontSize={"20px"}>
              Upload Video to Watch it Here.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default VideoUpload;
