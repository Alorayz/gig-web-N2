import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '../utils/api';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [status, setStatus] = useState('verifying');
  const [appName, setAppName] = useState('');

  const lang = i18n.language;
  const content = {
    en: {
      verifying: 'Verifying payment...',
      success: 'Payment Successful!',
      successMsg: 'Your payment has been confirmed. You now have access to your ZIP codes and guides.',
      failed: 'Payment Verification Failed',
      failedMsg: 'We could not verify your payment. Please contact support.',
      dashboard: 'View My ZIP Codes',
      home: 'Back to Home',
    },
    es: {
      verifying: 'Verificando pago...',
      success: '¡Pago Exitoso!',
      successMsg: 'Tu pago ha sido confirmado. Ahora tienes acceso a tus códigos ZIP y guías.',
      failed: 'Error en la Verificación',
      failedMsg: 'No pudimos verificar tu pago. Contacta soporte.',
      dashboard: 'Ver Mis Códigos ZIP',
      home: 'Volver al Inicio',
    },
    pt: {
      verifying: 'Verificando pagamento...',
      success: 'Pagamento Confirmado!',
      successMsg: 'Seu pagamento foi confirmado. Agora você tem acesso aos seus códigos ZIP e guias.',
      failed: 'Falha na Verificação',
      failedMsg: 'Não conseguimos verificar seu pagamento. Contate o suporte.',
      dashboard: 'Ver Meus Códigos ZIP',
      home: 'Voltar ao Início',
    },
  };
  const t = content[lang] || content.es;

  useEffect(() => {
    const verify = async () => {
      const sessionId = searchParams.get('session_id');
      const app = searchParams.get('app_name');
      if (app) setAppName(app);

      if (!sessionId) {
        setStatus('failed');
        return;
      }

      try {
        const result = await api.verifyCheckout(sessionId);
        if (result.status === 'succeeded') {
          setStatus('success');
          if (result.app_name) setAppName(result.app_name);
        } else {
          setStatus('failed');
        }
      } catch (e) {
        setStatus('failed');
      }
    };
    verify();
  }, [searchParams]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16" data-testid="payment-success-page">
      <div className="container mx-auto px-4 text-center">
        {status === 'verifying' && (
          <div>
            <Loader2 className="animate-spin text-cyan-400 mx-auto mb-4" size={60} />
            <h2 className="text-2xl font-bold text-white">{t.verifying}</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="max-w-md mx-auto">
            <div className="bg-green-500/20 rounded-full p-6 w-28 h-28 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="text-green-400" size={60} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4" data-testid="success-title">{t.success}</h2>
            <p className="text-gray-300 mb-8">{t.successMsg}</p>
            <Button
              onClick={() => navigate(`/dashboard/${appName}`)}
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-bold text-lg px-8 py-4 rounded-full"
              data-testid="go-to-dashboard-btn"
            >
              {t.dashboard}
            </Button>
          </div>
        )}

        {status === 'failed' && (
          <div className="max-w-md mx-auto">
            <div className="bg-red-500/20 rounded-full p-6 w-28 h-28 mx-auto mb-6 flex items-center justify-center">
              <XCircle className="text-red-400" size={60} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4" data-testid="failed-title">{t.failed}</h2>
            <p className="text-gray-300 mb-8">{t.failedMsg}</p>
            <Button onClick={() => navigate('/')} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-8 py-4 rounded-full" data-testid="home-btn">
              {t.home}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
