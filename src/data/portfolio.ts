export interface PortfolioItem {
  title: string
  category: string
  url: string
  image: string
  description: string
}

export const portfolioItems: PortfolioItem[] = [
  // ── Bento grid (first 6) ──
  { title: 'Dossiers', category: 'STEM', url: 'https://tba-auctions-admin.vercel.app/', image: '/works/dossiers.webp', description: 'The first NFT auction platform built on the ERC-6551 Tokenbound wallet standard.' },
  { title: '2050 Vision', category: 'Strategy', url: 'https://www.2050vision.org/', image: '/works/vision2050.webp', description: 'Interactive web experience bringing The Rising Majority\'s 2050 manifesto to life.' },
  { title: 'Southern Power Fund', category: 'Nonprofit', url: 'https://fundthesouth.org/', image: '/works/southern-power-fund.webp', description: 'Modern organizational website for the Southern Power Fund, built for clarity and impact.' },
  { title: 'URL Collective', category: 'Creative Media', url: 'https://urlcollective.org/', image: '/works/url-collective.png', description: 'Full website redesign for the nonprofit arm of URL Media, a network of top Black and Brown media organizations.' },
  { title: 'Catalog', category: 'Editorial', url: 'https://notes.catalog.works/posts/jerkin-imperiled-positive-conscious-rap-essay', image: '/works/catalog.webp', description: 'Editorial contributions to the Catalog Writer Program covering music, culture, and the creative economy.' },
  { title: 'Immigrantly', category: 'Media', url: 'https://immigrantlypod.com/', image: '/works/immigrantly.webp', description: 'Website redesign and rebuild for Immigrantly, a podcast redefining the multicultural narrative.' },

  // ── Experiment showcase ──
  { title: 'U.S. Capitol Visitor Center', category: 'STEM', url: 'https://www.visitthecapitol.gov/', image: '/works/visitthecapitol.jpg', description: 'Multilingual audio playback system for on-site visitors at the U.S. Capitol.' },
  { title: 'Laser Reach', category: 'Strategy', url: 'https://www.laserreach.com/', image: '/works/laser-reach.png', description: 'Sales, product management, and customer experience consulting.' },
  { title: 'Advanced Welding Solutions', category: 'Design', url: 'http://advancedweldingsolutionsllc.com', image: '/works/advanced-welding-solutions.webp', description: 'Graphic design and presentation formatting for an industrial services company.' },
  { title: 'URL Media', category: 'Web Dev', url: 'https://url-media.com/', image: '/works/url-media.png', description: 'Homepage redesign and development for a network of top Black and Brown media organizations.' },
  { title: 'Thinksys', category: 'Staffing', url: 'https://thinksys.com/', image: '/works/think-sys.png', description: 'QA Test Engineer staffing for an enterprise software consultancy.' },
  { title: 'MusicNerd', category: 'Data', url: 'https://www.musicnerd.xyz/', image: '/works/music-nerd.png', description: 'Data entry and platform operations for a music discovery platform.' },
  { title: 'Giver Marketing', category: 'Blockchain', url: 'https://solscan.io/token/mntC2wGwBEeFjQyZQCBksPP9n6Rpj1Aa88XhVBahwwm', image: '/works/giver-marketing.png', description: 'Token creation and tokenomics strategy for a marketing ecosystem.' },
  { title: 'U.S. Weed Channel', category: 'Marketing', url: 'https://usweedchannel.com/', image: '/works/us-weed-channel.jpg', description: 'Event management and marketing for a cannabis industry media platform.' },
  { title: 'Bearpaw', category: 'Consulting', url: 'https://bearpaw.com/', image: '/works/bear-paw-consulting.png', description: 'Revenue operations consulting for a footwear and outdoor gear brand.' },
  { title: 'The Utilize Project', category: 'Branding', url: 'https://theutilizeproject.com/', image: '/works/the-utilize-project.png', description: 'Brand kit and design system for a community-focused initiative.' },
]

export const bentoItems = portfolioItems.slice(0, 6)
export const experimentItems = portfolioItems // all 16 items
