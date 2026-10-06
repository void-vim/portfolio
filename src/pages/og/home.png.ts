import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { TITLE, DESC, NAME } from "../../lib/constants.ts";
import fontUrl from "../../../public/fonts/static-font.ttf?url";
import fs from "node:fs";
import path from "node:path";

async function loadFont(url: string) {
  const fontPath = path.resolve("./dist", url.replace(/^\/_astro\//, "_astro/"));
  return fs.readFileSync(fontPath);
}

export const prerender = true;

export async function GET() {
  const fontData = await loadFont(fontUrl);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#1f1f1f",
          padding: "80px",
        },
        children: [
          {
            type: "h1",
            props: {
              style: { fontSize: 72, color: "#f6f6f6", lineHeight: 1.1 },
              children: NAME,
            },
          },
          {
            type: "p",
            props: {
              style: { fontSize: 32, color: "#f6f6f6", marginTop: 40 },
              children: TITLE,
            },
          },
          {
            type: "p",
            props: {
              style: { fontSize: 24, color: "#a1a1a1", marginTop: 24 },
              children: DESC,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Roboto", data: fontData }],
    }
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: { "Content-Type": "image/png" },
  });
}
