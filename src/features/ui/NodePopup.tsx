import { useEffect } from 'react'
import { Popup, type Map as MapLibreMap } from 'maplibre-gl'
import type { Node } from '../../types/models'

type Props = {
    map: MapLibreMap
    node: Node | null
}

const NodePopup = ({ map, node }: Props) => {
    useEffect(() => {
        if (!node) {
            return
        }

        const popup = new Popup({
            closeButton: false,
            offset: 18,
        })

        popup
            .setLngLat([
                node.longitude,
                node.latitude,
            ])
            .setText(`NN ${node.network_number}`)
            .addTo(map)

            popup.getElement().style.zIndex = '50'
        return () => {
            popup.remove()
        }
    }, [map, node])

    return null
}

export default NodePopup