import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ProjectData {
  projects: {
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
      deploymentLink?: string;
      demoVideo?: string;
    };
    futureImprovements: string[];
  }[];
}

const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectData["projects"][0] | null>(
    null
  );

  useEffect(() => {
    fetch("/data/projects.json")
      .then((response) => response.json())
      .then((data: ProjectData) => {
        const matchedProject = data.projects.find(
          (p) => p.projectOverview.name === projectId
        );
        setProject(matchedProject ?? null);
      })
      .catch((error) => {
        console.error("Failed to load project data", error);
        setProject(null);
      });
  }, [projectId]);

  if (!project) {
    return <p>No project found with name {projectId}</p>;
  }

  return (
    <div className="max-w-[800px] mx-auto py-5">
      <button
        onClick={() => navigate(-1)}
        className="absolute text-xl top-3 right-3"
      >
        &times;
      </button>
      <h1 className="mb-6 text-3xl font-bold text-accent">
        {project.projectOverview.name}
      </h1>
      <div className="flex gap-8">
        <img
          src={project.projectOverview.image}
          alt="Project Screenshot"
          className="w-1/2 rounded"
        />
        <div className="w-1/2">
          <p>
            <strong>목적:</strong> {project.projectOverview.purpose}
          </p>
          <p>
            <strong>개발 기간:</strong>{" "}
            {project.projectOverview.developmentPeriod}
          </p>
          <p>
            <strong>프로젝트 유형:</strong>{" "}
            {project.projectOverview.projectType}
          </p>
          <p>
            <strong>나의 역할:</strong> {project.projectOverview.myRole}
          </p>
          <h2 className="mb-2 font-bold">기술 스택</h2>
          {project.techStack &&
            Object.entries(project.techStack).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value.join(", ")}
              </p>
            ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-2 text-3xl font-bold">주요 기능</h2>
        {project.coreFeatures &&
          project.coreFeatures.map((feature, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-2xl font-semibold">{feature.name}</h3>
              <ul className="list-disc list-inside">
                {feature.technicalChallenges.map((challenge, idx) => (
                  <li key={idx}>{challenge}</li>
                ))}
              </ul>
              <p className="text-xl">
                <strong>해결 방법:</strong> {feature.solution}
              </p>
            </div>
          ))}
      </div>
      <div className="mt-8">
        <h2 className="mb-2 text-3xl font-bold">프로젝트 링크</h2>
        <ul className="list-disc list-inside">
          <li>
            <a
              href={project.projectLinks.githubRepository}
              className="text-blue-500 hover:text-blue-700"
            >
              GitHub Repository
            </a>
          </li>
          {project.projectLinks.deploymentLink && (
            <li>
              <a
                href={project.projectLinks.deploymentLink}
                className="text-blue-500 hover:text-blue-700"
              >
                Live Demo
              </a>
            </li>
          )}
          {project.projectLinks.demoVideo && (
            <li>
              <a
                href={project.projectLinks.demoVideo}
                className="text-blue-500 hover:text-blue-700"
              >
                Demo Video
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="mb-2 text-3xl font-bold">앞으로 개선점</h2>
        <ul className="list-disc list-inside">
          {project.futureImprovements &&
            project.futureImprovements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetail;
