import React, { useEffect, useState } from "react";
import TuiViewer from "../components/Tuiviewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { useParams } from "react-router-dom";
import "./ProjecDetail.css";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<string>();
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/projects/${projectId}.md`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load markdown file");
        return response.text();
      })
      .then((text) => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load markdown content");
        setLoading(false);
      });
  }, [projectId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={`flex items-center justify-center `}>
      <div className="w-full max-w-xl p-4">
        <TuiViewer initialValue={markdown} />
      </div>
    </div>
  );
};

export default ProjectDetail;
