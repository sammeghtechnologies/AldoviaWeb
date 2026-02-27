import React from "react";

type Award = {
  AwardName: string;
  description: string;
  year: string;
};

const awards: Award[] = [
  {
    AwardName: "Awesome Food Award",
    description: "Recognized by India Says Yes for excellence in culinary offerings.",
    year: "",
  },
  {
    AwardName: "Australian Service Excellence Award",
    description: "Presented by CSIA for outstanding service excellence standards.",
    year: "",
  },
  {
    AwardName: "Ultimate Service Award in Hospitality",
    description: "Honored by the Indian Ministry of Tourism for exceptional hospitality service.",
    year: "",
  },
  {
    AwardName: "Best Convention and Exhibition Center",
    description: "Awarded at the India Hospitality Awards for excellence in convention facilities.",
    year: "2017",
  },
  {
    AwardName: "Best Luxury Wedding and MICE Resort",
    description: "Recognized by South India Travels for premium wedding and MICE experiences.",
    year: "2015",
  },
  {
    AwardName: "Best New Convention Center – South India",
    description: "Featured in Travel Tour MICE Guide for outstanding new convention infrastructure.",
    year: "2007",
  },
  {
    AwardName: "Best Resort in Bangalore",
    description: "Supported by Incredible India and Ministry of Tourism for resort excellence.",
    year: "",
  },
  {
    AwardName: "Best Resort for MICE",
    description: "Honored at the Asia Hotel Industry Awards for excellence in MICE hosting.",
    year: "",
  },
  {
    AwardName: "Best Wedding Destination in India",
    description: "Recognized at the Asia Lifestyle Tourism Awards for destination weddings.",
    year: "2017-2018",
  },
  {
    AwardName: "Certificate of Excellence",
    description: "Awarded by TripAdvisor for consistently outstanding guest reviews.",
    year: "2014-2015",
  },
  {
    AwardName: "European Award for Best Practices",
    description: "Presented by the European Society for Quality Research for operational excellence.",
    year: "2013",
  },
  {
    AwardName: "Gold Category Award",
    description: "Recognized at the International Quality Summit for quality leadership.",
    year: "",
  },
  {
    AwardName: "International Star Hotel Award",
    description: "Awarded by the Asia Pacific Region Association for hospitality excellence.",
    year: "",
  },
  {
    AwardName: "International Arch of Europe Award",
    description: "Presented at the International BID Quality Convention, Frankfurt.",
    year: "",
  },
  {
    AwardName: "India’s Greatest Brand",
    description: "Recognized by Asia One for brand excellence and leadership.",
    year: "2023",
  },
  {
    AwardName: "Luxury Hotel Award",
    description: "Presented by Yatra.com for outstanding luxury hospitality services.",
    year: "2016",
  },
  {
    AwardName: "Peak of Success Award",
    description: "Awarded by the World Confederation of Businesses for business excellence.",
    year: "2017",
  },
  {
    AwardName: "Resort Hotel of the Year",
    description: "Honored at the 6th Golden Star Awards for exceptional resort performance.",
    year: "2014",
  },
  {
    AwardName: "The Diamond Eye Award for Quality Commitment & Excellence",
    description: "Presented by Otherways Management Association Club for quality commitment.",
    year: "",
  }
];

const AwardsSection: React.FC = () => {
  return (
    <section
      className="w-full !px-4 !py-14 md:!px-8 md:!py-16 lg:!px-10 lg:!py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(33,20,15,0.86), rgba(33,20,15,0.9)), url('/assets/backgrounds/swanbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto flex w-full max-w-12xl flex-col items-center">
        <div className="!mb-8 w-full text-center md:!mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#8a6a2f]">Recognition</p>
          <h2 className="font-lust !mt-2 text-[2em] leading-tight text-[var(--color-secondary)] md:text-[44px]">
            Awards & Honors
          </h2>
        </div>

        <div className="grid w-full justify-items-center grid-cols-1 !gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award) => (
            <article
              key={`${award.AwardName}-${award.year}`}
              className="group relative flex h-full w-full max-w-[320px] flex-col items-center justify-center overflow-hidden rounded-[18px] border border-[var(--color-primary)]/35 !p-4 text-center shadow-[0_16px_28px_rgba(0,0,0,0.48)] md:!p-5"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.72)), url('/assets/pages/aboutus/awards.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >

              <h3 className="font-lust !mt-4 text-[1.5em] font-semibold leading-tight tracking-[0.01em] text-[var(--color-secondary)] md:text-[1.3em]">
                {award.AwardName}{' '}{award.year}
              </h3>

              <p className="!mt-3 text-[.8em] font-normal leading-7 tracking-normal text-[var(--color-secondary)]/90">
                {award.description}
              </p>

            
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
