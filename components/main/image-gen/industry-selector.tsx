"use client"

import { industries } from "@/lib/industries";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";


export default function IndustrySelector ({ industry, setIndustry, setSelectedScene, setSelectedOutfit }:any) {

  const selectedIndustry = industries.find( ind => ind.slug === industry ).label;

  return (
    <section className="flex gap-2 items-center" >
      <h1 className="font-semibold text-xl" >Select your industry</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild >
          <Button className="w-36" variant="outline" >{selectedIndustry}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" >
          { industries.map( industry => (
            <DropdownMenuItem
              key={industry.slug}
              onSelect={ () => {
                setIndustry(industry.slug);
                setSelectedScene("formal");
                setSelectedOutfit("default");
              } }
            >
              {industry.label}
            </DropdownMenuItem>
          )) }
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  )
}