"use client";
import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Heart,
  ChevronDown,
  Globe,
  Hand,
  Sparkles,
  Recycle,
  Users,
  Home,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthContext } from "@/app/context/UserAuthContext";

type Product = {
  _id: string;
  name: string;
  description: string;
  image: string[];
  category: string;
  sizes: { label: string; price: number; stock: number }[];
  colors: { label: string }[];
  byType: string;
  byRoom: string;
  style: string;
  dimensions?: string;
  material?: string;
  careInformation?: string;
  additionalDetails?: string;
  shippingReturns?: string;
};

// Currency conversion rates (you might want to fetch these from an API)
const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012, // Example rate: 1 INR = 0.012 USD
};

type Currency = "INR" | "USD";

const convertCurrency = (value: number, currency: Currency) => {
  const convertedValue = value * EXCHANGE_RATES[currency];

  if (currency === "INR") {
    return `₹${convertedValue.toLocaleString("en-IN")}`;
  } else {
    return `$${convertedValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};

// Accordion Component
const AccordionItem = ({
  title,
  content,
  isOpen,
  onToggle,
}: {
  title: string;
  content?: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  if (!content) return null;

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-[#742402] transition-colors"
      >
        <span className="font-medium text-sm uppercase tracking-wide">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({
  product,
  onViewProduct,
  currency,
}: {
  product: Product;
  onViewProduct: (id: string) => void;
  currency: Currency;
}) => {
  const { user } = useContext(AuthContext);
  const [discount, setDiscount] = useState<number>(0);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user?.role === "trader") {
      (async () => {
        try {
          const res = await axios.get(
            "https://api.shabnamoverseas.com/api/discounts"
          );
          const discountValue = res.data?.data?.[0]?.value || 0;
          setDiscount(discountValue);
        } catch (err) {
          setDiscount(0);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(
          "https://api.shabnamoverseas.com/api/users/wishlist",
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const wishlistIds = data.map((item: any) => item._id || item);
        setWishlistedIds(new Set(wishlistIds));
      } catch (error) {
        // handle error
      }
    };
    fetchWishlist();
  }, [user]);

  const handleToggleWishlist = async (
    e: React.MouseEvent,
    productId: string
  ) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }

    if (wishlistedIds.has(productId)) {
      try {
        const { data } = await axios.delete(
          `https://api.shabnamoverseas.com/api/users/wishlist/${productId}`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success(data?.message || "Removed from wishlist");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error removing from wishlist"
        );
      }
    } else {
      try {
        const { data } = await axios.post(
          `https://api.shabnamoverseas.com/api/users/wishlist/${productId}`,
          {},
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.add(productId);
          return next;
        });
        toast.success(data?.message || "Added to wishlist");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error adding to wishlist"
        );
      }
    }
  };

  const getPrice = () => {
    if (!product.sizes || product.sizes.length === 0) return 0;
    const basePrice = Math.min(...product.sizes.map((s) => s.price));

    if (user?.role === "trader" && discount > 0) {
      return basePrice - (basePrice * discount) / 100;
    }
    return basePrice;
  };

  const getOriginalPrice = () => {
    if (!product.sizes || product.sizes.length === 0) return 0;
    return Math.min(...product.sizes.map((s) => s.price));
  };

  const isWishlisted = wishlistedIds.has(product._id);
  const finalPrice = getPrice();
  const originalPrice = getOriginalPrice();
  const showDiscount = user?.role === "trader" && discount > 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative aspect-[3/4] overflow-hidden">
        {product.image && product.image.length > 0 ? (
          <Image
            src={product.image[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        <button
          onClick={(e) => handleToggleWishlist(e, product._id)}
          className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className="h-4 w-4"
            stroke={isWishlisted ? "#ef4444" : "#374151"}
            fill={isWishlisted ? "#ef4444" : "none"}
          />
        </button>

        {showDiscount && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-medium mb-2 line-clamp-2 group-hover:text-[#742402] transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="mb-4">
          {showDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through text-sm">
                {convertCurrency(originalPrice, currency)}
              </span>
              <span className="text-[#742402] font-bold text-lg">
                {convertCurrency(finalPrice, currency)}
              </span>
            </div>
          ) : (
            <span className="text-[#742402] font-bold text-lg">
              {convertCurrency(finalPrice, currency)}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewProduct(product._id)}
            className="flex-1 px-4 py-2 bg-[#742402] hover:bg-[#5c1c01] text-white rounded-lg transition-colors font-medium text-sm"
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [openAccordion, setOpenAccordion] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("INR");

  useEffect(() => {
    if (user?.role === "trader") {
      (async () => {
        try {
          const res = await axios.get(
            "https://api.shabnamoverseas.com/api/discounts"
          );
          const discountValue = res.data?.data?.[0]?.value || 0;
          setDiscount(discountValue);
        } catch (err) {
          setDiscount(0);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.shabnamoverseas.com/api/products/${id}`
        );
        const data = res.data as Product;

        setProduct(data);

        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0].label);
        }
        if (data.colors?.length > 0) {
          setSelectedColor(data.colors[0].label);
        }
        setQuantity(1);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setRelatedLoading(true);
      try {
        const res = await axios.get(
          "https://api.shabnamoverseas.com/api/products"
        );
        const allProducts = res.data.products as Product[];

        const filteredProducts = allProducts.filter((p) => p._id !== id);
        const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 4));
      } catch (err) {
        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    if (id) {
      fetchRelatedProducts();
    }
  }, [id]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(
          "https://api.shabnamoverseas.com/api/users/wishlist",
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const wishlistIds = data.map((item: any) => item._id || item);
        setWishlistedIds(new Set(wishlistIds));
      } catch (error) {
        // handle error
      }
    };
    fetchWishlist();
  }, [user]);

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }
    if (wishlistedIds.has(productId)) {
      try {
        const { data } = await axios.delete(
          `https://api.shabnamoverseas.com/api/users/wishlist/${productId}`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success(data?.message || "Removed from wishlist");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error removing from wishlist"
        );
      }
    } else {
      try {
        const { data } = await axios.post(
          `https://api.shabnamoverseas.com/api/users/wishlist/${productId}`,
          {},
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.add(productId);
          return next;
        });
        toast.success(data?.message || "Added to wishlist");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Error adding to wishlist"
        );
      }
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const res = await fetch("https://api.shabnamoverseas.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          productId,
          selectedSize,
          selectedColor,
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Failed to add to cart");
        return;
      }

      if (data.appliedDiscount > 0) {
        toast.success(
          `Added to cart with ${data.appliedDiscount}% trader discount!`
        );
      } else {
        toast.success("Added to cart");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar forceWhite={true} disableScrollEffect={true} />
        <main className="pt-[170px] bg-white text-black w-full">
          <section className="text-center bg-[#f5dfd6] px-4 sm:px-6">
            <div className="w-full max-w-6xl mx-auto py-12 sm:py-16 md:py-20">
              <div className="h-10 w-64 mx-auto bg-gray-200 rounded animate-pulse" />
              <div className="mt-3 h-5 w-80 mx-auto bg-gray-200 rounded animate-pulse" />
            </div>
          </section>
          <section className="px-4 sm:px-6 lg:px-10 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="rounded-2xl bg-gray-200 aspect-square animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar forceWhite={true} disableScrollEffect={true} />
        <main className="pt-[170px] bg-white text-black w-full">
          <section className="text-center bg-[#f5dfd6] px-4 sm:px-6">
            <div className="w-full max-w-6xl mx-auto py-12 sm:py-16 md:py-20">
              <h1 className="uppercase font-[AdvercaseFont-Demo-Regular] mb-3 leading-[0.95] break-words text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                PRODUCT
              </h1>
              <p className="text-gray-600 text-base sm:text-lg md:text-2xl">
                Not found
              </p>
            </div>
          </section>
          <section className="px-4 sm:px-6 lg:px-10 py-12">
            <div className="max-w-6xl mx-auto text-gray-600">
              Sorry, this item isn't available.
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const images = Array.isArray(product.image)
    ? product.image.filter(Boolean)
    : [];
  const isWishlisted = wishlistedIds.has(product._id);

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />
      <main className="pt-[125px] bg-white text-black w-full">
        <section className="px-4 sm:px-6 lg:px-10 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Currency Selector */}
            <div className="flex justify-end mb-6">
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent text-sm"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
              {/* Image Gallery */}
              <div className="lg:col-span-5">
                <div className="grid grid-cols-2 gap-4">
                  {images.length > 0 ? (
                    images.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <Image
                          src={src}
                          alt={`${product.name} ${i + 1}`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 37.5vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                      No images available
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="lg:col-span-3 lg:sticky lg:top-[140px] self-start">
                <div className="bg-[#f9f9f9] rounded-2xl p-1 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl sm:text-2xl font-serif leading-tight">
                      {product.name}
                    </h2>
                    <button
                      onClick={() => handleToggleWishlist(product._id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow hover:shadow-md transition-all flex-shrink-0"
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        className="h-4 w-4"
                        stroke={isWishlisted ? "#ef4444" : "#374151"}
                        fill={isWishlisted ? "#ef4444" : "none"}
                      />
                    </button>
                  </div>
                  <div className="flex mb-5 text-[#742402]">
                    <span>
                      <hr style={{ width: "180px", marginTop: "9px" }}></hr>
                    </span>
                    <span className="text-sm mx-2 text-[#742402]">
                      Ships in 90 - 120 days
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 font-serif leading-relaxed mb-5">
                    {product.description}
                  </div>

                  <div className="mb-5 text-2xl font-serif">
                    {selectedSize
                      ? (() => {
                          const basePrice =
                            product.sizes.find((s) => s.label === selectedSize)
                              ?.price || 0;
                          const finalPrice =
                            user?.role === "trader" && discount > 0
                              ? basePrice - (basePrice * discount) / 100
                              : basePrice;

                          if (user?.role === "trader" && discount > 0) {
                            return (
                              <div className="flex flex-col gap-2">
                                <span className="text-gray-500 line-through text-lg">
                                  {convertCurrency(basePrice, currency)}
                                </span>
                                <span className="text-[#742402] font-bold text-2xl">
                                  {convertCurrency(finalPrice, currency)}
                                </span>
                                <span className="text-sm text-green-600 font-medium">
                                  ({discount}% OFF)
                                </span>
                              </div>
                            );
                          }

                          return convertCurrency(finalPrice, currency);
                        })()
                      : `Select size`}
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2 font-serif">
                    <span className="text-xs px-2.5 py-1.5 rounded-full bg-white border-[#f1f1f1] border">
                      In Stock
                    </span>
                    {product.category && (
                      <span className="text-xs px-2.5 py-1.5 rounded-full bg-white border-[#f1f1f1] border">
                        {product.category}
                      </span>
                    )}
                  </div>

                  <div className="mb-5">
                    <div className="text-sm font-medium mb-2">Select Size</div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s.label}
                          onClick={() => {
                            setSelectedSize(s.label);
                            setQuantity(1);
                          }}
                          disabled={s.stock <= 0}
                          className={`px-3 py-1.5 text-sm rounded border ${
                            selectedSize === s.label
                              ? "bg-[#742402] text-white border-[#742402]"
                              : "bg-white border-gray-300 text-gray-700"
                          } disabled:opacity-40`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {product.colors?.length > 0 && (
                    <div className="mb-5">
                      <div className="text-sm font-medium mb-2">
                        Select Color
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((c) => (
                          <button
                            key={c.label}
                            onClick={() => setSelectedColor(c.label)}
                            className={`px-3 py-1.5 text-sm rounded border ${
                              selectedColor === c.label
                                ? "bg-[#742402] text-white border-[#742402]"
                                : "bg-white border-gray-300 text-gray-700"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-5">
                    <div className="text-sm font-medium mb-2">Quantity</div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-1.5 border rounded bg-white hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => {
                          const stock =
                            product.sizes.find((s) => s.label === selectedSize)
                              ?.stock || 1;
                          setQuantity((q) => Math.min(stock, q + 1));
                        }}
                        className="px-3 py-1.5 border rounded bg-white hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#742402] hover:bg-[#5c1c01] transition text-white hover:shadow uppercase font-serif tracking-wide text-sm mb-6"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>

                  {/* Accordion Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <AccordionItem
                      title="Dimensions"
                      content={product.dimensions}
                      isOpen={openAccordion === "dimensions"}
                      onToggle={() =>
                        setOpenAccordion(
                          openAccordion === "dimensions" ? "" : "dimensions"
                        )
                      }
                    />
                    <AccordionItem
                      title="Material"
                      content={product.material}
                      isOpen={openAccordion === "material"}
                      onToggle={() =>
                        setOpenAccordion(
                          openAccordion === "material" ? "" : "material"
                        )
                      }
                    />
                    <AccordionItem
                      title="Care Information"
                      content={
                        product.careInformation ||
                        "Vacuum regularly. Professional cleaning recommended. Avoid direct sunlight. Rotate periodically for even wear."
                      }
                      isOpen={openAccordion === "care"}
                      onToggle={() =>
                        setOpenAccordion(openAccordion === "care" ? "" : "care")
                      }
                    />
                    <AccordionItem
                      title="Additional Details"
                      content={product.additionalDetails}
                      isOpen={openAccordion === "additional"}
                      onToggle={() =>
                        setOpenAccordion(
                          openAccordion === "additional" ? "" : "additional"
                        )
                      }
                    />
                    <AccordionItem
                      title="Shipping & Returns"
                      content={
                        product.shippingReturns ||
                        `We craft each made-to-order rug to your specification. To set expectations clearly:

Production lead time (from order confirmation)

Small rugs (e.g., up to ~4×6 ft): 6–8 weeks

Medium rugs (e.g., ~6×9 to 8×10 ft): 8–12 weeks

Large rugs (e.g., 9×12 ft and above or highly detailed pieces): 10–16 weeks

International transit & customs

Once dispatched, international transit typically takes 2–6 weeks, depending on destination, chosen shipping method, and local customs processing. Some destinations may experience longer delays.

Estimated total delivery window (order → delivered)

Small rugs: 8–14 weeks

Medium rugs: 10–18 weeks

Large rugs: 12–22 weeks

Faster options & costs

We offer expedited shipping (transit 1–3 weeks) for an additional fee. Expedited service reduces transit time but does not shorten the production lead time. Please contact us for exact expedited rates.

Customs & import duties

Import duties, taxes, and any customs clearance fees are the responsibility of the recipient and may add time to delivery.

Why timelines vary

Handcrafted production, size and complexity, seasonal order volumes, and customs processes all affect delivery times. We'll always confirm an estimated ship date when you place your order and notify you with tracking once your rug has left our workshop.`
                      }
                      isOpen={openAccordion === "shipping"}
                      onToggle={() =>
                        setOpenAccordion(
                          openAccordion === "shipping" ? "" : "shipping"
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Crafted by Artisan Hands Section */}
        <section className="px-4 sm:px-6 lg:px-10 py-16 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto">
            {/* Top Icons */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-16">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-[#742402]" />
                <span className="text-sm sm:text-base font-medium">
                  Sustainable
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Hand className="h-8 w-8 text-[#742402]" />
                <span className="text-sm sm:text-base font-medium">
                  Handcrafted
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-[#742402]" />
                <span className="text-sm sm:text-base font-medium">
                  Made with Genuine Fabric
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900">
                  Crafted by Artisan Hands
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  Every Jaipurrugs creation tells a story of heritage and
                  craftsmanship that spans generations. Our rugs are
                  meticulously handcrafted by skilled artisans in Jaipur, India,
                  using techniques passed down through families for centuries.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  We work directly with artisan communities, ensuring fair wages
                  and preserving traditional craftsmanship. Each rug takes 3-6
                  months to complete, with master weavers tying thousands of
                  individual knots by hand.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-start gap-2">
                    <Recycle className="h-5 w-5 text-[#742402] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-medium text-sm">
                        Fair Trade Certified
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="h-5 w-5 text-[#742402] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-medium text-sm">
                        Sustainable Practices
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-[#742402] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-medium text-sm">
                        Community Support
                      </div>
                    </div>
                  </div>
                </div>

                <button className="inline-flex items-center gap-2 text-[#742402] hover:text-[#5c1c01] font-medium transition-colors group">
                  Learn more about our artisans
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Right: Image */}
              <div className="relative  rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/ss2.jpg"
                  alt="Artisan crafting rug"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="px-4 sm:px-6 lg:px-10 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Image */}
              <div className="relative  rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1">
                <img
                  src="/images/stories.png"
                  alt="Rug care essentials"
                  className="object-contain"
                />
              </div>

              {/* Right: Text Content */}
              <div className="space-y-6 order-1 lg:order-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900">
                  How it Works
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  Bringing home the right rug is simple. Choose your design, add
                  the features you need, and let us handle the rest — from
                  delivery to care. Quality, comfort, and convenience made easy.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#742402]/10 flex items-center justify-center">
                      <Recycle className="h-6 w-6 text-[#742402]" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        PROFESSIONAL CLEANING
                      </div>
                      <div className="text-sm text-gray-600">(recommended)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#742402]/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-[#742402]" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        STAIN RESISTANT
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#742402]/10 flex items-center justify-center">
                      <Home className="h-6 w-6 text-[#742402]" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        HUNDREDS OF DESIGNS
                      </div>
                      <div className="text-sm text-gray-600">
                        From traditional to contemporary, find the perfect style
                        for your space
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        <section className="px-4 sm:px-6 lg:px-10 py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif text-center mb-8">
              You might also like
            </h2>

            {relatedLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                      <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct._id}
                    product={relatedProduct}
                    onViewProduct={handleViewProduct}
                    currency={currency}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
