import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getCollection } from "astro:content";
import fontUrl from "../../../public/fonts/static-font.ttf?url";
import fs from "node:fs";
import path from "node:path";

async function loadFont(url: string) {
  const fontPath = path.resolve("./dist", url.replace(/^\/_astro\//, "_astro/"));
  return fs.readFileSync(fontPath);
}

export async function GET({ props }: { props: { title: string; description: string } }) {
  const { title, description } = props;
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
              children: title,
            },
          },
          {
            type: "p",
            props: {
              style: { fontSize: 32, color: "#f6f6f6", marginTop: 40 },
              children: description,
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

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title, description: post.data.description },
  }));
}
