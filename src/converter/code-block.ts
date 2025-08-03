import type { CodeData } from "@editorjs/code";
import type { BlockConverter } from "./converter.type";

/**
 * @see https://github.com/editor-js/code
 */
export const codeBlock: BlockConverter<
  string,
  CodeData & { language?: string }
> = (block, textCb, tunesCb) => {
  return [
    {
      type: "codeBlock",
      content: [
        {
          type: "text",
          text: block.data.code,
        },
      ],
      attrs: {
        language: block.data.language || null,
        ...tunesCb(block.tunes),
      },
    },
  ];
};
