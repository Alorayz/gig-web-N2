import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Apple, Smartphone } from 'lucide-react';
import { Button } from './ui/button';

export const DownloadApps = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const content = {
    en: {
      title: 'Download the',
      title2: 'App',
      subtitle: 'Get GIG ZipFinder on your mobile device for the best experience',
      android: 'Download APK',
      androidSub: 'Android 8.0+',
      playStore: 'Google Play',
      playStoreSub: 'Coming soon',
      appStore: 'App Store',
      appStoreSub: 'Coming soon',
      or: 'or get it from the stores',
    },
    es: {
      title: 'Descarga la',
      title2: 'aplicacion',
      subtitle: 'Obtiene GIG ZipFinder en tu dispositivo movil para la mejor experiencia',
      android: 'Descargar APK',
      androidSub: 'Android 8.0+',
      playStore: 'Google Play',
      playStoreSub: 'Proximamente',
      appStore: 'App Store',
      appStoreSub: 'Proximamente',
      or: 'o descargala de las tiendas',
    },
    pt: {
      title: 'Baixe o',
      title2: 'aplicativo',
      subtitle: 'Obtenha o GIG ZipFinder no seu dispositivo movel para a melhor experiencia',
      android: 'Baixar APK',
      androidSub: 'Android 8.0+',
      playStore: 'Google Play',
      playStoreSub: 'Em breve',
      appStore: 'App Store',
      appStoreSub: 'Em breve',
      or: 'ou baixe nas lojas',
    },
  };
  const t = content[lang] || content.es;

  const APK_URL = 'https://expo.dev/artifacts/eas/mita4QD3awF8ZxUPvR4e71.apk';

  return (
    <section id="download-apps" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">{t.title} </span>
            <span className="text-gradient">{t.title2}</span>
          </h2>
          <p className="text-base text-gray-300">{t.subtitle}</p>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          {/* APK Download */}
          <a href={APK_URL} target="_blank" rel="noopener noreferrer" className="block">
            <div className="bg-[#1e293b] rounded-2xl p-5 border border-cyan-500/30 hover:border-cyan-400/60 transition-all hover:scale-[1.02] flex items-center gap-4 cursor-pointer" data-testid="download-apk-btn">
              <div className="bg-gradient-to-br from-cyan-500 to-green-500 p-3 rounded-xl">
                <Download size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-lg">{t.android}</div>
                <div className="text-gray-400 text-sm">{t.androidSub} &bull; v1.1.1</div>
              </div>
              <div className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold">APK</div>
            </div>
          </a>

          <div className="text-center text-gray-500 text-sm py-2">{t.or}</div>

          {/* Store Links */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-700/50 opacity-70 flex items-center gap-3" data-testid="play-store-btn">
              <div className="bg-green-500/15 p-2.5 rounded-xl">
                <Smartphone size={22} className="text-green-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{t.playStore}</div>
                <div className="text-gray-500 text-xs">{t.playStoreSub}</div>
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-2xl p-5 border border-gray-700/50 opacity-70 flex items-center gap-3" data-testid="app-store-btn">
              <div className="bg-blue-500/15 p-2.5 rounded-xl">
                <Apple size={22} className="text-blue-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{t.appStore}</div>
                <div className="text-gray-500 text-xs">{t.appStoreSub}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
