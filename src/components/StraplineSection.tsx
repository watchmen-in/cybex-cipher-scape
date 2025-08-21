import { Button } from "@/components/ui/button";

const StraplineSection = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-background via-background/95 to-background border-y border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            variant="outline" 
            size="lg"
            className="border-cyber-amber text-cyber-amber hover:bg-cyber-amber hover:text-background rounded-full px-8 py-3"
          >
            Defend Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-background rounded-full px-8 py-3"
          >
            Request Sector Playbook
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-cyber-salmon text-cyber-salmon hover:bg-cyber-salmon hover:text-background rounded-full px-8 py-3"
          >
            Explore Live Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/30 text-white hover:bg-white hover:text-background rounded-full px-8 py-3"
          >
            Get Free Government Resources Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StraplineSection;