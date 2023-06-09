import React, {useEffect, useState} from "react";
import { SERVER_URL } from './constants'
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import AddCar from './AddCar.js';
import EditCar from "./EditCar";


function Carlist(){

    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);
    const columns = [
        {field: 'brand', headerName: 'Brand', width: 200},
        {field: 'model', headerName: 'Model', width: 200},
        {field: 'color', headerName: 'Color', width: 200},
        {field: 'year', headerName: 'Year', width: 150},
        {field: 'price', headerName: 'Price', width: 150},
        {
            field: '_links.self.href',
            headerName: '',
            sortable: false,
            filtrable: false,
            renderCell: row =>
            <EditCar data = {row} updateCar = {updateCar}/>
        },
        {
            field: '_links.self.href',
            headerName: '',
            sortable: false,
            filtrable: false,
            renderCell: row =>
            <button onClick = {() => onDelClick(row.id)}>
                 Delete
            </button>
        }
        ];
    useEffect (() => { 
        fetchCars();}, [])
    
    // fonction to fetch cars
    const fetchCars = () =>
        {
            fetch(SERVER_URL + 'api/cars')
            .then(response => response.json())
            .then(data => setCars([data._embedded.cars]))
            .catch(err => console.error(err))
        };
    // function to delete car
    const onDelClick = (url) =>{
        if (window.confirm("Are you sure to delete?")){
            fetch(url, { method :'DELETE'})
        .then(response => {
            if (response.ok){
            fetchCars();
            setOpen(true);
        }
            else{
                alert("Something went wrong")
            }
        })
        .catch(err => console.error(err))
        }
    }

    // Add a new Car
    const addCar = (car) => {
        fetch(SERVER_URL+'api/cars',
        {
            method : 'Post',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(car)
        })
        .then(response => {
            if(response.ok){
                fetchCars();
            }
            else{
                alert('Something went wrong');
            }
        })
        .catch(err => console.error(err));
    }
    // Update car
    const updateCar = (car, link) => {
        fetch(link,
        {
            method: 'Put',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(car)
        })
        .then(response => {
            if(response.ok){
                fetchCars();
            }
            else{
                alert('Something went wrong');
            }
        })
        .catch(err => console.error(err))

    }
    // Return function
    return (
        <React.Fragment>
            <AddCar addCar = {addCar}></AddCar>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={cars}
                    columns={columns}
                    getRowId={row => row._links.self.href}/>
                <Snackbar>
                    open = {open}
                    autoHideDuration = {2000}
                    onClose = { () => setOpen(false)}
                    message = "Car deleted"
                </Snackbar>
    </div>
        </React.Fragment>
    );
}

export default Carlist