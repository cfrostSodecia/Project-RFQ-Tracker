
import React, { useState } from 'react';
import type { Project, Supplier, Transmission, Receipt } from '../types';
// FIX: Import ProjectIcon to resolve reference error.
import { SupplierIcon, ZipIcon, FolderIcon, ChevronRightIcon, ProjectIcon } from './icons';
import FileListView from './FileListView';

const DataCard: React.FC<{ title: string; children: React.ReactNode; count: number }> = ({ title, children, count }) => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
    <h3 className="font-bold text-lg text-cyan-400 mb-3">{title} ({count})</h3>
    {count > 0 ? (
       <div className="space-y-4">{children}</div>
    ) : (
      <p className="text-gray-500 italic">No items found.</p>
    )}
  </div>
);

const TransmissionItem: React.FC<{ item: Transmission }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-gray-700/40 p-3 rounded-md">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-3">
          <ZipIcon className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="font-semibold text-gray-200">{item.zipName}</p>
            <p className="text-xs text-gray-400">Sent: {new Date(item.sentDate).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <span className="text-xs bg-gray-600 px-2 py-0.5 rounded-full">{item.sourceFiles.length} files</span>
           <ChevronRightIcon className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </div>
      {isOpen && <FileListView files={item.sourceFiles} />}
    </div>
  );
};

const ReceiptItem: React.FC<{ item: Receipt }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="bg-gray-700/40 p-3 rounded-md">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center space-x-3">
            <FolderIcon className="w-5 h-5 text-blue-400" />
            <div>
              <p className="font-semibold text-gray-200 truncate" title={item.folderPath}>{item.folderPath.split('\\').pop()}</p>
              <p className="text-xs text-gray-400">Received: {new Date(item.receivedDate).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-gray-600 px-2 py-0.5 rounded-full">{item.receivedFiles.length} files</span>
            <ChevronRightIcon className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </div>
        </div>
        {isOpen && <FileListView files={item.receivedFiles} />}
      </div>
    );
  };


const SupplierDetails: React.FC<{ supplier: Supplier }> = ({ supplier }) => (
    <div className="mt-4 border-l-2 border-cyan-500 pl-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataCard title="Sent Transmissions" count={supplier.transmissions.length}>
              {supplier.transmissions.map(item => <TransmissionItem key={item.id} item={item} />)}
            </DataCard>
            <DataCard title="Received Submissions" count={supplier.receipts.length}>
                {supplier.receipts.map(item => <ReceiptItem key={item.id} item={item} />)}
            </DataCard>
        </div>
    </div>
);


const ProjectDetailView: React.FC<{ project: Project | null }> = ({ project }) => {
  const [activeSupplierId, setActiveSupplierId] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="flex-grow flex items-center justify-center text-gray-500">
        <div className="text-center">
            <ProjectIcon className="w-16 h-16 mx-auto mb-4 text-gray-600"/>
            <h2 className="text-2xl">Select a project to view details</h2>
            <p>Project information and supplier RFQs will be displayed here.</p>
        </div>
      </div>
    );
  }

  const toggleSupplier = (supplierId: string) => {
    setActiveSupplierId(prevId => (prevId === supplierId ? null : supplierId));
  }

  return (
    <div className="p-6 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-1 text-white">Project <span className="text-cyan-400">{project.projectNumber}</span></h2>
      <p className="text-gray-400 mb-6">Found {project.suppliers.length} supplier(s) with RFQ activity.</p>
      
      <div className="space-y-4">
        {project.suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-700/50 transition-colors"
              onClick={() => toggleSupplier(supplier.id)}
            >
              <div className="flex items-center space-x-3">
                <SupplierIcon className="w-6 h-6 text-gray-400" />
                <span className="text-xl font-medium">{supplier.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-yellow-400 bg-yellow-900/50 px-2 py-1 rounded">Sent: {supplier.transmissions.length}</span>
                <span className="text-sm text-blue-400 bg-blue-900/50 px-2 py-1 rounded">Received: {supplier.receipts.length}</span>
                <ChevronRightIcon className={`w-6 h-6 transform transition-transform ${activeSupplierId === supplier.id ? 'rotate-90' : ''}`} />
              </div>
            </div>
            {activeSupplierId === supplier.id && <SupplierDetails supplier={supplier} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetailView;
