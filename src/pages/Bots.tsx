import React,{useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import {fetcher} from "../utils/axios";
import {UserResponse} from "../utils/types";
import * as Yup from 'yup';

import {RootState} from "../store";
import { makeStyles } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Toolbar, AppBar,  Container,
  Grid,Typography } from '@material-ui/core';
  import { TextField } from '@material-ui/core';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { Button } from '@material-ui/core';
import ProtectedRoute from "../routes/ProtectedRoute";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface LocationState {
    userId: string;
}
interface Bot  {
    Client_ID: string;
    Status: string;
    IP_Address:string;
    Comission:number;
    TradedVolume:Number;
    Profit:Number;
    DateStared:String;
}
 const INITIAL_FORM_STATE_TEST = {
  comission_address: '',
  comission_percentage:''
}
const FORM_VALIDATION = Yup.object().shape({
    comission_address: Yup.string()
    .required('Required'),
    comission_percentage: Yup.number()
    .required('Required'),
});
const Bots = () => {
  const account = useSelector((state: RootState) => state.auth.account);
  const [rows,setRows] = useState<Bot[] | null>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  // @ts-ignore
  const userId = account?.id;

  const user = useSWR<UserResponse>(`/user/${userId}/`, fetcher)

  const handleLogout = () => {
    dispatch(authSlice.actions.setLogout());
    history.push("/");
  };
     useEffect( () => {
        fetchItems();
    }, []);
     const [items, setItems] = useState<Bot[] | null>(null);

    
    const useStyles = makeStyles({
      close: {
     
       "&:hover": 
       {
        color: "red",
       }
      }
     });
     const classes = useStyles();
      const info =  useSWR<Bot[]>(`auth/bot`,fetcher);
      
    const fetchItems = async () => {
      
        const data = await fetch(`${process.env.REACT_APP_API_URL}/auth/bot`);
        {/*
          IP_ADDRESS:
          Status: 
          CLIENT_ID: 
          Profit: 
          COMMISSION:
          Traded_Volume:
          Date_Started:
         */}
        const items = await data.json();
       
        setItems(items);
        {/*console.log("Items Are");
        console.log(items)*/}
        setRows(items)
    };
   
  return (
    <div className="App">
      <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" style={{ flex: 1 }}>
              Sniping Bot Admin Panel
            </Typography>
              <Button  variant="contained" color="primary" onClick={handleLogout}>Logout</Button>       
          </Toolbar>
        </AppBar>
          <div className="bot-wrapper">
            <div className="bot-inner">  
              
              <Typography variant="h6" >
              Commission Settings
            </Typography>
        <Grid container>
          <Grid item xs={12}>
            <Container maxWidth="md" >
                <Formik
                        initialValues={{
                         ...INITIAL_FORM_STATE_TEST
                  }}       
                  validationSchema={FORM_VALIDATION}
                  onSubmit ={ async  (values, actions) => 
                  {
                    console.log(JSON.stringify(values));  
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/comission/`, values)
                    .then(function (res)
                    {
                      
                    })
                    .catch(function (err) {
                      console.error('There was an error!', err);
                    });
                    setTimeout(() => {
                      actions.setSubmitting(false);
                    }, 1000);
                  console.log(response)
                  }}
                >
          <Form>
            <Grid container spacing={2}>
                      <Grid item xs={12}>
                          <TextField
                            name="comission_address"
                            label="Commission address"

                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="comission_percentage"
                            label="Commission Percentage"
                          />
                        </Grid>  
                    <Button type="submit" variant="contained" color="primary">Update</Button>
              </Grid>
            </Form>
              </Formik>
            </Container>
            </Grid>
          </Grid>
      
          <TableContainer style={{ marginTop:30  }}component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right">IP ADDRESS</StyledTableCell>
                <StyledTableCell align="right">ClientID</StyledTableCell>
                <StyledTableCell align="right">Traded VOLUME</StyledTableCell>
                <StyledTableCell align="right">Profit</StyledTableCell>
                <StyledTableCell align="right">Commission</StyledTableCell>
                <StyledTableCell align="right">Date Started</StyledTableCell>
              </TableRow>
            </TableHead>
               
            <TableBody>
      
        {            rows && rows.map((row) => (
                <StyledTableRow key={row.Client_ID}>
                  <StyledTableCell component="th" scope="row">
                    {row.Client_ID}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.Status}</StyledTableCell>
                  <StyledTableCell align="right">{row.IP_Address}</StyledTableCell>
                  <StyledTableCell align="right">{row.Client_ID}</StyledTableCell>
                  <StyledTableCell align="right">{row.TradedVolume}</StyledTableCell>
                  <StyledTableCell align="right">{row.Profit}</StyledTableCell>
                <StyledTableCell align="right">{row.Comission}</StyledTableCell>
                <StyledTableCell align="right">{row.DateStared}</StyledTableCell>
                </StyledTableRow>
              ))}
         
        
        
            </TableBody>
          </Table>
        </TableContainer>
      
            </div>
          </div>
        </div>
  
  );
};

export default Bots;
