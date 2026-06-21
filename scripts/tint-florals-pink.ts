/**
 * Converts blue corner floral PNGs to blush pink using sharp tint.
 * Run: npx tsx scripts/tint-florals-pink.ts
 */
import sharp from "sharp"
import path from "path"

const PINK = { r: 232, g: 180, b: 192 }

const FILES = [
  "left-top-removebg-preview.png",
  "right-top-removebg-preview.png",
  "bottom-left-removebg-preview.png",
  "bottom-right-removebg-preview.png",
]

const DECO_DIR = path.join(process.cwd(), "public/decoration")

async function main() {
  for (const file of FILES) {
    const src = path.join(DECO_DIR, file)
    const dest = path.join(DECO_DIR, file.replace(".png", "-pink.png"))
    await sharp(src).tint(PINK).png().toFile(dest)
    console.log(`✓ ${path.basename(dest)}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
