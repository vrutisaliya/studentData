import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const SignIn = ({ onSignIn }: { onSignIn: (token: string) => void }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Make a POST request to the sign-in endpoint
      fetch('http://localhost:8080/api/v1/school/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            // Store the token in local storage
            localStorage.setItem('token', data.token);

            // Call the onSignIn function passed from the parent component
            onSignIn(data.token);

            // Redirect to the home page or dashboard
            navigate('/');
          } else {
            // Handle sign-in error
            console.log(data.message);
          }
        })
        .catch((error) => {
          console.log('Error signing in:', error);
        });
    },
  });

  return (
    <Container maxWidth="md">
      <h3>SignIn</h3>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          type="email"
          label="Email"
          id="email"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          required
        />
        <br />
        <br />
        <TextField
          type="password"
          label="Password"
          id="password"
          {...formik.getFieldProps('password')}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          required
        />
        <br />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Sign In
        </Button>
      </form>
    </Container>
  );
};

export default SignIn;
