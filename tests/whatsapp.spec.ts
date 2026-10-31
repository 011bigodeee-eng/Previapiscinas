import { test, expect } from "@playwright/test";
import { config, whatsappUrl } from "../src/lib/config";
test("WhatsApp usa número configurado e codifica a mensagem", () => {
  const prior = config.whatsapp;
  try {
    config.whatsapp = "";
    expect(whatsappUrl("Olá")).toBeNull();
    config.whatsapp = "+55 (11) 99999-0000";
    const message = "Olá! Piscina com prainha & iluminação.";
    const url = new URL(whatsappUrl(message)!);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/5511999990000");
    expect(url.searchParams.get("text")).toBe(message);
  } finally {
    config.whatsapp = prior;
  }
});
