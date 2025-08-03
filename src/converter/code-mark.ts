import type { MarkConverter, MarkConverterConvert } from "./converter.type";

/**
 * Is tiptap doesn't support b/i/s/u tags in code marks?
 */
export class CodeMark implements MarkConverter {
  tags = ["code"];

  convert: MarkConverterConvert = (tag, children, attributes) => {
    return [
      {
        type: "text",
        text: children.map((item) => item.text).join(""),
        marks: [
          {
            type: "code",
          },
        ],
      },
    ];
  };
}
