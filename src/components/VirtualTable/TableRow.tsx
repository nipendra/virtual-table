import React from 'react';
import { TableColumn, TableRowData } from '@/utils/dataGenerator';

interface TableRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    rows: TableRowData[];
    leftColumns: TableColumn[];
    middleColumns: TableColumn[];
    rightColumns: TableColumn[];
    leftWidth: number;
    rightWidth: number;
    middleWidth: number;
    scrollLeft: number;
  };
}

const TableRow: React.FC<TableRowProps> = ({ 
  index, 
  style, 
  data: { rows, leftColumns, middleColumns, rightColumns, leftWidth, rightWidth, middleWidth, scrollLeft } 
}) => {
  const row = rows[index];
  const isEven = index % 2 === 0;

  const cellClass = `flex items-center px-3 py-2 text-sm border-r border-table-border overflow-hidden text-ellipsis whitespace-nowrap ${
    isEven ? 'bg-table-row-even' : 'bg-table-row-odd'
  } hover:bg-table-hover transition-colors`;

  const frozenCellClass = `${cellClass} bg-table-frozen border-l-2 border-l-table-frozen-border`;

  return (
    <div style={style} className="flex">
      {/* Left frozen columns */}
      <div 
        className="flex bg-table-frozen border-r-2 border-table-frozen-border z-20"
        style={{ width: leftWidth }}
      >
        {leftColumns.map((col) => (
          <div
            key={col.key}
            className={frozenCellClass}
            style={{ width: col.width, minWidth: col.width }}
            title={String(row[col.key])}
          >
            {row[col.key]}
          </div>
        ))}
      </div>

      {/* Scrollable middle columns */}
      <div 
        className="flex overflow-hidden"
        style={{ 
          width: `calc(100% - ${leftWidth + rightWidth}px)`,
          marginLeft: 0,
          marginRight: 0
        }}
      >
        <div
          className="flex"
          style={{ 
            transform: `translateX(-${scrollLeft}px)`,
            minWidth: middleWidth
          }}
        >
          {middleColumns.map((col) => (
            <div
              key={col.key}
              className={cellClass}
              style={{ width: col.width, minWidth: col.width }}
              title={String(row[col.key])}
            >
              {row[col.key]}
            </div>
          ))}
        </div>
      </div>

      {/* Right frozen columns */}
      <div 
        className="flex bg-table-frozen border-l-2 border-table-frozen-border z-20"
        style={{ width: rightWidth }}
      >
        {rightColumns.map((col) => (
          <div
            key={col.key}
            className={frozenCellClass}
            style={{ width: col.width, minWidth: col.width }}
            title={String(row[col.key])}
          >
            {row[col.key]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableRow;