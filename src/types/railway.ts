export interface Train {
  id: string;
  type: 'express' | 'passenger' | 'freight';
  name: string;
  speed: number; // km/h
  priority: number; // 1-10, higher is more priority
  position: {
    x: number;
    y: number;
  };
  destination: string;
  delay: number; // minutes
  status: 'running' | 'stopped' | 'delayed' | 'maintenance';
  route: string[];
}

export interface Intersection {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  status: 'clear' | 'occupied' | 'blocked';
  connectedTracks: string[];
}

export interface Track {
  id: string;
  name: string;
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  capacity: number;
  currentOccupancy: number;
  status: 'clear' | 'occupied' | 'maintenance';
}

export interface OptimizationSuggestion {
  id: string;
  type: 'routing' | 'priority' | 'delay_mitigation' | 'conflict_resolution';
  trainId: string;
  description: string;
  impact: {
    throughputImprovement: number;
    delayReduction: number;
  };
  urgency: 'low' | 'medium' | 'high';
}

export interface SectionMetrics {
  throughput: number; // trains per hour
  averageDelay: number; // minutes
  punctualityRate: number; // percentage
  trackUtilization: number; // percentage
  conflictsResolved: number;
  totalTrainsManaged: number;
}