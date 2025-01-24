import { useState } from "react";
import Header from "./components/Header.tsx";
import {
  FullpageContainer,
  FullpageSection,
} from "@shinyongjun/react-fullpage";
import "@shinyongjun/react-fullpage/css";
import { Home } from "./pages";

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <>
      <Header />
      <FullpageContainer
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      >
        <FullpageSection name="Home">
          <Home />
        </FullpageSection>
        <FullpageSection name="Intro">
          <div>Section 2</div>
        </FullpageSection>
        <FullpageSection name="Project">
          <div>Section 3</div>
        </FullpageSection>
        <FullpageSection name="Activities">
          <div>Section 3</div>
        </FullpageSection>
      </FullpageContainer>
    </>
  );
}
