import { useEffect, useRef } from 'react'
import { MapboxOverlay } from '@deck.gl/mapbox'
import type { Map as MapLibreMap } from 'maplibre-gl'
import NodePopup from '../ui/NodePopup'

import { selectNodes } from '../nodes/nodeSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setSelectedNode, selectSelectedNode } from '../ui/uiSlice'
import { createNodeLayer } from '../nodes/NodeLayer'
import { selectLinks } from '../links/linkSlice'
import { selectDevices } from '../devices/deviceSlice'
import { createLinkLayer } from '../links/LinkLayer'
import type { Node } from '../../types/models'
import { flyTo, selectMap } from './mapSlice'
import { selectSectors } from '../sectors/sectorSlice'
import { createSectorLayer } from '../sectors/SectorLayer'

type MapAreaProps = {
    map: MapLibreMap
}

const MapArea = ({ map }: MapAreaProps) => {
    const dispatch = useAppDispatch()

    const nodes = useAppSelector(selectNodes)
    const links = useAppSelector(selectLinks)
    const devices = useAppSelector(selectDevices)
    const sectors = useAppSelector(selectSectors)
    const mapState = useAppSelector(selectMap)

    const selectedNode = useAppSelector(selectSelectedNode)
    const selectedNodeId = selectedNode?.id ?? null

    console.log('selectedNodeId:', selectedNodeId)

    const overlayRef = useRef<MapboxOverlay | null>(null)

    useEffect(() => {
        const overlay = new MapboxOverlay({ layers: [] })

        overlayRef.current = overlay
        map.addControl(overlay)

        return () => {
            map.removeControl(overlay)
            overlayRef.current = null
        }
    }, [map])

    useEffect(() => {
        map.flyTo({
            center: mapState.center,
            zoom: mapState.zoom,
            duration: 900,
            essential: true,
        })
    }, [map, mapState.center, mapState.zoom])

    useEffect(() => {
        const overlay = overlayRef.current

        if (overlay === null) {
            return
        }

        function onNodeClick(node: Node) {
            dispatch(setSelectedNode(node))

            dispatch(flyTo({
                center: [
                    node.longitude,
                    node.latitude
                ],
                zoom: 15
            }))
        }

        const sectorLayer = createSectorLayer( sectors, selectedNodeId )

        const linkLayer = createLinkLayer( links, devices )

        const nodeLayer = createNodeLayer({
            nodes,
            selectedNodeId,
            onNodeClick
        })

        overlay.setProps({
            layers: [
                sectorLayer,
                linkLayer,
                nodeLayer,
            ],
        })
    }, [nodes, links, devices, sectors, selectedNodeId, dispatch])

    return (
        <NodePopup
            map={map}
            node={selectedNode}
        />
    )
    return null
}

export default MapArea