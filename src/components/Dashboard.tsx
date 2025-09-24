import React from 'react';
import { SectionMetrics } from '../types/railway';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  metrics: SectionMetrics;
  historicalData?: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, historicalData = [] }) => {
  // Mock historical data for charts
  const mockHourlyData = [
    { hour: '00:00', throughput: 18, delays: 3.2 },
    { hour: '04:00', throughput: 12, delays: 2.1 },
    { hour: '08:00', throughput: 28, delays: 5.8 },
    { hour: '12:00', throughput: 32, delays: 6.2 },
    { hour: '16:00', throughput: 35, delays: 4.9 },
    { hour: '20:00', throughput: 26, delays: 3.7 },
  ];

  const trainTypeData = [
    { name: 'Express', value: 35, color: '#ef4444' },
    { name: 'Passenger', value: 45, color: '#3b82f6' },
    { name: 'Freight', value: 20, color: '#eab308' },
  ];

  const performanceData = [
    { metric: 'On Time', value: metrics.punctualityRate },
    { metric: 'Delayed', value: 100 - metrics.punctualityRate },
    { metric: 'Track Utilization', value: metrics.trackUtilization },
    { metric: 'Capacity Used', value: 75 },
  ];

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (value: number) => {
    if (value >= 90) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (value >= 70) return <Activity className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto p-1">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.throughput}</div>
            <p className="text-xs text-muted-foreground">trains/hour</p>
            <Progress value={(metrics.throughput / 40) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delay</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageDelay}</div>
            <p className="text-xs text-muted-foreground">minutes</p>
            <div className="mt-2">
              <Badge variant={metrics.averageDelay < 5 ? 'default' : 'destructive'}>
                {metrics.averageDelay < 5 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Punctuality</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.punctualityRate}%</div>
            <p className="text-xs text-muted-foreground">on-time arrivals</p>
            <Progress value={metrics.punctualityRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Track Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.trackUtilization}%</div>
            <p className="text-xs text-muted-foreground">utilization</p>
            <Progress value={metrics.trackUtilization} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Throughput & Delays (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockHourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="throughput" stroke="#3b82f6" name="Throughput" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="delays" stroke="#ef4444" name="Avg Delay" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Train Type & Track Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Train Type Chart */}
              <div>
                <h4 className="text-sm font-medium mb-3">Train Types</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={trainTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {trainTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 mt-2">
                  {trainTypeData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Track Status Chart */}
              <div>
                <h4 className="text-sm font-medium mb-3">Track Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-950">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Clear Tracks</span>
                    </div>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-red-50 dark:bg-red-950">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Occupied Tracks</span>
                    </div>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-orange-50 dark:bg-orange-950">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm">Maintenance</span>
                    </div>
                    <span className="text-sm font-medium">1</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="text-left">
                  <p className="text-sm font-medium text-muted-foreground">{item.metric}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-xl font-bold ${getPerformanceColor(item.value)}`}>
                      {item.value.toFixed(1)}%
                    </p>
                    {getPerformanceIcon(item.value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operations Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{metrics.totalTrainsManaged}</p>
              <p className="text-sm text-muted-foreground">Total Trains</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.conflictsResolved}</p>
              <p className="text-sm text-muted-foreground">Conflicts Resolved</p>
            </div>
            <div>
              <p className="text-2xl font-bold">99.2%</p>
              <p className="text-sm text-muted-foreground">System Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;