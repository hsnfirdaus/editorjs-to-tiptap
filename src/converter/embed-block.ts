import type { BlockConverter } from "./converter.type";

/**
 * @see https://github.com/editor-js/embed/blob/master/src/index.ts
 */
export interface EmbedData {
  service: string;
  source: string;
  embed: string;
  width?: number;
  height?: number;
  caption?: string;
}
/**
 * @see https://github.com/editor-js/embed
 */
export const embedBlock: BlockConverter<string, EmbedData> = (
  block,
  textCb,
  tunesCb
) => {
  if (block.data.service !== "youtube") {
    throw new Error("Unsupported embed service: " + block.data.service);
  }
  return [
    {
      type: "youtube",
      attrs: {
        src: block.data.source,
        width: block.data.width,
        height: block.data.height,
        ...tunesCb(block.tunes),
      },
    },
  ];
};
