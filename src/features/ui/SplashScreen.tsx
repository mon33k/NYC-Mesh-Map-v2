import { useAppSelector } from '../../app/hooks'
import { selectNodes } from '../nodes/nodeSlice'

type SplashProps = {
    mapReady: boolean;
}

export default function Splash({mapReady}:SplashProps) {
    const nodes = useAppSelector(selectNodes)
    const nodesLoaded = nodes.length > 0

    if (nodesLoaded && mapReady) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="relative h-24 w-24">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-[#f6be00]" />
                <img
                    src="/mesh.svg"
                    alt="NYC Mesh"
                    className="absolute inset-0 m-auto h-12 w-12"
                />
            </div>
        </div>
    )
}