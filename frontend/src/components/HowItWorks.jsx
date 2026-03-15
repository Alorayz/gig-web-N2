import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Search, ShoppingCart, Rocket } from 'lucide-react';

export const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      icon: ShoppingCart,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      color: 'cyan'
    },
    {
      number: '02',
      icon: Search,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      color: 'green'
    },
    {
      number: '03',
      icon: Check,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      color: 'cyan'
    },
    {
      number: '04',
      icon: Rocket,
      title: t('howItWorks.step4.title'),
      description: t('howItWorks.step4.description'),
      color: 'green'
    }
  ];
  return (
    <section id="how-it-works" className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-b from-transparent to-[#0f172a]/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">{t('howItWorks.title')} </span>
            <span className="text-gradient">{t('howItWorks.title2')}</span>
          </h2>
          <p className="text-lg text-gray-300">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/20 via-green-500/20 to-cyan-500/20 transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Card */}
                  <div className="bg-[#1e293b] rounded-2xl p-6 border border-cyan-500/20 card-glow h-full flex flex-col relative z-10">
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 bg-gradient-to-br from-cyan-500 to-green-500 text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-xl mb-4 w-fit ${
                      step.color === 'cyan' 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      <Icon size={32} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector - Mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <div className="w-1 h-8 bg-gradient-to-b from-cyan-500/50 to-green-500/50"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-3 text-green-400 font-medium">
            <Check size={20} />
            <span>¡Simple, rápido y efectivo!</span>
          </div>
        </div>
      </div>
    </section>
  );
};
