import { ImageWithFallback } from './figma/ImageWithFallback';

interface ServiceCardProps {
  image: string;
  title: string;
}

export function ServiceCard({ image, title }: ServiceCardProps) {
  return (
    <div className="bg-[#1A1F2E] rounded-2xl p-10 flex flex-col gap-6">
      <div className="w-full h-[200px] relative rounded-lg overflow-hidden">
        <ImageWithFallback 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="h-[1px] bg-[#2A2F3E]"></div>
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
    </div>
  );
}
