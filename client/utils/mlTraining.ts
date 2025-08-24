// ML Training utilities for crop yield prediction
export interface TrainingDataPoint {
  // Weather features
  temperature: number;
  rainfall: number;
  humidity: number;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  
  // Farm features
  cropType: 'wheat' | 'corn' | 'rice' | 'soybean' | 'cotton' | 'potato';
  soilType: 'clay' | 'sandy' | 'loam' | 'silt';
  
  // Pesticide features
  pesticideType: 'organic' | 'synthetic' | 'biological' | 'none';
  pesticideAmount: number; // kg/hectare
  
  // Additional features
  farmSize: number; // hectares
  irrigationType: 'drip' | 'sprinkler' | 'flood' | 'rain-fed';
  fertilizer: number; // kg/hectare
  
  // Target variable
  yield: number; // tons/hectare
}

export interface MLModel {
  id: string;
  name: string;
  algorithm: 'gradient_boosting' | 'random_forest' | 'linear_regression' | 'neural_network';
  trainingData: TrainingDataPoint[];
  accuracy: number;
  trainedAt: string;
  features: string[];
}

// Generate sample agricultural dataset
export function generateSampleDataset(size: number = 1000): TrainingDataPoint[] {
  const dataset: TrainingDataPoint[] = [];
  
  const cropTypes: TrainingDataPoint['cropType'][] = ['wheat', 'corn', 'rice', 'soybean', 'cotton', 'potato'];
  const soilTypes: TrainingDataPoint['soilType'][] = ['clay', 'sandy', 'loam', 'silt'];
  const seasons: TrainingDataPoint['season'][] = ['spring', 'summer', 'fall', 'winter'];
  const pesticideTypes: TrainingDataPoint['pesticideType'][] = ['organic', 'synthetic', 'biological', 'none'];
  const irrigationTypes: TrainingDataPoint['irrigationType'][] = ['drip', 'sprinkler', 'flood', 'rain-fed'];
  
  for (let i = 0; i < size; i++) {
    // Random feature values with realistic distributions
    const temperature = Math.random() * 35 + 5; // 5-40°C
    const rainfall = Math.random() * 300 + 20; // 20-320mm
    const humidity = Math.random() * 60 + 30; // 30-90%
    const season = seasons[Math.floor(Math.random() * seasons.length)];
    const cropType = cropTypes[Math.floor(Math.random() * cropTypes.length)];
    const soilType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    const pesticideType = pesticideTypes[Math.floor(Math.random() * pesticideTypes.length)];
    const pesticideAmount = Math.random() * 8; // 0-8 kg/hectare
    const farmSize = Math.random() * 100 + 1; // 1-101 hectares
    const irrigationType = irrigationTypes[Math.floor(Math.random() * irrigationTypes.length)];
    const fertilizer = Math.random() * 200 + 50; // 50-250 kg/hectare
    
    // Calculate yield based on realistic relationships
    let baseYield = 30; // Base yield tons/hectare
    
    // Temperature effect (optimal around 20-25°C)
    const tempOptimal = 22.5;
    const tempEffect = 1 - Math.abs(temperature - tempOptimal) / 30;
    baseYield *= Math.max(0.3, tempEffect);
    
    // Rainfall effect (optimal around 100-200mm)
    const rainfallOptimal = 150;
    const rainfallEffect = 1 - Math.abs(rainfall - rainfallOptimal) / 200;
    baseYield *= Math.max(0.4, rainfallEffect);
    
    // Humidity effect (optimal around 60-70%)
    const humidityOptimal = 65;
    const humidityEffect = 1 - Math.abs(humidity - humidityOptimal) / 50;
    baseYield *= Math.max(0.5, humidityEffect);
    
    // Crop type multipliers
    const cropMultipliers = {
      wheat: 1.0,
      corn: 1.2,
      rice: 0.9,
      soybean: 0.8,
      cotton: 0.7,
      potato: 1.4
    };
    baseYield *= cropMultipliers[cropType];
    
    // Soil type effects
    const soilMultipliers = {
      clay: 0.9,
      sandy: 0.8,
      loam: 1.1,
      silt: 1.0
    };
    baseYield *= soilMultipliers[soilType];
    
    // Pesticide effect (diminishing returns)
    const pesticideEffect = pesticideType === 'none' ? 0.8 : 
                           Math.min(1.3, 1 + (pesticideAmount * 0.05));
    baseYield *= pesticideEffect;
    
    // Irrigation effect
    const irrigationMultipliers = {
      'drip': 1.2,
      'sprinkler': 1.1,
      'flood': 1.0,
      'rain-fed': 0.8
    };
    baseYield *= irrigationMultipliers[irrigationType];
    
    // Fertilizer effect
    const fertilizerEffect = Math.min(1.4, 1 + (fertilizer / 300));
    baseYield *= fertilizerEffect;
    
    // Add some random noise
    baseYield *= (0.8 + Math.random() * 0.4);
    
    // Ensure reasonable yield range
    const cropYield = Math.max(5, Math.min(80, Math.round(baseYield * 100) / 100));

    dataset.push({
      temperature: Math.round(temperature * 100) / 100,
      rainfall: Math.round(rainfall * 100) / 100,
      humidity: Math.round(humidity * 100) / 100,
      season,
      cropType,
      soilType,
      pesticideType,
      pesticideAmount: Math.round(pesticideAmount * 100) / 100,
      farmSize: Math.round(farmSize * 100) / 100,
      irrigationType,
      fertilizer: Math.round(fertilizer * 100) / 100,
      yield: cropYield
    });
  }
  
  return dataset;
}

