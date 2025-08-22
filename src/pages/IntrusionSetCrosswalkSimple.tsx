import Navigation from "@/components/Navigation";

const IntrusionSetCrosswalkSimple = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black">
      <Navigation />
      <div className="container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-white mb-8">
          Intrusion Set Crosswalk - Simple Test
        </h1>
        <p className="text-white/80">
          This is a simplified version to test if the route works.
        </p>
      </div>
    </div>
  );
};

export default IntrusionSetCrosswalkSimple;