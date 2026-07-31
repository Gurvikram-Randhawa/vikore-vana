"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Instagram, Pin, Facebook, Send, CheckCircle2, AlertCircle, Clock, Sparkles, ArrowRight, Plus, Minus } from "lucide-react";

const inquiryOptions = [
  { id: "general", label: "General Inquiry" },
  { id: "collaboration", label: "Collaboration & Press" },
  { id: "product", label: "Product & Affiliate Question" },
  { id: "advice", label: "Interior Design & Styling Advice" },
  { id: "feedback", label: "Feedback & Suggestions" },
];

const contactFaqs = [
  {
    question: "How quickly do you respond to messages?",
    answer: "We review every message personally and aim to respond within 24 to 48 business hours."
  },
  {
    question: "Can I submit my product or brand for feature?",
    answer: "Yes! We welcome collaborations with independent designers, sustainable brands, and interior studios. Select 'Collaboration & Press' in the inquiry form."
  },
  {
    question: "Where do you source your product recommendations?",
    answer: "Our team handpicks products based on build quality, design aesthetics, user reviews, and material authenticity."
  }
];

const socialPlatforms = [
  {
    platform: "Pinterest",
    handle: "@vikore_vana",
    href: "https://www.pinterest.com/vikore_vana/",
    icon: Pin,
    focus: "Daily Pins",
  },
  {
    platform: "Instagram",
    handle: "@vikore_vana",
    href: "https://www.instagram.com/vikore_vana",
    icon: Instagram,
    focus: "Interior Reels & Edits",
  },
  {
    platform: "Facebook",
    handle: "Vikore Vana",
    href: "https://www.facebook.com/share/1HABJXfXLj/",
    icon: Facebook,
    focus: "Design Community",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    inquiryType: "general",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields (Name, Email, and Message).");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          inquiryType: "general",
          message: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "An error occurred while sending your message. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection or email us directly at vikorevana@gmail.com.");
    }
  };

  return (
    <div className="bg-[#fffaf4] dark:bg-[#181614] text-ink dark:text-linen transition-colors duration-500 min-h-screen selection:bg-[#b89569]/20">
      {/* Editorial Hero Header */}
      <section className="relative pt-10 sm:pt-16 md:pt-20 pb-6 sm:pb-8 overflow-hidden border-b border-[#b89569]/10 dark:border-white/5">
        {/* Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-radial-glow opacity-50 pointer-events-none" />

        <div className="container-premium relative z-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-ink dark:text-linen leading-[1.14] tracking-tight max-w-3xl mx-auto">
            Contact{" "}
            <span className="italic font-normal text-[#b89569] dark:text-[#cba677]">
              Vikore Vana
            </span>
          </h1>

          <p className="mt-8 sm:mt-10 max-w-2xl mx-auto text-center text-base md:text-lg text-smoke dark:text-bone/85 font-light leading-relaxed">
            We&apos;d love to hear from you. Reach out for design inquiries, collaborations, or general questions.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-[#b89569]/10 dark:border-white/5">
        <div className="container-premium max-w-3xl mx-auto space-y-10 sm:space-y-12">
          
          {/* Editorial Contact Details */}
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen">
                Direct Contact{" "}
                <span className="italic text-[#b89569] dark:text-[#cba677]">
                  Details
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#201d1a] border border-[#b89569]/20 dark:border-white/10 shadow-xs hover:border-[#b89569] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#b89569]/10 text-[#b89569] dark:text-[#cba677] flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b89569] dark:text-[#cba677]">Direct Email</p>
                  <a
                    href="mailto:vikorevana@gmail.com"
                    className="text-base sm:text-lg font-medium text-ink dark:text-linen hover:text-[#b89569] transition-colors"
                  >
                    vikorevana@gmail.com
                  </a>
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#201d1a] border border-[#b89569]/20 dark:border-white/10 shadow-xs hover:border-[#b89569] transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#b89569]/10 text-[#b89569] dark:text-[#cba677] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b89569] dark:text-[#cba677]">Response Time</p>
                  <p className="text-base sm:text-lg text-ink dark:text-linen font-light">24 – 48 Business Hours</p>
                </div>
              </div>
            </div>

            {/* Home Styling Guide Quick Note */}
            <div className="mt-4 sm:mt-6 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#f8f2eb] via-[#fffaf4] to-[#f4ece1] dark:from-[#23201d] dark:via-[#1a1816] dark:to-[#171513] border border-[#b89569]/25 shadow-xs space-y-2">
              <h3 className="font-serif text-lg font-normal text-ink dark:text-linen">
                Looking for instant styling ideas?
              </h3>
              <p className="text-base text-smoke dark:text-bone/85 font-light leading-relaxed">
                Don&apos;t forget to check our{" "}
                <Link href="/#styling-guide" className="text-[#b89569] dark:text-[#cba677] font-medium underline underline-offset-4 hover:text-[#a38259]">
                  Free Home Styling Guide
                </Link>{" "}
                or explore our latest interior articles while waiting for a response.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-[#b89569]/20" />

          {/* Social Channels Long Horizontal Cards */}
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen">
                Community &{" "}
                <span className="italic text-[#b89569] dark:text-[#cba677]">
                  Social Channels
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-smoke dark:text-bone/85 font-light mt-4 sm:mt-5 max-w-xl mx-auto">
                Follow along for daily visual moodboards, styling lookbooks, room makeovers, and interior discussions:
              </p>
            </div>

            <div className="space-y-4">
              {socialPlatforms.map((sp) => {
                const Icon = sp.icon;
                return (
                  <div
                    key={sp.platform}
                    className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#201d1a] border border-[#b89569]/20 dark:border-white/10 shadow-xs hover:shadow-md hover:border-[#b89569] transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4 group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#b89569]/10 text-[#b89569] dark:text-[#cba677] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg sm:text-xl font-normal text-ink dark:text-linen truncate">
                          {sp.platform}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-smoke dark:text-bone/85 font-light mt-0.5 line-clamp-1">
                          {sp.focus}
                        </p>
                      </div>
                    </div>

                    <a
                      href={sp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-[#b89569] hover:bg-[#a38259] text-white text-[11px] sm:text-xs uppercase tracking-wider font-medium transition-all duration-300 shadow-sm hover:shadow-md group/btn shrink-0"
                    >
                      <span>Visit</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px w-full bg-[#b89569]/20" />

          {/* Luxury Contact Form */}
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen">
                Send Us a{" "}
                <span className="italic text-[#b89569] dark:text-[#cba677]">
                  Message
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-smoke dark:text-bone/85 font-light mt-4 sm:mt-5 max-w-xl mx-auto">
                Have a specific project, collaboration, or question? Send us a note below and we will be in touch:
              </p>
            </div>

            <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-[#ffffff] via-[#fffaf4] to-[#f8f2eb] dark:from-[#201d1a] dark:via-[#1a1816] dark:to-[#171513] border border-[#b89569]/25 dark:border-white/10 shadow-xl relative overflow-hidden">
              {/* Decorative Subtle Radial Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-radial-glow opacity-30 pointer-events-none" />

              {status === "success" ? (
                <div className="py-12 text-center space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[#b89569]/10 text-[#b89569] dark:text-[#cba677] mx-auto flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ink dark:text-linen">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-base text-smoke dark:text-bone/85 max-w-md mx-auto leading-relaxed font-light">
                    Thank you for reaching out to Vikore Vana. We have received your inquiry and will respond as soon as possible.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 px-8 py-3 rounded-full bg-[#b89569] hover:bg-[#a38259] text-white text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  {status === "error" && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-smoke dark:text-bone/70 mb-2">
                        Your Name <span className="text-[#b89569]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-5 py-3.5 rounded-full bg-white/80 dark:bg-[#161412]/80 border border-[#b89569]/20 dark:border-white/10 text-ink dark:text-linen placeholder-smoke/40 text-base focus:outline-none focus:border-[#b89569] focus:ring-2 focus:ring-[#b89569]/20 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-smoke dark:text-bone/70 mb-2">
                        Email Address <span className="text-[#b89569]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-5 py-3.5 rounded-full bg-white/80 dark:bg-[#161412]/80 border border-[#b89569]/20 dark:border-white/10 text-ink dark:text-linen placeholder-smoke/40 text-base focus:outline-none focus:border-[#b89569] focus:ring-2 focus:ring-[#b89569]/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-smoke dark:text-bone/70 mb-2">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-full bg-white/80 dark:bg-[#161412]/80 border border-[#b89569]/20 dark:border-white/10 text-ink dark:text-linen text-base focus:outline-none focus:border-[#b89569] focus:ring-2 focus:ring-[#b89569]/20 transition-all duration-300 cursor-pointer"
                      >
                        {inquiryOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-smoke dark:text-bone/70 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief topic summary"
                        className="w-full px-5 py-3.5 rounded-full bg-white/80 dark:bg-[#161412]/80 border border-[#b89569]/20 dark:border-white/10 text-ink dark:text-linen placeholder-smoke/40 text-base focus:outline-none focus:border-[#b89569] focus:ring-2 focus:ring-[#b89569]/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-smoke dark:text-bone/70 mb-2">
                      Message <span className="text-[#b89569]">*</span>
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help or what you would like to discuss..."
                      className="w-full px-5 py-4 rounded-3xl bg-white/80 dark:bg-[#161412]/80 border border-[#b89569]/20 dark:border-white/10 text-ink dark:text-linen placeholder-smoke/40 text-base focus:outline-none focus:border-[#b89569] focus:ring-2 focus:ring-[#b89569]/20 transition-all duration-300 resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#b89569] to-[#a38259] hover:from-[#a38259] hover:to-[#8c6e48] text-white text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                  >
                    {status === "submitting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Accordion FAQ Section */}
      <section className="pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className="container-premium max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen">
              Frequently Asked{" "}
              <span className="italic text-[#b89569] dark:text-[#cba677]">
                Questions
              </span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-smoke dark:text-bone/85 font-light mt-4 sm:mt-5 max-w-xl mx-auto">
              Quick answers to common inquiries about our response times, features, and recommendations:
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {contactFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-[32px] transition-all duration-300 ${
                    isOpen
                      ? "bg-[#fdf6f0]/70 dark:bg-[#2d2925]/70 backdrop-blur-md shadow-[0_8px_30px_rgba(184,147,90,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#b8935a]/20 dark:border-[#b8935a]/15"
                      : "bg-white dark:bg-[#201d1a] border border-[#b89569]/20 dark:border-white/10 hover:border-[#b8935a]/50"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 md:p-7 text-left focus:outline-none group"
                  >
                    <h3 className={`font-serif text-lg md:text-xl font-normal transition-colors ${isOpen ? "text-ink dark:text-linen" : "text-ink/80 dark:text-bone group-hover:text-ink dark:group-hover:text-white"}`}>
                      {faq.question}
                    </h3>
                    <div className={`shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? "bg-[#b89569] text-white dark:bg-[#cba677] dark:text-ink" : "bg-black/5 text-ink dark:bg-white/5 dark:text-white"}`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 md:p-7 pt-0 text-smoke dark:text-bone/85 text-base md:text-lg font-light leading-relaxed border-t border-[#b89569]/10 dark:border-white/5 mx-6 md:mx-7 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
