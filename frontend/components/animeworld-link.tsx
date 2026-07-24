"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";

/**
 * Estrae l'identificatore AnimeWorld da un URL completo incollato dall'utente.
 * Es: "https://www.animeworld.ac/play/one-piece.ab123/episodio-1" -> "one-piece.ab123"
 */
export function stripAnimeworldIdentifier(value: string): string {
  let identifier = value.trim();

  // Controlla se contiene /play/
  if (identifier.includes("/play/")) {
    const parts = identifier.split("/play/");
    identifier = parts[parts.length - 1];
  }

  // Rimuove eventuali protocolli e domini rimasti
  identifier = identifier.replace(/^https?:\/\/[^/]+\/?/, "");

  // Estrae solo la parte che finisce con .xxxxx (punto + n caratteri alfanumerici)
  // e rimuove tutto quello che viene dopo (es: /episodio-1)
  const match = identifier.match(/^([^/]+\.[^/]+)/);
  if (match) {
    return match[1];
  }

  // Se non trova il pattern, tiene solo la parte prima del primo slash
  return identifier.split("/")[0];
}

interface AnimeworldLinkProps {
  id?: string;
  value: string;
  /** URL base di AnimeWorld, usato per comporre e aprire il link completo */
  baseUrl?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Riceve l'identificatore già ripulito dall'URL completo */
  onChange: (identifier: string) => void;
}

/**
 * Input per l'identificatore AnimeWorld: se viene incollato un URL completo
 * estrae automaticamente il solo identificatore e mostra il link risultante.
 */
export function AnimeworldLink({
  id,
  value,
  baseUrl,
  placeholder = "es: one-piece.12345",
  disabled,
  onChange,
}: AnimeworldLinkProps) {
  const fullUrl = value && baseUrl ? `${baseUrl}/play/${value}` : "";

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(stripAnimeworldIdentifier(e.target.value))}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 font-mono text-sm"
        />
        {fullUrl && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => window.open(fullUrl, "_blank")}
            title={`Apri ${fullUrl}`}
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
      </div>
      {fullUrl && (
        <p className="text-xs text-muted-foreground truncate">{fullUrl}</p>
      )}
    </div>
  );
}
