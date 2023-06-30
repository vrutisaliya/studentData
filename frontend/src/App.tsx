import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes ,Navigate} from "react-router-dom";
import AddStudent from "./component/AddStudent";
import EditStudent from "./component/EditStudent";
import Home from "./component/Home";
import SignIn from "./component/SignIn";
import Signup from "./component/Signup";
import ViewStudent from "./component/ViewStudent";
import Navbar from "./component/Navbar";

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiresIn = localStorage.getItem("expiresIn");
    const currentTime = Date.now();

    if (token && expiresIn && currentTime > parseInt(expiresIn)) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
      window.location.href = "/signin";
    }
  }, []);

  const handleSignIn = (token: string) => {
    const expiresIn = Date.now() + 4 * 60 * 60 * 1000;
    localStorage.setItem("token", token);
    localStorage.setItem("expiresIn", expiresIn.toString());
  };

  const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;
    return isAuthenticated ? element : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add" element={<AddStudent />} />
        <Route path="/view/:id" element={<ViewStudent />} />
        <Route path="/edit/:id" element={<EditStudent />} />
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
      </Routes>
    </Router>
  );
};

export default App;
