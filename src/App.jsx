import { useState } from "react";
import useSmoothScroll from "./hooks/useSmoothScroll";
import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SignatureDishes from "./components/SignatureDishes";
import FloatingElements from "./components/FloatingElements";
import FullMenu from "./components/FullMenu";
import Ambience from "./components/Ambience";
import Testimonials from "./components/Testimonials";
import Reservation from "./components/Reservation";
import Footer from "./components/Footer";

function App() {
  const [loading, setLoading] = useState(true);
  useSmoothScroll();

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <CustomCursor />
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <Navbar />
      <main>
        <Hero />
        <SignatureDishes />
        <FloatingElements />
        <FullMenu />
        <Ambience />
        <Testimonials />
        <Reservation />
      </main>
      <Footer />
    </>
  );
}

export default App;
