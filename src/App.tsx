/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Background } from "./components/Background";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SelectedWorks } from "./components/SelectedWorks";
import { MarketShift } from "./components/MarketShift";
import { Labs } from "./components/Labs";
import { Solutions } from "./components/Solutions";
import { Explorations } from "./components/Explorations";
import { CaseImpact } from "./components/CaseImpact";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <main className="relative min-h-screen selection:bg-accent selection:text-white">
      <Background />
      <Navbar />
      <Hero />
      <SelectedWorks />
      <MarketShift />
      <Labs />
      <Solutions />
      <Explorations />
      <CaseImpact />
      <FinalCTA />
      <Footer />
    </main>
  );
}

