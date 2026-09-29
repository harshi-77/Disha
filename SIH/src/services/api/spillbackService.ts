import { isLiveMode, apiRequest } from './apiClient';
import { MOCK_SPILLBACK_SIMULATION } from '../../mock/mockSpillback';
import { SpillbackSimulationData } from '../../types';

export interface SpillbackSimulateRequest {
  routeId: string;
  additionalVehiclesPerHour: number;
  durationMinutes?: number;
}

export const spillbackService = {
  async runSimulation(req: SpillbackSimulateRequest): Promise<SpillbackSimulationData> {
    if (isLiveMode()) {
      return apiRequest<SpillbackSimulationData>('/api/spillback/simulate', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    }

    // Demo Mode with simulated network calculation latency
    await new Promise((resolve) => setTimeout(resolve, 550));

    // Dynamic calculation based on vehicle stress parameter
    const stress = req.additionalVehiclesPerHour || 500;
    const congestionFactor = Math.min(95, Math.round(42 + (stress / 500) * 36));
    const delayFactor = Math.min(55, Math.round(24 + (stress / 500) * 15));
    const queueFactor = Math.round(850 * (stress / 500));

    return {
      ...MOCK_SPILLBACK_SIMULATION,
      simulationParameters: {
        ...MOCK_SPILLBACK_SIMULATION.simulationParameters,
        additionalVehiclesPerHour: stress,
      },
      afterRoute: {
        ...MOCK_SPILLBACK_SIMULATION.afterRoute,
        predictedDurationMin: delayFactor,
        predictedCongestionPercent: congestionFactor,
        queueBacklogMeters: queueFactor,
      },
      alternativeRoute: {
        ...MOCK_SPILLBACK_SIMULATION.alternativeRoute,
        rerouteAdvantageMin: Math.max(1, delayFactor - 27),
      },
    };
  },
};
