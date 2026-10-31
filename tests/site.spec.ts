import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
});
test("catálogo, detalhes acessíveis e filtros", async ({ page }) => {
  await expect(page.locator(".pool-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Compactas", exact: true }).click();
  await expect(page.locator(".pool-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Ver detalhes", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Piscina Compact Urban" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Ver detalhes", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Todas", exact: true }).click();
  await expect(page.locator(".pool-card")).toHaveCount(12);
});
test("simulador muda a prévia e prepara preferências sem fingir envio", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Orgânico", exact: true }).click();
  await page.getByRole("button", { name: "Tropical", exact: true }).click();
  await page.getByRole("button", { name: "Cascata", exact: true }).click();
  await expect(page.locator(".sim-preview img")).toHaveAttribute(
    "src",
    /pool-10/,
  );
  await page
    .getByRole("button", { name: "Conversar sobre minha ideia" })
    .click();
  await expect(page.locator(".message-preview textarea")).toHaveValue(
    /formato Orgânico; estilo Tropical/,
  );
  await expect(page.getByRole("status")).toContainText("configuração");
});
test("formulário valida e prepara mensagem completa", async ({ page }) => {
  await page.getByLabel("Seu nome", { exact: true }).fill("Maria Silva");
  await page.getByLabel("Telefone com DDD").fill("11999990000");
  await page.getByLabel("Cidade", { exact: true }).fill("São Paulo");
  await page.getByLabel("Tipo de projeto").selectOption("Nova piscina");
  await page
    .getByLabel("Sua ideia", { exact: true })
    .fill("Quero uma piscina com prainha.");
  await page
    .getByRole("button", { name: "Preparar mensagem para WhatsApp" })
    .click();
  await expect(page.locator(".message-preview textarea")).toHaveValue(
    /Maria Silva[\s\S]*São Paulo[\s\S]*Nova piscina[\s\S]*prainha/,
  );
});
test("galeria, FAQ e navegação", async ({ page }) => {
  await page.locator(".gallery-item").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Próxima imagem" }).click();
  await expect(page.locator(".lightbox>p")).toContainText("Compact Urban");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Quanto custa uma piscina de vinil?" })
    .click();
  await expect(page.locator("#answer-2")).toContainText("orçamento individual");
  const ids = await page
    .locator("header nav a")
    .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).hash.slice(1)));
  for (const id of ids) await expect(page.locator(`#${id}`)).toHaveCount(1);
});
test("layout sem overflow, imagens carregadas e console limpo", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.reload();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.locator("#piscinas").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await expect
    .poll(() =>
      page
        .locator(".pool-card img")
        .evaluateAll((imgs) =>
          imgs.every(
            (i) =>
              (i as HTMLImageElement).complete &&
              (i as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});
test("menu mobile et focus", async ({ page, isMobile }) => {
  if (!isMobile) {
    test.skip();
    return;
  }
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: /Piscinas/ })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/#piscinas/);
});
test("abertura pode ser pulada e não se repete na sessão", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => sessionStorage.removeItem("pv-intro"));
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Pular abertura" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pular abertura" }).click();
  await expect(page.locator(".intro")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".intro")).toHaveCount(0);
  await page.locator(".timeline").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
});
