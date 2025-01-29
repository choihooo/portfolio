interface NonProjectButtonProps {
  project: string;
}

function NonProjectButton({ project }: NonProjectButtonProps) {
  return (
    <div className="flex items-center justify-center w-[400px] h-[300px] text-black text-[60px] bg-white rounded-md relative ">
      {project}
      <div className="absolute flex text-sm right-5 bottom-5">
        프로젝트 더보기 &rarr;
      </div>
    </div>
  );
}

export default NonProjectButton;
