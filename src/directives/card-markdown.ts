import logger from "@/modules/logger";

const rules: {
  pattern: RegExp;
  replace: string;
}[] = [
  {
    pattern: /\n/g,
    replace: "<br/>",
  },
  {
    pattern: /\*\*(.*?)\*\*/g,
    replace: "<b>$1</b>",
  },
  {
    pattern: /{?(.)}/g,
    replace: `
<img class="card-text-icon" src="/assets/icon/text/$1.webp"/>
`,
  },
  {
    pattern: /^(.*?)\/\/(.*?)$/s,
    replace: `<div class="card-meld">
  <div class="card-meld-left">$1</div>
  <div class="card-meld-right">
    <b>Meld</b>$2
  </div>
</div>`,
  },
];


const vCardMarkdown = {
  mounted(element: HTMLElement) {
    let html = element.textContent;
    if (!html) {
      return;
    }

    const isMeld = html.includes("//");
    logger.debug("Pre Card Markdown", html);
    for (const rule of rules) {
      html = html.replace(rule.pattern, rule.replace);
    }

    if (!isMeld) {
      html = `<div class="card-normal">${html}</div>`;
    }

    logger.debug("Post Card Markdown", html);
    element.innerHTML = html;
  },
};

export default vCardMarkdown;

