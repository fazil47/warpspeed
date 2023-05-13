import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Stable Diffusion Render</h1>
      <p className="text-2xl">A 3D rendering app for the web</p>
      <p className="text-2xl">Built with React, Next.js, and Three.js</p>
      <p className="text-2xl">Powered by Vercel</p>
    </main>
  );
}
