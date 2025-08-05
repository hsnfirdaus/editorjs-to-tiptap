import type EditorjsList from "@editorjs/list";
import type { BlockConverter } from "./converter.type";
import type { JSONContent } from "@tiptap/core";
import type { Attrs, TextCb } from "../editorjs-to-tiptap.types";

/**
 * @see https://github.com/editor-js/list
 */
export const listBlock: BlockConverter<
  string,
  ReturnType<EditorjsList["save"]>
> = (block, textCb, tunesCb) => {
  return processList(block.data, textCb, tunesCb(block.tunes));
};
const processList = (
  data: ReturnType<EditorjsList["save"]>,
  textCb: TextCb,
  attr?: Attrs
) => {
  const meta = data.meta || {};
  const type =
    data.style === "ordered"
      ? "orderedList"
      : data.style === "unordered"
        ? "bulletList"
        : data.style === "checklist"
          ? "taskList"
          : "";
  if (!type) {
    throw new Error(`Unsupported list style: ${data.style}`);
  }
  const content: JSONContent[] = [];
  for (const item of data.items) {
    let innerContent: JSONContent[] = [];
    if (item.content) {
      innerContent.push({
        type: "paragraph",
        content: textCb(item.content),
      });
    }
    if (item.items && item.items.length > 0) {
      innerContent.push(
        ...processList(
          {
            style: data.style,
            meta: item.meta,
            items: item.items,
          },
          textCb
        )
      );
    }
    if (type === "orderedList" || type === "bulletList") {
      content.push({
        type: "listItem",
        content: innerContent,
      });
    } else if (type === "taskList") {
      content.push({
        type: "taskItem",
        attrs: {
          checked: "checked" in meta ? meta.checked : false,
        },
        content: innerContent,
      });
    }
  }
  return [
    {
      type: type,
      attrs: {
        start: "start" in meta ? meta.start : undefined,
        type: "counterType" in meta ? meta.counterType : undefined,
        ...attr,
      },
      content,
    },
  ];
};
