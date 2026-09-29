import { SpillbackSimulationData } from '../types';

export const MOCK_SPILLBACK_SIMULATION: SpillbackSimulationData = {
  scenarioName: 'Central Arterial Saturation & Wave Propagation',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  beforeRoute: {
    name: 'Route A — Central Arterial',
    durationMin: 24,
    congestionPercent: 42,
    spillbackProbability: 0.38,
  },
  simulationParameters: {
    additionalVehiclesPerHour: 500,
    durationMinutes: 45,
    corridorCapacityVehicles: 1600,
    chokePointName: 'Silk Board & Koramangala Inflow Bottleneck',
  },
  afterRoute: {
    name: 'Route A (Post-Spillback Shockwave)',
    predictedDurationMin: 39,
    predictedCongestionPercent: 78,
    spillbackRisk: 'high',
    queueBacklogMeters: 850,
  },
  alternativeRoute: {
    name: 'Route C — DISHA Smart Adaptive Bypass',
    predictedDurationMin: 27,
    predictedCongestionPercent: 25,
    spillbackRisk: 'low',
    rerouteAdvantageMin: 12, // 39 - 27 = 12 minutes saved
  },
  bottlenecks: [
    {
      id: 'bn-01',
      name: 'Outer Ring Choke Point Junction',
      location: [12.9176, 77.6238],
      queueLengthMeters: 850,
      criticalThresholdMeters: 500,
      spillbackProb: 0.89,
    },
    {
      id: 'bn-02',
      name: 'Sony World Intermediate Signal',
      location: [12.9352, 77.6245],
      queueLengthMeters: 420,
      criticalThresholdMeters: 350,
      spillbackProb: 0.64,
    },
    {
      id: 'bn-03',
      name: 'Sarjapur Divergence Ramp',
      location: [12.9200, 77.6850],
      queueLengthMeters: 90,
      criticalThresholdMeters: 600,
      spillbackProb: 0.12,
    },
  ],
};
