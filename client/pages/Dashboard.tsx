import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePredictions } from "@/contexts/PredictionContext";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  BarChart,
  Bar,
  ScatterChart,
  Scatter
} from "recharts";
import {
  Sprout,
  User,
  LogOut,
  Plus,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Activity,
  ArrowLeft,
  Brain
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    predictions,
    getAverageYield,
    getAverageConfidence,
    exportToCSV,
    exportToPDF,
    clearPredictions
  } = usePredictions();

  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const handleNewPrediction = () => {
    navigate("/predict");
  };

  const filterPredictionsByTimeframe = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedTimeframe) {
      case "7d":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case "all":
        return predictions;
    }
    
    return predictions.filter(p => new Date(p.timestamp) >= cutoffDate);
  };

  const filteredPredictions = filterPredictionsByTimeframe();

  // Prepare chart data
  const chartData = filteredPredictions
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((prediction, index) => ({
      date: new Date(prediction.timestamp).toLocaleDateString(),
      yield: prediction.prediction.predictedYield,
      confidence: prediction.prediction.confidence,
      temperature: prediction.weatherData.temperature,
      rainfall: prediction.weatherData.rainfall,
      humidity: prediction.weatherData.humidity,
      index: index + 1
    }));

  // Temperature vs Yield correlation data
  const tempYieldData = filteredPredictions.map(p => ({
    temperature: p.weatherData.temperature,
    yield: p.prediction.predictedYield,
    confidence: p.prediction.confidence
  }));

  // Rainfall vs Yield correlation data
  const rainfallYieldData = filteredPredictions.map(p => ({
    rainfall: p.weatherData.rainfall,
    yield: p.prediction.predictedYield,
    confidence: p.prediction.confidence
  }));

  const chartConfig = {
    yield: {
      label: "Yield (t/ha)",
      color: "hsl(var(--crop-green))",
    },
    confidence: {
      label: "Confidence (%)",
      color: "hsl(var(--water-blue))",
    },
    temperature: {
      label: "Temperature (°C)",
      color: "hsl(var(--wheat-gold))",
    },
    rainfall: {
      label: "Rainfall (mm)",
      color: "hsl(var(--water-blue))",
    },
  };

  const averageYield = getAverageYield();
  const averageConfidence = getAverageConfidence();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <div className="p-2 bg-crop-green rounded-lg flex-shrink-0">
                <Sprout className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Dashboard</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleNewPrediction} className="hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" />
                New Prediction
              </Button>
              <Button variant="outline" size="sm" onClick={handleNewPrediction} className="sm:hidden">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/models')} className="hidden sm:flex">
                <Brain className="h-4 w-4 mr-2" />
                Train Models
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/models')} className="sm:hidden">
                <Brain className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden sm:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="sm:hidden">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{predictions.length}</div>
                <p className="text-xs text-muted-foreground">
                  All time predictions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageYield} t/ha</div>
                <p className="text-xs text-muted-foreground">
                  Across all predictions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageConfidence}%</div>
                <p className="text-xs text-muted-foreground">
                  Prediction accuracy
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredPredictions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Time Filter and Actions */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Prediction History</CardTitle>
                  <CardDescription>
                    Track your yield predictions over time
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-md border">
                    {(["7d", "30d", "90d", "all"] as const).map((period) => (
                      <Button
                        key={period}
                        variant={selectedTimeframe === period ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedTimeframe(period)}
                        className="rounded-none first:rounded-l-md last:rounded-r-md"
                      >
                        {period === "all" ? "All" : period.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => exportToCSV()}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportToPDF()}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {predictions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No Predictions Yet</h3>
                    <p className="text-muted-foreground">
                      Start making predictions to see your dashboard analytics
                    </p>
                  </div>
                  <Button onClick={handleNewPrediction}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Prediction
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Yield Trends Over Time */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Yield Trends</CardTitle>
                    <CardDescription>
                      Predicted yield over time ({selectedTimeframe})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px]">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="yield"
                          stroke="hsl(var(--crop-green))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--crop-green))", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Confidence Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Confidence Trends</CardTitle>
                    <CardDescription>
                      Prediction confidence over time ({selectedTimeframe})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px]">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="confidence"
                          stroke="hsl(var(--water-blue))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--water-blue))", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Temperature vs Yield Correlation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Temperature vs Yield</CardTitle>
                    <CardDescription>
                      Correlation between temperature and predicted yield
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px]">
                      <ScatterChart data={tempYieldData}>
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

                {/* Rainfall vs Yield Correlation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rainfall vs Yield</CardTitle>
                    <CardDescription>
                      Relationship between rainfall and predicted yield
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px]">
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
              </div>

              {/* Recent Predictions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Predictions</CardTitle>
                  <CardDescription>
                    Your latest crop yield predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredPredictions.slice(0, 5).map((prediction) => (
                      <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{prediction.cropType}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {prediction.farmLocation}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(prediction.timestamp).toLocaleDateString()} • 
                            {prediction.weatherData.temperature}°C • 
                            {prediction.weatherData.rainfall}mm rain
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-lg font-semibold text-crop-green">
                            {prediction.prediction.predictedYield} t/ha
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {prediction.prediction.confidence}% confidence
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredPredictions.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" onClick={() => setSelectedTimeframe("all")}>
                        View All Predictions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
