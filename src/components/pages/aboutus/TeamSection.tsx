import React, { useEffect, useRef, useState } from "react";

type TeamMember = {
  role: string;
  name: string;
  description: string;
  image: string;
};

const members: TeamMember[] = [
  {
    role: "Founder",
    name: "Ronald Colaco",
    description: "Dr. Ronald Colaco, the Founder of Clarks Exotica, is widely recognized for his visionary leadership and commitment to philanthropy. Dr. Colaco has been driven by a passion for excellence and dedication to service. His visionary leadership has helped to guide Clarks Exotica through periods of growth and transformation, and his unwavering commitment to innovation has ensured that the resort remains at the forefront of the hospitality industry. In addition to his achievements in the business world, Dr. Colaco is also known for his philanthropic work. He is a strong advocate for education and his charitable initiatives have helped to provide educational opportunities to underprivileged children. Through his leadership and philanthropy, Dr. Colaco has demonstrated a deep commitment to making a positive impact on the world around him.",
    image: "/assets/pages/aboutus/Ronald_Colaco.jpg",
  },
  {
    role: "Managing Director",
    name: "Vivek Kumar",
    description: "Mr. Vivek Kumar, the Co-Founder of Clarks Exotica and the Founder of Kamalya Group, is a highly respected entrepreneur known for his exceptional leadership and business acumen. In addition to his work with Clarks Exotica, Mr. Vivek Kumar has also made significant contributions to a wide range of industries through his work with the Kamalya Group. The group operates businesses across textiles, fitness, and real estate and has become a driving force in the Indian business community. His business intellect and leadership have been widely recognized, earning him various domestic and international awards.",
    image: "/assets/pages/aboutus/vivek-kumar.webp",
  },
  {
    role: "Executive Director",
    name: "Mr. Nigel Colaco",
    description: "Mr. Nigel Colaco, the Executive Director of Clarks Exotica and Director of Continental Builders and Developers, is a visionary entrepreneur and real estate expert known for his exceptional leadership and innovation in the real estate industry. Under Mr. Colaco's leadership and guidance, Continental Builders and Developers have constructed some of the most iconic residential and commercial properties in Bangalore. These include Swiss Town, Hollywood Town, Oval Reef, and Serene Gardens. His passion for creating exceptional properties that reflect the highest standards of quality and innovation, combined with his commitment to sustainability and community engagement is a testament to his leadership and vision.",
    image: "/assets/pages/aboutus/nigel.webp",
  },
  {
    role: "CEO",
    name: "Mr. M Balaji",
    description: "Mr. Balaji, the CEO of Clarks Exotica has been recognized as a prominent figure in the hospitality industry. With his visionary approach and extensive expertise, he has played a crucial role in the growth and success of Clarks Exotica. Under his leadership, Clarks Exotica has received numerous awards and accolades for its exceptional service. His dedication to providing unparalleled hospitality experiences has helped the resort become a popular choice for corporate events, weddings, and other social gatherings. Mr. Balaji has been honored with numerous awards and accolades, including the prestigious Socrates Commission Award in 2019, which is given for the highest achievement in management. His commitment to excellence and his ability to motivate and inspire the team has helped Clarks achieve unprecedented levels of success.",
    image: "/assets/pages/aboutus/balaji.webp",
  },
];

const MemberCardContent: React.FC<{ member: TeamMember }> = ({ member }) => {
  return (
    <div className="grid h-full items-center !gap-6 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:!gap-8 lg:!gap-10">
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[14px] border border-[#c8a45a] bg-[#3c312d]">
        <img
          src={member.image}
          alt={member.name}
          className="h-[40vh] w-full object-cover md:h-[420px]"
          loading="lazy"
        />
      </div>

      <div className="text-center md:text-left">
        <p className="inline-flex rounded-full bg-[var(--color-primary)] !px-5 !py-2 text-[1em] font-semibold uppercase tracking-[0.14em] text-[#2d180f]">
          {member.role}
        </p>
        <h3 className="!mt-4 text-[2em] italic leading-tight !text-[var(--color-primary)] md:text-[48px]">
          {member.name}
        </h3>
        <p className="!mt-5 max-h-[180px] max-w-[56ch] overflow-y-auto pr-1 text-left text-[.9em] leading-8 !text-[var(--color-primary)] md:max-h-none md:overflow-visible md:pr-0">
          {member.description}
        </p>
      </div>
    </div>
  );
};

const TeamSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [introProgress, setIntroProgress] = useState(0);

    useEffect(() => {
      const updateActiveMember = () => {
        const node = sectionRef.current;
        if (!node) return;

        const rect = node.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const maxScrollableInSection = Math.max(node.offsetHeight - window.innerHeight, 1);
        const rawProgress = (window.scrollY - sectionTop) / maxScrollableInSection;
        const clampedProgress = Math.min(Math.max(rawProgress, 0), 0.9999);
        const introRaw = (window.innerHeight - rect.top) / (window.innerHeight * 0.7);
        const introClamped = Math.min(Math.max(introRaw, 0), 1);
        const nextIndex = Math.min(
          members.length - 1,
          Math.floor(clampedProgress * members.length)
        );

        setDisplayedIndex(nextIndex);
        setIntroProgress(introClamped);
      };

      updateActiveMember();
      window.addEventListener("scroll", updateActiveMember, { passive: true });
      window.addEventListener("resize", updateActiveMember);

      return () => {
        window.removeEventListener("scroll", updateActiveMember);
        window.removeEventListener("resize", updateActiveMember);
      };
    }, []);

    return (
      <section
        ref={sectionRef}
        className="relative h-[400vh] w-full text-[var(--color-primary)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,239,227,0.9), rgba(244,239,227,0.92)), url('/assets/backgrounds/swanbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="sticky top-0 flex h-screen w-full items-center justify-center !px-4 md:!px-8 lg:!px-12">
          <div
            className="relative w-full max-w-6xl min-h-[760px] md:min-h-[520px]"
            style={{
              opacity: introProgress,
              transform: `translateY(${(1 - introProgress) * 42}px) scale(${0.96 + introProgress * 0.04})`,
              transition: "opacity 140ms linear, transform 140ms linear",
              willChange: "transform, opacity",
            }}
          >
            <div className="relative h-full w-full rounded-[18px] border border-[var(--color-secondary)] bg-[#f4efe3] !p-5 shadow-[0_16px_40px_rgba(44,20,12,0.12)] md:!p-8 lg:!p-10">
              <div className="relative h-full min-h-[700px] overflow-hidden md:min-h-[460px]">
                <MemberCardContent member={members[displayedIndex]} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

export default TeamSection;
