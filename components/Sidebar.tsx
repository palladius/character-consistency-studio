
import React, { useState } from 'react';
import { Character } from '../types';
import { ICONS } from '../constants';
import metadata from '../metadata.json';

interface SidebarProps {
  characters: Character[];
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
  onAddCharacter: (name: string) => void;
  onDeleteCharacter: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ characters, selectedCharacterId, onSelectCharacter, onAddCharacter, onDeleteCharacter }) => {
  const [newCharName, setNewCharName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCharacter = () => {
    if (newCharName.trim()) {
      onAddCharacter(newCharName.trim());
      setNewCharName('');
      setIsAdding(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleAddCharacter();
    } else if (e.key === 'Escape') {
        setIsAdding(false);
        setNewCharName('');
    }
  };

  return (
    <aside className="w-full md:w-80 bg-slate-900/70 backdrop-blur-sm border-r border-slate-800 flex flex-col p-4 h-screen overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        {ICONS.sparkles}
        <h1 className="text-2xl font-bold text-white">Character Studio</h1>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">{ICONS.users} Characters</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
        >
          {ICONS.add}
        </button>
      </div>
      
      {isAdding && (
        <div className="mb-4">
          <input
            type="text"
            value={newCharName}
            onChange={(e) => setNewCharName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New character name..."
            autoFocus
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleAddCharacter} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded-md transition-colors text-sm">Save</button>
            <button onClick={() => setIsAdding(false)} className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-1 px-2 rounded-md transition-colors text-sm">Cancel</button>
          </div>
        </div>
      )}

      <nav className="flex-grow">
        <ul>
          {characters.map(char => (
            <li key={char.id} className="group">
              <div
                onClick={() => onSelectCharacter(char.id)}
                className={`flex justify-between items-center p-3 rounded-md cursor-pointer transition-colors mb-1 ${
                  selectedCharacterId === char.id ? 'bg-purple-600/30 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>{char.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm(`Are you sure you want to delete ${char.name}?`)) {
                        onDeleteCharacter(char.id);
                    }
                  }}
                  className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-4 h-4">{ICONS.trash}</div>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-auto text-center text-xs text-slate-500 pt-4">
        <p>Version {metadata.version}</p>
      </footer>
    </aside>
  );
};

export default Sidebar;
