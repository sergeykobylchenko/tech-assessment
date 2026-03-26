import defaultPlan from '@/assets/default_plan.png';

type CanvasImageProps = {
  plan?: string;
} 

export function CanvasImage({ plan }: CanvasImageProps) {
  return (
    <img
      src={plan || defaultPlan}
      alt="Canvas"
      className="h-full w-full object-contain"
      draggable={false}
    />
  );
}
