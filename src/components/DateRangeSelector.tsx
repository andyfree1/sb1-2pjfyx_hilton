import React from 'react';
import { Calendar } from 'lucide-react';
import type { DateRange } from '../types/sales';

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  customStartDate: string;
  onCustomStartDateChange: (date: string) => void;
}

export default function DateRangeSelector({
  selectedRange,
  onRangeChange,
  customStartDate,
  onCustomStartDateChange,
}: DateRangeSelectorProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-500" />
        <select
          value={selectedRange}
          onChange={(e) => onRangeChange(e.target.value as DateRange)}
          className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="monthly">Monthly</option>
          <option value="45day">45 Day Rolling</option>
          <option value="90day">90 Day Rolling</option>
        </select>
      </div>
      
      {(selectedRange === '45day' || selectedRange === '90day') && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Start Date:</span>
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => onCustomStartDateChange(e.target.value)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}
    </div>
  );
}