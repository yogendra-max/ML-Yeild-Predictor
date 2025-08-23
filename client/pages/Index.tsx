import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PredictionInsights } from "@/components/PredictionInsights";
import { BackButton } from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { usePredictions, WeatherData, PesticideData } from "@/contexts/PredictionContext";
import {
  Droplets,
  Thermometer,
  CloudRain,
  Sprout,
  TrendingUp,
  BarChart3,
  Calendar,
  MapPin,
  User,
  Shield,
  LogOut
} from "lucide-react";

interface PredictionResult {
  predictedYield: number;
  confidence: number;
  factors: Array<{ name: string; impact: number }>;
}

export default function Index() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { addPrediction } = usePredictions();

  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 0,
    rainfall: 0,
    humidity: 0,
    season: ""
  });

  const [pesticideData, setPesticideData] = useState<PesticideData>({
    type: "",
    amount: 0,
    applicationDate: "",
    frequency: ""
  });

  const [cropType, setCropType] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  const handlePredict = async () => {
    setIsLoading(true);

    // Simulate AI prediction with realistic data
    setTimeout(() => {
      const mockPrediction: PredictionResult = {
        predictedYield: Math.round((Math.random() * 50 + 30) * 100) / 100,
        confidence: Math.round((Math.random() * 20 + 75) * 100) / 100,
        factors: [
          { name: "Temperature", impact: Math.round((weatherData.temperature / 40) * 100) },
          { name: "Rainfall", impact: Math.round((weatherData.rainfall / 200) * 100) },
          { name: "Humidity", impact: Math.round((weatherData.humidity / 100) * 100) },
          { name: "Pesticide Usage", impact: Math.round((pesticideData.amount / 10) * 100) },
          { name: "Seasonal Factors", impact: Math.round(Math.random() * 100) }
        ]
      };

      // Save prediction to context
      addPrediction(
        cropType,
        farmLocation,
        soilType,
        weatherData,
        pesticideData,
        mockPrediction
      );

      setPrediction(mockPrediction);
      setIsLoading(false);
    }, 2000);
  };

  const isFormValid = () => {
    return weatherData.temperature > 0 && 
           weatherData.rainfall >= 0 && 
           weatherData.humidity > 0 &&
           weatherData.season &&
           cropType &&
           farmLocation &&
           soilType;
  };

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
                <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Crop Yield Predictor</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  Welcome {user?.name} - AI-powered crop yield forecasting
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <BackButton to="/dashboard" />
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="hidden sm:flex">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="sm:hidden">
                <BarChart3 className="h-4 w-4" />
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
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Input Forms Section */}
          <div className="space-y-6">
            
            {/* Farm Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Farm Information
                </CardTitle>
                <CardDescription>
                  Basic information about your farm and crop
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop-type">Crop Type</Label>
                    <Select value={cropType} onValueChange={setCropType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Farm Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State/Country"
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soil-type">Soil Type</Label>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loam">Loam</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="season">Growing Season</Label>
                    <Select value={weatherData.season} onValueChange={(value) => setWeatherData(prev => ({ ...prev, season: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="fall">Fall</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Data Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5" />
                  Weather Conditions
                </CardTitle>
                <CardDescription>
                  Enter current and expected weather data for accurate predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature" className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Temperature (°C)
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      placeholder="25"
                      value={weatherData.temperature || ""}
                      onChange={(e) => setWeatherData(prev => ({ 
                        ...prev, 
                        temperature: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainfall" className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4" />
                      Rainfall (mm)
                    </Label>
                    <Input
                      id="rainfall"
                      type="number"
                      placeholder="150"
                      value={weatherData.rainfall || ""}
                      onChange={(e) => setWeatherData(prev => ({ 
                        ...prev, 
                        rainfall: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity" className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      Humidity (%)
                    </Label>
                    <Input
                      id="humidity"
                      type="number"
                      placeholder="65"
                      value={weatherData.humidity || ""}
                      onChange={(e) => setWeatherData(prev => ({ 
                        ...prev, 
                        humidity: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pesticide Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Pesticide Usage
                </CardTitle>
                <CardDescription>
                  Information about pest control measures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pesticide-type">Pesticide Type</Label>
                    <Select value={pesticideData.type} onValueChange={(value) => setPesticideData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pesticide type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="synthetic">Synthetic</SelectItem>
                        <SelectItem value="biological">Biological</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pesticide-amount">Amount (kg/hectare)</Label>
                    <Input
                      id="pesticide-amount"
                      type="number"
                      placeholder="2.5"
                      value={pesticideData.amount || ""}
                      onChange={(e) => setPesticideData(prev => ({ 
                        ...prev, 
                        amount: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="application-date">Application Date</Label>
                    <Input
                      id="application-date"
                      type="date"
                      value={pesticideData.applicationDate}
                      onChange={(e) => setPesticideData(prev => ({ 
                        ...prev, 
                        applicationDate: e.target.value 
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Application Frequency</Label>
                    <Select value={pesticideData.frequency} onValueChange={(value) => setPesticideData(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="as-needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handlePredict}
              disabled={!isFormValid() || isLoading}
              className="w-full h-12 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Data...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Predict Crop Yield
                </>
              )}
            </Button>

            {/* Prediction Results - Now below the button */}
            {prediction ? (
              <div className="mt-8">
                <PredictionInsights
                  prediction={prediction}
                  weatherData={weatherData}
                  cropType={cropType}
                />
              </div>
            ) : (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Get Your Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Fill in the form to get AI-powered crop yield predictions based on weather data and farming practices.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Tips - Now as a separate section */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-crop-green/10 rounded">
                  <Droplets className="h-4 w-4 text-crop-green" />
                </div>
                <div>
                  <p className="text-sm font-medium">Optimal Moisture</p>
                  <p className="text-xs text-muted-foreground">Maintain 60-80% humidity for best results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-wheat-gold/10 rounded">
                  <Thermometer className="h-4 w-4 text-wheat-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium">Temperature Range</p>
                  <p className="text-xs text-muted-foreground">20-30°C is ideal for most crops</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-soil-brown/10 rounded">
                  <Shield className="h-4 w-4 text-soil-brown" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pesticide Balance</p>
                  <p className="text-xs text-muted-foreground">Use minimal amounts for sustainable farming</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
