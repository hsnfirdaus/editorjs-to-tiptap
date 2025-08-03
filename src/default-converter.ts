import {
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
} from "./converter";
import type {
  AttrTuneConverters,
  BlockConverters,
  MarkConverters,
} from "./editorjs-to-tiptap.types";

export const defaultBlockConverter: BlockConverters = {
  header: headerBlock,
  paragraph: paragraphBlock,
  quote: quoteBlock,
  linkTool: linkBlock,
  code: codeBlock,
  image: imageBlock,
  list: listBlock,
  warning: warningBlock,
  table: tableBlock,
  delimiter: delimiterBlock,
  embed: embedBlock,
};
export const defaultMarkConverter: MarkConverters = [
  new BasicMark(),
  new CodeMark(),
];
export const defaultAttrTuneConverters: AttrTuneConverters = {
  anyTuneName: alignmentTune,
};
