import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    }
  };

  const goHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0a1628]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={goHome}>
            <img 
              src="/images/logo.png" 
              alt="GIG ZipFinder" 
              className="h-10 w-10 sm:h-12 sm:w-12"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold">
                <span className="text-cyan-400">GIG</span>
                <span className="text-white">ZipFinder</span>
              </span>
              <span className="text-[10px] sm:text-xs text-cyan-400/80 -mt-1">{t('nav.tagline')}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              {t('nav.features')}
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              {t('nav.howItWorks')}
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              {t('nav.pricing')}
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              {t('nav.faq')}
            </button>
            <LanguageSelector />
            <Button 
              onClick={() => scrollToSection('pricing')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-full btn-primary"
              data-testid="header-buy-btn"
            >
              {t('nav.pricing')}
            </Button>
          </nav>

          {/* Mobile Menu Button + Language Selector */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <button
              className="text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0f172a] border-t border-cyan-500/20 py-4 animate-fade-in-up">
            <nav className="flex flex-col space-y-4 px-4">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left py-2">
                {t('nav.features')}
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left py-2">
                {t('nav.howItWorks')}
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left py-2">
                {t('nav.pricing')}
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left py-2">
                {t('nav.faq')}
              </button>
              <Button 
                onClick={() => scrollToSection('pricing')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold w-full rounded-full"
                data-testid="header-buy-mobile-btn"
              >
                {t('nav.pricing')}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
