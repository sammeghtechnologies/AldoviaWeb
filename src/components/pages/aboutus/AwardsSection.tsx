import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type AwardCard = {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
};

const awardCards: AwardCard[] = [
  {
    id: 1,
    tag: "Award",
    title: "Awesome Food Award",
    subtitle: "Recognized by India Says Yes for excellence in culinary offerings.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 2,
    tag: "Award",
    title: "Australian Service Excellence Award",
    subtitle: "Presented by CSIA for outstanding service excellence standards.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 3,
    tag: "Award",
    title: "Ultimate Service Award in Hospitality",
    subtitle: "Honored by the Indian Ministry of Tourism for exceptional hospitality service.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 4,
    tag: "2017",
    title: "Best Convention and Exhibition Center",
    subtitle: "Awarded at the India Hospitality Awards for excellence in convention facilities.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 5,
    tag: "2015",
    title: "Best Luxury Wedding and MICE Resort",
    subtitle: "Recognized by South India Travels for premium wedding and MICE experiences.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 6,
    tag: "2007",
    title: "Best New Convention Center - South India",
    subtitle: "Featured in Travel Tour MICE Guide for outstanding new convention infrastructure.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 7,
    tag: "Award",
    title: "Best Resort in Bangalore",
    subtitle: "Supported by Incredible India and Ministry of Tourism for resort excellence.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 8,
    tag: "Award",
    title: "Best Resort for MICE",
    subtitle: "Honored at the Asia Hotel Industry Awards for excellence in MICE hosting.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 9,
    tag: "2017-2018",
    title: "Best Wedding Destination in India",
    subtitle: "Recognized at the Asia Lifestyle Tourism Awards for destination weddings.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 10,
    tag: "2014-2015",
    title: "Certificate of Excellence",
    subtitle: "Awarded by TripAdvisor for consistently outstanding guest reviews.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 11,
    tag: "2013",
    title: "European Award for Best Practices",
    subtitle: "Presented by the European Society for Quality Research for operational excellence.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 12,
    tag: "Award",
    title: "Gold Category Award",
    subtitle: "Recognized at the International Quality Summit for quality leadership.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 13,
    tag: "Award",
    title: "International Star Hotel Award",
    subtitle: "Awarded by the Asia Pacific Region Association for hospitality excellence.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 14,
    tag: "Award",
    title: "International Arch of Europe Award",
    subtitle: "Presented at the International BID Quality Convention, Frankfurt.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 15,
    tag: "2023",
    title: "India's Greatest Brand",
    subtitle: "Recognized by Asia One for brand excellence and leadership.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 16,
    tag: "2016",
    title: "Luxury Hotel Award",
    subtitle: "Presented by Yatra.com for outstanding luxury hospitality services.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 17,
    tag: "2017",
    title: "Peak of Success Award",
    subtitle: "Awarded by the World Confederation of Businesses for business excellence.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 18,
    tag: "2014",
    title: "Resort Hotel of the Year",
    subtitle: "Honored at the 6th Golden Star Awards for exceptional resort performance.",
    image: "/assets/pages/aboutus/awards.webp",
  },
  {
    id: 19,
    tag: "Award",
    title: "The Diamond Eye Award for Quality Commitment & Excellence",
    subtitle: "Presented by Otherways Management Association Club for quality commitment.",
    image: "/assets/pages/aboutus/awards.webp",
  },
];

const AwardsSection: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  const [isInitialPosition, setIsInitialPosition] = React.useState(true);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const cardsRowRef = React.useRef<HTMLDivElement | null>(null);
  const cardRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const cardWidth = "clamp(280px, 72vw, 460px)";
  const animateRowScroll = React.useCallback((targetLeft: number, duration = 1400) => {
    const row = cardsRowRef.current;
    if (!row) return;

    setIsAnimating(true);
    const startLeft = row.scrollLeft;
    const distance = targetLeft - startLeft;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      row.scrollLeft = startLeft + distance * eased;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setIsAnimating(false);
      }
    };

    window.requestAnimationFrame(step);
  }, []);

  const scrollToCard = React.useCallback((targetIndex: number, behavior: ScrollBehavior = "smooth") => {
    if (isAnimating && behavior !== "auto") return;
    const total = awardCards.length;
    if (!total) return;

    const normalizedIndex = (targetIndex + total) % total;
    setIndex(normalizedIndex);

    const row = cardsRowRef.current;
    const card = cardRefs.current[normalizedIndex];
    if (!row || !card) return;

    const left = Math.max(0, card.offsetLeft - (row.clientWidth - card.clientWidth) / 2);
    if (behavior === "auto") {
      row.scrollTo({ left, behavior: "auto" });
      return;
    }
    setIsInitialPosition(false);
    animateRowScroll(left, 1400);
  }, [animateRowScroll, isAnimating]);

  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      scrollToCard(0, "auto");
    });
    return () => window.cancelAnimationFrame(raf);
  }, [scrollToCard]);

  const onScroll = React.useCallback(() => {
    const row = cardsRowRef.current;
    if (!row) return;
    if (isInitialPosition && row.scrollLeft > 2) {
      setIsInitialPosition(false);
    }

    const rowCenter = row.scrollLeft + row.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, cardIndex) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - rowCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = cardIndex;
      }
    });

    setIndex((prev) => (prev === closestIndex ? prev : closestIndex));
  }, [isInitialPosition]);

  const progressPercent = ((index + 1) / awardCards.length) * 100;

  return (
    <section
      className="relative w-full overflow-hidden !py-10 md:!py-12"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(48,17,10,0.95) 0%, rgba(34,12,7,0.98) 50%, rgba(48,17,10,0.95) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-[100%] !px-4 md:!px-8 lg:!px-10">
        <div className="!mb-6 md:!mb-8 text-center">
          <h2 className="font-lust-medium text-[32px] md:text-[42px] leading-tight text-[var(--color-secondary)]">
            Awards & Recognisiton
          </h2>
         
        </div>

        <div
          ref={cardsRowRef}
          onScroll={onScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
         
        >
          {awardCards.map((item, cardIndex) => (
            <article
              key={item.id}
              ref={(node) => {
                cardRefs.current[cardIndex] = node;
              }}
              className="group relative h-[360px] md:h-[390px] lg:h-[420px] shrink-0 snap-center overflow-hidden rounded-[22px]"
              style={{ width: cardWidth }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-[var(--color-secondary)]">
                <p className="text-[1em] uppercase tracking-[0.14em] opacity-90">{item.tag}</p>
                <h3 className="font-lust text-[1em] md:text-[1em] leading-[1.1] !mt-1">{item.title}</h3>
                <p className="!mt-2 text-[.8em] md:text-[.9em] leading-[1.25] opacity-95">{item.subtitle}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="!mt-10 flex items-center justify-between">
          <div className="h-[1px] w-[100px] bg-white/25 overflow-hidden rounded-full">
            <div
              className="h-full bg-[var(--color-secondary)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToCard(index - 2)}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/5 text-white/90 backdrop-blur-sm transition hover:bg-white/10"
              aria-label="Previous card"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToCard(index + 2)}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/5 text-white/90 backdrop-blur-sm transition hover:bg-white/10"
              aria-label="Next card"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
