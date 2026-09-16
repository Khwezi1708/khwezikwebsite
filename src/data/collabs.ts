export type CollabCredit = {
  role: string
  name: string
  handle?: string
}

export type CollabLook = {
  id: string
  partners: string
  credits: readonly CollabCredit[]
  lead: string
  body: string
  /** Optional short line under the body (e.g. brand motto). */
  tagline?: string
  /** Optional intro above the Instagram gallery. */
  postsIntro?: string
  images?: readonly string[]
  /** Instagram post/reel permalinks (captionless embeds). */
  instagramPosts?: readonly string[]
}

/** Fashion / visual collaborations. */
export const collabLooks: CollabLook[] = [
  {
    id: 'glotto-mav-look-1',
    partners: 'Glotto x Maverick Seizure',
    credits: [
      { role: 'Styling', name: 'Glotto', handle: '@glottobrand' },
      { role: 'Photography', name: 'Maverick Seizure', handle: '@maverick.seizure' },
      { role: 'Model', name: 'KHWEZI K', handle: '@7khwezi' },
    ],
    lead: 'KHWEZI K brings both of her heritages together through a collaboration with South African photographer Maverick Seizure and Botswana-born fashion house Glotto, showcasing Southern African creativity to global audiences through fashion and visual storytelling.',
    body: 'Set against the backdrop of a once-abandoned school, now transformed into a living community, the imagery draws a parallel between space and garment. A velvet dress, woven from repurposed details, mirrors the environment it inhabits, both shaped by reclamation and intent. Through this dialogue, the work reflects how materials and places, when given new life, can carry deeper meaning than what came before.',
    images: [
      '/images/collabs/look-1/DSC02713.jpg',
      '/images/collabs/look-1/DSC02596.jpg',
      '/images/collabs/look-1/DSC02591.jpg',
      '/images/collabs/look-1/DSC02568.jpg',
    ],
  },
  {
    id: 'adr-company',
    partners: 'KHWEZI K x ADR Company',
    credits: [],
    lead: 'Based in Rio de Janeiro, ADR Company is a Brazilian clothing brand that blends classic elegance with urban culture. Their pieces reflect a balance between sophistication and streetwear, creating a style that feels authentic, contemporary and effortless. With a focus on identity, presence and self-expression, ADR Company turns contrasts into a distinctive aesthetic.',
    body: '',
    tagline: 'Classy & Urban.',
    postsIntro: 'A look into my collaboration with ADR Company:',
    instagramPosts: [
      'https://www.instagram.com/p/DbDlIkbDcNu/',
      'https://www.instagram.com/p/DWH6KjyjJIq/',
      'https://www.instagram.com/reel/DWeEFYLDB5K/',
    ],
  },
]
