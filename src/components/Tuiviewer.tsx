import { useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import ToastuiEditorViewer from "@toast-ui/editor";

// Viewer에 사용할 옵션을 직접 정의 (ViewerOptions 대신 EditorOptions 사용)
interface CustomViewerOptions {
  initialValue?: string;
  height?: string;
  usageStatistics?: boolean;
}

export default function TuiViewer(props: CustomViewerOptions) {
  const divRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ToastuiEditorViewer | null>(null);

  useEffect(() => {
    if (divRef.current) {
      viewerRef.current = new ToastuiEditorViewer({
        el: divRef.current,
        ...props,
        usageStatistics: false,
        initialEditType: "preview", // 편집기 모드를 프리뷰로 설정
        previewStyle: "vertical", // 세로로만 프리뷰만 표시
        toolbarItems: [], // 툴바를 완전히 비활성화
        hideModeSwitch: true, // 편집 모드 전환 스위치 숨기기
        useCommandShortcut: false, // 단축키 비활성화
      });
    }
  }, [props]);

  return <div ref={divRef} className="project-detail"></div>;
}
