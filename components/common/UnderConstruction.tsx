"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Construction } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  className?: string;
}

export default function UnderConstruction({
  title = "Under Construction",
  description = "We're working hard to bring you something amazing. This page will be available soon!",
  showHomeButton = true,
  className,
}: UnderConstructionProps) {
  return (
    <div
      className={cn(
        "min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 sm:py-16 md:py-20 relative",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Animated Construction Icon */}
            <motion.div
              className="flex justify-center mb-4"
              animate={{
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                <div className="relative bg-primary/10 p-6 rounded-full">
                  <Construction className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-primary" />
                </div>
              </div>
            </motion.div>

            <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>Coming Soon</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary/90 to-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {showHomeButton && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/about" className="flex items-center gap-2">
                    Learn More About Us
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

