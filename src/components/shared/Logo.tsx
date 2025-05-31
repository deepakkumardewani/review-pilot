import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 transition-transform hover:scale-105"
    >
      <Image src="/assets/icon.png" alt="CreateFolio" width={32} height={32} />
      <div className="text-xl md:text-2xl font-bold text-black/90 dark:text-white bg-clip-text">
        CreateFolio
      </div>
    </Link>
  );
}
