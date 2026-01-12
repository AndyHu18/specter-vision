/**
 * @file    : analysis.ts
 * @purpose : TypeScript 型別定義 - 與後端 Schema 對應
 */

/** AI 自主發現的動態屬性 */
export interface DynamicAttribute {
  attribute_name: string;
  detection_logic: string;
  black_tech_insight: string;
  shock_value: number;
  coordinates?: {
    x: number;
    y: number;
    radius: number;
  };
}

/** 完整的分析結果 */
export interface AnalysisResult {
  success: boolean;
  image_summary: string;
  attributes: DynamicAttribute[];
  processing_time_ms?: number;
}

/** SSE 事件類型 */
export type SSEEventType = 'progress' | 'attribute' | 'complete' | 'error';

/** SSE 進度事件 */
export interface ProgressEvent {
  message: string;
}

/** SSE 屬性事件 */
export interface AttributeEvent {
  index: number;
  total: number;
  attribute: DynamicAttribute;
}

/** SSE 完成事件 */
export interface CompleteEvent {
  image_summary: string;
  total_attributes: number;
  processing_time_ms: number;
}

/** SSE 錯誤事件 */
export interface ErrorEvent {
  error: string;
  message: string;
}

/** 分析狀態 */
export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
