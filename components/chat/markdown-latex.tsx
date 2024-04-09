import "katex/dist/katex.min.css";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function MarkdownLatex({ content }: { content: string }) {
  const markdown = content;
  // .replaceAll("\\[", "$$")
  // .replaceAll("\\]", "$$")
  // .replaceAll("\\(", "$$")
  // .replaceAll("\\)", "$$")
  // .replaceAll("\text", "\\text")
  // .replaceAll("\frac", "\\frac");

  return (
    <Markdown
      className="prose"
      //   remarkPlugins={[remarkMath]}
      //   rehypePlugins={[rehypeKatex]}
    >
      {markdown}
    </Markdown>
  );
}
