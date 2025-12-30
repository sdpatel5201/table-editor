import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTaxes, fetchCountries, Tax } from "@/lib/api";
import { TaxTable } from "@/components/tax-table";
import { EditTaxModal } from "@/components/edit-tax-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Dashboard() {
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch Taxes
  const { 
    data: taxes = [], 
    isLoading: isLoadingTaxes, 
    isError: isErrorTaxes,
    error: errorTaxes 
  } = useQuery({
    queryKey: ["taxes"],
    queryFn: fetchTaxes,
  });

  // Fetch Countries
  const { 
    data: countries = [],
    isLoading: isLoadingCountries
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const handleEdit = (tax: Tax) => {
    setSelectedTax(tax);
    setIsEditModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setTimeout(() => setSelectedTax(null), 300); // Clear after animation
    }
  };

  if (isLoadingTaxes || isLoadingCountries) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (isErrorTaxes) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load tax data. {(errorTaxes as Error).message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tax Management</h1>
          <p className="text-muted-foreground">
            Manage global tax configurations and country assignments.
          </p>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Tax Records</CardTitle>
            <CardDescription>
              A list of all tax configurations available in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaxTable data={taxes} onEdit={handleEdit} />
          </CardContent>
        </Card>

        <EditTaxModal 
          tax={selectedTax} 
          open={isEditModalOpen} 
          onOpenChange={handleModalOpenChange}
          countries={countries}
        />
      </div>
    </div>
  );
}
