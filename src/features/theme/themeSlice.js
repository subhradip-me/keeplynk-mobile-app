import { createSlice } from '@reduxjs/toolkit';
import { LightTheme, DarkTheme } from '../../constants/theme';

const initialState = {
  mode: 'light', // 'light' or 'dark'
  colors: LightTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.colors = state.mode === 'light' ? LightTheme : DarkTheme;
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      state.colors = action.payload === 'light' ? LightTheme : DarkTheme;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
