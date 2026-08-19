import type { Node } from '../../../types/models'

type NodeDetailsProps = {
    node: Node
}

type DetailRowProps = {
    label: string
    value: string | number | null | undefined
}

const DetailRow = ({ label, value }: DetailRowProps) => {
    if (value == null) {
        return null
    }

    return (
        <div className="flex gap-2 border-b border-gray-50 py-1 text-sm">
            <span className="w-28 shrink-0 text-gray-400">{label}</span>

            <span className="wrap-break-word text-gray-800">
                {String(value)}
            </span>
        </div>
    )
}

const NodeDetails = ({ node }: NodeDetailsProps) => {
    return (
        <section className="px-4 pb-4 pt-2">
            <DetailRow label="Network #" value={node.network_number} />
            <DetailRow label="Latitude" value={node.latitude?.toFixed(6)} />
            <DetailRow label="Longitude" value={node.longitude?.toFixed(6)} />
            <DetailRow label="Altitude" value={node.altitude != null ? `${node.altitude} m` : null} />
            <DetailRow label="Installed" value={node.install_date} />
            <DetailRow label="Abandoned" value={node.abandon_date} />
            <DetailRow label="Placement" value={node.placement} />

            {node.notes && (
                <div className="mt-3">
                    <p className="mb-1 text-xs text-gray-400">Notes</p>

                    <p className="whitespace-pre-wrap rounded bg-gray-50 p-2 text-sm text-gray-700">
                        {node.notes}
                    </p>
                </div>
            )}
        </section>
    )
}

export default NodeDetails