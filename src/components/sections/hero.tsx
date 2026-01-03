import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, Sparkles } from "lucide-react";
import { trackButtonClick } from "@/utils/analytics";
import { motion } from "framer-motion";

export const Hero = () => {
  const handleDownloadCV = () => {
    trackButtonClick('download_cv', { 
      location: 'hero_section',
      button_type: 'download'
    });
    
    const link = document.createElement('a');
    link.href = '/Mounir_CV_2025.pdf';
    link.download = 'Mounir_Abderrahmani_CV_2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewWork = () => {
    trackButtonClick('view_work', { 
      location: 'hero_section',
      button_type: 'cta'
    });
    
    document.querySelector('#projects')?.scrollIntoView({behavior:'smooth'});
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center py-12 sm:py-20 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-3/4 left-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -30, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Profile Image */}
          <motion.div 
            className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-6 sm:mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="relative bg-white dark:bg-gray-900 rounded-full p-1.5 sm:p-2 shadow-2xl backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <img 
                src="/profile.webp" 
                alt="Mounir Abderrahmani" 
                className="w-full h-full rounded-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="space-y-3 sm:space-y-4">
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.span 
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  Mounir Abderrahmani
                </motion.span>
              </motion.h1>
              
              <motion.div 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium flex items-center justify-center gap-1 sm:gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
                Full-Stack Developer & Data Engineer
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
              </motion.div>
            </div>
          </motion.div>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
            Transforming complex business challenges into elegant digital solutions. 
            Specialized in <span className="text-primary font-semibold">React, Node.js, and enterprise integrations</span> 
            with a proven track record of delivering 
            <span className="text-primary font-semibold"> scalable systems</span> that drive measurable business growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-4">
            <Button 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 shadow-glow hover:shadow-large transition-all duration-300 hover:scale-105" 
              onClick={handleViewWork}
            >
              <span>View My Work</span>
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
              onClick={handleDownloadCV}
            >
              <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span>Download CV</span>
            </Button>
          </div>
          
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="text-xl sm:text-2xl font-bold text-primary">10+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Years Experience</div>
            </motion.div>
            <div className="w-px h-8 sm:h-12 bg-border hidden sm:block"></div>
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="text-xl sm:text-2xl font-bold text-primary">150+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Projects Completed</div>
            </motion.div>
            <div className="w-px h-8 sm:h-12 bg-border hidden sm:block"></div>
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="text-xl sm:text-2xl font-bold text-primary">99%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Client Satisfaction</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};