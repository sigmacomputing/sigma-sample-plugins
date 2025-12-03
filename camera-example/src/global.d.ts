export {};

declare global {
  interface Window {
    getConfig: () => Config;
    getColumnData: () => ElementData;
    getColumnInfo: () => ElementColumns;
  }
}
