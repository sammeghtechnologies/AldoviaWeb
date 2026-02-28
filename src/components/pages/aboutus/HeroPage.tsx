import React from "react";
import { useNavigate } from "react-router";
import MenuFrame from "../../MenuFrame/v2/MenuFrame";
import HeroBreadcrumb from "../../ui/HeroBreadcrumb";
import Footer from "../../sections/Footer";
import AboutInfoSection from "./AboutInfoSection";
import AboutUs from "./AboutUs";
import TeamSection from "./TeamSection";
import AwardsSection from "./AwardsSection";

const AboutUsHeroPage: React.FC = () => {
  const navigate = useNavigate();


  return (
    <section className="relative min-h-screen w-full">
      <MenuFrame showBookNow={false} />
      <div className="absolute left-5 top-24 z-[2147483645] md:left-8 md:top-26">
        <HeroBreadcrumb label="About Us" onHomeClick={() => navigate("/home")} />
      </div>
     
      <AboutUs />
      <AboutInfoSection />

      <TeamSection />
      <AwardsSection />
      <Footer />
    </section>
  );
};

export default AboutUsHeroPage;
