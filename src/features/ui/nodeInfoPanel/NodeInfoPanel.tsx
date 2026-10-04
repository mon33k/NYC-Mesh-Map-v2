import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { nodeTypeColors } from '../../../types/models'
import { clearSelectedNode, selectSelectedNode } from '../uiSlice'
import NodeDetails from './NodeDetails'
import PanoramaGallery from './PanoramaGallery'
import PanoramaOverlay from './PanoramaOverlay'

const NodeInfoPanel = () => {
    const dispatch = useAppDispatch()
    const node = useAppSelector(selectSelectedNode)
    const [panoramaUrl, setPanoramaUrl] = useState<string | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    if (!node) return null

    const color = nodeTypeColors[node.type] ?? '#bcbec0'

    const installNumbers = (node.installs ?? []).map((install) => install.install_number).join(', ') // not every node has installs arr

    function closePanel() {
        dispatch(clearSelectedNode())
        setPanoramaUrl(null)
        setIsFullscreen(false)
    }

    function toggleFullscreen() {
        setIsFullscreen((prev) => !prev)
    }

    return (
        <>
            <div className={`absolute ${isFullscreen ? 'left-0 right-0 top-0 bottom-0 z-50 m-0 max-h-none' : 'bottom-4 left-4 right-4'} z-20 max-h-[45vh] overflow-y-auto bg-white shadow-xl sm:left-4 sm:right-auto sm:top-20 sm:w-72 sm:max-h-none ${isFullscreen ? 'sm:max-h-[80vh] sm:rounded-lg' : ''}`}>
                <header className="flex items-center justify-between border-b p-3">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />

                        <div>
                            <h2 className="font-bold">
                                {node.name ?? `Node ${node.network_number}`}
                            </h2>

                            <p className="text-xs text-gray-500">
                                NN {node.network_number}
                            </p>
                            {installNumbers && (
                                <p className="text-xs text-gray-500">
                                    Installs: {installNumbers}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isFullscreen && (
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                aria-label="Expand to fullscreen"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>
                        )}
                        {isFullscreen && (
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                aria-label="Shrink to normal size"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
                                </svg>
                            </button>
                        )}
                        <button type="button" onClick={closePanel} aria-label="Close node panel" className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="flex gap-2 p-3">
                    <span className="rounded border px-2 py-1 text-xs">
                        {node.status}
                    </span>

                    <span className="rounded border px-2 py-1 text-xs" style={{ color, borderColor: color }}>
                        {node.type}
                    </span>
                </div>

                <NodeDetails node={node} />

                {<PanoramaGallery node={node} onSelect={setPanoramaUrl} />}
            </div>

            {panoramaUrl && (
                <PanoramaOverlay imageUrl={panoramaUrl} onClose={() => setPanoramaUrl(null)} />
            )}
        </>
    )
}

export default NodeInfoPanel
