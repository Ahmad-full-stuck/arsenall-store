import * as fs from 'fs'
import * as path from 'path'

interface BrandConfig {
  slug: string
  repoName: string
  storeName: string
  storeNameEn: string
  tagline: string
  taglineEn: string
  description: string
  descriptionEn: string
  instagram: string
  colors: {
    bg: string
    surface: string
    surfaceStrong: string
    ink: string
    muted: string
    line: string
    lineStrong: string
    primary: string
    primaryDark: string
    primarySoft: string
    primaryTint: string
    accent: string
    accent2: string
    charcoal: string
    green: string
    lilac: string
    shadowRgb: string
    bgGradient1: string
    bgGradient2: string
    bgGradient3: string
    bgGradient4: string
  }
  categories: Array<{ id: string; slug: string; name: string; description: string; image: string; accent: string }>
}

const BRANDS: BrandConfig[] = [
  {
    slug: 'ah-lb03',
    repoName: 'ah-lb03-store',
    storeName: 'AH LB03',
    storeNameEn: 'AH LB03',
    tagline: 'ستريت وير عراقي',
    taglineEn: 'Iraqi Streetwear',
    description: 'متجر AH LB03: ملابس ستريت وير أصلية — تيشيرتات، هوديات، وأطقم عصرية مع توصيل لجميع المحافظات.',
    descriptionEn: 'AH LB03 Store: original streetwear — t-shirts, hoodies and modern sets with delivery across Iraq.',
    instagram: 'https://www.instagram.com/ah_lb03/',
    colors: {
      bg: '#f5f5f5',
      surface: '#ffffff',
      surfaceStrong: '#ffffff',
      ink: '#1a1a1a',
      muted: '#666666',
      line: '#e0e0e0',
      lineStrong: '#cccccc',
      primary: '#c62828',
      primaryDark: '#8e0000',
      primarySoft: '#fdeaea',
      primaryTint: '#f8d7d7',
      accent: '#333333',
      accent2: '#e53935',
      charcoal: '#111111',
      green: '#2e7d32',
      lilac: '#7e57c2',
      shadowRgb: '18, 18, 18',
      bgGradient1: 'rgba(198, 40, 40, .12)',
      bgGradient2: 'rgba(51, 51, 51, .10)',
      bgGradient3: 'rgba(198, 40, 40, .08)',
      bgGradient4: 'rgba(17, 17, 17, .10)',
    },
    categories: [
      { id: 'tshirts', slug: 'tshirts', name: 'تيشيرتات', description: 'تيشيرتات ستريت وير أصلية', image: 'products/ah-lb03/01.webp', accent: '#c62828' },
      { id: 'hoodies', slug: 'hoodies', name: 'هوديات', description: 'هوديات دافئة وعملية', image: 'products/ah-lb03/04.webp', accent: '#333333' },
      { id: 'sets', slug: 'sets', name: 'أطقم', description: 'أطقم كاملة عصرية', image: 'products/ah-lb03/07.webp', accent: '#e53935' },
    ],
  },
  {
    slug: 'roxsport',
    repoName: 'roxsport-store',
    storeName: 'RoxSport',
    storeNameEn: 'RoxSport',
    tagline: 'معدات رياضية احترافية',
    taglineEn: 'Professional Sports Gear',
    description: 'متجر RoxSport: معدات رياضية احترافية — أحذية، حقائب، وأطقم تدريب بأعلى جودة.',
    descriptionEn: 'RoxSport Store: professional sports gear — shoes, bags and training sets of the highest quality.',
    instagram: 'https://www.instagram.com/roxsport1_/',
    colors: {
      bg: '#f0f4f8',
      surface: '#ffffff',
      surfaceStrong: '#ffffff',
      ink: '#0d1b2a',
      muted: '#4a6fa5',
      line: '#d0dce8',
      lineStrong: '#b0c4d8',
      primary: '#1565c0',
      primaryDark: '#0d47a1',
      primarySoft: '#e3f2fd',
      primaryTint: '#bbdefb',
      accent: '#ff6f00',
      accent2: '#ff8f00',
      charcoal: '#081929',
      green: '#00897b',
      lilac: '#5c6bc0',
      shadowRgb: '13, 27, 42',
      bgGradient1: 'rgba(21, 101, 192, .14)',
      bgGradient2: 'rgba(255, 111, 0, .10)',
      bgGradient3: 'rgba(21, 101, 192, .08)',
      bgGradient4: 'rgba(8, 25, 41, .10)',
    },
    categories: [
      { id: 'shoes', slug: 'shoes', name: 'أحذية رياضية', description: 'أحذية جري وتدريب', image: 'products/roxsport/01.webp', accent: '#1565c0' },
      { id: 'bags', slug: 'bags', name: 'حقائب', description: 'حقائب رياضية عملية', image: 'products/roxsport/04.webp', accent: '#ff6f00' },
      { id: 'training', slug: 'training', name: 'أطقم تدريب', description: 'أطقم تدريب متكاملة', image: 'products/roxsport/07.webp', accent: '#0d47a1' },
    ],
  },
  {
    slug: 'arsenall',
    repoName: 'arsenall-store',
    storeName: 'Arsenall',
    storeNameEn: 'Arsenall',
    tagline: 'ملابس كرة القدم',
    taglineEn: 'Football Clothing',
    description: 'متجر Arsenall: ملابس كرة القدم الأصلية — أزياء، تيشيرتات، وشورتات من أشهر الأندية.',
    descriptionEn: 'Arsenall Store: original football clothing — jerseys, t-shirts and shorts from top clubs.',
    instagram: 'https://www.instagram.com/a.arsenall/',
    colors: {
      bg: '#fdf5f5',
      surface: '#ffffff',
      surfaceStrong: '#ffffff',
      ink: '#1b0a0a',
      muted: '#8b4040',
      line: '#f0dada',
      lineStrong: '#e0b8b8',
      primary: '#b71c1c',
      primaryDark: '#7f0000',
      primarySoft: '#ffebee',
      primaryTint: '#ffcdd2',
      accent: '#fdd835',
      accent2: '#f9a825',
      charcoal: '#1a0505',
      green: '#388e3c',
      lilac: '#ab47bc',
      shadowRgb: '27, 10, 10',
      bgGradient1: 'rgba(183, 28, 28, .14)',
      bgGradient2: 'rgba(253, 216, 53, .12)',
      bgGradient3: 'rgba(183, 28, 28, .08)',
      bgGradient4: 'rgba(26, 5, 5, .10)',
    },
    categories: [
      { id: 'jerseys', slug: 'jerseys', name: 'أزياء', description: 'أزياء رسمية للأندية', image: 'products/arsenall/01.webp', accent: '#b71c1c' },
      { id: 'tshirts', slug: 'tshirts', name: 'تيشيرتات', description: 'تيشيرتات فرق مميزة', image: 'products/arsenall/04.webp', accent: '#fdd835' },
      { id: 'shorts', slug: 'shorts', name: 'شورتات', description: 'شورتات رياضية مريحة', image: 'products/arsenall/07.webp', accent: '#7f0000' },
    ],
  },
  {
    slug: 'almarefaco',
    repoName: 'almarefaco-store',
    storeName: 'المعرفة',
    storeNameEn: 'Almarefaco',
    tagline: 'منتجات مختارة بعناية',
    taglineEn: 'Carefully Selected Products',
    description: 'متجر المعرفة: منتجات مختارة بعناية — ملابس، إكسسوارات، وأحذية بجودة عالية وأسعار منافسة.',
    descriptionEn: 'Almarefaco Store: carefully selected products — clothing, accessories and shoes with quality and competitive prices.',
    instagram: 'https://www.instagram.com/almarefaco/',
    colors: {
      bg: '#f4faf6',
      surface: '#ffffff',
      surfaceStrong: '#ffffff',
      ink: '#0d2818',
      muted: '#3d7a52',
      line: '#d0e8d8',
      lineStrong: '#b0d4bc',
      primary: '#2e7d32',
      primaryDark: '#1b5e20',
      primarySoft: '#e8f5e9',
      primaryTint: '#c8e6c9',
      accent: '#f9a825',
      accent2: '#ff8f00',
      charcoal: '#071a0e',
      green: '#00695c',
      lilac: '#7b1fa2',
      shadowRgb: '13, 40, 24',
      bgGradient1: 'rgba(46, 125, 50, .12)',
      bgGradient2: 'rgba(249, 168, 37, .10)',
      bgGradient3: 'rgba(46, 125, 50, .08)',
      bgGradient4: 'rgba(7, 26, 14, .10)',
    },
    categories: [
      { id: 'clothing', slug: 'clothing', name: 'ملابس', description: 'ملابس رياضية متنوعة', image: 'products/almarefaco/01.webp', accent: '#2e7d32' },
      { id: 'accessories', slug: 'accessories', name: 'إكسسوارات', description: 'إكسسوارات مميزة', image: 'products/almarefaco/04.webp', accent: '#f9a825' },
      { id: 'shoes', slug: 'shoes', name: 'أحذية', description: 'أحذية مريحة وعملية', image: 'products/almarefaco/07.webp', accent: '#00695c' },
    ],
  },
]

