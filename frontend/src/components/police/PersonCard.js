import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IoEye } from 'react-icons/io5';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton } from '@mui/material';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MissingPersonPDF from './MissingPersonPDF';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function PersonCard({ person, setPeopleData }) {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = React.useState(false);

    const handleAccept = async (id) => {
        try {
            const response = await axios.post('http://localhost:8000/accept-victim', { "id": id })
            enqueueSnackbar(response.data.status, { variant: "success" })
            setPeopleData((prev) => [...prev.filter((i) => i._id !== id)])

        }
        catch (err) {
            enqueueSnackbar('error occurred', { variant: "error" })
            console.log('error accepting', err)
        }
    }
    const handleDelete = async (id) => {
        setOpen(false)

        try {
            const response = await axios.post('http://localhost:8000/api/delete-victim', { "id": id })
            enqueueSnackbar(response.data.status, { variant: "success" })
            setPeopleData((prev) => [...prev.filter((i) => i._id !== id)])

        }
        catch (err) {
            enqueueSnackbar('error deleting', { variant: "error" })
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Card elevation={3} sx={{ width: 200, position: 'relative' }}>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Do you really want to delete?</DialogTitle>
                <DialogContent>
                    <p>Deleted items cannot be recovered</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" >
                        Close
                    </Button>
                    <Button onClick={() => handleDelete(person._id)} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <IconButton variant="outlined" color='error' size='small'
                onClick={() => setOpen(true)}
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0
                }}
            >
                <CancelIcon />
            </IconButton>

            <CardMedia
                component="img"
                alt="green iguana"
                height="200"
                image={person.image}
            />
            <CardContent>
                <Typography variant="body2" color="primary">
                    <strong>Full Name:</strong>  {person.firstname} {person.lastname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Age: {person.age}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Gender: {person.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Address: {person.address}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-around' }}>
                {person?.status === 'pending' ? (<>
                    <PDFDownloadLink document={<MissingPersonPDF people={[person]} />} fileName={`${person.firstname}.pdf`}>
                        <Button size="small" variant='outlined'><PictureAsPdfIcon /></Button>
                    </PDFDownloadLink>
                    < Button size="small" variant='outlined' onClick={() => handleAccept(person._id)}>Accept</Button>
                </>

                ) : (
                    <>
                        <PDFDownloadLink document={<MissingPersonPDF people={[person]} />} fileName={`${person.firstname}.pdf`}>
                            <Button fullWidth size="small" variant='outlined'>View in pdf</Button>
                        </PDFDownloadLink>
                    </>
                )


                }
            </CardActions>

        </Card >
    );
}