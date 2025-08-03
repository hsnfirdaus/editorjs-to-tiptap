import type { BlockConverter } from "./converter.type";

interface LinkData {
  link: string;
  meta: {
    title: string;
    site_name?: string;
    description: string;
    image: {
      url: string;
    };
  };
}

/**
 * @see https://github.com/editor-js/link
 *
 * THIS ONLY CONVERTS THE LINK BLOCK TO A PARAGRAPH WITH A LINK MARK.
 */
export const linkBlock: BlockConverter<string, LinkData> = (
  block,
  textCb,
  tunesCb
) => {
  return [
    {
      type: "paragraph",
      content: textCb(block.data.meta.title),
      marks: [
        {
          type: "link",
          attrs: {
            href: block.data.link,
            target: "_blank",
            rel: "noopener noreferrer nofollow",
            class: null,
          },
        },
      ],
      attrs: tunesCb(block.tunes),
    },
  ];
};
