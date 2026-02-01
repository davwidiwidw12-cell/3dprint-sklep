import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { updateSettings } from "@/lib/admin-actions";

export default async function SettingsPage() {
  const settings = await prisma.settings.findFirst() || {
      shippingCost: 10.99,
      freeShippingThreshold: 200.00
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ustawienia Sklepu</h1>
        <p className="text-gray-500 mt-1">Konfiguracja kosztów dostawy i innych parametrów.</p>
      </div>

      <div className="max-w-2xl">
          <Card>
              <CardHeader><CardTitle>Dostawa</CardTitle></CardHeader>
              <CardContent>
                  <form action={async (formData) => {
                      "use server";
                      const cost = parseFloat(formData.get("shippingCost") as string);
                      const threshold = parseFloat(formData.get("freeThreshold") as string);
                      await updateSettings(cost, threshold);
                  }} className="space-y-4">
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Koszt wysyłki (PLN)</label>
                          <Input 
                              name="shippingCost" 
                              type="number" 
                              step="0.01" 
                              defaultValue={Number(settings.shippingCost)} 
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Próg darmowej dostawy (PLN)</label>
                          <Input 
                              name="freeThreshold" 
                              type="number" 
                              step="0.01" 
                              defaultValue={Number(settings.freeShippingThreshold)} 
                          />
                      </div>
                      
                      <Button type="submit">Zapisz Zmiany</Button>
                  </form>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
