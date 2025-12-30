import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import Svg, {Defs, LinearGradient as SvgGradient, Stop, Path, Circle, Line} from 'react-native-svg';

const METRICS = ['Peso', 'Gordura Corporal', 'Supino', 'Agachamento'];
const TIME_RANGES = ['1M', '3M', '6M', '1A', 'Tudo'];

const HISTORY_DATA = [
  {date: 'Dez 12', time: '08:30 AM', title: 'Pesagem Semanal', value: '78.0', trend: 'down'},
  {date: 'Dez 05', time: '07:45 AM', title: 'Pesagem Semanal', value: '78.5', trend: 'down'},
  {date: 'Nov 28', time: '09:00 AM', title: 'Check-up Mensal', value: '79.0', trend: 'up'},
];

export default function ProgressScreen({navigation}: any) {
  const [selectedMetric, setSelectedMetric] = useState('Peso');
  const [selectedRange, setSelectedRange] = useState('3M');

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sua Evolução</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="calendar-today" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Metrics Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsContainer}
          contentContainerStyle={styles.chipsContent}>
          {METRICS.map(metric => (
            <TouchableOpacity
              key={metric}
              style={[
                styles.chip,
                selectedMetric === metric && styles.chipActive,
              ]}
              onPress={() => setSelectedMetric(metric)}>
              <Text
                style={[
                  styles.chipText,
                  selectedMetric === metric && styles.chipTextActive,
                ]}>
                {metric}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time Range Segmented Control */}
        <View style={styles.segmentedContainer}>
          <View style={styles.segmentedControl}>
            {TIME_RANGES.map(range => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.segment,
                  selectedRange === range && styles.segmentActive,
                ]}
                onPress={() => setSelectedRange(range)}>
                <Text
                  style={[
                    styles.segmentText,
                    selectedRange === range && styles.segmentTextActive,
                  ]}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartCard}>
            {/* Current Value */}
            <View style={styles.currentValue}>
              <Text style={styles.currentLabel}>Peso Atual</Text>
              <View style={styles.valueRow}>
                <Text style={styles.valueMain}>
                  78.0 <Text style={styles.valueUnit}>kg</Text>
                </Text>
                <View style={styles.trendBadge}>
                  <MaterialIcons name="trending-down" size={16} color="#13ec5b" />
                  <Text style={styles.trendText}>-1.5kg</Text>
                </View>
              </View>
              <Text style={styles.comparisonText}>Comparado aos últimos 3 meses</Text>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
              <Svg width="100%" height="200" viewBox="0 0 350 150" preserveAspectRatio="none">
                <Defs>
                  <SvgGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#13ec5b" stopOpacity="0.3" />
                    <Stop offset="100%" stopColor="#13ec5b" stopOpacity="0" />
                  </SvgGradient>
                </Defs>

                {/* Grid Lines */}
                <Line x1="0" y1="0" x2="350" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                <Line x1="0" y1="50" x2="350" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                <Line x1="0" y1="100" x2="350" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                <Line x1="0" y1="150" x2="350" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />

                {/* Area Fill */}
                <Path
                  d="M0,80 Q35,70 70,85 T140,75 T210,60 T280,65 T350,40 V150 H0 Z"
                  fill="url(#gradient)"
                />

                {/* Line */}
                <Path
                  d="M0,80 Q35,70 70,85 T140,75 T210,60 T280,65 T350,40"
                  fill="none"
                  stroke="#13ec5b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <Circle cx="70" cy="85" r="4" fill="#162e20" stroke="#13ec5b" strokeWidth="2" />
                <Circle cx="140" cy="75" r="4" fill="#162e20" stroke="#13ec5b" strokeWidth="2" />
                <Circle cx="210" cy="60" r="4" fill="#162e20" stroke="#13ec5b" strokeWidth="2" />
                <Circle cx="280" cy="65" r="4" fill="#162e20" stroke="#13ec5b" strokeWidth="2" />
                <Circle cx="350" cy="40" r="6" fill="#13ec5b" stroke="#162e20" strokeWidth="3" />
              </Svg>

              {/* Tooltip */}
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>78.0kg</Text>
                <View style={styles.tooltipArrow} />
              </View>
            </View>

            {/* X Axis Labels */}
            <View style={styles.xAxis}>
              <Text style={styles.xAxisLabel}>Ago</Text>
              <Text style={styles.xAxisLabel}>Set</Text>
              <Text style={styles.xAxisLabel}>Out</Text>
              <Text style={styles.xAxisLabel}>Nov</Text>
              <Text style={[styles.xAxisLabel, styles.xAxisLabelActive]}>Dez</Text>
            </View>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Meta</Text>
              <MaterialIcons name="flag" size={18} color="#13ec5b" />
            </View>
            <Text style={styles.summaryValue}>
              75.0 <Text style={styles.summaryUnit}>kg</Text>
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>IMC</Text>
              <MaterialIcons name="healing" size={18} color="#4ade80" />
            </View>
            <Text style={styles.summaryValue}>
              24.2 <Text style={styles.summaryBadge}>Normal</Text>
            </Text>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Histórico</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          {HISTORY_DATA.map((item, index) => (
            <TouchableOpacity key={index} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateMonth}>{item.date.split(' ')[0]}</Text>
                  <Text style={styles.dateDay}>{item.date.split(' ')[1]}</Text>
                </View>
                <View>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyTime}>{item.time}</Text>
                </View>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyValue}>{item.value} kg</Text>
                <MaterialIcons
                  name={item.trend === 'down' ? 'arrow-downward' : 'arrow-upward'}
                  size={14}
                  color={item.trend === 'down' ? '#13ec5b' : '#ef4444'}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fab}>
        <TouchableOpacity style={styles.fabButton}>
          <MaterialIcons name="add" size={32} color="#102216" />
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
    backgroundColor: '#102216',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipsContent: {
    gap: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#162e20',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#13ec5b',
    shadowColor: '#13ec5b',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92c9a4',
  },
  chipTextActive: {
    color: '#102216',
    fontWeight: 'bold',
  },
  segmentedContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#162e20',
    borderRadius: 12,
    padding: 4,
    height: 40,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: '#1f3b2a',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  segmentTextActive: {
    color: '#13ec5b',
  },
  chartSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chartCard: {
    backgroundColor: '#162e20',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentValue: {
    marginBottom: 24,
  },
  currentLabel: {
    fontSize: 14,
    color: '#92c9a4',
    fontWeight: '500',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  valueMain: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  valueUnit: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(19,236,91,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 6,
  },
  trendText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#13ec5b',
  },
  comparisonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chartContainer: {
    height: 200,
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: 10,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#102216',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    transform: [{rotate: '45deg'}],
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  xAxisLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  xAxisLabelActive: {
    color: '#13ec5b',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#162e20',
    borderRadius: 12,
    padding: 16,
    height: 96,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#92c9a4',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryUnit: {
    fontSize: 12,
    color: '#666',
  },
  summaryBadge: {
    fontSize: 12,
    color: '#4ade80',
    fontWeight: '500',
  },
  historySection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#13ec5b',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#162e20',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dateBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1f3b2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92c9a4',
    textTransform: 'uppercase',
  },
  dateDay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92c9a4',
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 24,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#13ec5b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#13ec5b',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
});
