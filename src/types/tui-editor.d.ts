declare module "@toast-ui/editor" {
  import { EditorOptions } from "@toast-ui/editor/types/editor";

  export default class Editor {
    constructor(options: EditorOptions);
  }
  export class Viewer {
    constructor(options: EditorOptions);
  }
}
