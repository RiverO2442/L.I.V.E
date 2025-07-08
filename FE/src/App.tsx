import { Box } from "@mui/material";
import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./pages/footer/footer";
import Header from "./pages/header/header";
import SignIn from "./pages/login/login";
import Media from "./pages/media/media";
import AudioDetail from "./pages/media/media-detail/audio-detail";
import ImageDetail from "./pages/media/media-detail/image-detail";
import Register from "./pages/register/register";
import ProtectedRoute from "./utility/ProtectedRoute";

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
        <div className="flex flex-row bg-white min-h-[1000px]">
          <Routes>
            <Route
              path="/images/:id"
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <ImageDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <Media headerParams={headerParams} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audios/:id"
              element={
                <ProtectedRoute authenticated={Authentication()}>
                  <AudioDetail />
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
