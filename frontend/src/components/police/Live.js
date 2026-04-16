import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import Webcam from "react-webcam";
import axios from 'axios'
import * as faceapi from 'face-api.js';

function Live({ setMatches }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [start, setStart] = React.useState(false);
  const [boundingBox, setBoundingBox] = React.useState(null);
  const [socket, setSocket] = React.useState(null);


  useEffect(() => {

    const loadModels = async () => {

      const MODEL_URL = '/models';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    }
    loadModels();
  }, [])

  useEffect(() => {

    const socket = new WebSocket('ws://localhost:8000/ws/face-detect/');
    setSocket(socket);

    socket.onopen = (e) => {
      socket.send(JSON.stringify({
        'type': 'init',
        'msg': 'websocket initialization'
      }));
    };

    socket.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if (payload['type'] === 'match') {
        const anchor = payload['victim_img'];
        const positive = payload['match_img'];
        const datetime = payload['datetime'];

        setMatches(prev => [...prev, { 'anchor': anchor, 'positive': positive, 'datetime': datetime }]);
      }
    };

    return () => {
      socket.close();
    }
  }, [])

  useEffect(() => {
    // Function to be executed at intervals

    if (!start) {
      handleStop();
      return;
    }
    const intervalFunction = async () => {
      await sendToBackend();
    };
    const intervalFunction2 = async () => {
      await capture();



    };
    const intervalId = setInterval(intervalFunction, 700);
    const intervalId2 = setInterval(intervalFunction2, 100);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
    };
  }, [start]); // Empty dependency array ensures this effect runs only once on component mount

  const drawBoundingBoxNew = (detections) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (detections.length === 0) {
      ctx.clearRect(0, 0, canvas.height, canvas.width);
      return
    }
    canvas.width = webcamRef.current.video.width;
    canvas.height = webcamRef.current.video.height;
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.beginPath();
    detections.forEach(d => {
      const bbox = d.box;
      ctx.rect(bbox.x, bbox.y, bbox.width, bbox.height);
    });
    ctx.stroke();

  }

  const sendToBackend = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const data = JSON.stringify({
      'type': 'image',
      'value': imageSrc,
      'datetime': new Date().toLocaleString(),


    })
    if (socket) {

      socket.send(data)
    }

  }
  const capture = async () => {
    const input = webcamRef.current.video
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const detections = await faceapi.detectAllFaces(input)
    const drawDetections = faceapi.resizeResults(detections, { width: input.width, height: input.height })

    drawBoundingBoxNew(drawDetections);


  }

  const handleStop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.height, canvas.width);

  }


  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 1 }}>

      <Webcam
        ref={webcamRef}
        screenshotFormat='image/jpeg'
        width={500}
        height={375}

      />
      <canvas ref={canvasRef} style={{
        border: '2px solid black',
        position: 'absolute',
        left: 0,
        width: 500,
        height: 375
      }} />
      <Button sx={{
        width: { xs: '100%', md: '500px' },

      }} onClick={() => setStart(p => !p)} variant='contained'>{start ? 'Stop' : 'Start'}</Button>
    </Box>
  )
}


export default Live;