"use client"

import { useState, useEffect } from "react"
import { Activity, Cpu, Database, HardDrive, Wifi, Server, Clock } from "lucide-react"
import "./App.css"

function App() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    uptime: 0,
    servers: 0,
    alerts: 0,
  })

  const [time, setTime] = useState(new Date())

  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        uptime: Math.floor(99.5 + Math.random() * 0.5),
        servers: 5 + Math.floor(Math.random() * 3),
        alerts: Math.floor(Math.random() * 5),
      })
      setTime(new Date())
    }, 3000)

    // Check if Telegram WebApp is available
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp
      webApp.ready()
      webApp.expand()

      // You can use webApp.initData to get data passed from Telegram
      console.log("Telegram WebApp initialized")
    }

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value) => {
    if (value < 50) return "bg-green-500"
    if (value < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">MoniPro</h1>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock className="h-5 w-5 mr-2" />
            <span>{time.toLocaleTimeString()}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard title="CPU Usage" value={`${metrics.cpu}%`} icon={<Cpu />} status={getStatusColor(metrics.cpu)} />
          <MetricCard
            title="Memory Usage"
            value={`${metrics.memory}%`}
            icon={<Database />}
            status={getStatusColor(metrics.memory)}
          />
          <MetricCard
            title="Disk Usage"
            value={`${metrics.disk}%`}
            icon={<HardDrive />}
            status={getStatusColor(metrics.disk)}
          />
          <MetricCard
            title="Network"
            value={`${metrics.network}%`}
            icon={<Wifi />}
            status={getStatusColor(metrics.network)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard title="System Uptime" value={`${metrics.uptime}%`} description="Last 30 days" trend="up" />
          <SummaryCard
            title="Active Servers"
            value={metrics.servers}
            description="Online and healthy"
            trend="neutral"
          />
          <SummaryCard
            title="Active Alerts"
            value={metrics.alerts}
            description="Requiring attention"
            trend={metrics.alerts > 2 ? "down" : "neutral"}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Status</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((server) => (
              <ServerStatus
                key={server}
                name={`Server ${server}`}
                status={Math.random() > 0.2 ? "online" : "warning"}
                lastChecked={`${Math.floor(Math.random() * 10) + 1} min ago`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ title, value, icon, status }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
        <div className="text-gray-600 dark:text-gray-300">{icon}</div>
      </div>
      <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className={`${status} h-2 rounded-full`} style={{ width: value }}></div>
      </div>
    </div>
  )
}

const SummaryCard = ({ title, value, description, trend }) => {
  const getTrendIcon = () => {
    if (trend === "up") return <span className="text-green-500">↑</span>
    if (trend === "down") return <span className="text-red-500">↓</span>
    return <span className="text-gray-500">→</span>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <div className="flex items-baseline mt-1">
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        <span className="ml-2 text-sm">{getTrendIcon()}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  )
}

const ServerStatus = ({ name, status, lastChecked }) => {
  const getStatusIndicator = () => {
    if (status === "online") {
      return <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
    }
    if (status === "warning") {
      return <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
    }
    return <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Server className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
        <span className="text-gray-800 dark:text-white">{name}</span>
      </div>
      <div className="flex items-center">
        {getStatusIndicator()}
        <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">
          {status === "online" ? "Online" : status === "warning" ? "Warning" : "Offline"}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{lastChecked}</span>
      </div>
    </div>
  )
}

export default App
