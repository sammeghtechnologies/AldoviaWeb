import React from "react";
import { motion } from "framer-motion";
import { Video, X } from "lucide-react";
import VideoCard from "../ui/VideoCard";
import SlidingTitleReveal from "../ui/SlidingTitleReveal";

const ImmersiveSection: React.FC = () => {
  const TOUR_URL =
    "https://embed.realhorizons.in/tours/clarksexotica?iframe=true&disableGuided=true";
  const WEDDING_VIDEO_URL =
    "https://player.cloudinary.com/embed/?cloud_name=dla9ezffr&public_id=Clarks_Wedding_Film_1_sfakaq&autoplay=true&muted=true";
  const CORPORATE_VIDEO_URL =
    "https://player.cloudinary.com/embed/?cloud_name=dla9ezffr&public_id=Clarks_Corporate_Film_1_de6tgh&autoplay=true&muted=true";
  const immersiveCards = React.useMemo(
    () => [
      { id: "wedding", image: "/assets/hero/360view.jpg", title: "Wedding Setup Walkthrough" },
      { id: "corporate", image: "/assets/hero/360view.jpg", title: "Corporate Hall Tour" },
    ],
    []
  );
  const [isTourOpen, setIsTourOpen] = React.useState(false);
  const [isTourLoaded, setIsTourLoaded] = React.useState(false);
  const [isWeddingVideoOpen, setIsWeddingVideoOpen] = React.useState(false);
  const [isWeddingVideoLoaded, setIsWeddingVideoLoaded] = React.useState(false);
  const [isCorporateVideoOpen, setIsCorporateVideoOpen] = React.useState(false);
  const [isCorporateVideoLoaded, setIsCorporateVideoLoaded] = React.useState(false);
  const lastScrollYRef = React.useRef<number | null>(null);
  const restoreScroll = React.useCallback(() => {
    if (lastScrollYRef.current == null) return;
    window.scrollTo({ top: lastScrollYRef.current, left: 0, behavior: "auto" });
  }, []);

  React.useEffect(() => {
    if (!isTourOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsTourOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isTourOpen]);

  React.useEffect(() => {
    if (!isTourOpen) return;
    // Some browsers scroll-jump when an iframe takes focus; keep scroll stable.
    const rafId = window.requestAnimationFrame(restoreScroll);
    const t1 = window.setTimeout(restoreScroll, 250);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(t1);
    };
  }, [isTourOpen, restoreScroll]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[var(--color-secondary)] !py-20 !px-[2%] flex flex-col items-center justify-center">
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 z-0 -translate-y-1/2 bg-no-repeat opacity-10 md:opacity-[0.15]"
        style={{
          backgroundImage: "url('/assets/logo/logo-wet-earth.png')",
          backgroundSize: "min(54vw, 520px)",
          backgroundPosition: "right top",
          width: "min(54vw, 520px)",
          height: "min(54vw, 520px)",
        }}
      /> */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0 bg-no-repeat opacity-20 md:opacity-[0.15] right-[-38%] top-[0%] -translate-y-[22%] sm:right-[-6%] sm:top-[0%] sm:-translate-y-[22%] md:right-[-14%] md:top-[0%] md:-translate-y-[22%] lg:right-[-42%] lg:top-[-13%] lg:-translate-y-[24%] [--logo-size:122vw] sm:[--logo-size:148vw] md:[--logo-size:162vw] lg:[--logo-size:136vw] xl:[--logo-size:100vw]"
        style={{
          backgroundImage: "url('/assets/logo/brownsmall-bg.svg')",
          backgroundSize: "var(--logo-size)",
          backgroundPosition: "right top",
          width: "var(--logo-size)",
          height: "var(--logo-size)",
        }}
      />

      {/* Heading */}
      <div className="relative z-10 max-w-6xl mx-auto !mb-10 text-center">
        <SlidingTitleReveal
          lines={["Explore the Resort"]}
          className="!pt-2 !pb-2 text-4xl md:text-5xl font-serif text-[var(--color-primary)]"
          lineClassName="!text-[var(--color-primary)]"

        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-stretch">
          {/* 360 Card (left on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl lg:h-[632px]"
          >
          {!isTourOpen ? (
            <>
              <img
                src="/assets/hero/360view.jpg"
                alt="Resort"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/60" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                <Video className="mb-8 h-8 w-8 text-white/90" />

                <p className="!pt-1 !pb-1 text-[.8em] tracking-[0.18em] uppercase text-white/80">
                  Immersive Experience
                </p>

                <h3 className="!pt-2 !pb-2 text-4xl font-serif leading-tight !mb-6 max-w-[16ch] md:text-4xl !text-[var(--color-secondary)]">
                  Before You Arrive
                </h3>

                <p className="!pt-1 !pb-1 !mb-8 max-w-[30ch] text-base !leading-[1.35] text-white/90 md:text-md">
                  Experience our venues, rooms, and amenities in stunning 360° detail
                </p>

                <button
                  type="button"
                  onClick={() => {
                    lastScrollYRef.current = window.scrollY || 0;
                    setIsTourLoaded(false);
                    setIsTourOpen(true);
                  }}
                  className="!inline-flex !pt-2 !pr-[31.561px] !pb-2 !pl-[33.002px] !justify-center !items-center !rounded-[8px] !bg-[var(--color-secondary)] !text-black !font-medium hover:!bg-gray-200 !transition"
                >
                  Enter 360° Virtual Tour
                </button>

                <p className="!pt-1 !pb-1 mt-5 text-[.8em] text-white/60 !text-[var(--color-secondary)]">
                  Loads in 5-10 seconds • Exit anytime
                </p>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-black">
              <button
                type="button"
                onClick={() => setIsTourOpen(false)}
                className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/75"
                aria-label="Close virtual tour"
              >
                <X className="h-5 w-5" />
              </button>

              {!isTourLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center text-center text-white/85">
                  <div className="px-6">
                    <p className="text-sm tracking-[0.16em] uppercase">Loading 360° tour…</p>
                    <p className="mt-2 text-xs text-white/60">This can take a few seconds.</p>
                  </div>
                </div>
              )}

              <iframe
                title="360° virtual tour"
                src={TOUR_URL}
                tabIndex={-1}
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
                allowFullScreen
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => {
                  setIsTourLoaded(true);
                  restoreScroll();
                  window.setTimeout(restoreScroll, 100);
                }}
              />
            </div>
          )}
          </motion.div>

          {/* Small cards (right on desktop) */}
          <div className="flex w-full flex-col gap-8">
            {immersiveCards.map((item) => (
              <div key={item.id} className="w-full">
                {item.id === "wedding" ? (
                  isWeddingVideoOpen ? (
                    <div className="relative h-[260px] md:h-[300px] rounded-3xl overflow-hidden shadow-xl bg-black">
                      <button
                        type="button"
                        onClick={() => setIsWeddingVideoOpen(false)}
                        className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/75"
                        aria-label="Close wedding video"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      {!isWeddingVideoLoaded && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center text-center text-white/85">
                          <div className="px-6">
                            <p className="text-sm tracking-[0.16em] uppercase">Loading video…</p>
                          </div>
                        </div>
                      )}

                      <iframe
                        title="Wedding Setup Walkthrough"
                        src={WEDDING_VIDEO_URL}
                        width={640}
                        height={360}
                        className="absolute inset-0 h-full w-full"
                        style={{ height: "auto", width: "100%", aspectRatio: "640 / 360", border: 0 }}
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                        allowFullScreen
                        frameBorder={0}
                        onLoad={() => setIsWeddingVideoLoaded(true)}
                      />
                    </div>
                  ) : (
                    <VideoCard
                      image={item.image}
                      title={item.title}
                      onClick={() => {
                        setIsWeddingVideoLoaded(false);
                        setIsWeddingVideoOpen(true);
                        setIsCorporateVideoOpen(false);
                      }}
                    />
                  )
                ) : item.id === "corporate" ? (
                  isCorporateVideoOpen ? (
                    <div className="relative h-[260px] md:h-[300px] rounded-3xl overflow-hidden shadow-xl bg-black">
                      <button
                        type="button"
                        onClick={() => setIsCorporateVideoOpen(false)}
                        className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/75"
                        aria-label="Close corporate video"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      {!isCorporateVideoLoaded && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center text-center text-white/85">
                          <div className="px-6">
                            <p className="text-sm tracking-[0.16em] uppercase">Loading video…</p>
                          </div>
                        </div>
                      )}

                      <iframe
                        title="Corporate Hall Tour"
                        src={CORPORATE_VIDEO_URL}
                        width={640}
                        height={360}
                        className="absolute inset-0 h-full w-full"
                        style={{ height: "auto", width: "100%", aspectRatio: "640 / 360", border: 0 }}
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                        allowFullScreen
                        frameBorder={0}
                        onLoad={() => setIsCorporateVideoLoaded(true)}
                      />
                    </div>
                  ) : (
                    <VideoCard
                      image={item.image}
                      title={item.title}
                      onClick={() => {
                        setIsCorporateVideoLoaded(false);
                        setIsCorporateVideoOpen(true);
                        setIsWeddingVideoOpen(false);
                      }}
                    />
                  )
                ) : (
                  <VideoCard image={item.image} title={item.title} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImmersiveSection;
