"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FileText, Wrench, Microscope, ArrowRight } from "lucide-react";
import HeroCarousel from "@/components/common/HeroCarousel";
import { colors } from "@/config/theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Feature icons data
const features = [
  {
    icon: FileText,
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus nec.",
  },
  {
    icon: Wrench,
    title: "Lorem ipsum dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus nec.",
  },
  {
    icon: Microscope,
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus nec.",
  },
];

// Services data
const services = [
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
];

// Blog posts data
const blogPosts = [
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    title: "Lorem ipsum dolor sit amet consectetur. Accumsan.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
  {
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    title: "Lorem ipsum dolor sit amet consectetur. Accumsan.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    title: "Lorem ipsum dolor sit amet consectetur. Accumsan.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
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

      {/* Blog Section */}
      <BlogSection />
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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
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
              Lorem ipsum dolor sit amet consectetur.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus
              leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <ul className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <span className="text-base sm:text-lg text-gray-700">Lorem ipsum dolor</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                style={{ backgroundColor: colors.primary }}
                className="hover:opacity-90"
              >
                Lorem
              </Button>
              <Button
                variant="outline"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                Lorem ipsum dolor sit
              </Button>
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
            Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
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
                href="#"
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
          Lorem ipsum dolor sit amet consectetur.
        </h2>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos eum ab sequi, veniam totam, provident fugiat excepturi laborum, tempore autem exercitationem voluptatem fuga omnis?
        </p>
        <Button
          size="lg"
          style={{ backgroundColor: colors.primary }}
          className="hover:opacity-90"
        >
          Contact Us
        </Button>
      </div>
    </section>
  );
}

function BlogSection() {
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
            Lorem
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Lorem
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 sm:h-64">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <CardContent className="p-6">
                <h3
                  className="text-xl sm:text-2xl font-bold mb-3"
                  style={{ color: colors.textPrimary }}
                >
                  {post.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 mb-4 leading-relaxed">
                  {post.description}
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  style={{ color: colors.primary }}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
