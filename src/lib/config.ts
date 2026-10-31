export const config = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5514998809231",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  address: process.env.NEXT_PUBLIC_ADDRESS || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
  video: process.env.NEXT_PUBLIC_POOL_VIDEO_URL || "",
};
export function whatsappUrl(message: string) {
  const number = config.whatsapp.replace(/\D/g, "");
  return number.length >= 10 && number.length <= 15
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : null;
}
