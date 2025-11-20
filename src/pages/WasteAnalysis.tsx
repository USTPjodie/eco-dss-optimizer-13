
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const wasteCompositionData = [
  { name: "Organic", value: 45, color: "hsl(var(--primary))" },
  { name: "Recyclables", value: 30, color: "hsl(var(--accent))" },
  { name: "Inert Waste", value: 15, color: "hsl(var(--muted))" },
  { name: "Hazardous", value: 5, color: "hsl(var(--destructive))" },
  { name: "Others", value: 5, color: "hsl(187 31% 62%)" }
];

const calorificValueData = [
  { name: "Paper", value: 16.8 },
  { name: "Textiles", value: 17.5 },
  { name: "Plastics", value: 32.6 },
  { name: "Food waste", value: 4.2 },
  { name: "Yard waste", value: 6.5 },
  { name: "Wood", value: 18.6 },
  { name: "Mixed MSW", value: 10.5 }
];

const collectionEfficiencyData = [
  { name: "Urban Area A", efficiency: 92, wasteVolume: 85000, organicPct: 48, recyclablePct: 32 },
  { name: "Urban Area B", efficiency: 88, wasteVolume: 72000, organicPct: 45, recyclablePct: 30 },
  { name: "Suburban Area C", efficiency: 76, wasteVolume: 42000, organicPct: 50, recyclablePct: 28 },
  { name: "Suburban Area D", efficiency: 72, wasteVolume: 38000, organicPct: 52, recyclablePct: 25 },
  { name: "Rural Area E", efficiency: 65, wasteVolume: 18000, organicPct: 58, recyclablePct: 20 },
  { name: "Rural Area F", efficiency: 58, wasteVolume: 15000, organicPct: 60, recyclablePct: 18 },
];

const energyPotentialData = [
  { 
    method: "Gasification", 
    category: "Processed RDF",
    efficiency: "70-90%",
    energyYield: "600-900 kWh/ton"
  },
  { 
    method: "Incineration", 
    category: "Mixed MSW",
    efficiency: "65-85%",
    energyYield: "500-600 kWh/ton"
  },
  { 
    method: "Anaerobic Digestion", 
    category: "Organic",
    efficiency: "60-80%",
    energyYield: "80-140 kWh/ton"
  },
  { 
    method: "Landfill Gas Recovery", 
    category: "Landfill",
    efficiency: "40-60%",
    energyYield: "50-90 kWh/ton"
  },
];

const WasteAnalysis = () => {
  const navigate = useNavigate();

  const navigateToSimulation = (district: typeof collectionEfficiencyData[0]) => {
    navigate("/waste-analysis/simulation", { 
      state: { 
        district: district.name,
        wasteVolume: district.wasteVolume,
        organicPercentage: district.organicPct,
        recyclablePercentage: district.recyclablePct
      } 
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Waste Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Analyze waste composition and simulate energy generation for each district
          </p>
        </div>

        <Tabs defaultValue="districts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="districts">District Analysis</TabsTrigger>
            <TabsTrigger value="composition">Waste Composition</TabsTrigger>
            <TabsTrigger value="energy">Energy Potential</TabsTrigger>
          </TabsList>
          
          <TabsContent value="districts" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>District Waste Data & Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a district to run waste-to-energy simulations based on actual collection data
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead>Annual Volume</TableHead>
                      <TableHead>Organic Content</TableHead>
                      <TableHead>Recyclable Content</TableHead>
                      <TableHead>Collection Rate</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collectionEfficiencyData.map((district) => (
                      <TableRow key={district.name}>
                        <TableCell className="font-medium">{district.name}</TableCell>
                        <TableCell>{district.wasteVolume.toLocaleString()} tons</TableCell>
                        <TableCell>{district.organicPct}%</TableCell>
                        <TableCell>{district.recyclablePct}%</TableCell>
                        <TableCell>
                          <span className={district.efficiency >= 85 ? "text-green-600" : district.efficiency >= 70 ? "text-yellow-600" : "text-red-600"}>
                            {district.efficiency}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => navigateToSimulation(district)}
                          >
                            Simulate →
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="composition" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Waste Composition Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteCompositionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {wasteCompositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Energy Value by Type</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calorificValueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'MJ/kg', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value} MJ/kg`, "Energy Value"]} />
                      <Bar dataKey="value" fill="hsl(var(--accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="energy" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Energy Generation Potential by Technology</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Gasification", value: 145000, efficiency: "70-90%" },
                      { name: "Incineration", value: 114000, efficiency: "65-85%" },
                      { name: "Anaerobic Digestion", value: 28000, efficiency: "60-80%" },
                      { name: "Landfill Gas", value: 21000, efficiency: "40-60%" }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} MWh/year`} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Annual Energy" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-4 mt-4">
              {energyPotentialData.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.method}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Waste Type:</span>
                      <p className="font-medium">{item.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Efficiency:</span>
                      <p className="font-medium">{item.efficiency}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Energy Yield:</span>
                      <p className="font-medium">{item.energyYield}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default WasteAnalysis;
