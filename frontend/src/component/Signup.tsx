import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Grid, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    // profileImage: null as File | null,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(5, "First name should be at least 5 characters long"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(5, "Last name should be at least 5 characters long"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password should be at least 8 characters long"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
    mobileNumber: Yup.string().required("Mobile number is required"),
  });

  const navigate = useNavigate();
  const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobileNumber: string;
    // profileImage: File | null;
  }) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        mobileNumber,
      } = values;

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("mobileNumber", mobileNumber);
      // if (profileImage) {
      //   formData.append("profileImage", profileImage);
      // }

      const response = await fetch(
        "http://localhost:8080/api/v1/school/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.token) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token);

        // Navigate to the signin page
        navigate("/signin");
      } else {
        // Handle successful signup, e.g., show success message or redirect
      }
    } catch (error) {
      console.log(error);
      // Handle error during signup, e.g., display error message
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">SignUp</Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Field
                type="text"
                name="firstName"
                as={TextField}
                label="First Name"
                fullWidth
                required
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="error"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                type="text"
                name="lastName"
                as={TextField}
                label="Last Name"
                fullWidth
                required
              />
              <ErrorMessage name="lastName" component="div" className="error" />
            </Grid>
            <Grid item xs={12}>
              <Field
                type="email"
                name="email"
                as={TextField}
                label="Email"
                fullWidth
                required
              />
              <ErrorMessage name="email" component="div" className="error" />
            </Grid>
            <Grid item xs={12}>
              <Field
                type="password"
                name="password"
                as={TextField}
                label="Password"
                fullWidth
                required
              />
              <ErrorMessage name="password" component="div" className="error" />
            </Grid>
            <Grid item xs={12}>
              <Field
                type="password"
                name="confirmPassword"
                as={TextField}
                label="Confirm Password"
                fullWidth
                required
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                type="text"
                name="mobileNumber"
                as={TextField}
                label="Mobile Number"
                fullWidth
                required
              />
              <ErrorMessage
                name="mobileNumber"
                component="div"
                className="error"
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Field type="file" name="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange} />
            </Grid> */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Container>
  );
};

export default Signup;
