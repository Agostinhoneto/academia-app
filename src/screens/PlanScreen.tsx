import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

export default function PlanScreen({navigation}: any) {
  const handleCall = () => {
    Linking.openURL('tel:+5511999999999');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=5511999999999');
  };

  const handleDirections = () => {
    Linking.openURL('https://maps.google.com/?q=-23.550520,-46.633308');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Plano</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Digital Member Card */}
          <View style={styles.memberCard}>
            <LinearGradient
              colors={['#233d2e', '#102216']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.cardGradient}>
              
              {/* Background Effect */}
              <View style={styles.cardGlow} />

              {/* Card Content */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.statusLabel}>STATUS DO PLANO</Text>
                    <View style={styles.statusRow}>
                      <View style={styles.statusDotContainer}>
                        <View style={styles.statusDotPing} />
                        <View style={styles.statusDot} />
                      </View>
                      <Text style={styles.statusText}>ATIVO</Text>
                    </View>
                  </View>
                  
                  <View style={styles.brandLogo}>
                    <MaterialIcons name="fitness-center" size={18} color="rgba(255,255,255,0.5)" />
                  </View>
                </View>

                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>Plano Premium</Text>
                  <Text style={styles.planSubtitle}>Acesso Total • Anual</Text>
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.footerLabel}>ALUNO</Text>
                    <Text style={styles.footerValue}>Carlos Silva</Text>
                  </View>
                  <View style={styles.idSection}>
                    <Text style={styles.footerLabel}>ID</Text>
                    <Text style={styles.footerValueMono}>893402</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Check-in Button */}
          <TouchableOpacity style={styles.checkinButton} activeOpacity={0.7}>
            <View style={styles.checkinLeft}>
              <View style={styles.checkinIcon}>
                <MaterialIcons name="qr-code-scanner" size={24} color="#13ec5b" />
              </View>
              <View>
                <Text style={styles.checkinTitle}>Check-in</Text>
                <Text style={styles.checkinSubtitle}>Use o QR Code na catraca</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          {/* Financial Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalhes da Assinatura</Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Próximo Vencimento</Text>
                <View style={styles.detailRow}>
                  <MaterialIcons name="calendar-today" size={16} color="#13ec5b" />
                  <Text style={styles.detailValue}>15/11/2023</Text>
                </View>
              </View>
              
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Valor Mensal</Text>
                <View style={styles.detailRow}>
                  <MaterialIcons name="payments" size={16} color="#13ec5b" />
                  <Text style={styles.detailValue}>R$ 99,90</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Gym Details */}
          <View style={styles.section}>
            <View style={styles.gymHeader}>
              <Text style={styles.sectionTitle}>Sobre a Unidade</Text>
              <TouchableOpacity>
                <Text style={styles.changeUnit}>Trocar unidade</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gymCard}>
              {/* Map */}
              <TouchableOpacity onPress={handleDirections} activeOpacity={0.9}>
                <ImageBackground
                  source={{uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600'}}
                  style={styles.mapImage}
                  resizeMode="cover">
                  <View style={styles.mapOverlay}>
                    <View style={styles.mapBadge}>
                      <Text style={styles.mapBadgeText}>Abrir Mapa</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              <View style={styles.gymInfo}>
                {/* Location */}
                <View style={styles.infoRow}>
                  <MaterialIcons name="location-on" size={20} color="#92c9a4" style={styles.infoIcon} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Unidade Centro</Text>
                    <Text style={styles.infoText}>Rua das Flores, 123 - Centro, São Paulo</Text>
                  </View>
                </View>

                {/* Schedule */}
                <View style={styles.infoRow}>
                  <MaterialIcons name="schedule" size={20} color="#92c9a4" style={styles.infoIcon} />
                  <View style={styles.infoContent}>
                    <View style={styles.scheduleHeader}>
                      <Text style={styles.infoTitle}>Horários</Text>
                      <View style={styles.openBadge}>
                        <Text style={styles.openBadgeText}>ABERTO AGORA</Text>
                      </View>
                    </View>
                    <Text style={styles.infoText}>Hoje: 06:00 - 23:00</Text>
                    <Text style={styles.scheduleSecondary}>Seg - Sex: 06:00 - 23:00</Text>
                    <Text style={styles.scheduleSecondary}>Sáb - Dom: 08:00 - 18:00</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                    <View style={styles.actionIcon}>
                      <MaterialIcons name="call" size={20} color="#13ec5b" />
                    </View>
                    <Text style={styles.actionLabel}>Ligar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton} onPress={handleWhatsApp}>
                    <View style={styles.actionIcon}>
                      <MaterialIcons name="chat" size={20} color="#13ec5b" />
                    </View>
                    <Text style={styles.actionLabel}>WhatsApp</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
                    <View style={styles.actionIcon}>
                      <MaterialIcons name="directions" size={20} color="#13ec5b" />
                    </View>
                    <Text style={styles.actionLabel}>Como chegar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={{height: 100}} />
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.manageButton} activeOpacity={0.8}>
          <Text style={styles.manageButtonText}>Gerenciar Assinatura</Text>
          <MaterialIcons name="settings" size={18} color="#102216" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
  header: {
    backgroundColor: 'rgba(16,34,22,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  memberCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  cardGlow: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(19,236,91,0.05)',
    borderRadius: 128,
  },
  cardContent: {
    padding: 24,
    gap: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(19,236,91,0.8)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDotContainer: {
    position: 'relative',
    width: 12,
    height: 12,
  },
  statusDotPing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#13ec5b',
    opacity: 0.75,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#13ec5b',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#13ec5b',
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: {
    gap: 4,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  planSubtitle: {
    fontSize: 14,
    color: '#92c9a4',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerLabel: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 1,
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  idSection: {
    alignItems: 'flex-end',
  },
  footerValueMono: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#d1d5db',
  },
  checkinButton: {
    backgroundColor: '#1a2e22',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkinIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(19,236,91,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkinTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  checkinSubtitle: {
    fontSize: 12,
    color: '#92c9a4',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#1a2e22',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#92c9a4',
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  gymHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#13ec5b',
  },
  gymCard: {
    backgroundColor: '#1a2e22',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    height: 128,
    width: '100%',
  },
  mapOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  mapBadgeText: {
    fontSize: 12,
    color: '#fff',
  },
  gymInfo: {
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  infoText: {
    fontSize: 14,
    color: '#92c9a4',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  openBadge: {
    backgroundColor: 'rgba(19,236,91,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  openBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#13ec5b',
    letterSpacing: 0.5,
  },
  scheduleSecondary: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19,236,91,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 10,
    color: '#92c9a4',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'rgba(16,34,22,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  manageButton: {
    backgroundColor: '#13ec5b',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#13ec5b',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#102216',
  },
});
