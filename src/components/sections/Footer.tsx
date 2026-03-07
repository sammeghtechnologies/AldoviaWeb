import React from "react";
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer
      className="relative w-full overflow-hidden bg-[var(--color-secondary)] bg-no-repeat text-[var(--color-primary)] font-area font-normal !pt-20 !pb-10 !px-6 md:!px-12 lg:!px-20"
    >

<div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-32%] right-[-35%] z-0 translate-y-[10%] md:translate-y-[28%] bg-no-repeat opacity-10 md:opacity-[0.15]"
        style={{
          backgroundImage: "url('/assets/logo/brownsmall-bg.svg')",
          backgroundSize: "min(100vw)",
          backgroundPosition: "right bottom",
          width: "min(100vw)",
          height: "min(100vw)",
        }}
      />
      <div className="max-w-6xl mx-auto">

        {/* Brand */}
        <div className="flex w-max-12 !mb-14 justify-center">
         <img
           src="/assets/logo/aldoviatext.png"
           alt="Aldovia"
           className="mx-auto w-full max-w-[280px] h-auto"
         />
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

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
              <li className="flex items-center gap-2">
                <Phone size={16} /> 080 35077000 (Sales)
              </li>
              <li className="!pt-3 flex items-center gap-2">
                <Phone size={16} /> 080 31013031 (Hotel)
              </li>
              <li className="!pt-3 flex items-center gap-2">
                <Mail size={16} /> info@aldovia.in
              </li>
              <li className="!pt-3 flex items-start gap-2">
                <MapPin size={16} /> Bangalore, Karnataka
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
