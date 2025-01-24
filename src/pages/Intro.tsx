import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

function Intro() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  // 각 요소에 대한 애니메이션 설정
  const animateProps = (x: number, y: number) =>
    useSpring({
      to: {
        opacity: inView ? 1 : 0,
        transform: inView ? `translate(0%, 0%)` : `translate(${x}vw, ${y}vh)`,
      },
      from: {
        opacity: 0,
        transform: `translate(${x}vw, ${y}vh)`,
      },
      config: { duration: 2000 },
    });
  const [textProps, setTextProps] = useSpring(() => ({
    opacity: 1,
    transform: "translate(0%, 0%)",
    from: { opacity: 0, transform: "translate(0%, -50vh)" },
    config: { duration: 2000 }, // 텍스트 또한 1초 동안 천천히 나타남
  }));
  const whyProps = animateProps(-100, -100); // 왼쪽 상단
  const howProps = animateProps(100, -100); // 오른쪽 상단
  const whatProps = animateProps(-100, 100); // 왼쪽 하단
  const goalProps = animateProps(100, 100); // 오른쪽 하단

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center w-screen h-screen text-black bg-white"
    >
      <div className="w-72 h-72">
        <img src="developer.svg" />
      </div>
      <animated.div
        className="text-left text-[48px] font-bold"
        style={textProps}
      >
        저는 <p className="text-[#0070c0] inline">UX와 DX를 추구</p>하는
        Front-end 개발자 최호라고 합니다.
      </animated.div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-[#5c5c5c]">
        <animated.div style={whyProps} className="p-4 w-[370px]">
          <div className="text-[40px] font-bold">Why</div>
          <div className="text-l">
            도전적인 문제를 만났을 때, 단순히 해결하는 것이 아니라 그 과정에서
            배우고 성장하는 것을 열정적으로 추구합니다.
          </div>
        </animated.div>
        <animated.div style={howProps} className="p-4 w-[370px]">
          <div className="font-bold text-[40px]">How</div>
          <div className="text-l">
            코드 리뷰와 지속적인 피드백을 통해 개인과 팀의 성장을 도모하며,
            리액트와 타입스크립트로 확장 가능하고 품질 높은 솔루션을 설계합니다.
          </div>
        </animated.div>
        <animated.div style={whatProps} className="p-4 w-[370px]">
          <div className="font-bold text-[40px]">What</div>
          <div className="text-l">
            사용자 경험을 극대화하고, 동료 개발자 경험에 기여할 수 있는 재사용
            가능한 컴포넌트를 설계하고 개발합니다.
          </div>
        </animated.div>
        <animated.div style={goalProps} className="p-4 w-[370px] ">
          <div className="text-[40px] font-bold">Goal</div>
          <div className="text-l">
            지속적인 기록과 동료 피드백을 통해 개인의 성장을 추구하며, 이를 통해
            사용자와 개발자 모두에게 가치를 제공하는 소프트웨어를 만들고자
            합니다.
          </div>
        </animated.div>
      </div>
    </div>
  );
}

export default Intro;
