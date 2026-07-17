import Hero from "@/components/Hero";
import Meetdoctor from "@/components/Meetdoctor";
import About from "@/components/About";
import Whyus from "@/components/Whyus";
import Services from "@/components/Services";
import Transformation from "@/components/Transformation";
import Booking from "@/components/Booking";
import Testimonials from "@/components/Testimonials";
import Questions from "@/components/Questions";
import Newsletter from "@/components/Newsletter.jsx";


export default function Home() {
  return (
    <main>
      <Hero />
      <Meetdoctor /> 
      <About />
      <Services />
      <Whyus /> 
      <Transformation />
      <Booking />
      <Testimonials />
      <Questions />
      <Newsletter />
    </main>
  );
}