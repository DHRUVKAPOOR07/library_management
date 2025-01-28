import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

function DraggableDialog({ open, handleClose, handleAddBook }) {
  const [bookData, setBookData] = React.useState({
    title: '',
    author: '',
    category: '',
    availableCopies: 1,
    totalCopies: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    handleAddBook(bookData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
      <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
        Add Book
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new book, fill in the details below:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          name="title"
          value={bookData.title}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Author"
          type="text"
          fullWidth
          variant="outlined"
          name="author"
          value={bookData.author}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Category"
          type="text"
          fullWidth
          variant="outlined"
          name="category"
          value={bookData.category}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Available Copies"
          type="number"
          fullWidth
          variant="outlined"
          name="availableCopies"
          value={bookData.availableCopies}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Total Copies"
          type="number"
          fullWidth
          variant="outlined"
          name="totalCopies"
          value={bookData.totalCopies}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Book</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DraggableDialog;
