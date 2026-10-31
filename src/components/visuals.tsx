import Image from "next/image";
import { Waves, ArrowUpRight } from "lucide-react";
export function PoolImage({
  id,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 760px) 100vw, 60vw",
}: {
  id: number;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={`/images/pool-${id}-hq.webp`}
      alt={alt}
      fill
      sizes={sizes}
      quality={90}
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
