export type FaqEntry = {
  question: string;
  answer: string;
};

export const FAQ: FaqEntry[] = [
  {
    question: "How do payments work?",
    answer:
      "Payments are milestone-based. We agree the milestones in the proposal and invoice each one when it's delivered.",
  },
  {
    question: "Who owns the code and documents?",
    answer:
      "You do. All code, documentation and configuration we create for you transfer to you when the final invoice is paid.",
  },
  {
    question: "Will you sign an NDA?",
    answer:
      "Yes. We sign a mutual NDA before we access any of your data or systems.",
  },
  {
    question: "Which time zones do you cover?",
    answer:
      "We work remotely from Bengaluru, India and Germany, with overlap across US, UK, EU and Australian working hours.",
  },
  {
    question: "What happens after a pilot or audit?",
    answer:
      "You keep everything we deliver. You can continue with a fixed-price follow-on, hourly work or a retainer, or run it yourselves with the handover docs.",
  },
  {
    question: "What if the scope changes?",
    answer:
      "We agree any change in writing, with a revised fixed quote, before extra work starts.",
  },
];
