import React, { useState } from 'react';
import { Train, Intersection, OptimizationSuggestion } from './types/railway';
import { mockTrains, mockIntersections, mockTracks, mockOptimizationSuggestions, mockSectionMetrics } from './data/mockData';
import TrackLayout from './components/TrackLayout';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';
import SimulationPanel from './components/SimulationPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Activity, Settings, BarChart3, Play } from 'lucide-react';

export default function App() {
  const [trains, setTrains] = useState(mockTrains);
  const [intersections, setIntersections] = useState(mockIntersections);
  const [tracks, setTracks] = useState(mockTracks);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState(mockOptimizationSuggestions);
  const [selectedTrain, setSelectedTrain] = useState<Train | undefined>();
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | undefined>();
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(true);
  const [systemStatus, setSystemStatus] = useState<'operational' | 'warning' | 'critical'>('operational');

  const handleTrainSelect = (train: Train) => {
    setSelectedTrain(train);
  };

  const handleIntersectionSelect = (intersection: Intersection) => {
    setSelectedIntersection(intersection);
  };

  const handleTrainUpdate = (trainId: string, updates: Partial<Train>) => {
    setTrains(prevTrains =>
      prevTrains.map(train =>
        train.id === trainId ? { ...train, ...updates } : train
      )
    );
  };

  const handleApplySuggestion = (suggestionId: string) => {
    const suggestion = optimizationSuggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      // Apply the suggestion logic here
      console.log('Applying suggestion:', suggestion);
      
      // Remove the applied suggestion
      setOptimizationSuggestions(prev => 
        prev.filter(s => s.id !== suggestionId)
      );
      
      // Update system status
      setSystemStatus('operational');
    }
  };

  const handleEmergencyStop = () => {
    setTrains(prevTrains =>
      prevTrains.map(train => ({ ...train, status: 'stopped' as const }))
    );
    setSystemStatus('critical');
  };

  const handleAutoOptimize = (enabled: boolean) => {
    setAutoOptimizeEnabled(enabled);
    if (enabled) {
      // Simulate auto-optimization effects
      setSystemStatus('operational');
    }
  };

  const handleRunSimulation = (scenario: any) => {
    console.log('Running simulation:', scenario);
    // Implement simulation logic here
  };

  const handleResetSimulation = () => {
    setTrains(mockTrains);
    setIntersections(mockIntersections);
    setTracks(mockTracks);
    setSystemStatus('operational');
  };

  const getStatusColor = (status: typeof systemStatus) => {
    switch (status) {
      case 'operational': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const activeTrains = trains.filter(train => train.status === 'running').length;
  const delayedTrains = trains.filter(train => train.delay > 0).length;
  const criticalAlerts = optimizationSuggestions.filter(s => s.urgency === 'high').length;

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold truncate">Railway Traffic Control System</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">AI-Powered Precise Train Traffic Control</p>
          </div>
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Active:</span>
              <span className="text-sm font-medium">{activeTrains}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm hidden sm:inline">Delayed:</span>
              <span className="text-sm font-medium text-red-600">{delayedTrains}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm hidden sm:inline">Alerts:</span>
              <span className="text-sm font-medium text-orange-600">{criticalAlerts}</span>
            </div>
            <Badge variant={getStatusColor(systemStatus)} className="text-xs">
              {systemStatus.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Track Layout */}
        <div className="flex-1 p-4">
          <TrackLayout
            trains={trains}
            intersections={intersections}
            tracks={tracks}
            onTrainSelect={handleTrainSelect}
            onIntersectionSelect={handleIntersectionSelect}
          />
        </div>

        {/* Right Panel - Tabs */}
        <div className="w-96 border-l bg-card flex-shrink-0">
          <Tabs defaultValue="control" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-4 mb-0 sticky top-0 z-10">
              <TabsTrigger value="control" className="flex items-center gap-1 text-xs">
                <Settings className="w-3 h-3" />
                Control
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs">
                <BarChart3 className="w-3 h-3" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="simulation" className="flex items-center gap-1 text-xs">
                <Play className="w-3 h-3" />
                Simulate
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-1 text-xs">
                <Activity className="w-3 h-3" />
                Info
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="control" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
                <div className="flex-1 overflow-hidden p-4">
                  <ControlPanel
                    trains={trains}
                    optimizationSuggestions={optimizationSuggestions}
                    selectedTrain={selectedTrain}
                    onTrainUpdate={handleTrainUpdate}
                    onApplySuggestion={handleApplySuggestion}
                    onEmergencyStop={handleEmergencyStop}
                    onAutoOptimize={handleAutoOptimize}
                    autoOptimizeEnabled={autoOptimizeEnabled}
                  />
                </div>
              </TabsContent>

              <TabsContent value="dashboard" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
                <div className="flex-1 overflow-hidden p-4">
                  <Dashboard metrics={mockSectionMetrics} />
                </div>
              </TabsContent>

              <TabsContent value="simulation" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
                <div className="flex-1 overflow-hidden p-4">
                  <SimulationPanel
                    trains={trains}
                    onRunSimulation={handleRunSimulation}
                    onResetSimulation={handleResetSimulation}
                  />
                </div>
              </TabsContent>

              <TabsContent value="info" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
                <div className="flex-1 overflow-hidden p-4">
                  <div className="space-y-4 h-full overflow-y-auto">
                    {selectedTrain && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Selected Train</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Name:</span>
                              <span className="font-medium">{selectedTrain.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ID:</span>
                              <span className="font-medium">{selectedTrain.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <Badge variant="outline">{selectedTrain.type}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Speed:</span>
                              <span>{selectedTrain.speed} km/h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Priority:</span>
                              <span>{selectedTrain.priority}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Destination:</span>
                              <span className="truncate max-w-32" title={selectedTrain.destination}>
                                {selectedTrain.destination}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <Badge variant={selectedTrain.status === 'running' ? 'default' : 'secondary'}>
                                {selectedTrain.status}
                              </Badge>
                            </div>
                            {selectedTrain.delay > 0 && (
                              <div className="flex justify-between">
                                <span>Delay:</span>
                                <span className="text-red-500">{selectedTrain.delay} min</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedIntersection && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Selected Junction</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Name:</span>
                              <span className="font-medium">{selectedIntersection.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ID:</span>
                              <span className="font-medium">{selectedIntersection.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <Badge variant={selectedIntersection.status === 'clear' ? 'default' : 'destructive'}>
                                {selectedIntersection.status}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <span>Connected Tracks:</span>
                              <div className="flex flex-wrap gap-1">
                                {selectedIntersection.connectedTracks.map(track => (
                                  <Badge key={track} variant="outline" className="text-xs">
                                    {track}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {!selectedTrain && !selectedIntersection && (
                      <Card>
                        <CardContent className="text-center py-8">
                          <p className="text-muted-foreground">
                            Click on a train or junction to view details
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}