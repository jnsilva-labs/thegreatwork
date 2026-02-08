# astro-service

Deterministic Node/TypeScript microservice for natal chart calculations using Swiss Ephemeris.

## License and Swiss Ephemeris Notice

This service is licensed under **GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**.

It uses **Swiss Ephemeris** via a Node binding (`swisseph`). Swiss Ephemeris is AGPL-licensed software, so networked use and redistribution must comply with AGPL obligations.

## API

### POST `/chart/natal`

Request body:

```json
{
  "datetimeUtc": "1990-01-01T12:34:56Z",
  "lat": 40.7128,
  "lon": -74.006,
  "zodiac": "tropical",
  "houseSystem": "wholeSign",
  "aspects": {
    "orbDefault": 6,
    "orbLuminary": 8
  }
}
```

Response shape:

```json
{
  "meta": {
    "input": {},
    "jdUt": 2447893.02425926,
    "zodiac": "tropical",
    "houseSystem": "wholeSign",
    "ephemeris": {
      "backend": "swisseph",
      "calcUtFlags": 258,
      "trueNode": true,
      "houseSource": "whole-sign-from-asc"
    },
    "generatedAt": "2026-02-08T01:23:45.000Z"
  },
  "points": {
    "sun": 281.17,
    "moon": 330.42,
    "mercury": 296.01,
    "venus": 306.55,
    "mars": 250.12,
    "jupiter": 95.31,
    "saturn": 284.66,
    "uranus": 275.03,
    "neptune": 282.27,
    "pluto": 226.91,
    "node": 310.4,
    "chiron": 97.02,
    "asc": 187.14,
    "mc": 98.63
  },
  "houses": {
    "cusps": [180, 210, 240, 270, 300, 330, 0, 30, 60, 90, 120, 150]
  },
  "aspects": [
    { "a": "sun", "b": "moon", "type": "sextile", "orb": 0.75 }
  ]
}
```

## Local development

```bash
npm install
npm run dev
```

The service defaults to port `3001`.

Health endpoint:

```bash
curl http://localhost:3001/healthz
```

Sample request:

```bash
curl -X POST http://localhost:3001/chart/natal \
  -H 'Content-Type: application/json' \
  -d '{
    "datetimeUtc":"1990-01-01T12:34:56Z",
    "lat":40.7128,
    "lon":-74.006,
    "zodiac":"tropical",
    "houseSystem":"placidus",
    "aspects":{"orbDefault":6,"orbLuminary":8}
  }'
```

## Docker

```bash
docker compose up --build
```

Service URL: `http://localhost:3001`

## Tests

```bash
npm test
```
