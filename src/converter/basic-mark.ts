import type { JSONContent } from "@tiptap/core";
import type { MarkConverter, MarkConverterConvert } from "./converter.type";

export class BasicMark implements MarkConverter {
  tags = ["a", "b", "i", "s", "u"];

  convert: MarkConverterConvert = (tag, children, attributes) => {
    let mark: Required<JSONContent>["marks"][0];
    switch (tag) {
      case "a":
        if (!attributes?.href) {
          throw new Error("Anchor tag requires 'href' attribute");
        }
        mark = {
          type: "link",
          attrs: {
            href: attributes.href,
            target: attributes.target || "_blank",
            rel: "noopener noreferrer nofollow",
            class: null,
          },
        };
        break;

      case "b":
        mark = { type: "bold" };
        break;

      case "i":
        mark = { type: "italic" };
        break;

      case "s":
        mark = { type: "strike" };
        break;

      case "u":
        mark = { type: "underline" };
        break;

      default:
        throw new Error(`Unsupported tag: ${tag}`);
    }

    return children.map((item) => ({
      ...item,
      marks: [...(item.marks || []), mark],
    }));
  };
}
