# High-Detail Anatomy Models

The 3D Anatomy Explorer ships with **procedural geometry** — anatomically shaped
bones built in code. It works with no models present.

This folder lets you swap in **scan-derived meshes** (real CT/MRI-segmented
anatomy) for any structure. Listed structures get the real mesh; everything else
keeps the procedural version. Nothing here is required for the site to work.

---

## Quick start

1. Obtain model files (see **Where to get models** below) and export/convert each
   to `.glb`.
2. Copy the `.glb` files into this folder.
3. List them in `manifest.json` under `models`, keyed by **structure id**.
4. Reload `anatomy.html`. Loaded structures show a "Models:" attribution chip.

### manifest.json

```json
{
  "attribution": {
    "source": "BodyParts3D, © DBCLS",
    "license": "CC BY-SA 2.1 JP",
    "url": "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html"
  },
  "transform": { "scale": 1.0, "offset": [0, 0, 0], "rotation": [0, 0, 0] },
  "models": {
    "femur_r": { "file": "femur_right.glb" },
    "femur_l": { "file": "femur_left.glb", "scale": 1.02 },
    "skull":   { "file": "skull.glb", "offset": [0, 1.5, 0] }
  }
}
```

**Per-entry options**

| Key | Meaning |
|---|---|
| `file` | Filename in this folder (required) |
| `scale` | Multiplied with the global `transform.scale` |
| `offset` | `[x, y, z]`, added to the global offset |
| `rotation` | `[x, y, z]` in radians; overrides the global rotation |
| `keepMaterial` | `true` keeps the model's own material instead of the shared bone material |

`transform` applies to every model — use it to convert the dataset's units and
origin to the explorer's coordinate system.

### Coordinate system

- **Y is up**, origin on the floor between the feet
- Units are **centimetres**; the model is about **178** tall
- **+Z is anterior** (the model faces the default camera)
- **-X is the subject's RIGHT** — a person facing you has their right on your left

Useful reference heights: hip joint centre ≈ **90**, glenoid ≈ **144**,
knee joint ≈ **48**, ankle ≈ **9**.

If a model imports at the wrong size, most datasets are in metres — try
`"scale": 100`.

### Structure ids

Use the ids the explorer already defines, so landmarks and panel content carry
over. Paired structures end in `_r` / `_l`. To list them all, open the explorer
with `#debug=1` and run in the console:

```js
Object.keys(__anatomy.STRUCTURES).sort().join('\n')
```

Examples: `skull`, `cervical`, `thoracic`, `lumbar`, `sacrum`, `ribcage`,
`pelvis`, `clavicle_r`, `scapula_r`, `humerus_r`, `radius_r`, `ulna_r`,
`scaphoid_r`, `femur_r`, `patella_r`, `tibia_r`, `fibula_r`, `talus_r`,
`calcaneus_r`.

---

## Where to get models

You must obtain these yourself and comply with their licences. Two well-known
openly-licensed sources:

- **BodyParts3D** (DBCLS, Japan) — individual anatomical structures segmented
  from real scan data, each tagged with an FMA id. Licensed **CC BY-SA 2.1 JP**.
- **Z-Anatomy** — a Blender-based atlas built on BodyParts3D, already cleaned up
  and named. Licensed **CC BY-SA 4.0**.

Commercial anatomy libraries also sell licensed meshes; check whether their
licence permits publishing on a public website before using them.

### ⚠️ Licensing obligations — read before publishing

These are real legal requirements, not formalities:

- **Attribution is mandatory.** Fill in the `attribution` block — the explorer
  renders it on screen whenever models load. Removing it breaks the licence.
- **Share-Alike (the "SA" in CC BY-SA).** If you *modify* the models, the
  modified models must be released under the same licence. Simply displaying
  unmodified models on a page does not force you to relicense your website, but
  edited meshes you redistribute must carry the same terms.
- **Commercial use is permitted** under CC BY-SA (there is no "NC" clause), so
  running ads on the page is acceptable — provided attribution is intact.
- **Do not commit huge binaries carelessly.** Git keeps every version forever.
  This repository's history was already rewritten once to remove large files.
  Consider Git LFS, or host the `.glb` files on a CDN and point `file` at an
  absolute URL.

If you are unsure whether a particular dataset's licence permits your use,
get advice before publishing rather than after.

---

## Performance notes

Raw scan-derived meshes are often extremely dense (hundreds of thousands of
triangles per bone). Before shipping:

- **Decimate** in Blender (Decimate modifier, ~0.1–0.3 ratio) — bones stay
  convincing at a fraction of the triangles.
- **Compress** with Draco or `gltf-transform optimize`.
- Aim for roughly **< 50k triangles per bone** and a total under a few hundred
  thousand, so mid-range phones can still render it.

The explorer's procedural surface maps (vascular striations, porosity) are
applied to loaded meshes too, unless you set `keepMaterial: true`.

---

## What is currently installed

This folder ships **150 real anatomical structures** (~347k triangles, ~6.3 MB)
converted from **BodyParts3D**, the segmented-scan dataset that Z-Anatomy is
itself built on:

| System | Real meshes | Procedural | Notes |
|---|---|---|---|
| Skeleton | 55 | 0 | complete, incl. individually named carpals and tarsals |
| Muscles | 100 | 2 | cuff, hip rotators, compartments, axial and deep segmental groups |
| Arteries | 23 | 4 | aorta and the major named branches |
| Veins | 16 | 2 | cavae, azygos, deep and superficial limb veins |
| Nerves | 0 | 59 | **not in the dataset** — see below |
| Lymphatics | 0 | 25 | **not in the dataset** — see below |

BodyParts3D contains only *cranial* nerves, so the peripheral nerves the
explorer cares about (sciatic, median, ulnar, brachial plexus…) have no
scan-derived equivalent and keep their procedural paths. It has no lymphatic
vessels or nodes at all. A handful of soft-tissue structures are also absent
and stay procedural: latissimus dorsi, external carotid artery, fibular
(peroneal) artery and external jugular vein. There is no discrete rectus
abdominis mesh either — the dataset carries the anterior abdominal wall as a
single muscle mass, so that structure is named and described as the wall.

**Left-side meshes are mirrored.** BodyParts3D ships only the right-side
original and refers to the left by a mirrored `…M` id that the archive omits.
The build reflects the right mesh across the sagittal plane (x = 0) and
reverses the triangle winding so normals still face outward.

**Loading is lazy, by layer.** Only the skeleton is fetched at startup; a
layer's meshes download the first time you switch that layer on.

- Source: BodyParts3D © DBCLS — <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html>
- Licence: **CC BY-SA 2.1 JP** (Z-Anatomy's derived atlas is CC BY-SA 4.0)
- Attribution is rendered on screen by the explorer whenever these load.

Meshes were converted OBJ → GLB and decimated with vertex clustering to fit a
per-structure triangle budget. Positions are unmodified BodyParts3D
coordinates; the manifest's `transform` maps them into the explorer's frame
(scale 0.1043, rotate −90° about X, offset [0, 7.30, −10.40]).

**Note on the excluded parts.** BodyParts3D's inner-ear and kidney meshes carry
**non-commercial (NC)** licences and are deliberately *not* included, because
this site carries advertising. Skeletal meshes are CC BY-SA with no NC clause,
so they are fine for commercial use with attribution.
