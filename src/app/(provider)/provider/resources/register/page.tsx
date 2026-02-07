"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Cpu,
  Monitor,
  DollarSign,
  ClipboardCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Connection", icon: Globe },
  { label: "Hardware", icon: Cpu },
  { label: "Pricing", icon: DollarSign },
  { label: "Review", icon: ClipboardCheck },
];

const gpuModels = [
  "RTX 3060",
  "RTX 3080",
  "RTX 3090",
  "RTX 4060",
  "RTX 4070",
  "RTX 4080",
  "RTX 4090",
  "A100 40GB",
  "A100 80GB",
  "H100",
  "V100",
];

const suggestedPrices: Record<string, number> = {
  "RTX 3060": 0.55,
  "RTX 3080": 0.95,
  "RTX 3090": 1.20,
  "RTX 4060": 0.70,
  "RTX 4070": 1.05,
  "RTX 4080": 1.50,
  "RTX 4090": 2.50,
  "A100 40GB": 3.20,
  "A100 80GB": 4.50,
  "H100": 6.00,
  "V100": 1.80,
};

interface FormData {
  // Step 1: Connection
  ipAddress: string;
  sshPort: string;
  sshUsername: string;
  rentalPort: string;
  // Step 2: Hardware
  resourceType: "gpu" | "cpu";
  gpuModel: string;
  gpuCount: string;
  gpuVram: string;
  cpuModel: string;
  cpuCores: string;
  cpuThreads: string;
  ram: string;
  storage: string;
  storageType: "SSD" | "NVMe" | "HDD";
  // Step 3: Pricing
  hourlyPrice: string;
  allowMining: boolean;
  // Step 4: Review
  termsAgreed: boolean;
}

const initialFormData: FormData = {
  ipAddress: "",
  sshPort: "22",
  sshUsername: "",
  rentalPort: "8080",
  resourceType: "gpu",
  gpuModel: "",
  gpuCount: "1",
  gpuVram: "",
  cpuModel: "",
  cpuCores: "",
  cpuThreads: "",
  ram: "",
  storage: "",
  storageType: "NVMe",
  hourlyPrice: "",
  allowMining: false,
  termsAgreed: false,
};

