import { LineLayer } from '@deck.gl/layers'
import type { Device, Link, Node, NodeLegendFilters } from '../../types/models'
import type { Filters as LinkTypeFilters } from './linkSlice'
import { getLinkColor } from './LinkColors'

type MapLink = Link & {
    sourcePosition: [number, number]
    targetPosition: [number, number]
}

const linkTypeFilterKey: Record<string, keyof LinkTypeFilters> = {
    VPN: 'vpn',
    Fiber: 'fiber',
    Wireless: 'wireless',
    Ethernet: 'ethernet',
}



export function createLinkLayer( links: Link[], devices: Device[], nodes: Node[], nodeFilters: NodeLegendFilters, linkFilters: LinkTypeFilters) {
    const mapLinks: MapLink[] = []

    for (const link of links) {
        const fromDevice = devices.find((device) => {
            return device.id === link.from_device.id
        })

        const toDevice = devices.find((device) => {
            return device.id === link.to_device.id
        })

        if (!fromDevice || !toDevice) {
            // console.log("device missing node:", {fromDevice, toDevice})
                continue
        }   

        //  if (!fromDevice.id || !toDevice.id) {
        //     console.log("device missing node:", {fromDevice, toDevice})
        //         continue
        // }   
        const fromNode = nodes.find((node) => {
            return node.id === fromDevice.node?.id
        })

        const toNode = nodes.find((node) => {
            return node.id === toDevice.node?.id
        })

        // dont draw link if to or from device is missing
        if (!fromNode || !toNode) {
            continue
        }

        // const sameFrom = (filters.type === 'all' || fromNode.type === filters.type) && ((fromNode.status === 'Active' && filters.active) || (toNode.status === 'Inactive' && filters.inactive)) 
        const sameFrom = (nodeFilters.type === 'all' ||
            fromNode.type === nodeFilters.type) && ((fromNode.status === 'Active' && nodeFilters.active) ||
            (fromNode.status === 'Inactive' && nodeFilters.inactive))
        const sameTo = (nodeFilters.type === 'all' ||
            toNode.type === nodeFilters.type) && ((toNode.status === 'Active' && nodeFilters.active) ||
            (toNode.status === 'Inactive' && nodeFilters.inactive))

        if (!sameFrom && !sameTo) { continue }
        
        const filterKey = linkTypeFilterKey[link.type ?? '']

        if (filterKey && !linkFilters[filterKey]) {
            continue
        }

        // dont draw link if device has no map coords
        // if (
        //     fromDevice.longitude == null ||
        //     fromDevice.latitude == null ||
        //     toDevice.longitude == null ||
        //     toDevice.latitude == null
        // ) {
        //     continue
        // }

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

    console.log('Link layer counts:', {
        links: links.length,
        devices: devices.length,
        drawableLinks: mapLinks.length,
    })


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
        getWidth: 2,
        widthUnits: 'pixels',
        pickable: true,
    })
}