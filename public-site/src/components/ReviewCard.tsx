import { Star } from 'lucide-react';

interface ReviewCardProps {
  text: string;
  name: string;
  car: string;
}

export function ReviewCard({ text, name, car }: ReviewCardProps) {
  return (
    <div className="bg-[#1A1F2E] rounded-2xl p-8 flex flex-col gap-6 min-w-[350px]">
      <p className="text-[#A0A5B8] leading-relaxed">{text}</p>
      <div className="h-[1px] bg-[#2A2F3E]"></div>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold text-white">{name}</div>
        <div className="text-sm text-[#A0A5B8]">{car}</div>
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#A8B2C1] text-[#A8B2C1]" />
          ))}
        </div>
      </div>
    </div>
  );
}