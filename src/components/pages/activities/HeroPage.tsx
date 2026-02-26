import React from "react";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import AnimatedImageHero from "../../ui/AnimatedImageHero";
import AcitivityDetails from "./AcitivityDetails";
import type { AcitivityDetailItem } from "./AcitivityDetails";

const ActivitiesHeroPage: React.FC = () => {
  const activityImages = [
    "/assets/herobackgrounds/activities/activity1.jpg",
    "/assets/herobackgrounds/activities/activity2.jpg",
    "/assets/herobackgrounds/activities/activity3.jpg",
  ];
  const activityDetails: AcitivityDetailItem[] = [
    {
      tab: "Indoor",
      title: "Table Tennis",
      subtitle: "Fast reflex rallies indoors",
      backgroundImage: "/assets/pages/activities/tabletennis/tabletennis.jpg",
      images: [
        "/assets/pages/activities/tabletennis/tabletennis.jpg",
        "/assets/pages/activities/tabletennis/tabletennis.jpg",
        "/assets/pages/activities/tabletennis/tabletennis.jpg",
        "/assets/pages/activities/tabletennis/tabletennis.jpg",
        "/assets/pages/activities/tabletennis/tabletennis.jpg",
        "/assets/pages/activities/tabletennis/tabletennis.jpg",
      ],
      description:
        "Enjoy quick-paced table tennis in a dedicated indoor setup designed for fun rallies, focused practice, and friendly competition.",
      whatIncludes: [
        "Indoor table tennis setup",
        "Friendly and practice play",
        "Comfortable recreation space",
      ],
      additionalSections: [
        {
          title: "Badminton",
          subtitle: "Agile indoor shuttle play",
          backgroundImage: "/assets/pages/activities/badminton/badminton.jpg",
          images: [
            "/assets/pages/activities/badminton/badminton.jpg",
            "/assets/pages/activities/badminton/badminton.jpg",
            "/assets/pages/activities/badminton/badminton.jpg",
            "/assets/pages/activities/badminton/badminton.jpg",
            "/assets/pages/activities/badminton/badminton.jpg",
            "/assets/pages/activities/badminton/badminton.jpg",
          ],
          description:
            "Play energetic badminton matches indoors with space suited for quick movement and enjoyable rallies.",
          whatIncludes: [
            "Indoor badminton access",
            "Singles and doubles play",
            "Recreational match setup",
          ],
        },
        {
          title: "Billiards",
          subtitle: "Classic precision gameplay",
          backgroundImage: "/assets/pages/activities/billiards/billiards.jpg",
          images: [
            "/assets/pages/activities/billiards/billiards.jpg",
            "/assets/pages/activities/billiards/billiards.jpg",
            "/assets/pages/activities/billiards/billiards.jpg",
            "/assets/pages/activities/billiards/billiards.jpg",
            "/assets/pages/activities/billiards/billiards.jpg",
            "/assets/pages/activities/billiards/billiards.jpg",
          ],
          description:
            "Enjoy billiards in a relaxed indoor setting perfect for strategic games and social play.",
          whatIncludes: [
            "Billiards table access",
            "Casual and focused play",
            "Indoor leisure environment",
          ],
        },
        {
          title: "Squash",
          subtitle: "High-intensity indoor action",
          backgroundImage: "/assets/pages/activities/squash/squash.jpg",
          images: [
            "/assets/pages/activities/squash/squash.jpg",
            "/assets/pages/activities/squash/squash.jpg",
            "/assets/pages/activities/squash/squash.jpg",
            "/assets/pages/activities/squash/squash.jpg",
            "/assets/pages/activities/squash/squash.jpg",
            "/assets/pages/activities/squash/squash.jpg",
          ],
          description:
            "Take on fast-paced squash sessions in a dynamic indoor court built for agility and endurance.",
          whatIncludes: [
            "Indoor squash court access",
            "Practice and match play",
            "Active training environment",
          ],
        },
        {
          title: "Carrom",
          subtitle: "Timeless indoor board game",
          backgroundImage: "/assets/pages/activities/carrom/carrom.jpg",
          images: [
            "/assets/pages/activities/carrom/carrom.jpg",
            "/assets/pages/activities/carrom/carrom.jpg",
            "/assets/pages/activities/carrom/carrom.jpg",
            "/assets/pages/activities/carrom/carrom.jpg",
            "/assets/pages/activities/carrom/carrom.jpg",
            "/assets/pages/activities/carrom/carrom.jpg",
          ],
          description:
            "Relax with classic carrom games in a cozy indoor space ideal for friendly rounds and family fun.",
          whatIncludes: [
            "Carrom board setup",
            "Leisure group gameplay",
            "Indoor social activity space",
          ],
        },
      ],
    },
    {
      tab: "Outdoor",
      title: "Basketball",
      subtitle: "Fast-paced full-court action",
      images: [
        "/assets/pages/activities/basketball/basketball1.jpg",
        "/assets/pages/activities/basketball/basketball1.jpg",
        "/assets/pages/activities/basketball/basketball1.jpg",
        "/assets/pages/activities/basketball/basketball1.jpg",
        "/assets/pages/activities/basketball/basketball1.jpg",
        "/assets/pages/activities/basketball/basketball1.jpg",
      ],
      description:
      "Enjoy energetic basketball sessions on a spacious outdoor court designed for team games, practice, and casual competition.",
    whatIncludes: [
      "Outdoor basketball court access",
      "Recreational and practice play",
      "Space for group matches",
    ],
      additionalSections: [
        {
          title: "Lawn Tennis",
          subtitle: "Precision play in open air",
          backgroundImage: "/assets/pages/activities/lawn/lawn1.jpg",
          images: [
            "/assets/pages/activities/lawn/lawn1.jpg",
            "/assets/pages/activities/lawn/lawn1.jpg",
            "/assets/pages/activities/lawn/lawn1.jpg",
            "/assets/pages/activities/lawn/lawn1.jpg",
            "/assets/pages/activities/lawn/lawn1.jpg",
            "/assets/pages/activities/lawn/lawn1.jpg",
          ],
          description:
            "Experience lawn tennis in a refreshing outdoor setting, ideal for friendly rallies, training routines, and competitive games.",
          whatIncludes: [
            "Lawn tennis court access",
            "Singles and doubles play support",
            "Open-air training environment",
          ],
        },
        {
          title: "Swimming Pool",
          subtitle: "Relaxed laps and leisure time",
          backgroundImage: "/assets/pages/activities/swimming/swim1.jpg",
          images: [
            "/assets/pages/activities/swimming/swim1.jpg",
            "/assets/pages/activities/swimming/swim2.jpg",
            "/assets/pages/activities/swimming/swim3.jpg",
            "/assets/pages/activities/swimming/swim4.jpg",
            "/assets/pages/activities/swimming/swim1.jpg",
            "/assets/pages/activities/swimming/swim2.jpg",
          ],
          description:
            "Unwind at the swimming pool with calm leisure sessions, refreshing laps, and a serene atmosphere for all-day relaxation.",
          whatIncludes: [
            "Pool access for leisure and laps",
            "Comfortable poolside environment",
            "Family-friendly outdoor setting",
          ],
        },
        {
          title: "Cycling",
          subtitle: "Scenic rides and active exploration",
          backgroundImage: "/assets/pages/activities/cycling/cycling1.jpg",
          images: [
            "/assets/pages/activities/cycling/cycling1.jpg",
            "/assets/pages/activities/cycling/cycling1.jpg",
            "/assets/pages/activities/cycling/cycling1.jpg",
            "/assets/pages/activities/cycling/cycling1.jpg",
            "/assets/pages/activities/cycling/cycling1.jpg",
            "/assets/pages/activities/cycling/cycling1.jpg",
          ],
          description:
            "Take in the surroundings with cycling experiences crafted for both relaxed rides and active outdoor movement.",
          whatIncludes: [
            "Scenic route riding access",
            "Open-space cycling experience",
            "Suitable for solo and group rides",
          ],
        },
      ],
    },
    {
      tab: "Wellness & Spa",
      title: "Exotica Spa & Wellness",
      subtitle: "Rejuvenate Your Senses",
      backgroundImage: "/assets/pages/activities/spa/spa2.jpg",
      images: [
        "/assets/pages/activities/spa/spa1.jpg",
        "/assets/pages/activities/spa/spa2.jpg",
        "/assets/pages/activities/spa/spa3.jpg",
        "/assets/pages/activities/spa/spa4.jpeg",
        "/assets/pages/activities/spa/spa5.jpeg",
        "/assets/pages/activities/spa/spa6.jpeg",
      ],
      description:
        "Indulge in our world-class spa treatments featuring Ayurvedic therapies, aromatherapy, and modern wellness practices.",
      whatIncludes: [
        "Signature Massages",
        "Guided Meditation Sessions",
        "Steam, Sauna & Wellness Lounge Access",
      ],
      additionalSections: [
        {
          title: "Persona",
          subtitle: "Personalized wellness for your lifestyle",
          backgroundImage: "/assets/pages/activities/persona/persona1.jpg",
          images: [
            "/assets/pages/activities/persona/persona1.jpg",
            "/assets/pages/activities/persona/persona2.jpg",
            "/assets/pages/activities/persona/persona3.jpg",
            "/assets/pages/activities/persona/persona4.jpg",
            "/assets/pages/activities/persona/persona4.jpg",
            "/assets/pages/activities/persona/persona4.jpg",
          ],
          description:
            "For guests who value mindful living, recovery, and premium self-care rituals in a calm, restorative environment.",
          whatIncludes: [
            "Personal wellness profiling",
            "Guided relaxation recommendations",
            "Customized rejuvenation journeys",
          ],
        },
        {
          title: "Gym",
          subtitle: "Strength, cardio, and functional training",
          backgroundImage: "/assets/pages/activities/gym/gym1.jpg",
          images: [
            "/assets/pages/activities/gym/gym1.jpg",
            "/assets/pages/activities/gym/gym2.jpg",
            "/assets/pages/activities/gym/gym3.jpg",
            "/assets/pages/activities/gym/gym3.jpg",
            "/assets/pages/activities/persona/persona4.jpg",
            "/assets/pages/activities/persona/persona4.jpg",
          ],
          description:
            "A modern fitness zone designed for strength, cardio, and mobility training, with a balanced focus on performance and wellness.",
          whatIncludes: [
            "Cardio and strength equipment",
            "Functional training area",
            "Stretch and recovery corner",
          ],
        },
      ],
    },
  ];

  return (
    <section className="relative min-h-screen w-full">
      <MenuFrame showBookNow={false} />
      <AnimatedImageHero
        images={activityImages}
        title="Activities"
        subtitle="Discover wellness, adventure, and relaxation"
        buttonLabel="Explore Activities"
        enableEntryAnimation
        entryDuration={2.1}
        enableTypingSubtitle
        centerContentClassName="-translate-y-10 lg:translate-y-0 lg:!w-full lg:!mx-auto lg:text-center [&_h1]:!text-[var(--color-secondary)] [&_p]:!text-[var(--color-secondary)] [&_p]:!mt-3 [&_p]:!mb-10"
        controlsWrapperClassName="absolute bottom-[10%] left-1/2 z-30 w-[min(92%,520px)] -translate-x-1/2"
        controlsClassName="!mt-0 !px-0"
        controlsProgressBarClassName="!w-[140px] !max-w-[140px] shrink-0"
      />
      <AcitivityDetails
        details={activityDetails}
        defaultTab="Indoor"
        backgroundImage="/assets/herobackgrounds/herobanner/corridor.jpg"
      />
    </section>
    
  );
};

export default ActivitiesHeroPage;
