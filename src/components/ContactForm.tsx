"use client";

import { CalendarClock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { OFFERS, offerPrefillLabel } from "@/lib/offers";

type FormStatus = "idle" | "loading" | "success" | "error";

const OFFER_NAMES: Record<string, string> = Object.fromEntries(
    OFFERS.map((offer) => [offer.slug, offerPrefillLabel(offer)])
);

export function ContactForm({ initialMessage = "", offer = "none" }: { initialMessage?: string; offer?: string }) {
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: initialMessage });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong.");
            track("contact_submit", { offer });
            setStatus("success");
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (err: unknown) {
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="relative w-full glass-panel border border-white/10 p-5 md:p-8 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none z-0">
                <CalendarClock className="w-28 h-28 md:w-40 md:h-40 text-primary blur-[2px]" />
            </div>

            <div className="relative z-10 w-full">
                <h2 className="text-xl md:text-3xl font-bold text-white mb-1">Send a message</h2>
                <p className="text-gray-400 text-xs md:text-sm mb-5 md:mb-8">Tell us about your project and we&apos;ll reply within one business day.</p>

                {status === "success" ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Message Sent!</h3>
                            <p className="text-gray-400 text-sm">Thank you. We&apos;ll get back to you within one business day.</p>
                        </div>
                        <button onClick={() => setStatus("idle")} className="text-xs text-primary font-mono hover:underline mt-2">Send another message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5 text-white">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-xs text-primary font-semibold uppercase tracking-wider">Name</label>
                            <input type="text" id="name" value={form.name} onChange={handleChange} placeholder="Your full name" required disabled={status === "loading"}
                                className="bg-neutral-900/80 border border-white/30 rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-neutral-500 disabled:opacity-50" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs text-primary font-semibold uppercase tracking-wider">Email</label>
                            <input type="email" id="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required disabled={status === "loading"}
                                className="bg-neutral-900/80 border border-white/30 rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-neutral-500 disabled:opacity-50" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="phone" className="text-xs text-primary font-semibold uppercase tracking-wider">Phone <span className="text-gray-600 normal-case font-normal">(Optional)</span></label>
                            <input type="tel" id="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" disabled={status === "loading"}
                                className="bg-neutral-900/80 border border-white/30 rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-neutral-500 disabled:opacity-50" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="message" className="text-xs text-primary font-semibold uppercase tracking-wider">How can we help?</label>
                            <textarea id="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project..." required disabled={status === "loading"}
                                className="bg-neutral-900/80 border border-white/30 rounded-lg p-3 h-28 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-neutral-500 resize-none disabled:opacity-50" />
                        </div>

                        {status === "error" && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />{errorMessage}
                            </div>
                        )}

                        <button type="submit" disabled={status === "loading"}
                            className="mt-2 bg-primary hover:bg-primary/80 text-black font-bold py-3 md:py-4 rounded-xl transition-all text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                            {status === "loading" ? (<><Loader2 className="w-4 h-4 animate-spin" />Sending...</>) : "Send Message"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export function ContactFormWithOffer() {
    const searchParams = useSearchParams();
    const offer = searchParams.get("offer");
    const offerName = offer ? OFFER_NAMES[offer] : undefined;
    const offerMessage = offer
        ? offerName
            ? `I'd like to book a call about the ${offerName}.`
            : `I'd like to book a call about the "${offer}" offer.`
        : "";

    return <ContactForm initialMessage={offerMessage} offer={offer ?? "none"} />;
}
