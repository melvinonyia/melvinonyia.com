export interface SocialLink {
  key: "github" | "linkedin" | "x";
  label: string;
  href: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { key: "github", label: "GitHub", href: "https://github.com/melvinonyia" },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/melvinonyia/",
  },
  { key: "x", label: "X", href: "https://x.com/melvinonyia" },
] as const;

export const CONTACT_EMAIL = "hello@melvinonyia.com";
