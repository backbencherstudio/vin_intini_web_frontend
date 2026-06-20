import Hero from "./_components/Hero";
import Features from "./_components/Features";
import HowWeWork from "./_components/HowWeWork";
import Testimonials from "./_components/Testimonials";
import Opportunities from "./_components/Opportunities";
import OurImpact from "./_components/OurImpact";
import GetApp from "./_components/GetApp";

export default function Home() {
  return (
    <div className="w-full h-full">
      <Hero />
      <Features />
      <HowWeWork />
      {/* <Testimonials /> */}
      {/* <Opportunities /> */}
      {/* <OurImpact /> */}
      <GetApp />
    </div>
  );
}
