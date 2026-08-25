export type CollabLook = {
  id: string
  partners: string
  credits: readonly { role: string; name: string; handle?: string }[]
  lead: string
  body: string
  images: readonly string[]
}

/** Fashion / visual collaborations — Look 2 incoming. */
export const collabLooks: CollabLook[] = [
  {
    id: 'glotto-mav-look-1',
    partners: 'Glotto x Maverick Seizure',
    credits: [
      { role: 'Styling', name: 'Glotto', handle: '@glottobrand' },
      { role: 'Photography', name: 'Maverick Seizure', handle: '@maverick.seizure' },
      { role: 'Model', name: 'KHWEZI K', handle: '@7khwezi' },
    ],
    lead: 'KHWEZI K brings both of her heritages together in a collaboration with South African photographer Maverick Seizure and Botswanan fashion house Glotto, introducing Southern African creativity to global audiences through fashion and visual narrative.',
    body: 'Set against the backdrop of a once-abandoned school, now transformed into a living community, the imagery draws a parallel between space and garment. A velvet dress, woven from repurposed details, mirrors the environment it inhabits, both shaped by reclamation and intent. Through this dialogue, the work reflects how materials and places, when given new life, can carry deeper meaning than what came before.',
    images: [
      '/images/collabs/look-1/DSC02713.jpg',
      '/images/collabs/look-1/DSC02596.jpg',
      '/images/collabs/look-1/DSC02591.jpg',
      '/images/collabs/look-1/DSC02568.jpg',
    ],
  },
]
