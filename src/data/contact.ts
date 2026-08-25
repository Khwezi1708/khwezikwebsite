export const contact = {
  email: 'bookings.khwezi@gmail.com',
  tagline: 'Always vibing, always grooving.',
  genres: 'Amapiano // Afro House',
  /** FormSubmit AJAX — first live submit sends an activation email to confirm. */
  formEndpoint: 'https://formsubmit.co/ajax/bookings.khwezi@gmail.com',
} as const

export const socials = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/7khwezi/',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@7khwezik',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@7khwezi',
  },
  {
    id: 'soundcloud',
    label: 'SoundCloud',
    href: 'https://soundcloud.com/7khwezi',
  },
] as const

export const pressPack = {
  label: 'Press pack',
  url: 'https://www.dropbox.com/scl/fo/5lud85pi9w9nxumav53vi/ADe9gipAhP3WaeNQMs_pV84?rlkey=gsnvdrjgozjj6gdj8m3806rcw&st=sglzhreq&dl=0',
  /** Site unlock password before opening Dropbox. */
  password: 'kpressk',
} as const

export const hero = {
  /** Preferred high-quality clip */
  videoSrc: '/video/hero.mov',
  /** Fallback for browsers/devices that can’t play the MOV (e.g. some Samsung) */
  fallbackSrc: '/video/hero.mp4',
} as const

/** SoundCloud profile player (lists recent uploads). */
export const soundcloudEmbed = {
  profileUrl: 'https://soundcloud.com/7khwezi',
  playerSrc:
    'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/7khwezi&color=%23C2603F&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
} as const

/** Guest mix — EXT Radio / Afro Affy; KHWEZI K from 1:19:30. */
export const mixcloudEmbed = {
  title: 'Afro Affy Show 17 · EXT Radio',
  showUrl: 'https://www.mixcloud.com/AfroAffy/afro-affy-show-17/',
  note: 'KHWEZI K guest mix at the Afro Affy Radio Show from 1:19:30',
  /** Seconds — 1:19:30 */
  startSeconds: 4770,
  /** Classic Mixcloud widget; start_time + Widget API seek as fallback. */
  playerSrc:
    'https://www.mixcloud.com/widget/iframe/?hide_cover=1&hide_artwork=1&light=1&feed=https%3A%2F%2Fwww.mixcloud.com%2FAfroAffy%2Fafro-affy-show-17%2F&start_time=4770',
} as const
