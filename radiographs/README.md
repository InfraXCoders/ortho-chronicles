# Radiographs & CT images

Images used by [radio-anatomy.html](../radio-anatomy.html). All are self-hosted
from **Wikimedia Commons** and were licence-checked programmatically before
download.

## Licence position

| Licence | Count | Commercial use |
|---|---|---|
| CC0 | 13 | Yes, no conditions |
| Public domain | 1 | Yes, no conditions |
| CC BY-SA 3.0 | 1 | Yes, with attribution + share-alike |

**Nothing NC (non-commercial) or ND (no-derivatives) is used.** This matters:
the site carries advertising, so an NC image would be a licence breach. The
download script rejects any file whose licence string matches `nc` or `nd`.

This rules out **Radiopaedia**, which is otherwise the obvious source for
orthopaedic imaging — its cases are CC BY-NC-SA, and the NC clause makes them
unusable on an ad-supported page regardless of how the images are credited.

## Attribution

`credits.json` holds the full record for each file — author, licence, Commons
source URL and original dimensions. The page renders author, licence and a
Commons link beneath every image. Do not remove that: for the CC BY-SA image
it is a licence condition, and for the rest it is basic academic honesty.

## Adding more

Use `scratchpad/rad/fetch.js` as the pattern:

1. Query the Commons API with `iiprop=url|extmetadata` and `iiurlwidth=900`
   to get a resized thumbnail rather than the full-size original.
2. Reject anything whose `LicenseShortName` matches `nc` or `nd`.
3. Download **sequentially with a delay** — Wikimedia rate-limits rapid
   parallel requests and silently returns an HTML error page. Validate the
   magic bytes (`ffd8` for JPEG, `89504e47` for PNG) before trusting a file;
   this is exactly how 11 broken 2 KB "images" were caught during the initial
   import.
4. Record the metadata in `credits.json` and add an entry to the `FILMS` map
   in `radio-anatomy.html`.

## Other openly-licensed sources worth knowing

- **The Cancer Imaging Archive (TCIA)** — real CT/MRI DICOM series, many CC BY.
- **NIH Open-i** — indexes open-access article figures; licence varies per item.
- **NLM Visible Human Project** — cross-sectional anatomy, public domain.
