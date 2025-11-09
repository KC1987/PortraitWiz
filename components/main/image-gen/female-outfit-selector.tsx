"use client"

import { femaleOutfits } from "@/lib/femaleOutfits";

import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import SelectorCard from "@/components/main/image-gen/selector-cards/outfitSelectorCard";

export default function FemaleOutfitSelector({ industry, selectedOutfit, setSelectedOutfit }:any) {

  const curatedFemaleOutfits = femaleOutfits.filter(outfit => outfit.categories.includes(industry))


  return (
    <section>
      <ScrollArea className="w-full rounded-md border whitespace-nowrap">
        <h1 className="text-xl font-semibold ml-4 mt-2" >Female outfits</h1>
        <div className="flex w-max space-x-4 p-4">
          {curatedFemaleOutfits.map( outfit => (
            <SelectorCard outfit={outfit} selectedOutfit={selectedOutfit} setSelectedOutfit={setSelectedOutfit} key={outfit.slug} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}