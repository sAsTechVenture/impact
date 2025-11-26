"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GlassWater, Wrench, Microscope, ArrowRight } from "lucide-react";
import HeroCarousel from "@/components/common/HeroCarousel";
import { colors } from "@/config/theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Feature icons data
const features = [
  {
    icon: GlassWater,
    title: "Water System Critical Products",
    description:
      "Comprehensive solutions for water purification and management",
  },
  {
    icon: Wrench,
    title: "Engineering, Installation & Commissioning",
    description:
      "End-to-end project execution with expert technical support",
  },
  {
    icon: Microscope,
    title: "Validation, AMC, Calibration, Spares",
    description:
      "Complete lifecycle support and maintenance services",
  },
];

// Services data
const services = [
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    title: "Annual Maintenance",
    description:
      "Comprehensive yearly contracts ensuring optimal system performance and longevity for all your clean utility systems.",
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    title: "Calibration & Validation",
    description:
      "Precision instrument calibration services adhering to international quality standards, ensuring accuracy and compliance.",
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    title: "Operation & Maintenance",
    description:
      "End-to-end operational support and routine maintenance for uninterrupted facility utility operations.",
  },
  {
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    title: "Breakdown Visits",
    description:
      "Rapid response teams dedicated to minimizing downtime during critical system failures with 24/7 support.",
  },
  {
    image: "https://images.unsplash.com/photo-1556761175-b3da8d37e024?w=800&q=80",
    title: "Training Programs",
    description:
      "Expert-led technical training programs for staff on system operation, maintenance, and safety protocols.",
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    title: "Spare Parts & Consumables",
    description:
      "Supply of genuine high-quality spare parts and consumables for all utility systems with guaranteed compatibility.",
  },
];

// Product portfolio data
const products = [
  {
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    title: "TOC Analyzers",
    description:
      "MINI TOC 1 & MINI TOC 2 - High-purity Total Organic Carbon analyzers engineered for precision monitoring and compliance in pharmaceutical and biotech applications.",
    category: "Water Analysis",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    title: "POU Coolers",
    description:
      "IPACT & IPACT+ - Point-of-use coolers and clean water systems designed for optimal performance, reliability, and energy efficiency in critical environments.",
    category: "Water Systems",
  },
  {
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
    title: "Heat Exchangers",
    description:
      "MINI DTSU-BEND, MINI DTS & DTS Shell & Tube - Compact heat exchangers engineered for efficient thermal management in clean utility systems.",
    category: "Thermal Management",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    title: "Particle Counters",
    description:
      "Airborne, Online & Liquid Particle Counters - Advanced monitoring solutions for real-time particle detection ensuring air and water quality compliance.",
    category: "Monitoring Systems",
  },
  {
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    title: "Filter Integrity Tester",
    description:
      "Comprehensive filter integrity testing solutions ensuring optimal filtration performance and regulatory compliance for critical applications.",
    category: "Quality Assurance",
  },
  {
    image: "https://images.unsplash.com/photo-1576086213369-97a306d3655b?w=800&q=80",
    title: "Microbial Air Sampler",
    description:
      "Advanced microbial air sampling systems for environmental monitoring, contamination control, and quality assurance in sterile environments.",
    category: "Environmental Monitoring",
  },
];

// Scroll animation hook
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Keep observing to allow re-animation if needed
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

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <HeroCarousel />
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* About Us Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />

      {/* CTA Section */}
      <CTASection />

      {/* Product Portfolio Section */}
      <ProductPortfolioSection />
    </div>
  );
}

function FeaturesSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center flex flex-col items-center"
              >
                <div
                  className="mb-4 p-4 rounded-lg"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Icon
                    className="h-8 w-8"
                    style={{ color: colors.primary }}
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                  {feature.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
            isVisible ? "scroll-animate visible" : "scroll-animate"
          }`}
        >
          {/* Left Side - Images */}
          <div className="relative">
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
              <Image
                src="/home/more-about-main.jpg"
                alt="City street with people"
                fill
                className="object-cover grayscale"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Animated Circular Images */}
            <div className="absolute -top-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg animate-float">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80"
                alt="Person working on laptop"
                fill
                className="object-cover"
                loading="lazy"
                sizes="160px"
              />
            </div>

            <div className="absolute -bottom-8 -left-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg animate-float-delay-1">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80"
                alt="Person using phone"
                fill
                className="object-cover"
                loading="lazy"
                sizes="160px"
              />
            </div>

            {/* Connecting Lines (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <line
                x1="80%"
                y1="10%"
                x2="90%"
                y2="15%"
                stroke={colors.primary}
                strokeWidth="2"
                className="animate-pulse"
              />
              <line
                x1="10%"
                y1="90%"
                x2="20%"
                y2="85%"
                stroke={colors.primary}
                strokeWidth="2"
                className="animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </svg>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: colors.primary }}
            >
              More About Us
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: colors.textPrimary }}
            >
              Exclusive Distributor for the Indian Market
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Impact & Solutions specializes in water-system critical products and clean utility solutions, serving pharmaceutical, biotech, and industrial sectors with cutting-edge technology and comprehensive support services.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Established in 2018 and based in Navi Mumbai (Panvel), we have dedicated ourselves to delivering world-class clean-utility systems that ensure safety, efficiency, and sustainability for industries where purity cannot be compromised.
            </p>

            <ul className="space-y-3">
              {[
                "Water System Critical Products",
                "Engineering, Installation & Commissioning",
                "Validation, AMC, Calibration & Spares",
                "Complete Lifecycle Support Services"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <span className="text-base sm:text-lg text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/about">
                <Button
                  style={{ backgroundColor: colors.primary }}
                  className="hover:opacity-90"
                >
                  Learn More About Us
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                  }}
                >
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
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
            Our Services
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions for clean utility systems. We provide end-to-end support from installation to maintenance, ensuring optimal performance and compliance for your critical operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
                <h3
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  {service.title}
                </h3>
              </div>
              <p className="text-base sm:text-lg text-gray-600 mb-4 leading-relaxed">
                {service.description}
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all duration-200"
                style={{ color: colors.primary }}
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`relative py-12 sm:py-16 lg:py-20 overflow-hidden ${
        isVisible ? "scroll-animate visible" : "scroll-animate"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src="/home/home-contact.jpg"
          alt="CTA Background"
          fill
          className="object-cover"
          loading="lazy"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/80 to-orange-500/80" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-left text-white z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Transform Your Clean Utility Systems?
        </h2>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl">
          Partner with Impact & Solutions for reliable, technology-driven solutions that optimize OPEX and support long-term customer success. Let's discuss how we can help you achieve operational excellence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/about">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white hover:bg-gray-100"
              style={{ color: colors.textPrimary }}
            >
              Learn More About Us
            </Button>
          </Link>
          <Link href="/about#contact">
            <Button
              size="lg"
              style={{ backgroundColor: colors.primary }}
              className="hover:opacity-90"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductPortfolioSection() {
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
            Our Product Portfolio
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Engineered for Precision & Performance
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            At Impact & Solutions, each product is engineered with precision, innovation, and long-term reliability in mind. Our comprehensive solutions are designed to deliver maximum performance, ensure operational efficiency, and support customer success across diverse industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <div className="relative h-48 sm:h-64">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {product.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3
                  className="text-xl sm:text-2xl font-bold mb-3"
                  style={{ color: colors.textPrimary }}
                >
                  {product.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 mb-4 leading-relaxed">
                  {product.description}
                </p>
                <Link href="/products">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold"
                    style={{ color: colors.primary }}
                  >
                    Explore Product <ArrowRight className="h-4 w-4 inline-block ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              style={{ backgroundColor: colors.primary }}
              className="hover:opacity-90"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
