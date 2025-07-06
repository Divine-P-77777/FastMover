'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Truck, Users, Hammer } from 'lucide-react';

// Extend refs for type safety
interface StepRefs extends HTMLLIElement {}
interface CardRefs extends HTMLDivElement {}

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const stepsRef = useRef<Array<StepRefs | null>>([]);
  const cardsRef = useRef<Array<CardRefs | null>>([]);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );
    }

    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
            },
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power2.out',
          }
        );
      }
    });

    stepsRef.current.forEach((step, i) => {
      if (step) {
        gsap.fromTo(
          step,
          { opacity: 0, x: -50 },
          {
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
            },
            opacity: 1,
            x: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power2.out',
          }
        );
      }
    });
  }, []);

  const theme = {
    primary: '#ff6a00',
    text: isDarkMode ? '#f3f4f6' : '#111827',
    background: isDarkMode ? '#121212' : '#ffffff',
    card: isDarkMode ? '#1f1f1f' : '#ffffff',
    section: isDarkMode ? '#191919' : '#f9fafb',
  };

  return (
    <main style={{ backgroundColor: theme.background, color: theme.text }}>
      <section
        ref={heroRef}
        className="min-h-screen px-6 py-20 bg-cover bg-center flex flex-col justify-center items-center text-center pt-25"
        style={{
          backgroundImage: "url('/images/truck-doorstep.jpg')",
          backgroundColor: 'rgba(0,0,0,0.4)',
          backgroundBlendMode: 'darken',
          color: theme.text,
        }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-orange-600">
          Move Smarter. Build Faster. With FastMover.
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Book trucks, labor, and transport in minutes.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/book" className="bg-orange-600 text-white px-6 py-3 rounded shadow hover:bg-orange-700">
            Get Started
          </Link>
          <Link href="/driver/register" className="border border-orange-600 text-orange-600 px-6 py-3 rounded hover:bg-orange-100">
            Become a Driver
          </Link>
        </div>
        <Image src="/stuffs/truckgif.gif" alt="Truck Animation" width={300} height={300} className="mt-10 rounded-2xl" />
      </section>

      <section className="min-h-screen flex flex-col justify-center px-6 py-20" style={{ backgroundColor: theme.section }}>
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Why FastMover?</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <ul className="space-y-4 text-lg">
            <li>❌ Hiring labor is hectic and unclear</li>
            <li>❌ Local trucks lack transparency</li>
            <li>❌ Construction help is unorganized</li>
          </ul>
          <div className="rounded shadow p-6" style={{ backgroundColor: theme.card }}>
            <h3 className="text-xl font-semibold mb-2 text-orange-600">With FastMover ✅</h3>
            <p>
              We empower local workers and streamline logistics for Indian homes. Transparent pricing, verified labor, GPS tracking & live support.
            </p>
          </div>
        </div>
      </section>

      <section className="min-h-screen px-6 py-20 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12">How It Works</h2>
        <ol className="relative border-l border-orange-500 max-w-xl">
          {['Select Pickup & Drop Location', 'Choose Vehicle + Labor', 'Admin Confirms → Driver Assigned', 'Track, Pay, and Done!'].map((step, index) => (
            <li
              key={index}
              ref={(el: HTMLLIElement | null) => { stepsRef.current[index] = el; }}
              className="mb-10 ml-6"
            >
              <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-500 rounded-full -left-3">{index + 1}</span>
              <h3 className="font-semibold ml-6">{step}</h3>
            </li>
          ))}
        </ol>
      </section>

      <section className="min-h-screen px-6 py-20 text-center" style={{ backgroundColor: theme.section }}>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Own a Vehicle? Start Earning Today.</h2>
        <p className="mb-6 text-lg">Real clients. Flexible hours. Admin support.</p>
        <Link href="/driver/register" className="inline-block bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700">
          Register as Driver
        </Link>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ icon: <Truck />, label: 'Verified Bookings' }, { icon: <Users />, label: 'Local Community' }, { icon: <Hammer />, label: 'Tools Provided' }].map((item, i) => (
            <div
              key={i}
              ref={(el: HTMLDivElement | null) => { cardsRef.current[i] = el; }}
              className="p-6 rounded shadow flex flex-col items-center"
              style={{ backgroundColor: theme.card }}
            >
              <div className="text-orange-600 mb-2">{item.icon}</div>
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <section
        className="min-h-screen px-6 py-20 bg-cover bg-center flex flex-col justify-center items-center text-center"
        style={{ backgroundImage: "url('/images/truck-doorstep.jpg')" }}
      >
        <h2 className="text-4xl md:text-5xl font-bold  drop-shadow">Trusted by homes. Powered by locals.</h2>
        <div className="mt-6 flex gap-4">
          <Link href="/book" className="bg-orange-600 text-white px-6 py-3 rounded shadow hover:bg-orange-700">
            Book Now
          </Link>
          <Link href="/contact" className="bg-white text-orange-600 px-6 py-3 rounded shadow hover:bg-orange-100">
            Contact Us
          </Link>
        </div>
        <div className="mt-8  text-sm">
          Email: support@fastmover.in | WhatsApp: +91-9876543210 | Helpline: 1800-123-456 | Mumbai
        </div>
      </section>
    </main>
  );
}
