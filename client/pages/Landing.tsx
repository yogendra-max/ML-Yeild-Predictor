import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  TrendingUp, 
  BarChart3, 
  User, 
  CheckCircle,
  Droplets,
  Thermometer,
  Shield,
  Target,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning algorithms analyze weather patterns and farming data to predict crop yields with high accuracy."
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Interactive charts and graphs help you understand the relationship between weather, pesticide usage, and crop performance."
    },
    {
      icon: Target,
      title: "Precision Farming",
      description: "Optimize pesticide usage and farming practices based on data-driven insights for sustainable agriculture."
    },
    {
      icon: CheckCircle,
      title: "Historical Tracking",
      description: "Track your farm's performance over time and identify trends to make better decisions for future seasons."
    }
  ];

  const stats = [
    { label: "Prediction Accuracy", value: "95%", icon: Target },
    { label: "Farmers Helped", value: "10K+", icon: User },
    { label: "Crops Analyzed", value: "50M+", icon: Sprout },
    { label: "Data Points", value: "1B+", icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-crop-green rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Crop Yield Predictor</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  AI-powered agricultural intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button onClick={() => navigate('/predict')}>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Powered by Advanced AI
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Predict Your Crop Yields with
              <span className="text-crop-green"> AI Precision</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Harness the power of machine learning to optimize your farming decisions. 
              Get accurate yield predictions based on weather patterns, soil conditions, and agricultural practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/predict')}>
                Start Predicting Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
                View Dashboard
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white/50 backdrop-blur-sm py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-crop-green/10 rounded-full">
                        <Icon className="h-6 w-6 text-crop-green" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need to make data-driven agricultural decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-crop-green/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-crop-green/10 rounded-lg">
                        <Icon className="h-6 w-6 text-crop-green" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-white/50 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Get accurate predictions in three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-crop-green rounded-full">
                    <Thermometer className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Input Data</h3>
                <p className="text-muted-foreground">
                  Enter your weather conditions, soil type, and farming practices
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-water-blue rounded-full">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your data against historical patterns and models
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-wheat-gold rounded-full">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Predictions</h3>
                <p className="text-muted-foreground">
                  Receive accurate yield predictions with confidence scores and insights
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="bg-gradient-to-r from-crop-green to-crop-green/80 text-white border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Ready to Optimize Your Farm?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Join thousands of farmers who are already using AI to increase their crop yields and reduce costs.
              </p>
              <Button size="lg" variant="secondary" onClick={() => navigate('/auth')}>
                Start Your Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-crop-green rounded-lg">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">Crop Yield Predictor</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Crop Yield Predictor. Helping farmers grow better.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
