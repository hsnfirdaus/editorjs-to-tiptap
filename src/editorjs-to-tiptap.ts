import type { OutputData } from "@editorjs/editorjs";
import type {
  Attrs,
  AttrTuneConverters,
  BlockConverters,
  EditorJSToTiptapOptions,
} from "./editorjs-to-tiptap.types";
import type { MarkConverter, TunesData } from "./converter/converter.type";
import type { JSONContent } from "@tiptap/core";
import { parseMarkup, type ASTNode } from "./markup";
import { decode } from "html-entities";
import {
  defaultAttrTuneConverters,
  defaultBlockConverter,
  defaultMarkConverter,
} from "./default-converter";

export default class EditorJSToTipTap {
  #blockConverters: BlockConverters;
  #markConverters: MarkConverter[];
  #attrTuneConverters: AttrTuneConverters;

  constructor(options: EditorJSToTiptapOptions = {}) {
    this.#blockConverters = options.blockConverters || defaultBlockConverter;
    this.#markConverters = options.markConverters || defaultMarkConverter;
    this.#attrTuneConverters =
      options.attrTuneConverters || defaultAttrTuneConverters;
  }

  convert(editorJSContent: OutputData): JSONContent {
    const nodes: JSONContent[] = [];
    for (const block of editorJSContent.blocks) {
      nodes.push(...this.nodeConverter(block));
    }
    return {
      type: "doc",
      content: nodes,
    };
  }

  nodeConverter(block: OutputData["blocks"][number]): JSONContent[] {
    const converter = this.#blockConverters[block.type];
    if (!converter) {
      throw new Error(`No converter registered for block type: ${block.type}`);
    }
    return converter(
      block,
      this.textMarkupParser.bind(this),
      this.attrTuneConverter.bind(this)
    );
  }

  attrTuneConverter(tunes?: TunesData): Attrs {
    if (!tunes) {
      return {};
    }
    const attrs: Attrs = {};
    for (const [name, data] of Object.entries(tunes)) {
      const converter = this.#attrTuneConverters[name];
      if (converter) {
        Object.assign(attrs, converter(data));
      } else {
        throw new Error(`No tune converter registered for: ${name}`);
      }
    }
    return attrs;
  }

  textMarkupParser(text: string): JSONContent[] {
    const markup = parseMarkup(text);
    return this.#parsedMarkupConvert(markup);
  }

  #parsedMarkupConvert(nodes: ASTNode[]): JSONContent[] {
    const content: JSONContent[] = [];
    for (const node of nodes) {
      if (node.type === "text") {
        const text = decode(node.value);
        if (text === "") continue; // Skip empty text nodes
        content.push({ type: "text", text });
      } else if (node.type === "element") {
        const converter = this.#markConverters.find((c) =>
          c.tags.includes(node.tag)
        );
        if (!converter) {
          throw new Error(
            `Markup converter not registered for tag: ${node.tag}`
          );
        }
        const convertedContent = converter.convert(
          node.tag,
          this.#parsedMarkupConvert(node.children),
          node.attributes
        );
        content.push(...convertedContent);
      }
    }

    return content;
  }
}
