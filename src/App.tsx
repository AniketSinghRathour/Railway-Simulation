import React, { useState, useEffect, useRef } from 'react';
import { Train, Intersection, OptimizationSuggestion } from './types/railway';
import { mockTrains, mockIntersections, mockTracks, mockOptimizationSuggestions, mockSectionMetrics } from './data/mockData';
import TrackLayout from './components/MyLayout/TrackLayout';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';
import SimulationPanel from './components/SimulationPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Activity, Settings, BarChart3, Play } from 'lucide-react';

export default function App() {
  const [signals, setSignals] = useState(["green", "red", "green", "red"]);
  const changeSignal = (index, newSignal) => {
    signals[index] = newSignal;
    setSignals([...signals]);
  }

  const [yellowTrainPos, setYellowTrainPos] = useState({ x: 240, y: 230 });
  const setTrainPosition = (x, y) => {
    setYellowTrainPos({ x, y });
  }

  const [blueTrainPos, setBlueTrainPos] = useState({ x: 55, y: 105 });
  const setBlueTrainPosition = (x, y) => {
    setBlueTrainPos({ x, y });
  }

  const [redTrainPos, setRedTrainPos] = useState({ x: 445, y: 105 });
  const setRedTrainPosition = (x, y) => {
    setRedTrainPos({ x, y });
  }

  const redTrainRef = useRef(redTrainPos);
  useEffect(() => {
    redTrainRef.current = redTrainPos;
  }, [redTrainPos]);

  const [tracking, setTracking] = useState(false);
  const trackingRef = useRef(null);

  const [divertBlue, setDivertBlue] = useState(false);
  const divertBlueRef = useRef(divertBlue);
  useEffect(() => {
    divertBlueRef.current = divertBlue;
  }, [divertBlue]);

  const [divertRed, setDivertRed] = useState(false);
  const divertRedRef = useRef(divertRed);
  useEffect(() => {
    divertRedRef.current = divertRed;
  }, [divertRed]);

  const handleDivertBlue = () => {
    setDivertBlue(true);
    setSignals(prev => {
      const newSignals = [...prev];
      newSignals[0] = "red";
      newSignals[1] = "green";
      return newSignals;
    });
  }

  const handleDivertRed = () => {
    setDivertRed(true);
    setSignals(prev => {
      const newSignals = [...prev];
      newSignals[2] = "red";
      newSignals[3] = "green";
      return newSignals;
    });
  }  

  const toggleTracking = () => {
    if (tracking) {
      clearInterval(trackingRef.current);
      trackingRef.current = null;
      setTracking(false);
    } 
    else {
      setTracking(true);
      trackingRef.current = setInterval(() => {
        setYellowTrainPos(prev => ({
          ...prev,
          x: prev.x + 10
        }));

        setBlueTrainPos(prev => {
          let newX = prev.x + 12;
          let newY = prev.y;

          if (divertBlueRef.current && (prev.x >= 150 && prev.x < 185)) newY -= 17;
          else if (divertBlueRef.current && (prev.x >= 280 && prev.x < 312)) {
            changeSignal(3, "green");
            changeSignal(2, "red");
            newY += 17;
          }

          if(!(divertBlueRef.current || divertRedRef.current) && (redTrainRef.current.x <= 330)){
            changeSignal(2, "red");
            changeSignal(3, "red");
            newX = prev.x;
            newY = prev.y;
          }
          return { ...prev, x: newX, y: newY };
        });
        
        setRedTrainPos(prev => {
          let newX = prev.x - 10;
          let newY = prev.y;

          if (divertRedRef.current && (prev.x <= 315 && prev.x > 290)) newY -= 18;
          else if(divertRedRef.current && (prev.x > 270 && prev.x <= 290)){
            changeSignal(1, "green");
            changeSignal(0, "red");
          }
          else if (divertRedRef.current && (prev.x > 160 && prev.x <= 185)) {
            newY += 18;
          }

          if(!(divertBlueRef.current || divertRedRef.current) && (redTrainRef.current.x <= 330)){
            changeSignal(2, "red");
            changeSignal(3, "red");
            newX = prev.x;
            newY = prev.y;
          }

          return { ...prev, x: newX, y: newY };
        });

      }, 600);
      
    }
  }














  const [trains, setTrains] = useState(mockTrains);
  const [intersections, setIntersections] = useState(mockIntersections);
  const [tracks, setTracks] = useState(mockTracks);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState(mockOptimizationSuggestions);
  const [selectedTrain, setSelectedTrain] = useState<Train | undefined>();
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | undefined>();
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(false);
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
    // toggleTracking();
    if (enabled) {
      // Simulate auto-optimization effects
      setSystemStatus('operational');
      // toggleTracking();
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
            <h1 className="text-xl lg:text-2xl font-bold truncate">Track Tracker</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">AI-Powered Train Traffic Control</p>
          </div>
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Active:</span>
              <span className="text-sm font-medium">{"3"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm hidden sm:inline">Delayed:</span>
              <span className="text-sm font-medium text-red-600">{"2"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm hidden sm:inline">Alerts:</span>
              <span className="text-sm font-medium text-orange-600">{"1"}</span>
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
          {/* <TrackLayout
            trains={trains}
            intersections={intersections}
            tracks={tracks}
            onTrainSelect={handleTrainSelect}
            onIntersectionSelect={handleIntersectionSelect} */}
          {/* /> */}

          {/* <button onClick={toggleTracking}>{tracking ? "Stop Tracking" : "Start Tracking"}</button> */}
            
            {/* {tracking ? (
           (blueTrainPos.x <= 160 && !divertBlue) ? (
            <button onClick={handleDivertBlue}> Divert Blue </button>
          ) : (
            (!divertBlue && ( (blueTrainPos.x > 160) ? <button onClick={handleDivertRed}> Divert Red </button>
              : setDivertRed(false)
            ))
        )) : null} */}

          <TrackLayout
          signals={signals}
          blueTrainPos={blueTrainPos}
          redTrainPos={redTrainPos}
          yellowTrainPos={yellowTrainPos}
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
                    onAutoOptimize={(enabled) => { 
                      toggleTracking();
                      handleAutoOptimize(enabled);
                    }}
                    autoOptimizeEnabled={autoOptimizeEnabled}
                    tracking={tracking}
                    handleDivertBlue={handleDivertBlue}
                    handleDivertRed={handleDivertRed}
                    blueTrainPos={blueTrainPos}
                    divertBlue={divertBlue}
                    setDivertBlue={setDivertBlue}
                    divertRed={divertRed}
                    setDivertRed={setDivertRed}
                    setDivertBlue={setDivertBlue}
                    divertRed={divertRed}
                    setDivertRed={setDivertRed}
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