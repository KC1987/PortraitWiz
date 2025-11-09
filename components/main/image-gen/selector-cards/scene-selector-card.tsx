"use client"

import Image from "next/image";

export default function SceneSelectorCard({ scene, setScene, setSelectedScene, selectedScene }:any) {


  return (
    <figure
      key={scene.slug}
      className={`
        border shrink-0 hover:cursor-pointer rounded-sm
        ${selectedScene === scene.slug && "border-solid border-[#b47005] border-2"}
      `}
      onClick={ () => {
        setScene(scene.slug);
        setSelectedScene(scene.slug);
      } }
    >
      <div className="overflow-hidden">
        <Image
          src={scene.thumbnail}
          alt={scene.description}
          className="aspect-[3/4] h-fit w-fit object-cover"
          width={100}
          height={150}
        />
      </div>
      <figcaption className="flex justify-center text-muted-foreground p-2 text-xs">
        <span className=" text-foreground font-semibold">
          {scene.label}
        </span>
      </figcaption>
    </figure>
  )
}