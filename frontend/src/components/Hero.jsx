import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { ArrowRight, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

export const Hero = () => {
  const { t } = useTranslation();

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 text-cyan-400 text-sm font-medium">
              <TrendingUp size={16} />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-white">{t('hero.title.find')} </span>
              <span className="text-gradient">{t('hero.title.zipCodes')}</span>{' '}
              <span className="text-white">{t('hero.title.withAvailability')}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
              {t('hero.description')}{' '}
              <span className="text-cyan-400 text-sm">*{t('hero.conditions')}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={scrollToPricing}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg px-8 py-6 rounded-full btn-primary glow-effect group"
                data-testid="hero-cta-btn"
              >
                {t('hero.cta.download')}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button 
                variant="outline"
                onClick={scrollToHowItWorks}
                className="border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold text-lg px-8 py-6 rounded-full"
              >
                {t('hero.cta.howItWorks')}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-xl mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-cyan-400">48h</div>
                <div className="text-sm text-gray-400">{t('hero.stats.scan')}</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-cyan-400">$20</div>
                <div className="text-sm text-gray-400">{t('hero.stats.price')}</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-cyan-400">AI</div>
                <div className="text-sm text-gray-400">{t('hero.stats.waitlist')}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative rounded-3xl overflow-hidden glow-border">
              <img 
                src="https://images.unsplash.com/photo-1642665049711-7374ce0e66f0?w=800&h=600&fit=crop"
                alt="Delivery driver using GIG ZipFinder"
                className="w-full h-auto rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 to-transparent"></div>
              
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#1e293b]/90 backdrop-blur-md rounded-2xl p-4 border border-cyan-500/30 animate-float">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/20 p-3 rounded-full">
                    <MapPin className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <div className="text-white font-semibold">ZIP: 90210</div>
                    <div className="text-yellow-400 text-sm font-medium">⚠ Suggested</div>
                  </div>
                  <div className="ml-auto text-cyan-400 font-bold text-xl">AI</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
