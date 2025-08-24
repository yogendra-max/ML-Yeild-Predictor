import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/BackButton";
import { useMLModel } from "@/contexts/MLModelContext";
import { 
  Brain, 
  Database, 
  Upload, 
  Download, 
  Play, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Sprout,
  LogOut,
  Loader2,
  FileText,
  Settings
} from "lucide-react";

export default function ModelTraining() {
  const navigate = useNavigate();
  const {
    models,
    currentModel,
    trainingDataset,
    isTraining,
    trainModel,
    loadSampleData,
    uploadDataset,
    setCurrentModel,
    exportDataset,
    clearModels
  } = useMLModel();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'gradient_boosting' | 'random_forest' | 'linear_regression' | 'neural_network'>('gradient_boosting');
  const [uploadError, setUploadError] = useState("");
  const [trainingProgress, setTrainingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTrainModel = async () => {
    try {
      setUploadError("");
      setTrainingProgress(0);
      
      // Simulate training progress
      const progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await trainModel(selectedAlgorithm);
      
      clearInterval(progressInterval);
      setTrainingProgress(100);
      
      setTimeout(() => setTrainingProgress(0), 2000);
    } catch (error) {
      setUploadError((error as Error).message);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadError("");
      await uploadDataset(file);
    } catch (error) {
      setUploadError((error as Error).message);
    }
  };

  const algorithmDescriptions = {
    gradient_boosting: "Combines multiple weak learners to create a strong predictor. Excellent for crop yield prediction with complex feature interactions.",
    random_forest: "Ensemble method using multiple decision trees. Robust and handles overfitting well.",
    linear_regression: "Simple linear model. Fast training but limited complexity.",
    neural_network: "Deep learning approach. Can capture complex patterns but requires more data."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <div className="p-2 bg-crop-green rounded-lg flex-shrink-0">
                <Brain className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Model Training</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  Train ML models with your agricultural data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <BackButton to="/dashboard" />
              <Button variant="outline" size="sm" onClick={() => navigate('/predict')} className="hidden sm:flex">
                <Sprout className="h-4 w-4 mr-2" />
                Predict
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/predict')} className="sm:hidden">
                <Sprout className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Current Model Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Model Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentModel ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="default">{currentModel.name}</Badge>
                      <Badge variant="outline">{currentModel.accuracy}% Accuracy</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Trained on {currentModel.trainingData.length} data points • 
                      {new Date(currentModel.trainedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/predict')}>
                      <Play className="h-4 w-4 mr-2" />
                      Use Model
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-2">No Model Selected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Train a new model or select an existing one to start making predictions.
                  </p>
                  <Button onClick={() => handleTrainModel()}>
                    <Brain className="h-4 w-4 mr-2" />
                    Train Your First Model
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="train" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="train">Train Model</TabsTrigger>
              <TabsTrigger value="dataset">Manage Dataset</TabsTrigger>
              <TabsTrigger value="models">Model History</TabsTrigger>
            </TabsList>

            {/* Train Model Tab */}
            <TabsContent value="train" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Train New Model
                  </CardTitle>
                  <CardDescription>
                    Choose an algorithm and train a new model on your dataset
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Algorithm Selection */}
                  <div className="space-y-3">
                    <Label>Machine Learning Algorithm</Label>
                    <Select value={selectedAlgorithm} onValueChange={(value: any) => setSelectedAlgorithm(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gradient_boosting">Gradient Boosting (Recommended)</SelectItem>
                        <SelectItem value="random_forest">Random Forest</SelectItem>
                        <SelectItem value="linear_regression">Linear Regression</SelectItem>
                        <SelectItem value="neural_network">Neural Network</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {algorithmDescriptions[selectedAlgorithm]}
                    </p>
                  </div>

                  {/* Dataset Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-crop-green">{trainingDataset.length}</div>
                      <div className="text-sm text-muted-foreground">Data Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-water-blue">
                        {Math.floor(trainingDataset.length * 0.8)}
                      </div>
                      <div className="text-sm text-muted-foreground">Training Set</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-wheat-gold">
                        {Math.floor(trainingDataset.length * 0.2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Test Set</div>
                    </div>
                  </div>

                  {/* Training Progress */}
                  {isTraining && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Training Progress</span>
                        <span className="text-sm text-muted-foreground">{trainingProgress}%</span>
                      </div>
                      <Progress value={trainingProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        Training {selectedAlgorithm.replace('_', ' ')} model...
                      </p>
                    </div>
                  )}

                  {/* Error Display */}
                  {uploadError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{uploadError}</p>
                    </div>
                  )}

                  {/* Train Button */}
                  <Button 
                    onClick={handleTrainModel} 
                    disabled={isTraining || trainingDataset.length === 0}
                    className="w-full h-12"
                  >
                    {isTraining ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Training Model...
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5 mr-2" />
                        Train Model
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dataset Management Tab */}
            <TabsContent value="dataset" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Dataset Management
                  </CardTitle>
                  <CardDescription>
                    Upload your own data or use sample datasets for training
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Dataset Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-crop-green/10 rounded-lg">
                      <div className="text-2xl font-bold text-crop-green">{trainingDataset.length}</div>
                      <div className="text-sm text-muted-foreground">Total Records</div>
                    </div>
                    <div className="text-center p-4 bg-water-blue/10 rounded-lg">
                      <div className="text-2xl font-bold text-water-blue">
                        {new Set(trainingDataset.map(d => d.cropType)).size}
                      </div>
                      <div className="text-sm text-muted-foreground">Crop Types</div>
                    </div>
                    <div className="text-center p-4 bg-wheat-gold/10 rounded-lg">
                      <div className="text-2xl font-bold text-wheat-gold">
                        {trainingDataset.length > 0 ? 
                          Math.round(trainingDataset.reduce((sum, d) => sum + d.yield, 0) / trainingDataset.length) : 0
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Yield (t/ha)</div>
                    </div>
                    <div className="text-center p-4 bg-soil-brown/10 rounded-lg">
                      <div className="text-2xl font-bold text-soil-brown">
                        {new Set(trainingDataset.map(d => d.soilType)).size}
                      </div>
                      <div className="text-sm text-muted-foreground">Soil Types</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Upload Dataset */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Upload Your Dataset</h3>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload a CSV file with your agricultural data
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose CSV File
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Sample Data */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Generate Sample Data</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" onClick={() => loadSampleData(500)}>
                        Load 500 Samples
                      </Button>
                      <Button variant="outline" onClick={() => loadSampleData(1000)}>
                        Load 1,000 Samples
                      </Button>
                      <Button variant="outline" onClick={() => loadSampleData(2000)}>
                        Load 2,000 Samples
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Export Dataset */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Export Dataset</h3>
                    <Button variant="outline" onClick={exportDataset} disabled={trainingDataset.length === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Model History Tab */}
            <TabsContent value="models" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Trained Models
                      </CardTitle>
                      <CardDescription>
                        View and manage your trained machine learning models
                      </CardDescription>
                    </div>
                    {models.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearModels}>
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {models.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <h3 className="font-medium text-foreground mb-2">No Models Trained</h3>
                      <p className="text-sm text-muted-foreground">
                        Train your first model to see it appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {models.map((model) => (
                        <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{model.name}</h4>
                              <Badge variant={model.id === currentModel?.id ? "default" : "secondary"}>
                                {model.algorithm.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-crop-green">
                                {model.accuracy}% Accuracy
                              </Badge>
                              {model.id === currentModel?.id && (
                                <Badge variant="default">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {model.trainingData.length} training samples • 
                              Trained {new Date(model.trainedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {model.id !== currentModel?.id && (
                              <Button variant="outline" size="sm" onClick={() => setCurrentModel(model)}>
                                <Target className="h-4 w-4 mr-2" />
                                Use Model
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
