
import React from 'react';
import type { FileRecord } from '../types';
import { FileIcon } from './icons';

interface FileListViewProps {
  files: FileRecord[];
}

const FileListView: React.FC<FileListViewProps> = ({ files }) => {
  return (
    <div className="mt-2 space-y-1 text-sm text-gray-400">
      {files.map((file) => (
        <div key={file.path} className="flex items-center space-x-2 pl-4 py-1 rounded hover:bg-gray-700/50 transition-colors">
          <FileIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="truncate" title={file.path}>{file.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FileListView;
