export type TokenType =
  | "text"
  | "opening_tag"
  | "closing_tag"
  | "self_closing_tag";

export interface Token {
  type: TokenType;
  value: string;
  tagName?: string;
  attributes?: Record<string, string>;
  position: number;
}

export class Tokenizer {
  private input: string;
  private position: number = 0;

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    this.position = 0;

    while (this.position < this.input.length) {
      if (this.current() === "<") {
        const tagToken = this.parseTag();
        if (tagToken) {
          tokens.push(tagToken);
        }
      } else {
        const textToken = this.parseText();
        if (textToken) {
          tokens.push(textToken);
        }
      }
    }

    return tokens;
  }

  private current(): string {
    return this.input[this.position] || "";
  }

  private advance(): string {
    return this.input[this.position++] || "";
  }

  private parseText(): Token | null {
    const start = this.position;
    let text = "";

    while (this.position < this.input.length && this.current() !== "<") {
      text += this.advance();
    }

    if (text.length === 0) {
      return null;
    }

    return {
      type: "text",
      value: text,
      position: start,
    };
  }

  private parseTag(): Token | null {
    const start = this.position;

    if (this.current() !== "<") {
      return null;
    }

    this.advance(); // consume '<'

    // Check if it's a closing tag
    const isClosing = this.current() === "/";
    if (isClosing) {
      this.advance(); // consume '/'
    }

    // Parse tag name
    const tagName = this.parseTagName();
    if (!tagName) {
      return null;
    }

    // Skip whitespace
    this.skipWhitespace();

    // Parse attributes (only for opening tags)
    const attributes: Record<string, string> = {};
    if (!isClosing) {
      this.parseAttributes(attributes);
    }

    // Skip whitespace
    this.skipWhitespace();

    // Check for self-closing tag
    const isSelfClosing = this.current() === "/";
    if (isSelfClosing) {
      this.advance(); // consume '/'
    }

    // Consume '>'
    if (this.current() !== ">") {
      // Invalid tag, treat as text
      this.position = start;
      return null;
    }
    this.advance(); // consume '>'

    const tokenType: TokenType = isClosing
      ? "closing_tag"
      : isSelfClosing
        ? "self_closing_tag"
        : "opening_tag";

    return {
      type: tokenType,
      value: this.input.slice(start, this.position),
      tagName,
      attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      position: start,
    };
  }

  private parseTagName(): string {
    let tagName = "";

    while (
      this.position < this.input.length &&
      /[a-zA-Z0-9]/.test(this.current())
    ) {
      tagName += this.advance();
    }

    return tagName;
  }

  private parseAttributes(attributes: Record<string, string>): void {
    while (
      this.position < this.input.length &&
      this.current() !== ">" &&
      this.current() !== "/"
    ) {
      this.skipWhitespace();

      if (this.current() === ">" || this.current() === "/") {
        break;
      }

      const attr = this.parseAttribute();
      if (attr) {
        attributes[attr.name] = attr.value;
      }
    }
  }

  private parseAttribute(): { name: string; value: string } | null {
    const name = this.parseAttributeName();
    if (!name) {
      return null;
    }

    this.skipWhitespace();

    if (this.current() !== "=") {
      // Attribute without value
      return { name, value: "" };
    }

    this.advance(); // consume '='
    this.skipWhitespace();

    const value = this.parseAttributeValue();
    return { name, value };
  }

  private parseAttributeName(): string {
    let name = "";

    while (
      this.position < this.input.length &&
      /[a-zA-Z0-9\-_]/.test(this.current())
    ) {
      name += this.advance();
    }

    return name;
  }

  private parseAttributeValue(): string {
    const quote = this.current();

    if (quote !== '"' && quote !== "'") {
      // Unquoted value
      let value = "";
      while (
        this.position < this.input.length &&
        !/\s/.test(this.current()) &&
        this.current() !== ">" &&
        this.current() !== "/"
      ) {
        value += this.advance();
      }
      return value;
    }

    this.advance(); // consume opening quote
    let value = "";

    while (this.position < this.input.length && this.current() !== quote) {
      value += this.advance();
    }

    if (this.current() === quote) {
      this.advance(); // consume closing quote
    }

    return value;
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && /\s/.test(this.current())) {
      this.advance();
    }
  }
}
