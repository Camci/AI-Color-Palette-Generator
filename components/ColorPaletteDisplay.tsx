
import React from 'react';
import { Palette } from '../types';
import ColorSwatch from './ColorSwatch';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface ColorPaletteDisplayProps {
  palette: Palette;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ColorPaletteDisplay: React.FC<ColorPaletteDisplayProps> = ({ palette }) => {
  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 rounded-lg overflow-hidden shadow-2xl border border-gray-700"
      >
        {palette.map((color, index) => (
          <ColorSwatch key={`${color.hex}-${index}`} color={color} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default ColorPaletteDisplay;