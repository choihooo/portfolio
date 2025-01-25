// src/pages/Project.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import projects, { StartButton, GridItem } from "../data/projects";
import NonProjectButton from "../components/NonProjectButton";

// 타입 가드 함수
function isStartButton(item: GridItem): item is StartButton {
  return (
    "type" in item && (item.type === "mainButton" || item.type === "subButton")
  );
}

const Project: React.FC = () => {
  const navigate = useNavigate();

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // 페이지당 표시할 아이템 수 (메인, 서브 시작 버튼 포함)
  const itemsPerPage = 6; // 3x2 그리드
  const allItems: GridItem[] = [];

  // 메인 프로젝트와 서브 프로젝트 분리
  const mainProjects = projects.filter((p) => p.type === "main");
  const subProjects = projects.filter((p) => p.type === "sub");

  // 메인 프로젝트 시작 버튼과 메인 프로젝트 추가
  if (mainProjects.length > 0) {
    allItems.push({ type: "mainButton", label: "Project" });
    allItems.push(...mainProjects);
  }

  // 서브 프로젝트 시작 버튼과 서브 프로젝트 추가
  if (subProjects.length > 0) {
    allItems.push({ type: "subButton", label: "Sub Project" });
    allItems.push(...subProjects);
  }

  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  // 현재 페이지 상태 (0부터 시작)
  const [currentPage, setCurrentPage] = useState<number>(0);

  // 현재 페이지에 표시할 아이템 목록
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);

  // 남은 셀을 빈 셀로 채움
  const emptyCells = itemsPerPage - currentItems.length;

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden text-white bg-black">
      {/* 그리드 컨테이너를 감싸는 div */}
      <div className="mt-[100px] px-8">
        {/* 화살표 버튼을 그리드 상단 우측에 배치 */}
        <div className="flex justify-end gap-4 mb-3">
          <button
            onClick={handlePrevPage}
            aria-label="이전 페이지"
            disabled={currentPage === 0}
          >
            ◀
          </button>
          <button
            onClick={handleNextPage}
            aria-label="다음 페이지"
            disabled={currentPage === totalPages - 1}
          >
            ▶
          </button>
        </div>

        {/* 그리드 컨테이너 */}
        <div className="grid grid-cols-3 grid-rows-2 gap-6">
          {currentItems.map((item, index) => {
            if (isStartButton(item)) {
              if (item.type === "mainButton") {
                return (
                  <div
                    key={`mainButton-${index}`}
                    className="flex items-center justify-center px-6 py-4 w-[400px] h-[300px] text-lg text-black transition duration-200 bg-white rounded-md "
                    aria-label="메인 프로젝트 시작"
                  >
                    <NonProjectButton project={item.label} />
                  </div>
                );
              } else if (item.type === "subButton") {
                return (
                  <div
                    key={`subButton-${index}`}
                    className="flex items-center justify-center w-[400px] h-[300px] px-6 py-4 text-lg text-black transition duration-200 bg-white rounded-md "
                    aria-label="서브 프로젝트 시작"
                  >
                    <NonProjectButton project={item.label} />
                  </div>
                );
              }
            } else {
              return (
                <button
                  key={item.id}
                  onClick={() => handleProjectClick(item.id)}
                  className="flex items-center justify-center w-[400px] h-[300px] px-6 py-4 text-lg transition duration-200 bg-white text-black rounded-md hover:bg-slate-300 "
                  aria-label={`프로젝트 ${item.label} 보기`}
                >
                  {item.label}
                </button>
              );
            }
          })}

          {/* 남은 셀을 빈 셀로 채움 */}
          {emptyCells > 0 &&
            Array.from({ length: emptyCells }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center justify-center w-[400px] h-[300px] px-6 py-4 text-lg transition duration-200 bg-white text-black rounded-md "
              ></div>
            ))}
        </div>
      </div>

      {/* 페이지 인디케이터를 그리드 바로 아래에 배치 */}
      {totalPages > 1 && (
        <div className="flex mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentPage ? "bg-white" : "bg-gray-500"
              }`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Project;
