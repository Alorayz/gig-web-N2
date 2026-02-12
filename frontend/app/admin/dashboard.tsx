import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../src/stores/languageStore';
import { useAdminStore } from '../../src/stores/adminStore';
import {
  getAdminStats,
  getAdminPayments,
  getAllZipCodes,
  deleteZipCode,
  createZipCode,
  triggerAISearch,
  adminLogout,
  rotateZipCodes,
  checkRotationStatus,
} from '../../src/services/api';

type TabType = 'stats' | 'payments' | 'zipcodes';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { t } = useLanguageStore();
  const { token, logout, isAuthenticated } = useAdminStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [zipCodes, setZipCodes] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiSearching, setAiSearching] = useState(false);
  const [rotationInfo, setRotationInfo] = useState<any>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [newZipCode, setNewZipCode] = useState({
    zip_code: '',
    city: '',
    state: '',
    app_name: 'spark',
    availability_score: 75,
  });

  useEffect(() => {
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    loadData();
    loadRotationStatus();
  }, [token]);

  const loadRotationStatus = async () => {
    try {
      const status = await checkRotationStatus();
      setRotationInfo(status);
    } catch (error) {
      console.error('Error loading rotation status:', error);
    }
  };

  const handleRotateZipCodes = async () => {
    if (!token) return;
    
    Alert.alert(
      'Rotar Códigos Postales',
      '¿Estás seguro de que quieres rotar los códigos postales a un nuevo conjunto? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rotar',
          style: 'destructive',
          onPress: async () => {
            setIsRotating(true);
            try {
              await rotateZipCodes(token);
              Alert.alert('Éxito', 'Códigos postales rotados correctamente');
              loadData();
              loadRotationStatus();
            } catch (error) {
              console.error('Error rotating zip codes:', error);
              Alert.alert('Error', 'No se pudieron rotar los códigos postales');
            } finally {
              setIsRotating(false);
            }
          },
        },
      ]
    );
  };

  const loadData = async () => {
    if (!token) return;
    
    try {
      const [statsData, paymentsData, zipCodesData] = await Promise.all([
        getAdminStats(token),
        getAdminPayments(token),
        getAllZipCodes(token),
      ]);
      
      setStats(statsData);
      setPayments(paymentsData.payments || []);
      setZipCodes(zipCodesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              if (token) await adminLogout(token);
            } catch (e) {}
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleDeleteZipCode = async (zipId: string) => {
    Alert.alert(
      'Delete Zip Code',
      'Are you sure you want to delete this zip code?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (token) {
                await deleteZipCode(token, zipId);
                loadData();
              }
            } catch (error) {
              Alert.alert('Error', 'Could not delete zip code');
            }
          },
        },
      ]
    );
  };

  const handleAddZipCode = async () => {
    if (!newZipCode.zip_code || !newZipCode.city || !newZipCode.state) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (token) {
        await createZipCode(token, newZipCode);
        setShowAddModal(false);
        setNewZipCode({
          zip_code: '',
          city: '',
          state: '',
          app_name: 'spark',
          availability_score: 75,
        });
        loadData();
        Alert.alert('Success', 'Zip code added successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not add zip code');
    }
  };

  const handleAISearch = async (appName: string) => {
    setAiSearching(true);
    try {
      if (token) {
        const result = await triggerAISearch(token, appName);
        Alert.alert('AI Search Complete', result.message);
        loadData();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'AI search failed');
    } finally {
      setAiSearching(false);
    }
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>${stats?.total_revenue || 0}</Text>
          <Text style={styles.statLabel}>{t('admin.totalRevenue')}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="receipt" size={32} color="#2196F3" />
          <Text style={styles.statValue}>{stats?.total_payments || 0}</Text>
          <Text style={styles.statLabel}>{t('admin.totalPayments')}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>{stats?.successful_payments || 0}</Text>
          <Text style={styles.statLabel}>{t('admin.successfulPayments')}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="location" size={32} color="#FF9800" />
          <Text style={styles.statValue}>{zipCodes.length}</Text>
          <Text style={styles.statLabel}>{t('admin.zipCodes')}</Text>
        </View>
      </View>

      {/* AI Search Section */}
      <View style={styles.aiSection}>
        <Text style={styles.sectionTitle}>{t('admin.aiSearch')}</Text>
        <Text style={styles.aiDescription}>
          Search for new zip codes using AI
        </Text>
        <View style={styles.aiButtons}>
          {['spark', 'doordash', 'instacart'].map((app) => (
            <TouchableOpacity
              key={app}
              style={styles.aiButton}
              onPress={() => handleAISearch(app)}
              disabled={aiSearching}
            >
              {aiSearching ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.aiButtonText}>{app.toUpperCase()}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderPayments = () => (
    <View style={styles.listContainer}>
      {payments.length > 0 ? (
        payments.map((payment, index) => (
          <View key={payment.id || index} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentApp}>{payment.app_name?.toUpperCase()}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: payment.status === 'succeeded' ? '#4CAF50' : '#FF5722' }
              ]}>
                <Text style={styles.statusText}>{payment.status}</Text>
              </View>
            </View>
            <Text style={styles.paymentId}>ID: {payment.id?.substring(0, 8)}...</Text>
            <Text style={styles.paymentDate}>
              {new Date(payment.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={60} color="#888" />
          <Text style={styles.emptyText}>No payments yet</Text>
        </View>
      )}
    </View>
  );

  const renderZipCodes = () => (
    <View style={styles.listContainer}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>{t('admin.addZipCode')}</Text>
      </TouchableOpacity>

      {zipCodes.map((zip, index) => (
        <View key={zip.id || index} style={styles.zipCard}>
          <View style={styles.zipInfo}>
            <View style={styles.zipBadge}>
              <Ionicons name="location" size={16} color="#4CAF50" />
              <Text style={styles.zipCode}>{zip.zip_code}</Text>
            </View>
            <Text style={styles.zipLocation}>{zip.city}, {zip.state}</Text>
            <View style={styles.zipMeta}>
              <Text style={styles.zipApp}>{zip.app_name?.toUpperCase()}</Text>
              <Text style={styles.zipScore}>{zip.availability_score}%</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteZipCode(zip.id)}
          >
            <Ionicons name="trash" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('admin.dashboard')}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#FF5722" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Ionicons name="stats-chart" size={20} color={activeTab === 'stats' ? '#4CAF50' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            {t('admin.stats')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'payments' && styles.activeTab]}
          onPress={() => setActiveTab('payments')}
        >
          <Ionicons name="card" size={20} color={activeTab === 'payments' ? '#4CAF50' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'payments' && styles.activeTabText]}>
            {t('admin.payments')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'zipcodes' && styles.activeTab]}
          onPress={() => setActiveTab('zipcodes')}
        >
          <Ionicons name="location" size={20} color={activeTab === 'zipcodes' ? '#4CAF50' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'zipcodes' && styles.activeTabText]}>
            {t('admin.zipCodes')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4CAF50"
          />
        }
      >
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'zipcodes' && renderZipCodes()}
      </ScrollView>

      {/* Add Zip Code Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('admin.addZipCode')}</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Zip Code (e.g., 90210)"
              placeholderTextColor="#666"
              value={newZipCode.zip_code}
              onChangeText={(text) => setNewZipCode({ ...newZipCode, zip_code: text })}
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="City"
              placeholderTextColor="#666"
              value={newZipCode.city}
              onChangeText={(text) => setNewZipCode({ ...newZipCode, city: text })}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="State (e.g., CA)"
              placeholderTextColor="#666"
              value={newZipCode.state}
              onChangeText={(text) => setNewZipCode({ ...newZipCode, state: text })}
              maxLength={2}
              autoCapitalize="characters"
            />

            <View style={styles.appSelector}>
              <Text style={styles.selectorLabel}>App:</Text>
              <View style={styles.selectorButtons}>
                {['spark', 'doordash', 'instacart'].map((app) => (
                  <TouchableOpacity
                    key={app}
                    style={[
                      styles.selectorButton,
                      newZipCode.app_name === app && styles.selectorButtonActive,
                    ]}
                    onPress={() => setNewZipCode({ ...newZipCode, app_name: app })}
                  >
                    <Text style={[
                      styles.selectorButtonText,
                      newZipCode.app_name === app && styles.selectorButtonTextActive,
                    ]}>
                      {app.charAt(0).toUpperCase() + app.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleAddZipCode}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>{t('general.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
  aiSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  aiButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  aiButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  paymentCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentApp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  paymentId: {
    fontSize: 12,
    color: '#888',
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  zipCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  zipInfo: {
    flex: 1,
  },
  zipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  zipCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 6,
  },
  zipLocation: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  zipMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  zipApp: {
    fontSize: 12,
    color: '#888',
  },
  zipScore: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  appSelector: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  selectorButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectorButtonActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  selectorButtonText: {
    color: '#888',
    fontSize: 14,
  },
  selectorButtonTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
