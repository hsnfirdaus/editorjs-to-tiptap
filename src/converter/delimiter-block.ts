import type { BlockConverter } from "./converter.type";

/**
 * @see https://github.com/editor-js/delimiter
 */
export const delimiterBlock: BlockConverter<string, {}> = (
  block,
  textCb,
  tunesCb
) => {
  return [
    {
      type: "horizontalRule",
      attrs: tunesCb(block.tunes),
    },
  ];
};
