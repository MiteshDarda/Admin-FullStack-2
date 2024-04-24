function formatDesignation(input) {
  if (input === "seo") return "SEO";
  else if (input === "qa") return "QA";
  if(input ==="other") return "Other";

  return input
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default formatDesignation;
