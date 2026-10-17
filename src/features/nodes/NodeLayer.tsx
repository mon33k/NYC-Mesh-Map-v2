import { ScatterplotLayer } from '@deck.gl/layers'
import type { Node, NodeLegendFilters } from '../../types/models'
import { getNodeColor, getNodeSize } from './NodeColors'

type NodeLayerProps = {
    nodes: Node[]
    selectedNodeId: string | null
    onNodeClick: (node: Node) => void
}



export function matchesNodeType(node: Node, filters: NodeLegendFilters) {
    const showAllTypes = filters.types.length === 0

    if (showAllTypes) {
        return true
    }
    return filters.types.includes(node.type)
}

export function isNodeVisible(node: Node, filters: NodeLegendFilters) {
    if (!matchesNodeType(node, filters)) {
        return false
    }

    if (node.status === 'Active') {
        return filters.active
    }

    if (node.status === 'Inactive') {
        return filters.inactive
    }

    return false
}

export function createNodeLayer({ nodes, onNodeClick, selectedNodeId }: NodeLayerProps) {
    return new ScatterplotLayer<Node>({
        id: 'nodes',
        data: nodes.filter(
            (node) =>
                Number.isFinite(node.longitude) &&
                Number.isFinite(node.latitude),
        ),
        pickable: true,
        getPosition: (node) => [node.longitude, node.latitude],
        getRadius: (node) => getNodeSize(node.type),
        radiusUnits: 'pixels',
        getFillColor: (node) => getNodeColor(node.type, node.status),
        // getLineColor: [255, 255, 255, 255],
        // getLineWidth: 1,
        stroked: true,

        getLineColor: (node) => {
            if (node.id === selectedNodeId) {
                return [255, 255, 255, 255]
            }
            return [0, 0, 0, 0]
        },

        getLineWidth: (node) => {
            if (node.id === selectedNodeId) {
                return 3
            }
            return 0
        },

        lineWidthUnits: 'pixels',
        onClick: ( info ) => {
            const clickedNode = info.object

            if (clickedNode) {
                onNodeClick(clickedNode)
            }
        },
    })
}