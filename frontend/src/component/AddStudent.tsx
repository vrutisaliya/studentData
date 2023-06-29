
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  stander: number;
  gender: string;
  email: string;
//   password: string;
  mobileNumber: string;
  profilePicture: string;
}
const AddStudent = () => {
  const initialValues: FormData = {
    firstName: "",
    lastName: "",
     age: "",
     stander: 0,
    gender: "",
    email: "",
    // password: "",
    mobileNumber: "",
    profilePicture: "",
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    age: Yup.number()
      .typeError("Age must be a number")
      .required("Age is required"),
      stander:Yup. number()
           .required('Stander is required')
           .integer('Stander must be an integer')
           .min(1, 'Stander should be at least 1')
           .max(12, 'Stander should not exceed 12'),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    // password: Yup.string().required("Password is required"),
    mobileNumber: Yup.string().required("Mobile Number is required"),
    profilePicture: Yup.string(),
  });
  const navigate = useNavigate();
  const handleSubmit = async (values: FormData) => {
    try {
      const fileInput = document.getElementById("profilePicture") as HTMLInputElement;

      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const base64Image = await readFileAsBase64(file);
        values.profilePicture = base64Image || ""; // Assign the base64 data to the profileImage field
      }

      await sendFormValues(values); // Call the function to handle form submission

      navigate("/"); // Redirect to the home page or dashboard after form submission
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  const sendFormValues = async (values: FormData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/v1/school/student/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("token", data.token);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log("Error signing up:", error);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64Data = reader.result.split(",")[1];
          resolve(base64Data);
        } else {
          reject(new Error("Error reading file"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom margin={5}>
        Student Form
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                as={TextField}
                type="text"
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="firstName" component="div" />
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                type="text"
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="lastName" component="div" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                as={TextField}
                type="text"
                id="age"
                name="age"
                label="Age"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="age" component="div" />
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                type="number"
                id="stander"
                name="stander"
                label="stander"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="stander" component="div" />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <Field name="gender">
                  {({ field }: { field: any }) => (
                    <RadioGroup
                      {...field}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                    </RadioGroup>
                  )}
                </Field>
                <ErrorMessage name="gender" component="div" />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                type="email"
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="email" component="div" />
            </Grid>
            {/* <Grid item xs={12}>
              <Field
                as={TextField}
                type="password"
                id="password"
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="password" component="div" />
            </Grid> */}
            <Grid item xs={12}>
              <Field
                as={TextField}
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                label="Mobile Number"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="mobileNumber" component="div" />
            </Grid>
          </Grid>
          <Grid item xs={12} mt={3}>
            <input
              type="file"
              accept="image/*"
              id="profilePicture"
              name="profilePicture"
            />
          </Grid>
          {/* <div>
              <label htmlFor="profileImage">Profile Image:</label>
              <Field type="file" id="profileImage" name="profileImage" />
              <ErrorMessage name="profileImage" component="div" />
            </div> */}
          <Grid item xs={12} mt={3}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Form>
      </Formik>
    </Container>
  );
};
export default AddStudent;
