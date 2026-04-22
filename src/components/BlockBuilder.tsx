import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, ImageIcon, GripVertical } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export interface Block {
  id: string;
  type: 'hero' | 'profile-tabs' | 'activity-slider' | 'dynamic-post-feed' | 'rich-text';
  data: any;
}

interface BlockBuilderProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  onOpenMediaPicker: (blockId: string, field: string, index?: number, subIndex?: number) => void;
}

const BLOCK_TYPES = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'profile-tabs', label: 'Profile Tabs' },
  { id: 'activity-slider', label: 'Activity Slider' },
  { id: 'dynamic-post-feed', label: 'Dynamic Post Feed' },
  { id: 'rich-text', label: 'Rich Text' }
];

export function BlockBuilder({ blocks, onChange, onOpenMediaPicker }: BlockBuilderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      type,
      data: {}
    };

    // Initialize default data structures
    if (type === 'hero') {
      newBlock.data = { headline: '', sub_headline: '', background_image: '', stats: [] };
    } else if (type === 'profile-tabs') {
      newBlock.data = { title: '', tabs: [] };
    } else if (type === 'activity-slider') {
      newBlock.data = { title: '', activities: [] };
    } else if (type === 'dynamic-post-feed') {
      newBlock.data = { category: '', limit: 3 };
    } else if (type === 'rich-text') {
      newBlock.data = { content: '' };
    }

    onChange([...(blocks || []), newBlock]);
    setShowMenu(false);
  };

  const updateBlockData = (id: string, field: string, value: any) => {
    const newBlocks = blocks.map(b => {
      if (b.id === id) {
        return { ...b, data: { ...b.data, [field]: value === '' ? null : value } };
      }
      return b;
    });
    onChange(newBlocks);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    onChange(newBlocks);
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const renderBlockEditor = (block: Block, index: number) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Headline</label>
              <input type="text" value={block.data.headline || ''} onChange={(e) => updateBlockData(block.id, 'headline', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Sub-headline</label>
              <input type="text" value={block.data.sub_headline || ''} onChange={(e) => updateBlockData(block.id, 'sub_headline', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Background Image</label>
              <div className="flex gap-2">
                <input type="text" readOnly value={block.data.background_image || ''} placeholder="Select image..." className="flex-1 px-3 py-2 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-lg text-xs" />
                <button type="button" onClick={() => onOpenMediaPicker(block.id, 'background_image')} className="p-2 bg-amber-400 text-zinc-900 rounded-lg hover:bg-amber-500">
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stats List</label>
                <button type="button" onClick={() => {
                  const stats = block.data.stats || [];
                  updateBlockData(block.id, 'stats', [...stats, { label: '', value: '' }]);
                }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Stat</button>
              </div>
              {(block.data.stats || []).map((stat: any, i: number) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input type="text" placeholder="Value (e.g. 100+)" value={stat.value || ''} onChange={(e) => {
                    const stats = [...block.data.stats];
                    stats[i].value = e.target.value || null;
                    updateBlockData(block.id, 'stats', stats);
                  }} className="w-1/3 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs" />
                  <input type="text" placeholder="Label (e.g. Clients)" value={stat.label || ''} onChange={(e) => {
                    const stats = [...block.data.stats];
                    stats[i].label = e.target.value || null;
                    updateBlockData(block.id, 'stats', stats);
                  }} className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs" />
                  <button type="button" onClick={() => {
                    const stats = block.data.stats.filter((_: any, idx: number) => idx !== i);
                    updateBlockData(block.id, 'stats', stats);
                  }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile-tabs':
        return (
          <div className="space-y-4">
            <div>
               <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Title</label>
               <input type="text" value={block.data.title || ''} onChange={(e) => updateBlockData(block.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tabs</label>
                <button type="button" onClick={() => {
                  const tabs = block.data.tabs || [];
                  updateBlockData(block.id, 'tabs', [...tabs, { label: '', content: '' }]);
                }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Tab</button>
              </div>
              {(block.data.tabs || []).map((tab: any, i: number) => (
                <div key={i} className="mb-4 p-3 border border-zinc-100 rounded-xl bg-zinc-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <input type="text" placeholder="Tab Label" value={tab.label || ''} onChange={(e) => {
                      const tabs = [...block.data.tabs];
                      tabs[i].label = e.target.value || null;
                      updateBlockData(block.id, 'tabs', tabs);
                    }} className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold" />
                    <button type="button" onClick={() => {
                      const tabs = block.data.tabs.filter((_: any, idx: number) => idx !== i);
                      updateBlockData(block.id, 'tabs', tabs);
                    }} className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <RichTextEditor value={tab.content || ''} onChange={(val) => {
                      const tabs = [...block.data.tabs];
                      tabs[i].content = val || null;
                      updateBlockData(block.id, 'tabs', tabs);
                  }} placeholder="Tab content..." />
                </div>
              ))}
            </div>
          </div>
        );

      case 'activity-slider':
        return (
          <div className="space-y-4">
             <div>
               <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Title</label>
               <input type="text" value={block.data.title || ''} onChange={(e) => updateBlockData(block.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Activity Cards</label>
                <button type="button" onClick={() => {
                  const activities = block.data.activities || [];
                  updateBlockData(block.id, 'activities', [...activities, { title: '', image: '', description: '' }]);
                }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Card</button>
              </div>
              {(block.data.activities || []).map((card: any, i: number) => (
                <div key={i} className="mb-4 p-3 border border-zinc-100 rounded-xl bg-zinc-50/50 space-y-3 relative">
                  <button type="button" onClick={() => {
                      const acts = block.data.activities.filter((_: any, idx: number) => idx !== i);
                      updateBlockData(block.id, 'activities', acts);
                    }} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 hover:bg-red-200 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                  
                  <input type="text" placeholder="Card Title" value={card.title || ''} onChange={(e) => {
                      const acts = [...block.data.activities];
                      acts[i].title = e.target.value || null;
                      updateBlockData(block.id, 'activities', acts);
                  }} className="w-full pr-10 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold" />
                  
                  <div className="flex gap-2">
                    <input type="text" readOnly value={card.image || ''} placeholder="Image URL" className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                    <button type="button" onClick={() => onOpenMediaPicker(block.id, 'activities', i, 0)} className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-xs font-bold flex items-center gap-1">
                      <ImageIcon className="w-3 h-3"/> Choose
                    </button>
                  </div>
                  
                  <textarea placeholder="Description" rows={3} value={card.description || ''} onChange={(e) => {
                      const acts = [...block.data.activities];
                      acts[i].description = e.target.value || null;
                      updateBlockData(block.id, 'activities', acts);
                  }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs outline-none focus:border-amber-400" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'dynamic-post-feed':
        return (
          <div className="space-y-4">
             <div>
               <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Category Filter</label>
               <input type="text" placeholder="e.g. News, Updates (Empty for all)" value={block.data.category || ''} onChange={(e) => updateBlockData(block.id, 'category', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400 text-sm" />
            </div>
            <div>
               <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Limit (Number of posts)</label>
               <input type="number" min="1" max="20" value={block.data.limit || 3} onChange={(e) => updateBlockData(block.id, 'limit', parseInt(e.target.value) || 3)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400 text-sm" />
            </div>
          </div>
        );

      case 'rich-text':
        return (
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Content</label>
            <RichTextEditor value={block.data.content || ''} onChange={(val) => updateBlockData(block.id, 'content', val || null)} />
          </div>
        );

      default: return <div>Unknown block type: {block.type}</div>;
    }
  };

  const getBlockLabel = (type: string) => BLOCK_TYPES.find(b => b.id === type)?.label || type;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {(blocks || []).map((block, index) => (
          <div key={block.id} className="border border-zinc-200 rounded-2xl bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            {/* Block Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg border border-zinc-200 cursor-move text-zinc-400">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-800">{getBlockLabel(block.type)}</span>
                  <span className="text-[10px] text-zinc-400 ml-2 font-mono">{block.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-100 rounded disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-100 rounded disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-zinc-200 mx-1"></div>
                <button type="button" onClick={() => deleteBlock(block.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            {/* Block Content */}
            <div className="p-5">
              {renderBlockEditor(block, index)}
            </div>
          </div>
        ))}

        {(!blocks || blocks.length === 0) && (
          <div className="py-12 border-2 border-dashed border-zinc-200 rounded-3xl text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-zinc-600 mb-1">No blocks yet</p>
            <p className="text-xs text-zinc-400 max-w-sm">Start building your layout by adding your first content block.</p>
          </div>
        )}
      </div>

      {/* Add Section Button relative wrapper */}
      <div className="relative flex justify-center">
        <button 
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-zinc-900/20 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Section
        </button>

        {showMenu && (
          <div className="absolute bottom-full mb-3 mt-0 p-2 bg-white border border-zinc-100 shadow-2xl rounded-2xl w-64 animate-in zoom-in-95 origin-bottom z-50 flex flex-col items-center">
            <div className="w-full text-[10px] font-black text-zinc-400 uppercase tracking-widest px-3 py-2 border-b border-zinc-100 mb-1">Select Block Type</div>
            {BLOCK_TYPES.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => addBlock(type.id as any)}
                className="w-full text-left px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors"
              >
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
