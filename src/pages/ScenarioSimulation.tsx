
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const ScenarioSimulation = () => {
  const { toast } = useToast();
  const location = useLocation();
  const districtData = location.state as { district?: string; wasteVolume?: number; organicPercentage?: number; recyclablePercentage?: number } | null;
  
  const [districtName, setDistrictName] = useState(districtData?.district || "");
  const [wasteVolume, setWasteVolume] = useState(districtData?.wasteVolume || 200000);
  const [organicPercentage, setOrganicPercentage] = useState(districtData?.organicPercentage || 45);
  const [recyclablePercentage, setRecyclablePercentage] = useState(districtData?.recyclablePercentage || 30);
  const [processingEfficiency, setProcessingEfficiency] = useState(70);
  const [selectedTechnology, setSelectedTechnology] = useState("gasification");

  useEffect(() => {
    if (districtData) {
      toast({
        title: "District Data Loaded",
        description: `Simulation parameters set for ${districtData.district}`,
      });
    }
  }, []);

  // Calculate results based on inputs
  const calculateResults = () => {
    const organicWaste = wasteVolume * (organicPercentage / 100);
    const recyclableWaste = wasteVolume * (recyclablePercentage / 100);
    const residualWaste = wasteVolume - organicWaste - recyclableWaste;
    
    let energyOutput = 0;
    let carbonReduction = 0;
    let operationalCost = 0;
    
    // Different calculations based on technology
    switch (selectedTechnology) {
      case "gasification":
        energyOutput = residualWaste * 0.8 * (processingEfficiency / 100);
        carbonReduction = energyOutput * 0.6;
        operationalCost = energyOutput * 0.4;
        break;
      case "anaerobic":
        energyOutput = organicWaste * 0.5 * (processingEfficiency / 100);
        carbonReduction = energyOutput * 0.7;
        operationalCost = energyOutput * 0.3;
        break;
      case "incineration":
        energyOutput = residualWaste * 0.65 * (processingEfficiency / 100);
        carbonReduction = energyOutput * 0.45;
        operationalCost = energyOutput * 0.35;
        break;
    }
    
    return {
      energyOutput: Math.round(energyOutput),
      carbonReduction: Math.round(carbonReduction),
      operationalCost: Math.round(operationalCost),
      landfillDiversion: Math.round((organicWaste + residualWaste) * (processingEfficiency / 100)),
      revenueEstimate: Math.round(energyOutput * 1.2)
    };
  };
  
  const results = calculateResults();
  
  const simulateScenario = () => {
    toast({
      title: "Scenario Simulation Complete",
      description: `Energy Output: ${results.energyOutput} MWh/year with ${processingEfficiency}% efficiency`,
    });
  };

  const comparisonData = [
    { 
      name: "Gasification", 
      energy: 800, 
      carbon: 600,
      cost: 400
    },
    { 
      name: "Anaerobic", 
      energy: 500, 
      carbon: 700,
      cost: 300
    },
    { 
      name: "Incineration", 
      energy: 650, 
      carbon: 450,
      cost: 350
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Scenario Simulation {districtName && `- ${districtName}`}
          </h1>
          <p className="text-muted-foreground mt-2">
            Model different waste-to-energy scenarios and analyze projected outcomes
          </p>
        </div>

        <Tabs defaultValue="parameters" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="parameters">Input Parameters</TabsTrigger>
            <TabsTrigger value="results">Simulation Results</TabsTrigger>
            <TabsTrigger value="comparison">Technology Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Waste Characteristics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Annual Waste Volume (tons)</span>
                    <span className="font-medium">{wasteVolume}</span>
                  </div>
                  <Slider 
                    value={[wasteVolume]} 
                    onValueChange={(value) => setWasteVolume(value[0])}
                    min={50000}
                    max={500000}
                    step={10000}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Organic Content (%)</span>
                    <span className="font-medium">{organicPercentage}%</span>
                  </div>
                  <Slider 
                    value={[organicPercentage]} 
                    onValueChange={(value) => setOrganicPercentage(value[0])}
                    min={10}
                    max={70}
                    step={1}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Recyclable Content (%)</span>
                    <span className="font-medium">{recyclablePercentage}%</span>
                  </div>
                  <Slider 
                    value={[recyclablePercentage]} 
                    onValueChange={(value) => setRecyclablePercentage(value[0])}
                    min={10}
                    max={60}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technology Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={selectedTechnology === "gasification" ? "default" : "outline"}
                    onClick={() => setSelectedTechnology("gasification")}
                  >
                    Gasification
                  </Button>
                  <Button
                    variant={selectedTechnology === "anaerobic" ? "default" : "outline"}
                    onClick={() => setSelectedTechnology("anaerobic")}
                  >
                    Anaerobic Digestion
                  </Button>
                  <Button
                    variant={selectedTechnology === "incineration" ? "default" : "outline"}
                    onClick={() => setSelectedTechnology("incineration")}
                  >
                    Incineration
                  </Button>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Processing Efficiency (%)</span>
                    <span className="font-medium">{processingEfficiency}%</span>
                  </div>
                  <Slider 
                    value={[processingEfficiency]} 
                    onValueChange={(value) => setProcessingEfficiency(value[0])}
                    min={40}
                    max={95}
                    step={1}
                  />
                </div>
                
                <Button onClick={simulateScenario} className="w-full">
                  Run Simulation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Energy Output</span>
                    <span className="font-bold">{results.energyOutput} MWh/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbon Reduction</span>
                    <span className="font-bold">{results.carbonReduction} tCO₂e/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operational Cost</span>
                    <span className="font-bold">${results.operationalCost.toLocaleString()}/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Landfill Diversion</span>
                    <span className="font-bold">{results.landfillDiversion} tons/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue Estimate</span>
                    <span className="font-bold">${results.revenueEstimate.toLocaleString()}/year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Financial Analysis</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Initial Investment", value: results.operationalCost * 5 },
                        { name: "Annual Revenue", value: results.revenueEstimate },
                        { name: "Annual Cost", value: results.operationalCost },
                        { name: "Annual Profit", value: results.revenueEstimate - results.operationalCost },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                      <Legend />
                      <Bar dataKey="value" fill="hsl(var(--primary))" name="Amount (USD)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Technology Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="energy" name="Energy Output (kWh/ton)" fill="hsl(var(--primary))" />
                    <Bar dataKey="carbon" name="Carbon Reduction (kg/ton)" fill="hsl(var(--accent))" />
                    <Bar dataKey="cost" name="Cost ($/ton)" fill="hsl(var(--muted))" />
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

export default ScenarioSimulation;
