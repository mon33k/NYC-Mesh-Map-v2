import type { StyleSpecification } from 'maplibre-gl'

export const mapStyle: StyleSpecification = {
    version: 8,
    sources: {
        carto: {
            type: 'raster',
            tiles: [
                'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
        },
    },
    layers: [
        {
            id: 'carto-light',
            type: 'raster',
            source: 'carto',
        },
    ],
}