import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, AlertCircle, BarChart2, Cpu, Database, Settings, Users, Filter, RefreshCw, Play, Pause, RotateCcw, Gauge, Waves, Zap, Thermometer } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SimulationParams {
  waferThroughput: number;
  alignmentPrecision: number;
  thermalStability: number;
  vibrationControl: number;
  vacuumPressure: number;
  opticalPower: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

interface MetricData {
  time: string;
  overlayAccuracy: number;  // nm (nanometers)
  focusStability: number;   // nm
  throughputRate: number;   // wafers per hour
  temperatureVariation: number; // mK (milliKelvin)
  vibrationLevel: number;   // nm RMS
  vacuumQuality: number;    // mbar
}

function App() {
  const [chartType, setChartType] = useState('line');
  const [metrics, setMetrics] = useState(['overlayAccuracy', 'focusStability', 'throughputRate', 'temperatureVariation', 'vibrationLevel', 'vacuumQuality']);
  const [showAlerts, setShowAlerts] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1000);
  const [performanceData, setPerformanceData] = useState<MetricData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const [params, setParams] = useState<SimulationParams>({
    waferThroughput: 70,      // Target wafers per hour
    alignmentPrecision: 80,   // Precision level for alignment
    thermalStability: 75,     // Thermal control efficiency
    vibrationControl: 85,     // Vibration dampening efficiency
    vacuumPressure: 90,       // Vacuum system efficiency
    opticalPower: 65,         // Optical system efficiency
  });

  const generateMetrics = useCallback((prevMetrics: MetricData[] = [], params: SimulationParams): MetricData => {
    const time = new Date().toLocaleTimeString();

    // Realistic interdependencies and calculations
    const baseOverlay = 2.5; // Base overlay error in nm
    const overlayAccuracy = Math.max(0.5, 
      baseOverlay * (1 - params.alignmentPrecision / 100) + 
      (Math.random() * 0.5 - 0.25)
    );

    const baseFocus = 10; // Base focus variation in nm
    const focusStability = Math.max(1,
      baseFocus * (1 - params.opticalPower / 100) * 
      (1 + (1 - params.vibrationControl / 100)) +
      (Math.random() * 2 - 1)
    );

    const baseTemp = 1.0; // Base temperature variation in mK
    const temperatureVariation = Math.max(0.1,
      baseTemp * (1 - params.thermalStability / 100) +
      (Math.random() * 0.2 - 0.1)
    );

    const baseVibration = 3.0; // Base vibration in nm RMS
    const vibrationLevel = Math.max(0.1,
      baseVibration * (1 - params.vibrationControl / 100) +
      (Math.random() * 0.4 - 0.2)
    );

    const baseVacuum = 1e-6; // Base vacuum level in mbar
    const vacuumQuality = Math.max(1e-7,
      baseVacuum * (2 - params.vacuumPressure / 100) +
      (Math.random() * 1e-7)
    );

    const throughputRate = Math.max(1,
      params.waferThroughput * 
      (1 - Math.max(overlayAccuracy - 2, 0) / 10) * 
      (1 - Math.max(focusStability - 8, 0) / 20) * 
      (1 - Math.max(temperatureVariation - 0.8, 0) / 5)
    );

    // Generate alerts based on realistic thresholds
    if (overlayAccuracy > 3.0) {
      addAlert('error', `Critical overlay error: ${overlayAccuracy.toFixed(2)}nm`);
    }
    if (focusStability > 12) {
      addAlert('error', `Focus stability exceeding spec: ${focusStability.toFixed(1)}nm`);
    }
    if (temperatureVariation > 1.2) {
      addAlert('warning', `Temperature variation high: ${temperatureVariation.toFixed(2)}mK`);
    }
    if (vibrationLevel > 2.5) {
      addAlert('warning', `High vibration levels: ${vibrationLevel.toFixed(2)}nm RMS`);
    }
    if (vacuumQuality > 2e-6) {
      addAlert('error', `Vacuum pressure out of spec: ${vacuumQuality.toExponential(1)} mbar`);
    }

    return {
      time,
      overlayAccuracy: Number(overlayAccuracy.toFixed(2)),
      focusStability: Number(focusStability.toFixed(1)),
      throughputRate: Math.round(throughputRate),
      temperatureVariation: Number(temperatureVariation.toFixed(2)),
      vibrationLevel: Number(vibrationLevel.toFixed(2)),
      vacuumQuality: Number(vacuumQuality.toExponential(1)),
    };
  }, []);

  const addAlert = (type: 'warning' | 'error' | 'info', message: string) => {
    const newAlert = {
      id: uuidv4(),
      type,
      message,
      timestamp: new Date().toLocaleString(),
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 5));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSimulating) {
      interval = setInterval(() => {
        setPerformanceData(prev => {
          const newMetric = generateMetrics(prev, params);
          return [...prev.slice(-20), newMetric];
        });
      }, simulationSpeed);
    }

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, params, generateMetrics]);

  const resetSimulation = () => {
    setPerformanceData([]);
    setAlerts([]);
    setParams({
      waferThroughput: 70,
      alignmentPrecision: 80,
      thermalStability: 75,
      vibrationControl: 85,
      vacuumPressure: 90,
      opticalPower: 65,
    });
  };

  const metricColors = {
    overlayAccuracy: '#2563eb',
    focusStability: '#16a34a',
    throughputRate: '#dc2626',
    temperatureVariation: '#9333ea',
    vibrationLevel: '#ea580c',
    vacuumQuality: '#0891b2',
  };

  const metricLabels = {
    overlayAccuracy: 'Overlay (nm)',
    focusStability: 'Focus (nm)',
    throughputRate: 'Throughput (wph)',
    temperatureVariation: 'Temp (mK)',
    vibrationLevel: 'Vibration (nm RMS)',
    vacuumQuality: 'Vacuum (mbar)',
  };

  const parameterDescriptions = {
    waferThroughput: 'Target wafers per hour processing rate',
    alignmentPrecision: 'Wafer alignment system precision control',
    thermalStability: 'Environmental temperature control efficiency',
    vibrationControl: 'Mechanical vibration dampening system',
    vacuumPressure: 'Vacuum system maintenance efficiency',
    opticalPower: 'Optical system performance level',
  };

  const toggleMetric = (metric: string) => {
    setMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const getLatestMetric = () => performanceData[performanceData.length - 1] || {
    overlayAccuracy: 0,
    focusStability: 0,
    throughputRate: 0,
    temperatureVariation: 0,
    vibrationLevel: 0,
    vacuumQuality: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">System Dynamics Simulator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowAlerts(!showAlerts)}
              className={`p-2 rounded-full transition-colors ${showAlerts ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <AlertCircle className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simulation Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">System Parameters</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isSimulating
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isSimulating ? 'Pause' : 'Start'} Simulation
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <span className="text-xs text-gray-500">{value}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setParams(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">{parameterDescriptions[key]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Gauge className="h-6 w-6 text-blue-600" />}
            title="Overlay Accuracy"
            value={`${getLatestMetric().overlayAccuracy} nm`}
            target="< 3.0 nm"
            status={getLatestMetric().overlayAccuracy <= 3.0}
          />
          <StatCard
            icon={<Waves className="h-6 w-6 text-green-600" />}
            title="Focus Stability"
            value={`${getLatestMetric().focusStability} nm`}
            target="< 12 nm"
            status={getLatestMetric().focusStability <= 12}
          />
          <StatCard
            icon={<Zap className="h-6 w-6 text-red-600" />}
            title="Throughput"
            value={`${getLatestMetric().throughputRate} wph`}
            target="> 60 wph"
            status={getLatestMetric().throughputRate >= 60}
          />
          <StatCard
            icon={<Thermometer className="h-6 w-6 text-purple-600" />}
            title="Temperature Variation"
            value={`${getLatestMetric().temperatureVariation} mK`}
            target="< 1.2 mK"
            status={getLatestMetric().temperatureVariation <= 1.2}
          />
          <StatCard
            icon={<Activity className="h-6 w-6 text-orange-600" />}
            title="Vibration Level"
            value={`${getLatestMetric().vibrationLevel} nm RMS`}
            target="< 2.5 nm"
            status={getLatestMetric().vibrationLevel <= 2.5}
          />
          <StatCard
            icon={<Gauge className="h-6 w-6 text-cyan-600" />}
            title="Vacuum Quality"
            value={`${getLatestMetric().vacuumQuality} mbar`}
            target="< 2e-6 mbar"
            status={getLatestMetric().vacuumQuality <= 2e-6}
          />
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold">Performance Metrics</h2>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Simulation Speed */}
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-gray-500" />
                <select 
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                  className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value={2000}>Slow</option>
                  <option value={1000}>Normal</option>
                  <option value={500}>Fast</option>
                </select>
              </div>

              {/* Chart Type Selector */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                </select>
              </div>

              {/* Metric Toggles */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(metricLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleMetric(key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      metrics.includes(key)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {metrics.map(metric => (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={metricColors[metric]}
                      name={metricLabels[metric]}
                    />
                  ))}
                </LineChart>
              ) : (
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {metrics.map(metric => (
                    <Bar
                      key={metric}
                      dataKey={metric}
                      fill={metricColors[metric]}
                      name={metricLabels[metric]}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Section */}
        {showAlerts && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id} {...alert} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, target, status }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-3 text-sm font-medium text-gray-900">{title}</h3>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          Target: {target}
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Alert({ type, message, timestamp }) {
  const alertStyles = {
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className={`flex items-center p-4 border rounded-lg ${alertStyles[type]}`}>
      <AlertCircle className="h-5 w-5 mr-3" />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs opacity-75">{timestamp}</p>
      </div>
    </div>
  );
}

export default App;