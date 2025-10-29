
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

const SiteSuggestions = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Site Suggestions</h1>
          <p className="text-muted-foreground mt-2">
            Explore optimal locations for waste-to-energy facilities based on multiple factors
          </p>
        </div>

        <div className="rounded-lg border h-[400px] bg-card flex items-center justify-center">
          <p className="text-muted-foreground">Interactive GIS map will be displayed here</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Site A - Barangay Carmen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-medium">87/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance to Waste Sources:</span>
                  <span className="font-medium">3.2 km</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Acceptance:</span>
                  <span className="font-medium">High</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site B - Barangay Lumbia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-medium">79/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance to Waste Sources:</span>
                  <span className="font-medium">5.7 km</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Acceptance:</span>
                  <span className="font-medium">Medium</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site C - Barangay Cugman</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-medium">82/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance to Waste Sources:</span>
                  <span className="font-medium">4.1 km</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Acceptance:</span>
                  <span className="font-medium">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SiteSuggestions;
