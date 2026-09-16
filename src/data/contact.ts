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
  /** Higher-quality clip for laptop / desktop */
  desktopSrc: '/video/hero-desktop.mp4',
  /** Compressed clip for phones / tablets */
  mobileSrc: '/video/hero-mobile.mp4',
} as const

/** SoundCloud playlist players (Amapiano + Afro House). */
export const soundcloudEmbed = {
  profileUrl: 'https://soundcloud.com/7khwezi',
  playlists: [
    {
      key: 'amapiano',
      label: 'Amapiano',
      setUrl: 'https://soundcloud.com/7khwezi/sets/amapiano',
      playerSrc:
        'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1866137886&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
    },
    {
      key: 'afrohouse',
      label: 'Afro House',
      setUrl: 'https://soundcloud.com/7khwezi/sets/afro-house-afro-tech',
      playerSrc:
        'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2253514448&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
    },
  ],
} as const

/** Guest mix — EXT Radio / Afro Affy; KHWEZI K from 1:19:30. */
export const mixcloudEmbed = {
  title: 'Afro Affy Show 17 · EXT Radio',
  showUrl: 'https://www.mixcloud.com/AfroAffy/afro-affy-show-17/',
  note: 'KHWEZI K guest mix at the Afro Affy Radio Show from 1:19:30',
  /** Displayed in Marula Honey in the Sets note */
  cueLabel: '1:19:30',
  /** Seconds — 1:19:30 */
  startSeconds: 4770,
  /** Classic Mixcloud widget; start_time + Widget API seek as fallback. */
  playerSrc:
    'https://www.mixcloud.com/widget/iframe/?hide_cover=1&hide_artwork=1&light=1&feed=https%3A%2F%2Fwww.mixcloud.com%2FAfroAffy%2Fafro-affy-show-17%2F&start_time=4770',
} as const
