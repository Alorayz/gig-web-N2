import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ChevronDown, ChevronUp, Settings, FolderOpen, Smartphone, CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';

export const DownloadApps = () => {
  const { i18n } = useTranslation();
  const [showInstallGuide, setShowInstallGuide] = useState(false);
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
      howToInstall: 'How to Install APK',
      installSteps: [
        { icon: Download, title: 'Download the APK', desc: 'Tap the download button and wait for the file to finish downloading.' },
        { icon: Settings, title: 'Enable Unknown Sources', desc: 'Go to Settings > Security > Enable "Install unknown apps" for your browser.' },
        { icon: FolderOpen, title: 'Find the Downloaded File', desc: 'Open your file manager or downloads folder. Look for "GigZipFinder.apk".' },
        { icon: Smartphone, title: 'Install the App', desc: 'Tap the APK file and press "Install". Wait a few seconds.' },
        { icon: CheckCircle, title: 'Open GIG ZipFinder', desc: 'Once installed, tap "Open" or find the icon on your home screen.' },
      ],
      troubleTitle: 'Having problems?',
      troubleItems: [
        { q: 'Installation blocked', a: 'Make sure you enabled "Unknown sources" in Settings > Security for your browser.' },
        { q: 'Security warning', a: 'It\'s normal when installing apps outside Google Play. Select "Install anyway".' },
      ],
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
      howToInstall: 'Como Instalar el APK',
      installSteps: [
        { icon: Download, title: 'Descarga el APK', desc: 'Presiona el boton de descarga y espera a que el archivo termine de descargarse.' },
        { icon: Settings, title: 'Habilita Fuentes Desconocidas', desc: 'Ve a Ajustes > Seguridad > Activa "Instalar aplicaciones desconocidas" para tu navegador.' },
        { icon: FolderOpen, title: 'Localiza el Archivo', desc: 'Abre tu administrador de archivos o carpeta de descargas. Busca "GigZipFinder.apk".' },
        { icon: Smartphone, title: 'Instala la App', desc: 'Toca el archivo APK y presiona "Instalar". Espera unos segundos.' },
        { icon: CheckCircle, title: 'Abre GIG ZipFinder', desc: 'Una vez instalado, presiona "Abrir" o busca el icono en tu pantalla de inicio.' },
      ],
      troubleTitle: 'Tienes problemas?',
      troubleItems: [
        { q: 'Instalacion bloqueada', a: 'Asegurate de haber habilitado "Origenes desconocidos" en Ajustes > Seguridad para tu navegador.' },
        { q: 'Advertencia de seguridad', a: 'Es normal al instalar apps fuera de Google Play. Selecciona "Instalar de todas formas".' },
      ],
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
      howToInstall: 'Como Instalar o APK',
      installSteps: [
        { icon: Download, title: 'Baixe o APK', desc: 'Toque no botao de download e aguarde ate que o arquivo termine de baixar.' },
        { icon: Settings, title: 'Habilite Fontes Desconhecidas', desc: 'Va em Configuracoes > Seguranca > Ative "Instalar aplicativos desconhecidos" para o seu navegador.' },
        { icon: FolderOpen, title: 'Localize o Arquivo', desc: 'Abra seu gerenciador de arquivos ou pasta de downloads. Procure "GigZipFinder.apk".' },
        { icon: Smartphone, title: 'Instale o App', desc: 'Toque no arquivo APK e pressione "Instalar". Aguarde alguns segundos.' },
        { icon: CheckCircle, title: 'Abra GIG ZipFinder', desc: 'Uma vez instalado, pressione "Abrir" ou procure o icone na sua tela inicial.' },
      ],
      troubleTitle: 'Esta com problemas?',
      troubleItems: [
        { q: 'Instalacao bloqueada', a: 'Certifique-se de ter habilitado "Fontes desconhecidas" em Configuracoes > Seguranca para o seu navegador.' },
        { q: 'Aviso de seguranca', a: 'E normal ao instalar apps fora da Google Play. Selecione "Instalar mesmo assim".' },
      ],
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

          {/* How to Install Button */}
          <button
            onClick={() => setShowInstallGuide(!showInstallGuide)}
            className="w-full bg-[#1e293b]/70 rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex items-center justify-center gap-2 text-cyan-400 font-medium"
            data-testid="install-guide-toggle"
          >
            <HelpCircle size={18} />
            {t.howToInstall}
            {showInstallGuide ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Install Guide Expandable */}
          {showInstallGuide && (
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-cyan-500/20 space-y-4 animate-fade-in-up">
              {t.installSteps.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/15 rounded-xl flex items-center justify-center">
                      <StepIcon size={18} className="text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm mb-0.5">
                        <span className="text-cyan-400 mr-2">{i + 1}.</span>{step.title}
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}

              {/* Troubleshooting */}
              <div className="pt-4 border-t border-cyan-500/10">
                <p className="text-gray-300 font-semibold text-sm mb-3">{t.troubleTitle}</p>
                {t.troubleItems.map((item, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-cyan-400 text-xs font-medium">{item.q}</p>
                    <p className="text-gray-400 text-xs">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-gray-500 text-sm py-2">{t.or}</div>

          {/* Store Links with official badge style */}
          <div className="grid grid-cols-2 gap-4">
            {/* Google Play Badge */}
            <div className="bg-black rounded-xl p-4 border border-gray-600/50 opacity-70 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" data-testid="play-store-btn">
              <svg viewBox="0 0 24 24" width="28" height="28" className="flex-shrink-0">
                <path d="M3.176 2.123a1 1 0 00-.461.86v18.034a1 1 0 00.461.86l.058.033 10.1-10.1v-.01-.01L3.234 1.69l-.058.033z" fill="#4285F4"/>
                <path d="M17.1 15.516l-3.766-3.766v-.02l3.766-3.766.085.049 4.463 2.535c1.274.724 1.274 1.908 0 2.632l-4.463 2.535-.085-.199z" fill="#FBBC04"/>
                <path d="M17.185 15.715L13.334 11.75 3.176 21.877c.42.445 1.117.5 1.903.056l12.106-6.218z" fill="#EA4335"/>
                <path d="M17.185 7.785L5.079 1.567c-.786-.444-1.483-.389-1.903.056l10.158 10.127 3.851-3.965z" fill="#34A853"/>
              </svg>
              <div>
                <div className="text-gray-400 text-[10px] leading-tight">GET IT ON</div>
                <div className="text-white font-semibold text-sm leading-tight">{t.playStore}</div>
                <div className="text-gray-500 text-[10px]">{t.playStoreSub}</div>
              </div>
            </div>

            {/* App Store Badge */}
            <div className="bg-black rounded-xl p-4 border border-gray-600/50 opacity-70 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" data-testid="app-store-btn">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="white" className="flex-shrink-0">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div className="text-gray-400 text-[10px] leading-tight">Download on the</div>
                <div className="text-white font-semibold text-sm leading-tight">{t.appStore}</div>
                <div className="text-gray-500 text-[10px]">{t.appStoreSub}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
