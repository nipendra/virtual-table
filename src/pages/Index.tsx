import React, { useMemo } from 'react';
import { VirtualTable } from '@/components/VirtualTable';
import { generateTableData } from '@/utils/dataGenerator';

const Index = () => {
  // Generate a big table with lots of data for testing
  const { data, columns } = useMemo(() => generateTableData(1500, 50), []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Page header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Virtual Scroll Table with Frozen Columns
          </h1>
          <p className="text-xl text-muted-foreground">
            High-performance table that handles large datasets smoothly
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <span>📊 {data.length.toLocaleString()} rows</span>
            <span>📋 {columns.length} columns</span>
            <span>🔒 First 2 & last 2 columns are frozen</span>
          </div>
        </div>

        {/* The actual table */}
        <VirtualTable 
          data={data} 
          columns={columns} 
          height={700}
          rowHeight={45}
        />

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">⚡ Virtual Scrolling</h3>
            <p className="text-sm text-muted-foreground">
              Only renders what you can see, keeping everything fast
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">🔒 Frozen Columns</h3>
            <p className="text-sm text-muted-foreground">
              Important columns stay visible when you scroll horizontally
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">📱 Responsive</h3>
            <p className="text-sm text-muted-foreground">
              Works great on any screen size and handles window resizing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
