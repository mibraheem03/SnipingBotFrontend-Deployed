import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import authSlice from "../store/slices/auth";
import axios from "axios";
import { useHistory } from "react-router";
import '../App.css';
import { Toolbar, AppBar, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
 
function Login() {
  
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogin = (email: string, password: string) => {
     console.log(String(`${process.env.REACT_APP_API_URL}/auth/login/`+ { email, password }))
    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/login/`,{
      email: email,
      password: password
    })
      .then((res) => {
        console.log(JSON.stringify(res))
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        dispatch(authSlice.actions.setAccount(res.data.user));
      
        history.push("/bots", {
          userId: res.data.id
        });
      })
      .catch((err) => {
        console.log(err)
        setMessage("Unable to login");
      });
  };


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
     
      handleLogin(values.email, values.password);
    },
    validationSchema: Yup.object({
      email: Yup.string().trim().required("Username is required"),
      password: Yup.string().trim().required("Password is required"),
    }),
  });
          return (
     <div className="App">
       <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">
          Sniping Bot Admin Panel
        </Typography>
      </Toolbar>
    </AppBar>

      <div className="auth-wrapper">
        <div className="auth-inner">
         <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
              <Typography variant="h6" >
          Login
        </Typography>
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="email"
              type="email"
              placeholder="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email ? <div>{formik.errors.email} </div> : null}
            <input
              className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password ? (
              <div>{formik.errors.password} </div>
            ) : null}
          </div>
          <div className="text-danger text-center my-2" hidden={false}>
            {message}
          </div>

          <div className="flex justify-center items-center mt-6">
            <Button variant="contained" color="primary" type='submit'>Login</Button>
            
          </div>
        </form>
        </div>
      </div>
    </div>
           
        );
}

export default Login;