// Encode categorical features for ML
export function encodeFeatures(dataPoint: Omit<TrainingDataPoint, 'yield'>): number[] {
  const encoded: number[] = [];
  
  // Numerical features
  encoded.push(
    dataPoint.temperature,
    dataPoint.rainfall,
    dataPoint.humidity,
    dataPoint.pesticideAmount,
    dataPoint.farmSize,
    dataPoint.fertilizer
  );
  
  // One-hot encode categorical features
  // Season (4 features)
  encoded.push(
    dataPoint.season === 'spring' ? 1 : 0,
    dataPoint.season === 'summer' ? 1 : 0,
    dataPoint.season === 'fall' ? 1 : 0,
    dataPoint.season === 'winter' ? 1 : 0
  );
  
  // Crop type (6 features)
  encoded.push(
    dataPoint.cropType === 'wheat' ? 1 : 0,
    dataPoint.cropType === 'corn' ? 1 : 0,
    dataPoint.cropType === 'rice' ? 1 : 0,
    dataPoint.cropType === 'soybean' ? 1 : 0,
    dataPoint.cropType === 'cotton' ? 1 : 0,
    dataPoint.cropType === 'potato' ? 1 : 0
  );
  
  // Soil type (4 features)
  encoded.push(
    dataPoint.soilType === 'clay' ? 1 : 0,
    dataPoint.soilType === 'sandy' ? 1 : 0,
    dataPoint.soilType === 'loam' ? 1 : 0,
    dataPoint.soilType === 'silt' ? 1 : 0
  );
  
  // Pesticide type (4 features)
  encoded.push(
    dataPoint.pesticideType === 'organic' ? 1 : 0,
    dataPoint.pesticideType === 'synthetic' ? 1 : 0,
    dataPoint.pesticideType === 'biological' ? 1 : 0,
    dataPoint.pesticideType === 'none' ? 1 : 0
  );
  
  // Irrigation type (4 features)
  encoded.push(
    dataPoint.irrigationType === 'drip' ? 1 : 0,
    dataPoint.irrigationType === 'sprinkler' ? 1 : 0,
    dataPoint.irrigationType === 'flood' ? 1 : 0,
    dataPoint.irrigationType === 'rain-fed' ? 1 : 0
  );
  
  return encoded;
}

// Simple gradient boosting implementation (simplified)
export class SimpleGradientBoosting {
  private trees: any[] = [];
  private learningRate = 0.1;
  private numTrees = 100;
  
  train(X: number[][], y: number[]): void {
    // Initialize predictions with mean
    let predictions = new Array(y.length).fill(y.reduce((a, b) => a + b) / y.length);
    
    for (let i = 0; i < this.numTrees; i++) {
      // Calculate residuals
      const residuals = y.map((actual, idx) => actual - predictions[idx]);
      
      // Train a simple decision tree on residuals (simplified)
      const tree = this.trainSimpleTree(X, residuals);
      this.trees.push(tree);
      
      // Update predictions
      const treePredictions = this.predictWithTree(tree, X);
      predictions = predictions.map((pred, idx) => 
        pred + this.learningRate * treePredictions[idx]
      );
    }
  }
  
  predict(X: number[][]): number[] {
    // Start with mean prediction from training
    const basePrediction = 35; // Average crop yield
    
    return X.map(features => {
      let prediction = basePrediction;
      
      for (const tree of this.trees) {
        prediction += this.learningRate * this.predictSingleWithTree(tree, features);
      }
      
      return Math.max(5, Math.min(80, prediction)); // Clamp to reasonable range
    });
  }
  
