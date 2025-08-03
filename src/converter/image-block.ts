import type ImageTool from "@editorjs/image";
import type { BlockConverter } from "./converter.type";

/**
 * @see https://github.com/editor-js/image
 */
export const imageBlock: BlockConverter<
  string,
  ReturnType<ImageTool["save"]>
> = (block, textCb, tunesCb) => {
  return [
    {
      type: "image",
      attrs: {
        src: block.data.file.url,
        alt: block.data.caption || null,
        title: block.data.caption || null,
        ...tunesCb(block.tunes),
      },
    },
  ];
};
