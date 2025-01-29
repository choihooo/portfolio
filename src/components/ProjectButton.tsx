import React from "react";

interface TechStack {
  frontend: string[];
  stateManagement: string[];
  styling: string[];
  buildTool: string[];
  deployment: string[];
  additionalLibraries: string[];
}

interface ProjectButtonProps {
  name: string;
  description: string;
  techStack: TechStack;
  onClick: () => void;
}

const ProjectButton: React.FC<ProjectButtonProps> = ({
  name,
  description,
  techStack,
  onClick,
}) => {
  // 모든 기술 스택을 하나의 배열로 결합
  const formattedTechStack = [
    ...techStack.frontend,
    ...techStack.stateManagement,
    ...techStack.styling,
    ...techStack.buildTool,
    ...techStack.deployment,
    ...techStack.additionalLibraries,
  ].join(", ");

  return (
    <div
      className="text-black p-5 bg-white rounded-lg w-[400px] h-[300px] cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-3xl font-bold text-left ">{name}</h2>
      <p className="h-[100px] mt-5">{description}</p>
      <div className="p-2 mt-3 border border-solid rounded-lg border-me">
        <p>{formattedTechStack}</p>
      </div>
    </div>
  );
};

export default ProjectButton;
