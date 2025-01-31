import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectButton from "../components/ProjectButton";

interface ProjectOverview {
  description: string;
  name: string;
  type: string; // 'main' 또는 'sub'
  id: string;
}

interface ProjectItem {
  projectOverview: ProjectOverview;
  type: "project";
  techStack: string[]; // 문자열 배열로 변경
  features: string[];
}

const Project: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const itemsPerPage = screenWidth > 1280 ? 6 : screenWidth <= 768 ? 1 : 4;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("/data/projects.json")
      .then((response) => response.json())
      .then((data) => {
        setProjects(
          data.projects.map((project: any) => ({
            projectOverview: project.projectOverview,
            type: "project",
            techStack: project.techStack,
            features: project.features,
          }))
        );
      })
      .catch((error) => console.error("Failed to fetch projects", error));
  }, []);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => setCurrentPage(Math.max(0, currentPage - 1));
  const handleNextPage = () =>
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen p-5 text-white bg-black md:overflow-hidden">
      <div className="mt-[100px] md:px-8">
        <div className="flex justify-end gap-4 mb-3">
          <button
            onClick={handlePrevPage}
            aria-label="Previous Page"
            disabled={currentPage === 0}
          >
            ◀
          </button>
          <button
            onClick={handleNextPage}
            aria-label="Next Page"
            disabled={currentPage === totalPages - 1}
          >
            ▶
          </button>
        </div>
        <div
          className={`grid justify-center grid-cols-1 gap-6 ${
            screenWidth <= 1280 && screenWidth > 768
              ? "md:grid-cols-2"
              : "md:grid-cols-3"
          }`}
        >
          {currentItems.map((item) => (
            <ProjectButton
              key={item.projectOverview.id}
              name={item.projectOverview.name}
              description={item.projectOverview.description}
              techStack={item.techStack}
              features={item.features}
              onClick={() => handleProjectClick(item.projectOverview.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Project;
