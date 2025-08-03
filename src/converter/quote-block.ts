import type { QuoteData } from "@editorjs/quote";
import type { BlockConverter } from "./converter.type";

/**
 * @see https://github.com/editor-js/quote
 */
export const quoteBlock: BlockConverter<string, QuoteData> = (
  block,
  textCb,
  tunesCb
) => {
  return [
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: textCb(block.data.text),
          attrs: {
            textAlign: block.data.alignment || null,
          },
        },
        {
          type: "paragraph",
          content: textCb(block.data.caption),
          attrs: {
            textAlign: block.data.alignment || null,
          },
        },
      ],
      attrs: {
        ...tunesCb(block.tunes),
      },
    },
  ];
};
