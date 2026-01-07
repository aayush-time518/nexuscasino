'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ExportOptionsProps {
  onExport: (format: 'pdf' | 'csv') => void;
}

const ExportOptions = ({ onExport }: ExportOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-black font-medium rounded-lg transition-smooth shadow-warm-md hover:shadow-warm-lg"
      >
        <Icon name="ArrowDownTrayIcon" size={20} />
        <span>Export</span>
        <Icon name="ChevronDownIcon" size={16} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-warm-lg border border-border overflow-hidden z-20">
            <button
              onClick={() => {
                onExport('pdf');
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-smooth flex items-center gap-3 text-text-primary"
            >
              <Icon
                name="DocumentTextIcon"
                size={20}
                className="text-primary"
              />
              <div>
                <div className="font-medium">Export as PDF</div>
                <div className="text-xs text-text-secondary">
                  Formatted statement
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                onExport('csv');
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-smooth flex items-center gap-3 text-text-primary border-t border-border"
            >
              <Icon name="TableCellsIcon" size={20} className="text-primary" />
              <div>
                <div className="font-medium">Export as CSV</div>
                <div className="text-xs text-text-secondary">
                  For spreadsheets
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportOptions;
