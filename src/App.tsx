import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Sale, DateRange } from './types/sales';
import SalesTable from './components/SalesTable';
import DateRangeSelector from './components/DateRangeSelector';
import SalesMetrics from './components/SalesMetrics';
import CommissionLevels from './components/CommissionLevels';
import SalesForm from './components/SalesForm';

function App() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('monthly');
  const [customStartDate, setCustomStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | undefined>();
  
  const activeSales = sales.filter(sale => !sale.isCancelled);
  const cancelledSales = sales.filter(sale => sale.isCancelled);
  
  const totals = activeSales.reduce(
    (acc, sale) => ({
      totalTours: acc.totalTours + (sale.numberOfTours || 0),
      totalVolume: acc.totalVolume + sale.saleAmount,
      totalCommission: acc.totalCommission + sale.commissionAmount,
      activeSales: acc.activeSales + 1,
      cancelledSales: acc.cancelledSales,
      deedSales: acc.deedSales + (sale.saleType === 'DEED' ? 1 : 0),
      trustSales: acc.trustSales + (sale.saleType === 'TRUST' ? 1 : 0),
      netVPG: acc.totalTours > 0 ? acc.totalVolume / acc.totalTours : 0
    }),
    { 
      totalTours: 0, 
      totalVolume: 0, 
      totalCommission: 0,
      activeSales: 0,
      cancelledSales: cancelledSales.length,
      deedSales: 0,
      trustSales: 0,
      netVPG: 0
    }
  );

  const handleAddSale = (saleData: Omit<Sale, 'id'> & { id?: string }) => {
    if (saleData.id) {
      setSales(sales.map(sale => 
        sale.id === saleData.id ? { ...saleData as Sale } : sale
      ));
    } else {
      const newSale: Sale = {
        ...saleData,
        id: Date.now().toString(),
        rank: activeSales.length + 1,
        isCancelled: false,
        netVPG: saleData.saleAmount / (saleData.numberOfTours || 1)
      };
      setSales([...sales, newSale]);
    }
    setIsFormOpen(false);
    setEditingSale(undefined);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setIsFormOpen(true);
  };

  const handleDeleteSale = (id: string) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      setSales(sales.filter(sale => sale.id !== id));
    }
  };

  const handleToggleCancel = (id: string) => {
    setSales(sales.map(sale => 
      sale.id === id ? { ...sale, isCancelled: !sale.isCancelled } : sale
    ));
  };

  const handleEditNote = (id: string) => {
    const sale = sales.find(s => s.id === id);
    if (sale) {
      const newNote = prompt('Enter new note:', sale.notes);
      if (newNote !== null) {
        setSales(sales.map(s => 
          s.id === id ? { ...s, notes: newNote } : s
        ));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Hilton Grand Vacations Sales Performance
            </h1>
            <button 
              onClick={() => {
                setEditingSale(undefined);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Sale
            </button>
          </div>

          <DateRangeSelector
            selectedRange={dateRange}
            onRangeChange={setDateRange}
            customStartDate={customStartDate}
            onCustomStartDateChange={setCustomStartDate}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <SalesMetrics {...totals} />
            </div>
            <div>
              <CommissionLevels currentVolume={totals.totalVolume} />
            </div>
          </div>

          <SalesTable
            sales={sales}
            totals={totals}
            onEditSale={handleEditSale}
            onDeleteSale={handleDeleteSale}
            onEditNote={handleEditNote}
            onToggleCancel={handleToggleCancel}
          />

          <SalesForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingSale(undefined);
            }}
            onSubmit={handleAddSale}
            editingSale={editingSale}
            currentTotalVolume={totals.totalVolume}
          />
        </div>
      </div>
    </div>
  );
}

export default App;