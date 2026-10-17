import { createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Sector } from '../../types/models'

export const fetchSectors = createAsyncThunk('sectors/fetchSectors', async () => {
    const response = await fetch('/api/sectors')
    
    if (!response.ok) {
        throw new Error(`Sectors request failed: ${response.status}`)
    }
       
       return response.json()
    },
)

export interface SectorFilters {
    omni: boolean,
    wide: boolean,
    narrow: boolean,
}

interface SectorState {
    data: Sector[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
    filters: SectorFilters
}

const initialState: SectorState = {
    data: [],
    status: 'idle',
    error: null,
    filters: { omni: true, wide: true, narrow: true }
}

const sectorSlice = createSlice({
    name: 'sectors',
    initialState,
    reducers: {
        toggleSectorFilter: (state, action: PayloadAction<keyof SectorFilters>) => {
            state.filters[action.payload] = !state.filters[action.payload]
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSectors.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchSectors.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload;
            })
            .addCase(fetchSectors.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? null
            })
    },
})

export const { toggleSectorFilter } = sectorSlice.actions
export const selectSectors = (state: RootState) => state.sectors.data
export const selectSectorFilters = (state: RootState) => state.sectors.filters

export default sectorSlice.reducer