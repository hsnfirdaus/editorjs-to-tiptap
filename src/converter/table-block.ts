import type { JSONContent } from "@tiptap/core";
import type { BlockConverter } from "./converter.type";

type TableData = {
  withHeadings: boolean;
  stretched: boolean;
  content: string[][];
};

/**
 * @see https://github.com/editor-js/table
 */
export const tableBlock: BlockConverter<string, TableData> = (
  block,
  textCb,
  tunesCb
) => {
  const content: JSONContent[] = [];
  let rowIdx = 0;
  for (const row of block.data.content) {
    const rowContent: JSONContent[] = [];
    for (const cell of row) {
      rowContent.push({
        type:
          block.data.withHeadings && rowIdx === 0 ? "tableHeader" : "tableCell",
        content: [
          {
            type: "paragraph",
            content: textCb(cell),
          },
        ],
      });
    }
    content.push({
      type: "tableRow",
      content: rowContent,
    });
    rowIdx++;
  }
  return [
    {
      type: "table",
      content,
      attrs: tunesCb(block.tunes),
    },
  ];
};
