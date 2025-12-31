import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  BarChart3, TrendingUp, TrendingDown, 
  Minus, Droplet, AlertTriangle, Info
} from 'lucide-react';

const BloodStockChart = ({ 
  data = [],
  type = 'bar',
  title = 'Blood Stock Levels',
  showLegend = true,
  showStats = true,
  height = 300,
  timeRange = 'monthly'
}) => {
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Default sample data if none provided
  const chartData = useMemo(() => {
    if (data.length > 0) return data;
    
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const now = new Date();
    
    return bloodTypes.map((type, index) => {
      const baseValue = Math.floor(Math.random() * 100) + 20;
      const trend = Math.random() > 0.5 ? 1 : -1;
      const change = Math.floor(Math.random() * 20) * trend;
      
      return {
        id: index,
        bloodType: type,
        current: baseValue,
        previous: baseValue - change,
        minThreshold: 30,
        maxCapacity: 100,
        lastUpdated: new Date(now - index * 24 * 60 * 60 * 1000).toISOString(),
        urgent: baseValue < 30,
        critical: baseValue < 15
      };
    });
  }, [data]);

  const stats = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.current, 0);
    const average = total / chartData.length;
    const lowStock = chartData.filter(item => item.current < item.minThreshold).length;
    const critical = chartData.filter(item => item.current < 15).length;
    const totalCapacity = chartData.reduce((sum, item) => sum + item.maxCapacity, 0);
    const utilization = (total / totalCapacity * 100).toFixed(1);
    
    const trendData = chartData.map(item => ({
      bloodType: item.bloodType,
      change: item.current - item.previous,
      percentageChange: ((item.current - item.previous) / item.previous * 100).toFixed(1)
    }));

    const overallTrend = trendData.reduce((sum, item) => sum + item.change, 0) / trendData.length;

    return {
      total,
      average: average.toFixed(1),
      lowStock,
      critical,
      utilization: `${utilization}%`,
      trend: overallTrend,
      trendData
    };
  }, [chartData]);

  const getBloodTypeColor = (bloodType, opacity = 1) => {
    const colors = {
      'A+': `rgba(239, 68, 68, ${opacity})`,    // Red
      'A-': `rgba(220, 38, 38, ${opacity})`,    // Dark Red
      'B+': `rgba(59, 130, 246, ${opacity})`,   // Blue
      'B-': `rgba(37, 99, 235, ${opacity})`,    // Dark Blue
      'AB+': `rgba(139, 92, 246, ${opacity})`,  // Purple
      'AB-': `rgba(124, 58, 237, ${opacity})`,  // Dark Purple
      'O+': `rgba(34, 197, 94, ${opacity})`,    // Green
      'O-': `rgba(21, 128, 61, ${opacity})`     // Dark Green
    };
    return colors[bloodType] || `rgba(156, 163, 175, ${opacity})`;
  };

  const getBarHeight = (value, maxValue) => {
    const maxBarHeight = height - 80;
    return (value / maxValue) * maxBarHeight;
  };

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(item => item.current), 100);
  }, [chartData]);

  const handleBarHover = (index, bloodType) => {
    setHoveredIndex(index);
    setSelectedBloodType(bloodType);
  };

  const selectedItem = useMemo(() => {
    return chartData.find(item => item.bloodType === selectedBloodType) || chartData[0];
  }, [selectedBloodType, chartData]);

  const renderBarChart = () => {
    const barWidth = 40;
    const gap = 20;
    const totalWidth = (barWidth + gap) * chartData.length;

    return (
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
          {[100, 75, 50, 25, 0].map(value => (
            <div key={value} className="text-right pr-2">
              {value}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="absolute left-12 right-0 top-0 bottom-0">
          <div className="relative h-full">
            {/* Grid lines */}
            {[100, 75, 50, 25, 0].map(value => (
              <div
                key={value}
                className="absolute w-full border-t border-gray-100"
                style={{ bottom: `${(value / 100) * 100}%` }}
              />
            ))}

            {/* Bars */}
            <div 
              className="absolute bottom-0 left-0 right-0 flex items-end"
              style={{ height: 'calc(100% - 30px)' }}
            >
              {chartData.map((item, index) => {
                const barHeight = getBarHeight(item.current, maxValue);
                const isUrgent = item.urgent;
                const isCritical = item.critical;
                
                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col items-center"
                    style={{ 
                      width: `${barWidth}px`,
                      marginRight: `${gap}px`
                    }}
                    onMouseEnter={() => handleBarHover(index, item.bloodType)}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      setSelectedBloodType(null);
                    }}
                  >
                    {/* Bar */}
                    <div
                      className={`relative w-10 rounded-t-lg transition-all duration-300 ${
                        isCritical ? 'animate-pulse' : ''
                      }`}
                      style={{
                        height: `${barHeight}px`,
                        backgroundColor: getBloodTypeColor(item.bloodType, isCritical ? 0.9 : 0.7),
                        border: isUrgent ? '2px solid #ef4444' : 'none',
                        boxShadow: hoveredIndex === index 
                          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                          : 'none',
                        transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      {/* Threshold line */}
                      {item.current < item.minThreshold && (
                        <div
                          className="absolute w-full border-t-2 border-dashed border-yellow-500"
                          style={{ 
                            bottom: `${(item.minThreshold / maxValue) * barHeight}px` 
                          }}
                        />
                      )}
                      
                      {/* Value label */}
                      <div
                        className={`absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs font-semibold ${
                          isCritical 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white text-gray-800 shadow'
                        }`}
                      >
                        {item.current}
                      </div>
                    </div>
                    
                    {/* Blood type label */}
                    <div className="mt-2 text-sm font-medium text-gray-700">
                      {item.bloodType}
                    </div>
                    
                    {/* Trend indicator */}
                    <div className="mt-1 flex items-center">
                      {item.current > item.previous ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : item.current < item.previous ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <Minus className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={`text-xs ml-1 ${
                        item.current > item.previous ? 'text-green-600' :
                        item.current < item.previous ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {Math.abs(item.current - item.previous)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    // Simplified line chart implementation
    return (
      <div className="relative" style={{ height: `${height}px` }}>
        <div className="text-center text-gray-500 py-12">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Line chart view coming soon</p>
          <p className="text-sm">Currently showing bar chart</p>
        </div>
      </div>
    );
  };

  const renderTimeRangeSelector = () => {
    const ranges = [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'yearly', label: 'Yearly' }
    ];

    return (
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {ranges.map(range => (
          <button
            key={range.value}
            onClick={() => {}}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              timeRange === range.value
                ? 'bg-white text-gray-800 shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">Current blood stock levels and trends</p>
        </div>
        
        <div className="flex items-center gap-4">
          {renderTimeRangeSelector()}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs">Adequate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs">Critical</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Units</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{stats.average}</div>
            <div className="text-sm text-gray-600">Avg per Type</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className={`text-2xl font-bold ${
              stats.lowStock > 0 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {stats.lowStock}
            </div>
            <div className="text-sm text-gray-600">Low Stock Types</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className={`text-2xl font-bold ${
              stats.trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.trend > 0 ? '+' : ''}{stats.trend.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Overall Trend</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        {type === 'bar' ? renderBarChart() : renderLineChart()}
      </div>

      {/* Detailed Info Panel */}
      {selectedItem && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getBloodTypeColor(selectedItem.bloodType) }}
                >
                  {selectedItem.bloodType}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {selectedItem.bloodType} Blood Stock
                  </h4>
                  <p className="text-sm text-gray-600">
                    Updated {new Date(selectedItem.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-800">
                    {selectedItem.current}
                  </div>
                  <div className="text-sm text-gray-600">Current Units</div>
                </div>
                
                <div>
                  <div className={`text-xl font-bold ${
                    selectedItem.current > selectedItem.previous ? 'text-green-600' :
                    selectedItem.current < selectedItem.previous ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {selectedItem.current > selectedItem.previous ? '+' : ''}
                    {selectedItem.current - selectedItem.previous}
                  </div>
                  <div className="text-sm text-gray-600">Change</div>
                </div>
                
                <div>
                  <div className="text-xl font-bold text-gray-800">
                    {selectedItem.minThreshold}
                  </div>
                  <div className="text-sm text-gray-600">Minimum Required</div>
                </div>
              </div>
            </div>
            
            <div>
              {selectedItem.critical ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">CRITICAL</span>
                </div>
              ) : selectedItem.urgent ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">LOW STOCK</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                  <Droplet className="w-5 h-5" />
                  <span className="font-semibold">ADEQUATE</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Stock Level</span>
              <span>{selectedItem.current} / {selectedItem.maxCapacity}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(selectedItem.current / selectedItem.maxCapacity) * 100}%`,
                  backgroundColor: getBloodTypeColor(selectedItem.bloodType)
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-xs text-gray-500">0</div>
              <div className="text-xs text-gray-500 relative" style={{ left: `${(selectedItem.minThreshold / selectedItem.maxCapacity) * 100}%` }}>
                Min: {selectedItem.minThreshold}
              </div>
              <div className="text-xs text-gray-500">Max: {selectedItem.maxCapacity}</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Stock Status Guide</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <div className="text-sm font-medium">Adequate</div>
                <div className="text-xs text-gray-600">Above minimum</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div>
                <div className="text-sm font-medium">Low Stock</div>
                <div className="text-xs text-gray-600">Below minimum</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div>
                <div className="text-sm font-medium">Critical</div>
                <div className="text-xs text-gray-600">Less than 15 units</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <div>
                <div className="text-sm font-medium">Rare Type</div>
                <div className="text-xs text-gray-600">O- or AB-</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

BloodStockChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      bloodType: PropTypes.string.isRequired,
      current: PropTypes.number.isRequired,
      previous: PropTypes.number,
      minThreshold: PropTypes.number,
      maxCapacity: PropTypes.number,
      lastUpdated: PropTypes.string,
      urgent: PropTypes.bool,
      critical: PropTypes.bool
    })
  ),
  type: PropTypes.oneOf(['bar', 'line']),
  title: PropTypes.string,
  showLegend: PropTypes.bool,
  showStats: PropTypes.bool,
  height: PropTypes.number,
  timeRange: PropTypes.oneOf(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
};

BloodStockChart.defaultProps = {
  type: 'bar',
  showLegend: true,
  showStats: true,
  height: 300,
  timeRange: 'monthly'
};

export default BloodStockChart;