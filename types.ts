
export interface FileRecord {
  name: string;
  path: string;
}

export interface Transmission {
  id: string;
  zipName: string;
  zipPath: string;
  sentDate: string; // ISO 8601 string
  sourceFiles: FileRecord[];
}

export interface Receipt {
  id: string;
  folderPath: string;
  receivedDate: string; // ISO 8601 string
  receivedFiles: FileRecord[];
}

export interface Supplier {
  id: string;
  name: string;
  transmissions: Transmission[];
  receipts: Receipt[];
}

export interface Project {
  id: string;
  projectNumber: string;
  suppliers: Supplier[];
}
