    import React, { useState, useEffect } from 'react';
    import DeleteIcon from '@mui/icons-material/Delete'; 
    // import Box from '@mui/material/Box';
    import Skeleton from '@mui/material/Skeleton';
    import {
    Box,
    Paper,
    Toolbar,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    } from '@mui/material';
    import PropTypes from 'prop-types';
    import Grid from '@mui/material/Grid';

    import { alpha } from '@mui/material/styles';
    import SearchIcon from '@mui/icons-material/Search';
    import FilterListIcon from '@mui/icons-material/FilterList';
    import { DataGrid, GridToolbar } from '@mui/x-data-grid';
    import EditIcon from '@mui/icons-material/Edit';
    import SaveIcon from '@mui/icons-material/Save';
    import CancelIcon from '@mui/icons-material/Close';
import { findRowsToDeselect } from '@mui/x-data-grid/hooks/features/rowSelection/utils';

    export default function EditableTable() {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [rowModesModel, setRowModesModel] = useState({});
    const handleDelete = async (id) => {
        try {
        const response = await fetch(`http://localhost:8000/api/users/removebook`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId: id }), // Pass bookId in body
        });
        if (response.ok) {
            setBooks((prev) => prev.filter((book) => book._id !== id));
            console.log('Book deleted successfully');
        } else {
            const result = await response.json();
            console.error('Failed to delete book:', result.message);
        }
        } catch (error) {
        console.error('Error deleting book:', error.message);
        }
    };
    
    useEffect(() => {
        const fetchBooks = async () => {
            try {
              const response = await fetch('http://localhost:8000/api/users/getbooks',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
              });
              const result = await response.json();
              if (response.ok) {
                const booksWithId = result.data.map((book) => ({
                  ...book,
                  id: book._id, // Ensure `id` matches `_id`
                }));
                console.log(booksWithId);
                setBooks(booksWithId);
              } else {
                console.error(result.message || 'Failed to fetch books');
              }
            } catch (error) {
              console.error('Error fetching books:', error.message);
            }
          };
          
        fetchBooks();
    }, []);
    
    
    
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleRowEditStart = (params) => {
        setRowModesModel((prev) => ({
        ...prev,
        [params.id]: { mode: 'edit' },
        }));
    };
    const processRowUpdate = async (updatedRow) => {
        try {
            // Send updated row to the backend
            const response = await fetch('http://localhost:8000/api/users/updateBook', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    _id: updatedRow.id, // Use `id` mapped from `_id`
                    title: updatedRow.title,
                    author: updatedRow.author,
                    category: updatedRow.category,
                    availableCopies: updatedRow.availableCopies,
                    totalCopies: updatedRow.totalCopies,
                }),
            });
    
            if (response.ok) {
                const result = await response.json();
                const updatedData = result.data;
    
                // Update the local state with the new row data
                setBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.id === updatedRow.id ? { ...updatedRow, ...updatedData } : book
                    )
                );
    
                return { ...updatedRow, ...updatedData }; // Return the updated row to the DataGrid
            } else {
                const error = await response.json();
                console.error('Failed to update book:', error.message);
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error updating book:', error.message);
            throw error;
        }
    };
    
      
      

      
    const handleRowEditStop = async (updatedRow) => {
        try {
            const response = await fetch('http://localhost:8000/api/users/updateBook', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: updatedRow.id, // Pass `id` for identification
                    title: updatedRow.title,
                    author: updatedRow.author,
                    category: updatedRow.category,
                    availableCopies: updatedRow.availableCopies,
                    totalCopies: updatedRow.totalCopies,
                }),
            });
    
            if (response.ok) {
                const result = await response.json();
                // Update local state with the updated book data
                setBooks((prev) =>
                    prev.map((book) => (book.id === result.data.id ? result.data : book))
                );
            } else {
                const error = await response.json();
                console.error('Failed to update book:', error.message);
            }
        } catch (error) {
            console.error('Error updating book:', error.message);
        }
    };
    
    
    const rowsWithSno = books.map((book, index) => ({
        ...book,
        sno: index + 1,
    }));
    
    
    const columns = [
        
        {
            field: 'sno',
            headerName: 'S.No.',
            width: 100,
            // valueGetter: (params) => params.api.getRowIndex(params.id) + 1,

        },
        
            
        { field: 'id', headerName: 'ID', width: 250 },
        { field: 'title', headerName: 'Title', width: 200, editable: true },
        { field: 'author', headerName: 'Author', width: 250, editable: true },
        { field: 'category', headerName: 'Category', width: 200, editable: true },
        { field: 'availableCopies', headerName: 'Available Copies', type: 'number', width: 200, editable: true },
        { field: 'totalCopies', headerName: 'Total Copies', type: 'number', width: 200, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 150,
            
            getActions: (params) => {
                
                const isInEditMode = rowModesModel[params.id]?.mode === 'edit';
                if (isInEditMode) {
                    return [
                        <IconButton
                            color="primary"
                            onClick={() => setRowModesModel((prev) => ({ ...prev, [params.id]: { mode: 'view' } }))}
                             // Process the updated row
                        >
                            <SaveIcon />
                        </IconButton>,
                        <IconButton
                            color="secondary"
                            onClick={() => handleRowEditStop(params.row)}
                        >
                            <CancelIcon />
                        </IconButton>,
                    ];
                }
                return [
                    <IconButton
                        color="primary"
                        onClick={() =>
                            setRowModesModel((prev) => ({ ...prev, [params.id]: { mode: 'edit' } }))
                        }
                    >
                        <EditIcon />
                    </IconButton>,
                    <IconButton
                        color="error"
                        onClick={() => handleDelete(params.id)}
                    >
                        <DeleteIcon />
                    </IconButton>,
                ];
            },
        }
        
    ];
    

    const filteredBooks = books
  .filter((book) => book && book.id) 
  .filter((book) =>
    book.title?.toLowerCase().includes(searchQuery) ||
    book.author?.toLowerCase().includes(searchQuery)
  )
  .map((book, index) => ({
    ...book,
    sno: index + 1, // Add serial number
  }));

  const variants = ['h1'];

  function TypographyDemo(props) {
    const { loading = false } = props;
  
    return (
      <div>
        {variants.map((variant) => (
          <Typography component="div" key={variant} variant={variant} width={"83vw"} marginLeft={"20px"}>
            {loading ? <Skeleton /> :""}
            {loading ? <Skeleton /> :""}
            {loading ? <Skeleton /> :""}
            {loading ? <Skeleton /> :""}
            {loading ? <Skeleton /> :""}
            {loading ? <Skeleton /> :""}
          </Typography>
        ))}
      </div>
    );
  }
  TypographyDemo.propTypes = {
    loading: PropTypes.bool,
  };

    return (
        <Box sx={{ width: '100%', p: 3,marginTop:"-45px" }}>
        <Paper sx={{ width: '85vw', mb: 2 ,ml:-43}}>
                   <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }}>
            <Typography variant="h6" sx={{ flex: '1 1 500px' }}>
                Books
            </Typography>
            <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                onChange={handleSearchChange}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <SearchIcon />
                    </InputAdornment>
                ),
                }}
            />
            <Tooltip title="Filter list">
                <IconButton>
                <FilterListIcon />
                </IconButton>
            </Tooltip>
            </Toolbar>
            {filteredBooks.length === 0 ? (
  <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
     <Grid container spacing={8}>
      <Grid item xs>
        <TypographyDemo loading />
      </Grid>
      <Grid item xs>
        <TypographyDemo />
      </Grid>
    </Grid>
  </Typography>
) : (
    <DataGrid
        // rows1={rowsWithSno}
        rows={filteredBooks}
        
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        editMode="row"
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error('Update Error:', error.message)}
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        getRowId={(row) => row.id}
        />
        )}
        

    </Paper>
    </Box>
);}
