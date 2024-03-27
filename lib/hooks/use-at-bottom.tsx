import * as React from "react";

export function useAtBottom(offset = 0) {
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  let scrollArea: HTMLElement | null = null;

  React.useEffect(() => {
    scrollArea = document.querySelector(".scroll-area");
  }, []);

  React.useEffect(() => {
    if (!scrollArea) return;

    const handleScroll = () => {
      if (!scrollArea) return;

      const isAtBottom =
        scrollArea.scrollTop + scrollArea.clientHeight >=
        scrollArea.scrollHeight - offset;
      setIsAtBottom(isAtBottom);
    };

    scrollArea.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (!scrollArea) return;

      scrollArea.removeEventListener("scroll", handleScroll);
    };
  }, [offset, scrollArea]);

  return isAtBottom;
}
