import React from 'react';
import { useColorMode, useThemeConfig } from '@docusaurus/theme-common';
import ColorModeToggle from '@theme/ColorModeToggle';
import styles from './styles.module.css';
import { splitNavbarItems, useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';


export default function NavbarColorModeToggle({ className }) {
  const navbarStyle = useThemeConfig().navbar.style;
  const disabled = useThemeConfig().colorMode.disableSwitch;
  const { colorMode, setColorMode } = useColorMode();
  if (disabled) {
    return null;
  }

  const { shouldRender } = useNavbarMobileSidebar();
  return (
    <div className="get-app-wrapper">
   
      <ColorModeToggle
        className={className}
        buttonClassName={navbarStyle === 'dark' ? styles.darkNavbarColorModeToggle : undefined}
        value={colorMode}
        onChange={setColorMode}
      />
    </div>
  );
}

