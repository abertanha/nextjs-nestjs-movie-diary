'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundSetterProps {
  images: string[];
}

export default function BackgroundSetter({images}: BackgroundSetterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const efeitoOpacidade = () => {
    setIsVisible(true);
  }

  useEffect(() => {
    const selectedImage = images[Math.floor(Math.random() * images.length)];
    setCurrentImage(selectedImage);

    // Timer para começar o blur depois de 3,5s
    const blurTimeout = setTimeout(() => {
      setIsBlurred(true);

      // Depois de 1s de blur (total = 4,5s), dispara evento
      const endAnimationTimeout = setTimeout(() => {
        window.dispatchEvent(new Event('backgroundAnimationFinished'));
      }, 1000); // 1s de blur

      // Limpeza do timeout do evento
      return () => clearTimeout(endAnimationTimeout);

    }, 3500); // 3,5s de fade-in

    // Limpeza do timeout de blur
    return () => clearTimeout(blurTimeout);
  },[images]);
  
  return (
      <div className={`
          transition-opacity ease-in-out
          duration-[3500ms]
          fixed inset-0 z-[-1]
          bg-cover bg-center bg-no-repeat
          ${isVisible ? 'opacity-100' : 'opacity-0'} 
          `}
          style={currentImage ? { backgroundImage: `url(${currentImage})`}: {}}
      >
        
        {currentImage && <Image
          src={currentImage}
          alt={'Cena de filme aleatoria'}
          fill
          className='invisible'
          onLoad={efeitoOpacidade}
        />}
        <div className={`
          absolute inset-0
          bg-cover bg-center bg-no-repeat
          ${isBlurred ? 'blur-md' : 'blur-none'}
          `}
          style={{
            backgroundImage: currentImage ? `url(${currentImage})` : undefined,
            transition: 'filter 1s ease-in-out', 
          }}
        />
      </div>
  );
}