"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  year: string | number;
  title: string;
  description: string;
  image: string; // required
}

interface TimelineHorizontalProps {
  items: TimelineItem[];
  className?: string;
}

export function TimelineHorizontal({
  items,
  className,
}: TimelineHorizontalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Animate timeline line when section comes into view
  const isSectionInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -200px 0px",
  });

  // Handle horizontal scroll with mouse wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Mobile drag scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      setIsDragging(true);
      const clientX =
        "touches" in e ? e.touches[0].clientX : e.clientX;
      setStartX(clientX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const clientX =
        "touches" in e ? e.touches[0].clientX : e.clientX;
      const x = clientX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (container) {
        container.style.cursor = "grab";
        container.style.userSelect = "auto";
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("touchstart", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);
    container.addEventListener("touchend", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("touchstart", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
      container.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, startX, scrollLeft]);

  // Update progress bar based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    const progress = progressRef.current;
    if (!container || !progress) return;

    const updateProgress = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const progressPercent = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;
      progress.style.transform = `scaleX(${progressPercent})`;
    };

    container.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial update

    return () => container.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <section ref={sectionRef} className={cn("w-full py-20 relative", className)}>
      {/* Timeline Container */}
      <div
        ref={containerRef}
        className="w-full overflow-x-scroll scrollbar-hide snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex gap-8 px-10 relative">
          {/* Animated Timeline Line */}
          <motion.div
            className="absolute left-10 right-10 top-1/2 h-0.5 bg-border -translate-y-1/2 z-0"
            initial={{ scaleX: 0 }}
            animate={isSectionInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
            style={{ originX: 0 }}
          />

          {items.map((item, index) => (
            <TimelineCard key={index} item={item} index={index} total={items.length} />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 bg-muted mx-10 mt-8 overflow-hidden rounded-full">
        <motion.div
          ref={progressRef}
          className="absolute top-0 left-0 h-full w-full origin-left bg-gradient-to-r from-primary via-primary/90 to-primary"
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </section>
  );
}

// Individual Timeline Card Component with enhanced animations
function TimelineCard({
  item,
  index,
  total,
}: {
  item: TimelineItem;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -150px 0px",
  });

  const [isHovered, setIsHovered] = useState(false);

  // Staggered animation based on index
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      x: index % 2 === 0 ? -30 : 30,
      scale: 0.8,
      rotateY: index % 2 === 0 ? -15 : 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotateY: 0,
    },
  };

  // Text reveal variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // Year animation with scale effect
  const yearVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
  };

  // Image zoom animation
  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.15,
    },
  };

  return (
    <motion.div
      ref={ref}
      data-index={index}
      className="flex-shrink-0 snap-start relative z-10"
      style={{ width: "320px", minWidth: "320px" }}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Timeline Node */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isInView
            ? {
                scale: 1,
                opacity: 1,
              }
            : { scale: 0, opacity: 0 }
        }
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: index * 0.15 + 0.5,
        }}
        whileHover={{ scale: 1.5 }}
      >
        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary"
          animate={
            isInView
              ? {
                  scale: [1, 1.8, 1],
                  opacity: [0.6, 0, 0.6],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15 + 1,
          }}
        />
      </motion.div>

      {/* Card positioned above or below timeline */}
      <motion.div
        className={cn(
          "relative",
          index % 2 === 0 ? "mb-16" : "mt-16"
        )}
        whileHover={{ y: index % 2 === 0 ? -8 : 8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ 
            scale: 1.03,
            rotateY: index % 2 === 0 ? 2 : -2,
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={cn(
              "h-full border bg-background shadow-sm rounded-xl overflow-hidden transition-all duration-300",
              isHovered
                ? "shadow-xl border-primary/20"
                : "hover:shadow-lg"
            )}
          >
            {/* Image with zoom effect */}
            <motion.div
              ref={imageRef}
              className="relative w-full h-[160px] overflow-hidden"
              variants={imageVariants}
              initial="rest"
              animate={isHovered ? "hover" : "rest"}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded-t-lg"
                sizes="320px"
                loading="lazy"
              />
              {/* Gradient overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <CardContent className="p-6">
              {/* Year with spring animation */}
              <motion.h3
                className="text-4xl sm:text-5xl font-bold mb-4 text-foreground"
                variants={yearVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: index * 0.15 + 0.2,
                }}
              >
                {item.year}
              </motion.h3>

              {/* Title with fade and slide */}
              <motion.h4
                className="text-xl sm:text-2xl font-semibold mb-3 text-foreground"
                variants={textVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15 + 0.4,
                  ease: "easeOut",
                }}
              >
                {item.title}
              </motion.h4>

              {/* Description with staggered reveal */}
              <motion.p
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                variants={textVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15 + 0.6,
                  ease: "easeOut",
                }}
              >
                {item.description}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
