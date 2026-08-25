export type SetItem = {
  id: string
  title: string
  subtitle: string
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
        subtitle: 'Live set',
        channel: 'YOMZANSI',
      },
      {
        id: 'kqZZdtHRUIE',
        title: 'Amapiano Worldwide × K’nect · Game Night',
        subtitle: '21.11.2025',
        channel: 'Amapiano Worldwide',
      },
      {
        id: 'mIILNBnn0qU',
        title: 'Private School Amapiano · Sunsets in France',
        subtitle: 'Kelvin Momo · Stixx · Gaba Cannal',
        channel: 'KHWEZI K',
      },
      {
        id: '9K28NzdB4rs',
        title: 'Sgidongo Mix 2025',
        subtitle: 'Hotfurze · Mdu aka TRP · Nkulee501 · Freddy K · W4DE',
        channel: 'KHWEZI K',
      },
      {
        id: '6FuBkXveK1M',
        title: 'Kelvin Momo — Thato Ya Modimo Mix',
        subtitle: 'Private school piano & soulful vibes',
        channel: 'KHWEZI K',
      },
      {
        id: 'uml_Ff_Xilo',
        title: 'There’s Groove at Home 01',
        subtitle: 'Kabza De Small · Kelvin Momo · Sam Deep',
        channel: 'KHWEZI K',
      },
      {
        id: 'j4rJgNynCH8',
        title: 'Soulful Amapiano · Live in Rotterdam',
        subtitle: 'Kelvin Momo · Sam Deep · Stixx & Maphorisa',
        channel: 'KHWEZI K',
      },
      {
        id: 'zd5tlY5Z0yM',
        title: 'Amapiano Chillas',
        subtitle: 'Sam Deep · Kelvin Momo · Dzo729',
        channel: 'KHWEZI K',
      },
      {
        id: 'zJTPbNn6sv4',
        title: 'Amapiano Mix',
        subtitle: 'Kabza De Small · DJ Maphorisa · Kelvin Momo',
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
        subtitle: 'Afro House · Afro Tech · 3-Step',
        channel: 'KHWEZI K',
      },
      {
        id: 'T8_CJZh2Okc',
        title: 'Afrotech × Afrohouse × 3-Step Mix 2026',
        subtitle: 'Black Coffee · Caiiro · Enoo Napa',
        channel: 'KHWEZI K',
      },
      {
        id: 'oTRvAU7znaY',
        title: 'Deep Rhythms by the River',
        subtitle: 'Dlala Thukzin · Jazzworx · Enoo Napa',
        channel: 'KHWEZI K',
      },
      {
        id: '4LXgiEmKeD0',
        title: '3-Step Mix · Soulful Rhythms',
        subtitle: 'Dlala Thukzin · Oscar Mbo · Thakzin',
        channel: 'KHWEZI K',
      },
    ],
  },
]
