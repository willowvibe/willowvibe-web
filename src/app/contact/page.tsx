import { Mail, Linkedin, CalendarClock } from "lucide-react";
import { Suspense } from "react";
import { BOOKING_URL } from "@/lib/site";
import { ContactForm, ContactFormWithOffer } from "@/components/ContactForm";
import { TrackedLink } from "@/components/TrackedLink";

export default function ContactPage() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">

                {/* Info Side */}
                <div className="flex flex-col space-y-5 md:space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl border-l-4 border-primary pl-5 font-extrabold tracking-tight mb-3">
                            Book a call or <span className="glow-text text-white">send a message</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-lg leading-relaxed pl-5">
                            Book a 30-minute intro call, or send a message and we&apos;ll reply within one business day.
                        </p>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <TrackedLink href={BOOKING_URL} event="book_call_click" props={{ location: "contact" }} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 md:gap-4 group p-3 md:p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center border border-white/20 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex-shrink-0">
                                <CalendarClock className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-primary" />
                            </div>
                            <div>
                                <div className="text-xs font-mono text-gray-400 mb-0.5">Book a call</div>
                                <div className="text-sm md:text-base font-medium text-white">30-minute intro call</div>
                            </div>
                        </TrackedLink>

                        <a href="mailto:contact@willowvibe.com"
                            className="flex items-center gap-3 md:gap-4 group p-3 md:p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center border border-white/20 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex-shrink-0">
                                <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-primary" />
                            </div>
                            <div>
                                <div className="text-xs font-mono text-gray-400 mb-0.5">Email</div>
                                <div className="text-sm md:text-base font-medium text-white">contact@willowvibe.com</div>
                            </div>
                        </a>

                        <a href="https://www.linkedin.com/company/willowvibe/" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 md:gap-4 group p-3 md:p-4 rounded-lg bg-white/5 border border-white/10 hover:border-secondary/50 hover:bg-white/10 transition-all">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center border border-white/20 group-hover:border-secondary group-hover:shadow-[0_0_15px_rgba(112,0,255,0.4)] transition-all flex-shrink-0">
                                <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-secondary" />
                            </div>
                            <div>
                                <div className="text-xs font-mono text-gray-400 mb-0.5">LinkedIn</div>
                                <div className="text-sm md:text-base font-medium text-white">/company/WillowVibe</div>
                            </div>
                        </a>
                    </div>

                    <div className="pt-1 md:pt-2">
                        <h2 className="text-xs md:text-sm font-mono uppercase tracking-widest text-gray-400 mb-2">
                            What happens next
                        </h2>
                        <ol className="list-decimal list-inside space-y-1.5 text-xs md:text-sm text-gray-400 leading-relaxed">
                            <li>A 30-minute call to understand the problem.</li>
                            <li>A fixed scope and price within 48 hours.</li>
                            <li>Work starts on the date we agree, with weekly demos.</li>
                        </ol>
                    </div>

                    <div className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                        <p className="text-xs md:text-sm text-gray-400">
                            We reply within one business day.
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <Suspense fallback={<ContactForm initialMessage="" />}>
                    <ContactFormWithOffer />
                </Suspense>

            </div>
        </div>
    );
}
