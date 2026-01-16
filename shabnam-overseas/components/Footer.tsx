"use client";

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTiktok,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { SiThreads } from "react-icons/si";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVIPSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Signing you up...");

    try {
      const response = await axios.post(
        "https://api.shabnamoverseas.com/api/vip-signup",
        { email }
      );

      if (response.status === 200) {
        toast.success("Welcome to the VIP club!", { id: toastId });
        setEmail(""); // Clear the input field
      } else {
        toast.error("Failed to sign up. Please try again.", { id: toastId });
      }
    } catch (error: any) {
      // console.error("VIP signup error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#f9f7f3] text-black px-6 md:px-12 pt-16 pb-10">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-300 pb-12">
        <div>
          <h3 className="text-2xl md:text-3xl mb-2 font-[AdvercaseFont-Demo-Regular]">
            Become a Shabnam VIP
          </h3>
          <p className="max-w-md text-sm">
            Get early access to sales, exclusive offers and more when you sign
            up for our newsletter.
          </p>
        </div>
        <form
          onSubmit={handleVIPSignup}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:max-w-md"
        >
          <input
            type="email"
            placeholder="Email Address"
            className="w-80 px-4 py-2 border rounded border-gray-300 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-[#742402] text-white text-xs px-6 py-3 uppercase hover:bg-white hover:text-[#742402] hover:border hover:border-[#742402] rounded transition"
            disabled={loading}
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* Link Columns */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-sm py-12">
        <div>
          <h4 className="font-bold mb-3">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="/stories">About Us</a>
            </li>
            {/* <li><a href="#">Careers</a></li> */}
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Customer Service</h4>
          <ul className="space-y-2">
            <li>
              <a href="/contact">Help Center</a>
            </li>
            <li>
              <a href="/orders">Track Your Order</a>
            </li>
            {/* <li><a href="#">Shipping & Returns</a></li> */}
            <li>
              <a href="/contact">Contact Us</a>
            </li>
            {/* <li><a href="#">Accessibility</a></li> */}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="/contact">Request Swatches</a>
            </li>
            <li>
              <a href="/contact">Artwork Guide</a>
            </li>
            <li>
              <a href="/contact">Fabric Guide</a>
            </li>
            <li>
              <a href="/contact">Rug Guide</a>
            </li>
            {/* <li><a href="#">Wallpaper Guide</a></li> */}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Shop</h4>
          <ul className="space-y-2">
            <li>
              <a href="/trade">Designer Trade</a>
            </li>
            <li>
              <a href="#">Rewards</a>
            </li>
            <li>
              <a href="/reviews">Reviews</a>
            </li>
            {/* <li><a href="#">Gift Cards</a></li> */}
          </ul>
        </div>
      </div>

      {/* Social & Legal */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 border-t border-gray-300 pt-6 gap-4">
        <div className="flex gap-4 text-xl">
          <a
            aria-label="Instagram"
            href="https://www.instagram.com/shabnam.overseas?igsh=MTRrM3J1Mzl0MDNsMQ%3D%3D&utm_source=qr"
          >
            <FaInstagram />
          </a>
          {/* <a aria-label="TikTok" href="#"><FaTiktok /></a> */}
          <a aria-label="Pinterest" href="https://pin.it/3iLcttFzQ">
            <FaPinterestP />
          </a>
          <a
            aria-label="Facebook"
            href="https://www.facebook.com/share/197rWRwdYa/?mibextid=wwXIfr"
          >
            <FaFacebookF />
          </a>
          {/* <a aria-label="YouTube" href="#"><FaYoutube /></a> */}
          <a
            aria-label="LinkedIn"
            href="https://www.linkedin.com/company/shabnam-overseas/"
          >
            <FaLinkedinIn />
          </a>
          <a
            aria-label="Threads"
            href="https://www.threads.com/@shabnam.overseas?igshid=NTc4MTIwNjQ2YQ=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiThreads />
          </a>
        </div>
        <div className="text-center md:text-left">
          <p className="mb-1">
            &copy; 2025 - Shabnam Exports. All Rights Reserved
          </p>
          <p>
            <a href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="/terms" className="hover:underline">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
