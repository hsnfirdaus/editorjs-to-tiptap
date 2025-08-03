import type { OutputBlockData } from "@editorjs/editorjs";
import type { Attrs, TextCb } from "../editorjs-to-tiptap.types";
import type { JSONContent } from "@tiptap/core";
import type { BlockTuneData } from "@editorjs/editorjs/types/block-tunes/block-tune-data";

export type TunesData = { [name: string]: BlockTuneData };

export type BlockConverter<Type extends string, Data extends object> = (
  block: OutputBlockData<Type, Data>,
  textCb: TextCb,
  attrTunesCb: (tunes?: TunesData) => Attrs
) => JSONContent[];

export type AttrTuneConverter<Data extends BlockTuneData> = (
  data: Data
) => Attrs;

export type MarkConverterConvert = (
  tag: string,
  children: JSONContent[],
  attributes?: Record<string, any>
) => JSONContent[];

export interface MarkConverter {
  tags: string[];
  convert: MarkConverterConvert;
}
