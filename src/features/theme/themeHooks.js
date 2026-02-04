import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from './themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { mode, colors } = useSelector((state) => state.theme);

  const toggle = () => dispatch(toggleTheme());
  const setMode = (newMode) => dispatch(setTheme(newMode));

  return {
    mode,
    colors,
    isDark: mode === 'dark',
    toggle,
    setMode,
  };
};
