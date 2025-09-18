import { ComponentType, ReactNode } from 'react';

declare module 'recharts' {
  export interface ChartData {
    [key: string]: any;
  }

  export interface LineChartProps {
    data?: ChartData[];
    width?: number;
    height?: number;
    children?: ReactNode;
    margin?: { top?: number; right?: number; left?: number; bottom?: number };
  }

  export interface AreaChartProps {
    data?: ChartData[];
    width?: number;
    height?: number;
    children?: ReactNode;
    margin?: { top?: number; right?: number; left?: number; bottom?: number };
  }

  export interface LineProps {
    type?: 'monotone' | 'linear' | 'step';
    dataKey?: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: boolean | ComponentType<any>;
  }

  export interface AreaProps {
    type?: 'monotone' | 'linear' | 'step';
    dataKey?: string;
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    dot?: boolean | ComponentType<any>;
    activeDot?: boolean | ComponentType<any>;
  }

  export interface XAxisProps {
    dataKey?: string;
    tickFormatter?: (value: any) => string;
    tick?: any;
    tickLine?: any;
  }

  export interface YAxisProps {
    tickFormatter?: (value: any) => string;
    tick?: any;
    tickLine?: any;
  }

  export interface CartesianGridProps {
    strokeDasharray?: string;
    stroke?: string;
  }

  export interface TooltipProps {
    formatter?: (value: any, name?: string) => [string, string];
    labelStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
  }

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: ReactNode;
  }

  export const LineChart: ComponentType<LineChartProps>;
  export const AreaChart: ComponentType<AreaChartProps>;
  export const Line: ComponentType<LineProps>;
  export const Area: ComponentType<AreaProps>;
  export const XAxis: ComponentType<XAxisProps>;
  export const YAxis: ComponentType<YAxisProps>;
  export const CartesianGrid: ComponentType<CartesianGridProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
}
