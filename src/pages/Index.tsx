import { Navigation } from "@/components/ui/navigation";
import { Hero } from "@/components/sections/hero";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Projects />
      </main>
      
      <footer id="contact" className="py-16 px-6 bg-card/50 backdrop-blur-sm border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Let's Build Something Great Together</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to discuss your next project? I'd love to hear about your ideas and explore how we can bring them to life.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:mounir.webdev@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-glow hover:shadow-large duration-300 hover:scale-105"
            >
              Get In Touch
            </a>
            <div className="flex gap-6">
              <a href="https://linkedin.com/in/mounir1badi" className="text-muted-foreground hover:text-primary transition-colors">
                LinkedIn
              </a>
              <a href="https://github.com/mounir1" className="text-muted-foreground hover:text-primary transition-colors">
                GitHub
              </a>
              <a href="tel:+213674094855" className="text-muted-foreground hover:text-primary transition-colors">
                +213 674 09 48 55
              </a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 text-sm text-muted-foreground">
            <p>&copy; 2024 Mounir Abderrahmani. Crafted with modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
