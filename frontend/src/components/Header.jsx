import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Home, Zap, HelpCircle, CreditCard, Download, ShoppingCart, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { LanguageSelector } from './LanguageSelector';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goHome = () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); };

  const menuItems = [
    { label: t('nav.features'), action: () => scrollToSection('features'), icon: Zap },
    { label: t('nav.howItWorks'), action: () => scrollToSection('how-it-works'), icon: HelpCircle },
    { label: t('nav.pricing'), action: () => scrollToSection('pricing'), icon: CreditCard },
    { label: t('nav.download'), action: () => scrollToSection('download-apps'), icon: Download },
    { label: t('nav.faq'), action: () => scrollToSection('faq'), icon: HelpCircle },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a1628]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={goHome} data-testid="logo">
              <div className="h-10 w-10 sm:h-11 sm:w-11 bg-gradient-to-br from-cyan-400 to-green-400 rounded-xl flex items-center justify-center">
                <MapPin className="text-[#0a1628]" size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold">
                  <span className="text-cyan-400">GIG</span>
                  <span className="text-white">ZipFinder</span>
                </span>
                <span className="text-[10px] sm:text-xs text-cyan-400/80 -mt-1">{t('nav.tagline')}</span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.map((item, i) => (
                <button key={i} onClick={item.action} className="text-gray-300 hover:text-cyan-400 transition-colors font-medium text-sm" data-testid={`nav-${i}`}>
                  {item.label}
                </button>
              ))}
              <LanguageSelector />
              <Button onClick={() => scrollToSection('pricing')} className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold px-6 py-2 rounded-full" data-testid="header-buy-btn">
                <ShoppingCart size={16} className="mr-2" /> {t('nav.buyNow')}
              </Button>
            </nav>

            <div className="lg:hidden flex items-center gap-2">
              <LanguageSelector />
              <button className="text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} data-testid="mobile-menu-toggle">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute right-0 top-0 h-full w-72 bg-[#0f172a] border-l border-cyan-500/20 shadow-2xl animate-slide-in-right" data-testid="mobile-sidebar">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-white"><span className="text-cyan-400">GIG</span>ZipFinder</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>

              <nav className="space-y-1">
                <button onClick={goHome} className="w-full flex items-center gap-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all px-4 py-3 rounded-xl text-left">
                  <Home size={18} /> {t('nav.home')}
                </button>
                {menuItems.map((item, i) => (
                  <button key={i} onClick={item.action} className="w-full flex items-center gap-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all px-4 py-3 rounded-xl text-left" data-testid={`sidebar-${i}`}>
                    <item.icon size={18} /> {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-cyan-500/20">
                <Button onClick={() => { setIsMobileMenuOpen(false); scrollToSection('pricing'); }} className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-bold py-3 rounded-full" data-testid="sidebar-buy-btn">
                  <ShoppingCart size={16} className="mr-2" /> {t('nav.buyNow')}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
