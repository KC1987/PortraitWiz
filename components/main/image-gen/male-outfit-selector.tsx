"use client"

import { maleOutfits } from "@/lib/maleOutfits";

import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import SelectorCard from "@/components/main/image-gen/selector-cards/outfitSelectorCard";

export default function MaleOutfitSelector({ industry, selectedOutfit, setSelectedOutfit }:any) {

  const curatedMaleOutfits = maleOutfits.filter(outfit => outfit.categories.includes(industry))


  return (
    <section>
      <ScrollArea className="w-full rounded-md border whitespace-nowrap">
        <h1 className="text-xl font-semibold ml-4 mt-2" >Male outfits</h1>
        <div className="flex w-max space-x-4 p-4">
          {curatedMaleOutfits.map( outfit => (
            <SelectorCard outfit={outfit} selectedOutfit={selectedOutfit} setSelectedOutfit={setSelectedOutfit} key={outfit.slug} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}