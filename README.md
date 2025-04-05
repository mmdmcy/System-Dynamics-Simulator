# System Dynamics Simulator

A real-time system dynamics visualization and monitoring dashboard for high-precision manufacturing environments. This interactive simulator demonstrates complex system interactions and performance metrics crucial for semiconductor and advanced manufacturing processes.

## Features

### Real-Time Monitoring
- **Dynamic Visualization**: Live charts and graphs showing system performance metrics
- **Customizable Views**: Toggle between different metrics and chart types
- **Alert System**: Real-time notifications for out-of-spec conditions

### Key Metrics
- **Overlay Accuracy**: Measures positioning precision in nanometers
- **Focus Stability**: Tracks optical system performance
- **Temperature Variation**: Monitors thermal stability in milliKelvin
- **Vibration Levels**: Measures mechanical stability in nm RMS
- **Vacuum Quality**: Tracks environmental control in mbar
- **System Throughput**: Monitors production rate in wafers per hour

### Interactive Controls
- **System Parameters**:
  - Wafer Throughput Control
  - Alignment Precision
  - Thermal Stability
  - Vibration Control
  - Vacuum Pressure
  - Optical Power

- **Simulation Controls**:
  - Start/Pause Functionality
  - Adjustable Simulation Speed
  - System Reset
  - Chart Type Selection

## Technical Details

### Built With
- React 18
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons

### Key Components
- Real-time data generation with realistic physics-based calculations
- Interactive parameter controls with immediate feedback
- Comprehensive alert system for monitoring critical thresholds
- Responsive design for various screen sizes

## Use Cases

### Manufacturing Process Optimization
- Simulate and visualize system dynamics in real-time
- Identify performance bottlenecks
- Test different parameter configurations
- Train operators on system behavior

### Quality Control
- Monitor critical process parameters
- Track system stability over time
- Receive immediate alerts for out-of-spec conditions
- Analyze performance trends

### Research and Development
- Test system responses to parameter changes
- Analyze interdependencies between different metrics
- Validate system stability requirements
- Prototype new monitoring solutions

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
  ├── App.tsx         # Main application component
  ├── main.tsx        # Application entry point
  ├── index.css       # Global styles
  └── components/     # React components
```

## Performance Metrics

### Target Specifications
- Overlay Accuracy: < 3.0 nm
- Focus Stability: < 12 nm
- Temperature Variation: < 1.2 mK
- Vibration Level: < 2.5 nm RMS
- Vacuum Quality: < 2e-6 mbar
- Throughput: > 60 wafers per hour

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.