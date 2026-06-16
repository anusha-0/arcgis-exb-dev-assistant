const PATTERNS = {
    "consume-datasource": `
// Pattern: Consume a DataSource in widget.tsx
import { DataSourceComponent, DataSource, DataSourceStatus,
         QueriableDataSource } from "jimu-core";

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [records, setRecords] = React.useState([]);

  const onDsCreated = (ds: DataSource) => {
    if (ds && ds.getStatus() === DataSourceStatus.Loaded) {
      const recs = (ds as QueriableDataSource).getRecords();
      setRecords(recs);
    }
  };

  return (
    <DataSourceComponent
      useDataSource={props.useDataSources?.[0]}
      onDataSourceCreated={onDsCreated}
      onDataSourceInfoChange={(info) => console.log("DS info changed", info)}
    />
  );
};`,
    "map-extent-change": `
// Pattern: Subscribe to map extent changes
import { JimuMapView, JimuMapViewComponent } from "jimu-arcgis";
import reactiveUtils from "esri/core/reactiveUtils";

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [extent, setExtent] = React.useState(null);

  const onViewChange = (jmv: JimuMapView) => {
    if (!jmv) return;
    reactiveUtils.watch(
      () => jmv.view.extent,
      (newExtent) => setExtent(newExtent)
    );
  };

  return (
    <JimuMapViewComponent
      useMapWidgetId={props.useMapWidgetIds?.[0]}
      onActiveViewChange={onViewChange}
    />
  );
};`,
    "inter-widget-messaging": `
// Pattern: Send a message FROM your widget
import { MessageManager, RecordSetChangeMessage,
         DataRecordsSelectionChangeMessage } from "jimu-core";

// Publish selected records to other widgets
const publishSelection = (records) => {
  MessageManager.getInstance().publishMessage(
    new DataRecordsSelectionChangeMessage(props.id, records)
  );
};

// Pattern: RECEIVE a message in your widget (manifest.json)
// Add to manifest.json:
// "messageActions": [{ "label": "Filter data", "actionId": "filter-action" }]

// Pattern: Listen in widget.tsx
React.useEffect(() => {
  const handle = MessageManager.getInstance().subscribeMessage(
    props.id,
    (message) => console.log("received", message)
  );
  return () => handle.remove();
}, []);`,
    "read-config-in-widget": `
// Pattern: Read widget config set in setting panel
// In config.ts:
export interface Config {
  title: string;
  showLegend: boolean;
  layerUrl: string;
}
export type IMConfig = ImmutableObject<Config>;

// In widget.tsx — config is always up to date via props:
const Widget = (props: AllWidgetProps<IMConfig>) => {
  const title = props.config?.title ?? "Default Title";
  const showLegend = props.config?.showLegend ?? false;
  return <div>{title}</div>;
};

// In setting.tsx — save config changes:
const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  props.onSettingChange({
    id: props.id,
    config: props.config.set("title", e.target.value),
  });
};`,
    "query-feature-layer": `
// Pattern: Query a FeatureLayer via DataSource
import { QueriableDataSource, DataSource, FeatureLayerDataSource } from "jimu-core";

const queryFeatures = async (ds: DataSource) => {
  const qds = ds as QueriableDataSource;
  const result = await qds.query({
    where: "Population > 10000",
    outFields: ["*"],
    returnGeometry: true,
    pageSize: 100,
  });
  console.log("features:", result.records);
};`,
    "add-graphic-to-map": `
// Pattern: Add a graphic to the JimuMapView
import { JimuMapView } from "jimu-arcgis";
import Graphic from "esri/Graphic";
import Point from "esri/geometry/Point";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";

const addMarker = (jmv: JimuMapView, lon: number, lat: number) => {
  const graphic = new Graphic({
    geometry: new Point({ longitude: lon, latitude: lat }),
    symbol: new SimpleMarkerSymbol({
      color: [226, 119, 40],
      outline: { color: [255, 255, 255], width: 1 },
    }),
  });
  jmv.view.graphics.add(graphic);
};`,
    "setting-panel-datasource-selector": `
// Pattern: Let user pick a DataSource in setting panel
import { DataSourceSelector, AllDataSourceTypes } from "jimu-ui/advanced/data-source-selector";

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  return (
    <DataSourceSelector
      types={Immutable([AllDataSourceTypes.FeatureLayer])}
      useDataSources={props.useDataSources}
      useDataSourcesEnabled
      onChange={(useDataSources) =>
        props.onSettingChange({ id: props.id, useDataSources })
      }
    />
  );
};`,
    "setting-panel-map-selector": `
// Pattern: Let user pick a Map widget in setting panel
import { MapWidgetSelector } from "jimu-ui/advanced/setting-components";

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  return (
    <MapWidgetSelector
      useMapWidgetIds={props.useMapWidgetIds}
      onChange={(ids) =>
        props.onSettingChange({ id: props.id, useMapWidgetIds: ids })
      }
    />
  );
};`,
};
export function listWidgetPatterns(category) {
    if (category && PATTERNS[category]) {
        return PATTERNS[category];
    }
    if (category) {
        return `Pattern "${category}" not found.\n\nAvailable patterns:\n${Object.keys(PATTERNS).join("\n")}`;
    }
    return `Available ExB 1.20 widget patterns:

${Object.keys(PATTERNS)
        .map((k) => `• ${k}`)
        .join("\n")}

Call list_widget_patterns with a specific category to get the full code example.`;
}
