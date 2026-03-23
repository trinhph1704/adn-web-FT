import Image from "next/image";

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function Logo({
  width = 240,
  height = 240,
  className = "",
}: LogoProps) {
  return (
    <Image
      src="/logoDNA3.png"
      alt="ADN Huyết Thống Logo"
      width={typeof width === "number" ? width : 240}
      height={typeof height === "number" ? height : 240}
      className={className}
      style={{ objectFit: "contain" }}
      draggable={false}
    />
  );
}
