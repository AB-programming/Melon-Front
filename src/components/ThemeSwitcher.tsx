'use client';

import { Switch } from "@heroui/react";
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from "@heroui/shared-icons";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Switch
        defaultSelected={theme === 'dark'}
        size="lg"
        color="secondary"
        startContent={<SunIcon />}
        endContent={<MoonIcon />}
        onValueChange={(isSelected) => setTheme(isSelected ? 'dark' : 'light')}
      ></Switch>
    </div>
  );
}
