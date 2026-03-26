import defaultPlan from '@/assets/default_plan.png';

type CanvasImageProps = {
  plan?: string;
  ref: React.RefObject<HTMLImageElement | null>;
  onLoad?: () => void;
}

export function CanvasImage({ plan, ref, onLoad }: CanvasImageProps) {
  return (
    <img
      src={plan || defaultPlan}
      alt="Canvas"
      className="h-full w-full object-contain"
      draggable={false}
      ref={ref}
      onLoad={onLoad}
    />
  );
}
