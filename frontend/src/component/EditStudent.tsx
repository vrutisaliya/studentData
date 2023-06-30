import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Button, Grid, Container, Typography } from "@mui/material";
import * as Yup from "yup";

const EditStudent = () => {
  const { id } = useParams(); // Get the student ID from the URL parameter
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    age: "",
    stander: 0,
    gender: "",
    email: "",
    mobileNumber: "",
    profilePicture: "",
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    age: Yup.number()
      .typeError("Age must be a number")
      .positive("Age must be a positive number")
      .integer("Age must be an integer")
      .required("Age is required"),
    stander: Yup.number()
      .typeError("Stander must be a number")
      .positive("Stander must be a positive number")
      .integer("Stander must be an integer")
      .required("Stander is required"),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    mobileNumber: Yup.string().required("Mobile number is required"),
    profilePicture: Yup.string(),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? token : "",
    };
    fetch(`http://localhost:8080/api/v1/school/student/${id}`, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setInitialValues(data.student);
      })
      .catch((error) => {
        console.log("Error fetching student data:", error);
      });
  }, [id]);

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? token : "",
    };

    const fileInput = document.getElementById(
      "profilePicture"
    ) as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result?.toString()?.split(",")[1];
        values.profilePicture = base64Image || "";
        await sendFormValues(values);
        navigate("/");
      };
      reader.readAsDataURL(file);
    } else {
      await sendFormValues(values);
    
    }
  };

  const sendFormValues = async (formValues: any) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? token : "",
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/school/student/update/${id}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(formValues),
        }
      );
      const data = await response.json();
      if (data.status) {
        // Handle successful update
        console.log("Student record updated successfully");
      } else {
        // Handle update error
        console.log(data.message);
      }
    } catch (error) {
      console.log("Error updating student record:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Edit Student
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="firstName"
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.firstName && touched.firstName)}
                  helperText={<ErrorMessage name="firstName" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.lastName && touched.lastName)}
                  helperText={<ErrorMessage name="lastName" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="age"
                  label="Age"
                  fullWidth
                  variant="outlined"
                  type="number"
                  error={Boolean(errors.age && touched.age)}
                  helperText={<ErrorMessage name="age" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="stander"
                  label="Stander"
                  fullWidth
                  variant="outlined"
                  type="number"
                  error={Boolean(errors.stander && touched.stander)}
                  helperText={<ErrorMessage name="stander" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="gender"
                  label="Gender"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.gender && touched.gender)}
                  helperText={<ErrorMessage name="gender" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.email && touched.email)}
                  helperText={<ErrorMessage name="email" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="mobileNumber"
                  label="Mobile Number"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.mobileNumber && touched.mobileNumber)}
                  helperText={<ErrorMessage name="mobileNumber" />}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  id="profilePicture"
                  name="profilePicture"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                Update
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default EditStudent;
