import type { StyleSpecification } from 'maplibre-gl'

// Need to fix this for different map styles for now I am using a hardcoded mapStyle in createMaps.ts

// const mapStyleOptions = {
//     'svwd03': '/styles/svwd/svwd03style.json',
//     'graybeard': '/styles/shortbread/graybeard.json',
//     'eclipse': '/styles/shortbread/eclipse.json',
//     'neutrino': '/styles/shortbread/neutrino.json',
//     'shadow': '/styles/shortbread/shadow.json',
// }

export const mapStyle: StyleSpecification = {
    version: 8,
    sources: {
        "maplibre-streets": {
            type: 'vector',
            tiles: [
                'https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt',
            ],
            // tileSize: 256,
        },
    },
    layers: [
        {
            id: 'svwd03',
            type: 'line',
            source: 'maplibre',
        },
    ],
}