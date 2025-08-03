// Main class
export { default as EditorJSToTipTap } from "./src/editorjs-to-tiptap";

// Default converters
export {
  defaultBlockConverter,
  defaultMarkConverter,
  defaultAttrTuneConverters,
} from "./src/default-converter";

// All individual converters
export {
  alignmentTune,
  BasicMark,
  codeBlock,
  CodeMark,
  delimiterBlock,
  embedBlock,
  headerBlock,
  imageBlock,
  linkBlock,
  listBlock,
  paragraphBlock,
  quoteBlock,
  tableBlock,
  warningBlock,
} from "./src/converter";

// Types
export type {
  TunesData,
  BlockConverter,
  AttrTuneConverter,
  MarkConverterConvert,
  MarkConverter,
} from "./src/converter/converter.type";

export type {
  Attrs,
  TextCb,
  BlockConverters,
  AttrTuneConverters,
  MarkConverters,
  EditorJSToTiptapOptions,
} from "./src/editorjs-to-tiptap.types";

// Markup utilities
export { parseMarkup } from "./src/markup";
export type { ASTNode } from "./src/markup";
