import { Button } from "@/components/ui/button";

const StraplineSection = () => {
  return (
    <section className="py-12 bg-background border-y border-white/10">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-8">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <span className="text-cyber-amber">•</span>
              <span className="text-white/90">Defend Now</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyber-amber">•</span>
              <span className="text-white/90">Schedule Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyber-amber">•</span>
              <span className="text-white/90">Explore the Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyber-amber">•</span>
              <span className="text-white/90">Join Defense Network</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyber-amber">•</span>
              <span className="text-white/90">View Reports</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-cyber-amber text-cyber-amber hover:bg-cyber-amber hover:text-background rounded-full px-6"
            >
              Defend Now
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-background rounded-full px-6"
            >
              Request Sector Playbook
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-cyber-salmon text-cyber-salmon hover:bg-cyber-salmon hover:text-background rounded-full px-6"
            >
              Explore Live Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/30 text-white hover:bg-white hover:text-background rounded-full px-6"
            >
              Get Free Government Resources Guide
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StraplineSection;