const BASE_DIR = path.resolve('C:/Users/ali/Desktop/brand-store')
const DESKTOP = 'C:/Users/ali/Desktop'

function replaceInFile(filePath: string, replacements: Array<[string, string]>) {
  if (!fs.existsSync(filePath)) return
  let content = fs.readFileSync(filePath, 'utf8')
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace)
  }
  fs.writeFileSync(filePath, content, 'utf8')
}

function buildColorReplacements(c: BrandConfig['colors']): Array<[string, string]> {
  return [
    // Root variables
    ['--eva-bg: #f4f6fa', `--eva-bg: ${c.bg}`],
    ['--eva-surface: #fafbfe', `--eva-surface: ${c.surface}`],
    ['--eva-ink: #1a1f2e', `--eva-ink: ${c.ink}`],
    ['--eva-muted: #5a6178', `--eva-muted: ${c.muted}`],
    ['--eva-line: #dce1ec', `--eva-line: ${c.line}`],
    ['--eva-line-strong: #c5cddd', `--eva-line-strong: ${c.lineStrong}`],
    ['--eva-rose: #1a2744', `--eva-rose: ${c.primary}`],
    ['--eva-rose-dark: #0f1a30', `--eva-rose-dark: ${c.primaryDark}`],
    ['--eva-rose-soft: #e8ecf5', `--eva-rose-soft: ${c.primarySoft}`],
    ['--eva-rose-tint: #dde3f0', `--eva-rose-tint: ${c.primaryTint}`],
    ['--eva-orange: #c9a84c', `--eva-orange: ${c.accent}`],
    ['--eva-blush: #a8b8d8', `--eva-blush: ${c.accent2}`],
    ['--eva-charcoal: #0d1525', `--eva-charcoal: ${c.charcoal}`],
    ['--eva-green: #3a7ca5', `--eva-green: ${c.green}`],
    ['--eva-lilac: #6b7fa3', `--eva-lilac: ${c.lilac}`],
    // Shadows
    ['rgba(15, 26, 48, .22)', `rgba(${c.shadowRgb}, .22)`],
    ['rgba(15, 26, 48, .10)', `rgba(${c.shadowRgb}, .10)`],
    ['rgba(15, 26, 48, .18)', `rgba(${c.shadowRgb}, .18)`],
    ['rgba(15, 26, 48, .08)', `rgba(${c.shadowRgb}, .08)`],
    ['rgba(15, 26, 48, .26)', `rgba(${c.shadowRgb}, .26)`],
    ['rgba(15, 26, 48, .32)', `rgba(${c.shadowRgb}, .32)`],
    ['rgba(15, 26, 48, .12)', `rgba(${c.shadowRgb}, .12)`],
    // Background gradients
    ['rgba(26, 39, 68, .17)', c.bgGradient1],
    ['rgba(201, 168, 76, .13)', c.bgGradient2],
    ['rgba(168, 184, 216, .16)', c.bgGradient3],
    ['rgba(15, 26, 48, .11)', c.bgGradient4],
    ['rgba(15, 26, 48, .09)', c.bgGradient4],
    // Focus outline
    ['rgba(26, 39, 68, .45)', `rgba(${c.shadowRgb}, .45)`],
  ]
}

