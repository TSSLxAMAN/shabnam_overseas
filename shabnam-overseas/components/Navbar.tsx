"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Search,
  Heart,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  UserRoundCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/UserAuthContext";
import GlobalSearch from "@/components/GlobalSearch";

export default function Navbar({
  forceWhite = false,
  disableScrollEffect = false,
}: {
  forceWhite?: boolean;
  disableScrollEffect?: boolean;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<
    Record<string, boolean>
  >({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // NEW: navbar visibility
  const [lastScrollY, setLastScrollY] = useState(0); // NEW: track last scroll position
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, admin, logout, adminLogout } = useAuth();
  const router = useRouter();

  // map top-level labels -> exact routes (used for top row clicks)
  const linkMap: Record<string, string> = {
    Shop: "/shop",
    Style: "/style",
    Stories: "/stories",
    Custom: "/custom",
    Trade: "/trade",
  };

  useEffect(() => {
    if (forceWhite || disableScrollEffect) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceWhite, disableScrollEffect]);

  // NEW: Auto-hide/show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when:
      // 1. At the top of the page (< 10px)
      // 2. Scrolling up
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
        // Close dropdowns when hiding
        setActiveDropdown(null);
        setShowSearch(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const navLinks = [
    { label: "Shop", dropdown: true },
    { label: "Style", dropdown: true },
    { label: "Stories", dropdown: true },
    { label: "Custom", dropdown: false },
    { label: "Trade", dropdown: false },
  ];

  const dropdownContent = {
    Shop: [
      {
        title: "BY TYPE",
        links: [
          "Hand-Knotted",
          "Hand-Tufted",
          "Hand Woven",
          "Hand Loom",
          "Tibetan Weave",
        ],
      },
      {
        title: "BY ROOM",
        links: ["Living Room", "Bedroom", "Dining Room", "Hallway"],
      },
      { title: "BY COLOR", links: ["Red", "Blue", "Beige", "Green", "Grey"] },
      {
        title: "NEW ARRIVALS",
        links: ["Latest Rugs", "Trending Styles", "Bestsellers"],
      },
    ],
    Style: [
      {
        title: "STYLES",
        links: ["Modern", "Traditional", "Bohemian", "Minimalist", "Vintage"],
      },
    ],
    Stories: [
      {
        title: "Stories",
        links: [
          {
            text: "Designer Stories",
            image: "/images/hero1.jpg",
            desc: "Discover unique perspectives",
          },
          {
            text: "Behind the Loom",
            image: "/images/hero1.jpg",
            desc: "See the weaving process",
          },
          {
            text: "Styling Tips",
            image: "/images/hero1.jpg",
            desc: "Get inspired with expert ideas",
          },
          {
            text: "Customer Stories",
            image: "/images/hero1.jpg",
            desc: "Real homes. Real style.",
          },
          {
            text: "Journal",
            image: "/images/hero1.jpg",
            desc: "Thoughts and news",
          },
        ],
      },
    ],
  } as const;

  const handleAdminLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  const backgroundClass =
    forceWhite || isScrolled || isHovered
      ? "bg-white text-black shadow-md"
      : "bg-transparent text-white";

  /** Build /shop?... or /style?... based on parent label + section */
  const buildFilterHref = (
    parentLabel: string,
    sectionTitle: string,
    label: string
  ) => {
    let key = "";
    switch (sectionTitle) {
      case "Styles":
      case "Style":
        key = "style";
        break;
      case "By Type":
        key = "byType";
        break;
      case "By Room":
        key = "byRoom";
        break;
      case "By Color":
        key = "byColor";
        break;
      case "By Material":
        key = "byMaterial";
        break;
      default:
        key = "filter";
    }
    const base =
      parentLabel === "Shop"
        ? "/shop/filter"
        : parentLabel === "Style"
        ? "/style"
        : "/style";
    return `${base}?${key}=${encodeURIComponent(label.toUpperCase())}`;
  };

  /** Single dropdown renderer under the nav (prevents hover gaps/flicker) */
  const renderDropdown = (label: string | null) => {
    if (!label) return null;
    if (label === "Custom" || label === "Trade") return null;

    return (
      <div className="absolute inset-x-0 top-full bg-white text-black shadow-lg py-8 px-8 z-[70] transition-all duration-200">
        <div className="max-w-7xl mx-auto">
          {label === "Stories" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {dropdownContent.Stories[0].links.map((item, i) => (
                <Link
                  key={i}
                  href={`/stories/${item.text
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="hover:text-sand flex flex-col items-center"
                >
                  <img
                    src={item.image}
                    alt={item.text}
                    className="w-28 h-28 object-cover rounded-md"
                  />
                  <h5 className="font-semibold text-sm mt-2 text-center">
                    {item.text}
                  </h5>
                  <p className="text-xs text-gray-600 text-center">
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>
          ) : label === "Style" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {dropdownContent.Style.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-sm mb-2">
                    {section.title}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {section.links.map((linkLabel, i) => (
                      <li key={i}>
                        <Link
                          href={buildFilterHref(
                            "Style",
                            section.title,
                            linkLabel
                          )}
                          className="hover:text-sand"
                        >
                          {linkLabel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            // Shop dropdown
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {dropdownContent.Shop.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-sm mb-2">
                    {section.title}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {section.links.map((lnk, i) => {
                      const labelText =
                        typeof lnk === "string" ? lnk : (lnk as any).text;
                      return (
                        <li key={i}>
                          <Link
                            href={buildFilterHref(
                              "Shop",
                              section.title,
                              labelText
                            )}
                            className="hover:text-sand"
                          >
                            {labelText}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <header
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${backgroundClass} ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex justify-between items-center">
        {/* LEFT: appointment + (mobile) search + menu */}
        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-light uppercase">
          <Link
            href="/appointment"
            className="flex items-center gap-1 hover:text-sand"
          >
            <Calendar size={16} />
            <span className="hidden sm:inline">Book an appointment</span>
          </Link>

          {/* Mobile search toggle (moves to left on small screens) */}
          <button
            aria-label="Toggle search"
            className="block lg:hidden p-1.5 rounded-md hover:bg-black/5"
            onClick={() => setShowSearch((s) => !s)}
          >
            <Search size={18} />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="ml-1 block lg:hidden"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* LOGO */}
        <Link
          href="/"
          className="font-[ShabnamElegant] text-sm sm:text-xl md:text-2xl lg:text-4xl tracking-widest whitespace-nowrap"
        >
          SHABNAM OVERSEAS
        </Link>

        {/* RIGHT: desktop search + wishlist + user + cart */}
        <div className="flex items-center gap-2 sm:gap-4 relative">
          {/* Desktop search toggle */}
          <button
            aria-label="Toggle search"
            className="hidden lg:inline-flex p-1.5 rounded-md hover:bg-black/5"
            onClick={() => setShowSearch((s) => !s)}
          >
            <Search size={18} />
          </button>

          <Link href="/wishlist" className="relative">
            <Heart size={16} />
          </Link>

          {admin ? (
            <div ref={userMenuRef} className="relative">
              <button onClick={() => setShowUserMenu((prev) => !prev)}>
                <UserRoundCheck
                  size={16}
                  strokeWidth={1.25}
                  absoluteStrokeWidth
                />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow text-black z-[90]">
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleAdminLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : user ? (
            <div ref={userMenuRef} className="relative">
              <button onClick={() => setShowUserMenu((prev) => !prev)}>
                <UserRoundCheck
                  size={16}
                  strokeWidth={1.25}
                  absoluteStrokeWidth
                />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow text-black z-[90]">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <User size={16} />
            </Link>
          )}

          <Link href="/cart" className="relative">
            <ShoppingCart size={16} />
          </Link>
        </div>
      </div>

      {/* Desktop nav — dropdown lives inside THIS element, so no hover gaps */}
      <nav
        className="hidden lg:block mt-2 border-t border-white/20 relative z-[60]"
        onMouseLeave={() => {
          setActiveDropdown(null);
          setHoveredLink(null);
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-10 flex justify-center gap-4 sm:gap-10 py-3 uppercase text-xs sm:text-sm font-light">
          {navLinks.map(({ label, dropdown }) => (
            <div
              key={label}
              onMouseEnter={() => {
                setHoveredLink(label);
                setActiveDropdown(dropdown ? label : null);
              }}
              className="px-1"
            >
              <Link
                href={
                  linkMap[label] ||
                  `/${label.toLowerCase().replace(/\s+/g, "-")}`
                }
                className="hover:text-sand flex items-center gap-1 relative"
              >
                {label} {dropdown && <ChevronDown size={14} />}
                <span
                  className={`absolute bottom-0 left-0 h-[3px] bg-[#742402] transition-all duration-300 ${
                    hoveredLink === label ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Single dropdown panel for whichever label is active */}
        {renderDropdown(activeDropdown)}
      </nav>

      {/* Slide-down search below navbar */}
      <div
        className={`border-t transition-[max-height]   duration-300 overflow-hidden ${
          showSearch
            ? "max-h-[420px] border-neutral-200"
            : "max-h-0 border-transparent"
        }`}
      >
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <GlobalSearch onClose={() => setShowSearch(false)} />
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={`border-t transition-[max-height]   duration-300 overflow-hidden p-6 ${
            isMobileMenuOpen
              ? "max-h-[520px] border-neutral-200"
              : "max-h-0 border-transparent"
          }`}
        >
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-20 right-6"
          >
            <X size={28} />
          </button>
          <ul className="space-y-6 mt-12 text-lg uppercase font-light">
            {navLinks.map(({ label, dropdown }) => (
              <li key={label}>
                {dropdown ? (
                  <div>
                    {/* Main label - clickable link */}
                    <Link
                      href={
                        linkMap[label] ||
                        `/${label.toLowerCase().replace(/\s+/g, "-")}`
                      }
                      className="block hover:text-sand py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                    {/* Separate dropdown toggle */}
                    <button
                      onClick={() => toggleMobileDropdown(label)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-sand mt-1"
                      aria-label={`Toggle ${label} submenu`}
                    >
                      View all {label.toLowerCase()} categories
                      {mobileDropdowns[label] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    {mobileDropdowns[label] && (
                      <ul className="pl-4 mt-2 space-y-2 text-sm">
                        {(dropdownContent as any)[label].map(
                          (section: any, idx: number) => (
                            <li key={idx}>
                              <h5 className="font-semibold text-xs mb-1">
                                {section.title}
                              </h5>
                              <ul className="space-y-1">
                                {section.links.map((lnk: any, i: number) => {
                                  const labelText =
                                    typeof lnk === "string" ? lnk : lnk.text;
                                  return (
                                    <li key={i}>
                                      <Link
                                        href={buildFilterHref(
                                          label,
                                          section.title,
                                          labelText
                                        )}
                                        className="block hover:text-sand"
                                        onClick={() =>
                                          setIsMobileMenuOpen(false)
                                        }
                                      >
                                        {labelText}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={
                      linkMap[label] ||
                      `/${label.toLowerCase().replace(/\s+/g, "-")}`
                    }
                    className="flex justify-between items-center w-full hover:text-sand"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
