import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Download, Loader2, ArrowLeft, Star, RefreshCw, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { api, getUserId } from '../utils/api';

const APP_INFO = {
  instacart: { name: 'Instacart', icon: '🛒' },
  doordash: { name: 'DoorDash', icon: '🍕' },
  spark: { name: 'Spark Driver', icon: '🚗' },
};

export const Dashboard = () => {
  const { appName } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [zipCodes, setZipCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [guides, setGuides] = useState([]);

  const app = APP_INFO[appName?.toLowerCase()] || APP_INFO.instacart;
  const lang = i18n.language;

  const content = {
    en: {
      title: `${app.name} Dashboard`,
      subtitle: 'Your AI-suggested ZIP codes with high availability',
      zipTitle: 'Suggested ZIP Codes',
      score: 'Score',
      reason: 'Source',
      refresh: 'Search New Codes',
      searching: 'AI is searching...',
      guides: 'Download Guides',
      guideApp: `${app.name} Guide`,
      guideVoice: 'Google Voice Guide',
      noAccess: 'No access. Please purchase first.',
      purchase: 'Purchase Access',
      back: 'Back',
      noZips: 'No ZIP codes found. Click "Search New Codes" to get fresh suggestions.',
      english: 'English',
      spanish: 'Spanish',
    },
    es: {
      title: `Dashboard de ${app.name}`,
      subtitle: 'Tus códigos ZIP sugeridos por IA con alta disponibilidad',
      zipTitle: 'Códigos ZIP Sugeridos',
      score: 'Puntuación',
      reason: 'Fuente',
      refresh: 'Buscar Nuevos Códigos',
      searching: 'La IA está buscando...',
      guides: 'Descargar Guías',
      guideApp: `Guía de ${app.name}`,
      guideVoice: 'Guía de Google Voice',
      noAccess: 'Sin acceso. Realiza la compra primero.',
      purchase: 'Comprar Acceso',
      back: 'Volver',
      noZips: 'No se encontraron códigos. Haz clic en "Buscar Nuevos Códigos" para obtener sugerencias.',
      english: 'Inglés',
      spanish: 'Español',
    },
    pt: {
      title: `Dashboard de ${app.name}`,
      subtitle: 'Seus códigos ZIP sugeridos por IA com alta disponibilidade',
      zipTitle: 'Códigos ZIP Sugeridos',
      score: 'Pontuação',
      reason: 'Fonte',
      refresh: 'Buscar Novos Códigos',
      searching: 'A IA está buscando...',
      guides: 'Baixar Guias',
      guideApp: `Guia de ${app.name}`,
      guideVoice: 'Guia do Google Voice',
      noAccess: 'Sem acesso. Faça a compra primeiro.',
      purchase: 'Comprar Acesso',
      back: 'Voltar',
      noZips: 'Nenhum código encontrado. Clique em "Buscar Novos Códigos" para obter sugestões.',
      english: 'Inglês',
      spanish: 'Espanhol',
    },
  };
  const t = content[lang] || content.es;

  useEffect(() => {
    const init = async () => {
      try {
        const userId = getUserId();
        const payCheck = await api.checkPayment(userId, appName);
        if (!payCheck.found) {
          setHasAccess(false);
          setLoading(false);
          return;
        }
        setHasAccess(true);
        const codes = await api.getZipCodes(appName);
        setZipCodes(Array.isArray(codes) ? codes : []);
        const guidesList = await api.getGuidesList();
        setGuides(Array.isArray(guidesList) ? guidesList : []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    init();
  }, [appName]);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const result = await api.searchZipCodes(appName);
      if (result.zip_codes) {
        setZipCodes(result.zip_codes);
      }
    } catch (e) {
      console.error(e);
    }
    setSearching(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-cyan-400" size={40} />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t.noAccess}</h2>
          <Button onClick={() => navigate(`/purchase/${appName}`)} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-8 py-4 rounded-full" data-testid="purchase-btn">
            {t.purchase}
          </Button>
        </div>
      </section>
    );
  }

  const appGuides = guides.filter(g => g.app === appName?.toLowerCase() || g.app === 'google_voice');

  return (
    <section className="min-h-screen pt-24 pb-16 relative overflow-hidden" data-testid="dashboard-page">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-6 transition-colors" data-testid="back-btn">
          <ArrowLeft size={20} /> {t.back}
        </button>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-4xl">{app.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-white" data-testid="dashboard-title">{t.title}</h1>
            <p className="text-gray-400">{t.subtitle}</p>
          </div>
        </div>

        {/* ZIP Codes Section */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-cyan-500/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="text-cyan-400" size={22} /> {t.zipTitle}
            </h2>
            <Button
              onClick={handleSearch}
              disabled={searching}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-full px-4 py-2 text-sm"
              data-testid="refresh-btn"
            >
              {searching ? <><Loader2 className="animate-spin mr-2" size={16} />{t.searching}</> : <><RefreshCw size={16} className="mr-2" />{t.refresh}</>}
            </Button>
          </div>

          {zipCodes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">{t.noZips}</p>
              <Button onClick={handleSearch} disabled={searching} className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-6 py-3" data-testid="search-first-btn">
                {searching ? t.searching : t.refresh}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {zipCodes.map((zip, i) => (
                <div key={i} className="bg-[#0f172a] rounded-xl p-4 border border-cyan-500/10 flex items-center justify-between" data-testid={`zip-code-${i}`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-cyan-500/20 p-3 rounded-full">
                      <MapPin className="text-cyan-400" size={20} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{zip.zip_code}</div>
                      <div className="text-gray-400 text-sm">{zip.city}, {zip.state}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={14} fill="currentColor" />
                      <span className="font-bold">{zip.availability_score || zip.score || 'N/A'}</span>
                    </div>
                    {zip.reason && <div className="text-gray-500 text-xs mt-1 max-w-[200px] truncate">{zip.reason}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guides Download Section */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-cyan-500/20">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <FileText className="text-green-400" size={22} /> {t.guides}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* App Guide */}
            <div className="bg-[#0f172a] rounded-xl p-4 border border-cyan-500/10">
              <h3 className="text-white font-semibold mb-3">{t.guideApp}</h3>
              <div className="flex gap-2">
                <a href={api.getGuideDownloadUrl(appName, 'en')} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm" data-testid="download-guide-en">
                    <Download size={14} className="mr-2" /> {t.english}
                  </Button>
                </a>
                <a href={api.getGuideDownloadUrl(appName, 'es')} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm" data-testid="download-guide-es">
                    <Download size={14} className="mr-2" /> {t.spanish}
                  </Button>
                </a>
              </div>
            </div>

            {/* Google Voice Guide */}
            <div className="bg-[#0f172a] rounded-xl p-4 border border-cyan-500/10">
              <h3 className="text-white font-semibold mb-3">{t.guideVoice}</h3>
              <div className="flex gap-2">
                <a href={api.getGuideDownloadUrl('google_voice', 'en')} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm" data-testid="download-voice-en">
                    <Download size={14} className="mr-2" /> {t.english}
                  </Button>
                </a>
                <a href={api.getGuideDownloadUrl('google_voice', 'es')} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm" data-testid="download-voice-es">
                    <Download size={14} className="mr-2" /> {t.spanish}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
