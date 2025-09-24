import React, { useState } from 'react';
import { Train } from '../types/railway';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Play, RotateCcw, Save, AlertTriangle, Plus, Minus } from 'lucide-react';

interface SimulationPanelProps {
  trains: Train[];
  onRunSimulation: (scenario: SimulationScenario) => void;
  onResetSimulation: () => void;
}

interface SimulationScenario {
  name: string;
  description: string;
  modifications: {
    trainChanges: { trainId: string; changes: Partial<Train> }[];
    newTrains: Partial<Train>[];
    removedTrains: string[];
    systemFailures: string[];
  };
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  trains,
  onRunSimulation,
  onResetSimulation
}) => {
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [selectedTrain, setSelectedTrain] = useState('');
  const [newTrainType, setNewTrainType] = useState<'express' | 'passenger' | 'freight'>('passenger');
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<string>('');
  
  // Pre-defined scenarios
  const predefinedScenarios: SimulationScenario[] = [
    {
      name: 'Rush Hour Peak',
      description: 'Simulate peak traffic with 50% more trains and reduced track capacity',
      modifications: {
        trainChanges: [],
        newTrains: [
          { type: 'passenger', name: 'Rush Local 1', speed: 85, priority: 6 },
          { type: 'passenger', name: 'Rush Local 2', speed: 85, priority: 6 },
          { type: 'express', name: 'Peak Express', speed: 120, priority: 8 }
        ],
        removedTrains: [],
        systemFailures: []
      }
    },
    {
      name: 'Equipment Failure',
      description: 'Simulate signal failure at major junction with train backup',
      modifications: {
        trainChanges: [
          { trainId: 'T001', changes: { delay: 15, status: 'delayed' as const } },
          { trainId: 'T002', changes: { delay: 10, status: 'delayed' as const } }
        ],
        newTrains: [],
        removedTrains: [],
        systemFailures: ['I2', 'I4']
      }
    },
    {
      name: 'Freight Priority',
      description: 'Test freight train priority changes during cargo delivery deadlines',
      modifications: {
        trainChanges: [
          { trainId: 'T003', changes: { priority: 9, speed: 80 } }
        ],
        newTrains: [
          { type: 'freight', name: 'Priority Cargo', speed: 75, priority: 8 }
        ],
        removedTrains: [],
        systemFailures: []
      }
    },
    {
      name: 'Weather Disruption',
      description: 'Reduced speeds due to heavy rain and limited visibility',
      modifications: {
        trainChanges: trains.map(train => ({
          trainId: train.id,
          changes: { speed: Math.floor(train.speed * 0.7), delay: train.delay + 5 }
        })),
        newTrains: [],
        removedTrains: [],
        systemFailures: []
      }
    }
  ];

  const runPredefinedScenario = (scenario: SimulationScenario) => {
    setActiveScenario(scenario.name);
    onRunSimulation(scenario);
    
    // Mock simulation results
    const mockResults = {
      scenarioName: scenario.name,
      duration: '30 minutes',
      improvements: {
        throughputChange: Math.floor(Math.random() * 20) - 10,
        delayReduction: Math.floor(Math.random() * 15),
        conflictsAvoided: Math.floor(Math.random() * 8),
      },
      recommendations: [
        'Increase priority for express trains during peak hours',
        'Implement dynamic routing for freight during rush periods',
        'Add backup signaling at Junction Beta'
      ]
    };
    setSimulationResults(mockResults);
  };

  const createCustomScenario = () => {
    const customScenario: SimulationScenario = {
      name: scenarioName || 'Custom Scenario',
      description: scenarioDescription || 'User-defined scenario',
      modifications: {
        trainChanges: [],
        newTrains: [],
        removedTrains: [],
        systemFailures: []
      }
    };
    
    runPredefinedScenario(customScenario);
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>What-If Simulation</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetSimulation}
                disabled={!activeScenario}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeScenario && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm font-medium">Active Scenario: {activeScenario}</p>
              <Badge variant="secondary">Running</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="predefined" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predefined">Quick Scenarios</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="predefined" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pre-defined Scenarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {predefinedScenarios.map((scenario, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{scenario.name}</h4>
                    <Button
                      size="sm"
                      onClick={() => runPredefinedScenario(scenario)}
                      disabled={activeScenario === scenario.name}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Run
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  <div className="flex gap-2 text-xs">
                    {scenario.modifications.newTrains.length > 0 && (
                      <Badge variant="outline">
                        +{scenario.modifications.newTrains.length} trains
                      </Badge>
                    )}
                    {scenario.modifications.trainChanges.length > 0 && (
                      <Badge variant="outline">
                        {scenario.modifications.trainChanges.length} modifications
                      </Badge>
                    )}
                    {scenario.modifications.systemFailures.length > 0 && (
                      <Badge variant="destructive">
                        {scenario.modifications.systemFailures.length} failures
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Scenario Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Scenario Name</Label>
                <Input
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="Enter scenario name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={scenarioDescription}
                  onChange={(e) => setScenarioDescription(e.target.value)}
                  placeholder="Describe your scenario"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Scenario Modifications</Label>
                
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium mb-2">Train Operations</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Train
                    </Button>
                    <Button variant="outline" size="sm">
                      <Minus className="w-4 h-4 mr-1" />
                      Remove Train
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <h4 className="font-medium mb-2">System Failures</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Simulate Signal Failure
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Simulate Track Blockage
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={createCustomScenario} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Run Custom Scenario
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {simulationResults ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{simulationResults.scenarioName}</h4>
                    <Badge>Completed</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="border rounded-lg p-3">
                      <p className="text-lg font-bold text-blue-600">
                        {simulationResults.improvements.throughputChange > 0 ? '+' : ''}
                        {simulationResults.improvements.throughputChange}%
                      </p>
                      <p className="text-sm text-muted-foreground">Throughput Change</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-lg font-bold text-green-600">
                        -{simulationResults.improvements.delayReduction} min
                      </p>
                      <p className="text-sm text-muted-foreground">Delay Reduction</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-lg font-bold text-purple-600">
                        {simulationResults.improvements.conflictsAvoided}
                      </p>
                      <p className="text-sm text-muted-foreground">Conflicts Avoided</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium">AI Recommendations</h5>
                    <div className="space-y-1">
                      {simulationResults.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="text-sm p-2 bg-muted rounded">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Save className="w-4 h-4 mr-1" />
                      Save Results
                    </Button>
                    <Button size="sm" variant="outline">
                      Export Report
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No simulation results yet.</p>
                  <p className="text-sm">Run a scenario to see results here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimulationPanel;