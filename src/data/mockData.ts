import { Train, Intersection, Track, OptimizationSuggestion, SectionMetrics } from '../types/railway';

export const mockTrains: Train[] = [
  {
    id: 'T001',
    type: 'express',
    name: 'Rajdhani Express',
    speed: 120,
    priority: 9,
    position: { x: 150, y: 150 }, // On ML1A
    destination: 'New Delhi',
    delay: 5,
    status: 'running',
    route: ['ML1A', 'J1', 'ML1B', 'J2', 'ML1C']
  },
  {
    id: 'T002',
    type: 'passenger',
    name: 'Local Passenger',
    speed: 80,
    priority: 5,
    position: { x: 350, y: 250 }, // On ML2B
    destination: 'Chennai Central',
    delay: 0,
    status: 'running',
    route: ['ML2B', 'J7', 'ML2C', 'J6', 'ML2D']
  },
  {
    id: 'T003',
    type: 'freight',
    name: 'Goods Train 2341',
    speed: 60,
    priority: 3,
    position: { x: 550, y: 50 }, // On BL1B
    destination: 'Mumbai Yard',
    delay: 15,
    status: 'delayed',
    route: ['BL1B', 'BL1A', 'J2', 'ML1C']
  },
  {
    id: 'T004',
    type: 'express',
    name: 'Shatabdi Express',
    speed: 110,
    priority: 8,
    position: { x: 175, y: 450 }, // On YD1
    destination: 'Bangalore',
    delay: 2,
    status: 'running',
    route: ['YD1', 'J5', 'BL2B', 'J7', 'ML2C']
  },
  {
    id: 'T005',
    type: 'passenger',
    name: 'EMU Local',
    speed: 90,
    priority: 6,
    position: { x: 750, y: 250 }, // On ML2D
    destination: 'Suburban Terminal',
    delay: 0,
    status: 'running',
    route: ['ML2D', 'J6', 'ML2C', 'J7', 'ML2B']
  }
];

export const mockIntersections: Intersection[] = [
  {
    id: 'J1',
    name: 'Central Junction',
    position: { x: 250, y: 150 },
    status: 'clear',
    connectedTracks: ['ML1A', 'ML1B', 'ML2A']
  },
  {
    id: 'J2',
    name: 'North Junction',
    position: { x: 450, y: 150 },
    status: 'clear',
    connectedTracks: ['ML1B', 'ML1C', 'BL1A']
  },
  {
    id: 'J3',
    name: 'East Junction',
    position: { x: 650, y: 150 },
    status: 'clear',
    connectedTracks: ['ML1C', 'ML1D', 'ML2C']
  },
  {
    id: 'J4',
    name: 'South Junction',
    position: { x: 250, y: 250 },
    status: 'clear',
    connectedTracks: ['ML2A', 'ML2B', 'BL2A']
  },
  {
    id: 'J5',
    name: 'Yard Junction',
    position: { x: 250, y: 350 },
    status: 'clear',
    connectedTracks: ['BL2A', 'BL2B', 'YD1']
  },
  {
    id: 'J6',
    name: 'Station Junction',
    position: { x: 650, y: 250 },
    status: 'occupied',
    connectedTracks: ['ML2C', 'ML2D', 'ST1']
  },
  {
    id: 'J7',
    name: 'Branch Junction',
    position: { x: 450, y: 250 },
    status: 'clear',
    connectedTracks: ['ML2B', 'ML2C', 'BL2B']
  }
];

// Linear railway schematic layout - Main lines with branches
export const mockTracks: Track[] = [
  // Main Line 1 (Top) - East-West
  { id: 'ML1A', name: 'Main Line 1A', start: { x: 50, y: 150 }, end: { x: 250, y: 150 }, capacity: 1, currentOccupancy: 1, status: 'occupied' },
  { id: 'ML1B', name: 'Main Line 1B', start: { x: 250, y: 150 }, end: { x: 450, y: 150 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  { id: 'ML1C', name: 'Main Line 1C', start: { x: 450, y: 150 }, end: { x: 650, y: 150 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  { id: 'ML1D', name: 'Main Line 1D', start: { x: 650, y: 150 }, end: { x: 850, y: 150 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  
  // Main Line 2 (Center) - East-West
  { id: 'ML2A', name: 'Main Line 2A', start: { x: 50, y: 250 }, end: { x: 250, y: 250 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  { id: 'ML2B', name: 'Main Line 2B', start: { x: 250, y: 250 }, end: { x: 450, y: 250 }, capacity: 1, currentOccupancy: 1, status: 'occupied' },
  { id: 'ML2C', name: 'Main Line 2C', start: { x: 450, y: 250 }, end: { x: 650, y: 250 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  { id: 'ML2D', name: 'Main Line 2D', start: { x: 650, y: 250 }, end: { x: 850, y: 250 }, capacity: 1, currentOccupancy: 1, status: 'occupied' },
  
  // Branch Line 1 (North)
  { id: 'BL1A', name: 'Branch Line 1A', start: { x: 450, y: 50 }, end: { x: 450, y: 150 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  { id: 'BL1B', name: 'Branch Line 1B', start: { x: 450, y: 50 }, end: { x: 650, y: 50 }, capacity: 1, currentOccupancy: 1, status: 'occupied' },
  
  // Branch Line 2 (South)
  { id: 'BL2A', name: 'Branch Line 2A', start: { x: 250, y: 250 }, end: { x: 250, y: 350 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  { id: 'BL2B', name: 'Branch Line 2B', start: { x: 250, y: 350 }, end: { x: 450, y: 350 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  { id: 'BL2C', name: 'Branch Line 2C', start: { x: 450, y: 350 }, end: { x: 650, y: 350 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  
  // Yard Tracks
  { id: 'YD1', name: 'Yard Track 1', start: { x: 50, y: 450 }, end: { x: 300, y: 450 }, capacity: 1, currentOccupancy: 1, status: 'occupied' },
  { id: 'YD2', name: 'Yard Track 2', start: { x: 50, y: 500 }, end: { x: 300, y: 500 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  
  // Station Platform Tracks
  { id: 'ST1', name: 'Platform 1', start: { x: 650, y: 350 }, end: { x: 650, y: 450 }, capacity: 1, currentOccupancy: 0, status: 'clear' },
  { id: 'ST2', name: 'Platform 2', start: { x: 700, y: 350 }, end: { x: 700, y: 450 }, capacity: 1, currentOccupancy: 0, status: 'clear' }
];

export const mockOptimizationSuggestions: OptimizationSuggestion[] = [
  {
    id: 'OPT001',
    type: 'conflict_resolution',
    trainId: 'T003',
    description: 'Reroute Train1_Blue via Track T1_B2_S1 to avoid congestion',
    impact: {
      throughputImprovement: 15,
      delayReduction: 8
    },
    urgency: 'high'
  },
  {
    id: 'OPT002',
    type: 'priority',
    trainId: 'T001',
    description: 'Grant priority passage to Rajdhani Express at Junction Beta',
    impact: {
      throughputImprovement: 10,
      delayReduction: 5
    },
    urgency: 'medium'
  },
  {
    id: 'OPT003',
    type: 'routing',
    trainId: 'T005',
    description: 'Alternative route via Track 19 for better flow',
    impact: {
      throughputImprovement: 8,
      delayReduction: 3
    },
    urgency: 'low'
  }
];

export const mockSectionMetrics: SectionMetrics = {
  throughput: 24, // trains per hour
  averageDelay: 4.2, // minutes
  punctualityRate: 87.5, // percentage
  trackUtilization: 68.3, // percentage
  conflictsResolved: 12,
  totalTrainsManaged: 156
};