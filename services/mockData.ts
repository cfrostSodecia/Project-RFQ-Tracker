
import type { Project, Supplier, Transmission, Receipt, FileRecord } from '../types';

const MOCK_SUPPLIERS = [
  'AeroStruct Dynamics', 'Quantum Components Inc.', 'Titanium Forgeworks', 
  'Precision Machining Co.', 'Composite Creations', 'Stellar Systems Ltd.'
];
const MOCK_FILE_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.dwg', '.step', '.iges'];
const MOCK_FILE_PREFIXES = ['Drawing_', 'Spec_', 'Model_', 'BOM_', 'Analysis_'];

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElement = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const generateRandomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const generateFiles = (count: number, basePath: string): FileRecord[] => {
  const files: FileRecord[] = [];
  for (let i = 0; i < count; i++) {
    const prefix = getRandomElement(MOCK_FILE_PREFIXES);
    const ext = getRandomElement(MOCK_FILE_EXTENSIONS);
    const fileName = `${prefix}${1000 + i}${ext}`;
    files.push({
      name: fileName,
      path: `${basePath}\\${fileName}`,
    });
  }
  return files;
};

const generateTransmissions = (projectNumber: string, supplierName: string): Transmission[] => {
  const transmissions: Transmission[] = [];
  const count = getRandomInt(1, 4);
  const supplierPathName = supplierName.replace(/\s/g, '_');
  
  for (let i = 0; i < count; i++) {
    const date = generateRandomDate(new Date(2023, 0, 1), new Date());
    const dateStr = date.split('T')[0];
    const zipName = `RFQ_${projectNumber}_${supplierPathName}_${dateStr}_v${i+1}.zip`;
    const basePath = `S:\\SADNA\\SGTAC\\Projects\\${projectNumber}\\RFQ\\${supplierPathName}\\Sent`;
    const sourceFolderName = zipName.replace('.zip', '');
    
    transmissions.push({
      id: `trans-${projectNumber}-${supplierPathName}-${i}`,
      zipName,
      zipPath: `${basePath}\\${zipName}`,
      sentDate: date,
      sourceFiles: generateFiles(getRandomInt(5, 20), `${basePath}\\${sourceFolderName}`),
    });
  }
  return transmissions;
};

const generateReceipts = (projectNumber: string, supplierName: string): Receipt[] => {
  const receipts: Receipt[] = [];
  const count = getRandomInt(0, 3);
  const supplierPathName = supplierName.replace(/\s/g, '_');

  for (let i = 0; i < count; i++) {
    const date = generateRandomDate(new Date(2023, 0, 1), new Date());
    const dateStr = date.split('T')[0].replace(/-/g, '');
    const folderName = `SUBMISSION_${supplierPathName}_${dateStr}`;
    const basePath = `S:\\SADNA\\SGTAC\\Projects\\${projectNumber}\\RFQ\\${supplierPathName}\\Received`;
    
    receipts.push({
      id: `receipt-${projectNumber}-${supplierPathName}-${i}`,
      folderPath: `${basePath}\\${folderName}`,
      receivedDate: date,
      receivedFiles: generateFiles(getRandomInt(3, 10), `${basePath}\\${folderName}`),
    });
  }
  return receipts;
};

const generateSuppliers = (projectNumber: string): Supplier[] => {
  const suppliers: Supplier[] = [];
  const numSuppliers = getRandomInt(2, 5);
  const usedSuppliers = new Set<string>();

  while (suppliers.length < numSuppliers) {
    const name = getRandomElement(MOCK_SUPPLIERS);
    if (!usedSuppliers.has(name)) {
      usedSuppliers.add(name);
      const supplierPathName = name.replace(/\s/g, '_');
      suppliers.push({
        id: `sup-${projectNumber}-${supplierPathName}`,
        name,
        transmissions: generateTransmissions(projectNumber, name),
        receipts: generateReceipts(projectNumber, name),
      });
    }
  }
  return suppliers;
};

export const generateMockProjects = (): Project[] => {
  const projects: Project[] = [];
  const projectNumbers = ['800123', '800456', '800789', '901101', '902202'];

  for (const projNum of projectNumbers) {
    projects.push({
      id: `proj-${projNum}`,
      projectNumber: projNum,
      suppliers: generateSuppliers(projNum),
    });
  }
  return projects;
};
