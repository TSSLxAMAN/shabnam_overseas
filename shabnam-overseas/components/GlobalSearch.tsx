"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price?: number;
  image?: string[] | string;
  category?: string;
  byColor?: string;
  style?: string;
  size?: string;
};

export default function GlobalSearch({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // debounce
  useEffect(() => {
    const id = setTimeout(() => {
      void runSearch(query.trim());
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  /** Safely extract array of products from unknown JSON */
  const pluckProductsArray = (data: any): Product[] => {
    if (Array.isArray(data)) return data as Product[];
    if (Array.isArray(data?.products)) return data.products as Product[];
    if (Array.isArray(data?.data?.products)) return data.data.products as Product[];
    return [];
  };

  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  /** Cache all products for strict client filtering fallback */
  const ensureAllProducts = async (): Promise<Product[]> => {
    if (Array.isArray(allProducts)) return allProducts;
    try {
      const res = await fetch("https://www.shabnamoverseas.com/api/products");
      const json = await safeJson(res);
      const arr = pluckProductsArray(json);
      setAllProducts(arr);
      return arr;
    } catch {
      setAllProducts([]);
      return [];
    }
  };

  /** STRICT contains filter (case-insensitive), supports multi-word queries.
      Each word must appear in ANY of the indexed fields. */
  const clientStrictContains = (items: unknown, q: string): Product[] => {
    if (!Array.isArray(items) || !q) return [];
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const idxFields: (keyof Product)[] = ["name", "category", "style", "byColor", "size"];

    const recordText = (p: Product) => {
      const parts: string[] = [];
      for (const k of idxFields) {
        const v = p[k];
        if (typeof v === "string") parts.push(v);
      }
      return parts.join(" ").toLowerCase();
    };

    return (items as Product[]).filter((p) => {
      const hay = recordText(p);
      // Every term must be present somewhere
      return terms.every((t) => hay.includes(t));
    });
  };

  const runSearch = async (q: string) => {
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Try server-side search
      const res = await fetch(
        `https://www.shabnamoverseas.com/api/products/search?query=${encodeURIComponent(q)}`
      );
      const json = await safeJson(res);
      let arr = pluckProductsArray(json);

      // Post-filter strictly to ensure correctness
      arr = clientStrictContains(arr, q).slice(0, 12);

      // If server returns nothing or looks unfiltered, fall back to client filter
      if (!arr.length) {
        const products = await ensureAllProducts();
        arr = clientStrictContains(products, q).slice(0, 12);
      }

      setResults(arr);
    } catch {
      const products = await ensureAllProducts();
      setResults(clientStrictContains(products, q).slice(0, 12));
    } finally {
      setLoading(false);
    }
  };

  const goToProduct = (id: string) => {
    onClose?.();
    router.push(`/product/${id}`);
  };

  const normalizeImage = (img?: string[] | string) =>
    Array.isArray(img) ? (img[0] || "/placeholder.png") : (img || "/placeholder.png");

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0) goToProduct(results[focusedIndex]._id);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setTouched(true); }}
            onKeyDown={onKeyDown}
            placeholder="Search rugs by name, color, size, style, or category…"
            className="w-full h-12 rounded-2xl border border-neutral-300 px-4 pr-12 outline-none focus:ring-4 focus:ring-neutral-200"
          />
          {query && (
            <button
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-neutral-100"
              onClick={() => { setQuery(""); setResults([]); setFocusedIndex(-1); inputRef.current?.focus(); }}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="h-12 px-4 rounded-2xl border border-neutral-300 hover:bg-neutral-50"
          >
            Close
          </button>
        )}
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="p-6 text-sm text-neutral-500">Searching…</div>
        ) : touched && query && results.length === 0 ? (
          <div className="p-6 text-sm">
            <span className="text-neutral-600">No results for</span>{" "}
            <span className="font-medium">“{query}”</span>
          </div>
        ) : results.length > 0 ? (
          <ul role="listbox" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((item, idx) => (
              <li
                key={item._id}
                role="option"
                aria-selected={focusedIndex === idx}
                onMouseEnter={() => setFocusedIndex(idx)}
                onMouseLeave={() => setFocusedIndex(-1)}
                onClick={() => goToProduct(item._id)}
                className={`group cursor-pointer rounded-2xl border border-neutral-200 hover:border-neutral-300 p-3 transition-shadow hover:shadow-md outline-none ${
                  focusedIndex === idx ? "ring-2 ring-neutral-300" : ""
                }`}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") goToProduct(item._id); }}
              >
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={item.name}
                      src={normalizeImage(item.image)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">{item.name}</div>
                    <div className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      {[item.category, item.style, item.byColor, item.size].filter(Boolean).join(" • ")}
                    </div>
                    {typeof item.price === "number" && (
                      <div className="text-sm mt-1">₹{item.price}</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
