import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NonProjectButton from "../components/NonProjectButton";
import ProjectButton from "../components/ProjectButton";

interface TechStack {
  frontend: string[];
  stateManagement: string[];
  styling: string[];
  buildTool: string[];
  deployment: string[];
  additionalLibraries: string[];
}

// 프로젝트 정보를 위한 인터페이스
interface ProjectOverview {
  description: string;
  name: string;
  type: string; // 'main' 또는 'sub'
  id: string;
}

// 실제 프로젝트 아이템 인터페이스
interface ProjectItem {
  projectOverview: ProjectOverview;
  type: "project"; // 모든 프로젝트 아이템에 'project' 타입을 명시적으로 추가
  techStack: TechStack;
}

// 메인 및 서브 프로젝트를 구분하는 버튼 아이템 인터페이스
interface ButtonItem {
  type: "mainButton" | "subButton";
  label: string;
  id: string;
}

// 프로젝트 아이템과 버튼 아이템을 포함할 수 있는 유니언 타입
type ProjectOrButton = ProjectItem | ButtonItem;

// 버튼 아이템인지 확인하는 타입 가드
function isButtonItem(item: ProjectOrButton): item is ButtonItem {
  return item.type === "mainButton" || item.type === "subButton";
}

const Project: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch("/data/projects.json")
      .then((response) => response.json())
      .then((data) => {
        setProjects(
          data.projects.map((project: any) => ({ ...project, type: "project" }))
        );
        console.log(data);
      })
      .catch((error) => console.error("Failed to fetch projects", error));
  }, []);

  const mainProjects = projects.filter(
    (project) => project.projectOverview.type === "main"
  );
  const subProjects = projects.filter(
    (project) => project.projectOverview.type === "sub"
  );

  const allItems: ProjectOrButton[] = [
    { type: "mainButton", label: "Main Projects", id: "main" },
    ...mainProjects,
    { type: "subButton", label: "Sub Projects", id: "sub" },
    ...subProjects,
  ];

  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => setCurrentPage(Math.max(0, currentPage - 1));
  const handleNextPage = () =>
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden text-white bg-black">
      <div className="mt-[100px] px-8">
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
        <div className="grid grid-cols-3 grid-rows-2 gap-6">
          {currentItems.map((item, index) => {
            if (isButtonItem(item)) {
              return <NonProjectButton key={index} project={item.label} />;
            } else {
              return (
                <ProjectButton
                  key={index}
                  name={item.projectOverview.name}
                  description={item.projectOverview.description}
                  techStack={item.techStack}
                  onClick={() => handleProjectClick(item.projectOverview.name)}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Project;