export default function RegisterResourcePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [connectionTesting, setConnectionTesting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<
    "success" | "error" | null
  >(null);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function canProceed(): boolean {
    switch (currentStep) {
      case 0:
        return !!(
          formData.ipAddress.trim() &&
          formData.sshPort.trim() &&
          formData.sshUsername.trim() &&
          formData.rentalPort.trim()
        );
      case 1:
        if (formData.resourceType === "gpu") {
          return !!(
            formData.gpuModel &&
            formData.gpuCount &&
            formData.gpuVram &&
            formData.ram &&
            formData.storage
          );
        }
        return !!(
          formData.cpuModel.trim() &&
          formData.cpuCores &&
          formData.cpuThreads &&
          formData.ram &&
          formData.storage
        );
      case 2:
        return !!formData.hourlyPrice;
      case 3:
        return formData.termsAgreed;
      default:
        return false;
    }
  }

  function handleTestConnection() {
    setConnectionTesting(true);
    setConnectionResult(null);
    setTimeout(() => {
      setConnectionTesting(false);
      setConnectionResult("success");
    }, 2000);
  }

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  const suggestedPrice =
    formData.resourceType === "gpu" && formData.gpuModel
      ? suggestedPrices[formData.gpuModel]
      : undefined;

  const inputClasses =
    "w-full rounded-lg border border-border bg-mist px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest";
  const labelClasses = "mb-1.5 block text-sm font-medium text-foreground";
  const selectClasses =
    "w-full appearance-none rounded-lg border border-border bg-mist px-4 py-2.5 text-sm text-foreground focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Register New Resource
        </h1>
        <p className="mt-1 text-muted-foreground">
          Add your compute resource to the Gatehouse network.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isComplete = idx < currentStep;

          return (
            <div key={step.label} className="flex flex-1 items-center gap-2">
              <div className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isComplete
                      ? "border-fern bg-fern text-white"
                      : isActive
                        ? "border-forest bg-forest text-white"
                        : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive || isComplete
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "mb-5 h-0.5 w-full flex-1",
                    isComplete ? "bg-fern" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Step {currentStep + 1}: {steps[currentStep].label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Step 1: Connection */}
          {currentStep === 0 && (
            <>
              <div>
                <label className={labelClasses}>IP Address</label>
                <input
                  type="text"
                  placeholder="e.g. 102.89.23.45"
                  value={formData.ipAddress}
                  onChange={(e) => updateField("ipAddress", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClasses}>SSH Port</label>
                  <input
                    type="number"
                    placeholder="22"
                    value={formData.sshPort}
                    onChange={(e) => updateField("sshPort", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Rental Port</label>
                  <input
                    type="number"
                    placeholder="8080"
                    value={formData.rentalPort}
                    onChange={(e) => updateField("rentalPort", e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className={labelClasses}>SSH Username</label>
                <input
                  type="text"
                  placeholder="e.g. ubuntu"
                  value={formData.sshUsername}
                  onChange={(e) => updateField("sshUsername", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={
                    connectionTesting ||
                    !formData.ipAddress.trim() ||
                    !formData.sshUsername.trim()
                  }
                  className="gap-2"
                >
                  {connectionTesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                  Test Connection
                </Button>
                {connectionResult === "success" && (
                  <span className="flex items-center gap-1.5 text-sm text-fern">
                    <CheckCircle className="h-4 w-4" />
                    Connection successful
                  </span>
                )}
              </div>
            </>
          )}

          {/* Step 2: Hardware */}
          {currentStep === 1 && (
            <>
              {/* Resource type toggle */}
              <div>
                <label className={labelClasses}>Resource Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField("resourceType", "gpu")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      formData.resourceType === "gpu"
                        ? "border-forest bg-forest/15 text-forest"
                        : "border-border bg-mist text-muted-foreground hover:border-forest/30"
                    )}
                  >
                    <Monitor className="h-4 w-4" />
                    GPU
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("resourceType", "cpu")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      formData.resourceType === "cpu"
                        ? "border-copper bg-copper/15 text-copper"
                        : "border-border bg-mist text-muted-foreground hover:border-copper/30"
                    )}
                  >
                    <Cpu className="h-4 w-4" />
                    CPU
                  </button>
                </div>
              </div>

              {formData.resourceType === "gpu" ? (
                <>
                  <div>
                    <label className={labelClasses}>GPU Model</label>
                    <select
                      value={formData.gpuModel}
                      onChange={(e) => updateField("gpuModel", e.target.value)}
                      className={selectClasses}
                    >
                      <option value="">Select GPU model...</option>
                      {gpuModels.map((model) => (
                        <option key={model} value={model}>
                          NVIDIA {model}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClasses}>GPU Count</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={formData.gpuCount}
                        onChange={(e) =>
                          updateField("gpuCount", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>VRAM (GB)</label>
                      <input
                        type="number"
                        placeholder="e.g. 24"
                        value={formData.gpuVram}
                        onChange={(e) =>
                          updateField("gpuVram", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelClasses}>CPU Model</label>
                    <input
                      type="text"
                      placeholder="e.g. AMD EPYC 7543"
                      value={formData.cpuModel}
                      onChange={(e) => updateField("cpuModel", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClasses}>Cores</label>
                      <input
                        type="number"
                        placeholder="e.g. 32"
                        value={formData.cpuCores}
                        onChange={(e) =>
                          updateField("cpuCores", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Threads</label>
                      <input
                        type="number"
                        placeholder="e.g. 64"
                        value={formData.cpuThreads}
                        onChange={(e) =>
                          updateField("cpuThreads", e.target.value)
                        }
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClasses}>RAM (GB)</label>
                  <input
                    type="number"
                    placeholder="e.g. 64"
                    value={formData.ram}
                    onChange={(e) => updateField("ram", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Storage (GB)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={formData.storage}
                    onChange={(e) => updateField("storage", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Storage Type</label>
                  <select
                    value={formData.storageType}
                    onChange={(e) =>
                      updateField(
                        "storageType",
                        e.target.value as "SSD" | "NVMe" | "HDD"
                      )
                    }
                    className={selectClasses}
                  >
                    <option value="NVMe">NVMe</option>
                    <option value="SSD">SSD</option>
                    <option value="HDD">HDD</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 2 && (
            <>
              <div>
                <label className={labelClasses}>Hourly Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={formData.hourlyPrice}
                    onChange={(e) =>
                      updateField("hourlyPrice", e.target.value)
                    }
                    className={cn(inputClasses, "pl-8")}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    per hour
                  </span>
                </div>
              </div>

              {suggestedPrice && (
                <div className="rounded-lg border border-forest/20 bg-forest/5 p-4">
                  <p className="text-sm font-medium text-forest">
                    Suggested price for {formData.gpuModel}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    ${suggestedPrice.toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /hr
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Based on similar resources on the network. You can set any
                    price you prefer.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      updateField("hourlyPrice", suggestedPrice.toFixed(2))
                    }
                  >
                    Use suggested price
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateField("allowMining", !formData.allowMining)
                  }
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    formData.allowMining ? "bg-forest" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                      formData.allowMining && "translate-x-5"
                    )}
                  />
                </button>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Allow mining when idle
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Earn additional income when your resource is not rented
                  </p>
                </div>
              </div>

              {formData.hourlyPrice && (
                <div className="rounded-lg bg-mist p-4">
                  <p className="text-sm text-muted-foreground">
                    Estimated monthly earnings (assuming 70% utilization)
                  </p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    ${(parseFloat(formData.hourlyPrice) * 24 * 30 * 0.7).toFixed(0)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </p>
                </div>
              )}
            </>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <>
              <div className="space-y-4">
                {/* Connection summary */}
                <div className="rounded-lg bg-mist p-4">
                  <h4 className="text-sm font-semibold text-foreground">
                    Connection Details
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="text-foreground">
                      {formData.ipAddress}
                    </span>
                    <span className="text-muted-foreground">SSH Port:</span>
                    <span className="text-foreground">{formData.sshPort}</span>
                    <span className="text-muted-foreground">SSH Username:</span>
                    <span className="text-foreground">
                      {formData.sshUsername}
                    </span>
                    <span className="text-muted-foreground">Rental Port:</span>
                    <span className="text-foreground">
                      {formData.rentalPort}
                    </span>
                  </div>
                </div>

                {/* Hardware summary */}
                <div className="rounded-lg bg-mist p-4">
                  <h4 className="text-sm font-semibold text-foreground">
                    Hardware Specifications
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground">
                      {formData.resourceType.toUpperCase()}
                    </span>
                    {formData.resourceType === "gpu" ? (
                      <>
                        <span className="text-muted-foreground">
                          GPU Model:
                        </span>
                        <span className="text-foreground">
                          NVIDIA {formData.gpuModel}
                        </span>
                        <span className="text-muted-foreground">Count:</span>
                        <span className="text-foreground">
                          {formData.gpuCount}x
                        </span>
                        <span className="text-muted-foreground">VRAM:</span>
                        <span className="text-foreground">
                          {formData.gpuVram}GB
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground">
                          CPU Model:
                        </span>
                        <span className="text-foreground">
                          {formData.cpuModel}
                        </span>
                        <span className="text-muted-foreground">Cores:</span>
                        <span className="text-foreground">
                          {formData.cpuCores}
                        </span>
                        <span className="text-muted-foreground">Threads:</span>
                        <span className="text-foreground">
                          {formData.cpuThreads}
                        </span>
                      </>
                    )}
                    <span className="text-muted-foreground">RAM:</span>
                    <span className="text-foreground">{formData.ram}GB</span>
                    <span className="text-muted-foreground">Storage:</span>
                    <span className="text-foreground">
                      {formData.storage}GB {formData.storageType}
                    </span>
                  </div>
                </div>

                {/* Pricing summary */}
                <div className="rounded-lg bg-mist p-4">
                  <h4 className="text-sm font-semibold text-foreground">
                    Pricing
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Hourly Rate:</span>
                    <span className="text-foreground">
                      ${formData.hourlyPrice}/hr
                    </span>
                    <span className="text-muted-foreground">Mining:</span>
                    <span className="text-foreground">
                      {formData.allowMining ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAgreed}
                  onChange={(e) =>
                    updateField("termsAgreed", e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-border bg-mist text-forest accent-forest"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the Gatehouse Provider Terms of Service and
                  understand that my resource will undergo verification before
                  becoming available on the marketplace.
                </span>
              </label>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={!canProceed()} className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Submit for Verification
          </Button>
        )}
      </div>
    </div>
  );
}
