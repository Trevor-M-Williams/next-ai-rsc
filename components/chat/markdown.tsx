import Markdown from "react-markdown";

export function MarkdownProse({ content }: { content: string }) {
  const markdown = content;

  return <Markdown className="prose mx-auto">{markdown}</Markdown>;
}
