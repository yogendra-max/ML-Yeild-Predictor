import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle
} from "lucide-react";

interface PredictionResult {
  predictedYield: number;
  confidence: number;
  factors: Array<{ name: string; impact: number }>;
}

interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  season: string;
}

interface PredictionInsightsProps {
  prediction: PredictionResult;
  weatherData: WeatherData;
  cropType: string;
}

interface PesticideData {
  type: string;
  amount: number;
  applicationDate: string;
  frequency: string;
}

export function PredictionInsights({ prediction, weatherData, cropType }: PredictionInsightsProps) {
  // Generate correlation data for different factors vs yield
  const temperatureYieldData = [
    { temperature: 15, yield: 28.5 }, { temperature: 18, yield: 30.2 }, { temperature: 20, yield: 32.1 },
    { temperature: 22, yield: 34.8 }, { temperature: 25, yield: 39.2 }, { temperature: 28, yield: 42.1 },
    { temperature: 30, yield: 41.8 }, { temperature: 32, yield: 40.5 }, { temperature: 35, yield: 37.2 },
    { temperature: 38, yield: 33.1 }, { temperature: 40, yield: 28.9 },
    { temperature: weatherData.temperature, yield: prediction.predictedYield, current: true }
  ];

  const pesticideYieldData = [
    { pesticide: 0, yield: 25.2 }, { pesticide: 1, yield: 28.5 }, { pesticide: 2, yield: 32.1 },
    { pesticide: 3, yield: 36.8 }, { pesticide: 4, yield: 39.2 }, { pesticide: 5, yield: 41.1 },
    { pesticide: 6, yield: 40.8 }, { pesticide: 7, yield: 39.5 }, { pesticide: 8, yield: 37.2 },
    { pesticide: 9, yield: 34.1 }, { pesticide: 10, yield: 30.9 },
    { pesticide: 2.5, yield: prediction.predictedYield, current: true } // Example current usage
  ];

  const rainfallYieldData = [
    { rainfall: 20, yield: 22.5 }, { rainfall: 40, yield: 26.2 }, { rainfall: 60, yield: 30.1 },
    { rainfall: 80, yield: 34.8 }, { rainfall: 100, yield: 38.2 }, { rainfall: 120, yield: 41.1 },
    { rainfall: 140, yield: 42.8 }, { rainfall: 160, yield: 43.5 }, { rainfall: 180, yield: 42.2 },
    { rainfall: 200, yield: 40.1 }, { rainfall: 220, yield: 37.9 },
    { rainfall: weatherData.rainfall, yield: prediction.predictedYield, current: true }
  ];

  const humidityYieldData = [
    { humidity: 30, yield: 25.2 }, { humidity: 40, yield: 28.5 }, { humidity: 50, yield: 32.1 },
    { humidity: 60, yield: 36.8 }, { humidity: 70, yield: 41.2 }, { humidity: 80, yield: 43.1 },
    { humidity: 85, yield: 42.8 }, { humidity: 90, yield: 41.5 }, { humidity: 95, yield: 39.2 },
    { humidity: weatherData.humidity, yield: prediction.predictedYield, current: true }
  ];

  // Generate historical data for trend visualization (mock data)
  const historicalData = [
    { month: "Jan", yield: 28.5, avgTemp: 15, rainfall: 120 },
    { month: "Feb", yield: 30.2, avgTemp: 18, rainfall: 100 },
    { month: "Mar", yield: 32.1, avgTemp: 22, rainfall: 80 },
    { month: "Apr", yield: 35.4, avgTemp: 25, rainfall: 60 },
    { month: "May", yield: 38.2, avgTemp: 28, rainfall: 40 },
    { month: "Jun", yield: 41.5, avgTemp: 32, rainfall: 30 },
    { month: "Jul", yield: 39.8, avgTemp: 35, rainfall: 45 },
    { month: "Aug", yield: 37.2, avgTemp: 33, rainfall: 65 },
    { month: "Sep", yield: 34.6, avgTemp: 30, rainfall: 85 },
    { month: "Oct", yield: 31.8, avgTemp: 26, rainfall: 110 },
    { month: "Nov", yield: 29.4, avgTemp: 21, rainfall: 140 },
    { month: "Dec", yield: 27.9, avgTemp: 17, rainfall: 160 }
  ];

  // Add current prediction to the data
  const currentMonth = new Date().toLocaleDateString('en', { month: 'short' });
  const dataWithPrediction = historicalData.map(item => 
    item.month === currentMonth 
      ? { ...item, yield: prediction.predictedYield, predicted: true }
      : item
  );

  // Weather factor distribution data
  const weatherFactors = [
    { name: "Temperature", value: weatherData.temperature, optimal: 25, color: "#FF6B6B" },
    { name: "Rainfall", value: weatherData.rainfall, optimal: 150, color: "#4ECDC4" },
    { name: "Humidity", value: weatherData.humidity, optimal: 70, color: "#45B7D1" }
  ];

  // Factor impact chart configuration
  const chartConfig = {
    impact: {
      label: "Impact (%)",
    },
    temperature: {
      label: "Temperature",
      color: "hsl(var(--wheat-gold))",
    },
    rainfall: {
      label: "Rainfall", 
      color: "hsl(var(--water-blue))",
    },
    humidity: {
      label: "Humidity",
      color: "hsl(var(--crop-green))",
    },
    pesticide: {
      label: "Pesticide",
      color: "hsl(var(--soil-brown))",
    },
    seasonal: {
      label: "Seasonal",
      color: "hsl(var(--sun-yellow))",
    }
  };

  const getYieldStatus = () => {
    if (prediction.predictedYield >= 40) return { status: "excellent", icon: CheckCircle, color: "text-green-600" };
    if (prediction.predictedYield >= 30) return { status: "good", icon: TrendingUp, color: "text-blue-600" };
    if (prediction.predictedYield >= 20) return { status: "average", icon: Info, color: "text-yellow-600" };
    return { status: "below-average", icon: AlertTriangle, color: "text-red-600" };
  };

  const yieldStatus = getYieldStatus();
  const StatusIcon = yieldStatus.icon;

  return (
    <div className="space-y-6">
      {/* Main Prediction Result */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="flex items-center gap-2">
              <StatusIcon className={`h-5 w-5 ${yieldStatus.color}`} />
              Yield Prediction
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden flex-1">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden flex-1">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            AI prediction for {cropType} yield based on current conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-crop-green">
              {prediction.predictedYield} tons/hectare
            </div>
            <p className="text-sm text-muted-foreground mt-1">Expected Yield</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="text-sm flex items-center gap-1 cursor-help">
                      {prediction.confidence}% Confidence
                      <HelpCircle className="h-3 w-3" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-xs">
                      Higher confidence scores indicate more reliable predictions.
                      Scores above 85% are considered highly accurate based on current data quality.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Badge variant="outline" className={`text-sm ${yieldStatus.color}`}>
                {yieldStatus.status.charAt(0).toUpperCase() + yieldStatus.status.slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          {/* Factor Impact Chart */}
          <div>
            <h4 className="font-medium mb-4">Contributing Factors</h4>
            <ChartContainer config={chartConfig} className="h-[160px] sm:h-[200px]">
              <BarChart data={prediction.factors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="impact"
                  fill="hsl(var(--crop-green))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Analysis - Grid Layout */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">Factor Correlation Analysis</h3>
          <p className="text-sm text-muted-foreground mt-1">
            How different farming factors correlate with crop yield predictions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Temperature vs Yield */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Temperature vs Yield</CardTitle>
              <CardDescription className="text-xs">
                Correlation between temperature (°C) and crop yield
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <ScatterChart data={temperatureYieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="temperature"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5, style: { fontSize: '10px' } }}
                  />
                  <YAxis
                    dataKey="yield"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Yield (t/ha)', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter
                    dataKey="yield"
                    fill="hsl(var(--wheat-gold))"
                    r={4}
                  />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pesticide vs Yield */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pesticide vs Yield</CardTitle>
              <CardDescription className="text-xs">
                Impact of pesticide usage (kg/ha) on crop yield
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <ScatterChart data={pesticideYieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="pesticide"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Pesticide (kg/ha)', position: 'insideBottom', offset: -5, style: { fontSize: '10px' } }}
                  />
                  <YAxis
                    dataKey="yield"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Yield (t/ha)', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter
                    dataKey="yield"
                    fill="hsl(var(--soil-brown))"
                    r={4}
                  />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Rainfall vs Yield */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Rainfall vs Yield</CardTitle>
              <CardDescription className="text-xs">
                Relationship between rainfall (mm) and crop yield
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <ScatterChart data={rainfallYieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="rainfall"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Rainfall (mm)', position: 'insideBottom', offset: -5, style: { fontSize: '10px' } }}
                  />
                  <YAxis
                    dataKey="yield"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Yield (t/ha)', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter
                    dataKey="yield"
                    fill="hsl(var(--water-blue))"
                    r={4}
                  />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Humidity vs Yield */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Humidity vs Yield</CardTitle>
              <CardDescription className="text-xs">
                Effect of humidity (%) on crop yield performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <ScatterChart data={humidityYieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="humidity"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Humidity (%)', position: 'insideBottom', offset: -5, style: { fontSize: '10px' } }}
                  />
                  <YAxis
                    dataKey="yield"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Yield (t/ha)', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter
                    dataKey="yield"
                    fill="hsl(var(--crop-green))"
                    r={4}
                  />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Historical Yield Trends */}
          <Card className="md:col-span-2 xl:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Historical Yield Trends</CardTitle>
              <CardDescription className="text-xs">
                Monthly yield performance over the past year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <LineChart data={dataWithPrediction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Month', position: 'insideBottom', offset: -5, style: { fontSize: '10px' } }}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Yield (t/ha)', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(var(--crop-green))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--crop-green))", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: "hsl(var(--crop-green))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weather Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Analysis</CardTitle>
          <CardDescription>
            Current conditions vs optimal ranges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {weatherFactors.map((factor) => {
            const percentage = (factor.value / factor.optimal) * 100;
            const isOptimal = percentage >= 80 && percentage <= 120;
            
            return (
              <div key={factor.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{factor.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{factor.value}</span>
                    <Badge 
                      variant={isOptimal ? "default" : "destructive"} 
                      className="text-xs"
                    >
                      {isOptimal ? "Optimal" : percentage > 120 ? "High" : "Low"}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      isOptimal ? "bg-crop-green" : "bg-destructive"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>Optimal: {factor.optimal}</span>
                  <span>{factor.optimal * 1.5}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            AI Recommendations
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="secondary" className="text-xs flex items-center gap-1 cursor-help">
                    Confidence: {prediction.confidence}%
                    <HelpCircle className="h-3 w-3" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">
                    Recommendation reliability based on prediction confidence.
                    Higher confidence means more accurate insights.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Actionable insights to optimize your yield
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {weatherData.temperature > 35 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">High Temperature Alert</p>
                  <p className="text-xs text-yellow-700">
                    Consider providing shade or increasing irrigation to protect crops from heat stress.
                  </p>
                </div>
              </div>
            )}

            {weatherData.rainfall < 50 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Low Rainfall Notice</p>
                  <p className="text-xs text-blue-700">
                    Supplement with irrigation to maintain optimal soil moisture levels.
                  </p>
                </div>
              </div>
            )}

            {prediction.confidence > 85 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Highly Accurate Prediction</p>
                  <p className="text-xs text-green-700">
                    Current conditions provide reliable prediction data. Plan accordingly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
