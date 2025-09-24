import React, { useState } from 'react';
import { Train, OptimizationSuggestion } from '../types/railway';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertTriangle, CheckCircle, Clock, Zap, Route, Shield } from 'lucide-react';

interface ControlPanelProps {
  trains: Train[];
  optimizationSuggestions: OptimizationSuggestion[];
  selectedTrain?: Train;
  onTrainUpdate: (trainId: string, updates: Partial<Train>) => void;
  onApplySuggestion: (suggestionId: string) => void;
  onEmergencyStop: () => void;
  onAutoOptimize: (enabled: boolean) => void;
  autoOptimizeEnabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  trains,
  optimizationSuggestions,
  selectedTrain,
  onTrainUpdate,
  onApplySuggestion,
  onEmergencyStop,
  onAutoOptimize,
  autoOptimizeEnabled
}) => {
  const [selectedTrainForControl, setSelectedTrainForControl] = useState<string>('');
  const [newPriority, setNewPriority] = useState<number[]>([5]);

  const getUrgencyColor = (urgency: OptimizationSuggestion['urgency']) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSuggestionIcon = (type: OptimizationSuggestion['type']) => {
    switch (type) {
      case 'conflict_resolution': return <Shield className="w-4 h-4" />;
      case 'routing': return <Route className="w-4 h-4" />;
      case 'priority': return <Zap className="w-4 h-4" />;
      case 'delay_mitigation': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const handlePriorityUpdate = () => {
    if (selectedTrainForControl) {
      onTrainUpdate(selectedTrainForControl, { priority: newPriority[0] });
    }
  };

  const delayedTrains = trains.filter(train => train.delay > 0);
  const highPriorityTrains = trains.filter(train => train.priority >= 7);

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Control Center</span>
            <div className="flex items-center space-x-2">
              <Label htmlFor="auto-optimize" className="text-sm">Auto-Optimize</Label>
              <Switch
                id="auto-optimize"
                checked={autoOptimizeEnabled}
                onCheckedChange={onAutoOptimize}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={onEmergencyStop}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Emergency Stop All
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="optimization" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="optimization">AI Suggestions</TabsTrigger>
          <TabsTrigger value="control">Train Control</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Optimization Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {optimizationSuggestions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No optimization suggestions at this time
                </p>
              ) : (
                optimizationSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getSuggestionIcon(suggestion.type)}
                        <Badge variant={getUrgencyColor(suggestion.urgency)}>
                          {suggestion.urgency}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onApplySuggestion(suggestion.id)}
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-sm">{suggestion.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Train: {suggestion.trainId}</span>
                      <span>Throughput: +{suggestion.impact.throughputImprovement}%</span>
                      <span>Delay: -{suggestion.impact.delayReduction} min</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="control" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Train Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Train</Label>
                <Select value={selectedTrainForControl} onValueChange={setSelectedTrainForControl}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a train to control" />
                  </SelectTrigger>
                  <SelectContent>
                    {trains.map((train) => (
                      <SelectItem key={train.id} value={train.id}>
                        {train.name} ({train.id}) - {train.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTrainForControl && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Priority Level: {newPriority[0]}</Label>
                    <Slider
                      value={newPriority}
                      onValueChange={setNewPriority}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={handlePriorityUpdate} className="w-full">
                    Update Priority
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => onTrainUpdate(selectedTrainForControl, { status: 'stopped' })}
                    >
                      Stop Train
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onTrainUpdate(selectedTrainForControl, { status: 'running' })}
                    >
                      Resume Train
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedTrain && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Train Details</CardTitle>
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
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-3">
                  <p className="font-medium text-red-700">Delayed Trains</p>
                  <p className="text-sm text-muted-foreground">
                    {delayedTrains.length} trains currently delayed
                  </p>
                  {delayedTrains.map(train => (
                    <div key={train.id} className="text-xs text-muted-foreground mt-1">
                      {train.name}: {train.delay} min delay
                    </div>
                  ))}
                </div>

                <div className="border-l-4 border-yellow-500 pl-3">
                  <p className="font-medium text-yellow-700">High Priority Trains</p>
                  <p className="text-sm text-muted-foreground">
                    {highPriorityTrains.length} high priority trains active
                  </p>
                  {highPriorityTrains.map(train => (
                    <div key={train.id} className="text-xs text-muted-foreground mt-1">
                      {train.name}: Priority {train.priority}
                    </div>
                  ))}
                </div>

                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium text-green-700">System Status</p>
                  <p className="text-sm text-muted-foreground">
                    All critical systems operational
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlPanel;