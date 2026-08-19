import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '../../app/hooks'
import type { Map as MapLibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { createMap } from './createMap'
import MapArea from './MapArea'
import MapSearch from '../ui/mapSearch/MapSearch'
import NodeInfoPanel from '../ui/nodeInfoPanel/NodeInfoPanel'
import { fetchLinks } from '../links/linkSlice'
import { fetchDevices } from '../devices/deviceSlice'
import { fetchSectors } from '../sectors/sectorSlice'

import { defaultCenter, defaultZoom } from '../../types/models'

const MapContainer = () => {
    const dispatch = useAppDispatch()
    const [map, setMap] = useState<MapLibreMap | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    const resetMapView = () => {
        if (!map) return

        map.flyTo({
            center: defaultCenter,
            zoom: defaultZoom,
            duration: 800,
        })
    }

    useEffect(() => {
        dispatch(fetchLinks())
        dispatch(fetchDevices())
        dispatch(fetchSectors())
    }, [dispatch])

    useEffect(() => {
        if (!containerRef.current) return

        const mapInstance = createMap(containerRef.current)

        setMap(mapInstance)

        return () => {
            mapInstance.remove()
        }
    }, [])

    return (
        <div className="relative h-full w-full">
            <div ref={containerRef} className="h-full w-full" />

            {map && <MapArea map={map} />}

            <MapSearch map={map} />
            <NodeInfoPanel />

            <button
                type="button"
                onClick={resetMapView}
                className="absolute right-4 top-4 z-10 rounded bg-white px-3 py-2 text-sm shadow"
            >
                Reset view
            </button>
        </div>
    )
}

export default MapContainer