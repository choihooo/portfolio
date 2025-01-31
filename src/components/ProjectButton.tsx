import React from "react";

interface ProjectButtonProps {
  name: string;
  description: string;
  techStack: string[]; // TechStack을 문자열 배열로 받음
  features: string[]; // 추가된 기능 목록을 표시하기 위한 배열
  onClick: () => void;
}

const ProjectButton: React.FC<ProjectButtonProps> = ({
  name,
  description,
  techStack,
  features,
  onClick,
}) => {
  // 모든 기술 스택을 문자열로 결합
  const formattedTechStack = techStack.join(", ");

  return (
    <div
      className="text-black p-5 bg-white rounded-lg w-[300px] min-h-[300px] cursor-pointer md:w-[400px] md:min-h-[350px]"
      onClick={onClick}
    >
      <h2 className="text-3xl font-bold text-left">{name}</h2>
      <p className="mt-2 ">{description}</p>
      <div className="mt-3 ">
        <ul className="pl-5 list-disc min-h-[9rem]">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      <div className="p-2 mt-3 border border-solid rounded-lg border-me">
        <p>{formattedTechStack}</p>
      </div>
    </div>
  );
};

export default ProjectButton;
