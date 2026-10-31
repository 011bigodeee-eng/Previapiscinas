"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Menu,
  X,
  Plus,
  Minus,
  Waves,
  Check,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { nav, services, faqs } from "@/lib/content";
import { PoolImage, Brand } from "@/components/visuals";
import { models, categories } from "@/lib/models";
import { config, whatsappUrl } from "@/lib/config";
type Model = (typeof models)[number];
export default function Home() {
  const [intro, setIntro] = useState(false),
    [sound, setSound] = useState(false),
    [menu, setMenu] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [category, setCategory] = useState("Todas"),
    [selected, setSelected] = useState<Model | null>(null),
    [gallery, setGallery] = useState<number | null>(null),
    [faq, setFaq] = useState<number | null>(0),
    [notice, setNotice] = useState(""),
    [formStatus, setFormStatus] = useState("");
  const [shape, setShape] = useState("Retangular"),
    [style, setStyle] = useState("Moderno"),
    [lining, setLining] = useState("Azul claro"),
    [extras, setExtras] = useState<string[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null),
    lastFocus = useRef<HTMLElement | null>(null);
  const simId =
    shape === "Orgânico"
      ? 10
      : shape === "Compacto"
        ? 4
        : style === "Tropical"
          ? 3
          : style === "Minimalista"
            ? 11
            : extras.includes("Cascata")
              ? 8
              : extras.includes("Prainha")
                ? 7
                : extras.includes("Iluminação")
                  ? 9
                  : 1;
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("pv-intro");
      sessionStorage.setItem("pv-intro", "1");
    } catch {}
    if (!seen && !reduced) {
      setIntro(true);
      const timer = setTimeout(() => setIntro(false), 3600);
      return () => clearTimeout(timer);
    }
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 35);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let context: { revert: () => void } | undefined;
    let cancelled = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        context = gsap.context(() => {
          gsap.from(".hero-content>*", {
            y: 22,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            delay: 0.15,
          });
          gsap.to(".hero-image", {
            yPercent: 18,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.utils
            .toArray<HTMLElement>(".reveal")
            .forEach((el) =>
              gsap.from(el, {
                y: 34,
                opacity: 0,
                duration: 0.9,
                scrollTrigger: { trigger: el, start: "top 94%", once: true },
              }),
            );
          gsap.from(".timeline", {
            "--progress": "0%",
            duration: 1.8,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: ".timeline",
              start: "top 85%",
              once: true,
            },
          });
          gsap.to(".diagonal-one", {
            y: -65,
            rotate: -3,
            ease: "none",
            scrollTrigger: {
              trigger: ".details",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
          gsap.to(".diagonal-two", {
            y: 65,
            rotate: 3,
            ease: "none",
            scrollTrigger: {
              trigger: ".details",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
          gsap.fromTo(
            ".film-frame",
            { width: "84%", borderRadius: 20 },
            {
              width: "100%",
              borderRadius: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".film",
                start: "top 80%",
                end: "center center",
                scrub: true,
              },
            },
          );
        });
      },
    );
    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);
  useEffect(() => {
    if (!selected && gallery === null && !menu) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => closeRef.current?.focus(), 0);
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        setGallery(null);
        setMenu(false);
      }
      if (e.key === "Tab") {
        const modal = document.querySelector('[aria-modal="true"]');
        const nodes = modal?.querySelectorAll<HTMLElement>(
          "button,a,input,select,textarea",
        );
        if (nodes?.length) {
          const first = nodes[0],
            last = nodes[nodes.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prior;
      document.removeEventListener("keydown", handler);
      lastFocus.current?.focus();
    };
  }, [selected, gallery, menu]);
  function send(message: string) {
    const url = whatsappUrl(message);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      setNotice("Mensagem preparada. Continue o envio no WhatsApp.");
    } else {
      setNotice(
        "O contato da empresa ainda está em configuração. Você pode copiar sua mensagem abaixo.",
      );
      setFormStatus(message);
      document
        .getElementById("contato")
        ?.scrollIntoView({ behavior: "smooth" });
      setSelected(null);
    }
  }
  function playSound() {
    if (sound) {
      setSound(false);
      return;
    }
    setSound(true);
    try {
      const ctx = new AudioContext();
      [220, 330, 440].forEach((freq, i) => {
        const o = ctx.createOscillator(),
          g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(
          freq * 1.5,
          ctx.currentTime + 1.2,
        );
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.15 + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 1.6);
      });
      setTimeout(() => {
        void ctx.close();
        setSound(false);
      }, 1800);
    } catch {
      setSound(false);
    }
  }
  const quote = (name = "uma piscina de vinil") =>
    send(
      `Olá! Gostaria de conversar sobre ${name}. Podemos avaliar as possibilidades para o meu espaço?`,
    );
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      {intro && (
        <div className="intro">
          <div className="intro-orb" />
          <div className="intro-rings" />
          <div className="intro-name">
            PISCINAS <span>DE VINIL</span>
            <small>UM NOVO JEITO DE VIVER A ÁGUA.</small>
          </div>
          <button className="intro-skip" onClick={() => setIntro(false)}>
            Pular abertura <ArrowRight size={15} />
          </button>
          <button
            className="intro-audio"
            onClick={playSound}
            aria-label="Ativar assinatura sonora"
          >
            {sound ? <Volume2 /> : <VolumeX />}
          </button>
        </div>
      )}
      <header className={scrolled ? "header solid" : "header"}>
        <a href="#inicio" aria-label="Piscinas de Vinil — início">
          <Brand />
        </a>
        <nav aria-label="Navegação principal">
          {nav.slice(1, 6).map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#contato" className="header-cta">
          Vamos conversar <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-toggle"
          aria-label="Abrir menu"
          onClick={() => setMenu(true)}
        >
          <Menu />
        </button>
      </header>
      {menu && (
        <div
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          <Brand />
          <button
            ref={closeRef}
            className="menu-close"
            onClick={() => setMenu(false)}
            aria-label="Fechar menu"
          >
            <X />
          </button>
          {nav.map(([label, id], i) => (
            <a onClick={() => setMenu(false)} key={id} href={`#${id}`}>
              <small>0{i + 1}</small>
              {label}
              <ArrowUpRight />
            </a>
          ))}
        </div>
      )}
      <main id="conteudo">
        <section
          className="hero"
          id="inicio"
          onPointerMove={(e) => {
            if (
              e.pointerType !== "mouse" ||
              matchMedia("(prefers-reduced-motion: reduce)").matches
            )
              return;
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty(
              "--water-x",
              `${e.clientX - r.left}px`,
            );
            e.currentTarget.style.setProperty(
              "--water-y",
              `${e.clientY - r.top}px`,
            );
          }}
        >
          <div className="hero-image">
            <Image
              src="/images/hero.webp"
              fill
              sizes="100vw"
              alt="Piscina de água turquesa junto a uma casa contemporânea, ilustração arquitetônica"
              priority
            />
          </div>
          <div className="hero-shade" />
          <div className="water-light" aria-hidden="true" />
          <div className="hero-content">
            <div className="eyebrow">
              <span /> ARQUITETURA, ÁGUA E NOVAS FORMAS DE VIVER
            </div>
            <h1>
              Transformamos
              <br />
              espaços em <em>paraísos</em>
              <br />
              particulares<span className="cyan">.</span>
            </h1>
            <p>
              Piscinas de vinil que unem sofisticação,
              <br className="desktop" /> conforto e momentos inesquecíveis.
            </p>
            <div className="hero-actions">
              <a className="button light" href="#piscinas">
                Explorar piscinas <ArrowUpRight size={18} />
              </a>
              <a className="text-link" href="#contato">
                Solicitar orçamento <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#sobre">
              <span className="scroll-mark">
                <ArrowDown size={15} />
              </span>{" "}
              MERGULHE EM NOVAS POSSIBILIDADES
            </a>
            <span>
              FEITO PARA O SEU JEITO DE VIVER <span className="tiny-line" /> 01
              / 12
            </span>
          </div>
          <div className="hero-side">DESIGN QUE CONVIDA A FICAR.</div>
          <span className="image-note">CONCEITO ILUSTRATIVO · IA</span>
        </section>
        <div className="manifesto-strip">
          <span>Seu espaço.</span>
          <span>Seu refúgio.</span>
          <span className="outline-text">Sua melhor versão de viver.</span>
          <Waves strokeWidth={1} />
        </div>
        <section className="about section" id="sobre">
          <div className="about-photo reveal">
            <PoolImage
              id={11}
              alt="Piscina minimalista integrada à arquitetura branca"
            />
            <div className="photo-caption">
              <span>A VIDA ACONTECE LÁ FORA.</span>
              <ArrowUpRight />
            </div>
            <span className="photo-number">01 — ESSÊNCIA</span>
          </div>
          <div className="about-copy reveal">
            <div className="eyebrow dark">
              <span /> MAIS QUE UM PROJETO. UM NOVO CAPÍTULO.
            </div>
            <h2>
              Mais do que piscinas.
              <br />
              Criamos <em>experiências.</em>
            </h2>
            <p>
              Um mergulho para se reconectar. Uma tarde que não precisa
              terminar. Um lugar onde os melhores encontros acontecem.
            </p>
            <p>
              As piscinas de vinil abrem espaço para diferentes formas,
              acabamentos e possibilidades. Uma maneira de transformar sua área
              de lazer em uma extensão de quem você é.
            </p>
            <div className="about-values">
              <span>Desenhada para seu espaço</span>
              <span>Personalizada para sua vida</span>
              <span>Orientação em cada escolha</span>
            </div>
            <a className="text-link dark-link" href="#personalize">
              Descubra as possibilidades <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section className="catalog section" id="piscinas">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow dark">
                <span /> COLEÇÃO DE POSSIBILIDADES
              </div>
              <h2>
                Encontre o seu
                <br />
                <em>paraíso particular.</em>
              </h2>
            </div>
            <p>
              Uma seleção de inspirações para o seu próximo capítulo.
              <br />
              Qual delas combina com você?
            </p>
          </div>
          <div className="filters" aria-label="Filtrar modelos">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
              >
                {c}
              </button>
            ))}
            <span className="model-count">
              {models
                .filter((m) => category === "Todas" || m.category === category)
                .length.toString()
                .padStart(2, "0")}{" "}
              MODELOS <SlidersHorizontal size={14} />
            </span>
          </div>
          <div className="catalog-grid">
            {models
              .filter((m) => category === "Todas" || m.category === category)
              .map((m) => (
                <article
                  className="pool-card"
                  key={m.id}
                  onPointerMove={(e) => {
                    if (
                      e.pointerType !== "mouse" ||
                      matchMedia("(prefers-reduced-motion: reduce)").matches
                    )
                      return;
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty(
                      "--tilt",
                      `${((e.clientX - r.left) / r.width - 0.5) * 3}deg`,
                    );
                  }}
                  onPointerLeave={(e) =>
                    e.currentTarget.style.setProperty("--tilt", "0deg")
                  }
                >
                  <button
                    className="card-image"
                    aria-label={`Ver detalhes de ${m.name}`}
                    onClick={() => setSelected(m)}
                  >
                    <PoolImage
                      id={m.id + 1}
                      alt={`${m.name} — conceito ilustrativo`}
                    />
                    <span className="card-label">{m.category}</span>
                    <span className="card-arrow">
                      <ArrowUpRight />
                    </span>
                    <span className="card-hover">
                      Explore este refúgio <ArrowUpRight size={17} />
                    </span>
                  </button>
                  <div className="card-meta">
                    <small>CONCEITO {String(m.id + 1).padStart(2, "0")}</small>
                    <span>VINIL / DESIGN PERSONALIZÁVEL</span>
                  </div>
                  <h3>{m.name.replace("Piscina ", "")}</h3>
                  <p>{m.tagline}</p>
                  <div className="card-links">
                    <button onClick={() => setSelected(m)}>
                      Ver detalhes <Plus size={14} />
                    </button>
                    <button onClick={() => quote(m.name)}>
                      Solicitar orçamento <ArrowUpRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
          </div>
          <p className="disclaimer">
            Imagens ilustrativas geradas por IA. Projetos sujeitos à avaliação
            técnica e personalização.
          </p>
        </section>
        <section className="details" aria-label="Detalhes e experiências">
          <div className="details-heading reveal">
            <div className="eyebrow">
              <span /> SINTA A DIFERENÇA
            </div>
            <h2>
              Cada detalhe.
              <br />
              Uma nova <em>experiência.</em>
            </h2>
            <p>
              A luz que dança. A água que acolhe.
              <br />O tempo que encontra outro ritmo.
            </p>
          </div>
          <div className="diagonal-one">
            <PoolImage id={7} alt="Prainha de piscina com reflexos naturais" />
            <span>01 / O ENCONTRO COM A CALMA</span>
          </div>
          <div className="diagonal-two">
            <PoolImage id={8} alt="Cascata e pedras naturais junto à piscina" />
            <span>02 / A NATUREZA MAIS PERTO</span>
          </div>
          <span className="details-word" aria-hidden="true">
            SINTA.
          </span>
        </section>
        <section className="film">
          <div className="film-frame">
            <PoolImage id={5} alt="Piscina ampla com atmosfera de resort" />
            {config.video && (
              <video
                muted
                autoPlay
                loop
                playsInline
                preload="none"
                poster="/images/pool-5.webp"
                aria-label="Vídeo de piscina"
              >
                <source src={config.video} type="video/mp4" />
              </video>
            )}
            <div className="film-overlay" />
            <div className="film-copy">
              <div className="eyebrow">
                <span /> UM CONVITE A VIVER MAIS
              </div>
              <h2>
                O luxo de viver
                <br />
                seus melhores <em>momentos.</em>
              </h2>
              <a className="button glass" href="#contato">
                Imagine esse cenário na sua casa <ArrowUpRight size={18} />
              </a>
            </div>
            <span className="film-caption">
              {config.video
                ? "ÁGUA. LUZ. VIDA."
                : "INSPIRAÇÃO VISUAL · IMAGEM ILUSTRATIVA"}
            </span>
          </div>
        </section>
        <section className="services section" id="servicos">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow dark">
                <span /> DO PRIMEIRO TRAÇO AO PRÓXIMO MERGULHO
              </div>
              <h2>
                Possibilidades para
                <br />
                <em>transformar.</em>
              </h2>
            </div>
            <p>
              Cuidado com o todo.
              <br />
              Atenção a cada detalhe.
            </p>
          </div>
          <div className="services-grid">
            {services.map(([name, desc], i) => (
              <a href="#contato" className="service" key={name}>
                <span className="service-num">0{i + 1}</span>
                <h3>{name}</h3>
                <p>{desc}</p>
                <span className="service-cta">
                  Conversar sobre o projeto <ArrowUpRight size={17} />
                </span>
              </a>
            ))}
          </div>
          <p className="disclaimer">
            Serviços demonstrativos. Escopo e disponibilidade a confirmar com a
            empresa.
          </p>
        </section>
        <section className="benefits section">
          <div className="benefits-title reveal">
            <div className="eyebrow">
              <span /> BELEZA COM POSSIBILIDADES
            </div>
            <h2>
              Por que escolher
              <br />
              uma piscina <em>de vinil?</em>
            </h2>
            <p>Versatilidade para dar forma à sua ideia de bem-estar.</p>
          </div>
          <div className="benefit-list">
            {[
              [
                "01",
                "Liberdade para imaginar",
                "Flexibilidade de personalização e adaptação a diferentes projetos.",
              ],
              [
                "02",
                "Sua identidade, em cada escolha",
                "Variedade de estampas e acabamentos para compor o seu espaço.",
              ],
              [
                "03",
                "Um novo jeito de sentir",
                "Acabamento agradável e possibilidades de renovação visual.",
              ],
              [
                "04",
                "Cuidado que faz parte da rotina",
                "A limpeza pode ser facilitada com instalação adequada e cuidados conforme as orientações do fabricante.",
              ],
            ].map(([n, t, d]) => (
              <div className="benefit reveal" key={n}>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
                <Plus size={20} />
              </div>
            ))}
          </div>
        </section>
        <section className="customizer section" id="personalize">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow dark">
                <span /> COMECE A IMAGINAR
              </div>
              <h2>
                Do seu jeito.
                <br />
                <em>Em cada detalhe.</em>
              </h2>
            </div>
            <p>
              Explore combinações. Descubra seu estilo.
              <br />
              Seu refúgio começa com uma ideia.
            </p>
          </div>
          <div className="custom-layout">
            <div
              className={`sim-preview ${lining === "Azul profundo" ? "deep" : lining === "Mosaico" ? "mosaic" : ""}`}
            >
              <PoolImage
                id={simId}
                alt={`Inspiração ${shape.toLowerCase()}, estilo ${style.toLowerCase()}, revestimento ${lining.toLowerCase()}`}
              />
              <div className="sim-top">
                <span>SEU CENÁRIO DE INSPIRAÇÃO</span>
                <Waves size={21} />
              </div>
              <div className="sim-bottom">
                <span>
                  {shape} / {style}
                </span>
                <p>
                  {lining}
                  {extras.length ? ` · ${extras.join(" · ")}` : ""}
                </p>
                <small>
                  Combinação conceitual. Não representa projeto técnico.
                </small>
              </div>
            </div>
            <div className="sim-controls">
              {[
                [
                  "Formato",
                  shape,
                  setShape,
                  ["Retangular", "Orgânico", "Compacto"],
                ],
                [
                  "Estilo",
                  style,
                  setStyle,
                  ["Moderno", "Tropical", "Minimalista"],
                ],
                [
                  "Revestimento",
                  lining,
                  setLining,
                  ["Azul claro", "Azul profundo", "Mosaico"],
                ],
              ].map(([label, value, setter, options]) => (
                <fieldset key={label as string}>
                  <legend>{label as string}</legend>
                  <div className="choices">
                    {(options as string[]).map((v) => (
                      <button
                        key={v}
                        className={value === v ? "chosen" : ""}
                        aria-pressed={value === v}
                        onClick={() => (setter as (v: string) => void)(v)}
                      >
                        {label === "Revestimento" && (
                          <span
                            className={`swatch swatch-${v.replace(" ", "-")}`}
                          />
                        )}{" "}
                        {v}
                        {value === v && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
              <fieldset>
                <legend>Um toque a mais</legend>
                <div className="choices">
                  {["Iluminação", "Cascata", "Prainha"].map((v) => (
                    <button
                      key={v}
                      aria-pressed={extras.includes(v)}
                      className={extras.includes(v) ? "chosen" : ""}
                      onClick={() =>
                        setExtras(
                          extras.includes(v)
                            ? extras.filter((x) => x !== v)
                            : [...extras, v],
                        )
                      }
                    >
                      {v}
                      {extras.includes(v) ? (
                        <Check size={13} />
                      ) : (
                        <Plus size={13} />
                      )}
                    </button>
                  ))}
                </div>
              </fieldset>
              <button
                className="button ocean"
                onClick={() =>
                  send(
                    `Olá! Minha inspiração de piscina: formato ${shape}; estilo ${style}; revestimento ${lining}; extras: ${extras.join(", ") || "sem extras"}. Gostaria de avaliar a viabilidade e solicitar um orçamento.`,
                  )
                }
              >
                Conversar sobre minha ideia <ArrowUpRight size={17} />
              </button>
              <small className="sim-note">
                Simulador demonstrativo. Formatos, cores e extras são
                referências visuais, sujeitos à avaliação técnica.
              </small>
            </div>
          </div>
        </section>
        <section className="inspirations section" id="inspiracoes">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow dark">
                <span /> UM OLHAR PARA O EXTRAORDINÁRIO
              </div>
              <h2>
                Salve na memória.
                <br />
                <em>Imagine na sua casa.</em>
              </h2>
            </div>
            <p>
              Galeria demonstrativa de inspirações.
              <br />
              Novas perspectivas para o seu espaço.
            </p>
          </div>
          <div className="gallery-grid">
            {[3, 9, 10, 2, 6].map((id, i) => (
              <button
                key={id}
                className={`gallery-item gallery-${i}`}
                onClick={() => setGallery(id)}
                aria-label={`Ampliar inspiração ${models[id - 1].name}`}
              >
                <PoolImage id={id} alt={models[id - 1].name} />
                <span>
                  {
                    [
                      "A natureza como cenário",
                      "Quando a noite convida",
                      "Fluir é uma escolha",
                      "Até onde o olhar alcança",
                      "Tempo de estar junto",
                    ][i]
                  }
                  <Plus size={20} />
                </span>
              </button>
            ))}
          </div>
          <p className="disclaimer">
            Galeria ilustrativa gerada por IA. Não representa obras executadas.
          </p>
        </section>
        <section className="process section">
          <div className="eyebrow dark">
            <span /> O CAMINHO ATÉ SEU PARAÍSO
          </div>
          <h2>
            Cada etapa importa.
            <br />
            <em>Seu sonho também.</em>
          </h2>
          <div className="timeline">
            {[
              "Primeiro contato",
              "Entendimento das necessidades",
              "Avaliação técnica",
              "Definição do projeto",
              "Planejamento e orçamento",
              "Execução após aprovação",
              "Orientações de uso e cuidados",
            ].map((t, i) => (
              <div className="step reveal" key={t}>
                <span>0{i + 1}</span>
                <h3>{t}</h3>
              </div>
            ))}
          </div>
          <p className="disclaimer">
            Etapas ilustrativas, ajustadas conforme o escopo de cada projeto.
          </p>
        </section>
        <section className="faq section">
          <div>
            <div className="eyebrow dark">
              <span /> PARA MERGULHAR COM TRANQUILIDADE
            </div>
            <h2>
              Boas perguntas.
              <br />
              <em>Novas possibilidades.</em>
            </h2>
            <p>
              A informação também faz parte
              <br />
              de um bom projeto.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <div className={`faq-item ${faq === i ? "open" : ""}`} key={q}>
                <h3>
                  <button
                    aria-expanded={faq === i}
                    aria-controls={`answer-${i}`}
                    id={`question-${i}`}
                    onClick={() => setFaq(faq === i ? null : i)}
                  >
                    {q}
                    {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                </h3>
                <div
                  id={`answer-${i}`}
                  role="region"
                  aria-labelledby={`question-${i}`}
                  hidden={faq !== i}
                >
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="contact" id="contato">
          <div className="contact-photo">
            <PoolImage
              id={2}
              alt="Piscina de borda infinita diante do horizonte"
            />
            <div className="contact-shade" />
            <div className="contact-title">
              <div className="eyebrow">
                <span /> VAMOS DAR O PRIMEIRO PASSO?
              </div>
              <h2>
                Seu próximo
                <br />
                verão começa
                <br />
                <em>aqui.</em>
              </h2>
              <p>
                Conte como imagina sua piscina e dê o primeiro passo para
                transformar seu espaço.
              </p>
              <button className="text-link" onClick={() => quote()}>
                <MessageCircle size={19} /> Converse pelo WhatsApp{" "}
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
          <div className="contact-form">
            <div className="eyebrow dark">
              <span /> SEU PROJETO COMEÇA COM UMA CONVERSA
            </div>
            <h3>Vamos imaginar juntos?</h3>
            <p>Compartilhe sua ideia. A gente prepara a mensagem.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const phone = String(data.get("phone")).replace(/\D/g, "");
                if (phone.length < 10 || phone.length > 15) {
                  setNotice("Informe um telefone válido com DDD.");
                  return;
                }
                const message = `Olá! Meu nome é ${data.get("name")}.\nTelefone: ${data.get("phone")}\nCidade: ${data.get("city")}\nProjeto: ${data.get("project")}\n${data.get("message")}`;
                setFormStatus(message);
                send(message);
              }}
            >
              <div className="form-row">
                <label>
                  Seu nome
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    minLength={2}
                    placeholder="Como podemos te chamar?"
                  />
                </label>
                <label>
                  Telefone com DDD
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="(00) 00000-0000"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Cidade
                  <input
                    name="city"
                    autoComplete="address-level2"
                    required
                    placeholder="Onde será seu projeto?"
                  />
                </label>
                <label>
                  Tipo de projeto
                  <select name="project" defaultValue="" required>
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    <option>Nova piscina</option>
                    <option>Reforma</option>
                    <option>Troca de vinil</option>
                    <option>Manutenção</option>
                    <option>Outros / ainda estou imaginando</option>
                  </select>
                </label>
              </div>
              <label>
                Sua ideia
                <textarea
                  name="message"
                  rows={3}
                  required
                  placeholder="Conte um pouco sobre o espaço e o que você imagina…"
                />
              </label>
              <button className="button ocean" type="submit">
                Preparar mensagem para WhatsApp <ArrowUpRight size={18} />
              </button>
              <small>
                Os dados preparam uma mensagem no seu dispositivo. O envio
                acontece somente quando você confirmar no WhatsApp.
              </small>
            </form>
            {notice && (
              <p className="form-notice" role="status">
                {notice}
              </p>
            )}
            {formStatus && (
              <div className="message-preview">
                <label>
                  Mensagem preparada
                  <textarea readOnly value={formStatus} rows={5} />
                </label>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(formStatus);
                      setNotice("Mensagem copiada.");
                    } catch {
                      setNotice("Selecione e copie a mensagem acima.");
                    }
                  }}
                >
                  Copiar mensagem <ArrowUpRight size={14} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-top">
          <a href="#inicio" aria-label="Voltar ao início">
            <Brand />
          </a>
          <p>
            Um novo jeito de viver.
            <br />
            Um lugar para chamar de seu.
          </p>
          <a className="back-top" href="#inicio">
            VOLTAR AO TOPO <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Piscinas de Vinil.</span>
          <nav aria-label="Navegação do rodapé">
            {nav.slice(1).map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div>
            {config.instagram && (
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram <ArrowUpRight size={12} />
              </a>
            )}
            {config.address && <span>{config.address}</span>}
          </div>
        </div>
        <p className="footer-note">
          Experiência demonstrativa · Imagens geradas por IA · Projetos e
          serviços sujeitos à confirmação e avaliação técnica.
        </p>
      </footer>
      <button
        className="whatsapp-float"
        aria-label="Conversar pelo WhatsApp"
        onClick={() => quote()}
      >
        <MessageCircle size={22} />
        <span>Vamos conversar</span>
      </button>
      {selected && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div
            className="model-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="model-title"
          >
            <button
              ref={closeRef}
              className="modal-close"
              aria-label="Fechar detalhes"
              onClick={() => setSelected(null)}
            >
              <X />
            </button>
            <div className="modal-photo">
              <PoolImage id={selected.id + 1} alt={selected.name} />
            </div>
            <div className="modal-body">
              <div className="eyebrow dark">
                {selected.category} / CONCEITO ILUSTRATIVO
              </div>
              <h2 id="model-title">{selected.name}</h2>
              <p>{selected.description}</p>
              <h3>Possibilidades do conceito</h3>
              <ul>
                <li>Formatos e acabamentos a avaliar com um profissional.</li>
                <li>Opções de revestimento para personalizar a atmosfera.</li>
                <li>Integração com paisagismo, iluminação e área de lazer.</li>
              </ul>
              <div className="modal-thumbs">
                {[
                  selected.id + 1,
                  ((selected.id + 1) % 12) + 1,
                  ((selected.id + 2) % 12) + 1,
                ].map((id) => (
                  <button
                    key={id}
                    aria-label={`Ampliar inspiração ${id}`}
                    onClick={() => {
                      setSelected(null);
                      setGallery(id);
                    }}
                  >
                    <PoolImage id={id} alt={`Inspiração complementar ${id}`} />
                  </button>
                ))}
              </div>
              <button
                className="button ocean"
                onClick={() => quote(selected.name)}
              >
                Solicitar orçamento <ArrowUpRight size={18} />
              </button>
              <p className="disclaimer">
                Imagens ilustrativas geradas por IA. Galeria de referências, não
                de vistas do mesmo projeto. Sem dimensões ou preços
                predefinidos.
              </p>
            </div>
          </div>
        </div>
      )}
      {gallery !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de inspirações"
        >
          <button
            ref={closeRef}
            className="modal-close"
            aria-label="Fechar imagem"
            onClick={() => setGallery(null)}
          >
            <X />
          </button>
          <button
            className="gallery-prev"
            aria-label="Imagem anterior"
            onClick={() => setGallery(gallery === 1 ? 12 : gallery - 1)}
          >
            <ChevronLeft />
          </button>
          <div className="lightbox-photo">
            <PoolImage id={gallery} alt={models[gallery - 1].name} />
          </div>
          <button
            className="gallery-next"
            aria-label="Próxima imagem"
            onClick={() => setGallery(gallery === 12 ? 1 : gallery + 1)}
          >
            <ChevronRight />
          </button>
          <p>
            {models[gallery - 1].name}{" "}
            <span>Imagem ilustrativa gerada por IA · {gallery} / 12</span>
          </p>
        </div>
      )}
    </>
  );
}
