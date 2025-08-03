import type { HeaderData } from "@editorjs/header";
import type { BlockConverter } from "./converter.type";

/**
 * @see https://github.com/editor-js/header
 */
export const headerBlock: BlockConverter<string, HeaderData> = (
  block,
  textCb,
  tunesCb
) => {
  return [
    {
      type: "heading",
      content: textCb(block.data.text),
      attrs: {
        ...tunesCb(block.tunes),
        level: block.data.level,
      },
    },
  ];
};
