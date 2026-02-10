import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';

const apps = [
  {
    id: 'spark',
    name: 'Spark Driver',
    icon: 'car',
    color: '#FFC107',
    descKey: 'select.sparkDesc',
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    icon: 'fast-food',
    color: '#FF5722',
    descKey: 'select.doordashDesc',
  },
  {
    id: 'instacart',
    name: 'Instacart',
    icon: 'cart',
    color: '#4CAF50',
    descKey: 'select.instacartDesc',
  },
];

export default function SelectAppScreen() {
  const router = useRouter();
  const { language, t } = useLanguageStore();
  const { setSelectedApp } = useAppStore();

  const handleSelectApp = (appId: string) => {
    setSelectedApp(appId);
    router.push('/terms');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* New Professional Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIconWrapper}>
            <View style={styles.logoIcon}>
              <Ionicons name="location" size={32} color={COLORS.accent} />
              <View style={styles.logoArrow}>
                <Ionicons name="arrow-up-circle" size={18} color={COLORS.accentLight} />
              </View>
            </View>
          </View>
          <Text style={styles.logoTitle}>GIG</Text>
          <Text style={styles.logoSubtitle}>ZipFinder</Text>
        </View>
        
        <View style={styles.header}>
          <Text style={styles.title}>{t('select.title')}</Text>
          <Text style={styles.subtitle}>{t('select.subtitle')}</Text>
        </View>

        <View style={styles.appsContainer}>
          {apps.map((app) => (
            <TouchableOpacity
              key={app.id}
              style={styles.appCard}
              onPress={() => handleSelectApp(app.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${app.color}20` }]}>
                <Ionicons name={app.icon as any} size={40} color={app.color} />
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>{app.name}</Text>
                <Text style={styles.appDesc}>{t(app.descKey)}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>$5.00</Text>
                <Ionicons name="chevron-forward" size={24} color={COLORS.accent} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={COLORS.accent} />
          <Text style={styles.infoText}>
            {t('select.perApp')}
          </Text>
        </View>

        <View style={styles.includesContainer}>
          <Text style={styles.includesTitle}>
            {language === 'en' ? 'Each purchase includes:' : 'Cada compra incluye:'}
          </Text>
          <IncludeItem text={language === 'en' ? '5 zip codes with high availability' : '5 códigos postales con alta disponibilidad'} />
          <IncludeItem text={language === 'en' ? 'Detailed step-by-step opening guide' : 'Guía detallada paso a paso de apertura'} />
          <IncludeItem text={language === 'en' ? 'Google Voice free number guide' : 'Guía de número gratis Google Voice'} />
          <IncludeItem text={language === 'en' ? 'PDF downloadable guides' : 'Guías descargables en PDF'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const IncludeItem = ({ text }: { text: string }) => (
  <View style={styles.includeItem}>
    <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
    <Text style={styles.includeText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${COLORS.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  logoIcon: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoArrow: {
    position: 'absolute',
    bottom: -3,
    right: -8,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
    letterSpacing: 3,
  },
  logoSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    marginTop: -2,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  appsContainer: {
    marginBottom: 20,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appInfo: {
    flex: 1,
    marginLeft: 16,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  appDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginRight: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.accent}20`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.accent,
    marginLeft: 10,
    fontWeight: '600',
  },
  includesContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  includesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  includeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
});
