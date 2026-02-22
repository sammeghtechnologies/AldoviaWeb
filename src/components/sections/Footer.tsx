import React from "react";
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0F1A2A] text-[#C8D0DA] !pt-20 !pb-10 !px-6 md:!px-12 lg:!px-20">
      <div className="max-w-6xl mx-auto">

        {/* Brand */}
        <div className="text-center !mb-14">
          <h2 className="text-[#D4AF37] text-[28px] font-medium [font-family:'Playfair_Display']">
            Aldovia
          </h2>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Stay */}
          <div>
            <h4 className="text-[#D4AF37] text-sm tracking-wider uppercase !mb-4">
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
            <h4 className="text-[#D4AF37] text-sm tracking-wider uppercase !mb-4">
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
            <h4 className="text-[#D4AF37] text-sm tracking-wider uppercase !mb-4">
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
            <h4 className="text-[#D4AF37] text-sm tracking-wider uppercase !mb-4">
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
        <div className="border-t border-[#1E2B3C] !my-12" />

        {/* Social Icons */}
        <div className="flex justify-center gap-6 !mb-8">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[#1B2736] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition duration-300"
          >
            <Instagram size={18} />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[#1B2736] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition duration-300"
          >
            <Facebook size={18} />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[#1B2736] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition duration-300"
          >
            <Twitter size={18} />
          </a>
        </div>

        {/* Bottom Text */}
        <div className="text-center text-xs text-[#7F8A99]">
          © 2025 Aldovia. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;