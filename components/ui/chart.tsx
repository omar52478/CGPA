"use client"

import type React from "react"

import { Chart as ChartJS, registerables } from "chart.js"
import { Line, Pie, Radar, Bar, Doughnut, PolarArea, Bubble, Scatter } from "react-chartjs-2"
import { forwardRef } from "react"

// Import and register all Chart.js components
ChartJS.register(...registerables)

// Set default options to avoid common errors
ChartJS.defaults.font.family = "'Inter', sans-serif"
ChartJS.defaults.color = "rgba(255, 255, 255, 0.7)"
ChartJS.defaults.scale.grid.color = "rgba(255, 255, 255, 0.1)"
ChartJS.defaults.scale.ticks.color = "rgba(255, 255, 255, 0.7)"
ChartJS.defaults.scale.grid.display = true
ChartJS.defaults.scale.display = true

export const ChartContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={className || "w-full h-full relative"}>{children}</div>
}

export const ChartLegend = () => {
  return <></>
}

export const ChartTooltip = () => {
  return <></>
}

export const ChartTooltipContent = () => {
  return <></>
}

export const ChartTooltipItem = () => {
  return <></>
}

export const ChartTooltipLabel = () => {
  return <></>
}

export const ChartTooltipValue = () => {
  return <></>
}

export const Chart = forwardRef<ChartJS, any>(({ type = "line", ...props }, ref) => {
  if (type === "line") {
    return <Line ref={ref} {...props} />
  }
  return null
})
Chart.displayName = "Chart"

export const LineChart = (props: any) => {
  return <Line {...props} />
}

export const PieChart = (props: any) => {
  return <Pie {...props} />
}

export const RadarChart = (props: any) => {
  return <Radar {...props} />
}

export const BarChart = (props: any) => {
  return <Bar {...props} />
}

export const DoughnutChart = (props: any) => {
  return <Doughnut {...props} />
}

export const PolarAreaChart = (props: any) => {
  return <PolarArea {...props} />
}

export const BubbleChart = (props: any) => {
  return <Bubble {...props} />
}

export const ScatterChart = (props: any) => {
  return <Scatter {...props} />
}