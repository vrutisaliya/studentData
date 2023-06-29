import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container,
  Typography,
  Grid,
  TextField,
  TablePagination,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
interface Student {
  _id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  age: String;
  stander: String;
  gender: String;
  email: string;
  password: String;
  mobileNumber: string;
}
const Home = () => {
  // const [studentList, setStudentList] = useState<Student[]>([]);
  const [filteredStudentList, setFilteredStudentList] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const navigate = useNavigate();
  const fetchStudentList = () => {
    const token = localStorage.getItem("token");
    fetch(
      `http://localhost:8080/api/v1/school/student/all?page=${currentPage}&limit=${pageSize}&search=${searchQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          // setStudentList(data.students);
          setFilteredStudentList(data.students);
          setTotalPages(data.totalStudents / pageSize);
          // Update the total number of pages
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("expiresIn");
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.log("Error fetching student list:", error);
      });
  };
  useEffect(() => {
    fetchStudentList();
  }, [currentPage, pageSize, searchQuery]);

  const handleDeleteStudent = async (event: MouseEvent, studentId: string) => {
    event.preventDefault(); // Prevent page refresh

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/v1/school/student/delete/${studentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        }
      );

      if (response.ok) {
        const updatedStudents = filteredStudentList.filter(
          (student) => student._id !== studentId
        );
        setFilteredStudentList(updatedStudents);
        console.log("Student deleted successfully");
        fetchStudentList();
      } else {
        console.error("Error deleting student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleUpdateStudent = (studentId: string) => {
    navigate(`/edit/${studentId}`);
  };
  const handleViewStudent = (studentId: string) => {
    navigate(`/view/${studentId}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredStudents = filteredStudentList.filter(
      (student) =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query)
    );
    setFilteredStudentList(filteredStudents);
  };
  const handlePageChange = (
    event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => {
    setCurrentPage(page + 1); // Update the current page correctly
  };
  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom margin={3}>
        Student List
      </Typography>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        marginBottom={2}
        item
        gap={5}
      >
        <Grid item xs={6} sx={{ width: "400px" }}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth={true}
            value={searchQuery}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/add")}
          >
            Add Student
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Container}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Sr.No</TableCell>

              <TableCell>Profile Image</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Standard</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudentList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudentList.map((student,index) => (
                <TableRow key={student._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      src={`data:image/png;base64,${student.profilePicture}`}
                      alt="profilePicture"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.stander}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.mobileNumber}</TableCell>
                  <TableCell>
                    <Button
                      onClick={(event) =>
                        handleDeleteStudent(event, student._id)
                      }
                      color="error"
                      variant="contained"
                      style={{ marginRight: 2}}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleUpdateStudent(student._id)}
                      color="primary"
                      variant="contained"
                      style={{ marginRight: 2 }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleViewStudent(student._id)}
                      variant="contained"
                      color="success"
                      style={{ marginRight:5 }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[3, 5, 7, 10]}
          component="div"
          count={totalPages * pageSize}
          rowsPerPage={pageSize}
          page={currentPage - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={(event) =>
            setPageSize(parseInt(event.target.value, 10))
          }
        />
      </TableContainer>
    </div>
  );
};
export default Home;
