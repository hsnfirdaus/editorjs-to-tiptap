# EditorJS to TipTap

A TypeScript library to convert [EditorJS](https://editorjs.io/) output data to [TipTap](https://tiptap.dev/) JSONContent format.

## Installation

```bash
npm install editorjs-to-tiptap
```

## Basic Usage

```typescript
import { EditorJSToTipTap } from "editorjs-to-tiptap";

const converter = new EditorJSToTipTap();
const editorJSData = {
  time: 1754228423384,
  blocks: [
    {
      id: "UidmH8dcer",
      type: "header",
      data: {
        text: "Hello World",
        level: 1,
      },
    },
    {
      id: "AilOau39sk",
      type: "paragraph",
      data: {
        text: "This is a paragraph with <b>bold</b> text.",
      },
    },
  ],
  version: "2.29.1",
};

const tiptapContent = converter.convert(editorJSData);
console.log(tiptapContent);
```

## Supported EditorJS Blocks

The library comes with built-in converters for the following EditorJS blocks:

| EditorJS Block | Package               | TipTap Node                           | Description                                      |
| -------------- | --------------------- | ------------------------------------- | ------------------------------------------------ |
| **Header**     | `@editorjs/header`    | `heading`                             |                                                  |
| **Paragraph**  | `@editorjs/paragraph` | `paragraph`                           |                                                  |
| **Quote**      | `@editorjs/quote`     | `blockquote`                          |                                                  |
| **Code**       | `@editorjs/code`      | `codeBlock`                           | Support language in data                         |
| **List**       | `@editorjs/list`      | `bulletList`/`orderedList`/`taskList` | Support nested                                   |
| **Image**      | `@editorjs/image`     | `image`                               | Captions become alt and title                    |
| **Link**       | `@editorjs/link`      | `paragraph`, `link`                   | Paragraph with inline href, other data will gone |
| **Warning**    | `@editorjs/warning`   | `details`                             | details, detailsSummary, and detailsContent node |
| **Table**      | `@editorjs/table`     | `table`                               |                                                  |
| **Delimiter**  | `@editorjs/delimiter` | `horizontalRule`                      |                                                  |
| **Embed**      | `@editorjs/embed`     | `youtube`                             | Only support youtube embed                       |

## Supported HTML Markup

The library handles HTML markup within text content using mark converters:

| HTML Tag         | TipTap Mark | Description                   |
| ---------------- | ----------- | ----------------------------- |
| `<b>`            | `bold`      | Bold text formatting          |
| `<i>`            | `italic`    | Italic text formatting        |
| `<u>`            | `underline` | Underlined text formatting    |
| `<s>`            | `strike`    | Strikethrough text formatting |
| `<a href="...">` | `link`      | Link with href attribute      |
| `<code>`         | `code`      | Inline code formatting        |

## Supported Block Tunes

Block tunes add additional attributes and functionality to EditorJS blocks:

| Tune Name     | Package                                                                                              | Converted Attributes | Description                         |
| ------------- | ---------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------- |
| **Alignment** | [`editorjs-text-alignment-blocktune`](https://github.com/kaaaaaaaaaaai/editorjs-alignment-blocktune) | `textAlign`          | Using `anyTuneName` key, as example |

## Customization

### Custom Block Converters

You can create custom block converters or override existing ones:

```typescript
import {
  EditorJSToTipTap,
  defaultBlockConverter,
  type BlockConverter,
} from "editorjs-to-tiptap";

// Create a custom converter for a custom block
const customBlock: BlockConverter<string, { content: string }> = (
  block,
  textCb,
  tunesCb
) => {
  return [
    {
      type: "customNode",
      content: textCb(block.data.content), // This will handle inline markup
      attrs: tunesCb(block.tunes),
    },
  ];
};

// Use custom converters
const converter = new EditorJSToTipTap({
  blockConverters: {
    ...defaultBlockConverter,
    myBlock: customBlock,
    // ... other blocks
  },
});
```

### Custom Mark Converters

Mark converters handle HTML markup within text content:

```typescript
import {
  EditorJSToTipTap,
  defaultMarkConverter,
  type MarkConverter,
} from "editorjs-to-tiptap";

class CustomMark implements MarkConverter {
  tags = ["sup"];

  convert = (tag, children, attributes) => {
    const mark = { type: "sup" };

    return children.map((item) => ({
      ...item,
      marks: [...(item.marks || []), mark],
    }));
  };
}

const converter = new EditorJSToTipTap({
  markConverters: [
    // Include default mark converters
    ...defaultMarkConverter,
    new CustomMark(),
  ],
});
```

### Custom Attribute Tune Converters

Attribute tune converters handle EditorJS block tunes (like alignment):

```typescript
import {
  EditorJSToTipTap,
  defaultAttrTuneConverters,
  type AttrTuneConverter,
} from "editorjs-to-tiptap";

const customAlignmentTune: AttrTuneConverter<{ alignment: string }> = (
  tuneData
) => {
  return {
    textAlign: tuneData.alignment || "left",
    customAttribute: "value",
  };
};

const converter = new EditorJSToTipTap({
  attrTuneConverters: {
    ...defaultAttrTuneConverters,
    alignment: customAlignmentTune,
  },
});
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
