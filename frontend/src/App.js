import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { HighDemandNotice } from "./components/HighDemandNotice";
import { Footer } from "./components/Footer";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { Purchase } from "./components/Purchase";
import { PaymentSuccess } from "./components/PaymentSuccess";
import { Dashboard } from "./components/Dashboard";

import { DownloadApps } from "./components/DownloadApps";
import { ArchitectureDiagram } from "./components/ArchitectureDiagram";

const HomePage = () => (
  <>
    <Hero />
    <Features />
    <HowItWorks />
    <Pricing />
    <ArchitectureDiagram />
    <DownloadApps />
    <FAQ />
    <HighDemandNotice />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/purchase/:appName" element={<Purchase />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/dashboard/:appName" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
