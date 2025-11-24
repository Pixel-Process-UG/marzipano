import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';
import FeatureCard from '@/components/FeatureCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-gray-700 text-sm font-medium mb-6">
            Maintained by Pixel & Process from Lübeck, Germany
          </span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-black">
          Marzipano
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-3xl mx-auto">
          A 360° media viewer for the modern web
        </p>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Originally created by Google, now maintained by Pixel & Process. 
          Uses WebGL to render panoramic images with support for multiple geometries and projection types.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/demos"
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            View Demos
          </Link>
          <a
            href="#installation"
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 text-gray-900"
          >
            Get Started
          </a>
          <a
            href="https://github.com/Pixel-Process-UG/marzipano-ts"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 text-gray-900"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center text-black">
            About Marzipano
          </h2>
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <p className="text-lg text-gray-700 mb-4">
              Marzipano is a powerful JavaScript library for creating immersive 360° media experiences on the web. 
              Built with WebGL, it provides high-performance rendering of panoramic images and videos with support for 
              multiple geometries including cube maps, equirectangular projections, and flat images.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              This project was originally created by Google and is now maintained as a fork by 
              <a href="https://pixelandprocess.de/" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-black mx-1 underline">
                Pixel & Process
              </a>
              , a digital agency from Lübeck, Germany. We're committed to keeping this project alive and up-to-date 
              with modern web standards.
            </p>
            <p className="text-lg text-gray-700">
              Key features include WebGL rendering, multiple geometry support, WebXR integration for VR/AR experiences, 
              spatial audio, interactive hotspots, smooth transitions, and comprehensive touch gesture support.
            </p>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center text-black">
            Installation
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Install via npm</h3>
              <CodeBlock>
{`npm install marzipano-ts`}
              </CodeBlock>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">ES Modules (Recommended)</h3>
              <CodeBlock>
{`import { 
  Viewer, 
  Scene, 
  ImageUrlSource, 
  RectilinearView, 
  CubeGeometry 
} from 'marzipano';`}
              </CodeBlock>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">CommonJS (Legacy)</h3>
              <CodeBlock>
{`const { 
  Viewer, 
  Scene, 
  ImageUrlSource, 
  RectilinearView, 
  CubeGeometry 
} = require('marzipano');`}
              </CodeBlock>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Quick Start</h3>
              <CodeBlock>
{`import { Viewer, Scene, ImageUrlSource, RectilinearView, CubeGeometry } from 'marzipano';

// Create viewer
const viewer = new Viewer(document.getElementById('pano'));

// Create scene
const scene = viewer.createScene({
  source: ImageUrlSource.fromString('/path/to/image.jpg'),
  geometry: new CubeGeometry([{ tileSize: 256, size: 256 }]),
  view: new RectilinearView({ fov: Math.PI / 2 })
});

// Display scene
scene.switchTo();`}
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center text-black">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            title="Multiple Geometries"
            description="Support for cube maps, equirectangular projections, and flat images with automatic level-of-detail management."
          />
          <FeatureCard
            title="Interactive Hotspots"
            description="Add interactive elements to your panoramas with support for custom styling, z-index, and accessibility features."
          />
          <FeatureCard
            title="WebXR Support"
            description="Full WebXR integration for immersive VR and AR experiences with head tracking and controller support."
          />
          <FeatureCard
            title="WebGL Rendering"
            description="High-performance rendering using WebGL for smooth 60fps experiences even with high-resolution panoramas."
          />
          <FeatureCard
            title="Spatial Audio"
            description="Position-based audio support for immersive experiences with 3D spatial sound positioning."
          />
          <FeatureCard
            title="Smooth Transitions"
            description="Beautiful scene transitions with crossfade, zoom morph, and customizable easing functions."
          />
          <FeatureCard
            title="Touch Gestures"
            description="Comprehensive touch gesture support including pinch-to-zoom, drag, and multi-touch interactions."
          />
          <FeatureCard
            title="Video Support"
            description="Play 360° videos with support for multiple resolution levels and adaptive streaming."
          />
          <FeatureCard
            title="Performance Optimized"
            description="Built-in performance monitoring, memory management, and LRU texture caching for optimal performance."
          />
        </div>
      </section>

      {/* Contribution Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center text-black">
            Contributing
          </h2>
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <p className="text-lg text-gray-700 mb-6">
              We welcome contributions to keep Marzipano alive and up-to-date with modern web standards! 
              Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Getting Started</h3>
                <p className="text-gray-700 mb-4">
                  Before starting work on a larger contribution, please get in touch through our 
                  <a href="https://github.com/Pixel-Process-UG/marzipano-ts/issues" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-black mx-1 underline">
                    issue tracker
                  </a>
                  to coordinate and avoid duplicate work.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Development Setup</h3>
                <CodeBlock>
{`# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch`}
                </CodeBlock>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Contribution Guidelines</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Follow existing code style and conventions</li>
                  <li>Include tests for new features or bug fixes</li>
                  <li>Update documentation as needed</li>
                  <li>Ensure compatibility with the Apache 2.0 license</li>
                  <li>All submissions require review via GitHub pull requests</li>
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href="https://github.com/Pixel-Process-UG/marzipano-ts/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold transition-colors"
                >
                  Read Full Contributing Guide →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pixel & Process Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center text-black">
            Maintained by Pixel & Process
          </h2>
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-4 text-black">
                  Pixel & Process
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  Pixel & Process is a digital agency from Lübeck, Germany, specializing in web development, 
                  design systems, and automation workflows. We're passionate about open-source software and 
                  committed to maintaining projects that benefit the developer community.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  When Google discontinued active development of Marzipano, we took on the responsibility 
                  of maintaining this fork to ensure it continues to work with modern web standards and 
                  receives necessary updates and bug fixes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://pixelandprocess.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold transition-colors"
                  >
                    Visit Pixel & Process →
                  </a>
                  <a
                    href="https://github.com/Pixel-Process-UG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition-colors text-gray-900"
                  >
                    Our GitHub →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-black">Marzipano</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/" className="hover:text-black transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/demos" className="hover:text-black transition-colors">
                    Demos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-black">Resources</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="https://github.com/Pixel-Process-UG/marzipano-ts" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Pixel-Process-UG/marzipano-ts/issues" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                    Report an Issue
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Pixel-Process-UG/marzipano-ts/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                    Contributing Guide
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-black">Maintained by</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="https://pixelandprocess.de/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                    Pixel & Process
                  </a>
                </li>
                <li className="text-sm text-gray-500">
                  Lübeck, Germany
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
            <p>
              © {new Date().getFullYear()} Pixel & Process UG (haftungsbeschränkt). All rights reserved.
            </p>
            <p className="mt-2">
              Marzipano is licensed under the Apache 2.0 License. Originally created by Google Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