function createBrandStore(brand: BrandConfig) {
  const targetDir = path.join(DESKTOP, brand.repoName)
  console.log(`\n=== Creating ${brand.repoName} ===`)

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  // Robocopy-like recursive copy excluding node_modules, .git, dist
  const excludeDirs = new Set(['node_modules', '.git', 'dist', '.wrangler'])
  function copyDir(src: string, dest: string) {
    fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      if (excludeDirs.has(entry.name)) continue
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath)
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    }
  }
  copyDir(BASE_DIR, targetDir)

  const storeDir = path.join(targetDir, 'artifacts', 'eva-fabrics-store')
  const colorReps = buildColorReplacements(brand.colors)

  // 1. Apply colors to index.css
  replaceInFile(path.join(storeDir, 'src', 'index.css'), colorReps)

  // 2. site.ts
  replaceInFile(path.join(storeDir, 'src', 'lib', 'site.ts'), [
    ["adminContent().shopName || 'سبورت ستور'", `adminContent().shopName || '${brand.storeName}'`],
    ["shortName: 'سبورت ستور'", `shortName: '${brand.storeName}'`],
    [`'استفسار من متجر سبورت'`, `'استفسار من متجر ${brand.storeName}'`],
    [`'مرحباً، أريد الاستفسار عن منتجاتكم.'`, `'مرحباً، أريد الاستفسار عن منتجات ${brand.storeName}.'`],
    ["instagramText: 'سبورت ستور على إنستغرام'", `instagramText: '${brand.storeName} على إنستغرام'`],
    ['VITE_INSTAGRAM_URL || \'https://www.instagram.com/ah_lb03/\'', `VITE_INSTAGRAM_URL || '${brand.instagram}'`],
  ])

  // 3. site-content.ts
  const catNames = brand.categories.map((c) => c.name).join('، ')
  replaceInFile(path.join(storeDir, 'src', 'lib', 'site-content.ts'), [
    ["shopName: 'سبورت ستور'", `shopName: '${brand.storeName}'`],
    ["instagram: 'https://www.instagram.com/ah_lb03/'", `instagram: '${brand.instagram}'`],
    ["aboutTitle: 'قصة سبورت ستور تبدأ بشغف الرياضة'", `aboutTitle: 'قصة ${brand.storeName} تبدأ بشغف التميز'`],
    ["aboutText: 'سبورت ستور يجمع أفضل البراندات الرياضية في مكان واحد — ملابس، أحذية، وإكسسوارات أصلية من أشهر العلامات. نختار كل منتج بعناية لضمان الجودة والأصالة، مع توصيل سريع لجميع المحافظات.'", `aboutText: '${brand.description}'`],
    ["heroEyebrow: 'منتجات رياضية أصلية'", `heroEyebrow: '${brand.tagline}'`],
    ["heroTitle: 'الأفضل|من البراندات العالمية'", `heroTitle: '${brand.storeName}|${brand.tagline}'`],
    ["heroText: 'تشكيلة مختارة من الملابس والأحذية والإكسسوارات الرياضية من أشهر البراندات — جودة أصلية وأسعار منافسة.'", `heroText: '${brand.description}'`],
    ["categoriesTitle: 'الفئات'", `categoriesTitle: '${catNames}'`],
    ["emailFromName: 'سبورت ستور'", `emailFromName: '${brand.storeName}'`],
    ["emailSubjectOrder: 'طلب جديد من سبورت ستور #{orderNumber}'", `emailSubjectOrder: 'طلب جديد من ${brand.storeName} #{orderNumber}'`],
    ["'sport-admin-content'", `'${brand.slug}-admin-content'`],
  ])

  // 4. core.ts strings
  replaceInFile(path.join(storeDir, 'src', 'lib', 'strings', 'core.ts'), [
    ["ar: 'سبورت ستور، الصفحة الرئيسية'", `ar: '${brand.storeName}، الصفحة الرئيسية'`],
    ["en: 'Sport Store — home page'", `en: '${brand.storeNameEn} — home page'`],
    ["ar: 'سبورت ستور'", `ar: '${brand.storeName}'`],
    ["en: 'Sport Store'", `en: '${brand.storeNameEn}'`],
    ["ar: 'رياضي'", `ar: '${brand.tagline}'`],
    ["en: 'sports'", `en: '${brand.taglineEn}'`],
  ])

  // 5. index.html
  const storeDirIndex = path.join(storeDir, 'index.html')
  replaceInFile(storeDirIndex, [
    ['سبورت ستور | منتجات رياضية أصلية', `${brand.storeName} | ${brand.tagline}`],
    ['متجر سبورت ستور: منتجات رياضية أصلية من أفضل البراندات — ملابس، أحذية، وإكسسوارات رياضية مع توصيل إلى جميع محافظات العراق.', brand.description],
    ['https://sport-store.workers.dev/', `https://ahmad-full-stuck.github.io/${brand.repoName}/`],
    ['سبورت ستور', brand.storeName],
    ['منتجات رياضية أصلية من أفضل البراندات.', brand.descriptionEn],
  ])

  // 6. Categories
  const catsPath = path.join(targetDir, 'data', 'categories.json')
  fs.writeFileSync(catsPath, JSON.stringify(brand.categories, null, 2), 'utf8')

  // 7. Products — keep only this brand's products
  const prodsPath = path.join(targetDir, 'data', 'products.json')
  const allProds = JSON.parse(fs.readFileSync(prodsPath, 'utf8'))
  const brandProducts = allProds.filter((p: { id: string }) => p.id.startsWith(brand.slug))
  // Update category IDs to match new categories
  const catMap: Record<string, string> = {}
  const origCats = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'data', 'categories.json'), 'utf8'))
  // Map: old products have categoryId like 'clothing', 'shoes', etc.
  // We need to map them to the new brand categories
  const newCatIds = brand.categories.map((c) => c.id)
  for (const p of brandProducts) {
    // Map to first category as default
    if (!newCatIds.includes(p.categoryId)) {
      p.categoryId = newCatIds[0]
    }
  }
  fs.writeFileSync(prodsPath, JSON.stringify(brandProducts, null, 2), 'utf8')

  // 8. fallback-data.ts — update routes
  replaceInFile(path.join(storeDir, 'src', 'lib', 'fallback-data.ts'), [
    ['سبورت ستور يجمع أفضل البراندات الرياضية في مكان واحد — ملابس، أحذية، وإكسسوارات أصلية مع توصيل سريع لجميع المحافظات.', brand.description],
    ["title: 'منتجات رياضية تستحق الثقة'", `title: '${brand.storeName} — ${brand.tagline}'`],
  ])

  // 9. Worker order prefix
  replaceInFile(path.join(targetDir, 'artifacts', 'eva-worker', 'src', 'index.ts'), [
    ['SPORT-', `${brand.slug.toUpperCase().replace(/-/g, '')}-`],
  ])

  // 10. Worker wrangler name
  replaceInFile(path.join(targetDir, 'artifacts', 'eva-worker', 'wrangler.jsonc'), [
    ['"name": "sport"', `"name": "${brand.slug}"`],
  ])

  // 11. Package names
  replaceInFile(path.join(targetDir, 'artifacts', 'eva-fabrics-store', 'package.json'), [
    ['"@workspace/sport-store"', `"@workspace/${brand.slug}-store"`],
  ])
  replaceInFile(path.join(targetDir, 'artifacts', 'eva-worker', 'package.json'), [
    ['"@workspace/sport-worker"', `"@workspace/${brand.slug}-worker"`],
  ])

  // 12. GitHub Actions — update filter
  replaceInFile(path.join(targetDir, '.github', 'workflows', 'deploy-pages.yml'), [
    ['@workspace/sport-store', `@workspace/${brand.slug}-store`],
  ])

  // 13. Favicon — brand-colored
  const faviconSvg = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
