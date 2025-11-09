"use client"

import Image from "next/image";

export default function OutfitSelectorCard({ outfit, selectedOutfit, setSelectedOutfit }:any) {


  return (
    <figure
      key={outfit.slug}
      className={`
        border shrink-0 hover:cursor-pointer rounded-sm
        ${selectedOutfit === outfit.slug && "border-solid border-[#b47005] border-2"}
      `}
      onClick={ () => {
        setSelectedOutfit(outfit.slug);
      } }
    >
      <div className="overflow-hidden">
        {/*<Image*/}
        {/*  src={outfit.thumbnail}*/}
        {/*  alt={outfit.description}*/}
        {/*  className="aspect-[3/4] h-fit w-fit object-cover"*/}
        {/*  width={100}*/}
        {/*  height={150}*/}
        {/*/>*/}
      </div>
      <figcaption className="flex justify-center text-muted-foreground p-2 text-xs">
        <span className=" text-foreground font-semibold">
          {outfit.label}
        </span>
      </figcaption>
    </figure>
  )
}