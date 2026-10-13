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
    type: "all",
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

    setNodeTypeFilter(state, action: PayloadAction<string>) {
      console.log("Selected type:", action.payload);
      console.log("Previous type:", state.legendFilters.type);

      state.legendFilters.type = action.payload;

      console.log("Updated type:", state.legendFilters.type);
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
  setNodeTypeFilter,
  toggleActive,
  toggleInactive,
} = nodeSlice.actions;

export default nodeSlice.reducer;
