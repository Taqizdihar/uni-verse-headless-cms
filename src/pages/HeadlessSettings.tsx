// File: src/pages/HeadlessSettings.tsx
import React from 'react';
import { useHeadlessCms } from '@/context/HeadlessCmsContext';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Settings as SettingsIcon, 
  Monitor, 
  Briefcase, 
  Palette,
  Type
} from 'lucide-react';

export function HeadlessSettings() {
  const { settings, updateSettings } = useHeadlessCms();

  const handleSiteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ site_name: e.target.value });
  };

  const templates = [
    { 
      id: 'minimalist', 
      name: 'Minimalist', 
      description: 'Clean, space-driven design focused on content.',
      icon: Monitor, 
      color: 'bg-gray-100 text-gray-700 border-gray-200'
    },
    { 
      id: 'corporate', 
      name: 'Corporate', 
      description: 'Professional layout for business scaling.',
      icon: Briefcase, 
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      description: 'Bold colors and dynamic typography.',
      icon: Palette, 
      color: 'bg-pink-50 text-pink-700 border-pink-200'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-gray-400" />
          Headless CMS Settings
        </h2>
        <p className="text-gray-500 mt-1">Configure global parameters and select your site's main theme.</p>
      </div>

      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-400" /> Site Information
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Site Name</label>
            <input 
              type="text"
              value={settings.site_name}
              onChange={handleSiteNameChange}
              placeholder="Enter your site name"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow outline-none transition-all text-sm font-medium"
            />
            <p className="text-xs text-gray-500">This will be used as the root title constraint across your Headless API.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-400" /> Active Template Strategy
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => {
              const Icon = template.icon;
              const isActive = settings.active_template === template.id;
              
              return (
                <div 
                  key={template.id}
                  onClick={() => updateSettings({ active_template: template.id as any })}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'border-brand-yellow bg-yellow-50/30 shadow-md transform scale-[1.02]' 
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col h-full gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${template.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{template.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    </div>
                    
                    {/* Active Indicator Label */}
                    {isActive && (
                      <div className="absolute top-4 right-4 flex items-center">
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-yellow"></span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Visualizer for Data Structure */}
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto shadow-inner">
        <p className="text-gray-500 mb-2">// Current Settings Logic State (Ready for MySQL / Headless JSON Data)</p>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </div>
  );
}
