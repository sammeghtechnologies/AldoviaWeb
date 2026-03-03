import React from "react";
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer
      className="w-full bg-[var(--color-secondary)] bg-no-repeat text-[var(--color-primary)] font-area font-normal !pt-20 !pb-10 !px-6 md:!px-12 lg:!px-20"
      style={{
        backgroundImage:
          "url('/assets/logo/logo-wet-trans.png')",
        backgroundSize: "min(54vw, 620px)",
        backgroundPosition: "calc(100% + 86px) calc(100% + 15vh)",
      }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Brand */}
        <div className="text-center !mb-14">
          <h2 className="font-lust text-[3em] text-[var(--color-primary)]">
            Aldovia
          </h2>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Stay */}
          <div>
            <h4 className="font-lust text-sm tracking-wider uppercase !mb-4 text-[var(--color-primary)]">
              Stay
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Rooms & Suites</li>
              <li>Amenities</li>
              <li>Dining</li>
              <li>Spa</li>
            </ul>
          </div>

          {/* Weddings */}
          <div>
            <h4 className="font-lust text-sm tracking-wider uppercase !mb-4 text-[var(--color-primary)]">
              Weddings
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Venues</li>
              <li>Packages</li>
              <li>Gallery</li>
              <li>Testimonials</li>
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h4 className="font-lust text-sm tracking-wider uppercase !mb-4 text-[var(--color-primary)]">
              Corporate
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Conference Halls</li>
              <li>Team Retreats</li>
              <li>Facilities</li>
              <li>Request Proposal</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-lust text-sm tracking-wider uppercase !mb-4 text-[var(--color-primary)]">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} /> +91 80000 00000
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> info@aldovia.com
              </li>
              <li className="flex items-start gap-2">
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
