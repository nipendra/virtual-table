import React, { useState, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { TableColumn, TableRowData } from '@/utils/dataGenerator';
import TableRowComponent from './TableRow';

interface VirtualTableProps {
  data: TableRowData[];
  columns: TableColumn[];
  height?: number;
  rowHeight?: number;
}

const VirtualTable: React.FC<VirtualTableProps> = ({
  data,
  columns,
  height = 600,
  rowHeight = 40
}) => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const middleScrollRef = useRef<HTMLDivElement>(null);

  // Split columns into three sections: left frozen, middle scrollable, right frozen
  const leftColumns = columns.slice(0, 2);
  const rightColumns = columns.slice(-2);
  const middleColumns = columns.slice(2, -2);

  const leftWidth = leftColumns.reduce((sum, col) => sum + col.width, 0);
  const rightWidth = rightColumns.reduce((sum, col) => sum + col.width, 0);
  const middleWidth = middleColumns.reduce((sum, col) => sum + col.width, 0);

  // Handle window resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Sync scroll between header and body
  const handleHeaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollLeft = e.currentTarget.scrollLeft;
    setScrollLeft(newScrollLeft);
    if (middleScrollRef.current) {
      middleScrollRef.current.scrollLeft = newScrollLeft;
    }
  };

  const handleMiddleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollLeft = e.currentTarget.scrollLeft;
    setScrollLeft(newScrollLeft);
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = newScrollLeft;
    }
  };

  const itemData = {
    rows: data,
    leftColumns,
    middleColumns,
    rightColumns,
    leftWidth,
    rightWidth,
    middleWidth,
    scrollLeft
  };

  const availableMiddleWidth = Math.max(0, containerWidth - leftWidth - rightWidth);

  return (
    <div className="w-full bg-background border border-table-border rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex sticky top-0 z-30 bg-table-header border-b border-table-border">
        {/* Left frozen header */}
        <div className="flex bg-table-header z-40" style={{ width: leftWidth }}>
          {leftColumns.map((col) => (
            <div
              key={col.key}
              className="flex text-black items-center px-3 py-2 text-sm font-semibold text-table-header-foreground border-r border-table-border bg-table-frozen border-l-2 border-l-table-frozen-border"
              style={{ width: col.width, minWidth: col.width }}
              title={col.label}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Scrollable header */}
        <div
          ref={headerScrollRef}
          className="overflow-x-auto scrollbar-thin"
          style={{ width: Math.min(middleWidth, availableMiddleWidth) }}
          onScroll={handleHeaderScroll}
        >
          <div className="flex" style={{ width: middleWidth }}>
            {middleColumns.map((col) => (
              <div
                key={col.key}
                className="flex items-center px-3 py-2 text-sm font-semibold text-table-header-foreground border-r border-table-border bg-table-header"
                style={{ width: col.width, minWidth: col.width }}
                title={col.label}
              >
                {col.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right frozen header */}
        <div className="flex bg-table-header z-40" style={{ width: rightWidth }}>
          {rightColumns.map((col) => (
            <div
              key={col.key}
              className="flex text-black items-center px-3 py-2 text-sm font-semibold text-table-header-foreground border-r border-table-border bg-table-frozen border-l-2 border-l-table-frozen-border"
              style={{ width: col.width, minWidth: col.width }}
              title={col.label}
            >
              {col.label}
            </div>
          ))}
        </div>
      </div>

      {/* Body with single virtual list */}
      <div 
        ref={containerRef}
        className="relative"
        style={{ height }}
      >
        {/* Virtual list for all rows */}
        <List
          height={height}
          itemCount={data.length}
          itemSize={rowHeight}
          itemData={itemData}
          width={containerWidth || 1200}
          className="scrollbar-thin"
        >
          {TableRowComponent}
        </List>
        
        {/* Horizontal scrollbar for middle columns */}
        <div
          ref={middleScrollRef}
          className="absolute top-0 overflow-x-auto scrollbar-thin"
          style={{
            pointerEvents: 'auto',
            left: leftWidth,
            width: availableMiddleWidth || (containerWidth - leftWidth - rightWidth),
            height: height,
            zIndex: 5,
          }}
          onScroll={handleMiddleScroll}
        >
          <div style={{ width: middleWidth, height: 1 , pointerEvents: 'auto',}} />
        </div>
      </div>

      {/* Footer info */}
      <div className="bg-muted px-4 py-2 text-sm text-muted-foreground border-t border-table-border flex justify-between items-center">
        <span>
          {data.length.toLocaleString()} rows × {columns.length} columns
        </span>
        <span className="text-xs">
          Frozen: {leftColumns.length} left + {rightColumns.length} right
        </span>
      </div>
    </div>
  );
};

export default VirtualTable;

const CustomOuter = React.forwardRef<HTMLDivElement, any>((props, ref) => (
  <div {...props} ref={ref} style={{ ...props.style, overflowX: 'hidden' }} />
));