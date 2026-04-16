import { Box, Button, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect } from 'react'
import shah from '../images/659131f7e52778315c738775.jpg'

function Test() {

    const [img, setImg] = React.useState(null)

    const handleClick = async () => {
        const socket = new WebSocket('ws://localhost:8000/ws/img/');
        socket.onopen = (e) => {
            socket.send(JSON.stringify({
                'type': 'init',
                'msg': 'websocket initialization'
            }));
        };
        socket.onmessage = (e) => {
            console.log(JSON.parse(e.data))
        }

        // const response = await axios.get('http://localhost:8000/img')
        // console.log(response)
        // const blob = new Blob([i], { type: 'image/jpeg' })
        // const reader = new FileReader();

        // reader.onload = function (event) {
        //     // Once the FileReader reads the data, create an image element
        //     const image = new Image();
        //     image.src = event.target.result;
        //     console.log(reader.result)
        //     // Add the image to the DOM or perform any other actions
        //     // setImg(reader.src);
        // };

        // Read the blob as a data URL (this will convert the raw data to a base64 encoded string)
        // reader.readAsDataURL(i);

    }

    const handleTest =  (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onload = function (event) {
            
            console.log(reader.result)
            setImg(reader.result);
        };
        reader.readAsDataURL(file);
    }

    return (
        <Box>
            <Typography>Test</Typography>
            <Button onClick={handleClick}>Click</Button>
            <input type="file" onChange={handleTest} />
            {/* <Button onClick={handleTest}>Click2</Button> */}
            <img src={img} alt="test" />
        </Box>
    )
}

export default Test