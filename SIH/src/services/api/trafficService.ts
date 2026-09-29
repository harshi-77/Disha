import { isLiveMode, apiRequest } from './apiClient';
import { MOCK_TRAFFIC_SEGMENTS, MOCK_INCIDENTS } from '../../mock/mockTraffic';
import { TrafficSegment, TrafficIncident } from '../../types';

export interface TrafficCurrentResponse {
  segments: TrafficSegment[];
  incidents: TrafficIncident[];
  cityWideCongestionAverage: number;
  lastUpdated: string;
}

export const trafficService = {
  async getCurrentTraffic(): Promise<TrafficCurrentResponse> {
    if (isLiveMode()) {
      return apiRequest<TrafficCurrentResponse>('/api/traffic/current');
    }

    // Demo Mode with simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 350));

    return {
      segments: MOCK_TRAFFIC_SEGMENTS,
      incidents: MOCK_INCIDENTS,
      cityWideCongestionAverage: 48,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  },
};
