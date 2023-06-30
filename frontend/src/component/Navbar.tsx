import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  const handleLogin = () => {
    navigate("/signin");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "black" }}>
      <Toolbar>
        <Typography variant="h6"  style={{ flexGrow: 1 }}>
          Student Management
        </Typography>
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>
        <Button component={Link} to="/add" color="inherit">
          Add Student
        </Button>
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
