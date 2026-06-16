import * as fs from "fs";
import * as path from "path";

const EXB_WIDGETS_PATH =
  "D:\\arcgis-experience-builder-1.20\\client\\your-extensions\\widgets";

export function listWidgets(): string {
  if (!fs.existsSync(EXB_WIDGETS_PATH)) {
    return `Widgets folder not found at: ${EXB_WIDGETS_PATH}`;
  }
  const items = fs.readdirSync(EXB_WIDGETS_PATH);
  return items.length === 0
    ? "No custom widgets found."
    : `Widgets found:\n${items.join("\n")}`;
}

export function readWidgetFile(widgetName: string, filePath: string): string {
  const fullPath = path.join(EXB_WIDGETS_PATH, widgetName, filePath);
  if (!fs.existsSync(fullPath)) {
    return `File not found: ${fullPath}`;
  }
  return fs.readFileSync(fullPath, "utf-8");
}

export function writeWidgetFile(
  widgetName: string,
  filePath: string,
  content: string
): string {
  const fullPath = path.join(EXB_WIDGETS_PATH, widgetName, filePath);
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");
  return `Written: ${fullPath}`;
}