'use client';

import { useEffect, useRef, useState } from 'react';
import * as Marzipano from 'marzipano';
import DemoLayout from '@/components/DemoLayout';
import MarzipanoViewer from '@/components/MarzipanoViewer';

interface HotspotItem {
  id: number;
  handle: any;
  yaw: number;
  pitch: number;
}

export default function HotspotsV2Page() {
  const sceneRef = useRef<Marzipano.Scene | null>(null);
  const viewerRef = useRef<Marzipano.Viewer | null>(null);
  const [hotspotHandles, setHotspotHandles] = useState<HotspotItem[]>([]);
  const [hotspotCounter, setHotspotCounter] = useState(0);
  const [pickMode, setPickMode] = useState(false);
  const [zIndex, setZIndex] = useState(10);
  const [kind, setKind] = useState<'dom' | 'embedded'>('dom');
  const [occlusion, setOcclusion] = useState<'none' | 'hide' | 'dim'>('none');
  const [tabbable, setTabbable] = useState(true);
  const panoRef = useRef<HTMLDivElement>(null);

  const handleViewerReady = (viewer: Marzipano.Viewer) => {
    viewerRef.current = viewer;

    // Create scene
    const source = (Marzipano.ImageUrlSource.fromString as any)(
      '/media/equirect/{z}.jpg'
    );
    const geometry = new Marzipano.EquirectGeometry([
      { width: 4096 },
      { width: 2048 }
    ]);
    const limiter = Marzipano.RectilinearView.limit.traditional(4096, 100 * Math.PI / 180);
    const view = new Marzipano.RectilinearView({ yaw: 0 }, limiter);

    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view
    });

    sceneRef.current = scene;
    scene.switchTo();
  };

  const addHotspot = (yaw: number, pitch: number) => {
    if (!sceneRef.current) return;

    const newCounter = hotspotCounter + 1;
    setHotspotCounter(newCounter);

    // Create hotspot element
    const element = document.createElement('div');
    element.className = 'demo-hotspot';
    element.textContent = `Hotspot #${newCounter}`;
    element.style.cssText = 'background: rgba(255, 0, 0, 0.5); padding: 10px; border-radius: 5px; cursor: pointer;';

    // Add hotspot using new API
    const handle = sceneRef.current.addHotspot(element, { yaw, pitch }, {
      kind: kind,
      zIndex: zIndex,
      occlusion: occlusion,
      tabbable: tabbable,
      ariaLabel: `Interactive hotspot number ${newCounter}`
    });

    // Store handle
    const newItem: HotspotItem = {
      id: newCounter,
      handle: handle,
      yaw: yaw,
      pitch: pitch
    };

    setHotspotHandles([...hotspotHandles, newItem]);

    // Add click handler
    element.addEventListener('click', () => {
      console.log(`Clicked hotspot #${newCounter}`);
      Marzipano.util.Accessibility.announce(`Activated hotspot ${newCounter}`, 'polite');
    });
  };

  const removeHotspot = (index: number) => {
    const item = hotspotHandles[index];
    if (item && item.handle) {
      item.handle.destroy();
    }
    const newHandles = hotspotHandles.filter((_, i) => i !== index);
    setHotspotHandles(newHandles);
  };

  const handlePickMode = () => {
    setPickMode(!pickMode);
  };

  const handlePanoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pickMode || !viewerRef.current || !panoRef.current) return;

    const rect = panoRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const coords = viewerRef.current.pick(x, y);
    if (coords) {
      console.log('Picked coordinates:', coords);
      addHotspot(coords.yaw, coords.pitch);
      setPickMode(false);
    }
  };

  return (
    <DemoLayout 
      title="Hotspots v2" 
      description="Enhanced hotspots with z-index, occlusion, and accessibility"
    >
      <div className="flex h-full">
        <div className="flex-1 relative" ref={panoRef} onClick={handlePanoClick}>
          <MarzipanoViewer 
            className="w-full h-full"
            onViewerReady={handleViewerReady}
          />
          {pickMode && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-black p-2 rounded">
              Pick Mode Active - Click in panorama
            </div>
          )}
        </div>
        
        <div className="w-80 bg-gray-800 text-white p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Hotspots v2 Features</h2>
          
          <div className="mb-4">
            <button 
              onClick={() => {
                if (sceneRef.current) {
                  const viewParams = sceneRef.current.view().parameters();
                  addHotspot(viewParams.yaw, viewParams.pitch);
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-2"
            >
              ➕ Add Hotspot
            </button>
            <button 
              onClick={handlePickMode}
              className={`w-full px-4 py-2 rounded ${pickMode ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-700'}`}
            >
              {pickMode ? '✓ Pick Mode (Click in pano)' : '🎯 Pick Mode'}
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Hotspot Options</h3>
            <label className="block mb-2">
              Z-Index:
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={zIndex} 
                onChange={(e) => setZIndex(parseInt(e.target.value))}
                className="w-full mt-1 px-2 py-1 text-black rounded"
              />
            </label>
            <label className="block mb-2">
              Kind:
              <select 
                value={kind}
                onChange={(e) => setKind(e.target.value as 'dom' | 'embedded')}
                className="w-full mt-1 px-2 py-1 text-black rounded"
              >
                <option value="dom">DOM (screen-space)</option>
                <option value="embedded">Embedded (world-space)</option>
              </select>
            </label>
            <label className="block mb-2">
              Occlusion:
              <select 
                value={occlusion}
                onChange={(e) => setOcclusion(e.target.value as 'none' | 'hide' | 'dim')}
                className="w-full mt-1 px-2 py-1 text-black rounded"
              >
                <option value="none">None</option>
                <option value="hide">Hide</option>
                <option value="dim">Dim</option>
              </select>
            </label>
            <label className="flex items-center mb-2">
              <input 
                type="checkbox" 
                checked={tabbable}
                onChange={(e) => setTabbable(e.target.checked)}
                className="mr-2"
              />
              Keyboard Focusable (Tab)
            </label>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Active Hotspots: {hotspotHandles.length}</h3>
            <div className="space-y-2">
              {hotspotHandles.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                  <span className="text-sm">
                    #{item.id} ({item.yaw.toFixed(2)}, {item.pitch.toFixed(2)})
                  </span>
                  <button 
                    onClick={() => removeHotspot(index)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}

