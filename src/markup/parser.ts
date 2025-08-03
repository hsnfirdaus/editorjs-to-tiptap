import { Tokenizer } from "./tokenizer";
import type { Token } from "./tokenizer";

export type NodeType = "text" | "element";

export interface TextNode {
  type: "text";
  value: string;
}

export interface ElementNode {
  type: "element";
  tag: string;
  attributes?: Record<string, string>;
  children: ASTNode[];
}

export type ASTNode = TextNode | ElementNode;

export class Parser {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  static parse(input: string): ASTNode[] {
    const tokenizer = new Tokenizer(input);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    return parser.parseNodes();
  }

  parseNodes(): ASTNode[] {
    const nodes: ASTNode[] = [];
    this.position = 0;

    while (this.position < this.tokens.length) {
      const node = this.parseNode();
      if (node) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  private parseNode(): ASTNode | null {
    const token = this.current();

    if (!token) {
      return null;
    }

    switch (token.type) {
      case "text":
        return this.parseTextNode();
      case "opening_tag":
        return this.parseElementNode();
      case "self_closing_tag":
        return this.parseSelfClosingElement();
      case "closing_tag":
        // Unexpected closing tag, skip it
        this.advance();
        return null;
      default:
        this.advance();
        return null;
    }
  }

  private parseTextNode(): TextNode {
    const token = this.advance();
    return {
      type: "text",
      value: token.value,
    };
  }

  private parseElementNode(): ElementNode {
    const openingToken = this.advance();

    if (!openingToken.tagName) {
      throw new Error("Opening tag must have a tag name");
    }

    const element: ElementNode = {
      type: "element",
      tag: openingToken.tagName,
      children: [],
    };

    if (
      openingToken.attributes &&
      Object.keys(openingToken.attributes).length > 0
    ) {
      element.attributes = openingToken.attributes;
    }

    // Parse children until we find the matching closing tag
    while (this.position < this.tokens.length) {
      const token = this.current();

      if (!token) {
        break;
      }

      // Check if this is the matching closing tag
      if (
        token.type === "closing_tag" &&
        token.tagName === openingToken.tagName
      ) {
        this.advance(); // consume closing tag
        break;
      }

      const childNode = this.parseNode();
      if (childNode) {
        element.children.push(childNode);
      }
    }

    return element;
  }

  private parseSelfClosingElement(): ElementNode {
    const token = this.advance();

    if (!token.tagName) {
      throw new Error("Self-closing tag must have a tag name");
    }

    const element: ElementNode = {
      type: "element",
      tag: token.tagName,
      children: [],
    };

    if (token.attributes && Object.keys(token.attributes).length > 0) {
      element.attributes = token.attributes;
    }

    return element;
  }

  private current(): Token | null {
    return this.tokens[this.position] || null;
  }

  private advance(): Token {
    const token = this.tokens[this.position++];
    if (!token) {
      throw new Error("Unexpected end of tokens");
    }
    return token;
  }
}

// Export convenience function
export function parseMarkup(input: string): ASTNode[] {
  return Parser.parse(input);
}
