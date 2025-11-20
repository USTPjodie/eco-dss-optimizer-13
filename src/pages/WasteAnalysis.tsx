
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
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

const wasteGenerationData = [
  { name: "2018", value: 182000 },
  { name: "2019", value: 189000 },
  { name: "2020", value: 175000 },
  { name: "2021", value: 195000 },
  { name: "2022", value: 203000 },
  { name: "2023", value: 211000 },
  { name: "2024 (est.)", value: 218000 },
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
    category: "Organic", 
    method: "Anaerobic Digestion", 
    efficiency: "60-80%",
    energyYield: "80-140 kWh/ton",
    requirements: "Proper segregation, control of moisture content"
  },
  { 
    category: "Mixed MSW", 
    method: "Incineration", 
    efficiency: "65-85%",
    energyYield: "500-600 kWh/ton",
    requirements: "Pre-sorting, air pollution control"
  },
  { 
    category: "Processed RDF", 
    method: "Gasification", 
    efficiency: "70-90%",
    energyYield: "600-900 kWh/ton",
    requirements: "Waste pre-processing, syngas cleaning"
  },
  { 
    category: "Landfill", 
    method: "Landfill Gas Recovery", 
    efficiency: "40-60%",
    energyYield: "50-90 kWh/ton",
    requirements: "Proper landfill design, gas collection system"
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Waste Characterization Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Detailed analysis of waste composition and energy potential for Cagayan de Oro
          </p>
        </div>

        <Tabs defaultValue="composition" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="composition">Waste Composition</TabsTrigger>
            <TabsTrigger value="generation">Generation Trends</TabsTrigger>
            <TabsTrigger value="collection">Collection Efficiency</TabsTrigger>
            <TabsTrigger value="energy">Energy Potential</TabsTrigger>
          </TabsList>
          
          <TabsContent value="composition" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Municipal Solid Waste Composition</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
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
                  <CardTitle>Calorific Values by Waste Type</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calorificValueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'MJ/kg', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value} MJ/kg`, "Calorific Value"]} />
                      <Bar dataKey="value" fill="hsl(var(--accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Waste Properties Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Waste Component</TableHead>
                      <TableHead>Moisture Content (%)</TableHead>
                      <TableHead>Volatile Matter (%)</TableHead>
                      <TableHead>Fixed Carbon (%)</TableHead>
                      <TableHead>Ash Content (%)</TableHead>
                      <TableHead>Calorific Value (MJ/kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Food Waste</TableCell>
                      <TableCell>70-80</TableCell>
                      <TableCell>15-25</TableCell>
                      <TableCell>2-5</TableCell>
                      <TableCell>5-10</TableCell>
                      <TableCell>3-6</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Paper</TableCell>
                      <TableCell>6-10</TableCell>
                      <TableCell>75-85</TableCell>
                      <TableCell>8-10</TableCell>
                      <TableCell>5-10</TableCell>
                      <TableCell>12-18</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Plastics</TableCell>
                      <TableCell>1-4</TableCell>
                      <TableCell>90-98</TableCell>
                      <TableCell>1-2</TableCell>
                      <TableCell>1-5</TableCell>
                      <TableCell>30-40</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Textiles</TableCell>
                      <TableCell>10-15</TableCell>
                      <TableCell>65-75</TableCell>
                      <TableCell>10-12</TableCell>
                      <TableCell>5-8</TableCell>
                      <TableCell>15-19</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Yard Waste</TableCell>
                      <TableCell>30-60</TableCell>
                      <TableCell>30-55</TableCell>
                      <TableCell>5-10</TableCell>
                      <TableCell>5-10</TableCell>
                      <TableCell>5-8</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="generation" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Annual Waste Generation Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wasteGenerationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 'dataMax + 50000']} />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} tons`} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Total Waste" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Waste Generation Analysis by District</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead>Population</TableHead>
                      <TableHead>Daily Generation (tons)</TableHead>
                      <TableHead>Per Capita (kg/day)</TableHead>
                      <TableHead>Collection Rate (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>District 1</TableCell>
                      <TableCell>85,420</TableCell>
                      <TableCell>96.5</TableCell>
                      <TableCell>1.13</TableCell>
                      <TableCell>92</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>District 2</TableCell>
                      <TableCell>102,350</TableCell>
                      <TableCell>112.6</TableCell>
                      <TableCell>1.10</TableCell>
                      <TableCell>88</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>District 3</TableCell>
                      <TableCell>91,700</TableCell>
                      <TableCell>95.4</TableCell>
                      <TableCell>1.04</TableCell>
                      <TableCell>85</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>District 4</TableCell>
                      <TableCell>78,350</TableCell>
                      <TableCell>72.1</TableCell>
                      <TableCell>0.92</TableCell>
                      <TableCell>78</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>District 5</TableCell>
                      <TableCell>95,120</TableCell>
                      <TableCell>102.7</TableCell>
                      <TableCell>1.08</TableCell>
                      <TableCell>83</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="collection" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Waste Collection Efficiency by Area</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collectionEfficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="efficiency" fill="hsl(var(--accent))" name="Collection Efficiency" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>District Waste Analysis & Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead>Annual Volume (tons)</TableHead>
                      <TableHead>Organic (%)</TableHead>
                      <TableHead>Recyclable (%)</TableHead>
                      <TableHead>Collection Efficiency</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collectionEfficiencyData.map((district) => (
                      <TableRow key={district.name}>
                        <TableCell className="font-medium">{district.name}</TableCell>
                        <TableCell>{district.wasteVolume.toLocaleString()}</TableCell>
                        <TableCell>{district.organicPct}%</TableCell>
                        <TableCell>{district.recyclablePct}%</TableCell>
                        <TableCell>{district.efficiency}%</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => navigateToSimulation(district)}
                          >
                            Run Simulation
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Collection Infrastructure Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Current Capacity</TableHead>
                      <TableHead>Required Capacity</TableHead>
                      <TableHead>Gap</TableHead>
                      <TableHead>Utilization (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Collection Vehicles</TableCell>
                      <TableCell>28</TableCell>
                      <TableCell>35</TableCell>
                      <TableCell className="text-destructive">-7</TableCell>
                      <TableCell>120</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Transfer Stations</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell className="text-destructive">-2</TableCell>
                      <TableCell>145</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Material Recovery</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell className="text-destructive">-4</TableCell>
                      <TableCell>110</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Collection Staff</TableCell>
                      <TableCell>120</TableCell>
                      <TableCell>150</TableCell>
                      <TableCell className="text-destructive">-30</TableCell>
                      <TableCell>125</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Landfill Capacity</TableCell>
                      <TableCell>450 tons/day</TableCell>
                      <TableCell>580 tons/day</TableCell>
                      <TableCell className="text-destructive">-130 tons/day</TableCell>
                      <TableCell>129</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="energy" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Waste-to-Energy Potential Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Waste Category</TableHead>
                      <TableHead>Conversion Method</TableHead>
                      <TableHead>Conversion Efficiency</TableHead>
                      <TableHead>Energy Yield</TableHead>
                      <TableHead>Requirements</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {energyPotentialData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.method}</TableCell>
                        <TableCell>{item.efficiency}</TableCell>
                        <TableCell>{item.energyYield}</TableCell>
                        <TableCell>{item.requirements}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Projected Energy Generation</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Anaerobic Digestion", value: 28000 },
                      { name: "Incineration", value: 114000 },
                      { name: "Gasification", value: 145000 },
                      { name: "Landfill Gas", value: 21000 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} MWh/year`} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Annual Energy Generation" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default WasteAnalysis;
