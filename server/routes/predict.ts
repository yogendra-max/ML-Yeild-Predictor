import { Request, Response } from "express";

export async function handlePredict(req: Request, res: Response) {
  try {
    const predictionData = req.body;
    
    console.log("Received prediction request:", predictionData);

    // Validate required fields
    const requiredFields = ['Crop', 'Season', 'Annual_Rainfall'];
    const missingFields = requiredFields.filter(field => !predictionData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Format data for external API
    const apiPayload = {
      Crop: predictionData.Crop,
      Season: predictionData.Season,
      State: predictionData.State || "Unknown",
      Crop_Year: parseInt(predictionData.Crop_Year) || new Date().getFullYear(),
      Area: parseFloat(predictionData.Area) || 1,
      Annual_Rainfall: parseFloat(predictionData.Annual_Rainfall) || 0,
      Fertilizer: parseFloat(predictionData.Fertilizer) || 0,
      Pesticide: parseFloat(predictionData.Pesticide) || 0,
    };

    console.log("Sending to external API:", apiPayload);

    // Make request to external API
    const response = await fetch("https://web-production-727e9.up.railway.app/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "CropPredictor/1.0",
      },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      throw new Error(`External API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log("External API response:", data);

    // Return the prediction result
    res.json({
      success: true,
      prediction: data.prediction,
      metadata: {
        timestamp: new Date().toISOString(),
        inputData: apiPayload,
      }
    });

  } catch (error) {
    console.error("Prediction proxy error:", error);
    
    // Return a fallback prediction if external API fails
    const fallbackPrediction = generateFallbackPrediction(req.body);
    
    res.json({
      success: false,
      prediction: fallbackPrediction,
      error: "External API unavailable, using fallback prediction",
      metadata: {
        timestamp: new Date().toISOString(),
        fallback: true,
      }
    });
  }
}

function generateFallbackPrediction(inputData: any): number {
  // Simple rule-based fallback prediction
  let baseYield = 35;
  
  const rainfall = parseFloat(inputData.Annual_Rainfall) || 150;
  const fertilizer = parseFloat(inputData.Fertilizer) || 100;
  const pesticide = parseFloat(inputData.Pesticide) || 2;
  
  // Rainfall effect (optimal around 150-250mm)
  if (rainfall >= 150 && rainfall <= 250) {
    baseYield *= 1.2;
  } else if (rainfall < 100 || rainfall > 400) {
    baseYield *= 0.8;
  }
  
  // Fertilizer effect
  if (fertilizer > 50) {
    baseYield *= (1 + Math.min(fertilizer / 200, 0.3));
  }
  
  // Pesticide effect (moderate use is better)
  if (pesticide > 0 && pesticide <= 5) {
    baseYield *= 1.1;
  } else if (pesticide > 10) {
    baseYield *= 0.9;
  }
  
  // Crop type adjustments
  const cropMultipliers: { [key: string]: number } = {
    'Rice': 1.2,
    'Wheat': 1.0,
    'Corn': 1.3,
    'Soybeans': 0.8,
    'Cotton': 0.6,
    'Barley': 1.1,
  };
  
  const cropMultiplier = cropMultipliers[inputData.Crop] || 1.0;
  baseYield *= cropMultiplier;
  
  // Add some randomness
  baseYield *= (0.9 + Math.random() * 0.2);
  
  return Math.round(Math.max(15, Math.min(80, baseYield)) * 100) / 100;
}
