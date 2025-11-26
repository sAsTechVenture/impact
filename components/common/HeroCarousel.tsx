"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { colors } from "@/config/theme";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  type: "image" | "video";
  src: string;
  alt?: string;
}

const heroSlides: HeroSlide[] = [
  {
    type: "image",
    src: "/home/hero-1.jpg",
    alt: "Business professionals meeting",
  },
  {
    type: "video",
    src: "https://lwk0xhujsazl5rt4.public.blob.vercel-storage.com/home-assets/impact123.mp4",
    alt: "Impact & Solutions expo",
  },
  {
    type: "video",
    src: "https://lwk0xhujsazl5rt4.public.blob.vercel-storage.com/home-assets/impact-hero.mp4",
    alt: "Impact & Solutions products",
  },
  {
    type: "image",
    src: "/home/hero-4.jpg",
    alt: "Team collaboration",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    const currentSlideData = heroSlides[currentSlide];
    if (currentSlideData.type === "video" && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      
      // Stop auto-slide when video starts playing
      setIsAutoPlaying(false);
      
      // Play video
      video.play().catch(() => {
        // Auto-play might be blocked by browser, resume auto-slide
        setIsAutoPlaying(true);
      });

      // Resume auto-slide when video ends
      const handleVideoEnd = () => {
        setIsAutoPlaying(true);
      };

      video.addEventListener("ended", handleVideoEnd);

      return () => {
        video.removeEventListener("ended", handleVideoEnd);
      };
    } else {
      // Resume auto-slide for image slides
      setIsAutoPlaying(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {slide.type === "video" ? (
            <video
              ref={index === currentSlide ? videoRef : null}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="auto"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={slide.src}
              alt={slide.alt || `Hero slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Overlay Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="mb-4 animate-fade-in">
            <span className="inline-block px-4 py-2 text-sm sm:text-base font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              We Manage Your Water
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
            Precision Engineering.<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              Uncompromising Quality.
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto animate-fade-in-delay font-light leading-relaxed">
            Trusted by India's leading pharmaceutical companies. We deliver world-class clean utility systems and water management solutions that ensure safety, efficiency, and regulatory compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
            <Link href="/products">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Products
              </Button>
            </Link>
            <Link href="/about#contact">
              <Button
                size="lg"
                style={{ backgroundColor: colors.primary }}
                className="hover:opacity-90 font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        onClick={prevSlide}
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={nextSlide}
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroSlides.map((_, index) => (
          <Button
            key={index}
            onClick={() => goToSlide(index)}
            variant="ghost"
            size="icon"
            className={`h-2 w-2 rounded-full transition-all duration-300 p-0 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

