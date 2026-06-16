const API_DOCS: Record<string, string> = {
  JimuMapView: `
// Subscribe to the active JimuMapView
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";

const [view, setView] = React.useState<JimuMapView>(null);

<JimuMapViewComponent
  useMapWidgetId={props.useMapWidgetIds[0]}
  onActiveViewChange={(jmv) => setView(jmv)}
/>

// Access the ArcGIS MapView
view.view.zoom = 10;
view.view.goTo({ center: [longitude, latitude], zoom: 12 });
`,

  DataSourceComponent: `
import { DataSourceComponent, DataSource } from "jimu-core";

<DataSourceComponent
  useDataSource={props.useDataSources?.[0]}
  onDataSourceCreated={(ds: DataSource) => {
    console.log("records:", ds.getRecords());
  }}
  onSelectionChange={(ds) => {
    console.log("selected:", ds.getSelectedRecords());
  }}
/>
`,

  MessageAction: `
// Publish a message from your widget
import { MessageManager, RecordSetChangeMessage } from "jimu-core";

MessageManager.getInstance().publishMessage(
  new RecordSetChangeMessage(props.id, recordSet)
);
`,

  WidgetState: `
import { WidgetManager, WidgetState } from "jimu-core";

// Get another widget's state
const state = WidgetManager.getInstance().getWidgetState(widgetId);

// Set your own state
props.dispatch(appActions.widgetStatePropChange(props.id, "myProp", value));
`,
};

export function explainJimuApi(topic: string): string {
  return (
    API_DOCS[topic] ??
    `No example found for "${topic}". Available: ${Object.keys(API_DOCS).join(", ")}`
  );
}