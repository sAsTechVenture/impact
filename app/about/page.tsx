"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Target,
  Eye,
  Mail,
  Phone,
  Send,
  Users,
  Globe,
  Wrench,
  CheckCircle,
  Award,
  Building2,
  Sparkles,
} from "lucide-react";
import { colors } from "@/config/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TimelineHorizontal } from "@/components/about/timeline-horizontal";

// Scroll animation hook
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, isVisible] as const;
}

// Form validation types
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

// Timeline data
const timelineData = [
  {
    year: 2018,
    title: "Company Founded",
    description: "Inception & foundational team",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    year: 2020,
    title: "200+ Installations",
    description: "Reached milestone of 200+ installations across India",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    year: 2022,
    title: "Global Expansion",
    description: "International expansion & global partnerships",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    year: 2024,
    title: "Digital Innovation",
    description: "Advanced technologies & digital services",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    year: 2025,
    title: "Sustainable Future",
    description: "Sustainability & future-ready clean-utility solutions",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
];

// Core Values
const coreValues = [
  { letter: "P", word: "Passion" },
  { letter: "A", word: "Accountability" },
  { letter: "C", word: "Customer Centricity" },
  { letter: "T", word: "Technology" },
];

// Capabilities
const capabilities = [
  "High-purity TOC Analyzers",
  "POU Coolers and clean water systems",
  "Compact Heat Exchangers",
  "Ultra-pure water systems for pharma",
  "Particle counters (airborne & liquid)",
  "Microbial air samplers",
  "Aerosol Photometers",
  "Complete AMC, Validation, Calibration & Breakdown services",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Our Purpose Section */}
      <PurposeSection />

      {/* Our Philosophy Section */}
      <PhilosophySection />

      {/* Technology Section */}
      <TechnologySection />

      {/* Mission and Vision Section */}
      <MissionVisionSection />

      {/* Core Values Section */}
      <CoreValuesSection />

      {/* Years of Excellence Timeline */}
      <TimelineSection />

      {/* Trusted Companies Section */}
      <TrustedCompaniesSection />

      {/* Get in Touch Section */}
      <ContactSection />
    </div>
  );
}

function HeroSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`relative h-screen overflow-hidden flex items-center ${
        isVisible ? "scroll-animate visible" : "scroll-animate"
      }`}
      style={{
        background: "conic-gradient(from 152.22deg at 50% 50%, #75A8CC -10.97deg, #234C90 137.17deg, #75A8CC 349.03deg, #234C90 497.17deg)",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
          {/* Left Side - Text */}
          <div className="text-white space-y-6 z-10">
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-normal">
              We are India&apos;s leading company in delivering innovative
              solutions that create lasting impact across industries worldwide.
              Our mission is to transform businesses through technology and
              strategic excellence.
            </p>
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed font-normal opacity-90">
              At Impact & Solutions, we believe that water, purity, and
              reliability are the pillars that keep critical industries moving.
            </p>
          </div>

          {/* Right Side - Images with Yellow Circle */}
          <div className="relative h-full flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[600px] h-full flex items-center justify-center">
              {/* Large Yellow Circle - Centered */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full z-0"
                style={{ backgroundColor: "#D4ED31" }}
              />
              
              {/* Top Right Image - People working at table */}
              <div className="absolute top-[15%] right-[5%] sm:top-[10%] sm:right-[0%] w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-lg overflow-hidden border-2 border-black shadow-xl z-10">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="People working collaboratively at a table"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              
              {/* Bottom Left Image - Office hallway */}
              <div className="absolute bottom-[15%] left-[5%] sm:bottom-[10%] sm:left-[0%] w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-lg overflow-hidden border-2 border-black shadow-xl z-10">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                  alt="Modern office hallway with glass panels"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PurposeSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          {/* Left Side - Icon and Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white" />
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                style={{ color: colors.textPrimary }}
              >
                Our Purpose
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              At Impact & Solutions, we believe that water, purity, and
              reliability are the pillars that keep critical industries moving.
              Since 2018, we have dedicated ourselves to delivering world-class
              clean-utility systems, water-system critical products, and
              precision engineering services that ensure safety, efficiency, and
              sustainability.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              We work with industries where purity cannot be compromised -
              pharmaceuticals, biotechnology, laboratories, and high-performance
              industrial plants.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
              alt="Modern office space"
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-12 lg:mb-16 ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Our Philosophy
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Inspired by global best practices, our philosophy is built on two
            commitments:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* For Our Customers */}
          <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Users
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    style={{ color: colors.primary }}
                  />
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  For Our Customers
                </h3>
              </div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                We engineer systems that deliver consistency, reliability, and
                performance. Our goal is simple: Empower organizations with
                technology that improves efficiency, compliance, and operational
                excellence.
              </p>
            </CardContent>
          </Card>

          {/* For Our Planet */}
          <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Globe
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    style={{ color: colors.primary }}
                  />
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  For Our Planet
                </h3>
              </div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                We approach every solution responsibly conserving water, reducing
                waste, and minimizing environmental impact. Our innovations are
                designed to support long-term sustainability and cost efficiency.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function TechnologySection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-12 lg:mb-16 ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          <span
            className="text-sm font-semibold uppercase tracking-wider block mb-2"
            style={{ color: colors.primary }}
          >
            Our Capabilities
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Technology That Drives Performance
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            We combine engineering expertise with advanced monitoring technologies
            to deliver solutions built for the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {capabilities.map((capability, index) => (
            <Card
              key={index}
              className="p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <CheckCircle
                      className="h-5 w-5"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {capability}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Each product and service is built to deliver long-lasting
            performance, compliance, and cost savings.
          </p>
        </div>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          {/* Vision Card */}
          <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#9333EA" }}
                >
                  <Eye className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  Our Vision
                </h3>
              </div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                To become the global leader in clean-utility and water-management
                solutions, known for engineering excellence, reliability, and
                digital innovation.
              </p>
            </CardContent>
          </Card>

          {/* Mission Card */}
          <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Target className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  Our Mission
                </h3>
              </div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                To deliver technology-driven, customer-centric solutions that
                optimize OPEX, enhance system performance, and support long-term
                customer success.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function CoreValuesSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-12 lg:mb-16 ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          <span
            className="text-sm font-semibold uppercase tracking-wider block mb-2"
            style={{ color: colors.primary }}
          >
            What Drives Us
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Our Core Values - P.A.C.T
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Plus continuous Innovation & Monitoring in everything we do.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {coreValues.map((value, index) => (
            <Card
              key={index}
              className="p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-0">
                <div
                  className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center text-5xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  {value.letter}
                </div>
                <h4
                  className="text-xl sm:text-2xl font-bold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  {value.word}
                </h4>
                <div
                  className="w-12 h-1 mx-auto rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-12 lg:mb-16 ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Our Story
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Founded in 2018, Impact & Solutions began with a small, dedicated
            team committed to transforming water and clean-utility systems in
            India. Through consistent innovation and customer trust, we expanded
            rapidly. Our journey continues as we build smarter, sustainable, and
            globally competitive solutions.
          </p>
        </div>

        {/* Timeline Horizontal Component */}
        <TimelineHorizontal items={timelineData} />
      </div>
    </section>
  );
}

function TrustedCompaniesSection() {
  const [ref, isVisible] = useScrollAnimation();

  const companies = [
    "Sun Pharma",
    "Cipla",
    "Dr. Reddy's",
    "Biological E",
    "Lupin",
    "Troikaa",
    "Bharat Biotech",
    "Mylan",
    "Sanofi",
    "Fresenius Kabi",
    "Intas",
    "Gland Pharma",
    "Alkem",
    "Glenmark",
    "Teva",
    "P&G",
    "Wockhardt",
    "Zenotech",
    "Unichem",
    "Mankind Pharma",
    "BO-Chem",
    "Stelis Biopharma",
    "Akums",
    "APF Water Systems",
    "Caplin Point",
    "Serum Institute of India",
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-12 lg:mb-16 ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          <span
            className="text-sm font-semibold uppercase tracking-wider block mb-2"
            style={{ color: colors.primary }}
          >
            Our Partners
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Trusted by India&apos;s Leading Pharmaceutical Companies
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Impact & Solutions is proud to be a partner to the country&apos;s
            most respected and globally recognized brands. Our solutions support
            critical operations for leading pharmaceutical companies.
          </p>
        </div>

        {/* Infinite Sliding Animation Container */}
        <div className="relative mb-16 overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
          
          {/* Sliding Track */}
          <div className="flex animate-slide-infinite gap-4 sm:gap-6">
            {/* First set of companies */}
            {companies.map((company, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0"
                style={{ width: "180px", minWidth: "180px" }}
              >
                <Card className="p-5 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white h-full">
                  <CardContent className="p-0">
                    <Building2
                      className="h-6 w-6 mx-auto mb-3"
                      style={{ color: colors.primary }}
                    />
                    <p className="text-sm sm:text-base font-medium text-gray-700 leading-tight">
                      {company}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {companies.map((company, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0"
                style={{ width: "180px", minWidth: "180px" }}
              >
                <Card className="p-5 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white h-full">
                  <CardContent className="p-0">
                    <Building2
                      className="h-6 w-6 mx-auto mb-3"
                      style={{ color: colors.primary }}
                    />
                    <p className="text-sm sm:text-base font-medium text-gray-700 leading-tight">
                      {company}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3
            className="text-2xl sm:text-3xl font-bold text-center mb-8"
            style={{ color: colors.textPrimary }}
          >
            Why They Trust Us
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            {
              title: "High-performance engineering",
              icon: Wrench,
            },
            {
              title: "Proven reliability",
              icon: Award,
            },
            {
              title: "Accurate, compliant systems",
              icon: CheckCircle,
            },
            {
              title: "Long-term lifecycle support",
              icon: Sparkles,
            },
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${colors.primary}15` }}
                    >
                      <Icon
                        className="h-8 w-8"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <p className="text-sm sm:text-base font-medium text-gray-700">
                      {benefit.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            This trust is the foundation of our growth, and our motivation to
            innovate every day.
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [ref, isVisible] = useScrollAnimation();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-12 lg:mb-16 ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Get in touch
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Reach out, and let&apos;s create a universe of possibilities
            together!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="space-y-6">
            <div>
              <h3
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: colors.textPrimary }}
              >
                Send us a message
              </h3>
              <p className="text-base sm:text-lg text-gray-600">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    style={{ color: colors.textPrimary }}
                  >
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={
                      errors.lastName
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    style={{ color: colors.textPrimary }}
                  >
                    First Name
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={
                      errors.firstName
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: colors.textPrimary }}>
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" style={{ color: colors.textPrimary }}>
                  Subject
                </Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={
                    errors.subject
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  placeholder="Enter subject"
                />
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" style={{ color: colors.textPrimary }}>
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={
                    errors.message
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  placeholder="Enter your message"
                />
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {submitSuccess && (
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: colors.primary }}
                  >
                    Message sent successfully! We&apos;ll get back to you soon.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
                style={{ background: "linear-gradient(90deg, #763AF5 0%, #A604F2 117.18%)" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Process */}
          <div className="relative">
            <div className="relative h-full min-h-[500px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                alt="Contact process background"
                fill
                className="object-cover blur-sm"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10 p-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                  Our Contact Process
                </h3>
                <ol className="space-y-6">
                  {[
                    "Send Your Message",
                    "Initial Response",
                    "Discovery Call",
                    "Proposal Delivery",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

