import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Sector } from '../../types/models'

export const fetchSectors = createAsyncThunk('sectors/fetchSectors', async () => {
        const localData = await import('../../data/sectors.json')

        return localData.default
    },
)

interface SectorState {
    data: Sector[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

const initialState: SectorState = {
    data: [],
    status: 'idle',
    error: null,
}

const sectorSlice = createSlice({
    name: 'sectors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSectors.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchSectors.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload.results
            })
            .addCase(fetchSectors.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? null
            })
    },
})

export const selectSectors = (state: RootState) => state.sectors.data

export default sectorSlice.reducer