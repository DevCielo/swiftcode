// src/pages/index.js or wherever your Home component resides
"use client";
import React from "react";
import Hero from "@/components/custom/Hero";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import useScrollPrevention from "@/hooks/useScrollPrevention";
import { ModeToggle } from "@/components/custom/ModeToggle";

export default function Home() {
  useScrollPrevention(250, 100);

  return (
    <div className="relative h-[120rem] overflow-hidden">
      <BackgroundBeams className="z-0" />

      <div className="relative z-10">
        <ModeToggle/>
        <Hero />
      </div>
    </div>
  );
}
