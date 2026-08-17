# Farmstead Field Card

A parcel screening tool for evaluating candidate farmsteads in upstate New York —
scoring land cost, regulatory posture, roadside cafe viability, and buildout potential
on a consistent basis so properties can be compared against each other rather than by feel.

## Live tool

https://pendragondevelopment.github.io/farmstead-scorecard/

## How it works

**Three deal breakers** sit above the score. Any "no" disqualifies the parcel regardless
of how well it scores elsewhere:

- Legal access on a maintained public road
- Lodging achievable without a full rezoning
- Wastewater feasible for commercial flows

**Twenty scored criteria** across four weighted sections:

| Section | Points | Covers |
|---|---|---|
| Cost & structures | 30 | Price, price per acre, seller financing, farmhouse, barn convertibility |
| Regulatory | 27 | Agricultural district, cabin zoning, town track record, constraints, water |
| Cafe viability | 25 | Traffic count, sight lines, nearby draws, highway and transit access |
| Land & buildout | 18 | Pasture, slope and aspect, cabin siting, utilities, soils |

Each criterion scores 0–4. The weighted total runs 0–100. Above 70 stamps as Shortlist,
50–70 as Worth a look.

## Data and privacy

Everything is stored in your browser's local storage. Nothing is uploaded anywhere and
there is no backend. That means data is **per browser and per device** — what you enter
on your phone will not appear on your laptop.

Use **Export** to download a JSON file and **Import** to load it elsewhere. Import merges
by property, so two people touring separately can combine their cards without losing work.

Clearing browser data will erase saved properties. Export before you do.

## Before you tour

Two things worth pulling in advance, since they score better from a desk than a driveway:

- **NYSDOT traffic counts** — annual average daily traffic by road segment, for the cafe frontage
- **NRCS Web Soil Survey** — soil classification for the parcel

## Running locally

No build step and no dependencies. Open `index.html` in a browser, or:

```
python3 -m http.server 8000
```

Web fonts load from Google Fonts; the tool falls back to system fonts offline.
