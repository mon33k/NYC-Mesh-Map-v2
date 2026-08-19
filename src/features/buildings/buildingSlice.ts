import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type Building = {
    id: string
}

type BuildingsFile = {
    results: Building[]
}

type BuildingsState = {
    data: Building[]
}

// Load buildings.json and store its results in Redux.
export const fetchBuildings = createAsyncThunk('buildings/fetchBuildings',
    async (): Promise<BuildingsFile> => {
        const buildingsFile = await import('../../data/buildings.json')
        return buildingsFile.default
    },
)

const initialState: BuildingsState = {
    data: [],
}

const buildingSlice = createSlice({
    name: 'buildings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchBuildings.fulfilled, (state, action) => {
            state.data = action.payload.results
        })
    },
})

export default buildingSlice.reducer