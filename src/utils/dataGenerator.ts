export interface TableRowData {
  id: string;
  [key: string]: string | number;
}

export interface TableColumn {
  key: string;
  label: string;
  width: number;
}

// Simple arrays for generating realistic data
const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor'];
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];
const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Toronto', 'Berlin'];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateTableData(totalRows: number = 1000, totalColumns: number = 50): {
  data: TableRowData[];
  columns: TableColumn[];
} {
  // Create column definitions
  const columns: TableColumn[] = [
    // First 2 columns (frozen on left)
    { key: 'id', label: 'ID', width: 120 },
    { key: 'name', label: 'Name', width: 180 },
    
    // Middle columns (scrollable)
    ...Array.from({ length: totalColumns - 4 }, (_, i) => ({
      key: `column_${i + 3}`,
      label: `Column ${i + 3}`,
      width: 120
    })),
    
    // Last 2 columns (frozen on right)
    { key: 'status', label: 'Status', width: 100 },
    { key: 'total', label: 'Total', width: 120 }
  ];

  // Generate row data
  const data: TableRowData[] = [];
  
  for (let i = 0; i < totalRows; i++) {
    const row: TableRowData = {
      id: `ROW${String(i + 1).padStart(4, '0')}`,
      name: getRandomItem(names),
      status: getRandomItem(statuses),
      total: generateRandomNumber(1000, 99999)
    };
    
    // Fill middle columns with various data types
    for (let j = 2; j < totalColumns - 2; j++) {
      const columnKey = `column_${j + 1}`;
      
      // Mix different data types for variety
      if (j % 4 === 0) {
        row[columnKey] = getRandomItem(departments);
      } else if (j % 3 === 0) {
        row[columnKey] = getRandomItem(cities);
      } else {
        row[columnKey] = generateRandomNumber(100, 9999);
      }
    }
    
    data.push(row);
  }

  return { data, columns };
}