import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\\n/g, "\n")
    .trim();
}

function extractMetaContent(html: string, keys: string[]): string {
  for (const key of keys) {
    const reg1 = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i"
    );
    const m1 = html.match(reg1);
    if (m1?.[1]) return decodeHtmlEntities(m1[1]);

    const reg2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["'][^>]*>`,
      "i"
    );
    const m2 = html.match(reg2);
    if (m2?.[1]) return decodeHtmlEntities(m2[1]);
  }
  return "";
}

function cleanInstagramCaption(raw: string): string {
  if (!raw) return "";
  const text = decodeHtmlEntities(raw);

  // Format umum og:description Instagram:
  // '120 likes, 5 comments - username on October 24, 2026: "Isi keterangan..."'
  const colonQuoteMatch = text.match(/:\s*["“]([\s\S]+)["”]\.?$/);
  if (colonQuoteMatch?.[1]) {
    return colonQuoteMatch[1].trim();
  }

  const simpleColon = text.match(/^[^:]{2,90}:\s*["“]?([\s\S]+?)["”]?\s*$/);
  if (
    simpleColon?.[1] &&
    (text.toLowerCase().includes("instagram") ||
      text.toLowerCase().includes("likes") ||
      text.toLowerCase().includes("comments"))
  ) {
    return simpleColon[1].trim();
  }

  return text.trim();
}

function cleanFacebookCaption(raw: string, rawTitle: string): string {
  const desc = decodeHtmlEntities(raw || "");
  const title = decodeHtmlEntities(rawTitle || "");
  if (desc && !desc.toLowerCase().startsWith("log in or sign up to view")) {
    return desc;
  }
  if (
    title &&
    title.toLowerCase() !== "facebook" &&
    !title.toLowerCase().startsWith("masuk atau daftar") &&
    !title.toLowerCase().startsWith("log in")
  ) {
    return title;
  }
  return "";
}

function deriveShortTitle(caption: string, fallbackPlatform: string): string {
  if (!caption) return `Kegiatan ${fallbackPlatform} MTs Al Falaahiyyah`;
  const lines = caption
    .split(/\r?\n/)
    .map((l) => l.replace(/^[#\s•✨🌟🏆📌📍🕌🎓]+/, "").trim())
    .filter(Boolean);
  const firstLine = lines[0] || caption;
  if (firstLine.length <= 80) return firstLine;
  return firstLine.slice(0, 77).trim() + "...";
}

async function fetchImageAsDataUrl(imageUrl: string): Promise<string> {
  if (!imageUrl || imageUrl.startsWith("data:")) return imageUrl;
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        Referer: "https://www.instagram.com/",
      },
    });
    if (!res.ok) return imageUrl;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength > 1.5 * 1024 * 1024) {
      return imageUrl;
    }
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch {
    return imageUrl;
  }
}

function detectPlatform(
  url: string
): "instagram" | "facebook" | "youtube" | "tiktok" | "social" {
  const lower = url.toLowerCase();
  if (lower.includes("instagram.com") || lower.includes("instagr.am")) return "instagram";
  if (
    lower.includes("facebook.com") ||
    lower.includes("fb.watch") ||
    lower.includes("fb.com")
  )
    return "facebook";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("tiktok.com")) return "tiktok";
  return "social";
}

