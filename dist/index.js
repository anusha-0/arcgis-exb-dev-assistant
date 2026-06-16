import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { scaffoldWidget } from "./tools/scaffold-widget.js";
import { generateManifest } from "./tools/generate-manifest.js";
import { explainJimuApi } from "./tools/explain-jimu-api.js";
import { debugWidget } from "./tools/debug-widget.js";
import { listWidgetPatterns } from "./tools/list-widget-patterns.js";
import { listWidgets, readWidgetFile, writeWidgetFile } from "./tools/file-system.js";
const server = new McpServer({
    name: "exb-widget-dev",
    version: "1.0.0",
});
// ── Tool 1: Scaffold a new custom widget ──────────────────────────
server.tool("scaffold_widget", "Generate a complete ExB 1.20 custom widget scaffold", {
    widgetName: z.string().describe("PascalCase widget name, e.g. MyMapTool"),
    widgetType: z
        .enum(["map-tool", "data-table", "filter", "chart", "general"])
        .describe("Widget category"),
    hasSettings: z
        .boolean()
        .default(true)
        .describe("Include a setting panel"),
    useDataSource: z
        .boolean()
        .default(false)
        .describe("Wire up DataSourceComponent"),
    useJimuMapView: z
        .boolean()
        .default(false)
        .describe("Subscribe to JimuMapView"),
}, async (args) => {
    const result = scaffoldWidget(args);
    return { content: [{ type: "text", text: result }] };
});
// ── Tool 2: Generate manifest.json ───────────────────────────────
server.tool("generate_manifest", "Build a valid ExB 1.20 manifest.json for a custom widget", {
    widgetName: z.string(),
    label: z.string(),
    widgetType: z.enum(["map-tool", "data-table", "filter", "chart", "general"]),
    useDataSource: z.boolean().default(false),
    useMapWidget: z.boolean().default(false),
}, async (args) => {
    const result = generateManifest(args);
    return { content: [{ type: "text", text: result }] };
});
// ── Tool 3: Explain Jimu API ──────────────────────────────────────
server.tool("explain_jimu_api", "Get typed examples for Jimu framework APIs (JimuMapView, DataSourceComponent, widget messaging, etc.)", {
    topic: z.enum([
        "JimuMapView",
        "DataSourceComponent",
        "WidgetState",
        "MessageAction",
        "useWidgetStore",
        "MapWidgetSelector",
        "DataSourceSelector",
    ]),
}, async ({ topic }) => {
    const result = explainJimuApi(topic);
    return { content: [{ type: "text", text: result }] };
});
// ── Tool 4: Debug widget errors ───────────────────────────────────
server.tool("debug_widget", "Diagnose ExB/Jimu errors — shadow DOM, prop mismatches, hot-reload, DataSource issues", {
    errorMessage: z.string().describe("The error message or problem description"),
    codeSnippet: z.string().optional().describe("Relevant code snippet if available"),
}, async (args) => {
    const result = debugWidget(args);
    return { content: [{ type: "text", text: result }] };
});
// ── Tool 5: List widget patterns ──────────────────────────────────
server.tool("list_widget_patterns", "Get ExB 1.20 code patterns: DataSource, map extent, messaging, config, queries, graphics", {
    category: z.string().optional().describe("Pattern name e.g. consume-datasource, map-extent-change, inter-widget-messaging"),
}, async ({ category }) => {
    const result = listWidgetPatterns(category);
    return { content: [{ type: "text", text: result }] };
});
// ── Tool 6: List widgets in your-extensions ───────────────────────
server.tool("list_widgets", "List all custom widgets in client/your-extensions/widgets", {}, async () => {
    const result = listWidgets();
    return { content: [{ type: "text", text: result }] };
});
// ── Tool 7: Read a widget file ────────────────────────────────────
server.tool("read_widget_file", "Read a file from an existing custom widget in your-extensions/widgets", {
    widgetName: z.string().describe("Widget folder name e.g. my-map-tool"),
    filePath: z.string().describe("Relative path e.g. src/runtime/widget.tsx"),
}, async ({ widgetName, filePath }) => {
    const result = readWidgetFile(widgetName, filePath);
    return { content: [{ type: "text", text: result }] };
});
// ── Tool 8: Write a widget file ───────────────────────────────────
server.tool("write_widget_file", "Write a file directly into your-extensions/widgets — creates folders if needed", {
    widgetName: z.string().describe("Widget folder name e.g. my-map-tool"),
    filePath: z.string().describe("Relative path e.g. src/runtime/widget.tsx"),
    content: z.string().describe("Full file content to write"),
}, async ({ widgetName, filePath, content }) => {
    const result = writeWidgetFile(widgetName, filePath, content);
    return { content: [{ type: "text", text: result }] };
});
// ── Start server ──────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
