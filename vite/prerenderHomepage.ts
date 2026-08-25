import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { bio } from '../src/data/bio'
import { collabLooks } from '../src/data/collabs'
import { contact, mixcloudEmbed, socials, soundcloudEmbed } from '../src/data/contact'
import { genres } from '../src/data/sets'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function paragraphs(
  items: readonly { text: string }[],
): string {
  return items.map((item) => `<p>${escapeHtml(item.text)}</p>`).join('\n')
}

/** Static HTML snapshot for crawlers that do not execute JS. */
export function buildHomepagePrerenderHtml(): string {
  const setSections = genres
    .map((genre) => {
      const items = genre.sets
        .map(
          (set) => `
            <li>
              <p>${escapeHtml(set.channel)}</p>
              <h3><a href="https://www.youtube.com/watch?v=${escapeHtml(set.id)}">${escapeHtml(set.title)}</a></h3>
              <p>${escapeHtml(set.subtitle)}</p>
            </li>`,
        )
        .join('\n')

      return `
        <section aria-label="${escapeHtml(genre.label)}">
          <h3>${escapeHtml(genre.label)}</h3>
          <p>${escapeHtml(genre.tagline)}</p>
          <p><a href="${escapeHtml(genre.playlistUrl)}">Full ${escapeHtml(genre.label)} playlist on YouTube</a></p>
          <ul>${items}</ul>
        </section>`
    })
    .join('\n')

  const collabs = collabLooks
    .map(
      (look) => `
        <article>
          <h3>${escapeHtml(look.partners)}</h3>
          <p>${escapeHtml(look.lead)}</p>
          <p>${escapeHtml(look.body)}</p>
          <ul>
            ${look.credits
              .map(
                (credit) =>
                  `<li>${escapeHtml(credit.role)}: ${escapeHtml(credit.name)}${
                    credit.handle ? ` (${escapeHtml(credit.handle)})` : ''
                  }</li>`,
              )
              .join('\n')}
          </ul>
        </article>`,
    )
    .join('\n')

  const socialLinks = socials
    .map(
      (social) =>
        `<li><a href="${escapeHtml(social.href)}">${escapeHtml(social.label)}</a></li>`,
    )
    .join('\n')

  return `
<!--prerender:start-->
<div class="prerender-shell">
  <header>
    <p><a href="#top">KHWEZI K</a></p>
    <nav aria-label="Primary">
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#sets">Sets</a></li>
        <li><a href="#collabs">Collabs</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#press">Press</a></li>
        <li><a href="#socials">Socials</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="top" aria-label="KHWEZI K — Amapiano and Afro House DJ">
      <p>Amapiano &amp; Afro House DJ</p>
      <h1>KHWEZI K — Amapiano and Afro House DJ for bookings</h1>
      <p>${escapeHtml(contact.tagline)}</p>
      <p>
        <a href="#sets">Watch sets</a>
        ·
        <a href="#contact">Contact</a>
      </p>
    </section>

    <section id="about">
      <p>01 · About</p>
      <h2>${escapeHtml(bio.headlineLine1)} ${escapeHtml(bio.headlineLine2)}</h2>
      <blockquote>“${escapeHtml(bio.pullQuote)}”</blockquote>
      ${paragraphs(bio.intro)}
      <h3>${escapeHtml(bio.featureHeadline)}</h3>
      ${paragraphs(bio.feature)}
    </section>

    <section id="sets">
      <p>02 · Sets</p>
      <h2>Listen. Groove. Vibe.</h2>
      <p>Afro electronic selections — Amapiano and Afro House, including guest sets on other channels.</p>
      ${setSections}
      <p><a href="${escapeHtml(soundcloudEmbed.profileUrl)}">KHWEZI K on SoundCloud</a></p>
      <p><a href="${escapeHtml(mixcloudEmbed.showUrl)}?start=${mixcloudEmbed.startSeconds}">${escapeHtml(mixcloudEmbed.title)} — ${escapeHtml(mixcloudEmbed.note)}</a></p>
    </section>

    <section id="collabs">
      <p>03 · Collabs</p>
      <h2>Collaborations</h2>
      ${collabs}
    </section>

    <section id="contact">
      <p>04 · Bookings</p>
      <h2>Contact us</h2>
      <p>For bookings, press and collaborations.</p>
      <p>Email: <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p>
    </section>

    <section id="press">
      <p>05 · Press</p>
      <h2>Press pack</h2>
      <p>Bio, photos and assets for promoters, press and collaborators.</p>
    </section>
  </main>

  <footer id="socials">
    <p>06 · Socials</p>
    <h2>Stay connected.</h2>
    <nav aria-label="Socials">
      <ul>${socialLinks}</ul>
    </nav>
    <p>© ${new Date().getFullYear()} KHWEZI K · Afro electronic music · ${escapeHtml(contact.genres)}</p>
  </footer>
</div>
<!--prerender:end-->`.trim()
}

/**
 * After Vite build:
 * 1. Inject crawlable homepage HTML into dist/index.html (#root)
 * 2. Copy SPA fallbacks for GitHub Pages
 */
export function prerenderHomepage(): Plugin {
  return {
    name: 'prerender-homepage',
    apply: 'build',
    closeBundle() {
      const dist = resolve(__dirname, '../dist')
      const indexHtmlPath = resolve(dist, 'index.html')
      let html = readFileSync(indexHtmlPath, 'utf8')

      const snapshot = buildHomepagePrerenderHtml()
      if (!html.includes('<div id="root"></div>')) {
        throw new Error(
          'prerender-homepage: expected empty <div id="root"></div> in dist/index.html',
        )
      }

      html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${snapshot}</div>`,
      )
      writeFileSync(indexHtmlPath, html)

      const hiddenDir = resolve(dist, 'hiddenanalytics')
      mkdirSync(hiddenDir, { recursive: true })
      // Analytics gate should not inherit homepage SEO body
      const shell = html.replace(
        /<!--prerender:start-->[\s\S]*?<!--prerender:end-->/,
        '',
      )
      writeFileSync(resolve(hiddenDir, 'index.html'), shell)
      // SPA deep-link fallback keeps prerendered home (client router takes over)
      copyFileSync(indexHtmlPath, resolve(dist, '404.html'))

      console.log('prerender-homepage: injected crawlable HTML into dist/index.html')
    },
  }
}
