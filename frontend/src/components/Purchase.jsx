import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { api, getUserId } from '../utils/api';

const APP_INFO = {
  instacart: { name: 'Instacart', icon: '🛒', color: 'from-green-500 to-emerald-600' },
  doordash: { name: 'DoorDash', icon: '🍕', color: 'from-red-500 to-rose-600' },
  spark: { name: 'Spark Driver', icon: '🚗', color: 'from-blue-500 to-indigo-600' },
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
  const lang = i18n.language;

  const content = {
    en: {
      title: `Get ${app.name} ZIP Codes`,
      subtitle: 'AI-powered suggestions for high-availability areas',
      price: '$20.00 USD',
      oneTime: 'One-time payment',
      includes: 'Your purchase includes:',
      f1: '5 AI-suggested ZIP codes with high availability',
      f2: `Complete step-by-step ${app.name} guide`,
      f3: 'Free phone number setup guide (Google Voice)',
      f4: 'AI updates every 48 hours',
      terms: 'I accept the',
      termsLink: 'Terms and Conditions',
      termsNote: 'Payment is for access to guides. ZIP codes are suggestions, not guarantees.',
      payBtn: 'Pay $20.00 USD',
      paying: 'Redirecting to payment...',
      secure: 'Secure payment via Stripe',
      alreadyPaid: 'You already have access!',
      goToDash: 'Go to Dashboard',
      back: 'Back',
    },
    es: {
      title: `Obtener Códigos ZIP de ${app.name}`,
      subtitle: 'Sugerencias impulsadas por IA para zonas con alta disponibilidad',
      price: '$20.00 USD',
      oneTime: 'Pago único',
      includes: 'Tu compra incluye:',
      f1: '5 códigos ZIP sugeridos por IA con alta disponibilidad',
      f2: `Guía completa paso a paso de ${app.name}`,
      f3: 'Guía para obtener número gratis (Google Voice)',
      f4: 'Actualizaciones de IA cada 48 horas',
      terms: 'Acepto los',
      termsLink: 'Términos y Condiciones',
      termsNote: 'El pago es por acceso a las guías. Los códigos ZIP son sugerencias, no garantías.',
      payBtn: 'Pagar $20.00 USD',
      paying: 'Redirigiendo al pago...',
      secure: 'Pago seguro con Stripe',
      alreadyPaid: '¡Ya tienes acceso!',
      goToDash: 'Ir al Dashboard',
      back: 'Volver',
    },
    pt: {
      title: `Obter Códigos ZIP de ${app.name}`,
      subtitle: 'Sugestões com IA para áreas com alta disponibilidade',
      price: '$20.00 USD',
      oneTime: 'Pagamento único',
      includes: 'Sua compra inclui:',
      f1: '5 códigos ZIP sugeridos por IA com alta disponibilidade',
      f2: `Guia completo passo a passo de ${app.name}`,
      f3: 'Guia para obter número grátis (Google Voice)',
      f4: 'Atualizações de IA a cada 48 horas',
      terms: 'Aceito os',
      termsLink: 'Termos e Condições',
      termsNote: 'O pagamento é pelo acesso aos guias. Os códigos ZIP são sugestões, não garantias.',
      payBtn: 'Pagar $20.00 USD',
      paying: 'Redirecionando para pagamento...',
      secure: 'Pagamento seguro via Stripe',
      alreadyPaid: 'Você já tem acesso!',
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
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-cyan-400" size={40} />
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-16 relative overflow-hidden" data-testid="purchase-page">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors" data-testid="back-button">
          <ArrowLeft size={20} /> {t.back}
        </button>

        {alreadyPaid ? (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-green-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="text-green-400" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{t.alreadyPaid}</h2>
            <Button onClick={() => navigate(`/dashboard/${appName}`)} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-8 py-4 rounded-full" data-testid="go-to-dashboard-btn">
              {t.goToDash}
            </Button>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="bg-[#1e293b] rounded-3xl p-8 border border-cyan-500/30">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${app.color} mb-4`}>
                  <span className="text-4xl">{app.icon}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" data-testid="purchase-title">{t.title}</h1>
                <p className="text-gray-400">{t.subtitle}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-white">{t.price}</span>
                <div className="text-cyan-400 font-medium mt-1">{t.oneTime}</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="text-white font-semibold">{t.includes}</div>
                {[t.f1, t.f2, t.f3, t.f4].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-cyan-500/20 rounded-full p-1 mt-0.5"><CheckCircle className="text-cyan-400" size={14} /></div>
                    <span className="text-gray-300 text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-xl p-4 mb-6 border border-cyan-500/20">
                <label className="flex items-start gap-3 cursor-pointer" data-testid="terms-checkbox-label">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-cyan-500" data-testid="terms-checkbox" />
                  <span className="text-gray-300 text-sm">
                    {t.terms}{' '}
                    <a href="/terms" target="_blank" className="text-cyan-400 underline">{t.termsLink}</a>
                    <br /><span className="text-gray-500 text-xs">{t.termsNote}</span>
                  </span>
                </label>
              </div>

              {error && <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg mb-4" data-testid="error-message">{error}</div>}

              <Button
                onClick={handlePurchase}
                disabled={!termsAccepted || loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-bold text-lg py-6 rounded-full disabled:opacity-50"
                data-testid="pay-button"
              >
                {loading ? <><Loader2 className="animate-spin mr-2" size={20} />{t.paying}</> : t.payBtn}
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-sm">
                <ShieldCheck size={16} className="text-green-400" />
                {t.secure}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
