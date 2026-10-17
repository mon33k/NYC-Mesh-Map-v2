import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { Node, NodeLegendFilters } from "../../types/models";
import type { RootState } from "../../app/store";

export const fetchNodes = createAsyncThunk("nodes/fetchNodes", async () => {
  const response = await fetch("/api/nodes");
  return response.json();
});

interface NodeState {
  data: Node[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  legendFilters: NodeLegendFilters;
}

const initialState: NodeState = {
  data: [],
  status: "idle",
  error: null,
  legendFilters: {
    types: [],
    active: true,
    inactive: true,
  },
};

const nodeSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    setNodes(state, action: PayloadAction<Node[]>) {
      state.data = action.payload;
      state.status = "succeeded";
    },
    clearNodes(state) {
      state.data = [];
      state.status = "idle";
    },

    toggleNodeType(state, action: PayloadAction<string>) {
      const clickedType = action.payload
      const selectedTypes = state.legendFilters.types

      if (selectedTypes.includes(clickedType)) {
        state.legendFilters.types = selectedTypes.filter((type) => type !== clickedType)
      } else {
        selectedTypes.push(clickedType)
      }
    },
    clearNodeTypes(state) {
        state.legendFilters.types = []
    },  
    
    toggleActive(state) {
      state.legendFilters.active = !state.legendFilters.active;
    },
    toggleInactive(state) {
      state.legendFilters.inactive = !state.legendFilters.inactive;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNodes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchNodes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const selectNodes = (state: RootState) => state.nodes.data;
export const selectNodeStatus = (state: RootState) => state.nodes.status;
export const selectNodeLegendFilters = (state: RootState) =>
  state.nodes.legendFilters;
export const {
  setNodes,
  clearNodes,
  clearNodeTypes,
  toggleNodeType,
  toggleActive,
  toggleInactive,
} = nodeSlice.actions;

export default nodeSlice.reducer;
