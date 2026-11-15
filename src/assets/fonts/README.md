# Bricolage Grotesque (self-hosted)

- `bricolage-grotesque-latin-opsz-normal.woff2`: variable WOFF2, axes `opsz 12..96` and `wght 200..800`, subset **latin**
  (covers all of PT-BR, EN and ES). Byte-identical to the file Google Fonts served for
  `Bricolage+Grotesque:opsz,wght@12..96,300..800` (v9), so the site renders exactly as before.
- `OFL.txt`: SIL Open Font License 1.1, copyright 2022 The Bricolage Grotesque Project Authors
  (https://github.com/ateliertriay/bricolage).
- Source of the file: the `@fontsource-variable/bricolage-grotesque` package (5.3.0, `files/bricolage-grotesque-latin-opsz-normal.woff2`).
- latin-ext and vietnamese are not shipped: no character used in the site's text (PT, EN, ES) is outside latin.
  If a new character is ever added that is outside it, take `...-latin-ext-opsz-normal.woff2` from the same package
  and add its `@font-face` (with its `unicode-range`) to `src/index.css`.
