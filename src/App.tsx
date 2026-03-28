import ReactMap, {
  FullscreenControl,
  GeolocateControl,
  Layer,
  NavigationControl,
  ScaleControl,
  Source,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import data1 from "./data/1.json";
import data2 from "./data/2.json";
import data3 from "./data/3.json";

const CONTROL_STYLES: React.CSSProperties = {
  background: "hsl(0 0% 100% / 0.5)",
  backdropFilter: "blur(4px)",
};

export function App() {
  return (
    <div id="app">
      <ReactMap
        initialViewState={{
          longitude: 139,
          latitude: 36,
          zoom: 8,
        }}
        mapStyle="https://tris5572.github.io/map-style/dark/style.json"
      >
        <Source id="local" type="geojson" data={data3 as any}>
          <Layer type="line" paint={{ "line-color": "#c6c299", "line-width": 2 }} />
        </Source>
        <Source id="general" type="geojson" data={data2 as any}>
          <Layer type="line" paint={{ "line-color": "#d19723", "line-width": 2 }} />
        </Source>
        <Source id="highway" type="geojson" data={data1 as any}>
          <Layer type="line" paint={{ "line-color": "#0da344", "line-width": 3 }} />
        </Source>
        <ScaleControl style={CONTROL_STYLES} />
        <NavigationControl style={CONTROL_STYLES} />
        <FullscreenControl style={CONTROL_STYLES} />
        <GeolocateControl style={CONTROL_STYLES} />
      </ReactMap>
    </div>
  );
}
