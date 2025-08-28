import { Box } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AboutPage from "./about/about";
import Footer from "./pages/footer/footer";
import Header from "./pages/header/header";
import SignIn from "./pages/login/login-register";
import ModulesPage from "./pages/module";
import PhysicalActivityModule from "./pages/module/activity";
import HealthyEatingModule from "./pages/module/eating";
import BloodGlucoseMonitoring from "./pages/module/glucose";
import RecognisingSymptoms from "./pages/module/symptoms";
import ProgressPage from "./pages/progress/progress";
import ProtectedRoute from "./utility/ProtectedRoute";
import { navigatePath } from "./utility/router-config";
import NotFoundPage from "./pages/notfound/notfound";

const App: React.FC = () => {
  return (
    <Router>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        width={"100%"}
      >
        <Header />
        <div className="flex flex-col bg-white min-h-[1000px]">
          <Routes>
            <Route
              path={`/${navigatePath.symptom}`}
              element={
                <ProtectedRoute>
                  <RecognisingSymptoms />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${navigatePath.eating}`}
              element={
                <ProtectedRoute>
                  <HealthyEatingModule />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${navigatePath.activity}`}
              element={
                <ProtectedRoute>
                  <PhysicalActivityModule />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${navigatePath.glucose}`}
              element={
                <ProtectedRoute>
                  <BloodGlucoseMonitoring />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${navigatePath.progress}`}
              element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
            <Route path={`/${navigatePath.about}`} element={<AboutPage />} />
            <Route path={`/${navigatePath.login}`} element={<SignIn />} />
            {/* <Route path={`/${navigatePath.logup}`} element={<Register />} /> */}
            <Route
              path={`/${navigatePath.home}`}
              element={
                <ProtectedRoute>
                  <ModulesPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
