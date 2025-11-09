export interface StatCardProps {
  number: string;
  text: string;
}

export function StatCard({ number, text }: StatCardProps) {
  return (
    <div className="border-2 border-[#A8B2C1] rounded-lg p-6 flex flex-col gap-2">
      <div className="text-5xl font-bold text-[#A8B2C1]">{number}</div>
      <div className="text-sm text-[#A0A5B8]">{text}</div>
    </div>
  );
}