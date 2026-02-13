// app/dashboard/finances/page.tsx
import { FinancialReport } from '@/components/dashboard/FinancialReport';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function FinancesPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">💰 Финансовый отчёт</h1>
          <p className="text-muted-foreground">
            Обзор доходов, оплат и статистики по ученикам.
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Экспорт в Excel
        </Button>
      </div>
      <FinancialReport />
    </div>
  );
}
