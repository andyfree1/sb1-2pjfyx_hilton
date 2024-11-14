import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Sale } from '../types/sales';
import { calculateTotalCommission } from '../types/sales';

interface SalesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sale: Omit<Sale, 'id'> & { id?: string }) => void;
  editingSale?: Sale;
  currentTotalVolume: number;
}

interface FormData {
  date: string;
  clientLastName: string;
  leadNumber: string;
  numberOfTours: number;
  managerName: string;
  saleAmount: string;
  commissionPercentage: string;
  commissionAmount: string;
  fdi: string;
  notes: string;
  saleType: 'DEED' | 'TRUST';
  isCancelled: boolean;
}

const initialFormData: FormData = {
  date: new Date().toISOString().split('T')[0],
  clientLastName: '',
  leadNumber: '',
  numberOfTours: 1,
  managerName: '',
  saleAmount: '',
  commissionPercentage: '',
  commissionAmount: '',
  fdi: '',
  notes: '',
  saleType: 'DEED',
  isCancelled: false
};

export default function SalesForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingSale,
  currentTotalVolume 
}: SalesFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (editingSale) {
      setFormData({
        date: editingSale.date,
        clientLastName: editingSale.clientLastName,
        leadNumber: editingSale.leadNumber,
        numberOfTours: editingSale.numberOfTours,
        managerName: editingSale.managerName,
        saleAmount: editingSale.saleAmount.toString(),
        commissionPercentage: editingSale.commissionPercentage.toString(),
        commissionAmount: editingSale.commissionAmount.toString(),
        fdi: editingSale.fdi,
        notes: editingSale.notes,
        saleType: editingSale.saleType,
        isCancelled: editingSale.isCancelled
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingSale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saleAmount = parseFloat(formData.saleAmount) || 0;
    const totalCommissionPercentage = calculateTotalCommission(saleAmount, currentTotalVolume, formData.saleType);
    const commissionAmount = saleAmount * (totalCommissionPercentage / 100);
    
    onSubmit({
      ...(editingSale?.id ? { id: editingSale.id } : {}),
      ...formData,
      saleAmount,
      numberOfTours: Number(formData.numberOfTours),
      commissionPercentage: totalCommissionPercentage,
      commissionAmount,
      netVPG: saleAmount / Number(formData.numberOfTours)
    });
    
    setFormData(initialFormData);
    onClose();
  };

  const handleSaleAmountChange = (amount: string) => {
    const saleAmount = parseFloat(amount) || 0;
    const totalCommissionPercentage = calculateTotalCommission(saleAmount, currentTotalVolume, formData.saleType);
    const commissionAmount = saleAmount * (totalCommissionPercentage / 100);

    setFormData({
      ...formData,
      saleAmount: amount,
      commissionPercentage: totalCommissionPercentage.toString(),
      commissionAmount: commissionAmount.toString()
    });
  };

  const handleSaleTypeChange = (saleType: 'DEED' | 'TRUST') => {
    const saleAmount = parseFloat(formData.saleAmount) || 0;
    const totalCommissionPercentage = calculateTotalCommission(saleAmount, currentTotalVolume, saleType);
    const commissionAmount = saleAmount * (totalCommissionPercentage / 100);

    setFormData({
      ...formData,
      saleType,
      commissionPercentage: totalCommissionPercentage.toString(),
      commissionAmount: commissionAmount.toString()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{editingSale ? 'Edit Sale' : 'Add New Sale'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Client Last Name</label>
              <input
                type="text"
                required
                value={formData.clientLastName}
                onChange={(e) => setFormData({ ...formData, clientLastName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Lead Number</label>
              <input
                type="text"
                required
                value={formData.leadNumber}
                onChange={(e) => setFormData({ ...formData, leadNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Tours</label>
              <input
                type="number"
                required
                min="1"
                value={formData.numberOfTours}
                onChange={(e) => setFormData({ ...formData, numberOfTours: parseInt(e.target.value) || 1 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Manager Name</label>
              <input
                type="text"
                required
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Amount</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.saleAmount}
                onChange={(e) => handleSaleAmountChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Commission %</label>
              <input
                type="text"
                readOnly
                value={formData.commissionPercentage}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Commission Amount</label>
              <input
                type="text"
                readOnly
                value={formData.commissionAmount}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">FDI</label>
              <input
                type="text"
                value={formData.fdi}
                onChange={(e) => setFormData({ ...formData, fdi: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Type</label>
              <select
                value={formData.saleType}
                onChange={(e) => handleSaleTypeChange(e.target.value as 'DEED' | 'TRUST')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="DEED">DEED</option>
                <option value="TRUST">TRUST</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingSale ? 'Update' : 'Add'} Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}