<polygon points="90,10 160,45 160,135 90,170 20,135 20,45" fill="${brand.colors.primary}"/>
<text x="90" y="115" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="70" fill="#ffffff">${brand.storeNameEn.charAt(0)}</text>
</svg>`
  fs.writeFileSync(path.join(storeDir, 'public', 'favicon.svg'), faviconSvg, 'utf8')

  // 14. Remove other brands' product folders
  const prodsDir = path.join(storeDir, 'public', 'products')
  if (fs.existsSync(prodsDir)) {
    for (const entry of fs.readdirSync(prodsDir, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name !== brand.slug) {
        fs.rmSync(path.join(prodsDir, entry.name), { recursive: true, force: true })
      }
    }
  }

  // 15. Remove cloudflare workflow (we use Pages only)
  const cfWf = path.join(targetDir, '.github', 'workflows', 'deploy-cloudflare.yml')
  if (fs.existsSync(cfWf)) fs.unlinkSync(cfWf)

  console.log(`Created: ${targetDir}`)
  console.log(`  Products: ${brandProducts.length}`)
  console.log(`  Categories: ${brand.categories.length}`)
  console.log(`  Colors: ${brand.colors.primary} / ${brand.colors.accent}`)
}

// Run
for (const brand of BRANDS) {
  createBrandStore(brand)
}
console.log('\n=== ALL DONE ===')
