import { Button } from "@/components/ui/button";

const StraplineSection = () => {
  return (
    <section className="py-6 bg-background border-y border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
          <p className="text-white/90 text-lg">
            Protecting Critical Infrastructure from Cyber Warfare
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="border-cyber-amber text-cyber-amber hover:bg-cyber-amber hover:text-background rounded-full px-6"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StraplineSection;