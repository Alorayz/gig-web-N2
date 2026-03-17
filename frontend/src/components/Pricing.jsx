import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';

const APPS = [
  { key: 'instacart', name: 'Instacart', Icon: ShoppingBag, gradient: 'from-emerald-500 to-green-600' },
  { key: 'doordash', name: 'DoorDash', Icon: ShoppingBag, gradient: 'from-red-500 to-rose-600' },
  { key: 'spark', name: 'Spark Driver', Icon: ShoppingBag, gradient: 'from-blue-500 to-indigo-600' },
];

export const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    t('pricing.feature1'),
    t('pricing.feature2'),
    t('pricing.feature3'),
    t('pricing.feature4'),
    t('pricing.feature5')
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">{t('pricing.title')} </span>
            <span className="text-gradient">{t('pricing.title2')}</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300">{t('pricing.subtitle')}</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg z-10">
              <Sparkles size={16} /> {t('pricing.launchOffer')}
            </div>

            <div className="bg-[#1e293b] rounded-3xl p-8 lg:p-10 border-2 border-cyan-500/50 mt-6">
              <div className="text-center mb-8">
                <div className="text-gray-400 mb-2">{t('pricing.perApp')}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-5xl lg:text-6xl font-bold text-white">$20.00</span>
                  <span className="text-2xl text-gray-400">USD</span>
                </div>
                <div className="text-cyan-400 font-medium">{t('pricing.oneTime')}</div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="text-white font-semibold text-lg mb-4">{t('pricing.includes')}</div>
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-cyan-500/20 rounded-full p-1 mt-0.5"><Check className="text-cyan-400" size={14} /></div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-xl p-4 mb-6 border border-cyan-500/20">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <ShieldCheck size={18} />
                  <span className="font-semibold text-sm">{t('pricing.secure')}</span>
                </div>
                <p className="text-gray-400 text-xs">{t('pricing.secureDescription')}</p>
              </div>

              <div className="space-y-3">
                {APPS.map((app) => (
                  <Button
                    key={app.key}
                    onClick={() => navigate(`/purchase/${app.key}`)}
                    className={`w-full bg-gradient-to-r ${app.gradient} hover:opacity-90 text-white font-bold text-base py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02]`}
                    data-testid={`buy-${app.key}-btn`}
                  >
                    <app.Icon size={22} strokeWidth={2.5} />
                    {app.name} — $20.00 USD
                  </Button>
                ))}
              </div>

              <p className="text-center text-gray-500 text-xs mt-4">{t('pricing.ctaSubtitle')}</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm mb-4">{t('pricing.paymentMethods')}</p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {/* Visa */}
            <div className="bg-white px-5 py-2.5 rounded-lg flex items-center justify-center" data-testid="card-visa">
              <svg viewBox="0 0 48 16" width="56" height="20">
                <path fill="#1434CB" d="M19.3 0.5L16.2 15.5H13L16 0.5H19.3ZM32.8 10.2L34.5 5.4L35.5 10.2H32.8ZM36.5 15.5H39.5L36.9 0.5H34.1C33.3 0.5 32.6 1 32.3 1.7L27 15.5H30.5L31.2 13.4H35.5L36.5 15.5ZM28.3 10.5C28.3 6.6 22.8 6.4 22.8 4.6C22.8 4 23.4 3.3 24.6 3.2C25.2 3.1 26.8 3 28.6 3.9L29.3 1C28.3 0.6 27 0.3 25.4 0.3C22.1 0.3 19.8 2 19.8 4.5C19.8 6.4 21.4 7.4 22.7 8.1C24 8.8 24.4 9.2 24.4 9.8C24.4 10.7 23.3 11.1 22.3 11.1C20.6 11.1 19.6 10.7 18.8 10.3L18 13.3C18.9 13.7 20.5 14.1 22.2 14.1C25.7 14.1 28.3 12.5 28.3 10.5ZM12.5 0.5L7.6 15.5H4L1.6 2.9C1.4 2.1 1.3 1.8 0.6 1.4C-0.5 0.8 0.1 1 0.1 1L0 0.5H5.5C6.3 0.5 7 1 7.1 2L8.3 9.5L11.7 0.5H12.5Z"/>
              </svg>
            </div>
            {/* Mastercard */}
            <div className="bg-white px-5 py-2.5 rounded-lg flex items-center justify-center" data-testid="card-mastercard">
              <svg viewBox="0 0 48 30" width="48" height="28">
                <circle cx="18" cy="15" r="13" fill="#EB001B"/>
                <circle cx="30" cy="15" r="13" fill="#F79E1B"/>
                <path d="M24 4.7C26.5 6.6 28 9.6 28 13c0 3.4-1.5 6.4-4 8.3-2.5-1.9-4-4.9-4-8.3 0-3.4 1.5-6.4 4-8.3z" fill="#FF5F00"/>
              </svg>
            </div>
            {/* American Express */}
            <div className="bg-[#006FCF] px-4 py-2.5 rounded-lg flex items-center justify-center" data-testid="card-amex">
              <span className="text-white font-bold text-xs tracking-tight leading-none text-center">AMERICAN<br/>EXPRESS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
