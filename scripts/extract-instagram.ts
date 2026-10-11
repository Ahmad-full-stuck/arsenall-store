import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BRANDS = [
  { name: 'ah-lb03', url: 'https://www.instagram.com/ah_lb03/' },
  { name: 'roxsport', url: 'https://www.instagram.com/roxsport1_/' },
  { name: 'arsenall', url: 'https://www.instagram.com/a.arsenall/' },
  { name: 'almarefaco', url: 'https://www.instagram.com/almarefaco/' },
]

const OUTPUT_DIR = path.resolve('C:/Users/ali/Desktop/brand-store/artifacts/eva-fabrics-store/public/products')

const upgradeUrl = (url: string): string => {
  try {
    const u = new URL(url)
    // Remove size constraints to get full quality
    u.searchParams.delete('size')
    u.searchParams.delete('_nc_cat')
    u.searchParams.delete('ccb')
    u.searchParams.delete('_nc_oc')
    u.searchParams.delete('oh')
    u.searchParams.delete('oe')
    // Keep only basic params
    return u.toString()
  } catch { return url }
}

async function extractBrand(brand: { name: string; url: string }) {
  console.log(`\n=== ${brand.name} ===`)
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 2000 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    await page.goto(brand.url, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForTimeout(2000)

    // Dismiss login modal aggressively
    for (let i = 0; i < 3; i++) {
      try {
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
      } catch {}
      // Try clicking close buttons
      try {
        const closeBtn = page.locator('[aria-label="Close"]').first()
        if (await closeBtn.isVisible({ timeout: 500 })) {
          await closeBtn.click()
          await page.waitForTimeout(300)
        }
      } catch {}
    }

    // Scroll multiple times to load more posts
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 600))
      await page.waitForTimeout(1200)
    }

    // Get profile info
    const profileName = await page.locator('header section h2').first().textContent().catch(() => '')
    const bio = await page.locator('header section h1, header section span').first().textContent().catch(() => '')

    // Extract all image URLs
    const imageUrls = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'))
      return imgs
        .map((img) => img.src)
        .filter((src) => src.includes('cdninstagram.com') || src.includes('fbcdn.net'))
        .filter((src) => !src.includes('150x150') && !src.includes('32x32') && !src.includes('profile'))
    })

    // Also try to get higher-res versions by modifying URLs
    const highResUrls = imageUrls.map((url) => {
      try {
        const u = new URL(url)
        // Instagram CDN often serves different sizes based on URL params
        // Try to get the largest version
        u.searchParams.set('size', '1080x1080')
        return u.toString()
      } catch { return url }
    })

    const allUrls = [...new Set([...highResUrls, ...imageUrls])]
    console.log(`Found ${allUrls.length} unique images`)

    const brandDir = path.join(OUTPUT_DIR, brand.name)
    fs.mkdirSync(brandDir, { recursive: true })

    let downloaded = 0
    const seen = new Set<string>()
    for (const url of allUrls) {
      if (downloaded >= 10) break
      // Extract photo ID for deduplication
      const photoMatch = url.match(/\/([A-Za-z0-9_-]{15,})\//)
      const photoId = photoMatch?.[1] || url.substring(url.length - 30)
      if (seen.has(photoId)) continue
      seen.add(photoId)

      try {
        const response = await page.request.get(url, {
          headers: {
            'Referer': brand.url,
            'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          }
        })
        if (response.ok()) {
          const buffer = await response.body()
          if (buffer.length > 15000) {
            const num = String(downloaded + 1).padStart(2, '0')
            const ext = url.includes('.webp') ? 'webp' : 'jpg'
            const filePath = path.join(brandDir, `${num}.${ext}`)
            fs.writeFileSync(filePath, buffer)
            downloaded++
            console.log(`  ${num}.${ext} (${Math.round(buffer.length / 1024)}KB)`)
          }
        }
      } catch {}
    }

    console.log(`${brand.name}: ${downloaded} images`)
    return { brand: brand.name, profileName: profileName?.trim() || brand.name, bio: bio?.trim() || '', downloaded }
  } catch (error) {
    console.error(`Error: ${error}`)
    return { brand: brand.name, profileName: brand.name, bio: '', downloaded: 0 }
  } finally {
    await browser.close()
  }
}

async function main() {
  const results = []
  for (const brand of BRANDS) {
    results.push(await extractBrand(brand))
  }
  console.log('\n=== SUMMARY ===')
  for (const r of results) {
    console.log(`${r.brand}: ${r.downloaded} images — "${r.profileName}"`)
  }
  // Save metadata
  fs.writeFileSync(
    path.resolve('C:/Users/ali/Desktop/brand-store/data/brand-metadata.json'),
    JSON.stringify(results, null, 2)
  )
}

main().catch(console.error)
