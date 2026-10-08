'use client';

import Particles from './Particles';
import { useTheme } from './ThemeProvider';

const LIGHT_COLORS = ['#1A1A1A', '#A855F7', '#7C3AED'];
const DARK_COLORS = ['#F4F2ED', '#A855F7', '#C084FC'];

export default function ThemedBackground() {
  const { theme } = useTheme();

  return (
    <div className="micro-slats-bg">
      <Particles
        key={theme}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleColors={theme === 'dark' ? DARK_COLORS : LIGHT_COLORS}
        moveParticlesOnHover
        particleHoverFactor={1}
        alphaParticles
        particleBaseSize={100}
        sizeRandomness={1}
        cameraDistance={20}
      />
    </div>
  );
}
