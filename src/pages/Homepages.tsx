// src/pages/HomePage.tsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  FullpageContainer,
  FullpageSection,
} from "@shinyongjun/react-fullpage";
import { Activities, Home, Intro, Project } from "./";
import { MainLayoutContext } from "../components/MainLayout";

const HomePage: React.FC = () => {
  const { activeIndex, setActiveIndex } = useOutletContext<MainLayoutContext>();

  return (
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
  );
};

export default HomePage;
