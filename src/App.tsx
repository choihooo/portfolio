// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@shinyongjun/react-fullpage/css";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/Homepages";
import ProjectDetail from "./pages/ProjectDetail";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Routes with Header */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          {/* Add more nested routes here if needed */}
        </Route>

        {/* Routes without Header */}
        <Route path="project/:projectId" element={<ProjectDetail />} />

        {/* Optional: Add a catch-all route for 404 pages */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
