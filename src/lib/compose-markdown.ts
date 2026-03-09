type GuideSectionInput = {
  title: string;
  body: string;
};

const ATX_HEADING_PATTERN = /^(#{1,6})(\s+.*)$/gm;

const bumpHeadingDepth = (markdown: string): string =>
  markdown.replace(ATX_HEADING_PATTERN, (_, hashes: string, rest: string) => {
    const bumpedDepth = Math.min(hashes.length + 1, 6);
    return `${"#".repeat(bumpedDepth)}${rest}`;
  });

const formatGuideSection = ({ title, body }: GuideSectionInput): string => {
  const normalizedBody = bumpHeadingDepth(body.trim());
  return `## ${title}\n\n${normalizedBody}`;
};

export const composeGuidesMarkdown = (sections: GuideSectionInput[]): string =>
  sections.map(formatGuideSection).join("\n\n");
