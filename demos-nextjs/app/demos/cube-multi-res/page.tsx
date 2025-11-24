'use client';

import { useEffect, useRef } from 'react';
import * as Marzipano from 'marzipano';
import DemoLayout from '@/components/DemoLayout';
import MarzipanoViewer from '@/components/MarzipanoViewer';

export default function CubeMultiResPage() {
  const sceneRef = useRef<Marzipano.Scene | null>(null);
  const viewerRef = useRef<Marzipano.Viewer | null>(null);

  const handleViewerReady = (viewer: Marzipano.Viewer) => {
    viewerRef.current = viewer;

    // Create source.
    // The tiles were generated with the krpano tools, which indexes the tiles
    // from 1 instead of 0. Hence, we cannot use ImageUrlSource.fromString()
    // and must write a custom function to convert tiles into URLs.
    const urlPrefix = "//www.marzipano.net/media/prague";
    const previewUrl = urlPrefix + "/preview.jpg";
    const tileUrl = function(f: string, z: number, x: number, y: number) {
      return urlPrefix + "/l" + z + "/" + f + "/" + y + "/" + x + ".jpg";
    };
    const source = new Marzipano.ImageUrlSource(function(tile: any) {
      if (tile.z === 0) {
        const mapY = 'lfrbud'.indexOf(tile.face) / 6;
        return { url: previewUrl, rect: { x: 0, y: mapY, width: 1, height: 1/6 }};
      } else {
        return { url: tileUrl(tile.face, tile.z, tile.x+1, tile.y+1) };
      }
    });

    // Create geometry.
    const geometry = new Marzipano.CubeGeometry([
      { tileSize: 256, size: 256, fallbackOnly: true },
      { tileSize: 512, size: 512 },
      { tileSize: 512, size: 1024 },
      { tileSize: 512, size: 2048 },
      { tileSize: 512, size: 4096 },
      { tileSize: 512, size: 8192 },
      { tileSize: 512, size: 16384 },
      { tileSize: 512, size: 32768 },
      { tileSize: 512, size: 65536 }
    ]);

    // Create view.
    const limiter = Marzipano.RectilinearView.limit.traditional(65536, 100*Math.PI/180);
    const view = new Marzipano.RectilinearView(null, limiter);

    // Create scene.
    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    sceneRef.current = scene;

    // Display scene.
    scene.switchTo();
  };

  return (
    <DemoLayout 
      title="Cube Multi-Resolution" 
      description="Display a cubemap with multiple resolution levels. Uses progressive rendering for a more pleasing visual effect when zooming."
    >
      <MarzipanoViewer 
        className="w-full h-full"
        options={{ stage: { progressive: true } }}
        onViewerReady={handleViewerReady}
      />
    </DemoLayout>
  );
}

