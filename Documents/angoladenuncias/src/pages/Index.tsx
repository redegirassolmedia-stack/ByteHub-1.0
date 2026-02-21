import Header from "@/components/Header";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import HeroSection from "@/components/HeroSection";
import NewsGrid from "@/components/NewsGrid";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";
import RadioPlayer from "@/components/RadioPlayer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BreakingNewsTicker />
      <main>
        <HeroSection />
        <VideoSection />
        <NewsGrid />
      </main>
      <Footer />
      <RadioPlayer />
    </div>
  );
};

export default Index;
