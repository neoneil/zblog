# Thoth knowledge integration

Source: https://github.com/ctrlaltjakub/Toth-Tarot-Handbook
Source commit: 676b87e69e6cf14fb275f1aee24a635b77fdfc6e
Copyright (c) 2026 Jakub Fleites-Jonczyk. MIT license: ./LICENSE.

Imported source: data/treeOfLifeData.ts, data/tarotData.ts, data/astrologyData.ts,
data/libraryData.ts, components/TreeOfLifeSVG.tsx, components/ZodiacWheelSVG.tsx
and components/PlanetGlyph.tsx.
The diagram retains the original geometry, correspondence data and visibility layers.
Adaptations: Next.js navigation, existing site UI and preferences, scoped theme token
aliases, Chinese labels and keyboard interaction.

translations.ts contains editorial Chinese explanations, not line-for-line translations.
English source descriptions remain intact and are also available in Chinese mode.
Maintain stable source IDs when editing translations. Chinese terminology should be
reviewed by a Thoth/Qabalah subject specialist before treating it as a final edition.

Scope: Tree of Life, 78-card reader, astrology wheel and article library. Card,
astrology and tree correspondences link to local routes. Search is per-module.
Chinese long-form content is editorial guidance, not a complete literal translation;
original English descriptions and articles remain accessible in every reader.
The original global glossary overlay and global search are not imported yet.
No original Thoth deck artwork is included.
