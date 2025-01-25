interface NonProjectButtonProps {
  project: string; 
}

function NonProjectButton({ project }: NonProjectButtonProps) {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {project}
      <div className="absolute right-5 bottom-5">화살표</div>
    </div>
  );
}

export default NonProjectButton;
