import React from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, Globe, Server, Database, Brain, Clock, CreditCard, Shield } from 'lucide-react';

export const ArchitectureDiagram = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const t = {
    en: {
      title: 'Application',
      title2: 'Architecture',
      subtitle: 'A complete ecosystem designed for gig economy workers',
      clients: 'Client Apps',
      ios: 'iOS App',
      iosDesc: 'Apple In-App Purchase',
      android: 'Android App',
      androidDesc: 'Stripe Payments',
      web: 'Web App',
      webDesc: 'Stripe Checkout',
      backend: 'FastAPI Backend',
      backendDesc: 'REST API + Authentication',
      db: 'MongoDB Atlas',
      dbDesc: 'Users, payments, ZIP codes',
      ai: 'AI Engine',
      aiDesc: 'Perplexity + GPT-4o',
      search: 'Real-time Web Search',
      searchDesc: 'Reddit, YouTube, forums, news',
      scheduler: 'Auto Scheduler',
      schedulerDesc: 'Refreshes every 48 hours',
      payments: 'Payment Validation',
      paymentsDesc: 'Apple IAP + Stripe',
      security: 'Security',
      securityDesc: 'End-to-end encrypted',
    },
    es: {
      title: 'Arquitectura de la',
      title2: 'Aplicacion',
      subtitle: 'Un ecosistema completo disenado para trabajadores de la economia gig',
      clients: 'Apps Cliente',
      ios: 'App iOS',
      iosDesc: 'Compra In-App de Apple',
      android: 'App Android',
      androidDesc: 'Pagos con Stripe',
      web: 'App Web',
      webDesc: 'Stripe Checkout',
      backend: 'Backend FastAPI',
      backendDesc: 'API REST + Autenticacion',
      db: 'MongoDB Atlas',
      dbDesc: 'Usuarios, pagos, codigos ZIP',
      ai: 'Motor de IA',
      aiDesc: 'Perplexity + GPT-4o',
      search: 'Busqueda Web en Tiempo Real',
      searchDesc: 'Reddit, YouTube, foros, noticias',
      scheduler: 'Programador Automatico',
      schedulerDesc: 'Se actualiza cada 48 horas',
      payments: 'Validacion de Pagos',
      paymentsDesc: 'Apple IAP + Stripe',
      security: 'Seguridad',
      securityDesc: 'Encriptado de extremo a extremo',
    },
    pt: {
      title: 'Arquitetura do',
      title2: 'Aplicativo',
      subtitle: 'Um ecossistema completo projetado para trabalhadores da economia gig',
      clients: 'Apps Cliente',
      ios: 'App iOS',
      iosDesc: 'Compra In-App da Apple',
      android: 'App Android',
      androidDesc: 'Pagamentos com Stripe',
      web: 'App Web',
      webDesc: 'Stripe Checkout',
      backend: 'Backend FastAPI',
      backendDesc: 'API REST + Autenticacao',
      db: 'MongoDB Atlas',
      dbDesc: 'Usuarios, pagamentos, codigos ZIP',
      ai: 'Motor de IA',
      aiDesc: 'Perplexity + GPT-4o',
      search: 'Busca Web em Tempo Real',
      searchDesc: 'Reddit, YouTube, foruns, noticias',
      scheduler: 'Agendador Automatico',
      schedulerDesc: 'Atualiza a cada 48 horas',
      payments: 'Validacao de Pagamentos',
      paymentsDesc: 'Apple IAP + Stripe',
      security: 'Seguranca',
      securityDesc: 'Criptografado de ponta a ponta',
    },
  }[lang] || {
    title: 'Arquitectura de la',
    title2: 'Aplicacion',
    subtitle: 'Un ecosistema completo disenado para trabajadores de la economia gig',
    clients: 'Apps Cliente',
    ios: 'App iOS',
    iosDesc: 'Compra In-App de Apple',
    android: 'App Android',
    androidDesc: 'Pagos con Stripe',
    web: 'App Web',
    webDesc: 'Stripe Checkout',
    backend: 'Backend FastAPI',
    backendDesc: 'API REST + Autenticacion',
    db: 'MongoDB Atlas',
    dbDesc: 'Usuarios, pagos, codigos ZIP',
    ai: 'Motor de IA',
    aiDesc: 'Perplexity + GPT-4o',
    search: 'Busqueda Web en Tiempo Real',
    searchDesc: 'Reddit, YouTube, foros, noticias',
    scheduler: 'Programador Automatico',
    schedulerDesc: 'Se actualiza cada 48 horas',
    payments: 'Validacion de Pagos',
    paymentsDesc: 'Apple IAP + Stripe',
    security: 'Seguridad',
    securityDesc: 'Encriptado de extremo a extremo',
  };

  const NodeCard = ({ icon: Icon, title, desc, color, size = 'normal' }) => (
    <div className={`bg-[#1e293b] rounded-xl border border-${color || 'cyan'}-500/30 p-4 flex flex-col items-center text-center gap-2 hover:border-cyan-400/60 transition-all hover:scale-105 ${size === 'large' ? 'p-6' : ''}`}>
      <div className={`bg-gradient-to-br ${color === 'green' ? 'from-green-500 to-emerald-600' : color === 'purple' ? 'from-purple-500 to-indigo-600' : color === 'amber' ? 'from-amber-500 to-orange-600' : color === 'red' ? 'from-red-500 to-rose-600' : 'from-cyan-500 to-blue-600'} p-2.5 rounded-xl`}>
        <Icon size={size === 'large' ? 24 : 20} className="text-white" />
      </div>
      <div className="text-white font-semibold text-sm">{title}</div>
      <div className="text-gray-400 text-xs leading-tight">{desc}</div>
    </div>
  );

  return (
    <section id="architecture" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">{t.title} </span>
            <span className="text-gradient">{t.title2}</span>
          </h2>
          <p className="text-base text-gray-300">{t.subtitle}</p>
        </div>

        {/* Diagram */}
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Row 1: Client Apps */}
          <div className="text-center mb-2">
            <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-cyan-500/20">
              {t.clients}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            <NodeCard icon={Smartphone} title={t.ios} desc={t.iosDesc} color="default" />
            <NodeCard icon={Smartphone} title={t.android} desc={t.androidDesc} color="green" />
            <NodeCard icon={Globe} title={t.web} desc={t.webDesc} color="purple" />
          </div>

          {/* Connector Lines */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-px h-8 bg-gradient-to-b from-cyan-500/50 to-cyan-500/20"></div>
              <div className="w-px h-8 bg-gradient-to-b from-green-500/50 to-green-500/20"></div>
              <div className="w-px h-8 bg-gradient-to-b from-purple-500/50 to-purple-500/20"></div>
            </div>
          </div>
          <div className="flex justify-center">
            <svg width="200" height="20" viewBox="0 0 200 20" className="text-cyan-500/40">
              <line x1="20" y1="0" x2="100" y2="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="100" y1="0" x2="100" y2="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="180" y1="0" x2="100" y2="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
            </svg>
          </div>

          {/* Row 2: Backend (Central) */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl border-2 border-cyan-500/40 p-6 lg:p-8 flex items-center gap-6 shadow-lg shadow-cyan-500/10 max-w-lg w-full">
              <div className="bg-gradient-to-br from-cyan-400 to-green-400 p-4 rounded-2xl">
                <Server size={32} className="text-[#0a1628]" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">{t.backend}</div>
                <div className="text-gray-400 text-sm">{t.backendDesc}</div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-cyan-500/15 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full">Python</span>
                  <span className="bg-green-500/15 text-green-400 text-[10px] px-2 py-0.5 rounded-full">FastAPI</span>
                  <span className="bg-purple-500/15 text-purple-400 text-[10px] px-2 py-0.5 rounded-full">REST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connector Lines */}
          <div className="flex justify-center">
            <svg width="400" height="24" viewBox="0 0 400 24" className="text-cyan-500/30">
              <line x1="50" y1="4" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="150" y1="4" x2="150" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="250" y1="4" x2="250" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="350" y1="4" x2="350" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
            </svg>
          </div>

          {/* Row 3: Services */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <NodeCard icon={Database} title={t.db} desc={t.dbDesc} color="green" />
            <NodeCard icon={Brain} title={t.ai} desc={t.aiDesc} color="purple" />
            <NodeCard icon={Clock} title={t.scheduler} desc={t.schedulerDesc} color="amber" />
            <NodeCard icon={CreditCard} title={t.payments} desc={t.paymentsDesc} color="red" />
          </div>

          {/* AI Detail connector */}
          <div className="flex justify-center">
            <svg width="200" height="16" viewBox="0 0 200 16" className="text-purple-500/30">
              <line x1="100" y1="0" x2="100" y2="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
            </svg>
          </div>

          {/* Row 4: AI Search Detail */}
          <div className="flex justify-center">
            <div className="bg-[#1e293b] rounded-xl border border-purple-500/30 p-5 flex items-center gap-4 max-w-md w-full">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5 rounded-xl flex-shrink-0">
                <Globe size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{t.search}</div>
                <div className="text-gray-400 text-xs">{t.searchDesc}</div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex justify-center pt-6">
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3">
              <Shield size={18} className="text-green-400" />
              <span className="text-green-400 text-sm font-medium">{t.security}: {t.securityDesc}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
