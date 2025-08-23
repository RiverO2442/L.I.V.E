import { Box } from "@mui/material";
import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./pages/footer/footer";
import Header from "./pages/header/header";
import SignIn from "./pages/login/login-register";
import HomePage from "./pages/home/home";
import Register from "./pages/register/register";
import ProtectedRoute from "./utility/ProtectedRoute";
import ModulesPage from "./pages/module";
import HealthyEatingModule from "./pages/module/eating";
import ProgressPage from "./pages/progress/progress";
import AboutPage from "./about/about";
import PhysicalActivityModule from "./pages/module/activity";
import RecognisingSymptoms from "./pages/module/symptoms";
import { navigatePath } from "./utility/router-config";
import BloodGlucoseMonitoring from "./pages/module/glucose";

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
            {/* <Route
              path={`/${navigatePath.modules}`}
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <ModulesPage />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path={`/${navigatePath.symptom}`}
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <RecognisingSymptoms />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${navigatePath.eating}`}
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <HealthyEatingModule />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${navigatePath.activity}`}
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <PhysicalActivityModule />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${navigatePath.glucose}`}
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <BloodGlucoseMonitoring />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${navigatePath.progress}`}
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${navigatePath.about}`}
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <AboutPage />
                </ProtectedRoute>
              }
            />
            <Route path={`/${navigatePath.login}`} element={<SignIn />} />
            {/* <Route path={`/${navigatePath.logup}`} element={<Register />} /> */}
            <Route
              path={`/${navigatePath.home}`}
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <ModulesPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
