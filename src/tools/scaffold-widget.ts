interface ScaffoldArgs {
  widgetName: string;
  widgetType: string;
  hasSettings: boolean;
  useDataSource: boolean;
  useJimuMapView: boolean;
}

export function scaffoldWidget(args: ScaffoldArgs): string {
  const { widgetName, hasSettings, useDataSource, useJimuMapView } = args;
  const kebab = widgetName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  const jimuMapImport = useJimuMapView
    ? `import { JimuMapView, JimuMapViewComponent } from "jimu-arcgis";`
    : "";

  const dsImport = useDataSource
    ? `import { DataSourceComponent, DataSource, QueriableDataSource } from "jimu-core";`
    : "";

  const mapViewState = useJimuMapView
    ? `const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null);`
    : "";

  const mapViewJSX = useJimuMapView
    ? `<JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={setJimuMapView}
      />`
    : "";

  const dsJSX = useDataSource
    ? `<DataSourceComponent
        useDataSource={props.useDataSources?.[0]}
        onDataSourceCreated={(ds) => console.log("DS ready", ds)}
      />`
    : "";

  const widget = `/** src/runtime/widget.tsx — ${widgetName} */
import React from "react";
import { AllWidgetProps } from "jimu-core";
${jimuMapImport}
${dsImport}
import { IMConfig } from "../config";

const Widget = (props: AllWidgetProps<IMConfig>) => {
  ${mapViewState}

  return (
    <div className="widget-${kebab} jimu-widget">
      <h3>${widgetName}</h3>
      ${mapViewJSX}
      ${dsJSX}
    </div>
  );
};

export default Widget;
`;

  const config = `/** src/config.ts */
import { ImmutableObject } from "jimu-core";

export interface Config {
  exampleProp: string;
}

export type IMConfig = ImmutableObject<Config>;
`;

  const settingPanel = hasSettings
    ? `/** src/setting/setting.tsx */
import React from "react";
import { AllWidgetSettingProps } from "jimu-for-builder";
import { IMConfig } from "../config";

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  return (
    <div className="widget-${kebab}-setting">
      <p>Settings for ${widgetName}</p>
    </div>
  );
};

export default Setting;
`
    : "";

  return [
    "=== src/runtime/widget.tsx ===",
    widget,
    "=== src/config.ts ===",
    config,
    hasSettings ? "=== src/setting/setting.tsx ===" : "",
    settingPanel,
  ]
    .filter(Boolean)
    .join("\n\n");
}