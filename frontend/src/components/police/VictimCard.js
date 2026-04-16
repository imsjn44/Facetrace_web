import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { PDFViewer} from '@react-pdf/renderer';
import MissingPersonPDF from './MissingPersonPDF';
import { MdDownload } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { Paper, Box, Modal } from '@mui/material';



const CardComponent = ({ person, onClose, onAccept }) => {

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const openPDF = () => {

    window.open('./Missingperson_Sita Kumari.pdf', '_blank');
  };
  return (
    <>

  <Paper
  elevation={5}
  sx={{
    height: 420,
    width: 250,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'



  }}

>

      <Card sx={{ maxHeight: onAccept ? 380 : 400, maxWidth: 220 }}>
         {person.status =="Request"  && (
          <Button onClick={onClose} size="large"> <ImCross /></Button>
     
          )}
        <CardMedia

          component="img"
          image={person.image}
          title={person.title}
        />
        <CardContent>

          <Typography variant="body1" color="text.secondary">
            <strong>Name:</strong> {person.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Age:</strong> {person.age}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Gender:</strong> {person.gender}
          </Typography>
        </CardContent>
        <CardActions
          sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
  <Button onClick={handleOpenModal} variant='contained' style={{ height: '30px', width:person.status =="Request" ? '30px' :'90%' }}><IoEye /></Button>
  <Modal
        open={openModal}
        onClose={handleCloseModal}
      
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', backgroundColor: '#fff', boxShadow: 24, p: 4 }}>
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <MissingPersonPDF people={[person]} />
          </PDFViewer>
         
          </Box>
      </Modal>

       {person.status =="Request"  && (
            <Button onClick={onAccept} variant='contained' size="small">Accept</Button>
      
            )}
        
        </CardActions>
      </Card>
      </Paper>

    </>
  )
}

export default CardComponent;