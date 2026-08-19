import MapContainer from '../features/map/MapContainer'
import NodeInfoPanel from '../features/ui/nodeInfoPanel/NodeInfoPanel'

const Map = () => {
    return (
        <div className="relative h-full w-full">
            <MapContainer />
            <NodeInfoPanel />
        </div>
    )
}

export default Map