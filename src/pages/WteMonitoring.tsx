import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { AlertTriangle, Thermometer, Zap, Wind, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

// Mock real-time data generator
const generateMockData = () => ({
  timestamp: new Date().toLocaleTimeString(),
  airflow: {
    primaryAirflow: 850 + Math.random() * 100, // Nm³/h
    secondaryAirflow: 450 + Math.random() * 50,
    idFanSpeed: 75 + Math.random() * 10, // %
    furnacePressure: -2.5 + Math.random() * 0.5, // mbar
  },
  gasComposition: {
    oxygen: 8.5 + Math.random() * 2, // %
    carbonMonoxide: 50 + Math.random() * 30, // ppm
    carbonDioxide: 12 + Math.random() * 2, // %
    nox: 180 + Math.random() * 40, // mg/Nm³
    so2: 25 + Math.random() * 15, // mg/Nm³
    hcl: 8 + Math.random() * 5, // mg/Nm³
  },
  energy: {
    steamFlow: 45 + Math.random() * 5, // kg/h
    steamTemp: 485 + Math.random() * 15, // °C
    steamPressure: 45 + Math.random() * 3, // bar
    powerGenerated: 8.5 + Math.random() * 1.5, // MW
    plantEfficiency: 85 + Math.random() * 5, // %
  },
  auxiliary: {
    limePH: 11.2 + Math.random() * 0.5,
    bagfilterDP: 1250 + Math.random() * 150, // Pa
    feedwaterTemp: 105 + Math.random() * 5, // °C
  }
});

// Status determination logic
const getStatus = (value: number, normal: [number, number], warning: [number, number]) => {
  if (value >= normal[0] && value <= normal[1]) return "normal";
  if (value >= warning[0] && value <= warning[1]) return "warning";
  return "critical";
};

const StatusBadge = ({ status, children }: { status: "normal" | "warning" | "critical", children: React.ReactNode }) => {
  const colors = {
    normal: "bg-status-normal text-status-normal-foreground",
    warning: "bg-status-warning text-status-warning-foreground", 
    critical: "bg-status-critical text-status-critical-foreground"
  };
  
  return (
    <Badge className={colors[status]}>
      {children}
    </Badge>
  );
};

const MetricCard = ({ title, value, unit, status, icon: Icon }: {
  title: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  icon: any;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toFixed(1)} {unit}</div>
      <div className="mt-2">
        <StatusBadge status={status}>
          {status.toUpperCase()}
        </StatusBadge>
      </div>
    </CardContent>
  </Card>
);

const WteMonitoring = () => {
  const [currentData, setCurrentData] = useState(generateMockData());
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<Array<{id: string, level: string, message: string, time: string}>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateMockData();
      setCurrentData(newData);
      
      // Keep last 20 data points for charts
      setHistoricalData(prev => [...prev.slice(-19), newData]);
      
      // Generate alerts based on thresholds
      const newAlerts = [];
      if (newData.gasComposition.carbonMonoxide > 100) {
        newAlerts.push({
          id: Date.now().toString(),
          level: "critical",
          message: "High CO levels detected - Incomplete combustion",
          time: new Date().toLocaleTimeString()
        });
      }
      if (newData.energy.steamPressure < 42) {
        newAlerts.push({
          id: Date.now() + "1",
          level: "warning", 
          message: "Low steam pressure - Check boiler performance",
          time: new Date().toLocaleTimeString()
        });
      }
      if (newData.gasComposition.nox > 200) {
        newAlerts.push({
          id: Date.now() + "2",
          level: "warning",
          message: "NOx levels approaching emission limits",
          time: new Date().toLocaleTimeString()
        });
      }
      
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)]);
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const gasCompositionData = [
    { name: 'N₂', value: 70, fill: '#8884d8' },
    { name: 'O₂', value: currentData.gasComposition.oxygen, fill: '#82ca9d' },
    { name: 'CO₂', value: currentData.gasComposition.carbonDioxide, fill: '#ffc658' },
    { name: 'H₂O', value: 8, fill: '#ff7300' },
    { name: 'Other', value: 10 - currentData.gasComposition.oxygen - currentData.gasComposition.carbonDioxide, fill: '#8dd1e1' }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">WtE Real-Time Monitor</h1>
            <p className="text-muted-foreground">Live monitoring of Waste-to-Energy plant operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export Data</Button>
            <Button variant="outline" size="sm">System Config</Button>
          </div>
        </div>

        {/* Active Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <Alert key={alert.id} className={alert.level === "critical" ? "border-status-critical" : "border-status-warning"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.level.toUpperCase()} ALERT - {alert.time}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="airflow">Airflow</TabsTrigger>
            <TabsTrigger value="emissions">Emissions</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Power Output"
                value={currentData.energy.powerGenerated}
                unit="MW"
                status={getStatus(currentData.energy.powerGenerated, [7, 10], [5, 12])}
                icon={Zap}
              />
              <MetricCard
                title="Plant Efficiency"
                value={currentData.energy.plantEfficiency}
                unit="%"
                status={getStatus(currentData.energy.plantEfficiency, [80, 95], [70, 100])}
                icon={Activity}
              />
              <MetricCard
                title="CO Levels"
                value={currentData.gasComposition.carbonMonoxide}
                unit="ppm"
                status={getStatus(currentData.gasComposition.carbonMonoxide, [0, 80], [80, 120])}
                icon={Wind}
              />
              <MetricCard
                title="Steam Temperature"
                value={currentData.energy.steamTemp}
                unit="°C"
                status={getStatus(currentData.energy.steamTemp, [480, 500], [470, 510])}
                icon={Thermometer}
              />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Power Generation Trend</CardTitle>
                  <CardDescription>Last 20 readings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="energy.powerGenerated" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gas Composition</CardTitle>
                  <CardDescription>Current flue gas composition</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={gasCompositionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {gasCompositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="airflow" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Primary Airflow"
                value={currentData.airflow.primaryAirflow}
                unit="Nm³/h"
                status={getStatus(currentData.airflow.primaryAirflow, [800, 950], [700, 1000])}
                icon={Wind}
              />
              <MetricCard
                title="Secondary Airflow"
                value={currentData.airflow.secondaryAirflow}
                unit="Nm³/h"
                status={getStatus(currentData.airflow.secondaryAirflow, [400, 500], [350, 550])}
                icon={Wind}
              />
              <MetricCard
                title="ID Fan Speed"
                value={currentData.airflow.idFanSpeed}
                unit="%"
                status={getStatus(currentData.airflow.idFanSpeed, [70, 85], [60, 90])}
                icon={Activity}
              />
              <MetricCard
                title="Furnace Pressure"
                value={currentData.airflow.furnacePressure}
                unit="mbar"
                status={getStatus(currentData.airflow.furnacePressure, [-3, -2], [-4, -1])}
                icon={Activity}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Airflow Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="airflow.primaryAirflow" stroke="#8884d8" name="Primary" />
                    <Line type="monotone" dataKey="airflow.secondaryAirflow" stroke="#82ca9d" name="Secondary" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emissions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard
                title="O₂"
                value={currentData.gasComposition.oxygen}
                unit="%"
                status={getStatus(currentData.gasComposition.oxygen, [6, 11], [4, 13])}
                icon={Wind}
              />
              <MetricCard
                title="CO"
                value={currentData.gasComposition.carbonMonoxide}
                unit="ppm"
                status={getStatus(currentData.gasComposition.carbonMonoxide, [0, 80], [80, 120])}
                icon={AlertTriangle}
              />
              <MetricCard
                title="CO₂"
                value={currentData.gasComposition.carbonDioxide}
                unit="%"
                status={getStatus(currentData.gasComposition.carbonDioxide, [10, 15], [8, 17])}
                icon={Wind}
              />
              <MetricCard
                title="NOx"
                value={currentData.gasComposition.nox}
                unit="mg/Nm³"
                status={getStatus(currentData.gasComposition.nox, [0, 200], [200, 250])}
                icon={AlertTriangle}
              />
              <MetricCard
                title="SO₂"
                value={currentData.gasComposition.so2}
                unit="mg/Nm³"
                status={getStatus(currentData.gasComposition.so2, [0, 30], [30, 50])}
                icon={AlertTriangle}
              />
              <MetricCard
                title="HCl"
                value={currentData.gasComposition.hcl}
                unit="mg/Nm³"
                status={getStatus(currentData.gasComposition.hcl, [0, 10], [10, 15])}
                icon={AlertTriangle}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Emission Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={[
                    { name: 'NOx', value: currentData.gasComposition.nox, limit: 200 },
                    { name: 'SO₂', value: currentData.gasComposition.so2, limit: 50 },
                    { name: 'HCl', value: currentData.gasComposition.hcl, limit: 15 },
                    { name: 'CO', value: currentData.gasComposition.carbonMonoxide, limit: 100 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Current" />
                    <Bar dataKey="limit" fill="#ff7300" name="Limit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard
                title="Steam Flow"
                value={currentData.energy.steamFlow}
                unit="kg/h"
                status={getStatus(currentData.energy.steamFlow, [40, 50], [35, 55])}
                icon={Activity}
              />
              <MetricCard
                title="Steam Temp"
                value={currentData.energy.steamTemp}
                unit="°C"
                status={getStatus(currentData.energy.steamTemp, [480, 500], [470, 510])}
                icon={Thermometer}
              />
              <MetricCard
                title="Steam Pressure"
                value={currentData.energy.steamPressure}
                unit="bar"
                status={getStatus(currentData.energy.steamPressure, [42, 48], [40, 50])}
                icon={Activity}
              />
              <MetricCard
                title="Power Generated"
                value={currentData.energy.powerGenerated}
                unit="MW"
                status={getStatus(currentData.energy.powerGenerated, [7, 10], [5, 12])}
                icon={Zap}
              />
              <MetricCard
                title="Plant Efficiency"
                value={currentData.energy.plantEfficiency}
                unit="%"
                status={getStatus(currentData.energy.plantEfficiency, [80, 95], [70, 100])}
                icon={Activity}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Energy Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="energy.powerGenerated" stroke="#8884d8" name="Power (MW)" />
                    <Line type="monotone" dataKey="energy.plantEfficiency" stroke="#82ca9d" name="Efficiency (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default WteMonitoring;
