import { createSlice } from "@reduxjs/toolkit"

const fliterSlice = createSlice({
  name: "filter",
  initialState: "",
  reducers: {
    setFilter(state, action) {
      return action.payload
    }
  }
})

export const { setFilter } = fliterSlice.actions

export default fliterSlice.reducer