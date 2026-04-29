import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, ImageIcon, GripVertical, X } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export interface Block {
  id: string;
  type: 'hero' | 'profile-tabs' | 'activity-slider' | 'dynamic-post-feed' | 'rich-text' | 'contacts' | 'features' | 'faq' | 'testimonials' | 'partners' | 'team' | 'gallery' | 'cta-banner';
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
  { id: 'rich-text', label: 'Rich Text' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'features', label: 'Features' },
  { id: 'faq', label: 'FAQ' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'partners', label: 'Partners' },
  { id: 'team', label: 'Team Members' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'cta-banner', label: 'CTA Banner' }
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
    } else if (type === 'contacts') {
      newBlock.data = { title: null, phone_numbers: [], emails: [], addresses: [], map_location_url: null, social_links: [], working_hours: null };
    } else if (type === 'features') {
      newBlock.data = { title: null, subtitle: null, items: [] };
    } else if (type === 'faq') {
      newBlock.data = { title: null, subtitle: null, items: [] };
    } else if (type === 'testimonials') {
      newBlock.data = { title: null, items: [] };
    } else if (type === 'partners') {
      newBlock.data = { title: null, logos: [] };
    } else if (type === 'team') {
      newBlock.data = { title: null, subtitle: null, members: [] };
    } else if (type === 'gallery') {
      newBlock.data = { title: null, subtitle: null, images: [] };
    } else if (type === 'cta-banner') {
      newBlock.data = { headline: null, sub_headline: null, button_text: null, button_link: null, background_image_url: null, background_color: null };
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

      case 'contacts':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Title</label>
              <input type="text" value={block.data.title || ''} onChange={(e) => updateBlockData(block.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="e.g. Get in Touch" />
            </div>
            {/* Phone Numbers Repeater */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone Numbers</label>
                <button type="button" onClick={() => { const arr = block.data.phone_numbers || []; updateBlockData(block.id, 'phone_numbers', [...arr, '']); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add</button>
              </div>
              {(block.data.phone_numbers || []).map((ph: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input type="text" placeholder="+62 812 ..." value={ph || ''} onChange={(e) => { const arr = [...(block.data.phone_numbers || [])]; arr[i] = e.target.value || null; updateBlockData(block.id, 'phone_numbers', arr); }} className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs" />
                  <button type="button" onClick={() => { const arr = (block.data.phone_numbers || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'phone_numbers', arr); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            {/* Emails Repeater */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Emails</label>
                <button type="button" onClick={() => { const arr = block.data.emails || []; updateBlockData(block.id, 'emails', [...arr, '']); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add</button>
              </div>
              {(block.data.emails || []).map((em: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input type="email" placeholder="email@example.com" value={em || ''} onChange={(e) => { const arr = [...(block.data.emails || [])]; arr[i] = e.target.value || null; updateBlockData(block.id, 'emails', arr); }} className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs" />
                  <button type="button" onClick={() => { const arr = (block.data.emails || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'emails', arr); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            {/* Addresses Repeater */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Addresses</label>
                <button type="button" onClick={() => { const arr = block.data.addresses || []; updateBlockData(block.id, 'addresses', [...arr, '']); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add</button>
              </div>
              {(block.data.addresses || []).map((addr: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input type="text" placeholder="Jl. Example No. 123" value={addr || ''} onChange={(e) => { const arr = [...(block.data.addresses || [])]; arr[i] = e.target.value || null; updateBlockData(block.id, 'addresses', arr); }} className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs" />
                  <button type="button" onClick={() => { const arr = (block.data.addresses || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'addresses', arr); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            {/* Map URL */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Map Location URL</label>
              <input type="url" value={block.data.map_location_url || ''} onChange={(e) => updateBlockData(block.id, 'map_location_url', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400 text-xs" placeholder="https://maps.google.com/..." />
            </div>
            {/* Social Links Repeater */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Social Links</label>
                <button type="button" onClick={() => { const arr = block.data.social_links || []; updateBlockData(block.id, 'social_links', [...arr, { platform: null, url: null }]); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Link</button>
              </div>
              {(block.data.social_links || []).map((sl: any, i: number) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input type="text" placeholder="Platform" value={sl.platform || ''} onChange={(e) => { const arr = [...(block.data.social_links || [])]; arr[i] = { ...arr[i], platform: e.target.value || null }; updateBlockData(block.id, 'social_links', arr); }} className="w-1/3 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs" />
                  <input type="url" placeholder="https://..." value={sl.url || ''} onChange={(e) => { const arr = [...(block.data.social_links || [])]; arr[i] = { ...arr[i], url: e.target.value || null }; updateBlockData(block.id, 'social_links', arr); }} className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs" />
                  <button type="button" onClick={() => { const arr = (block.data.social_links || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'social_links', arr); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            {/* Working Hours */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Working Hours</label>
              <input type="text" value={block.data.working_hours || ''} onChange={(e) => updateBlockData(block.id, 'working_hours', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400 text-xs" placeholder="Mon-Fri 09:00-17:00" />
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Title</label>
              <input type="text" value={block.data.title || ''} onChange={(e) => updateBlockData(block.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="Our Features" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Subtitle</label>
              <input type="text" value={block.data.subtitle || ''} onChange={(e) => updateBlockData(block.id, 'subtitle', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="Discover what we offer" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Feature Items</label>
                <button type="button" onClick={() => { const items = block.data.items || []; updateBlockData(block.id, 'items', [...items, { icon_url: null, title: null, description: null, link_url: null }]); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Feature</button>
              </div>
              {(block.data.items || []).map((item: any, i: number) => (
                <div key={i} className="mb-4 p-3 border border-zinc-100 rounded-xl bg-zinc-50/50 space-y-3 relative">
                  <button type="button" onClick={() => { const items = (block.data.items || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'items', items); }} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 hover:bg-red-200 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={item.icon_url || ''} placeholder="Icon image..." className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                    <button type="button" onClick={() => onOpenMediaPicker(block.id, 'features_icon', i)} className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-xs font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3"/>Choose</button>
                  </div>
                  <input type="text" placeholder="Feature Title" value={item.title || ''} onChange={(e) => { const items = [...(block.data.items || [])]; items[i] = { ...items[i], title: e.target.value || null }; updateBlockData(block.id, 'items', items); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold" />
                  <textarea placeholder="Description" rows={2} value={item.description || ''} onChange={(e) => { const items = [...(block.data.items || [])]; items[i] = { ...items[i], description: e.target.value || null }; updateBlockData(block.id, 'items', items); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs outline-none focus:border-amber-400" />
                  <input type="url" placeholder="Link URL (optional)" value={item.link_url || ''} onChange={(e) => { const items = [...(block.data.items || [])]; items[i] = { ...items[i], link_url: e.target.value || null }; updateBlockData(block.id, 'items', items); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Title</label>
              <input type="text" value={block.data.title || ''} onChange={(e) => updateBlockData(block.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="Frequently Asked Questions" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Subtitle</label>
              <input type="text" value={block.data.subtitle || ''} onChange={(e) => updateBlockData(block.id, 'subtitle', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="Find answers to common questions" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">FAQ Items</label>
                <button type="button" onClick={() => { const items = block.data.items || []; updateBlockData(block.id, 'items', [...items, { question: null, answer: null }]); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Question</button>
              </div>
              {(block.data.items || []).map((item: any, i: number) => (
                <div key={i} className="mb-4 p-3 border border-zinc-100 rounded-xl bg-zinc-50/50 space-y-3 relative">
                  <button type="button" onClick={() => { const items = (block.data.items || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'items', items); }} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 hover:bg-red-200 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                  <input type="text" placeholder="Question" value={item.question || ''} onChange={(e) => { const items = [...(block.data.items || [])]; items[i] = { ...items[i], question: e.target.value || null }; updateBlockData(block.id, 'items', items); }} className="w-full pr-10 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold" />
                  <textarea placeholder="Answer" rows={3} value={item.answer || ''} onChange={(e) => { const items = [...(block.data.items || [])]; items[i] = { ...items[i], answer: e.target.value || null }; updateBlockData(block.id, 'items', items); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs outline-none focus:border-amber-400" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Title</label>
              <input type="text" value={block.data.title || ''} onChange={(e) => updateBlockData(block.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="What People Say" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Testimonial Items</label>
                <button type="button" onClick={() => { const items = block.data.items || []; updateBlockData(block.id, 'items', [...items, { author_name: null, author_role: null, author_image: null, content: null, rating: null }]); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Testimonial</button>
              </div>
              {(block.data.items || []).map((item: any, i: number) => (
                <div key={i} className="mb-4 p-3 border border-zinc-100 rounded-xl bg-zinc-50/50 space-y-3 relative">
                  <button type="button" onClick={() => { const items = (block.data.items || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'items', items); }} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 hover:bg-red-200 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Author Name" value={item.author_name || ''} onChange={(e) => { const items = [...(block.data.items || [])]; items[i] = { ...items[i], author_name: e.target.value || null }; updateBlockData(block.id, 'items', items); }} className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold" />
                    <input type="text" placeholder="Author Role" value={item.author_role || ''} onChange={(e) => { const items = [...(block.data.items || [])]; items[i] = { ...items[i], author_role: e.target.value || null }; updateBlockData(block.id, 'items', items); }} className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                  </div>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={item.author_image || ''} placeholder="Author image..." className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                    <button type="button" onClick={() => onOpenMediaPicker(block.id, 'testimonial_image', i)} className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-xs font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3"/>Choose</button>
                  </div>
                  <textarea placeholder="Testimonial content..." rows={3} value={item.content || ''} onChange={(e) => { const items = [...(block.data.items || [])]; items[i] = { ...items[i], content: e.target.value || null }; updateBlockData(block.id, 'items', items); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs outline-none focus:border-amber-400" />
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Rating (1-5)</label>
                    <input type="number" min="1" max="5" value={item.rating || ''} onChange={(e) => { const items = [...(block.data.items || [])]; items[i] = { ...items[i], rating: e.target.value ? parseInt(e.target.value) : null }; updateBlockData(block.id, 'items', items); }} className="w-24 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'partners':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Title</label>
              <input type="text" value={block.data.title || ''} onChange={(e) => updateBlockData(block.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="Our Partners" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Partner Logos</label>
                <button type="button" onClick={() => { const logos = block.data.logos || []; updateBlockData(block.id, 'logos', [...logos, { partner_name: null, logo_url: null, website_url: null }]); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Partner</button>
              </div>
              {(block.data.logos || []).map((logo: any, i: number) => (
                <div key={i} className="mb-4 p-3 border border-zinc-100 rounded-xl bg-zinc-50/50 space-y-3 relative">
                  <button type="button" onClick={() => { const logos = (block.data.logos || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'logos', logos); }} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 hover:bg-red-200 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                  <input type="text" placeholder="Partner Name" value={logo.partner_name || ''} onChange={(e) => { const logos = [...(block.data.logos || [])]; logos[i] = { ...logos[i], partner_name: e.target.value || null }; updateBlockData(block.id, 'logos', logos); }} className="w-full pr-10 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold" />
                  <div className="flex gap-2">
                    <input type="text" readOnly value={logo.logo_url || ''} placeholder="Logo image..." className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                    <button type="button" onClick={() => onOpenMediaPicker(block.id, 'partner_logo', i)} className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-xs font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3"/>Choose</button>
                  </div>
                  <input type="url" placeholder="Website URL (optional)" value={logo.website_url || ''} onChange={(e) => { const logos = [...(block.data.logos || [])]; logos[i] = { ...logos[i], website_url: e.target.value || null }; updateBlockData(block.id, 'logos', logos); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Title</label>
              <input type="text" value={block.data.title || ''} onChange={(e) => updateBlockData(block.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="Meet the Team" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Subtitle</label>
              <input type="text" value={block.data.subtitle || ''} onChange={(e) => updateBlockData(block.id, 'subtitle', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="The people behind our vision" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Members</label>
                <button type="button" onClick={() => { const members = block.data.members || []; updateBlockData(block.id, 'members', [...members, { name: null, role: null, photo_url: null, bio: null, social_links: null }]); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Member</button>
              </div>
              {(block.data.members || []).map((member: any, i: number) => (
                <div key={i} className="mb-4 p-3 border border-zinc-100 rounded-xl bg-zinc-50/50 space-y-3 relative">
                  <button type="button" onClick={() => { const members = (block.data.members || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'members', members); }} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 hover:bg-red-200 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Name" value={member.name || ''} onChange={(e) => { const members = [...(block.data.members || [])]; members[i] = { ...members[i], name: e.target.value || null }; updateBlockData(block.id, 'members', members); }} className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold" />
                    <input type="text" placeholder="Role / Position" value={member.role || ''} onChange={(e) => { const members = [...(block.data.members || [])]; members[i] = { ...members[i], role: e.target.value || null }; updateBlockData(block.id, 'members', members); }} className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                  </div>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={member.photo_url || ''} placeholder="Photo..." className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                    <button type="button" onClick={() => onOpenMediaPicker(block.id, 'team_photo', i)} className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-xs font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3"/>Choose</button>
                  </div>
                  <textarea placeholder="Short bio..." rows={2} value={member.bio || ''} onChange={(e) => { const members = [...(block.data.members || [])]; members[i] = { ...members[i], bio: e.target.value || null }; updateBlockData(block.id, 'members', members); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs outline-none focus:border-amber-400" />
                  <input type="text" placeholder="Social links (comma-separated URLs)" value={member.social_links || ''} onChange={(e) => { const members = [...(block.data.members || [])]; members[i] = { ...members[i], social_links: e.target.value || null }; updateBlockData(block.id, 'members', members); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Title</label>
              <input type="text" value={block.data.title || ''} onChange={(e) => updateBlockData(block.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="Our Gallery" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Subtitle</label>
              <input type="text" value={block.data.subtitle || ''} onChange={(e) => updateBlockData(block.id, 'subtitle', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="A visual journey" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Images</label>
                <button type="button" onClick={() => { const images = block.data.images || []; updateBlockData(block.id, 'images', [...images, { url: null, caption: null, alt_text: null }]); }} className="text-xs font-bold text-amber-600 hover:text-amber-700">+ Add Image</button>
              </div>
              {(block.data.images || []).map((img: any, i: number) => (
                <div key={i} className="mb-4 p-3 border border-zinc-100 rounded-xl bg-zinc-50/50 space-y-3 relative">
                  <button type="button" onClick={() => { const images = (block.data.images || []).filter((_: any, idx: number) => idx !== i); updateBlockData(block.id, 'images', images); }} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 hover:bg-red-200 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={img.url || ''} placeholder="Image URL..." className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                    <button type="button" onClick={() => onOpenMediaPicker(block.id, 'gallery_image', i)} className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-xs font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3"/>Choose</button>
                  </div>
                  <input type="text" placeholder="Caption (optional)" value={img.caption || ''} onChange={(e) => { const images = [...(block.data.images || [])]; images[i] = { ...images[i], caption: e.target.value || null }; updateBlockData(block.id, 'images', images); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                  <input type="text" placeholder="Alt text (optional)" value={img.alt_text || ''} onChange={(e) => { const images = [...(block.data.images || [])]; images[i] = { ...images[i], alt_text: e.target.value || null }; updateBlockData(block.id, 'images', images); }} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta-banner':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Headline</label>
              <input type="text" value={block.data.headline || ''} onChange={(e) => updateBlockData(block.id, 'headline', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="Ready to get started?" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Sub-headline</label>
              <input type="text" value={block.data.sub_headline || ''} onChange={(e) => updateBlockData(block.id, 'sub_headline', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400" placeholder="Join thousands of happy customers" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Button Text</label>
                <input type="text" value={block.data.button_text || ''} onChange={(e) => updateBlockData(block.id, 'button_text', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400 text-xs" placeholder="Get Started" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Button Link</label>
                <input type="url" value={block.data.button_link || ''} onChange={(e) => updateBlockData(block.id, 'button_link', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400 text-xs" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Background Image</label>
              <div className="flex gap-2">
                <input type="text" readOnly value={block.data.background_image_url || ''} placeholder="Select background..." className="flex-1 px-3 py-2 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-lg text-xs" />
                <button type="button" onClick={() => onOpenMediaPicker(block.id, 'background_image_url')} className="p-2 bg-amber-400 text-zinc-900 rounded-lg hover:bg-amber-500"><ImageIcon className="w-4 h-4" /></button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Background Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={block.data.background_color || '#000000'} onChange={(e) => updateBlockData(block.id, 'background_color', e.target.value)} className="w-10 h-10 rounded-lg border border-zinc-200 cursor-pointer" />
                <input type="text" value={block.data.background_color || ''} onChange={(e) => updateBlockData(block.id, 'background_color', e.target.value)} className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-amber-400 text-xs font-mono" placeholder="#000000" />
              </div>
            </div>
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
          onClick={() => setShowMenu(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-zinc-900/20 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Section
        </button>

        {showMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowMenu(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-3xl shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Add New Block</h3>
                  <p className="text-sm text-zinc-500">Select a block type to add to your page</p>
                </div>
                <button type="button" onClick={() => setShowMenu(false)} className="p-2 text-zinc-400 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-4">
                {BLOCK_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => addBlock(type.id as any)}
                    className="flex flex-col items-center p-4 text-center border-2 border-zinc-100 hover:border-amber-400 hover:bg-amber-50 rounded-2xl transition-all group"
                  >
                    <div className="w-14 h-14 bg-zinc-100 group-hover:bg-amber-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                      <Plus className="w-6 h-6 text-zinc-400 group-hover:text-amber-600" />
                    </div>
                    <span className="text-sm font-bold text-zinc-700 group-hover:text-amber-700">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
