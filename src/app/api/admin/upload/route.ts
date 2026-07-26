import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { slugify } from "@/lib/utils";

/**
 * Nahrávanie fotografií z administrácie.
 *
 * Dva režimy, rovnako ako obsahová vrstva:
 *  – Vercel Blob, ak je nastavený BLOB_READ_WRITE_TOKEN (produkcia na Verceli),
 *  – zápis do /public/foto pri lokálnom vývoji.
 *
 * Obrázky sa zmenšujú už v prehliadači, sem prichádza hotový JPEG – server
 * tak nepotrebuje sharp ani inú natívnu závislosť. PDF sa ukladajú tak, ako
 * prídu (max. 25 MB), do samostatného priečinka.
 *
 * POZOR: PDF sa zverejňujú verejne. Pred nahratím dokumentu, ktorý obsahuje
 * osobné údaje, ho anonymizujte (viď README).
 */

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_DOC_BYTES = 25 * 1024 * 1024; // 25 MB
const IMAGES = ["image/jpeg", "image/png", "image/webp"];
const DOCS = ["application/pdf"];

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Neplatný formát požiadavky." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Chýba súbor." }, { status: 400 });
  }
  const isDoc = DOCS.includes(file.type);
  const isImage = IMAGES.includes(file.type);
  if (!isDoc && !isImage) {
    return NextResponse.json(
      { error: "Povolené sú obrázky (JPEG, PNG, WebP) alebo PDF." },
      { status: 400 },
    );
  }
  const limit = isDoc ? MAX_DOC_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    return NextResponse.json(
      {
        error: isDoc
          ? "PDF je príliš veľké (max. 25 MB)."
          : "Obrázok je príliš veľký (max. 8 MB po zmenšení).",
      },
      { status: 400 },
    );
  }

  const ext = isDoc
    ? "pdf"
    : file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const folder = isDoc ? "dokumenty" : "foto";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "foto";
  const name = `${base}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

  // 1) Vercel Blob (produkcia)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`${folder}/${name}`, file, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      console.error("[upload] Blob zlyhal:", err);
      return NextResponse.json(
        { error: "Nahrávanie do úložiska zlyhalo." },
        { status: 502 },
      );
    }
  }

  // 2) Lokálny súborový systém (vývoj)
  try {
    const dir = path.join(process.cwd(), "public", folder);
    await fs.mkdir(dir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, name), buf);
    return NextResponse.json({ url: `/${folder}/${name}` });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      return NextResponse.json(
        {
          error:
            "Úložisko je read-only. Na Verceli zapnite Blob a doplňte BLOB_READ_WRITE_TOKEN (viď README).",
        },
        { status: 503 },
      );
    }
    console.error("[upload] Zápis zlyhal:", err);
    return NextResponse.json({ error: "Uloženie súboru zlyhalo." }, { status: 500 });
  }
}
