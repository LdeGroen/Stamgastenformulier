# Stamgastenformulier

Live op https://stamgast.cafetheaterfestival.nl/. Onderdeel van de software van Café Theater Festival.

## Ontwikkelen

```bash
npm install
npm start          # Vite-ontwikkelserver
npm run build      # productiebouw naar build/
npm run lint       # ESLint
```

Componenten met JSX staan in `.jsx`-bestanden (Vite).

## Uitrollen

Automatisch bij elke push naar `main`: lint, build en rsync naar de Hetzner-server
via de gedeelde workflow `deploy-site.yml` in ctf-ui.

De uitrolsleutel (secret `NIEUWE_SERVER_KEY`) is van deze site alleen en kan op de
server enkel in de eigen map schrijven (rrsync, audit INF-01). Een push die alleen
documentatie raakt (`*.md`, `docs/`) start geen uitrol.
