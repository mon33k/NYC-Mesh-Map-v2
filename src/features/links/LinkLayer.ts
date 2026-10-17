import { LineLayer } from '@deck.gl/layers'
import type { Device, Link, Node, NodeLegendFilters } from '../../types/models'
import { isNodeVisible } from '../nodes/NodeLayer'
import type { Filters as LinkTypeFilters } from './linkSlice'
import { getLinkColor } from './LinkColors'

type MapLink = Link & {
    sourcePosition: [number, number]
    targetPosition: [number, number]
}

function getLinkFilterKey(link: Link): keyof LinkTypeFilters {
    if (link.type === 'VPN') {
        return 'vpn'
    } else if (link.type === 'Fiber') {
        return 'fiber'
    } else if (link.type === 'Ethernet') {
        return 'ethernet'
    } else {
        return 'wireless'
    }
}



export function createLinkLayer( links: Link[], devices: Device[], nodes: Node[], nodeFilters: NodeLegendFilters, linkFilters: LinkTypeFilters) {
    const deviceByID = new Map(devices.map((device) => [device.id, device]))
    const nodeByID = new Map(nodes.map((node) => [node.id, node]))
    const mapLinks: MapLink[] = []

    for (const link of links) {
        if (!linkFilters[getLinkFilterKey(link)]) {
            continue
        }
            
        const fromDevice = deviceByID.get(link.from_device.id)

        const toDevice = deviceByID.get(link.to_device.id)

        if (!fromDevice || !toDevice) {
                continue
        }   

         
        const fromNode = nodeByID.get(fromDevice.node?.id ?? '')
        const toNode = nodeByID.get(toDevice.node?.id ?? '')
        

        // dont draw link if to or from device is missing
        if (!fromNode || !toNode) {
            continue
        }

        if (!isNodeVisible(fromNode, nodeFilters) && !isNodeVisible(toNode, nodeFilters)) {
            continue
        }

        if (
            !Number.isFinite(fromDevice.longitude) ||
            !Number.isFinite(fromDevice.latitude) ||
            !Number.isFinite(toDevice.longitude) ||
            !Number.isFinite(toDevice.latitude)
        ) {
            continue
        }


        mapLinks.push({
            ...link,

            // DeckGL coords are [long, lat]
            sourcePosition: [ fromDevice.longitude, fromDevice.latitude ],
            targetPosition: [ toDevice.longitude, toDevice.latitude],
        })
    }

 


    return new LineLayer<MapLink>({
        id: 'links',
        data: mapLinks,
        getSourcePosition: (link) => {
            return link.sourcePosition
        },
        getTargetPosition: (link) => {
            return link.targetPosition
        },
        getColor: getLinkColor,
        getWidth: 2.5,
        widthUnits: 'pixels',
        pickable: true,
    })
}