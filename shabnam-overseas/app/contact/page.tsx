"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, Phone, Map } from "lucide-react";

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = "919569395949"; // Remove + and spaces for WhatsApp URL
    const message =
      "Hello! I'm interested in your rugs and would like to know more.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePhoneClick = () => {
    window.open("tel:+919569395949", "_self");
  };

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />

      <main className="pt-[125px] bg-white text-black">
        {/* Header Section - Made responsive */}
        <section className="text-center py-12 sm:py-16 md:py-20 bg-[#f5dfd6] min-h-[250px] sm:min-h-[300px] px-4 sm:px-6 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[AdvercaseFont-Demo-Regular] mb-3 sm:mb-4 leading-tight">
              We're Here to Help
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600">
              What's bothering you?
            </p>
          </div>
        </section>

        {/* Hours of Operation - Made responsive */}
        <section className="text-center py-8 sm:py-12 px-4 sm:px-6">
          <h2 className="text-base sm:text-lg font-semibold tracking-wide uppercase">
            Hours of Operation:
          </h2>
          <p className="mt-2 text-sm sm:text-base">Monday - Saturday</p>
          <p className="text-sm sm:text-base">9am - 5:00pm, IST</p>
        </section>

        {/* Contact Options - Fully responsive grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 text-center">
          <div className="p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 text-[#742402]" />
            <h3 className="text-base sm:text-lg font-medium mb-2">
              Info@shabnamoverseas.com
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Need to get in touch via email?
              <br />
              Contact us
            </p>
            <a
              href="mailto:Info@shabnamoverseas.com"
              className="underline text-[#742402] hover:text-[#5c1c01] transition-colors"
            >
              <button
                className="inline-flex items-center gap-2 px-4 py-2  bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg text-sm font-medium transition-colors mt-3"
              >
                <Mail size={16} />
                Mail us
              </button>
            </a>
          </div>

          <div className="p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 text-[#742402]" />
            <h3 className="text-base sm:text-lg font-medium mb-2">
              WhatsApp Chat
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Need an answer asap?
              <br />
              Contact us via WhatsApp.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-2 px-4 py-2  bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg text-sm font-medium transition-colors"
            >
              <MessageSquare size={16} />
              Open WhatsApp
            </button>
          </div>

          <div className="p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <Phone className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 text-[#742402]" />
            <h3 className="text-base sm:text-lg font-medium mb-2">Phone</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Prefer talking on the phone?
              <br />
              Call us: +91 9569395949
            </p>
            <button
              onClick={handlePhoneClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Phone size={16} />
              Call Now
            </button>
          </div>

          <div className="p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <Map className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 text-[#742402]" />
            <h3 className="text-base sm:text-lg font-medium mb-2">Address</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Kantit, Gajiya, Mirzapur, 231307
              <br />
              Uttar Pradesh, India
            </p>
            <button
              onClick={() =>
                window.open(
                  "https://maps.google.com/?q=Kantit,+Gajiya,+Mirzapur,+231307",
                  "_blank"
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2  bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg text-sm font-medium transition-colors mt-3"
            >
              <Map size={16} />
              View on Map
            </button>
          </div>
        </section>

        {/* Full Width Bottom Banner Image - Made responsive */}
        <section className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px]">
          <Image
            src="/images/contact-banner2.png"
            alt="Contact Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </section>

        {/* Footer Component */}
        <Footer />
      </main>
    </>
  );
}
