import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

type MapPosition = [number, number]

type FlyToOptions = {
    center: MapPosition
    zoom: number
}

interface MapState {
    center: MapPosition
    zoom: number
    nodeLimit: number
    isMapReady: boolean
}

const initialState: MapState = {
    center: [-73.9595798, 40.72],
    zoom: 11,
    nodeLimit: 1000,
    isMapReady: false,
}

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setCenter(state, action: PayloadAction<MapPosition>) {
            state.center = action.payload
        },

        setZoom(state, action: PayloadAction<number>) {
            state.zoom = action.payload
        },

        flyTo(state, action: PayloadAction<FlyToOptions>) {
            state.center = action.payload.center
            state.zoom = action.payload.zoom
        },

        setNodeLimit(state, action: PayloadAction<number>) {
            state.nodeLimit = action.payload
        },

        setMapReady(state, action: PayloadAction<boolean>) {
            state.isMapReady = action.payload
        },
    },
})

export const {
    setCenter,
    setZoom,
    flyTo,
    setNodeLimit,
    setMapReady,
} = mapSlice.actions

export const selectMap = (state: RootState) => state.map

export default mapSlice.reducer