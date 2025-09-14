import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./App.css";

function App() {
  const [energyData, setEnergyData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Fetch data from Django API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/energy/")
      .then((res) => {
        setEnergyData(res.data);
        checkAlerts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  // Check for alert conditions
  const checkAlerts = (data) => {
    let newAlerts = [];

    if (data.length > 0) {
      const latest = data[data.length - 1];

      // Battery Alert
      if (latest.battery_level < 20) {
        newAlerts.push("⚠️ Battery level is below 20%!");
      }

      // Solar Drop Alert
      if (data.length > 1) {
        const prev = data[data.length - 2];
        if (prev.solar_output > 0) {
          const dropPercent = ((prev.solar_output - latest.solar_output) / prev.solar_output) * 100;
          if (dropPercent > 50) {
            newAlerts.push("⚠️ Sudden drop in solar output detected!");
          }
        }
      }
    }

    setAlerts(newAlerts);
  };

  // Helpers
  const computeAverages = (data) => {
    if (data.length === 0) return [];
    const solarAvg = data.reduce((sum, d) => sum + d.solar_output, 0) / data.length;
    const batteryAvg = data.reduce((sum, d) => sum + d.battery_level, 0) / data.length;
    const dieselAvg = data.reduce((sum, d) => sum + d.diesel_usage, 0) / data.length;
    return [
      { name: "Solar (kW)", value: solarAvg },
      { name: "Battery (%)", value: batteryAvg },
      { name: "Diesel (L/hr)", value: dieselAvg },
    ];
  };

  const computeDistribution = (data) => {
    if (data.length === 0) return [];
    const solarSum = data.reduce((sum, d) => sum + d.solar_output, 0);
    const batterySum = data.reduce((sum, d) => sum + d.battery_level, 0);
    const dieselSum = data.reduce((sum, d) => sum + d.diesel_usage, 0);
    return [
      { name: "Solar", value: solarSum },
      { name: "Battery", value: batterySum },
      { name: "Diesel", value: dieselSum },
    ];
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1>Energy Monitoring Dashboard</h1>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="alerts">
          {alerts.map((alert, idx) => (
            <div key={idx} className="alert-item">
              {alert}
            </div>
          ))}
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Table */}
        <div className="card">
          <h2>Energy Data Table</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Solar Output (kW)</th>
                  <th>Battery Level (%)</th>
                  <th>Diesel Usage (L/hr)</th>
                </tr>
              </thead>
              <tbody>
                {energyData.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.timestamp).toLocaleString()}</td>
                    <td>{entry.solar_output}</td>
                    <td>{entry.battery_level}</td>
                    <td>{entry.diesel_usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Line Chart */}
        <div className="card">
          <h2>Energy Trends Over Time</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(str) => new Date(str).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="solar_output" stroke="#facc15" name="Solar (kW)" />
              <Line type="monotone" dataKey="battery_level" stroke="#22c55e" name="Battery (%)" />
              <Line type="monotone" dataKey="diesel_usage" stroke="#ef4444" name="Diesel (L/hr)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h2>Average Energy Metrics</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={computeAverages(energyData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h2>Energy Source Distribution</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={computeDistribution(energyData)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                <Cell fill="#facc15" />
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
