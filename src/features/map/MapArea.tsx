import { useEffect, useRef } from 'react'
import { MapboxOverlay } from '@deck.gl/mapbox'
import type { Map as MapLibreMap } from 'maplibre-gl'
import NodePopup from '../ui/NodePopup'

import { selectNodes, selectNodeLegendFilters } from '../nodes/nodeSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setSelectedNode, selectSelectedNode} from '../ui/uiSlice'
import { createNodeLayer, isNodeVisible } from '../nodes/NodeLayer'
import { selectLinks, selectFilters as selectLinkFilters } from '../links/linkSlice'
import { selectDevices } from '../devices/deviceSlice'
import { createLinkLayer } from '../links/LinkLayer'
import type { Node } from '../../types/models'
import { flyTo, selectMap } from './mapSlice'
import { selectSectors, selectSectorFilters} from '../sectors/sectorSlice'
import { createSectorLayer } from '../sectors/SectorLayer'

type MapAreaProps = {
    map: MapLibreMap
}

const MapArea = ({ map }: MapAreaProps) => {
    const dispatch = useAppDispatch()

    const nodes = useAppSelector(selectNodes)
    const nodeFilters = useAppSelector(selectNodeLegendFilters)
    const links = useAppSelector(selectLinks)
    const linkFilters = useAppSelector(selectLinkFilters)
    const devices = useAppSelector(selectDevices)
    const sectors = useAppSelector(selectSectors)
    const sectorFilters = useAppSelector(selectSectorFilters)
    const mapState = useAppSelector(selectMap)

    const selectedNode = useAppSelector(selectSelectedNode)
    const selectedNodeId = selectedNode?.id ?? null

    // console.log('selectedNodeId:', selectedNodeId)

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

       
    
    
    const visibleNodes = nodes.filter((node) => isNodeVisible(node, nodeFilters))

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






        const sectorLayer = createSectorLayer( sectors, selectedNodeId, nodes, nodeFilters, sectorFilters )

        const linkLayer = createLinkLayer( links, devices, nodes, nodeFilters, linkFilters)

        const nodeLayer = createNodeLayer({
            nodes: visibleNodes,
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
    }, [map, nodes, nodeFilters, links, devices, sectors, selectedNodeId, linkFilters, sectorFilters, dispatch])

    return (
        <NodePopup
            map={map}
            node={selectedNode}
        />
    )
}

export default MapArea