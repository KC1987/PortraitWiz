"use client"





import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Input} from "@/components/ui/input";

export default function Page() {

  const [ name, setName ] = useState("");

  async function onCreateModel() {
    try {
      const response = await fetch("/api/lora/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create model");
      }

      console.log("Model created successfully");
      console.log("Model data:", data);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Something went wrong");
      console.error(error);
    }

  }

  return (
    <div>
      <Input value={name} onChange={ (e) => setName(e.target.value)} placeholder="Model name..." />
      <Button onClick={onCreateModel} >Create Model</Button>
    </div>
  )
}