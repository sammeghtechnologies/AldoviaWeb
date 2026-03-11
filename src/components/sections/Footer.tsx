import React from "react";
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer
      className="relative w-full overflow-hidden bg-[var(--color-secondary)] bg-no-repeat text-[var(--color-primary)] font-area font-normal !pb-10 !px-6 md:!px-12 lg:!px-20 lg:min-h-[min(900px,100vh)]"
    >

<div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-8%] right-[-58%] z-0 translate-y-0 bg-no-repeat opacity-[0.14] [--logo-size:clamp(20rem,300vw,36rem)] md:bottom-[-32%] md:right-[-35%] md:translate-y-[28%] md:opacity-[0.15] md:[--logo-size:100vw]"
        style={{
          backgroundImage: "url('/assets/logo/brownsmall-bg.svg')",
          backgroundSize: "var(--logo-size)",
          backgroundPosition: "right bottom",
          width: "var(--logo-size)",
          height: "var(--logo-size)",
        }}
      />
      <div className="relative z-10 max-w-12xl mx-auto lg:flex lg:min-h-[min(100vh)] lg:flex-col lg:justify-center">

        {/* Brand */}
        <div className="flex w-full justify-center !mb-14 px-4">
          <img
            src="/assets/logo/aldoviatext.png"
            alt="Aldovia"
            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px] h-auto object-contain"
          />
        </div>

        {/* Links Grid */}
        <div className="grid w-full max-w-12xl mx-auto grid-cols-2 gap-10 md:grid-cols-4 lg:justify-items-center lg:gap-x-16 xl:gap-x-24">

          {/* Stay */}
          <div>
            <h4 className="font-lust text-sm tracking-wider uppercase !mb-4 text-[var(--color-primary)]">
              Stay
            </h4>
            <span className="block !mt-3 !mb-2 h-[2px] w-16 rounded-full bg-[var(--color-primary)]" />

            <ul className="space-y-2 text-sm">
              <li>Rooms & Suites</li>
              <li className="!pt-3">Amenities</li>
              <li className="!pt-3">Dining</li>
              <li className="!pt-3">Spa</li>
            </ul>
          </div>

          {/* Weddings */}
          <div>
            <h4 className="font-lust text-sm tracking-wider uppercase !mb-4 text-[var(--color-primary)]">
              Weddings
            </h4>
            <span className="block !mt-3 !mb-2 h-[2px] w-16 rounded-full bg-[var(--color-primary)]" />

            <ul className="space-y-2 text-sm">
              <li>Venues</li>
              <li className="!pt-3">Packages</li>
              <li className="!pt-3">Gallery</li>
              <li className="!pt-3">Testimonials</li>
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h4 className="font-lust text-sm tracking-wider uppercase !mb-4 text-[var(--color-primary)]">
              Corporate
            </h4>
            <span className="block !mt-3 !mb-2 h-[2px] w-16 rounded-full bg-[var(--color-primary)]" />

            <ul className="space-y-2 text-sm">
              <li>Conference Halls</li>
              <li className="!pt-3">Team Retreats</li>
              <li className="!pt-3">Facilities</li>
              <li className="!pt-3">Request Proposal</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-lust text-sm tracking-wider uppercase !mb-4 text-[var(--color-primary)]">
              Contact
            </h4>
            <span className="block !mt-3 !mb-2 h-[2px] w-16 rounded-full bg-[var(--color-primary)]" />

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-[2px] shrink-0" />
                <div className="leading-relaxed">
                  <div>+08 3507 7000</div>
                  <div>For Bookings, Please Contact</div>
                  <div>+08 3101 3831 (09 am to 06 pm)</div>
                </div>
              </li>
              <li className="!pt-3 flex items-center gap-2">
                <Mail size={16} className="shrink-0" />
                <a href="mailto:info@aldovia.in" className="underline underline-offset-2">
                  info@aldovia.in
                </a>
              </li>
              <li className="!pt-3 flex items-start gap-2">
                <MapPin size={16} className="mt-[2px] shrink-0" />
                <span className="leading-relaxed !text-[var(--color-primary)]">
                  Swiss Town, Hollywood Junction, Sadahalli Post, Devanahalli Taluk, Bangalore, India, 562110
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-secondary)]/25 !my-12" />

        {/* Social Icons */}
        <div className="flex justify-center gap-6 !mb-8">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition duration-300"
          >
            <Instagram size={18} />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition duration-300"
          >
            <Facebook size={18} />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition duration-300"
          >
            <Twitter size={18} />
          </a>
        </div>

        {/* Bottom Text */}
        <div className="text-center text-xs text-[var(--color-secondary)]/70">
          © 2025 Aldovia. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
