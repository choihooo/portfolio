// src/data/projects.ts

export interface ProjectProp {
  id: string;
  label: string;
  type: "main" | "sub";
}

export interface StartButton {
  type: "mainButton" | "subButton";
  label: string;
}

export type GridItem = ProjectProp | StartButton;

const projects: ProjectProp[] = [
  { id: "moping", label: "moping", type: "main" },
  { id: "devocean", label: "devocean", type: "main" },
  { id: "choiho_resume3", label: "이력서3", type: "sub" },
  { id: "project4", label: "프로젝트4", type: "sub" },
  { id: "project5", label: "프로젝트5", type: "sub" },
  { id: "project6", label: "프로젝트6", type: "sub" },
  { id: "project7", label: "프로젝트7", type: "sub" },
  { id: "project8", label: "프로젝트8", type: "sub" },
  { id: "project9", label: "프로젝트9", type: "sub" },
  { id: "project10", label: "프로젝트10", type: "sub" },
  { id: "project11", label: "프로젝트11", type: "sub" },
  // 필요에 따라 추가 프로젝트
];

export default projects;
