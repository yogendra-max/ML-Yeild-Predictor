import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  season: string;
}

export interface PesticideData {
  type: string;
  amount: number;
  applicationDate: string;
  frequency: string;
}

export interface PredictionResult {
  predictedYield: number;
  confidence: number;
  factors: Array<{ name: string; impact: number }>;
}

export interface PredictionRecord {
  id: string;
  timestamp: string;
  cropType: string;
  farmLocation: string;
  soilType: string;
  weatherData: WeatherData;
  pesticideData: PesticideData;
  prediction: PredictionResult;
}

interface PredictionContextType {
  predictions: PredictionRecord[];
  addPrediction: (
    cropType: string,
    farmLocation: string,
    soilType: string,
    weatherData: WeatherData,
    pesticideData: PesticideData,
    prediction: PredictionResult
  ) => void;
  clearPredictions: () => void;
  getAverageYield: () => number;
  getAverageConfidence: () => number;
  exportToCSV: (recordId?: string) => void;
  exportToPDF: (recordId?: string) => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export function usePredictions() {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error("usePredictions must be used within a PredictionProvider");
  }
  return context;
}

interface PredictionProviderProps {
  children: ReactNode;
}

export function PredictionProvider({ children }: PredictionProviderProps) {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);

  // Load predictions from localStorage on component mount
  useEffect(() => {
    const savedPredictions = localStorage.getItem("cropPredictor_predictions");
    if (savedPredictions) {
      try {
        setPredictions(JSON.parse(savedPredictions));
      } catch (error) {
        console.error("Error parsing saved predictions:", error);
        localStorage.removeItem("cropPredictor_predictions");
      }
    }
  }, []);

  // Save predictions to localStorage whenever predictions change
  useEffect(() => {
    localStorage.setItem("cropPredictor_predictions", JSON.stringify(predictions));
  }, [predictions]);

  const addPrediction = (
    cropType: string,
    farmLocation: string,
    soilType: string,
    weatherData: WeatherData,
    pesticideData: PesticideData,
    prediction: PredictionResult
  ) => {
    const newPrediction: PredictionRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      cropType,
      farmLocation,
      soilType,
      weatherData,
      pesticideData,
      prediction,
    };

    setPredictions(prev => [newPrediction, ...prev]);
  };

  const clearPredictions = () => {
    setPredictions([]);
    localStorage.removeItem("cropPredictor_predictions");
  };

  const getAverageYield = (): number => {
    if (predictions.length === 0) return 0;
    const sum = predictions.reduce((acc, pred) => acc + pred.prediction.predictedYield, 0);
    return Math.round((sum / predictions.length) * 100) / 100;
  };

  const getAverageConfidence = (): number => {
    if (predictions.length === 0) return 0;
    const sum = predictions.reduce((acc, pred) => acc + pred.prediction.confidence, 0);
    return Math.round((sum / predictions.length) * 100) / 100;
  };

  const exportToCSV = (recordId?: string) => {
    const recordsToExport = recordId 
      ? predictions.filter(p => p.id === recordId)
      : predictions;

    if (recordsToExport.length === 0) return;

    const headers = [
      "Date",
      "Crop Type",
      "Location",
      "Soil Type",
      "Temperature (°C)",
      "Rainfall (mm)",
      "Humidity (%)",
      "Season",
      "Pesticide Type",
      "Pesticide Amount (kg/ha)",
      "Application Date",
      "Frequency",
      "Predicted Yield (tons/ha)",
      "Confidence (%)"
    ];

    const csvContent = [
      headers.join(","),
      ...recordsToExport.map(record => [
        new Date(record.timestamp).toLocaleDateString(),
        record.cropType,
        record.farmLocation,
        record.soilType,
        record.weatherData.temperature,
        record.weatherData.rainfall,
        record.weatherData.humidity,
        record.weatherData.season,
        record.pesticideData.type,
        record.pesticideData.amount,
        record.pesticideData.applicationDate,
        record.pesticideData.frequency,
        record.prediction.predictedYield,
        record.prediction.confidence
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const filename = recordId 
      ? `crop-prediction-${recordId}.csv`
      : `crop-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = (recordId?: string) => {
    // For this demo, we'll create a simple HTML-based PDF export
    const recordsToExport = recordId 
      ? predictions.filter(p => p.id === recordId)
      : predictions;

    if (recordsToExport.length === 0) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Crop Yield Prediction Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .prediction { border: 1px solid #ddd; margin: 20px 0; padding: 15px; border-radius: 8px; }
          .prediction h3 { color: #2c7a2c; margin-top: 0; }
          .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
          .data-item { padding: 8px; background: #f5f5f5; border-radius: 4px; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .yield-result { text-align: center; background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 15px 0; }
          .yield-value { font-size: 24px; font-weight: bold; color: #2c7a2c; }
          .confidence { font-size: 16px; color: #666; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌾 Crop Yield Prediction Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        ${recordsToExport.map(record => `
          <div class="prediction">
            <h3>Prediction #${record.id}</h3>
            <p><strong>Date:</strong> ${new Date(record.timestamp).toLocaleString()}</p>
            
            <div class="yield-result">
              <div class="yield-value">${record.prediction.predictedYield} tons/hectare</div>
              <div class="confidence">Confidence: ${record.prediction.confidence}%</div>
            </div>

            <div class="data-grid">
              <div class="data-item">
                <div class="label">Crop Type</div>
                <div class="value">${record.cropType}</div>
              </div>
              <div class="data-item">
                <div class="label">Location</div>
                <div class="value">${record.farmLocation}</div>
              </div>
              <div class="data-item">
                <div class="label">Soil Type</div>
                <div class="value">${record.soilType}</div>
              </div>
              <div class="data-item">
                <div class="label">Season</div>
                <div class="value">${record.weatherData.season}</div>
              </div>
              <div class="data-item">
                <div class="label">Temperature</div>
                <div class="value">${record.weatherData.temperature}°C</div>
              </div>
              <div class="data-item">
                <div class="label">Rainfall</div>
                <div class="value">${record.weatherData.rainfall}mm</div>
              </div>
              <div class="data-item">
                <div class="label">Humidity</div>
                <div class="value">${record.weatherData.humidity}%</div>
              </div>
              <div class="data-item">
                <div class="label">Pesticide Type</div>
                <div class="value">${record.pesticideData.type}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const value: PredictionContextType = {
    predictions,
    addPrediction,
    clearPredictions,
    getAverageYield,
    getAverageConfidence,
    exportToCSV,
    exportToPDF,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
}
