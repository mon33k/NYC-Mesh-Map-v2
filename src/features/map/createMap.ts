import * as maplibregl from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { mapStyle } from '../ui/mapStyle'

maplibregl.setWorkerUrl(workerUrl)

export function createMap(container: HTMLDivElement) {
    const map = new maplibregl.Map({
        container,
        style: mapStyle,
        center: [-73.9596, 40.72],
        zoom: 11,
    })

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right')
    map.addControl(new maplibregl.ScaleControl(), 'bottom-left')

    return map
}