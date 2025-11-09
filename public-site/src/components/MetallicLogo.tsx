import { useState, useEffect } from 'react';
import MetallicPaint, { parseLogoImage } from './MetallicPaint';

interface MetallicLogoProps {
  logoSrc: string;
  className?: string;
}

export function MetallicLogo({ logoSrc, className = '' }: MetallicLogoProps) {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogoImage() {
      try {
        setLoading(true);
        const response = await fetch(logoSrc);
        const blob = await response.blob();
        const file = new File([blob], "logo.png", { type: blob.type });

        const parsedData = await parseLogoImage(file);
        setImageData(parsedData?.imageData ?? null);
      } catch (err) {
        console.error("Error loading logo image:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLogoImage();
  }, [logoSrc]);

  if (loading || !imageData) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img src={logoSrc} alt="CarLab" className="h-full w-auto object-contain opacity-50" />
      </div>
    );
  }

  return (
    <div className={className}>
      <MetallicPaint 
        imageData={imageData} 
        params={{ 
          edge: 2, 
          patternBlur: 0.005, 
          patternScale: 2, 
          refraction: 0.015, 
          speed: 0.3, 
          liquid: 0.07 
        }} 
      />
    </div>
  );
}
