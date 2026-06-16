interface ManifestArgs {
  widgetName: string;
  label: string;
  widgetType: string;
  useDataSource: boolean;
  useMapWidget: boolean;
}

export function generateManifest(args: ManifestArgs): string {
  const { widgetName, label, useDataSource, useMapWidget } = args;

  const manifest = {
    name: widgetName,
    label,
    type: "widget",
    version: "1.20.0",
    exbVersion: "1.20.0",
    author: "",
    description: "",
    translatedLocales: ["en"],
    ...(useDataSource && {
      properties: { hasEmbeddedLayout: false },
      requiredDataSources: [],
    }),
    ...(useMapWidget && {
      properties: { hasEmbeddedLayout: false },
    }),
  };

  return JSON.stringify(manifest, null, 2);
}