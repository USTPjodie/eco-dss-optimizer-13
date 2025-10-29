import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { LeafletMap } from "@/components/map/LeafletMap";
import { useWteSites } from "@/hooks/useWteSites";
import { Badge } from "@/components/ui/badge";

const SiteSuggestions = () => {
  const { sites, isLoading } = useWteSites();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      operational: "default",
      "under-construction": "secondary",
      planned: "outline",
      "under-maintenance": "destructive",
    };
    return colors[status] || "outline";
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Site Suggestions</h1>
            <p className="text-muted-foreground mt-2">
              Explore optimal locations for waste-to-energy facilities
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Site
          </Button>
        </div>

        <div className="rounded-lg border h-[500px] overflow-hidden">
          {sites && sites.length > 0 ? (
            <LeafletMap
              sites={sites}
              center={[sites[0].latitude, sites[0].longitude]}
              zoom={10}
              onSiteClick={(site) => setSelectedSite(site.id)}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <p className="text-muted-foreground">No sites available. Add your first site to get started.</p>
            </div>
          )}
        </div>

        {sites && sites.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <Card 
                key={site.id}
                className={selectedSite === site.id ? "ring-2 ring-primary" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <Badge variant={getStatusColor(site.status) as any}>
                      {site.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{site.location_name}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Technology:</span>
                      <span className="font-medium">{site.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium">{site.capacity} MW</span>
                    </div>
                    {site.environmental_score && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Environmental Score:</span>
                        <span className="font-medium">{site.environmental_score}/100</span>
                      </div>
                    )}
                    {site.economic_score && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Economic Score:</span>
                        <span className="font-medium">{site.economic_score}/100</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Coordinates:</span>
                      <span className="font-medium text-xs">
                        {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SiteSuggestions;
