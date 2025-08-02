import Image from "next/image";
import { Button } from "../ui/button";

export default function EmptyState({
  image,
  imageAlt,
  description,
  btnIcon,
  btnText,
  onClick,
  title,
}: {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  btnIcon?: any;
  btnText: string;
  onClick: () => void;
}) {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Image src={image} height={200} width={400} objectFit="contain" alt={imageAlt} />

      <h2 className="text-2xl font-bold text-center">{title}</h2>
      <p className="text-muted-foreground mb-2 text-center">{description}</p>
      <Button onClick={() => onClick()} className="mt-2">
        {btnIcon}
        {btnText}
      </Button>
    </div>
  );
}
