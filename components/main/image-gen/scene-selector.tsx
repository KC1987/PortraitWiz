"use client"


import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { scenes } from "@/lib/scenes";

import SceneSelectorCard from "@/components/main/image-gen/selector-cards/scene-selector-card";



export default function SceneSelector({ industry, setScene, selectedScene, setSelectedScene }:any) {


  const curatedScenes = scenes.filter(scene => scene.categories.includes(industry))

  return (
    <section>
      <ScrollArea className="w-full rounded-md border whitespace-nowrap" >
      <h1 className="text-xl font-semibold ml-4 mt-2" >Select your scene</h1>
        <div className="flex w-max space-x-4 p-4" >
          {curatedScenes.map( scene => (
            <SceneSelectorCard scene={scene} setScene={setScene} selectedScene={selectedScene} setSelectedScene={setSelectedScene} key={scene.slug} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}