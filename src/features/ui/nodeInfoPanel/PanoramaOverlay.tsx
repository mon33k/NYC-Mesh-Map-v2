import { useState } from 'react'

type PanoramaOverlayProps = {
    imageUrl: string
    onClose: () => void
}

const PanoramaOverlay = ({imageUrl, onClose}: PanoramaOverlayProps) => {
    const [isZoomed, setIsZoomed] = useState(false)

    function toggleZoom() {
        setIsZoomed(!isZoomed)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 p-4">
            <button className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-3xl text-white hover:bg-black"
                type="button"
                onClick={onClose}
                aria-label="Close panorama"
            >
                ×
            </button>

            <div className="flex h-full items-center justify-center overflow-auto">
                <img
                    className={`max-h-full max-w-full rounded transition-transform duration-200 
                        ${ isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in' }`}
                    src={imageUrl}
                    alt="Selected panorama"
                    onClick={toggleZoom}
                />
            </div>
        </div>
    )
}

export default PanoramaOverlay