import { useRef, useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const menuAnimation = useSpring({
    transform: menuOpen ? "translateX(0%)" : "translateX(100%)",
    opacity: menuOpen ? 1 : 0,
    config: config.stiff,
    onRest: () => {
      if (!menuOpen) {
        setMenuOpen(false); // Ensure menu is set to closed after animation completes
      }
    },
  });

  const items = ["Home", "Intro", "Project", "Activities"];
  const menuItems = items.map((item, index) => {
    const delay = menuOpen ? index * 100 : (items.length - index - 1) * 100;
    const itemAnimation = useSpring({
      transform: menuOpen ? "translateX(0px)" : "translateX(250px)",
      opacity: menuOpen ? 1 : 0,
      delay,
      config: config.wobbly,
    });

    return (
      <animated.button
        style={itemAnimation}
        className="px-10 text-3xl font-bold text-left"
        key={item}
        onClick={() => {
          setMenuOpen(false);
          window.location.hash = `#${item}`;
        }}
      >
        {item}
      </animated.button>
    );
  });

  const blogAnimation = useSpring({
    transform: menuOpen ? "translateX(0px)" : "translateX(250px)",
    opacity: menuOpen ? 1 : 0,
    delay: menuOpen ? 500 : 100,
    config: config.wobbly,
  });

  const divAnimation = useSpring({
    transform: menuOpen ? "translateX(0px)" : "translateX(250px)",
    opacity: menuOpen ? 1 : 0,
    delay: menuOpen ? 600 : 0,
    config: config.wobbly,
  });

  const contactAnimation = useSpring({
    transform: menuOpen ? "translateX(0px)" : "translateX(250px)",
    opacity: menuOpen ? 1 : 0,
    delay: menuOpen ? 700 : 200,
    config: config.wobbly,
  });

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <nav className="flex items-center justify-between px-5 py-5 text-white">
        <div>Howu</div>
        <div onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/menu.svg" alt="Menu" className="cursor-pointer" />
        </div>
      </nav>
      <animated.div
        ref={menuRef}
        style={menuAnimation}
        className="fixed top-0 right-0 w-[400px] h-full bg-black text-white opacity-95"
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute text-white top-5 right-5"
        >
          X
        </button>
        <div className="flex flex-col py-[100px] gap-[24px]">{menuItems}</div>
        <div className="flex items-center gap-3 px-10 text-left">
          <animated.button
            onClick={() => {
              window.open("https://blog.howu.run", "_blank");
            }}
            style={blogAnimation}
          >
            Blog
          </animated.button>
          <animated.div
            style={divAnimation}
            className="w-[1px] h-3 bg-white"
          ></animated.div>
          <animated.button
            onClick={() => {
              window.location.href = "mailto:hochoi8621@gmail.com";
            }}
            style={contactAnimation}
          >
            Contact
          </animated.button>
        </div>
      </animated.div>
    </header>
  );
}

export default Header;
