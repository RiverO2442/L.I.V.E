import { Box } from "@mui/material";
import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./pages/footer/footer";
import Header from "./pages/header/header";
import SignIn from "./pages/login/login";
import HomePage from "./pages/home/home";
import AudioDetail from "./pages/media/media-detail/audio-detail";
import Register from "./pages/register/register";
import ProtectedRoute from "./utility/ProtectedRoute";
import ModulesPage from "./pages/module/modules";
import HealthyEatingModule from "./pages/module/detail/heathy";
import QuizPage from "./pages/quiz/quiz";
import ProgressPage from "./pages/progress/progress";
import AboutPage from "./about/about";

const App: React.FC = () => {
  const [headerParams, setHeaderParams] = useState({
    searchParam: "random",
    filter: {
      mediaType: "image",
    },
    username: "",
  });
  const checkHeaderValue = (e: any) => {
    if ("string" === typeof e)
      setHeaderParams({
        ...headerParams,
        searchParam: e,
      });
    else {
      setHeaderParams({
        ...headerParams,
        filter: e,
      });
    }
  };

  function Authentication() {
    // const token = localStorage.getItem("token") || "";
    // return token.length > 0;
    return true;
  }

  return (
    <Router>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        width={"100%"}
      >
        <Header onSearchChange={checkHeaderValue} />
        <div className="flex flex-col bg-white min-h-[1000px]">
          <Routes>
            <Route
              path="/modules"
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <ModulesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/modules/:id"
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <HealthyEatingModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <AboutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/"
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<SignIn />} />
            <Route path="/logup" element={<Register />} />
          </Routes>
        </div>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
