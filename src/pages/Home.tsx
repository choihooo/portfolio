import { useState } from "react";
import { useTrail, a } from "@react-spring/web";

function Home() {
  const [textSetIndex, setTextSetIndex] = useState(0);
  const [showClick, setShowClick] = useState(true);
  
  const textSets = [
    ["최 호 | HOWU", "I'm a Frontend", "Developer"],
    ["저는 UX와 DX", "성능 최적화에", "관심이 많습니다."],
  ];

  const items = textSets[textSetIndex];
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: 1,
    x: 0,
    height: 110,
    from: { opacity: 0, x: 20, height: 0 },
    reset: true,
  });

  const handleTextChange = () => {
    setTextSetIndex((current) => (current + 1) % textSets.length);
    setShowClick(false);
  };
  
  const getClassByIndex = (index: number) => {
    switch (index) {
      case 0:
        return "text-3xl";
      case 1:
        return "text-[60px]";
      case 2:
        return "text-[60px]";
      default:
        return "text-white"; 
    }
  };
  return (
    <div className="grid w-screen h-screen grid-cols-2 text-white bg-black">
      <div
        onClick={handleTextChange}
        className="flex flex-col justify-center gap-4 ml-[30%] h-full"
      >
        {showClick && <div className="opacity-40 animate-bounce">click &darr;</div>}
        {trail.map((style, index) => (
          <a.div
            key={index}
            className={` font-bold ${getClassByIndex(index)}`}
            style={{
              transform: style.x.interpolate((x) => `translate3d(0,${x}px,0)`),
              opacity: style.opacity,
            }}
          >
            {items[index]}
          </a.div>
        ))}
        <div className="mt-6">
          <a
            href="choiho_resume.pdf"
            download="ChoiHo_Resume.pdf"
            className="flex items-center gap-3"
          >
           <div className="h-[2px] bg-white w-[20px]"></div> View My Resume 
          </a>
        </div>
      </div>
      <div className="relative flex items-center justify-center h-screen">
        <div className="absolute z-0 flex justify-center w-[90%] h-full transform skew-y-12 bg-white rounded-full animate-slide-in -bottom-1/4">
          <img  src="me.png" alt="Choi Ho" className="z-10 animate-float-up-down" />
        </div>
      </div>
    </div>
  );
}

export default Home;
