import type { JSONContent } from "@tiptap/core";
import type {
  AttrTuneConverter,
  BlockConverter,
  MarkConverter,
} from "./converter/converter.type";
import type { BlockTuneData } from "@editorjs/editorjs/types/block-tunes/block-tune-data";

export type Attrs = Record<string, any>;
export type TextCb = (text: string) => JSONContent[];
export type BlockConverters = {
  [Type in string]: BlockConverter<Type, any>;
};
export type AttrTuneConverters = {
  [Type in string]: AttrTuneConverter<BlockTuneData>;
};
export type MarkConverters = MarkConverter[];
export type EditorJSToTiptapOptions = {
  blockConverters?: BlockConverters;
  markConverters?: MarkConverter[];
  attrTuneConverters?: AttrTuneConverters;
};
