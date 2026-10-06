import { getCollection } from "astro:content";

export const DOMAIN = "https://jaenudin.vercel.app";
export const NAME = "Jae.";
export const TITLE = "Jae. | Polymath Dev";
export const DESC =
  "focused on fast, performance-conscious code and thoughtful interaction design.";

const now = new Date(); // Ensure this is defined!

export const BLOG = (await getCollection("blog"))
  .filter((post) => {
    if (post.data.status === "PUBLISH") return true;

    if (post.data.status === "SCHEDULE" && post.data.date) {
      return post.data.date.getTime() <= now.getTime();
    }

    return false;
  })
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const CONNECT = [
  {
    label: "github/void-vim",
    value: "https://github.com/void-vim"
  },
  {
    label: "email",
    value: "mailto:jee.nvim@gmail.com",
  }
]

export const PROJECT = [
  {
    tag: "Neovim",
    title: "Nvim",
    description: "Neovim configuration focus on fast and minimalist.",
    website: "https://github.com/void-vim/nvim/",
    year: 2023,
  },
  {
    tag: "Web",
    title: "IFG Life",
    description: "Insurrance Company part of Danantara Indonesia.",
    website: "https://ifg-life.id/",
    year: 2024,
  },
  {
    tag: "Web",
    title: "Orderia",
    description: "Ordering reservation platform.",
    website: "https://orderia.id/",
    year: 2024,
  },
  {
    tag: "Web",
    title: "POS MMTOYS",
    description: "Internal POS for MMTOYS shop.",
    website: null,
    year: 2024,
  },
  {
    tag: "Web",
    title: "Play Bobobox",
    description: "Microservice for ordering additional activity at Bobobox.",
    website: "https://play.bobobox.com/",
    year: 2025,
  },
  {
    tag: "Linux",
    title: "Dotfiles Nix",
    description: "My Nixos Configuration.",
    website: "https://github.com/void-vim/dotfiles-nix/",
    year: 2025,
  },
  {
    tag: "Web",
    title: "Book Archive",
    description: "Internal Product for managing book for layouter.",
    website: "https://www.kemendikdasmen.go.id/",
    year: 2025,
  },
  {
    tag: "CLI",
    title: "Jmf",
    description: "Simple tool for mass manipulation file at once using Zig.",
    website: "https://github.com/void-vim/jmf/",
    year: 2025,
  },
  {
    tag: "CLI",
    title: "Vamoslabs",
    description: "Tracker crypto on-chain data.",
    website: null,
    year: 2026,
  },
  {
    tag: "CLI",
    title: "Baseline",
    description: "One-command baseline for a fresh Linux box (Ubuntu/Debian or RHEL/Fedora).",
    website: "https://github.com/void-vim/baseline",
    year: 2026,
  },
  {
    tag: "Web",
    title: "AMPM Creativelab",
    description: "Company profile of AMPM.",
    website: "https://ampmcreativelab.io/",
    year: 2026,
  },
  {
    tag: "Chrome Extension",
    title: "Focus Shield",
    description: "Hide distract element on the web.",
    website: "https://github.com/void-vim/focus-extension/",
    year: 2026,
  },
  {
    tag: "Web",
    title: "AkiraDATA DMS",
    description: "Enterprise DMS.",
    website: "https://akiradata.co.id/",
    year: 2026,
  },
  {
    tag: "Web",
    title: "Redesign Oxinos",
    description: "Company Profile of Oxinos.",
    website: "https://oxinos.id/",
    year: 2026,
  },
  {
    tag: "Web",
    title: "ImagenPictures",
    description: "Company Profile of ImagenPictures",
    website: "https://imagen-pictures.com/",
    year: 2026,
  },
  {
    tag: "CLI",
    title: "Clipper",
    description: "Video processing CLI tool for creating vertical (9:16) clips from youtube url or local video.",
    website: "https://github.com/void-vim/clipper/",
    year: 2026,
  },
  {
    tag: "Web",
    title: "Blog Bobobox",
    description: "Microservice blog replace the legacy blog.",
    website: "https://bobobox.com/blog/",
    year: 2026,
  },
  {
    tag: "CLI",
    title: "Syncro",
    description: "Discord Scheduler.",
    website: "https://github.com/void-vim/syncro/",
    year: 2026,
  },
];

