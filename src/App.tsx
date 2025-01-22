import { useState } from "react";
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
      <header className="fixed top-0 left-0 z-50 w-full">
        <nav className="flex justify-between text-white mx-[40px] mt-[12px] ">
          <div>Howu</div>
          <div className="opacity-50">
            <img src="/menu.svg" />
          </div>
        </nav>
      </header>
      <FullpageContainer
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      >
        <FullpageSection name="first">
          <Home />
        </FullpageSection>
        <FullpageSection name="second">
          <div>Section 2</div>
        </FullpageSection>
        <FullpageSection name="third">
          <div>Section 3</div>
        </FullpageSection>
      </FullpageContainer>
    </>
  );
}
