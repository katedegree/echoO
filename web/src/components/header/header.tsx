import Image from "next/image";

export function Header() {
  return (
    <div>
      <div className="h-[120px]" />
      <div className="fixed top-0 inset-x-0 z-30 h-[100px] bg-linear-to-b from-(--color-bg-base) to-transparent flex items-center justify-start">
        <Image
          className="w-[160px] h-auto pl-md"
          src="/logo-dark.png"
          alt="logo"
          width={120}
          height={62}
        />
      </div>
    </div>
  );
}
