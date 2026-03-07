import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAssets } from "../../../app/hooks/useAssets";
import { useLocation, useNavigate } from "react-router";

// --- LOGO COMPONENT ---
// ✅ FIX 1: Added introFinished prop to resolve 'isVisible' name error
const Logo_top = ({
  isVisible = true,
  hideOnMobile = false,
  logoSrc = "assets/logo/brownlogo-mini.svg",
  onClick,
}: {
  isVisible?: boolean;
  hideOnMobile?: boolean;
  logoSrc?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go to landing page"
      className={`logo-top absolute left-[2%] lg:left-[2%] top-[55%] -translate-y-1/2 z-[5000] transition-opacity duration-500 cursor-pointer ${hideOnMobile ? "hidden md:block" : "block"} ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <img
        src={logoSrc}
        alt="Aldovia"
        className="logo-image w-[6em] lg:w-[7rem] h-auto object-contain block"
      />
    </button>
  );
};

// --- MENU ITEM COMPONENT ---
const MenuIcon = ({
  icon = "",
  title = "",
  onClick,
}: {
  icon?: string;
  title?: string;
  onClick?: () => void;
}) => {
  return (
    <li
      onClick={onClick}
      className="!my-3 lg:!my-1.5 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:opacity-70"
    >
      <span className="w-8 h-8 flex items-center justify-center">
        {/* ✅ FIX 2: Wrapped in check to fix the empty string ("") src error */}
        {icon && (
          <img
            src={icon}
            alt=""
            className="w-6 h-6 object-contain opacity-90"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        )}
      </span>

      <span className="text-[14px] md:text-[16px] lg:text-[16px] font-light tracking-[0.12em] text-white/90">
        {title}
      </span>
    </li>
  );
};

// --- SECTION HEADER ---
// --- SECTION HEADER ---
const MenuSection = ({
  title,
  isOpen,
  onClick,
  icons, // ✅ Add icons here as a prop
  showToggleIcon = true,
}: {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  icons: any; // ✅ Add this type
  showToggleIcon?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between text-[12px] md:text-[14px] lg:text-[13px] tracking-[0.35em] uppercase text-yellow-500 hover:text-yellow-400 transition-all"
    >
      {title}

      {/* ✅ Use the icons object from useAssets instead of a hardcoded string */}
      {showToggleIcon && icons && (
        <img
          src={isOpen ? icons.collapse : icons.expand}
          alt="toggle"
          className="w-4 h-4"
          style={{ filter: "brightness(0) invert(1)" }} // Keeps them white
        />
      )}
    </button>
  );
};

// --- MAIN COMPONENT ---
// ✅ FIX 3: Destructured introFinished prop to pass down to Logo_top
const MenuFrame = ({
  masterTl,
  showBookNow = true,
  showTopLogo = true,
  forceTopBarBackground = false,
  forcePrimaryTopBarIcons = false,
  disableTopBarBackground = false,
  disableBackdropBlur = false,
}: {
  masterTl?: any;
  introFinished?: boolean;
  showBookNow?: boolean;
  showTopLogo?: boolean;
  forceTopBarBackground?: boolean;
  forcePrimaryTopBarIcons?: boolean;
  disableTopBarBackground?: boolean;
  disableBackdropBlur?: boolean;
}) => {
  const { icons } = useAssets();
  const navigate = useNavigate();
  const location = useLocation();

  const frameRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // accordion refs
  const stayRef = useRef<HTMLUListElement>(null);
  const celebrateRef = useRef<HTMLUListElement>(null);
  const discoverRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState("stay");
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [isBeyondHero, setIsBeyondHero] = useState(false);
  const [isHomeExperienceInView, setIsHomeExperienceInView] = useState(false);
  const [isAboutAwardsInView, setIsAboutAwardsInView] = useState(false);
  const shouldShowTopBarBackground =
    !isOpen && !disableTopBarBackground && (forceTopBarBackground || isBeyondHero);
  const isHeroSection = !isBeyondHero;
  const isHomeBeyondHero = location.pathname === "/home" && isBeyondHero;
  const isAboutUsPage = location.pathname === "/aboutus";
  const defaultHamburgerIconSrc = isOpen
    ? "assets/icons/feet-beige.png"
    : isHomeExperienceInView
    ? "assets/icons/feet-beige.png"
    : isAboutAwardsInView
    ? "assets/icons/feet-beige.png"
    : isHeroSection
    ? "assets/icons/feet-beige.png"
    : isAboutUsPage
    ? "assets/icons/feet-brown.png"
    : isHomeBeyondHero
    ? "assets/icons/feet-brown.png"
    : shouldShowTopBarBackground
      ? "assets/icons/feet-beige.png"
      : "assets/icons/feet-brown.png";
  const hamburgerIconSrc = forcePrimaryTopBarIcons
    ? "assets/icons/feet-brown.png"
    : defaultHamburgerIconSrc;
  const topLogoSrc = hamburgerIconSrc.includes("feet-beige")
    ? "assets/logo/beigelogo-mini.svg"
    : "assets/logo/brownlogo-mini.svg";

  // Logo animation
  useLayoutEffect(() => {
    const target = ".logo-image";

    const ctx = gsap.context(() => {
      gsap.set(target, { autoAlpha: 0, y: 15, scale: 0.9 });

      if (masterTl?.current) {
        masterTl.current.to(
          target,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          ">"
        );
      } else {
        gsap.to(target, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: 1,
          ease: "power3.out",
        });
      }
    }, frameRef);

    return () => ctx.revert();
  }, [masterTl]);

  // Sidebar open/close animation
  useLayoutEffect(() => {
    if (!sidebarRef.current || !overlayRef.current) return;

    if (isOpen) {
      gsap.set(overlayRef.current, { visibility: "visible" });

      gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    } else {
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.out",
        // ✅ FIX 4: Wrapped in arrow function to fix GSAP onComplete return type error
        onComplete: () => { gsap.set(overlayRef.current, { visibility: "hidden" }); },
      });

      gsap.to(sidebarRef.current, {
        x: "100%",
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  // Accordion smooth animation
  useLayoutEffect(() => {
    const sections: any = {
      stay: stayRef.current,
      celebrate: celebrateRef.current,
      discover: discoverRef.current,
    };

    Object.keys(sections).forEach((key) => {
      const el = sections[key];
      if (!el) return;

      if (openSection !== key) {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          overflow: "hidden",
        });
      }
    });

    const activeEl = sections[openSection];
    if (activeEl) {
      gsap.to(activeEl, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        overflow: "hidden",
      });

      gsap.fromTo(
        activeEl.children,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
        }
      );
    }
  }, [openSection]);

  // Keep top bar visible; only track whether we're beyond hero for background styling.
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || 0;
      setIsBeyondHero(currentY > window.innerHeight * 0.6);
      if (location.pathname === "/home") {
        const experience = document.getElementById("home-experience-section");
        if (experience) {
          const rect = experience.getBoundingClientRect();
          const checkY = window.innerHeight * 0.45;
          const inView = rect.top <= checkY && rect.bottom >= checkY;
          setIsHomeExperienceInView(inView);
        } else {
          setIsHomeExperienceInView(false);
        }
      } else {
        setIsHomeExperienceInView(false);
      }
      if (location.pathname === "/aboutus") {
        const awards = document.getElementById("about-awards-section");
        if (awards) {
          const rect = awards.getBoundingClientRect();
          const checkY = window.innerHeight * 0.45;
          const inView = rect.top <= checkY && rect.bottom >= checkY;
          setIsAboutAwardsInView(inView);
        } else {
          setIsAboutAwardsInView(false);
        }
      } else {
        setIsAboutAwardsInView(false);
      }
      setIsTopBarVisible(true);
    };

    setIsBeyondHero((window.scrollY || 0) > window.innerHeight * 0.6);
    if (location.pathname === "/home") {
      const experience = document.getElementById("home-experience-section");
      if (experience) {
        const rect = experience.getBoundingClientRect();
        const checkY = window.innerHeight * 0.45;
        setIsHomeExperienceInView(rect.top <= checkY && rect.bottom >= checkY);
      } else {
        setIsHomeExperienceInView(false);
      }
    } else {
      setIsHomeExperienceInView(false);
    }
    if (location.pathname === "/aboutus") {
      const awards = document.getElementById("about-awards-section");
      if (awards) {
        const rect = awards.getBoundingClientRect();
        const checkY = window.innerHeight * 0.45;
        setIsAboutAwardsInView(rect.top <= checkY && rect.bottom >= checkY);
      } else {
        setIsAboutAwardsInView(false);
      }
    } else {
      setIsAboutAwardsInView(false);
    }
    setIsTopBarVisible(true);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isOpen, location.pathname]);

  // Prevent page scroll when menu is open.
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;

    if (isOpen) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
    }

    return () => {
      body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  return (
    <div
      ref={frameRef}
      className="menu-frame fixed inset-0 w-full h-full z-[2147483646] pointer-events-none"
    >
      {/* TOP BAR */}
      <div
        className={`h-[12vh] !p-1 absolute left-0 right-0 top-0 z-[2147483647]  transition-all duration-300 ${shouldShowTopBarBackground ? " backdrop-blur-xl  shadow-[0_10px_30px_rgba(0,0,0,0.45)]" : "bg-transparent"} ${isTopBarVisible ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-12 opacity-0 pointer-events-none"
          }`}
      >
        <div className="relative flex h-full items-center justify-end px-3 py-2">
        <Logo_top
          isVisible={showTopLogo}
          hideOnMobile={isOpen}
          logoSrc={topLogoSrc}
          onClick={() => navigate("/")}
        />

        <div className="flex items-center gap-10">
          {/* BOOK NOW BUTTON */}
          {showBookNow && (
            <button
              onClick={() => navigate("/home")}
              className="font-lust px-14 py-7 text-white text-[16px] md:text-[18px] lg:text-[17px] tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-70 font-medium bg-transparent border-none"
            >
              Book Now
            </button>
          )}

          {/* FEET MENU ICON */}
          <div
            id="hamburger"
            className={`!pr-8 cursor-pointer translate-x-2 transition-transform duration-300 active:scale-90 ${isOpen ? "rotate-90" : "rotate-0"
              }`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <img
              src={hamburgerIconSrc}
              alt="Menu"
              className="w-16 h-16 object-contain transition-all"
            />
          </div>
        </div>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        ref={overlayRef}
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/60 ${disableBackdropBlur ? "" : "backdrop-blur-md"} opacity-0 invisible pointer-events-auto`}
      />

      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        className="fixed !top-0 !right-0 !h-full w-[380px] md:w-[420px] lg:w-[460px] max-w-[95%] translate-x-full pointer-events-auto !p-0 md:!p-0 lg:!p-0"
      >
        <div className={`!h-full bg-gradient-to-b from-[#4b2f23]/75 via-[#4b2f23]/75 to-[#4b2f23]/75 ${disableBackdropBlur ? "" : "backdrop-blur-xl"} !px-8 !py-10 md:!px-10 md:!py-12 lg:!px-5 lg:!py-1 relative shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col`}>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden !pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Spacer so Home starts below hamburger icon area */}
            <div className="h-10 md:h-14 lg:h-12" />

            {/* HOME */}
            <div className="!p-1 flex items-center gap-5 mb-12 shadow-xl"
            onClick={() => {
              setIsOpen(false);
              navigate("/home");
            }} 
            >
              <img
                src={icons.home || "/assets/icons/home.svg"}
                alt=""
                className="w-6 h6- object-contain opacity-90"
                style={{ filter: "brightness(0) invert(1)" }}
              />

              <span className="text-[17px] md:text-[1em] lg:text-[1em] tracking-wide text-white/90">
                Home
              </span>
            </div>


            <div className="border-t border-white/10 mb-10 !p-3" />

            {/* STAY */}
            <div className="mb-10 ">
              <MenuSection
                title="Stay"
                isOpen={openSection === "stay"}
                icons={icons}
                onClick={() =>
                  setOpenSection(openSection === "stay" ? "" : "stay")
                }
              />

              <ul
                ref={stayRef}
                className="!mt-5 lg:!mt-3 space-y-8 lg:space-y-4 !pl-2 overflow-hidden"
                style={{ height: openSection === "stay" ? "auto" : 0 }}
              >
                <MenuIcon
                  icon={icons.bed || "/assets/icons/bed.svg"}
                  title="Rooms"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/rooms");
                  }} />
                <MenuIcon
                  icon={icons.star || "/assets/icons/star.svg"}
                  title="Experiences & Packages"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/experience");
                  }}
                />
                <MenuIcon
                  icon={icons.forkknife || "/assets/icons/forkknife.svg"}
                  title="Dining"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/dining");
                  }}
                />
                <MenuIcon
                  icon={icons.activity || "/assets/icons/activity.svg"}
                  title="Activities"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/activities");
                  }}
                />
              </ul>
            </div>

            <div className="border-t border-white/10 mb-10 !p-3" />

            {/* CELEBRATE & GATHER */}
            <div className="mb-10">
              <MenuSection
                title="Events"
                isOpen={openSection === "celebrate"}
                icons={icons}
                onClick={() =>
                  setOpenSection(openSection === "celebrate" ? "" : "celebrate")
                }
              />

              <ul
                ref={celebrateRef}
                className="!mt-5 lg:!mt-3 space-y-8 lg:space-y-4 !pl-2 overflow-hidden"
                style={{ height: openSection === "celebrate" ? "auto" : 0 }}
              >
                <MenuIcon
                  icon={icons.wedding || "/assets/icons/wedding.svg"}
                  title="Weddings"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/venues", { state: { mode: "wedding" } });
                  }}
                />
                <MenuIcon
                  icon={icons.corporate || "/assets/icons/corporate.svg"}
                  title="Corporate Events"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/venues", { state: { mode: "corporate" } });
                  }}
                />
                <MenuIcon
                  icon={icons.venue || "/assets/icons/venue.svg"}
                  title="Venues"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/venues", { state: { mode: "venue" } });
                  }}
                />
              </ul>
            </div>

            <div className="border-t border-white/10 mb-10 !p-3" />
            <div className="!mb-3">
              <MenuSection
                title="Convention Center"
                isOpen={openSection === "convention"}
                icons={icons}
                showToggleIcon={false}
                onClick={() => {
                  setIsOpen(false);
                  navigate("/venues", { state: { mode: "convention" } });
                }}
              />
              </div>

            <div className="border-t border-white/10 mb-10 !p-3" />

            {/* ✅ DISCOVER SECTION */}
            <div className="mb-10">
              <MenuSection
                title="Discover"
                isOpen={openSection === "discover"}
                icons={icons}
                onClick={() =>
                  setOpenSection(openSection === "discover" ? "" : "discover")
                }
              />

              <ul
                ref={discoverRef}
                className="!mt-5 lg:!mt-3 space-y-8 lg:space-y-4 !pl-2 overflow-hidden"
                style={{ height: openSection === "discover" ? "auto" : 0 }}
              >
                <MenuIcon
                  icon={icons.about || "/assets/icons/about.svg"}
                  title="About Us"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/aboutus");
                  }}
                />
                <MenuIcon icon={icons.contact || "/assets/icons/contact.svg"} title="Get in Touch" />
              </ul>
            </div>
          </div>

          {/* CONTACT */}
          <div className="relative z-20 mt-auto shrink-0 border-t border-white/10 pt-6">
            <p className="!pt-2 text-[11px] md:text-[12px] lg:text-[12px] tracking-[0.35em] uppercase text-white/50 !mb-6">
              Get in touch
            </p>

            <div className="flex flex-col gap-6 text-[15px] md:text-[17px] lg:text-[16px] text-white/80">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-yellow-500/40 flex items-center justify-center">
                  <img
                    src={icons.phone || "/assets/icons/phone.svg"}
                    alt=""
                    className="w-5 h-5"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </div>
                <div className="flex flex-col gap-2 leading-tight">
                  <span>080 35077000 (Sales)</span>
                  <span>080 31013031 (Hotel)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-yellow-500/40 flex items-center justify-center">
                  <img
                    src={icons.mail || "/assets/icons/mail.svg"}
                    alt=""
                    className="w-5 h-5"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </div>
                <span>info@aldovia.in </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="relative z-20 shrink-0 !mt-8 text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-white/40">
            Aldovia Heritage © 2026
          </div>
        </div>
      </div>

    </div>
  );
};

export default MenuFrame;
