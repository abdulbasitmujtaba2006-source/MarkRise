import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, animate } from "motion/react";

import heroDesktop from "@/assets/hero-mockup-desktop.jpg";
import heroMobile from "@/assets/hero-mockup-mobile.jpg";
import whyImg from "@/assets/why-markrise.jpg";
import workLawn from "@/assets/work-lawn.jpg";
import workBeauty from "@/assets/work-beauty.jpg";
import workConstruction from "@/assets/work-construction.jpg";
import workInterior from "@/assets/work-interior.jpg";
import workFood from "@/assets/work-food.jpg";
import workRealestate from "@/assets/work-realestate.jpg";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                */
/* -------------------------------------------------------------------------- */

const fadeRise = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

function Reveal({
  children,
  delay = 0,
  className = "",
  as: As = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const MotionAs = motion(As);
  return (
    <MotionAs
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeRise}
      custom={delay}
    >
      {children}
    </MotionAs>
  );
}

function MagneticButton({
  children,
  variant = "primary",
  href = "#",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "bronze";
  href?: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * 0.15);
    y.set(dy * 0.15);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "relative inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-shadow duration-300 will-change-transform";
  const styles: Record<string, string> = {
    primary:
      "bg-[var(--olive)] text-[var(--sand)] hover:shadow-[0_18px_40px_-18px_rgba(184,147,90,0.55)]",
    bronze:
      "bg-[var(--bronze)] text-[var(--ivory)] hover:shadow-[0_18px_40px_-14px_rgba(184,147,90,0.75)]",
    ghost:
      "border border-[var(--olive)]/25 text-[var(--olive)] hover:bg-[var(--ivory)]",
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}

function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 16 });
  const sry = useSpring(ry, { stiffness: 180, damping: 16 });
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 8);
    rx.set(-py * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular">
      {val}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Nav                                                                        */
/* -------------------------------------------------------------------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--ivory)]/90 backdrop-blur-md shadow-[0_10px_30px_-20px_rgba(61,67,38,0.35)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="font-display text-2xl font-semibold tracking-tight text-[var(--olive)]"
        >
          MarkRise
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-[var(--ink)]/80 transition-colors hover:text-[var(--olive)]"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--bronze)] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <MagneticButton variant="bronze" href="https://calendly.com/markrise222/30min" className="hidden md:inline-flex">
          Book a Free Call
        </MagneticButton>
      </div>
    </motion.header>
  );
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 160]);

  const headline = "The search is over. The growth starts now.";
  const words = headline.split(" ");

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden bg-[var(--sand)] pt-32 pb-24 md:pt-40 md:pb-32 lg:min-h-[92vh]"
    >
      <div className="pointer-events-none absolute -right-40 top-40 h-[520px] w-[520px] rounded-full bg-[var(--bronze)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -top-10 h-[380px] w-[380px] rounded-full bg-[var(--olive)]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:px-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="eyebrow"
          >
            Website Design &amp; Strategy
          </motion.p>

          <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-medium sm:text-6xl lg:text-[4.4rem]">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.35 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mr-[0.28em] inline-block"
              >
                {i === words.length - 1 ? (
                  <em className="font-display italic text-[var(--bronze)]">{w}</em>
                ) : (
                  w
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--ink)]/80"
          >
            Custom websites designed to earn trust, attract customers, and grow your
            business — without the agency hassle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href="#pricing" variant="primary">
              See Pricing
            </MagneticButton>
            <MagneticButton href="#work" variant="ghost">
              View Our Work
            </MagneticButton>
          </motion.div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[640px]">
            <motion.div
              style={{ y: yBack }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-6 w-[82%] -rotate-[3deg] overflow-hidden rounded-[22px] bg-[var(--ivory)] shadow-[0_40px_80px_-40px_rgba(61,67,38,0.45)] ring-1 ring-[var(--olive)]/10"
            >
              <img
                src={heroDesktop}
                alt="MarkRise landscaping website mockup"
                width={1400}
                height={1000}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.div
              style={{ y: yFront }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 right-0 w-[38%] rotate-[4deg] overflow-hidden rounded-[28px] bg-[var(--ivory)] shadow-[0_30px_60px_-25px_rgba(61,67,38,0.55)] ring-1 ring-[var(--olive)]/10"
            >
              <img
                src={heroMobile}
                alt="MarkRise nail salon mobile website mockup"
                width={600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-10 left-6 h-[3px] w-[60%] origin-left rounded-full bg-gradient-to-r from-[var(--bronze)] to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const stats: { value: number; suffix: string; label: string }[] = [
    { value: 200, suffix: "+", label: "Projects Shipped" },
    { value: 7, suffix: "+", label: "Years in Business" },
    { value: 50, suffix: "+", label: "Industries Served" },
    { value: 5, suffix: "★", label: "Star Client Reviews" },
  ];
  return (
    <section className="bg-[var(--ivory)] border-y border-[var(--olive)]/10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4 md:px-10 md:py-12">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i}>
            <div className="flex flex-col">
              <span className="font-display text-4xl font-semibold text-[var(--olive)] md:text-5xl">
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span className="eyebrow mt-2">{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function IconDot({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--olive)]/20 text-[var(--olive)]">
      {children}
    </div>
  );
}

function Services() {
  const services = [
    {
      title: "Starter Site",
      desc: "A crisp 2–3 page website that opens doors — comes with a free logo.",
      price: "$299",
      badge: null as string | null,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18"/></svg>
      ),
    },
    {
      title: "Smart Site",
      desc: "A 6–7 page site with strategy baked in. Free logo + business cards.",
      price: "$649",
      badge: "Most Popular",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l3 6 6 .9-4.5 4.2 1.1 6.4L12 17.8 6.4 20.5l1.1-6.4L3 9.9 9 9z"/></svg>
      ),
    },
    {
      title: "AI Autochat",
      desc: "A chatbot trained on your business. Answers questions, books calls, 24/7.",
      price: "$499",
      badge: null,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 5h16v10H8l-4 4z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/></svg>
      ),
    },
    {
      title: "Brand Basics",
      desc: "Logo design $99 · Business card design $119 — sharp identity, done fast.",
      price: "from $99",
      badge: null,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>
      ),
    },
  ];

  return (
    <section id="services" className="bg-[var(--sand)] py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <p className="eyebrow">What we build</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-4 max-w-3xl text-4xl font-medium md:text-5xl lg:text-[3.4rem]">
            Everything your business needs to look as good as it performs.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i}>
              <TiltCard className="group relative h-full rounded-[22px] bg-[var(--ivory)] p-8 shadow-[0_20px_50px_-30px_rgba(61,67,38,0.35)] ring-1 ring-[var(--olive)]/10 transition-shadow duration-500 hover:shadow-[0_28px_60px_-30px_rgba(184,147,90,0.5)]">
                {s.badge && (
                  <span className="absolute right-6 top-6 rounded-full bg-[var(--bronze)] px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-[var(--ivory)]">
                    {s.badge}
                  </span>
                )}
                <IconDot>{s.icon}</IconDot>
                <h3 className="text-2xl font-medium">{s.title}</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--ink)]/75">
                  {s.desc}
                </p>
                <div className="mt-8 flex items-end justify-between">
                  <span className="font-display text-4xl font-semibold tabular text-[var(--olive)]">
                    {s.price}
                  </span>
                  <a
                    href="#pricing"
                    className="group/link relative text-sm font-medium text-[var(--olive)]"
                  >
                    Learn more
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--bronze)] transition-transform duration-300 group-hover/link:scale-x-100" />
                  </a>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyMarkRise() {
  return (
    <section id="about" className="bg-[var(--ivory)] py-24 md:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:px-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[24px] bg-[var(--sand)]" />
            <div className="relative overflow-hidden rounded-[24px] ring-1 ring-[var(--olive)]/10">
              <img
                src={whyImg}
                alt="Design studio flat-lay"
                width={1200}
                height={1400}
                loading="lazy"
                className="aspect-[5/6] h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">Why MarkRise</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 text-4xl font-medium md:text-5xl lg:text-[3.2rem]">
              We don&rsquo;t just build websites. We build the ones that actually get you clients.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--ink)]/80">
              Over 7+ years, MarkRise has shipped 200+ websites and projects for business
              owners who were tired of looking invisible online. No templates pretending to
              be custom. No agency runaround. Just strategy, design, and a site that works
              as hard as you do.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <p className="mt-8 font-display text-xl italic text-[var(--bronze)]">
              — MarkRise.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", title: "Discover", desc: "We talk through your business and your goals." },
    { n: "02", title: "Design", desc: "A custom look built around your brand, not a template." },
    { n: "03", title: "Launch", desc: "Your site goes live, fast, and ready to convert." },
    { n: "04", title: "Grow", desc: "Ongoing support as your business scales." },
  ];
  return (
    <section className="bg-[var(--sand)] py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <p className="eyebrow">How it works</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-4 max-w-3xl text-4xl font-medium md:text-5xl">
            A calm, considered process — from first call to first click.
          </h2>
        </Reveal>

        <div className="relative mt-20">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-8 hidden h-px origin-left bg-[var(--bronze)]/50 md:block"
          />
          <div className="grid gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i}>
                <div className="relative">
                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ivory)] font-display text-lg font-semibold text-[var(--olive-muted)] ring-1 ring-[var(--olive)]/15">
                    {s.n}
                  </div>
                  <h3 className="text-xl font-medium">s.title</h3>
                  <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-[var(--ink)]/75">
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  const projects = [
    { img: workLawn, niche: "Lawn Care", name: "Verdant Lawn Care" },
    { img: workBeauty, niche: "Beauty", name: "Maison Bloom" },
    { img: workConstruction, niche: "Construction", name: "Ironline Construction" },
    { img: workInterior, niche: "Interior Design", name: "Marlow & Co." },
    { img: workFood, niche: "Food Brand", name: "Field & Flour" },
    { img: workRealestate, niche: "Real Estate", name: "Hollow Oak" },
  ];

  const niches = [
    "Lawn Care",
    "Nail Salons",
    "Construction",
    "Interior Design",
    "Food Brands",
    "Real Estate",
    "Beauty",
    "Fitness",
    "Wellness",
    "Photography",
  ];

  return (
    <section id="work" className="bg-[var(--ivory)] py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <p className="eyebrow">Our work</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-4 max-w-3xl text-4xl font-medium md:text-5xl">
            200+ businesses. Zero cookie-cutter sites.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i}>
              <TiltCard className="group relative overflow-hidden rounded-[20px] ring-1 ring-[var(--olive)]/10 shadow-[0_18px_50px_-30px_rgba(61,67,38,0.4)]">
                <img
                  src={p.img}
                  alt={`${p.name} website`}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[var(--olive)]/85 via-[var(--olive)]/20 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div>
                    <p className="eyebrow" style={{ color: "rgba(244,238,223,0.8)" }}>
                      {p.niche}
                    </p>
                    <p className="mt-1 font-display text-xl text-[var(--sand)]">{p.name}</p>
                  </div>
                  <span className="text-sm font-medium text-[var(--sand)] underline decoration-[var(--bronze)] underline-offset-4">
                    View Project
                  </span>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="marquee-wrap mt-20 overflow-hidden border-y border-[var(--olive)]/10 bg-[var(--sand)] py-8">
        <div className="flex w-max animate-marquee">
          {[...niches, ...niches].map((n, i) => (
            <span
              key={i}
              className="mx-8 flex items-center gap-8 font-display text-2xl italic text-[var(--olive-muted)] md:text-3xl"
            >
              {n}
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--bronze)]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      title: "Starter Site",
      price: "$299",
      badge: null as string | null,
      features: [
        "2–3 page custom website",
        "Free logo included",
        "Mobile-responsive design",
        "Launch in 1–2 weeks",
      ],
    },
    {
      title: "Smart Site",
      price: "$649",
      badge: "Most Popular",
      features: [
        "6–7 page strategic website",
        "Free logo + business cards",
        "SEO foundations built in",
        "Launch in 2–3 weeks",
      ],
    },
    {
      title: "AI Autochat",
      price: "$499",
      badge: null,
      features: [
        "Custom AI trained on your business",
        "Answers customer questions 24/7",
        "Books calls automatically",
        "Installs on any site",
      ],
    },
    {
      title: "Brand Basics",
      price: "from $99",
      badge: null,
      features: [
        "Logo design — $99",
        "Business card design — $119",
        "Print-ready files",
        "Two rounds of revisions",
      ],
    },
  ];
  return (
    <section id="pricing" className="bg-[var(--sand)] py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <p className="eyebrow">Simple, honest pricing</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-4 max-w-3xl text-4xl font-medium md:text-5xl">
            No hidden fees. No monthly hostage fees. Just one clean price.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, i) => (
            <Reveal key={p.title} delay={i}>
              <TiltCard className="relative flex h-full flex-col rounded-[22px] bg-[var(--ivory)] p-7 ring-1 ring-[var(--olive)]/10 shadow-[0_18px_50px_-30px_rgba(61,67,38,0.35)]">
                {p.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[var(--bronze)] px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-[var(--ivory)]">
                    {p.badge}
                  </span>
                )}
                <h3 className="text-xl font-medium">{p.title}</h3>
                <div className="mt-4 font-display text-4xl font-semibold tabular text-[var(--olive)]">
                  {p.price}
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-[15px] text-[var(--ink)]/80">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--bronze)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <p className="mt-10 text-sm text-[var(--olive-muted)]">
            Every site includes mobile-responsive design, fast load speeds, and a free
            consultation call before we start.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <div className="mt-8">
            <MagneticButton href="https://calendly.com/markrise222/30min" variant="primary">
              Book a Free Call
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      name: "Elena Ruiz",
      biz: "Verdant Lawn Care",
      img: t1,
      quote:
        "My old site felt like a business card no one ever picked up. MarkRise built something that actually books jobs while I sleep.",
    },
    {
      name: "Marcus Bennet",
      biz: "Ironline Construction",
      img: t2,
      quote:
        "Every contractor in my area looks the same online. MarkRise made me look like the one you'd actually trust with a build.",
    },
    {
      name: "Diana Chen",
      biz: "Marlow & Co. Interiors",
      img: t3,
      quote:
        "It felt boutique from the first call — no upsells, no runaround. The final site is the calling card I always wanted.",
    },
  ];
  return (
    <section className="bg-[var(--ivory)] py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <p className="eyebrow">What clients say</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-4 max-w-3xl text-4xl font-medium md:text-5xl">
            Words from the businesses we&rsquo;ve built for.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i}>
              <TiltCard className="flex h-full flex-col rounded-[22px] bg-[var(--sand)] p-8 ring-1 ring-[var(--olive)]/10 shadow-[0_18px_50px_-30px_rgba(61,67,38,0.35)]">
                <p className="font-display text-xl italic leading-snug text-[var(--olive)]">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <img
                    src={q.img}
                    alt={q.name}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover ring-1 ring-[var(--olive)]/15"
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--ink)]">{q.name}</p>
                    <p className="text-xs text-[var(--olive-muted)]">{q.biz}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--olive)] py-28 md:py-40">
      <div className="pointer-events-none absolute -left-32 top-10 h-[360px] w-[360px] rounded-full bg-[var(--bronze)]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--sand)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal>
          <h2 className="font-display text-4xl font-medium leading-[1.05] text-[var(--sand)] md:text-6xl">
            Your competitors already have a site. Let&rsquo;s make sure yours is the one they{" "}
            <em className="italic text-[var(--bronze)]">remember.</em>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--sand)]/70">
            One free call. Real strategy, no pitch decks. Walk away with clarity on what
            your website should actually do.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-10 flex justify-center">
            <MagneticButton href="https://calendly.com/markrise222/30min" variant="bronze">
              Book Your Free Call
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-24 flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-[var(--sand)]/15 px-6 pt-8 md:flex-row md:px-10">
        <span className="font-display text-xl text-[var(--sand)]">MarkRise</span>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="#work" className="text-sm text-[var(--sand)]/70 transition-colors hover:text-[var(--sand)]">Work</a>
          <a href="#services" className="text-sm text-[var(--sand)]/70 transition-colors hover:text-[var(--sand)]">Services</a>
          <a href="#pricing" className="text-sm text-[var(--sand)]/70 transition-colors hover:text-[var(--sand)]">Pricing</a>
          <a href="#about" className="text-sm text-[var(--sand)]/70 transition-colors hover:text-[var(--sand)]">About</a>
        </nav>
        <span className="text-xs text-[var(--sand)]/40">© {new Date().getFullYear()} MarkRise. All rights reserved.</span>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)] antialiased selection:bg-[var(--bronze)]/30 selection:text-[var(--olive)]">
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <Services />
        <WhyMarkRise />
        <Process />
        <Work />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
    </div>
  );
}