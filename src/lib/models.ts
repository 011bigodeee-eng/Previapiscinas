export const categories = [
  "Todas",
  "Retangulares",
  "Compactas",
  "Com prainha",
  "Com cascata",
  "Alto padrão",
];
export const models = [
  [
    "Retangular Elegance",
    "Retangulares",
    "Linhas puras. Possibilidades infinitas.",
    "Geometria elegante que valoriza a arquitetura e abre espaço para momentos de tranquilidade.",
  ],
  [
    "Infinity Blue",
    "Alto padrão",
    "O horizonte como parte do projeto.",
    "Uma inspiração de borda infinita, integrada à paisagem. Viabilidade sujeita à avaliação do terreno.",
  ],
  [
    "Tropical Paradise",
    "Alto padrão",
    "Seu refúgio em meio ao verde.",
    "Uma composição que aproxima água, vegetação e materiais naturais.",
  ],
  [
    "Compact Urban",
    "Compactas",
    "Grandes momentos em pequenos espaços.",
    "Uma proposta para repensar o lazer em pátios e áreas urbanas.",
  ],
  [
    "Premium Resort",
    "Alto padrão",
    "A sensação de estar sempre de férias.",
    "Amplitude visual e espaços de convivência em uma inspiração de resort.",
  ],
  [
    "Família Cristal",
    "Retangulares",
    "O cenário dos seus melhores encontros.",
    "Uma proposta acolhedora para integrar a piscina à área de convivência.",
  ],
  [
    "Moderna com Prainha",
    "Com prainha",
    "Um convite para desacelerar.",
    "Uma área rasa de contemplação integrada ao desenho da piscina.",
  ],
  [
    "Cascata Natural",
    "Com cascata",
    "O som da água. A calma da natureza.",
    "Pedras e água em movimento criam uma atmosfera de refúgio.",
  ],
  [
    "Noturna Luxury",
    "Alto padrão",
    "Outra luz. A mesma vontade de ficar.",
    "Uma inspiração de iluminação para transformar a experiência ao anoitecer.",
  ],
  [
    "Orgânica Tropical",
    "Alto padrão",
    "A natureza não desenha em linha reta.",
    "Curvas suaves e paisagismo para uma composição integrada.",
  ],
  [
    "Minimalista White",
    "Retangulares",
    "O essencial em sua melhor forma.",
    "Tons claros e linhas simples deixam a água assumir o protagonismo.",
  ],
  [
    "Panorâmica Infinity",
    "Alto padrão",
    "Uma nova perspectiva para viver.",
    "Uma composição panorâmica que enquadra a paisagem e o horizonte.",
  ],
].map((m, i) => ({
  id: i,
  name: `Piscina ${m[0]}`,
  category: m[1],
  tagline: m[2],
  description: m[3],
  image: `/images/pool-${i + 1}.webp`,
}));
