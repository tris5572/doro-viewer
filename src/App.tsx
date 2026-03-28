import { useEffect, useState } from "react";
import ReactMap, {
  FullscreenControl,
  GeolocateControl,
  Layer,
  NavigationControl,
  ScaleControl,
  Source,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const CONTROL_STYLES: React.CSSProperties = {
  background: "hsl(0 0% 100% / 0.5)",
  backdropFilter: "blur(4px)",
};

type RoadData = {
  highway: any | null;
  general: any | null;
  local: any | null;
};

export function App() {
  const [roadData, setRoadData] = useState<RoadData>({
    highway: null,
    general: null,
    local: null,
  });
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadRoadData = async () => {
      try {
        const [highwayRes, generalRes, localRes] = await Promise.all([
          fetch("/data/1.json"),
          fetch("/data/2.json"),
          fetch("/data/3.json"),
        ]);

        if (!highwayRes.ok || !generalRes.ok || !localRes.ok) {
          throw new Error("道路データの取得に失敗しました");
        }

        const [highway, general, local] = await Promise.all([highwayRes.json(), generalRes.json(), localRes.json()]);

        if (isMounted) {
          setRoadData({ highway, general, local });
        }
      } catch {
        if (isMounted) {
          // setError("データを読み込めませんでした");
          console.error("道路データの取得に失敗しました");
        }
      }
    };

    void loadRoadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div id="app">
      {/* {error && <p>{error}</p>} */}
      <ReactMap
        initialViewState={{
          longitude: 139,
          latitude: 36,
          zoom: 8,
        }}
        mapStyle="https://tris5572.github.io/map-style/dark/style.json"
      >
        {roadData.local && (
          <Source id="local" type="geojson" data={roadData.local as any}>
            <Layer type="line" paint={{ "line-color": "#c6c299", "line-width": 2 }} />
          </Source>
        )}
        {roadData.general && (
          <Source id="general" type="geojson" data={roadData.general as any}>
            <Layer type="line" paint={{ "line-color": "#d19723", "line-width": 2 }} />
          </Source>
        )}
        {roadData.highway && (
          <Source id="highway" type="geojson" data={roadData.highway as any}>
            <Layer type="line" paint={{ "line-color": "#0da344", "line-width": 3 }} />
          </Source>
        )}
        <ScaleControl style={CONTROL_STYLES} />
        <NavigationControl style={CONTROL_STYLES} />
        <FullscreenControl style={CONTROL_STYLES} />
        <GeolocateControl style={CONTROL_STYLES} />
      </ReactMap>
    </div>
  );
}
