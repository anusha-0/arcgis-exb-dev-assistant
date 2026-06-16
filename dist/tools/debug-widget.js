const KNOWN_ISSUES = [
    {
        pattern: /Cannot read prop.*useMapWidgetIds/i,
        fix: `useMapWidgetIds is undefined. In manifest.json add:
"properties": { "hasEmbeddedLayout": false }
And in widget.tsx guard with:
props.useMapWidgetIds?.[0]`,
    },
    {
        pattern: /jimu-arcgis.*not found|cannot find module.*jimu-arcgis/i,
        fix: `jimu-arcgis is not a real npm package — it is provided by ExB at runtime.
In tsconfig.json paths add:
"jimu-arcgis": ["./node_modules/jimu-arcgis"]
Or ignore the TS error with // @ts-ignore above the import.`,
    },
    {
        pattern: /Cannot find module.*jimu-core|jimu-ui/i,
        fix: `jimu-core and jimu-ui are ExB runtime modules. They are available inside
client/dist at runtime but not resolvable by tsc directly.
Make sure your widget is inside client/your-extensions/widgets/ so ExB's
webpack config can resolve jimu-* aliases correctly.`,
    },
    {
        pattern: /hot.reload|hot reload|hmr/i,
        fix: `ExB hot reload issues:
1. Stop the dev server (Ctrl+C)
2. Delete client/dist/widgets/<your-widget> folder
3. Restart: npm start (inside client folder)
4. Hard refresh browser: Ctrl+Shift+R`,
    },
    {
        pattern: /shadow.?dom|calcite.*style|style.*not.*applied/i,
        fix: `Calcite/Shadow DOM styling issue. You cannot pierce shadow DOM with 
regular CSS. Solutions:
1. Use CSS custom properties (--calcite-color-brand etc.)
2. Use jimu-ui ThemeContext for themed styles
3. Use ::part() selector if the component exposes parts
4. Wrap with <div className="jimu-widget"> to get theme variables`,
    },
    {
        pattern: /ImmutableObject|immutable.*assign|cannot assign.*immutable/i,
        fix: `ImmutableObject cannot be mutated directly. Use:
import { ImmutableHelper } from "jimu-core";
const updated = ImmutableHelper.set(props.config, "myProp", newValue);
props.onSettingChange({ id: props.id, config: updated });`,
    },
    {
        pattern: /prop.*type.*mismatch|type.*not assignable.*AllWidgetProps/i,
        fix: `AllWidgetProps type mismatch. Make sure your Config interface is wrapped:
import { ImmutableObject } from "jimu-core";
export type IMConfig = ImmutableObject<Config>;
Then use: AllWidgetProps<IMConfig> not AllWidgetProps<Config>`,
    },
    {
        pattern: /datasource.*undefined|getrecords.*not a function/i,
        fix: `DataSource is not ready yet. Always guard:
if (!ds || ds.getStatus() !== DataSourceStatus.Loaded) return;
const records = (ds as QueriableDataSource).getRecords();
Use onDataSourceCreated callback, not useEffect for initialization.`,
    },
    {
        pattern: /widget.*not.*showing|widget.*blank|white.*screen/i,
        fix: `Widget renders blank. Common causes:
1. Missing default export in widget.tsx
2. Runtime error swallowed silently — check browser console
3. manifest.json name does not match folder name exactly
4. Missing "jimu-widget" className on root div
5. Check client/dist/widgets/<name> exists after save`,
    },
    {
        pattern: /settingchange.*not.*working|config.*not.*saving/i,
        fix: `Settings not persisting. In setting.tsx use:
props.onSettingChange({
  id: props.id,
  config: props.config.set("yourProp", value)
});
Make sure you are NOT calling setState — config must go through onSettingChange.`,
    },
];
export function debugWidget(args) {
    const input = `${args.errorMessage} ${args.codeSnippet ?? ""}`;
    const matches = KNOWN_ISSUES.filter((issue) => issue.pattern.test(input));
    if (matches.length === 0) {
        return `No specific ExB/Jimu pattern matched for this error.

General debugging checklist:
1. Check browser DevTools console for runtime errors
2. Verify widget folder name matches manifest.json "name" field exactly
3. Confirm widget is inside client/your-extensions/widgets/
4. Check jimu-* imports are used inside ExB dev server context (npm start in client/)
5. Validate manifest.json is valid JSON with no trailing commas
6. Try deleting client/dist/widgets/<name> and restarting dev server

Error received:
${args.errorMessage}
${args.codeSnippet ? `\nCode snippet:\n${args.codeSnippet}` : ""}`;
    }
    return matches
        .map((m, i) => `--- Fix ${i + 1} ---\n${m.fix}`)
        .join("\n\n");
}
