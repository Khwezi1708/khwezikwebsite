export type SetItem = {
  id: string
  title: string
  channel: string
}

export type GenreKey = 'amapiano' | 'afrohouse'

export type GenrePlaylist = {
  key: GenreKey
  label: string
  tagline: string
  playlistUrl: string
  sets: SetItem[]
}

/** Sourced from youtube.com/@7khwezi playlists (includes guest-channel uploads). */
export const genres: GenrePlaylist[] = [
  {
    key: 'amapiano',
    label: 'Amapiano',
    tagline: 'soulful grooves · amapiano',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLfAdeXhWJ94MJVTz6vmapm_yrmBnQoTF3',
    sets: [
      {
        id: 'fYDoVwanX0o',
        title: 'HOUSE OF YMZ · Amapiano Mix 2026',
        channel: 'YOMZANSI',
      },
      {
        id: 'kqZZdtHRUIE',
        title: 'Amapiano Worldwide × K’nect · Game Night',
        channel: 'Amapiano Worldwide',
      },
      {
        id: 'mIILNBnn0qU',
        title: 'Private School Amapiano · Sunsets in France',
        channel: 'KHWEZI K',
      },
      {
        id: '9K28NzdB4rs',
        title: 'Sgidongo Mix 2025',
        channel: 'KHWEZI K',
      },
      {
        id: '6FuBkXveK1M',
        title: 'Kelvin Momo — Thato Ya Modimo Mix',
        channel: 'KHWEZI K',
      },
      {
        id: 'uml_Ff_Xilo',
        title: 'There’s Groove at Home 01',
        channel: 'KHWEZI K',
      },
      {
        id: 'j4rJgNynCH8',
        title: 'Soulful Amapiano · Live in Rotterdam',
        channel: 'KHWEZI K',
      },
      {
        id: 'zd5tlY5Z0yM',
        title: 'Amapiano Chillas',
        channel: 'KHWEZI K',
      },
      {
        id: 'zJTPbNn6sv4',
        title: 'Amapiano Mix',
        channel: 'KHWEZI K',
      },
    ],
  },
  {
    key: 'afrohouse',
    label: 'Afro House',
    tagline: 'Afro tech · 3-step · deep & soulful rhythms',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLfAdeXhWJ94NcXZsI4s-j5FX2IotvYr9F',
    sets: [
      {
        id: 'mjHE6U_YJXg',
        title: 'Operator Radio Live DJ Set',
        channel: 'KHWEZI K',
      },
      {
        id: 'T8_CJZh2Okc',
        title: 'Afrotech × Afrohouse × 3-Step Mix 2026',
        channel: 'KHWEZI K',
      },
      {
        id: 'oTRvAU7znaY',
        title: 'Deep Rhythms by the River',
        channel: 'KHWEZI K',
      },
      {
        id: '4LXgiEmKeD0',
        title: '3-Step Mix · Soulful Rhythms',
        channel: 'KHWEZI K',
      },
    ],
  },
]
