import { Download } from "lucide-react";
import BottomNav from "../components/BottomNav";

export default function Downloads() {
  return (
    <div className="min-h-screen bg-base pb-24 text-white">
      <div className="mx-auto max-w-md px-4 pt-6">
        <h1 className="text-lg font-bold">Downloads</h1>
        <p className="text-sm text-white/40">Movies you've downloaded for offline viewing</p>

        <div className="mt-16 flex flex-col items-center text-center text-white/30">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-surface2">
            <Download size={24} />
          </div>
          <p className="text-sm">No downloads yet.</p>
          <p className="text-xs">Downloaded movies will appear here.</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