  private trainSimpleTree(X: number[][], y: number[]): any {
    // Simplified decision tree (just find best feature threshold)
    let bestFeature = 0;
    let bestThreshold = 0;
    let bestScore = Infinity;
    
    for (let feature = 0; feature < X[0].length; feature++) {
      const values = X.map(x => x[feature]).sort((a, b) => a - b);
      
      for (let i = 1; i < values.length; i++) {
        const threshold = (values[i] + values[i - 1]) / 2;
        const score = this.calculateSplitScore(X, y, feature, threshold);
        
        if (score < bestScore) {
          bestScore = score;
          bestFeature = feature;
          bestThreshold = threshold;
        }
      }
    }
    
    // Calculate left and right predictions
    const leftIndices = X.map((x, i) => x[bestFeature] <= bestThreshold ? i : -1).filter(i => i >= 0);
    const rightIndices = X.map((x, i) => x[bestFeature] > bestThreshold ? i : -1).filter(i => i >= 0);
    
    const leftPred = leftIndices.length > 0 ? 
      leftIndices.reduce((sum, i) => sum + y[i], 0) / leftIndices.length : 0;
    const rightPred = rightIndices.length > 0 ? 
      rightIndices.reduce((sum, i) => sum + y[i], 0) / rightIndices.length : 0;
    
    return {
      feature: bestFeature,
      threshold: bestThreshold,
      leftPrediction: leftPred,
      rightPrediction: rightPred
    };
  }
  
  private calculateSplitScore(X: number[][], y: number[], feature: number, threshold: number): number {
    const leftY = [];
    const rightY = [];
    
    for (let i = 0; i < X.length; i++) {
      if (X[i][feature] <= threshold) {
        leftY.push(y[i]);
      } else {
        rightY.push(y[i]);
      }
    }
    
    const leftVariance = this.calculateVariance(leftY);
    const rightVariance = this.calculateVariance(rightY);
    
    return (leftY.length * leftVariance + rightY.length * rightVariance) / y.length;
  }
  
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }
  
  private predictWithTree(tree: any, X: number[][]): number[] {
    return X.map(features => this.predictSingleWithTree(tree, features));
  }
  
  private predictSingleWithTree(tree: any, features: number[]): number {
    return features[tree.feature] <= tree.threshold ? 
      tree.leftPrediction : tree.rightPrediction;
  }
}

// Train model on dataset
export async function trainModel(
  dataset: TrainingDataPoint[], 
  algorithm: MLModel['algorithm'] = 'gradient_boosting'
): Promise<MLModel> {
  console.log(`Training ${algorithm} model on ${dataset.length} data points...`);
  
  // Encode features
  const X = dataset.map(point => encodeFeatures(point));
  const y = dataset.map(point => point.yield);
  
  // Split data (80% train, 20% test)
  const trainSize = Math.floor(dataset.length * 0.8);
  const X_train = X.slice(0, trainSize);
  const y_train = y.slice(0, trainSize);
  const X_test = X.slice(trainSize);
  const y_test = y.slice(trainSize);
  
  let model: any;
  let accuracy: number;
  
  if (algorithm === 'gradient_boosting') {
    model = new SimpleGradientBoosting();
    model.train(X_train, y_train);
    
    // Calculate accuracy (R² score)
    const predictions = model.predict(X_test);
    accuracy = calculateR2Score(y_test, predictions);
  } else {
    // Placeholder for other algorithms
    throw new Error(`Algorithm ${algorithm} not implemented yet`);
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${algorithm.replace('_', ' ').toUpperCase()} Model`,
    algorithm,
    trainingData: dataset,
    accuracy: Math.round(accuracy * 100),
    trainedAt: new Date().toISOString(),
    features: [
      'temperature', 'rainfall', 'humidity', 'pesticideAmount', 'farmSize', 'fertilizer',
      'season_spring', 'season_summer', 'season_fall', 'season_winter',
      'crop_wheat', 'crop_corn', 'crop_rice', 'crop_soybean', 'crop_cotton', 'crop_potato',
      'soil_clay', 'soil_sandy', 'soil_loam', 'soil_silt',
      'pesticide_organic', 'pesticide_synthetic', 'pesticide_biological', 'pesticide_none',
      'irrigation_drip', 'irrigation_sprinkler', 'irrigation_flood', 'irrigation_rain-fed'
    ]
  };
}

function calculateR2Score(actual: number[], predicted: number[]): number {
  const actualMean = actual.reduce((a, b) => a + b) / actual.length;
  const totalSumSquares = actual.reduce((sum, val) => sum + Math.pow(val - actualMean, 2), 0);
  const residualSumSquares = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
  
  return 1 - (residualSumSquares / totalSumSquares);
}

// Export CSV dataset
export function exportDatasetToCSV(dataset: TrainingDataPoint[]): void {
  const headers = [
    'temperature', 'rainfall', 'humidity', 'season', 'cropType', 'soilType',
    'pesticideType', 'pesticideAmount', 'farmSize', 'irrigationType', 'fertilizer', 'yield'
  ];
  
  const csvContent = [
    headers.join(','),
    ...dataset.map(point => [
      point.temperature,
      point.rainfall,
      point.humidity,
      point.season,
      point.cropType,
      point.soilType,
      point.pesticideType,
      point.pesticideAmount,
      point.farmSize,
      point.irrigationType,
      point.fertilizer,
      point.yield
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const filename = `crop_yield_dataset_${new Date().toISOString().split('T')[0]}.csv`;
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
