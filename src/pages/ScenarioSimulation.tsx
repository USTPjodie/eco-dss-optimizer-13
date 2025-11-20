
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Zap, Leaf, DollarSign } from "lucide-react";

const ScenarioSimulation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const districtData = location.state as { district?: string; wasteVolume?: number; organicPercentage?: number; recyclablePercentage?: number } | null;
  
  const [districtName] = useState(districtData?.district || "Custom");
  const [wasteVolume] = useState(districtData?.wasteVolume || 200000);
  const [organicPercentage] = useState(districtData?.organicPercentage || 45);
  const [recyclablePercentage] = useState(districtData?.recyclablePercentage || 30);
  const [selectedTechnology, setSelectedTechnology] = useState("gasification");

  useEffect(() => {
    if (districtData) {
      toast({
        title: "District Data Loaded",
        description: `Simulation parameters set for ${districtData.district}`,
      });
    }
  }, []);

  // Technology data with details
  const technologies = [
    {
      id: "gasification",
      name: "Gasification",
      description: "High efficiency, converts waste to syngas",
      efficiency: 80,
      bestFor: "Mixed waste streams",
      energyYield: "600-900 kWh/ton"
    },
    {
      id: "incineration",
      name: "Incineration",
      description: "Proven technology, direct combustion",
      efficiency: 70,
      bestFor: "High calorific waste",
      energyYield: "500-600 kWh/ton"
    },
    {
      id: "anaerobic",
      name: "Anaerobic Digestion",
      description: "Best for organic waste, produces biogas",
      efficiency: 65,
      bestFor: "Organic waste",
      energyYield: "80-140 kWh/ton"
    }
  ];

  // Calculate results based on inputs
  const calculateResults = () => {
    const organicWaste = wasteVolume * (organicPercentage / 100);
    const recyclableWaste = wasteVolume * (recyclablePercentage / 100);
    const residualWaste = wasteVolume - organicWaste - recyclableWaste;
    
    const tech = technologies.find(t => t.id === selectedTechnology);
    const efficiency = tech?.efficiency || 70;
    
    let energyOutput = 0;
    let carbonReduction = 0;
    let operationalCost = 0;
    
    // Different calculations based on technology
    switch (selectedTechnology) {
      case "gasification":
        energyOutput = residualWaste * 0.8 * (efficiency / 100);
        carbonReduction = energyOutput * 0.6;
        operationalCost = energyOutput * 0.4;
        break;
      case "anaerobic":
        energyOutput = organicWaste * 0.5 * (efficiency / 100);
        carbonReduction = energyOutput * 0.7;
        operationalCost = energyOutput * 0.3;
        break;
      case "incineration":
        energyOutput = residualWaste * 0.65 * (efficiency / 100);
        carbonReduction = energyOutput * 0.45;
        operationalCost = energyOutput * 0.35;
        break;
    }
    
    return {
      energyOutput: Math.round(energyOutput),
      carbonReduction: Math.round(carbonReduction),
      operationalCost: Math.round(operationalCost),
      landfillDiversion: Math.round((organicWaste + residualWaste) * (efficiency / 100)),
      revenueEstimate: Math.round(energyOutput * 1.2)
    };
  };
  
  const results = calculateResults();

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
      <div className="space-y-6">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/waste-analysis")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Waste Analysis
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              WtE Simulation - {districtName}
            </h1>
            <Badge variant="outline" className="text-sm">
              {wasteVolume.toLocaleString()} tons/year
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">
            Compare technologies and estimate energy generation potential
          </p>
        </div>

        {/* District Info */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Waste Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{wasteVolume.toLocaleString()} tons/year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Organic Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{organicPercentage}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recyclable Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{recyclablePercentage}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Technology Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Technology</CardTitle>
            <p className="text-sm text-muted-foreground">Choose a waste-to-energy conversion technology</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {technologies.map((tech) => (
                <Card 
                  key={tech.id}
                  className={`cursor-pointer transition-all ${
                    selectedTechnology === tech.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTechnology(tech.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{tech.name}</CardTitle>
                    <Badge variant="secondary">{tech.efficiency}% efficiency</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                    <div className="pt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">Best for: {tech.bestFor}</p>
                      <p className="text-xs text-muted-foreground">Yield: {tech.energyYield}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Simulation Results</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Energy Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{results.energyOutput.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">MWh/year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Carbon Reduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{results.carbonReduction.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">tons CO₂/year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Annual Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${results.revenueEstimate.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">estimated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Landfill Diversion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{results.landfillDiversion.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">tons/year</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Technology Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">Compare performance across different technologies</p>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="energy" fill="hsl(var(--primary))" name="Energy (MWh)" />
                  <Bar dataKey="carbon" fill="hsl(var(--accent))" name="CO₂ Reduction (tons)" />
                  <Bar dataKey="cost" fill="hsl(142 76% 36%)" name="Op. Cost ($/MWh)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ScenarioSimulation;
