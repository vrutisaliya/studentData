import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

interface Student {
  _id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  age: string;
  stander: string;
  gender: string;
  email: string;
  password: string;
  mobileNumber: string;
}

const ViewStudent = () => {
  const { id } = useParams();
  const [filteredStudentList, setFilteredStudentList] = useState<Student[]>([]);

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
        const students = Array.isArray(data.student)
          ? data.student
          : [data.student];
        setFilteredStudentList(students);
      })
      .catch((error) => {
        console.log("Error fetching student data:", error);
      });
  }, [id]);

  return (
    <Container maxWidth="sm">
         <Typography variant="h4" align="center" gutterBottom>
        View Student
      </Typography>
      {filteredStudentList.map((student) => (
        <Card key={student._id} sx={{ marginBottom: "1rem" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <img
                  src={`data:image/png;base64,${student.profilePicture}`}
                  alt="profilePicture"
                  style={{ width: "50px", height: "50px" }}
                />
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="h6">
                      {`${student.firstName} ${student.lastName}`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">Age: {student.age}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      Stander: {student.stander}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      Gender: {student.gender}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      Email: {student.email}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      Mobile Number: {student.mobileNumber}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default ViewStudent;
