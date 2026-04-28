import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../controllers/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
