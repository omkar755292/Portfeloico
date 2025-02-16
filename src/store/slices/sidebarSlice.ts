import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}

const initialState: SidebarState = {
  isCollapsed: false,
  isMobileOpen: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    }
  },
});

export const { toggleSidebar, toggleMobileSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;