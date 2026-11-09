import Image from "next/image";

type AvatarProps = {
  /** Проверенный путь к фото или null — тогда плейсхолдер с инициалами. */
  src: string | null;
  alt: string;
  initials: string;
};

const box = "size-[120px] shrink-0 rounded-2xl md:size-40";

export function Avatar({ src, alt, initials }: AvatarProps) {
  if (!src) {
    return (
      <div role="img" aria-label={alt} className={`${box} flex items-center justify-center bg-placeholder`}>
        <span aria-hidden="true" className="font-display text-[32px] text-muted md:text-[40px]">
          {initials}
        </span>
      </div>
    );
  }

  return <Image src={src} alt={alt} width={160} height={160} unoptimized className={`${box} object-cover`} />;
}
