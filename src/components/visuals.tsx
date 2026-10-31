import Image from "next/image";
import { Waves, ArrowUpRight } from "lucide-react";
export function PoolImage({
  id,
  alt,
  className = "",
  priority = false,
}: {
  id: number;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/images/pool-${id}.webp`}
      alt={alt}
      fill
      sizes="(max-width: 700px) 100vw, 60vw"
      className={className}
      priority={priority}
    />
  );
}
export function Brand() {
  return (
    <span className="brand">
      <span className="brand-icon">
        <Waves size={29} strokeWidth={1.4} />
      </span>
      <span>
        PISCINAS<span className="brand-bottom">DE VINIL</span>
      </span>
    </span>
  );
}
