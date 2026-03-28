import { useCallback, useEffect, useState } from "react";
import ReactMap, {
  FullscreenControl,
  GeolocateControl,
  Layer,
  NavigationControl,
  ScaleControl,
  Source,
  type MapGeoJSONFeature,
  type MapLayerMouseEvent,
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
  const [hoverInfo, setHoverInfo] = useState<{ feature: MapGeoJSONFeature; x: number; y: number } | undefined>(
    undefined,
  );

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const dataBasePath = `${import.meta.env.BASE_URL}data`;

    const loadRoadData = async () => {
      try {
        const [highwayRes, generalRes, localRes] = await Promise.all([
          fetch(`${dataBasePath}/1.json`),
          fetch(`${dataBasePath}/2.json`),
          fetch(`${dataBasePath}/3.json`),
        ]);

        if (!highwayRes.ok || !generalRes.ok || !localRes.ok) {
          console.error(highwayRes, generalRes, localRes);
          throw new Error("道路データの取得に失敗しました");
        }

        const [highway, general, local] = await Promise.all([highwayRes.json(), generalRes.json(), localRes.json()]);

        if (isMounted) {
          setRoadData({ highway, general, local });
        }
      } catch {
        if (isMounted) {
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
      <ReactMap
        initialViewState={{
          longitude: 139,
          latitude: 36,
          zoom: 8,
        }}
        mapStyle="https://tris5572.github.io/map-style/dark/style.json"
        interactiveLayerIds={["local", "general", "highway"]}
        onMouseMove={onHover}
      >
        {roadData.local && (
          <Source id="local" type="geojson" data={roadData.local as any}>
            <Layer id="local" type="line" paint={{ "line-color": "#c6c299", "line-width": 3 }} />
          </Source>
        )}
        {roadData.general && (
          <Source id="general" type="geojson" data={roadData.general as any}>
            <Layer id="general" type="line" paint={{ "line-color": "#d19723", "line-width": 3 }} />
          </Source>
        )}
        {roadData.highway && (
          <Source id="highway" type="geojson" data={roadData.highway as any}>
            <Layer id="highway" type="line" paint={{ "line-color": "#0da344", "line-width": 5 }} />
          </Source>
        )}
        <ScaleControl style={CONTROL_STYLES} />
        <NavigationControl style={CONTROL_STYLES} />
        <FullscreenControl style={CONTROL_STYLES} />
        <GeolocateControl style={CONTROL_STYLES} />
        {hoverInfo && (
          <div className="tooltip" style={{ left: hoverInfo.x, top: hoverInfo.y }}>
            <div>道路種別： {roadTypeCodeToName(hoverInfo.feature.properties.roadTypeCode)}</div>
            <div>路線名： {hoverInfo.feature.properties.routeName}</div>
            <div>線名： {hoverInfo.feature.properties.lineName}</div>
            <div>通称： {hoverInfo.feature.properties.popularName}</div>
          </div>
        )}
      </ReactMap>
    </div>
  );
}

function roadTypeCodeToName(code: string) {
  switch (code) {
    case "1":
      return "高速道路";
    case "2":
      return "一般道路";
    case "3":
      return "主要地方道";
    default:
      return "不明";
  }
}
