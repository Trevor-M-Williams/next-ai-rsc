import * as React from "react";

export function useAtBottom(offset = 0) {
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  const scrollArea = document.querySelector(
    "[data-radix-scroll-area-viewport]"
  ) as HTMLElement;

  React.useEffect(() => {
    if (!scrollArea) return;

    const handleScroll = () => {
      const isAtBottom =
        scrollArea.scrollTop + scrollArea.clientHeight >=
        scrollArea.scrollHeight - offset;
      setIsAtBottom(isAtBottom);
    };

    scrollArea.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      scrollArea.removeEventListener("scroll", handleScroll);
    };
  }, [offset, scrollArea]);

  return isAtBottom;
}
