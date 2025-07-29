
import React, { useState, useEffect } from 'react';
import { ColorInfo } from '../types';
import { CopyIcon, CheckIcon } from './Icons';
import { motion, Variants } from 'framer-motion';


// Utility to determine if a color is light or dark
const isColorLight = (hexColor: string): boolean => {
  const color = hexColor.charAt(0) === '#' ? hexColor.substring(1, 7) : hexColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

interface ColorSwatchProps {
  color: ColorInfo;
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
};

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color }) => {
  const [copied, setCopied] = useState(false);
  const textColor = isColorLight(color.hex) ? 'text-gray-800' : 'text-white';

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <motion.div
      variants={itemVariants}
      className="relative h-64 flex flex-col justify-end p-4 group cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-2"
      style={{ backgroundColor: color.hex }}
      onClick={handleCopy}
    >
      <div className={`relative z-10 ${textColor}`}>
        <p className="font-bold text-lg capitalize">{color.name}</p>
        <p className="font-mono uppercase">{color.hex}</p>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleCopy}
          className={`p-2 rounded-full transition-all duration-200 ${
            isColorLight(color.hex) ? 'bg-black/10 hover:bg-black/20' : 'bg-white/20 hover:bg-white/30'
          } ${textColor}`}
          aria-label="Copy color code"
        >
          {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
      {copied && (
        <div className={`absolute bottom-4 right-4 z-10 text-xs px-2 py-1 rounded ${textColor} ${isColorLight(color.hex) ? 'bg-black/10' : 'bg-white/20'}`}>
            Copied!
        </div>
      )}
    </motion.div>
  );
};

export default ColorSwatch;