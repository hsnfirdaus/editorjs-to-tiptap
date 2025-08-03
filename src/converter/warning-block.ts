import type { WarningData } from "@editorjs/warning";
import type { BlockConverter } from "./converter.type";

/**
 * @see https://github.com/editor-js/warning
 */
export const warningBlock: BlockConverter<string, WarningData> = (
  block,
  textCb,
  tunesCb
) => {
  return [
    {
      type: "details",
      content: [
        {
          type: "detailsSummary",
          content: textCb(block.data.title),
        },
        {
          type: "detailsContent",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
              },
              content: textCb(block.data.message),
            },
          ],
        },
      ],
      attrs: tunesCb(block.tunes),
    },
  ];
};
