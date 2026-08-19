import panoramaManifest from '../../../data/panoramas.json'
import type { Node } from '../../../types/models'

type PanoramaMap = Record<string, string[]>

type PanoramaGalleryProps = {
    node: Node
    onSelect: (url: string) => void
}

const panoramasByNetworkNumber = panoramaManifest as PanoramaMap

const PanoramaGallery = ({
    node,
    onSelect,
}: PanoramaGalleryProps) => {
    const networkNumber = String(node.network_number)

    const panoramaUrls = panoramasByNetworkNumber[networkNumber] ?? []

    if (panoramaUrls.length === 0) {
        return null
    }

    console.log('networkNumber:', networkNumber)
    console.log('panoramaUrls: ', panoramaUrls)

    return (
        <section className="border-t px-4 py-3">
            <p className="mb-2 text-xs text-gray-400">Panoramas</p>

            <div className="flex gap-2 overflow-x-auto">
                {panoramaUrls.map((url, index) => (
                    <button
                        className="shrink-0 overflow-hidden rounded border"
                        key={url}
                        type="button"
                        onClick={() => onSelect(url)}
                        aria-label={`Open panorama ${index + 1}`}
                    >
                        <img className="h-20 w-28 object-cover" src={url} alt={`Panorama ${index + 1} for node ${node.network_number}`}/>

                    </button>
                ))}
            </div>
        </section>
    )
}

export default PanoramaGallery