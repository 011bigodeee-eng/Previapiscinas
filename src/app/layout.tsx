import type { Metadata } from "next";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "./globals.css";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Piscinas de Vinil | Seu paraíso particular",
  description:
    "Inspire-se em piscinas de vinil, explore possibilidades e personalize seu espaço de lazer. Arquitetura, água e novas formas de viver.",
  openGraph: {
    title: "Piscinas de Vinil — seu paraíso particular",
    description: "Arquitetura, água e novas formas de viver.",
    images: ["/images/pool-1-hq.webp"],
    locale: "pt_BR",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
