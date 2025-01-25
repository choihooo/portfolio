// src/components/MainLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { removeHash } from "../util/removeHash";

// Define the shape of the context provided to child routes
interface MainLayoutContext {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MainLayout: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const textColor: string =
    activeIndex === 0 || activeIndex === 2 ? "text-white" : "text-black";

  useEffect(() => {
    setActiveIndex(0);
    removeHash();
  }, [location.pathname, location.search]);
  return (
    <>
      <Header textColor={textColor} />
      {/* Provide context to child routes */}
      <Outlet context={{ activeIndex, setActiveIndex }} />
    </>
  );
};

export default MainLayout;
export type { MainLayoutContext };
