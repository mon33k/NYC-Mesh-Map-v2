import { LineLayer } from '@deck.gl/layers'
import type { Device, Link } from '../../types/models'
import { getLinkColor } from './LinkColors'

type MapLink = Link & {
    sourcePosition: [number, number]
    targetPosition: [number, number]
}

export function createLinkLayer( links: Link[], devices: Device[] ) {
    const mapLinks: MapLink[] = []

    for (const link of links) {
        const fromDevice = devices.find((device) => {
            return device.id === link.from_device.id
        })

        const toDevice = devices.find((device) => {
            return device.id === link.to_device.id
        })

        // dont draw link if to or from device is missing
        if (!fromDevice || !toDevice) {
            continue
        }

        // dont draw link if device has no map coords
        if (
            fromDevice.longitude == null ||
            fromDevice.latitude == null ||
            toDevice.longitude == null ||
            toDevice.latitude == null
        ) {
            continue
        }

        mapLinks.push({
            ...link,

            // DeckGL coords are [long, lat]
            sourcePosition: [
                fromDevice.longitude,
                fromDevice.latitude,
            ],

            targetPosition: [
                toDevice.longitude,
                toDevice.latitude,
            ],
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

        getWidth: 2,
        widthUnits: 'pixels',

        pickable: true,
    })
}