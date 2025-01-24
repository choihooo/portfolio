import { useState } from "react";
import Header from "./components/Header";
import {
  FullpageContainer,
  FullpageSection,
} from "@shinyongjun/react-fullpage";
import "@shinyongjun/react-fullpage/css";
import { Activities, Home, Intro, Project } from "./pages";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  // 조건에 따라 헤더의 텍스트 색상 결정
  const textColor = (activeIndex === 0 || activeIndex === 2) ? 'text-white' : 'text-black';

  return (
    <>
      <Header textColor={textColor} />
      <FullpageContainer
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      >
        <FullpageSection name="Home">
          <Home />
        </FullpageSection>
        <FullpageSection name="Intro">
          <Intro />
        </FullpageSection>
        <FullpageSection name="Project">
          <Project />
        </FullpageSection>
        <FullpageSection name="Activities">
          <Activities />
        </FullpageSection>
      </FullpageContainer>
    </>
  );
}
