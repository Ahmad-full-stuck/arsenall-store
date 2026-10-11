import sharp from 'sharp'
import * as fs from 'fs'
import * as path from 'path'

const PRODUCTS_DIR = path.resolve('C:/Users/ali/Desktop/brand-store/artifacts/eva-fabrics-store/public/products')
const BRANDS = ['ah-lb03', 'roxsport', 'arsenall', 'almarefaco']
const SIZES = [320, 640, 1024]

async function processBrand(brand: string) {
  const brandDir = path.join(PRODUCTS_DIR, brand)
  if (!fs.existsSync(brandDir)) {
    console.log(`${brand}: no directory`)
    return
  }

  const files = fs.readdirSync(brandDir).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
  console.log(`\n=== ${brand}: ${files.length} files ===`)

  for (const file of files) {
    const baseName = path.basename(file, path.extname(file))
    const inputPath = path.join(brandDir, file)

    try {
      const metadata = await sharp(inputPath).metadata()
      console.log(`  ${file}: ${metadata.width}x${metadata.height}`)

      // Save original as webp (main image)
      const mainWebp = path.join(brandDir, `${baseName}.webp`)
      if (!fs.existsSync(mainWebp)) {
        await sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(mainWebp)
      }

      // Generate resized webp variants
      for (const size of SIZES) {
        const outPath = path.join(brandDir, `${baseName}-${size}.webp`)
        if (!fs.existsSync(outPath)) {
          await sharp(inputPath)
            .resize(size, size, { fit: 'cover', position: 'centre' })
            .webp({ quality: 80 })
            .toFile(outPath)
        }
      }

      // Remove original jpg/png if we created webp
      if (/\.(jpg|jpeg|png)$/i.test(file)) {
        const webpExists = fs.existsSync(path.join(brandDir, `${baseName}.webp`))
        if (webpExists) {
          fs.unlinkSync(inputPath)
          console.log(`    Removed original ${file}`)
        }
      }
    } catch (error) {
      console.error(`  Error processing ${file}: ${error}`)
    }
  }

  // List final files
  const finalFiles = fs.readdirSync(brandDir).filter((f) => f.endsWith('.webp'))
  console.log(`${brand}: ${finalFiles.length} webp files`)
}

async function main() {
  for (const brand of BRANDS) {
    await processBrand(brand)
  }
  console.log('\n=== DONE ===')
}

main().catch(console.error)
