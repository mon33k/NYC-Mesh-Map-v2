import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectNodes } from '../../nodes/nodeSlice'
import { setSelectedNode } from '../uiSlice'
import { flyTo } from '../../map/mapSlice'

type SearchResult = {
    id: string
    title: string
    subtitle: string
    select: () => void
}

export default function MapSearch() {
    const dispatch = useAppDispatch()
    const nodes = useAppSelector(selectNodes)
    const [searchText, setSearchText] = useState('')
    const [showResults, setShowResults] = useState(false)

    const searchResults = useMemo<SearchResult[]>(() => {
        // Remove whitespaces and make the search case insensitive
        const searchValue = searchText.trim().toLowerCase()

        // No results until the user has entered something
        if (!searchValue) {
            return []
        }

        return nodes
            .filter((node) => {
                const networkNumber = String(node.network_number)
                const nodeName = node.name?.toLowerCase() ?? ''

                // Match either the node number or the node name.
                return (
                    networkNumber.includes(searchValue) ||
                    nodeName.includes(searchValue)
                )
            }).slice(0, 8) // limit dropdown results
            .map((node) => ({
                id: node.id,
                title: `Node ${node.network_number}`,
                subtitle: `${node.type} · ${node.status}`,

                // selects the node and close then reset the search UI
                select: () => {
                    dispatch(setSelectedNode(node))
                    setSearchText('')
                    setShowResults(false)

                    dispatch(flyTo({
                        center: [
                            node.longitude,
                            node.latitude,
                        ],
                        zoom: 15,
                    }))
                },
            }))
    }, [dispatch, nodes, searchText])

    // bool for dropdown visibility
    const isDropdownOpen = showResults && searchText.trim().length > 0

    return (
        <div className={`absolute left-3 top-3 w-52 ${isDropdownOpen ? 'z-30' : 'z-20'} sm:left-4 sm:top-4 sm:w-72`} >
            <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow focus:border-blue-500 focus:outline-none sm:px-4 sm:py-3"
                type="search"
                value={searchText}
                placeholder="Search node, install, or address"
                onChange={(event) => {
                    setSearchText(event.target.value)
                    setShowResults(true)
                }}

                onFocus={() => setShowResults(true)}
            />

            {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10absolute left-0 top-full mt-1 w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10">
                    {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <button key={result.id} type="button" onClick={result.select} className="flex w-full flex-col px-3 py-2 text-left hover:bg-gray-50 sm:px-4 sm:py-3">
                                <span className="text-sm font-medium">{result.title}</span>
                                <span className="text-xs text-gray-500">
                                    {result.subtitle}
                                </span>
                            </button>
                        ))
                    ) : (
                        <p className="px-3 py-2 text-sm text-gray-500 sm:px-4 sm:py-3">
                            No matching nodes.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}