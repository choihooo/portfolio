import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ProjectData {
  projectOverview: {
    name: string;
    purpose: string;
    developmentPeriod: string;
    projectType: string;
    myRole: string;
    image: string;
  };
  techStack: {
    frontend: string[];
    stateManagement: string[];
    styling: string[];
    buildTool: string[];
    deployment: string[];
    additionalLibraries: string[];
  };
  coreFeatures: {
    name: string;
    technicalChallenges: string[];
    solution: string;
  }[];
  personalContribution: {
    featuresImplemented: string[];
    performanceOptimization: string[];
    architectureDesign: string[];
  };
  technicalAchievements: {
    performanceMetrics: string[];
    codeQuality: string[];
    userExperience: string[];
  };
  projectLinks: {
    githubRepository: string;
    deploymentLink: string;
    demoVideo: string;
  };
  futureImprovements: string[];
}

interface Props {}

const ProjectDetail: React.FC<Props> = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용해 navigate 함수 가져오기

  const goBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    const fileUrl = `/projects/${projectId}.json`;

    fetch(fileUrl)
      .then((response) => response.json())
      .then((data: ProjectData) => {
        setProject(data);
      })
      .catch((error) => {
        console.error("Failed to load project data", error);
        setProject(null);
      });
  }, [projectId]);

  if (!project) {
    return <p>No project found with id {projectId}</p>;
  }

  return (
    <div className="max-w-[800px] mx-auto">
      {" "}
      {/* Container with max-width and centering */}
      <div
        onClick={goBack}
        style={{ cursor: "pointer" }}
        className="fixed right-5 top-5"
      >
        X
      </div>
      <div className="flex">
        <img src={`${project.projectOverview.image}`} className="w-full" />{" "}
        {/* Adjust width to full container */}
        <div>
          <h1>{project.projectOverview.name}</h1>
          <p>{project.projectOverview.purpose}</p>
          <p>{project.projectOverview.developmentPeriod}</p>
          <p>{project.projectOverview.projectType}</p>
          <p>{project.projectOverview.myRole}</p>
        </div>
      </div>
      <h2>기술 스택</h2>
      <ul>
        {Object.entries(project.techStack).map(([key, value]) => (
          <li key={key}>
            {key}: {value.join(", ")}
          </li>
        ))}
      </ul>
      {project.coreFeatures.map((feature, index) => (
        <div key={index}>
          <h3>{feature.name}</h3>
          <ul>
            {feature.technicalChallenges.map((challenge, idx) => (
              <li key={idx}>{challenge}</li>
            ))}
          </ul>
          <p>{feature.solution}</p>
        </div>
      ))}
      <h2>프로젝트 링크</h2>
      <ul>
        <li>
          <a href={project.projectLinks.githubRepository}>GitHub Repository</a>
        </li>
        <li>
          <a href={project.projectLinks.deploymentLink}>Live Demo</a>
        </li>
        <li>
          <a href={project.projectLinks.demoVideo}>Demo Video</a>
        </li>
      </ul>
    </div>
  );
};

export default ProjectDetail;
