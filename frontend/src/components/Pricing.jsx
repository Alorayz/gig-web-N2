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
            {['visa', 'mastercard', 'americanexpress'].map((card) => (
              <div key={card} className="bg-white/90 px-5 py-2 rounded-lg">
                <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${card}.svg`} alt={card} className="h-7 w-auto opacity-70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
