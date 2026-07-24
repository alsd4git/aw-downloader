"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

/*
 * `asChild` è escluso di proposito: farebbe usare a Button uno Slot, che
 * accetta un solo figlio, mentre qui ne servono due (maschera + contenuto).
 */
type ShineButtonProps = Omit<React.ComponentProps<typeof Button>, "asChild">;

/**
 * Bottone con un bagliore che scorre lungo il bordo al passaggio del mouse.
 *
 * L'anello è ottenuto mascherando un quadrato rotante: l'animazione agisce
 * solo su `transform`, quindi gira sul compositor senza ridisegnare il
 * gradiente a ogni frame.
 */
export function ShineButton({ className, children, ...props }: ShineButtonProps) {
  return (
    <Button className={cn("shine-button", className)} {...props}>
      <span aria-hidden className="shine-button__mask">
        <span className="shine-button__glow" />
      </span>
      {children}
    </Button>
  );
}