function extractInstagramInfo(url: string): { shortcode: string; type: "p" | "reel" | "tv" } | null {
  const match = url.match(/instagram\.com\/(?:[^/]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  if (!match) return null;
  const rawType = match[1].toLowerCase();
  const type = rawType === "reels" ? "reel" : (rawType as "p" | "reel" | "tv");
  return { shortcode: match[2], type };
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.split("/").filter(Boolean)[0] || null;
    }
    const vParam = parsed.searchParams.get("v");
    if (vParam) return vParam;
    const pathMatch = parsed.pathname.match(/\/(?:shorts|embed|v|live)\/([A-Za-z0-9_-]{6,})/);
    if (pathMatch?.[1]) return pathMatch[1];
  } catch {
    // ignore
  }
  const regexMatch = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return regexMatch?.[1] || null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUrl = (body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json(
        { success: false, message: "Tautan URL tidak boleh kosong." },
        { status: 400 }
      );
    }

    let validUrl: URL;
    try {
      validUrl = new URL(rawUrl);
    } catch {
      return NextResponse.json(
        { success: false, message: "Format tautan URL tidak valid. Pastikan diawali https://" },
        { status: 400 }
      );
    }

    const platform = detectPlatform(validUrl.toString());

    // =========================================================================
    // 1. YOUTUBE HANDLER
    // =========================================================================
    if (platform === "youtube") {
      const videoId = extractYouTubeId(validUrl.toString());
      if (!videoId) {
        return NextResponse.json(
          { success: false, message: "Tidak dapat mengenali ID Video YouTube dari tautan tersebut." },
          { status: 400 }
        );
      }

      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      const defaultThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      let title = "";
      let description = "";
      let imageUrl = defaultThumb;

      try {
        const oembedRes = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(
            `https://www.youtube.com/watch?v=${videoId}`
          )}&format=json`,
          { cache: "no-store" }
        );
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          title = oembedData.title || "";
          if (oembedData.author_name) {
            description = `${oembedData.title || ""}\n\nKanal YouTube: ${oembedData.author_name}`;
          }
          if (oembedData.thumbnail_url) {
            imageUrl = oembedData.thumbnail_url;
          }
        }
      } catch {
        // fallback ke scrape halaman
      }

      try {
        const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
          headers: {
            "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          },
          cache: "no-store",
        });
        if (pageRes.ok) {
          const html = await pageRes.text();
          const ogTitle = extractMetaContent(html, ["og:title", "twitter:title"]);
          const ogDesc = extractMetaContent(html, ["og:description", "description", "twitter:description"]);
          if (ogTitle && !title) title = ogTitle;
          if (ogDesc) description = ogDesc;
        }
      } catch {
        // abaikan
      }

      return NextResponse.json({
        success: true,
        data: {
          sourceType: "youtube",
          sourceUrl: validUrl.toString(),
          embedUrl,
          imageUrl,
          title: title || "Dokumentasi Video YouTube MTs Al Falaahiyyah",
          description: description || title || "",
        },
      });
    }

    // =========================================================================
    // 2. INSTAGRAM HANDLER
    // =========================================================================
    if (platform === "instagram") {
      const igInfo = extractInstagramInfo(validUrl.toString());
      if (!igInfo) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Tautan Instagram harus berupa link postingan (/p/...), Reel (/reel/...), atau IGTV (/tv/...).",
          },
          { status: 400 }
        );
      }

      const cleanIgUrl = `https://www.instagram.com/${igInfo.type}/${igInfo.shortcode}/`;
      const embedUrl = `https://www.instagram.com/${igInfo.type}/${igInfo.shortcode}/embed/captioned/`;

      let caption = "";
      let rawImageUrl = "";

      // Lapisan 1: Ambil dari endpoint Embed Captioned Instagram
      try {
        const embedRes = await fetch(embedUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          },
          cache: "no-store",
        });

        if (embedRes.ok) {
          const embedHtml = await embedRes.text();

          const imgMatch =
            embedHtml.match(/class=["'][^"']*EmbeddedMediaImage[^"']*["'][^>]+src=["']([^"']+)["']/i) ||
            embedHtml.match(/src=["']([^"']+)["'][^>]+class=["'][^"']*EmbeddedMediaImage[^"']*["']/i);
          if (imgMatch?.[1]) {
            rawImageUrl = decodeHtmlEntities(imgMatch[1]);
          }

          const captionBlockMatch = embedHtml.match(
            /<div[^>]+class=["'][^"']*Caption[^"']*["'][^>]*>([\s\S]*?)<div[^>]+class=["'][^"']*CaptionComments/i
          );
          if (captionBlockMatch?.[1]) {
            let block = captionBlockMatch[1];
            block = block.replace(/<a[^>]+class=["'][^"']*CaptionUsername[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "");
            block = block
              .replace(/<br\s*\/?>/gi, "\n")
              .replace(/<[^>]+>/g, "")
              .trim();
            const cleaned = decodeHtmlEntities(block);
            if (cleaned) caption = cleaned;
          }

          if (!caption || !rawImageUrl) {
            const displayUrlMatch = embedHtml.match(/"display_url"\s*:\s*"([^"]+)"/);
            if (!rawImageUrl && displayUrlMatch?.[1]) {
              rawImageUrl = decodeHtmlEntities(displayUrlMatch[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
            }
            const edgeCaptionMatch = embedHtml.match(
              /"edge_media_to_caption"\s*:\s*\{\s*"edges"\s*:\s*\[\s*\{\s*"node"\s*:\s*\{\s*"text"\s*:\s*"((?:[^"\\]|\\.)*)"/
            );
            if (!caption && edgeCaptionMatch?.[1]) {
              try {
                caption = JSON.parse(`"${edgeCaptionMatch[1]}"`);
              } catch {
                caption = decodeHtmlEntities(edgeCaptionMatch[1]);
              }
            }
          }
        }
      } catch {
        // lanjut ke lapisan berikutnya
      }

      // Lapisan 2: Ambil OpenGraph meta dengan Crawler User-Agent
      if (!caption || !rawImageUrl) {
        try {
          const ogRes = await fetch(cleanIgUrl, {
            headers: {
              "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
              Accept: "text/html,application/xhtml+xml",
            },
            cache: "no-store",
          });
          if (ogRes.ok) {
            const ogHtml = await ogRes.text();
            const ogDesc = extractMetaContent(ogHtml, ["og:description", "twitter:description", "description"]);
            const ogTitle = extractMetaContent(ogHtml, ["og:title", "twitter:title"]);
            const ogImg = extractMetaContent(ogHtml, ["og:image", "twitter:image"]);

            if (!rawImageUrl && ogImg) {
              rawImageUrl = ogImg;
            }
            if (!caption) {
              caption = cleanInstagramCaption(ogDesc || ogTitle);
            }
          }
        } catch {
          // lanjut ke lapisan 3
        }
      }

      // Lapisan 3: Microlink public API fallback
      if (!caption || !rawImageUrl) {
        try {
          const mlRes = await fetch(
            `https://api.microlink.io/?url=${encodeURIComponent(cleanIgUrl)}`,
            { cache: "no-store" }
          );
          if (mlRes.ok) {
            const mlJson = await mlRes.json();
            const mlData = mlJson?.data;
            if (mlData) {
              if (!rawImageUrl && mlData.image?.url) {
                rawImageUrl = mlData.image.url;
              }
              if (!caption && (mlData.description || mlData.title)) {
                caption = cleanInstagramCaption(mlData.description || mlData.title);
              }
            }
          }
        } catch {
          // abaikan
        }
      }

      const finalImageUrl = rawImageUrl ? await fetchImageAsDataUrl(rawImageUrl) : "";
      const shortTitle = deriveShortTitle(caption, "Instagram");

      return NextResponse.json({
        success: true,
        data: {
          sourceType: "instagram",
          sourceUrl: cleanIgUrl,
          embedUrl,
          imageUrl: finalImageUrl,
          title: shortTitle,
          description: caption,
        },
      });
    }

    // =========================================================================
    // 3. FACEBOOK HANDLER
    // =========================================================================
    if (platform === "facebook") {
      const fbUrl = validUrl.toString();
      const isVideo =
        fbUrl.includes("/videos/") ||
        fbUrl.includes("/reel/") ||
        fbUrl.includes("/watch") ||
        fbUrl.includes("fb.watch");
      const embedUrl = isVideo
        ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(fbUrl)}&show_text=true&width=500`
        : `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(fbUrl)}&show_text=true&width=500`;

      let caption = "";
      let rawImageUrl = "";

      try {
        const fbRes = await fetch(fbUrl, {
          headers: {
            "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
            Accept: "text/html,application/xhtml+xml",
          },
          redirect: "follow",
          cache: "no-store",
        });

        if (fbRes.ok) {
          const fbHtml = await fbRes.text();
          const ogDesc = extractMetaContent(fbHtml, ["og:description", "twitter:description", "description"]);
          const ogTitle = extractMetaContent(fbHtml, ["og:title", "twitter:title"]);
          const ogImg = extractMetaContent(fbHtml, ["og:image", "twitter:image"]);

          if (ogImg) rawImageUrl = ogImg;
          caption = cleanFacebookCaption(ogDesc, ogTitle);
        }
      } catch {
        // lanjut ke lapisan 2
      }

      if (!caption || !rawImageUrl) {
        try {
          const mlRes = await fetch(
            `https://api.microlink.io/?url=${encodeURIComponent(fbUrl)}`,
            { cache: "no-store" }
          );
          if (mlRes.ok) {
            const mlJson = await mlRes.json();
            const mlData = mlJson?.data;
            if (mlData) {
              if (!rawImageUrl && mlData.image?.url) {
                rawImageUrl = mlData.image.url;
              }
              if (!caption) {
                caption = cleanFacebookCaption(mlData.description || "", mlData.title || "");
              }
            }
          }
        } catch {
          // abaikan
        }
      }

      const finalImageUrl = rawImageUrl ? await fetchImageAsDataUrl(rawImageUrl) : "";
      const shortTitle = deriveShortTitle(caption, "Facebook");

      return NextResponse.json({
        success: true,
        data: {
          sourceType: "facebook",
          sourceUrl: fbUrl,
          embedUrl,
          imageUrl: finalImageUrl,
          title: shortTitle,
          description: caption,
        },
      });
    }

    // =========================================================================
    // 4. TIKTOK HANDLER
    // =========================================================================
    if (platform === "tiktok") {
      const tkUrl = validUrl.toString();
      let caption = "";
      let rawImageUrl = "";
      let embedUrl = "";

      const videoIdMatch = tkUrl.match(/\/video\/(\d+)/);
      if (videoIdMatch?.[1]) {
        embedUrl = `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}`;
      }

      // Gunakan oEmbed resmi TikTok
      try {
        const oembedRes = await fetch(
          `https://www.tiktok.com/oembed?url=${encodeURIComponent(tkUrl)}`,
          { cache: "no-store" }
        );
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData.title) caption = oembedData.title;
          if (oembedData.thumbnail_url) rawImageUrl = oembedData.thumbnail_url;
          if (!embedUrl && oembedData.embed_product_id) {
            embedUrl = `https://www.tiktok.com/embed/v2/${oembedData.embed_product_id}`;
          }
        }
      } catch {
        // fallback ke microlink
      }

      if (!caption || !rawImageUrl) {
        try {
          const mlRes = await fetch(
            `https://api.microlink.io/?url=${encodeURIComponent(tkUrl)}`,
            { cache: "no-store" }
          );
          if (mlRes.ok) {
            const mlJson = await mlRes.json();
            const mlData = mlJson?.data;
            if (mlData) {
              if (!rawImageUrl && mlData.image?.url) rawImageUrl = mlData.image.url;
              if (!caption) caption = mlData.description || mlData.title || "";
            }
          }
        } catch {
          // abaikan
        }
      }

      const finalImageUrl = rawImageUrl ? await fetchImageAsDataUrl(rawImageUrl) : "";
      const shortTitle = deriveShortTitle(caption, "TikTok");

      return NextResponse.json({
        success: true,
        data: {
          sourceType: "tiktok",
          sourceUrl: tkUrl,
          embedUrl,
          imageUrl: finalImageUrl,
          title: shortTitle,
          description: caption,
        },
      });
    }

    // =========================================================================
    // 5. MEDIA SOSIAL / TAUTAN ARTIKEL LAINNYA (Twitter/X, Threads, Web, dll.)
    // =========================================================================
    const otherUrl = validUrl.toString();
    let title = "";
    let description = "";
    let rawImageUrl = "";

    try {
      const pageRes = await fetch(otherUrl, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
        cache: "no-store",
      });
      if (pageRes.ok) {
        const html = await pageRes.text();
        title = extractMetaContent(html, ["og:title", "twitter:title"]);
        description = extractMetaContent(html, ["og:description", "twitter:description", "description"]);
        rawImageUrl = extractMetaContent(html, ["og:image", "twitter:image"]);
      }
    } catch {
      // lanjut ke microlink
    }

    if (!title || !description || !rawImageUrl) {
      try {
        const mlRes = await fetch(
          `https://api.microlink.io/?url=${encodeURIComponent(otherUrl)}`,
          { cache: "no-store" }
        );
        if (mlRes.ok) {
          const mlJson = await mlRes.json();
          const mlData = mlJson?.data;
          if (mlData) {
            if (!title && mlData.title) title = mlData.title;
            if (!description && mlData.description) description = mlData.description;
            if (!rawImageUrl && mlData.image?.url) rawImageUrl = mlData.image.url;
          }
        }
      } catch {
        // abaikan
      }
    }

    const finalImageUrl = rawImageUrl ? await fetchImageAsDataUrl(rawImageUrl) : "";
    const finalCaption = description || title || "";
    const finalTitle = title || deriveShortTitle(finalCaption, "Media Sosial");

    return NextResponse.json({
      success: true,
      data: {
        sourceType: "social",
        sourceUrl: otherUrl,
        embedUrl: "",
        imageUrl: finalImageUrl,
        title: finalTitle,
        description: finalCaption,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Gagal mengambil data otomatis dari tautan sosial media.",
      },
      { status: 500 }
    );
  }
}
