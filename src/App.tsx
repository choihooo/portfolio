import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@shinyongjun/react-fullpage/css";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/Homepages";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path="project/:projectId" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
