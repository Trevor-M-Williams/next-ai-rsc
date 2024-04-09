export async function getHeadlines(query: string) {
  const response = await fetch(`https://news.google.com/search?q=${query}`);
  const data = await response.text();

  const articles = data.match(/<article.*?<\/article>/gs);
  if (!articles) {
    return [];
  }

  const headlines = articles.map((article) => {
    const aTags = article.match(/<a.*?<\/a>/gs);
    if (!aTags) {
      return "";
    }

    const text = aTags.map((a) => a.replace(/<.*?>/g, "")).join("");
    return text;
  });

  return headlines;
}
