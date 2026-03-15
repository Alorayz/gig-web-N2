import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Loader2, CheckCircle, ArrowLeft, ShoppingBag, Truck, Package, FileText, Phone, Brain, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { api, getUserId } from '../utils/api';

const APP_INFO = {
  instacart: { name: 'Instacart', Icon: ShoppingBag, gradient: 'from-emerald-500 to-green-600' },
  doordash: { name: 'DoorDash', Icon: Truck, gradient: 'from-red-500 to-rose-600' },
  spark: { name: 'Spark Driver', Icon: Package, gradient: 'from-blue-500 to-indigo-600' },
};

export const Purchase = () => {
  const { appName } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [checking, setChecking] = useState(true);

  const app = APP_INFO[appName?.toLowerCase()] || APP_INFO.instacart;
  const AppIcon = app.Icon;
  const lang = i18n.language;

  const content = {
    en: {
      title: `Get ${app.name} Guides & ZIP Code Suggestions`,
      subtitle: 'AI-powered guides and ZIP code suggestions for high-availability areas',
      price: '$20.00 USD',
      oneTime: 'One-time payment',
      includes: 'Your purchase includes:',
      f1: '5 AI-suggested ZIP codes with high availability',
      f2: `Complete step-by-step ${app.name} guide`,
      f3: 'Free phone number setup guide (Google Voice)',
      f4: 'AI updates every 48 hours',
      terms: 'I accept the',
      termsLink: 'Terms and Conditions',
      termsNote: 'Payment is for access to guides and suggestions. ZIP codes are suggestions, not guarantees.',
      payBtn: 'Pay $20.00 USD',
      paying: 'Redirecting to payment...',
      secure: 'Secure payment via Stripe',
      noCard: 'We do not store your card data',
      alreadyPaid: 'You already have access!',
      goToDash: 'Go to Dashboard',
      back: 'Back',
    },
    es: {
      title: `Obtener guias y sugerencias de codigos ZIP de ${app.name}`,
      subtitle: 'Guias y sugerencias de codigos ZIP impulsadas por IA para zonas con alta disponibilidad',
      price: '$20.00 USD',
      oneTime: 'Pago unico',
      includes: 'Tu compra incluye:',
      f1: '5 codigos ZIP sugeridos por IA con alta disponibilidad',
      f2: `Guia completa paso a paso de ${app.name}`,
      f3: 'Guia para obtener numero gratis (Google Voice)',
      f4: 'Actualizaciones de IA cada 48 horas',
      terms: 'Acepto los',
      termsLink: 'Terminos y Condiciones',
      termsNote: 'El pago es por acceso a las guias y sugerencias. Los codigos ZIP son sugerencias, no garantias.',
      payBtn: 'Pagar $20.00 USD',
      paying: 'Redirigiendo al pago...',
      secure: 'Pago seguro con Stripe',
      noCard: 'No almacenamos los datos de tu tarjeta',
      alreadyPaid: 'Ya tienes acceso!',
      goToDash: 'Ir al Dashboard',
      back: 'Volver',
    },
    pt: {
      title: `Obter guias e sugestoes de codigos ZIP de ${app.name}`,
      subtitle: 'Guias e sugestoes de codigos ZIP com IA para areas com alta disponibilidade',
      price: '$20.00 USD',
      oneTime: 'Pagamento unico',
      includes: 'Sua compra inclui:',
      f1: '5 codigos ZIP sugeridos por IA com alta disponibilidade',
      f2: `Guia completo passo a passo de ${app.name}`,
      f3: 'Guia para obter numero gratis (Google Voice)',
      f4: 'Atualizacoes de IA a cada 48 horas',
      terms: 'Aceito os',
      termsLink: 'Termos e Condicoes',
      termsNote: 'O pagamento e pelo acesso aos guias e sugestoes. Os codigos ZIP sao sugestoes, nao garantias.',
      payBtn: 'Pagar $20.00 USD',
      paying: 'Redirecionando para pagamento...',
      secure: 'Pagamento seguro via Stripe',
      noCard: 'Nao armazenamos os dados do seu cartao',
      alreadyPaid: 'Voce ja tem acesso!',
      goToDash: 'Ir ao Dashboard',
      back: 'Voltar',
    },
  };
  const t = content[lang] || content.es;

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const userId = getUserId();
        const result = await api.checkPayment(userId, appName);
        if (result.found) setAlreadyPaid(true);
      } catch (e) { /* ignore */ }
      setChecking(false);
    };
    checkAccess();
  }, [appName]);

  const handlePurchase = async () => {
    if (!termsAccepted) return;
    setLoading(true);
    setError('');
    try {
      const userId = getUserId();
      const returnUrl = window.location.origin;
      const result = await api.createCheckoutSession(userId, appName, true, returnUrl);
      if (result.checkout_url) window.location.href = result.checkout_url;
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <Loader2 className="animate-spin text-cyan-400" size={40} />
    </div>
  );

  return (
    <section className="min-h-screen pt-24 pb-16 relative overflow-hidden" data-testid="purchase-page">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-6 transition-colors text-sm" data-testid="back-button">
          <ArrowLeft size={18} /> {t.back}
        </button>

        {alreadyPaid ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="bg-green-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="text-green-400" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{t.alreadyPaid}</h2>
            <Button onClick={() => navigate(`/dashboard/${appName}`)} className="bg-gradient-to-r from-cyan-500 to-green-500 text-white font-bold px-8 py-4 rounded-full" data-testid="go-to-dashboard-btn">
              {t.goToDash}
            </Button>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl">
              {/* Header gradient */}
              <div className={`bg-gradient-to-r ${app.gradient} p-6 text-center`}>
                <AppIcon size={40} className="mx-auto mb-3 text-white" strokeWidth={1.5} />
                <h1 className="text-xl sm:text-2xl font-bold text-white" data-testid="purchase-title">{t.title}</h1>
                <p className="text-white/80 text-sm mt-1">{t.subtitle}</p>
              </div>

              <div className="p-6 sm:p-8">
                {/* Price */}
                <div className="text-center mb-6 py-4 bg-[#0f172a] rounded-2xl border border-gray-700/50">
                  <span className="text-4xl font-bold text-white">{t.price}</span>
                  <div className="text-cyan-400 font-medium text-sm mt-1">{t.oneTime}</div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="text-white font-semibold text-sm">{t.includes}</div>
                  {[
                    { icon: Brain, text: t.f1 },
                    { icon: FileText, text: t.f2 },
                    { icon: Phone, text: t.f3 },
                    { icon: Brain, text: t.f4 },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-cyan-500/15 rounded-lg p-1.5 mt-0.5"><Icon className="text-cyan-400" size={12} /></div>
                      <span className="text-gray-300 text-sm">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Terms */}
                <div className="bg-[#0f172a] rounded-xl p-4 mb-5 border border-gray-700/50">
                  <label className="flex items-start gap-3 cursor-pointer" data-testid="terms-checkbox-label">
                    <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-cyan-500 rounded" data-testid="terms-checkbox" />
                    <span className="text-gray-300 text-sm">
                      {t.terms}{' '}<a href="/terms" target="_blank" className="text-cyan-400 underline">{t.termsLink}</a>
                      <br /><span className="text-gray-500 text-xs">{t.termsNote}</span>
                    </span>
                  </label>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg mb-4" data-testid="error-message">{error}</div>}

                {/* Pay Button */}
                <Button
                  onClick={handlePurchase}
                  disabled={!termsAccepted || loading}
                  className={`w-full bg-gradient-to-r ${app.gradient} hover:opacity-90 text-white font-bold text-lg py-6 rounded-2xl disabled:opacity-40 transition-all`}
                  data-testid="pay-button"
                >
                  {loading ? <><Loader2 className="animate-spin mr-2" size={20} />{t.paying}</> : t.payBtn}
                </Button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <ShieldCheck size={14} className="text-green-400" /> {t.secure}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Lock size={14} className="text-green-400" /> {t.noCard}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
