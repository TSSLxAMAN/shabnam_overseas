"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import toast from "react-hot-toast";
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneCode: string;
  phoneNumber: string;
  appointmentDateTime: string;
  timeZone: string;
  designDescription: string;
}

export default function CustomPage() {
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phoneCode: "+91",
    phoneNumber: "",
    appointmentDateTime: "",
    timeZone: "IST",
    designDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastId = toast.loading("Sending your request...");

    // Create a FormData object to handle both text and files
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key as keyof FormData]);
    }
    // Append images
    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await axios.post(
        "https://api.shabnamoverseas.com/api/custom-page-mail",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Your request has been sent successfully!", {
          id: toastId,
        });
        // Optionally reset the form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          country: "",
          phoneCode: "+91",
          phoneNumber: "",
          appointmentDateTime: "",
          timeZone: "IST",
          designDescription: "",
        });
        setImages([]);
      } else {
        toast.error("Failed to send your request. Please try again.", {
          id: toastId,
        });
      }
    } catch (error) {
      // console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.", {
        id: toastId,
      });
    }
  };

  // Get minimum datetime (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <>
      <Navbar forceWhite={true} disableScrollEffect={true} />
      <main className="pt-[125px] bg-white text-black font-serif ">
        {/* Header Section (Full Width Text) */}
        <section className="text-center py-20 bg-[#f5dfd6] h-[300px] px-6">
          <h1 className="text-7xl font-[AdvercaseFont-Demo-Regular] mb-2">
            Customize & Create
          </h1>
          <p className="text-4x1 text-gray-600">
            Your vision, our craftsmanship. Bring your dream rug to life.
          </p>
        </section>

        <section className="max-w-5xl mx-auto space-y-20 px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img
              src="/images/Send_us.jpg"
              alt="Send Your Ideas"
              className="rounded-2xl shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                SEND US YOUR IDEAS OR DESIGN
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Whether it's a sketch, reference image, or mood board — our
                designers can bring it to life. We work closely with you to
                understand your vision.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                WHERE THE RUGS ARE MADE
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Handcrafted in the heart of Mirzapur, each rug is created using
                time-honored techniques by skilled artisans. Our production
                facilities ensure both quality and ethical craftsmanship.
              </p>
            </div>
            <img
              src="/images/Rug_Prod.jpg"
              alt="Rug Production"
              className="rounded-2xl shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img
              src="/images/Generation.jpg"
              alt="Artisans"
              className="rounded-2xl shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                CRAFTED BY GENERATIONS
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Every knot is tied by hand by artisans whose skills have been
                passed down through generations. Their dedication and precision
                are at the heart of every rug.
              </p>
            </div>
          </div>

          <section className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              BOOK A FREE DESIGN CONSULTATION
            </h2>
            <p className="mb-6 text-gray-600">
              Choosing a rug is easier than it seems. Connect with our rug
              expert for FREE and learn the know-how of rug selection, and make
              changing your space easy for a lifetime!
            </p>

            {/* Status Message */}
            {submitStatus.type && (
              <div
                className={`mb-6 p-4 rounded-lg text-center ${
                  submitStatus.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="India"
                    className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      name="phoneCode"
                      value={formData.phoneCode}
                      onChange={handleInputChange}
                      className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+86">+86</option>
                      <option value="+33">+33</option>
                      <option value="+49">+49</option>
                      <option value="+81">+81</option>
                      <option value="+61">+61</option>
                    </select>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Preferred Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="appointmentDateTime"
                  value={formData.appointmentDateTime}
                  onChange={handleInputChange}
                  min={getMinDateTime()}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Time Zone</label>
                <select
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                  required
                >
                  <option value="IST">IST (India Standard Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                  <option value="CST">CST (Central Standard Time)</option>
                  <option value="MST">MST (Mountain Standard Time)</option>
                  <option value="PST">PST (Pacific Standard Time)</option>
                  <option value="GMT">GMT (Greenwich Mean Time)</option>
                  <option value="CET">CET (Central European Time)</option>
                  <option value="JST">JST (Japan Standard Time)</option>
                  <option value="AEST">
                    AEST (Australian Eastern Standard Time)
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Upload Reference Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                />
                <div className="flex flex-wrap gap-4 mt-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 border rounded-md overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-bl hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Explain Your Design
                </label>
                <textarea
                  name="designDescription"
                  value={formData.designDescription}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your custom rug idea..."
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#742402] focus:border-transparent"
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="text-sm text-gray-500 italic">
                Web conferencing details will be shared upon confirmation.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-lg text-lg transition-all ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#742402] hover:bg-[#5a1b01] text-white"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
