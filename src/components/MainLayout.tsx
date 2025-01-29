import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { removeHash } from "../util/removeHash";

interface MainLayoutContext {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MainLayout: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);


  useEffect(() => {
    setActiveIndex(0);
    removeHash();
  }, [location.pathname, location.search]);
  return (
    <>
      <Header activeIndex={activeIndex} />

      <Outlet context={{ activeIndex, setActiveIndex }} />
    </>
  );
};

export default MainLayout;
export type { MainLayoutContext };
