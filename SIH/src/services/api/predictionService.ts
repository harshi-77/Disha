import { isLiveMode, apiRequest } from './apiClient';
import { MOCK_TRAFFIC_PREDICTION } from '../../mock/mockPredictions';
import { TrafficPrediction } from '../../types';

export interface TrafficPredictionRequest {
  corridorId?: string;
  horizonMinutes?: number;
}

export const predictionService = {
  async getPrediction(req: TrafficPredictionRequest = {}): Promise<TrafficPrediction> {
    if (isLiveMode()) {
      return apiRequest<TrafficPrediction>('/api/traffic/predict', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    }

    // Demo Mode with simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_TRAFFIC_PREDICTION;
  },
};
