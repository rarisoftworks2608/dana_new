import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import TechFocusAreas from '../components/landing/TechFocusAreas';
import WhyAttend from '../components/landing/WhyAttend';
import Objectives from '../components/landing/Objectives';
import TakeBackImplement from '../components/landing/TakeBackImplement';
import Stats from '../components/landing/Stats';
import Venue from '../components/landing/Venue';
import RegistrationForm from '../components/landing/RegistrationForm';
import FAQ from '../components/landing/FAQ';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';
import SkipLink from '../components/common/SkipLink';

export default function LandingPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <TechFocusAreas />
        <WhyAttend />
        <Objectives />
        <TakeBackImplement />
        <Stats />
        <Venue />
        <RegistrationForm />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
