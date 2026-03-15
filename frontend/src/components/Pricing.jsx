import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export const Pricing = () => {
  const { t } = useTranslation();
  
  const features = [
    t('pricing.feature1'),
    t('pricing.feature2'),
    t('pricing.feature3'),
    t('pricing.feature4'),
    t('pricing.feature5')
  ];

  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">{t('pricing.title')} </span>
            <span className="text-gradient">{t('pricing.title2')}</span>
          </h2>
          <p className="text-lg text-gray-300">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Popular Badge */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <Sparkles size={16} />
              {t('pricing.launchOffer')}
            </div>

            <div className="bg-[#1e293b] rounded-3xl p-8 lg:p-10 border-2 border-cyan-500/50 card-glow animate-pulse-glow mt-6">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="text-gray-400 mb-2">{t('pricing.perApp')}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-5xl lg:text-6xl font-bold text-white">$20.00</span>
                  <span className="text-2xl text-gray-400">USD</span>
                </div>
                <div className="text-cyan-400 font-medium">
                  {t('pricing.oneTime')}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="text-white font-semibold text-lg mb-4">{t('pricing.includes')}</div>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-cyan-500/20 rounded-full p-1 mt-0.5">
                      <Check className="text-cyan-400" size={16} />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Payment Info */}
              <div className="bg-[#0f172a] rounded-xl p-4 mb-6 border border-cyan-500/20">
                <div className="flex items-center gap-3 text-cyan-400 mb-2">
                  <Check size={20} />
                  <span className="font-semibold">{t('pricing.secure')}</span>
                </div>
                <p className="text-gray-400 text-sm">
                  {t('pricing.secureDescription')}
                </p>
              </div>

              {/* App Selection Buttons */}
              <div className="space-y-3">
                {[
                  { key: 'instacart', name: 'Instacart', icon: '🛒' },
                  { key: 'doordash', name: 'DoorDash', icon: '🍕' },
                  { key: 'spark', name: 'Spark Driver', icon: '🚗' },
                ].map((appItem) => (
                  <Button
                    key={appItem.key}
                    onClick={() => navigate(`/purchase/${appItem.key}`)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-bold text-lg py-5 rounded-full btn-primary flex items-center justify-center gap-3"
                    data-testid={`buy-${appItem.key}-btn`}
                  >
                    <span className="text-2xl">{appItem.icon}</span>
                    {appItem.name} - $20.00 USD
                  </Button>
                ))}
              </div>

              <p className="text-center text-gray-400 text-sm mt-4">
                {t('pricing.ctaSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">{t('pricing.paymentMethods')}</p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="bg-white px-6 py-3 rounded-lg border border-cyan-500/20 flex items-center">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg" 
                alt="Visa" 
                className="h-8 w-auto"
                style={{ filter: 'invert(16%) sepia(93%) saturate(4879%) hue-rotate(212deg) brightness(92%) contrast(104%)' }}
              />
            </div>
            <div className="bg-white px-6 py-3 rounded-lg border border-cyan-500/20 flex items-center">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mastercard.svg" 
                alt="Mastercard" 
                className="h-8 w-auto"
              />
            </div>
            <div className="bg-white px-6 py-3 rounded-lg border border-cyan-500/20 flex items-center">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/americanexpress.svg" 
                alt="American Express" 
                className="h-8 w-auto"
                style={{ filter: 'invert(35%) sepia(94%) saturate(1849%) hue-rotate(183deg) brightness(95%) contrast(101%)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
