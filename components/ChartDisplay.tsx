"use client"

import { useEffect, useState } from "react"
import type { Subject } from "@/context/AppContext"
import { getSubjectContribution, getMaxPossibleContribution } from "@/utils/calculations"
import { gradeToGPA, type GradeKey } from "@/utils/gradeToGPA"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, LineChart, PieChart, RadarChart, BarChart, DoughnutChart } from "@/components/ui/chart"

// Add lazy loading for Plotly.js to improve initial load time
import dynamic from "next/dynamic"
// Modify the Plot import to be more efficient
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  ),
})

interface ChartDisplayProps {
  subjects: Subject[]
  gpa: number
}

export default function ChartDisplay({ subjects, gpa }: ChartDisplayProps) {
  const [activeTab, setActiveTab] = useState("3d")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="glass-card h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="ml-4">Loading charts...</p>
      </div>
    )
  }

  // Prepare data for charts
  const validSubjects = subjects.filter((s) => !isNaN(Number(s.hours)) && Number(s.hours) > 0 && s.grade in gradeToGPA)

  // Define a consistent color palette for better distinction between chart types
  const chartColors = {
    line: {
      primary: "rgba(255, 99, 132, 1)",
      secondary: "rgba(54, 162, 235, 1)",
      primaryBg: "rgba(255, 99, 132, 0.3)",
      secondaryBg: "rgba(54, 162, 235, 0.3)",
    },
    bar: {
      primary: "rgba(255, 206, 86, 0.8)",
      secondary: "rgba(75, 192, 192, 0.8)",
      border: "rgba(255, 255, 255, 0.5)",
    },
    pie: [
      "rgba(255, 99, 132, 0.8)",
      "rgba(54, 162, 235, 0.8)",
      "rgba(255, 206, 86, 0.8)",
      "rgba(75, 192, 192, 0.8)",
      "rgba(153, 102, 255, 0.8)",
      "rgba(255, 159, 64, 0.8)",
    ],
    doughnut: ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)"],
    radar: {
      primary: "rgba(255, 99, 132, 1)",
      secondary: "rgba(54, 162, 235, 1)",
      primaryBg: "rgba(255, 99, 132, 0.3)",
      secondaryBg: "rgba(54, 162, 235, 0.3)",
    },
  }

  // Data for Line Chart
  const lineData = {
    labels: validSubjects.map((s) => s.name),
    datasets: [
      {
        label: "Actual Contribution",
        data: validSubjects.map((s) => getSubjectContribution(s)),
        borderColor: chartColors.line.primary,
        backgroundColor: chartColors.line.primaryBg,
        tension: 0.3,
        fill: true,
      },
      {
        label: "Maximum Possible",
        data: validSubjects.map((s) => getMaxPossibleContribution(s)),
        borderColor: chartColors.line.secondary,
        backgroundColor: chartColors.line.secondaryBg,
        tension: 0.3,
        fill: true,
      },
    ],
  }

  // Data for Bar Chart
  const barData = {
    labels: validSubjects.map((s) => s.name),
    datasets: [
      {
        label: "Credit Hours",
        data: validSubjects.map((s) => Number(s.hours)),
        backgroundColor: chartColors.bar.primary,
        borderColor: chartColors.bar.border,
        borderWidth: 1,
      },
      {
        label: "GPA Value",
        data: validSubjects.map((s) => gradeToGPA[s.grade as GradeKey]?.gpa || 0),
        backgroundColor: chartColors.bar.secondary,
        borderColor: chartColors.bar.border,
        borderWidth: 1,
      },
    ],
  }

  // Data for Pie Chart
  const gradeDistribution: Record<string, number> = {}
  validSubjects.forEach((s) => {
    const label = gradeToGPA[s.grade as GradeKey]?.label || "Unknown"
    gradeDistribution[label] = (gradeDistribution[label] || 0) + 1
  })

  const pieData = {
    labels: Object.keys(gradeDistribution),
    datasets: [
      {
        label: "Grade Distribution",
        data: Object.values(gradeDistribution),
        backgroundColor: chartColors.pie,
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 2,
      },
    ],
  }

  // Data for Doughnut Chart - Credit Hours Distribution
  const hoursDistribution: Record<number, number> = {}
  validSubjects.forEach((s) => {
    const hours = Number(s.hours)
    hoursDistribution[hours] = (hoursDistribution[hours] || 0) + 1
  })

  const doughnutData = {
    labels: Object.keys(hoursDistribution).map((h) => `${h} Credit Hour${Number(h) > 1 ? "s" : ""}`),
    datasets: [
      {
        label: "Credit Hours Distribution",
        data: Object.values(hoursDistribution),
        backgroundColor: chartColors.doughnut,
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 2,
      },
    ],
  }

  // Data for Radar Chart
  const radarData = {
    labels: validSubjects.map((s) => s.name),
    datasets: [
      {
        label: "Grade Value",
        data: validSubjects.map((s) => gradeToGPA[s.grade as GradeKey]?.gpa || 0),
        backgroundColor: chartColors.radar.primaryBg,
        borderColor: chartColors.radar.primary,
        pointBackgroundColor: chartColors.radar.primary,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: chartColors.radar.primary,
      },
      {
        label: "Maximum (4.0)",
        data: validSubjects.map(() => 4.0),
        backgroundColor: chartColors.radar.secondaryBg,
        borderColor: chartColors.radar.secondary,
        pointBackgroundColor: chartColors.radar.secondary,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: chartColors.radar.secondary,
      },
    ],
  }

  // Data for 3D Scatter Plot
  const plotlyData = [
    {
      type: "scatter3d",
      mode: "markers",
      x: validSubjects.map((s) => Number(s.hours)),
      y: validSubjects.map((s) => gradeToGPA[s.grade as GradeKey]?.gpa || 0),
      z: validSubjects.map((s) => getSubjectContribution(s)),
      text: validSubjects.map(
        (s) => `
        <b>${s.name}</b><br>
        Credit Hours: ${s.hours}<br>
        Grade: ${gradeToGPA[s.grade as GradeKey]?.label || "Unknown"} (${s.grade})<br>
        Contribution: ${getSubjectContribution(s).toFixed(2)}<br>
        Percentage: ${gradeToGPA[s.grade as GradeKey]?.percentage || 0}%
      `,
      ),
      hoverinfo: "text",
      hoverlabel: {
        bgcolor: "#111",
        bordercolor: "#333",
        font: { family: "Inter, Arial", size: 12, color: "white" },
      },
      marker: {
        size: 10,
        color: validSubjects.map((s) => getSubjectContribution(s)),
        colorscale: "Viridis",
        opacity: 0.8,
        colorbar: {
          title: "Contribution",
          thickness: 20,
          tickfont: { color: "white" },
          titlefont: { color: "white" },
        },
        line: {
          color: "rgba(255, 255, 255, 0.5)",
          width: 1,
        },
      },
    },
  ]

  const plotlyLayout = {
    title: {
      text: "3D Visualization of Subject Contributions",
      font: { color: "white", family: "Inter, Arial", size: 18 },
    },
    scene: {
      xaxis: {
        title: {
          text: "Credit Hours",
          font: { color: "white", family: "Inter, Arial" },
        },
        titlefont: { color: "white" },
        tickfont: { color: "white" },
        gridcolor: "rgba(255, 255, 255, 0.1)",
        backgroundcolor: "rgba(0, 0, 0, 0)",
        showbackground: true,
        zerolinecolor: "rgba(255, 255, 255, 0.3)",
      },
      yaxis: {
        title: {
          text: "Grade GPA",
          font: { color: "white", family: "Inter, Arial" },
        },
        titlefont: { color: "white" },
        tickfont: { color: "white" },
        gridcolor: "rgba(255, 255, 255, 0.1)",
        backgroundcolor: "rgba(0, 0, 0, 0)",
        showbackground: true,
        zerolinecolor: "rgba(255, 255, 255, 0.3)",
      },
      zaxis: {
        title: {
          text: "Contribution",
          font: { color: "white", family: "Inter, Arial" },
        },
        titlefont: { color: "white" },
        tickfont: { color: "white" },
        gridcolor: "rgba(255, 255, 255, 0.1)",
        backgroundcolor: "rgba(0, 0, 0, 0)",
        showbackground: true,
        zerolinecolor: "rgba(255, 255, 255, 0.3)",
      },
      camera: {
        eye: { x: 1.8, y: 1.8, z: 1.5 },
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 0, r: 0, b: 0, t: 50 },
    autosize: true,
    font: { color: "white", family: "Inter, Arial" },
    showlegend: false,
  }

  // Common chart options for better styling
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.9)", // Increased contrast
          font: {
            family: "'Inter', sans-serif",
            size: 12, // Increased font size
          },
          padding: 15, // More padding
        },
        position: "top",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14, // Increased font size
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13, // Increased font size
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        usePointStyle: true,
        titleColor: "rgba(255, 255, 255, 1)", // Brighter text
        bodyColor: "rgba(255, 255, 255, 1)", // Brighter text
      },
    },
    scales: {
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)", // Increased contrast
          font: {
            size: 11, // Increased font size
          },
        },
      },
      x: {
        display: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.9)", // Increased contrast
          font: {
            size: 11, // Increased font size
          },
          maxRotation: 45, // Rotate labels for better fit
          minRotation: 45,
        },
      },
    },
  }

  return (
    <div className="glass-card p-4 sm:p-6 mt-8">
      <h2 className="text-2xl font-bold gradient-text mb-4 sm:mb-6">Data Visualization</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-4 sm:mb-6 bg-white bg-opacity-5 overflow-x-auto">
          <TabsTrigger value="3d" className="text-white font-medium">
            3D Scatter
          </TabsTrigger>
          <TabsTrigger value="line" className="text-white font-medium">
            Line Chart
          </TabsTrigger>
          <TabsTrigger value="bar" className="text-white font-medium">
            Bar Chart
          </TabsTrigger>
          <TabsTrigger value="pie" className="text-white font-medium">
            Pie Chart
          </TabsTrigger>
          <TabsTrigger value="doughnut" className="text-white font-medium">
            Doughnut
          </TabsTrigger>
          <TabsTrigger value="radar" className="text-white font-medium">
            Radar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="3d" className="h-80 sm:h-96">
          {validSubjects.length > 0 ? (
            activeTab === "3d" ? (
              <Plot
                data={plotlyData}
                layout={plotlyLayout}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse h-full w-full bg-white/5 rounded-lg"></div>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-white text-lg">Add subjects to see the 3D visualization</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="line" className="h-80 sm:h-96">
          {validSubjects.length > 0 ? (
            <ChartContainer className="h-full">
              <LineChart
                data={lineData}
                options={{
                  ...commonChartOptions,
                  elements: {
                    line: {
                      tension: 0.3,
                      borderWidth: 3,
                    },
                    point: {
                      radius: 5,
                      hoverRadius: 7,
                    },
                  },
                  interaction: {
                    mode: "index",
                    intersect: false,
                  },
                }}
              />
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-white text-lg">Add subjects to see the line chart</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bar" className="h-80 sm:h-96">
          {validSubjects.length > 0 ? (
            <ChartContainer className="h-full">
              <BarChart
                data={barData}
                options={{
                  ...commonChartOptions,
                  scales: {
                    ...commonChartOptions.scales,
                    y: {
                      ...commonChartOptions.scales.y,
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-white text-lg">Add subjects to see the bar chart</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pie" className="h-80 sm:h-96">
          {validSubjects.length > 0 ? (
            <ChartContainer className="h-full">
              <PieChart
                data={pieData}
                options={{
                  ...commonChartOptions,
                  plugins: {
                    ...commonChartOptions.plugins,
                    legend: {
                      ...commonChartOptions.plugins.legend,
                      position: "right",
                    },
                    tooltip: {
                      ...commonChartOptions.plugins.tooltip,
                      callbacks: {
                        label: (context: any) => {
                          const label = context.label || ""
                          const value = context.raw || 0
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                          const percentage = ((value / total) * 100).toFixed(1)
                          return `${label}: ${value} (${percentage}%)`
                        },
                      },
                    },
                  },
                  elements: {
                    arc: {
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-white text-lg">Add subjects to see the pie chart</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="doughnut" className="h-80 sm:h-96">
          {validSubjects.length > 0 ? (
            <ChartContainer className="h-full">
              <DoughnutChart
                data={doughnutData}
                options={{
                  ...commonChartOptions,
                  cutout: "60%",
                  plugins: {
                    ...commonChartOptions.plugins,
                    legend: {
                      ...commonChartOptions.plugins.legend,
                      position: "right",
                    },
                  },
                }}
              />
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-white text-lg">Add subjects to see the doughnut chart</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="radar" className="h-80 sm:h-96">
          {validSubjects.length > 0 ? (
            <ChartContainer className="h-full">
              <RadarChart
                data={radarData}
                options={{
                  ...commonChartOptions,
                  scales: {
                    r: {
                      display: true,
                      min: 0,
                      max: 4,
                      pointLabels: {
                        color: "rgba(255, 255, 255, 0.9)", // Increased contrast
                        font: {
                          size: 11, // Increased font size
                        },
                      },
                      grid: {
                        color: "rgba(255, 255, 255, 0.2)", // More visible grid
                      },
                      angleLines: {
                        color: "rgba(255, 255, 255, 0.2)", // More visible angle lines
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.9)", // Increased contrast
                        backdropColor: "transparent",
                        stepSize: 1,
                        font: {
                          size: 10, // Increased font size
                        },
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                    },
                    point: {
                      radius: 3,
                      hoverRadius: 5,
                    },
                  },
                }}
              />
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-white text-lg">Add subjects to see the radar chart</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {validSubjects.length > 0 && (
        <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <h3 className="text-sm text-center text-white mb-2 font-medium">Subject Performance</h3>
            <div className="overflow-x-auto max-h-40">
              <table className="w-full text-sm">
                <thead className="bg-white bg-opacity-10">
                  <tr>
                    <th className="px-2 py-1 text-left text-white">Subject</th>
                    <th className="px-2 py-1 text-center text-white">Grade</th>
                    <th className="px-2 py-1 text-right text-white">Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {validSubjects.map((subject) => (
                    <tr key={subject.id} className="border-t border-white border-opacity-10">
                      <td className="px-2 py-1 text-left truncate max-w-[150px] text-white">{subject.name}</td>
                      <td className="px-2 py-1 text-center text-white">
                        {gradeToGPA[subject.grade as GradeKey]?.label || "N/A"}
                      </td>
                      <td className="px-2 py-1 text-right text-white">{getSubjectContribution(subject).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-sm text-center text-white mb-2 font-medium">Best & Worst Performers</h3>
            <div className="space-y-2">
              <div className="bg-white bg-opacity-10 p-2 rounded">
                <div className="text-xs text-white">Best Performing Subject</div>
                <div className="font-medium text-white">
                  {validSubjects.sort((a, b) => getSubjectContribution(b) - getSubjectContribution(a))[0]?.name ||
                    "N/A"}
                </div>
                <div className="text-xs text-white">
                  Grade:{" "}
                  {validSubjects.sort((a, b) => getSubjectContribution(b) - getSubjectContribution(a))[0]?.grade ||
                    "N/A"}
                </div>
              </div>
              <div className="bg-white bg-opacity-10 p-2 rounded">
                <div className="text-xs text-white">Needs Improvement</div>
                <div className="font-medium text-white">
                  {validSubjects.sort((a, b) => getSubjectContribution(a) - getSubjectContribution(b))[0]?.name ||
                    "N/A"}
                </div>
                <div className="text-xs text-white">
                  Grade:{" "}
                  {validSubjects.sort((a, b) => getSubjectContribution(a) - getSubjectContribution(b))[0]?.grade ||
                    "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-sm text-center text-white mb-2 font-medium">Grade Summary</h3>
            <div className="space-y-2">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="flex justify-between items-center">
                  <span className="text-sm text-white">{grade}</span>
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${(count / validSubjects.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
