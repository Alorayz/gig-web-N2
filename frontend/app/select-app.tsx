import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';

const { width } = Dimensions.get('window');

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
  const { t } = useLanguageStore();
  const { setSelectedApp } = useAppStore();

  const handleSelectApp = (appId: string) => {
    setSelectedApp(appId);
    router.push('/terms');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                <Ionicons name="chevron-forward" size={24} color="#888" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#4CAF50" />
          <Text style={styles.infoText}>
            {t('select.perApp')}
          </Text>
        </View>

        <View style={styles.includesContainer}>
          <Text style={styles.includesTitle}>
            {useLanguageStore.getState().language === 'en' ? 'Each purchase includes:' : 'Cada compra incluye:'}
          </Text>
          <IncludeItem text={useLanguageStore.getState().language === 'en' ? '5 zip codes with availability' : '5 códigos postales con disponibilidad'} />
          <IncludeItem text={useLanguageStore.getState().language === 'en' ? 'Step-by-step opening guide' : 'Guía de apertura paso a paso'} />
          <IncludeItem text={useLanguageStore.getState().language === 'en' ? 'Google Voice free number guide' : 'Guía de número gratis Google Voice'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const IncludeItem = ({ text }: { text: string }) => (
  <View style={styles.includeItem}>
    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
    <Text style={styles.includeText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
  },
  appsContainer: {
    marginBottom: 20,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    color: '#fff',
  },
  appDesc: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 10,
    fontWeight: '600',
  },
  includesContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
  },
  includesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  includeText: {
    fontSize: 14,
    color: '#ddd',
    marginLeft: 12,
  },
});
