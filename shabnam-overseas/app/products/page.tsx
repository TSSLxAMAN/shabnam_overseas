"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useContext,Suspense } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "@/app/context/UserAuthContext";
import { Heart, ShoppingCart } from "lucide-react";
import toast from 'react-hot-toast'
const convertCurrency = (value: number) => {
  return `₹${value.toLocaleString()}`;
};

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const { user } = useContext(AuthContext); // <-- Move this here!

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    const hasValidFilters = Object.keys(params).some((key) =>
      ["byType", "style", "byRoom", "byColor"].includes(key)
    );

    if (!hasValidFilters) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://www.shabnamoverseas.com/api/products/filter",
          { params }
        );
        setProducts(res.data);
      } catch (error) {
        // console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      const res = await fetch("https://www.shabnamoverseas.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add to cart");
        return;
      }

      toast.success("Added to cart");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (loading) return <p className="mt-36 p-4">Loading...</p>;
  if (!products.length) return <p className="mt-36 p-4">No products found.</p>;

  return (
    <section className="w-full lg:w-3/4 mx-auto px-4 mt-40">
      <h2 className="text-2xl font-bold mb-4">Filtered Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product: any) => (
          <div key={product._id} className="group border rounded p-4 relative">
            <Link href={`/product/${product._id}`}>
              <div className="relative overflow-hidden rounded h-96">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full"
                />
                {product.image[1] && (
                  <Image
                    src={product.image[1]}
                    alt="Hover"
                    width={500}
                    height={500}
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition"
                  />
                )}
              </div>
              <div className="mt-3">
                <h2 className="font-semibold text-lg line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {product.description}
                </p>
                <p className="mt-1 font-medium">
                  {convertCurrency(product.price)}
                </p>
              </div>
            </Link>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <Heart size={20} />
            </button>
            <button
              onClick={() => handleAddToCart(product._id)}
              className="mt-3 flex text-black  items-center gap-1 bg-white font-semibold cursor-pointer px-3 py-1 rounded hover:bg-sand hover:text-navy"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
