import type { ParagraphData } from "@editorjs/paragraph";
import type { BlockConverter } from "./converter.type";

/**
 * @see https://github.com/editor-js/paragraph
 */
export const paragraphBlock: BlockConverter<string, ParagraphData> = (
  block,
  textCb,
  tunesCb
) => {
  return [
    {
      type: "paragraph",
      content: textCb(block.data.text),
      attrs: tunesCb(block.tunes),
    },
  ];
};
