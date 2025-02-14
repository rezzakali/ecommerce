'use client';

import Image, { ImageProps } from 'next/image';

interface CustomImageProps extends Omit<ImageProps, 'loader'> {
  customLoader?: (src: string, width: number, quality?: number) => string;
}

export const defaultLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export default function ImageComponent({
  src,
  alt,
  fill = false,
  quality = 75,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  blurDataURL = 'https://placehold.co/600x400/000000/FFFFFF/png',
  ...props
}: CustomImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      quality={quality}
      priority={priority}
      sizes={sizes}
      blurDataURL={blurDataURL}
      className={`rounded-md transition-transform duration-300 ease-in-out group-hover:scale-110 object-contain ${className}`}
      loader={defaultLoader}
      {...props}
    />
  );
}
