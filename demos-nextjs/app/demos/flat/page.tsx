'use client';

import { useEffect, useRef } from 'react';
import * as Marzipano from 'marzipano';
import DemoLayout from '@/components/DemoLayout';
import MarzipanoViewer from '@/components/MarzipanoViewer';

export default function FlatPage() {
  const sceneRef = useRef<Marzipano.Scene | null>(null);

  const handleViewerReady = (viewer: Marzipano.Viewer) => {
    // The tiles were generated with the krpano tools, which indexes the tiles
    // from 1 instead of 0. Hence, we cannot use ImageUrlSource.fromString()
    // and must write a custom function to convert tiles into URLs.
    const urlPrefix = "//www.marzipano.net/media/lisboa";
    const tileUrl = function(z: number, x: number, y: number) {
      return urlPrefix + "/l" + z + "/" + y + "/l" + z + '_' + y + '_' + x + ".jpg";
    };
    const source = new Marzipano.ImageUrlSource(function(tile: any) {
      return { url: tileUrl(tile.z+1, tile.x+1, tile.y+1) };
    });

    // Create geometry.
    const geometry = new Marzipano.FlatGeometry([
      { width: 756,   height: 312,   tileWidth: 756, tileHeight: 756 },
      { width: 1512,  height: 624,   tileWidth: 756, tileHeight: 756 },
      { width: 3024,  height: 1248,  tileWidth: 756, tileHeight: 756 },
      { width: 6048,  height: 2496,  tileWidth: 756, tileHeight: 756 },
      { width: 12096, height: 4992,  tileWidth: 756, tileHeight: 756 },
      { width: 24192, height: 9984,  tileWidth: 756, tileHeight: 756 },
      { width: 48384, height: 19968, tileWidth: 756, tileHeight: 756 }
    ]);

    // Create view.
    // The letterbox view limiter allows the view to zoom out until the image is
    // fully visible, adding black bands around the image where necessary.
    const limiter = Marzipano.util.compose(
      Marzipano.FlatView.limit.resolution(48384),
      Marzipano.FlatView.limit.letterbox()
    );
    const view = new Marzipano.FlatView({ mediaAspectRatio: 48384/19968}, limiter);

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
      title="Flat" 
      description="Display a flat (non-panoramic) image with multiple resolution levels."
    >
      <MarzipanoViewer 
        className="w-full h-full"
        onViewerReady={handleViewerReady}
      />
    </DemoLayout>
  );
}

