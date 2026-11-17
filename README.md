# Bastion

A clean, security-focused Ghost theme with light, dark and system colour modes that visitors can switch between.

## Features

- **Light / Dark / System dropdown** in the header. The visitor's choice is saved in `localStorage`, applied before the first paint (so the page never flashes the wrong colours), synced across open tabs, and follows OS changes while set to *System*.
- **[OpenDyslexic](https://opendyslexic.org) typeface**, hosted inside the theme (SIL OFL, see `assets/fonts/OFL.txt`). Code and terminal-style labels use the system monospace font. It is the theme default, so leave the heading and body fonts in Ghost Admin set to *Theme default*. Picking a font there overrides it.
- **No third-party requests from the theme.** It has no CDNs or analytics, and the fonts are served from your own domain.
- Terminal-style accents, readable long-form typography, and dark code blocks in both modes with a **language label and copy button**.
- Reading progress bar, related posts, previous/next navigation, an author card and a member signup CTA.
- Supports Ghost members (Portal), native search (`data-ghost-search`), comments, Koenig cards (`card_assets`), wide and full-width images, and Ghost's custom fonts.
- Accessible: skip link, radio-group semantics with arrow-key support for the switch, visible focus styles, and support for `prefers-reduced-motion`.

## Install

1. Download `bastion.zip` from the [latest release](https://github.com/apjone/bastion/releases/latest), or zip this folder yourself.
2. In Ghost Admin go to **Settings → Design & branding → Change theme → Upload theme**.
3. Activate it.

## Theme settings (Settings → Design & branding)

| Setting | Description |
|---|---|
| Default color scheme | What a first-time visitor sees: System (default), Light or Dark |
| Show homepage intro | The site title, description and signup form above the feed |
| Show post thumbnails | Feature image thumbnails in the post lists |
| Show related posts | Up to three posts sharing a tag, shown under each post |

Social icons appear in the header and the footer:

- **X and Facebook** come from **Settings → General → Social accounts**.
- **Mastodon, Bluesky, Threads, LinkedIn, YouTube, Instagram and TikTok** come from the `tony` staff profile (**Settings → Staff → profile → Social links**). Fields left empty are hidden. To use a different profile, change `slug:tony` in `partials/social-links.hbs`.
- **GitHub** (`https://github.com/apjone/`) is hard-coded in `partials/social-links.hbs` because Ghost has no GitHub field.
- **RSS** is always shown.

On mobile the header icons move into the menu.

Navigation comes from **Settings → Navigation**. Primary links go in the header and secondary links go in the footer.

## Syntax highlighting

[Prism](https://prismjs.com) 1.30.0 is bundled in `assets/js/prism.js` (MIT, see `assets/js/prism-LICENSE.txt`). It is served from your own site and is only loaded on posts and pages.

When you add a code card in the editor, set its language. Supported languages:

`bash`/`sh`/`shell`/`zsh`, `shell-session`/`console` (for `$ prompt` and output), `powershell`/`ps1`, `batch`/`cmd`, `python`/`py`, `javascript`/`js`, `typescript`/`ts`, `json`, `yaml`/`yml`, `toml`, `ini`, `html`/`xml`/`svg`, `css`, `php`, `ruby`, `perl`, `lua`, `c`, `cpp`, `csharp`/`cs`, `java`, `go`, `rust`, `visual-basic`/`vba`, `sql`, `http`, `nginx`, `apacheconf`/`htaccess`, `docker`/`dockerfile`, `hcl`/`terraform`, `makefile`, `diff`, `regex`, `nasm`/`asm` and `log`.

Code blocks without a language are left plain. To add a language, paste its `prism-<lang>.min.js` component from Prism 1.30.0 into `assets/js/prism.js`, just above the alias block at the end of the file.

## Customising colours

All colours are CSS custom properties at the top of `assets/css/screen.css`. The light palette is on `:root` and the dark palette is on `:root[data-theme="dark"]`. The no-JS fallback block repeats the dark palette, so update both dark blocks if you change it.

## Security

Only the latest release receives security fixes. See [SECURITY.md](SECURITY.md) for how to report a vulnerability privately.

## License

[MIT](LICENSE). Bundled third-party files keep their own licences: OpenDyslexic (SIL OFL 1.1, `assets/fonts/OFL.txt`) and Prism (MIT, `assets/js/prism-LICENSE.txt`).
