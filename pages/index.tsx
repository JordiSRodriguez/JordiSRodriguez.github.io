import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ContactMe from "@/components/ContactMe";
import Link from "next/link";
import Image from "next/image";
import logo from "../components/logo.svg";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Jordi-dev | Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-[rgb(36,36,36)] text-white h-screen snap-y snap-mandatory overflow-y-scroll 
      overflox-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[green]/80">
        <Header />
        <section id="hero" className="snap-start">
          <Hero />
        </section>

        <section id="about" className="snap-center">
          <About />
        </section>

        <section id="skills" className="snap-start">
          <Skills />
        </section>

        <section id="projects" className="snap-start">
          <Projects />
        </section>

        <section id="contact" className="snap-start">
          <ContactMe />
        </section>

        
        <footer className="sticky bottom-5 w-full">
          <div className="flex items-center justify-center space-x-7">
            <p className="text-2xl font-semibold hover:text-[#23ff23]">jordi-dev</p>
            <Link href="#hero">
            <Image className="h-10 w-10 rounded-full filter grayscale hover:grayscale-0 cursor-pointer" src={logo} alt="logo"></Image>
            </Link>
            <p className="text-2xl font-semibold hover:text-[#23ff23]">© 2023</p>
          </div>
        </footer>
      </div>
    </>
  );
}
