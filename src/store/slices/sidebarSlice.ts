import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}

const initialState: SidebarState = {
  isCollapsed: false,
  isMobileOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    },
    toggleMobileSidebar: (state, action: PayloadAction<boolean>) => {
      state.isMobileOpen = action.payload;
    },
  },
});

export const { toggleSidebar, toggleMobileSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
