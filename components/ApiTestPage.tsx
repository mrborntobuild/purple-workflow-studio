import React, { useState } from 'react';
import { Play, Copy, Check, X, Loader2 } from 'lucide-react';

interface ApiTestResult {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
  requestId?: string;
}

const MODEL_EXAMPLES: Record<string, any> = {
  'nano-banana-pro': {
    model: 'fal-ai/nano-banana-pro',
    prompt: 'A bird flying in the city of atlanta',
    num_images: 1,
    aspect_ratio: '1:1',
    output_format: 'png',
    resolution: '1K',
    waitForCompletion: false
  },
  'flux-pro/v1.1': {
    model: 'fal-ai/flux-pro/v1.1',
    prompt: 'Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word "FLUX" is painted over it in big, white brush strokes with visible texture.',
    image_size: 'landscape_4_3',
    num_images: 1,
    enable_safety_checker: true,
    output_format: 'jpeg',
    safety_tolerance: '2',
    waitForCompletion: false
  },
  'v1.1-ultra': {
    model: 'fal-ai/flux-pro/v1.1-ultra',
    prompt: 'Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word "FLUX" is painted over it in big, white brush strokes with visible texture.',
    num_images: 1,
    enable_safety_checker: true,
    output_format: 'jpeg',
    safety_tolerance: '2',
    aspect_ratio: '16:9',
    waitForCompletion: false
  },
  'flux-lora': {
    model: 'fal-ai/flux-lora',
    prompt: 'Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word "FLUX" is painted over it in big, white brush strokes with visible texture.',
    image_size: 'landscape_4_3',
    num_inference_steps: 28,
    guidance_scale: 3.5,
    num_images: 1,
    enable_safety_checker: true,
    output_format: 'jpeg',
    waitForCompletion: false
  },
  'ideogram/v3/edit': {
    model: 'fal-ai/ideogram/v3/edit',
    rendering_speed: 'BALANCED',
    expand_prompt: true,
    num_images: 1,
    prompt: 'black bag',
    image_url: 'https://v3.fal.media/files/panda/-LC_gNNV3wUHaGMQT3klE_output.png',
    mask_url: 'https://v3.fal.media/files/kangaroo/1dd3zEL5MXQ3Kb4-mRi9d_indir%20(20).png',
    waitForCompletion: false
  },
  'imagen3/fast': {
    model: 'fal-ai/imagen3/fast',
    prompt: 'A serene landscape with mountains reflected in a crystal clear lake at sunset',
    aspect_ratio: '1:1',
    num_images: 1,
    waitForCompletion: false
  },
  'flux/dev': {
    model: 'fal-ai/flux/dev',
    prompt: 'Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word "FLUX" is painted over it in big, white brush strokes with visible texture.',
    image_size: 'landscape_4_3',
    num_inference_steps: 28,
    guidance_scale: 3.5,
    num_images: 1,
    enable_safety_checker: true,
    output_format: 'jpeg',
    acceleration: 'none',
    waitForCompletion: false
  },
  'ideogram/v3': {
    model: 'fal-ai/ideogram/v3',
    rendering_speed: 'BALANCED',
    expand_prompt: true,
    num_images: 1,
    prompt: 'The Bone Forest stretched across the horizon, its trees fashioned from the ossified remains of ancient leviathans that once swam through the sky. Shamans with antlers growing from their shoulders and eyes that revealed the true nature of any being they beheld conducted rituals to commune with the spirits that still inhabited the calcified grove. In sky writes "Ideogram V3 in fal.ai"',
    image_size: 'square_hd',
    waitForCompletion: false
  },
  'imagen3': {
    model: 'fal-ai/imagen3',
    prompt: 'A serene landscape with mountains reflected in a crystal clear lake at sunset',
    aspect_ratio: '1:1',
    num_images: 1,
    waitForCompletion: false
  },
  'minimax/image-01': {
    model: 'fal-ai/minimax/image-01',
    prompt: 'Man dressed in white t shirt, full-body stand front view image, outdoor, Venice beach sign, full-body image, Los Angeles, Fashion photography of 90s, documentary, Film grain, photorealistic',
    aspect_ratio: '1:1',
    num_images: 1,
    waitForCompletion: false
  }
};

export const ApiTestPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedModel, setSelectedModel] = useState<string>('nano-banana-pro');
  const [requestBody, setRequestBody] = useState<string>('');
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('http://localhost:3002');
  const [generateResult, setGenerateResult] = useState<ApiTestResult | null>(null);
  const [statusResult, setStatusResult] = useState<ApiTestResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string>('');

  // Initialize request body when model changes
  React.useEffect(() => {
    const example = MODEL_EXAMPLES[selectedModel];
    if (example) {
      setRequestBody(JSON.stringify(example, null, 2));
    }
  }, [selectedModel]);

  const handleLoadExample = () => {
    const example = MODEL_EXAMPLES[selectedModel];
    if (example) {
      setRequestBody(JSON.stringify(example, null, 2));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(requestBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setGenerateResult(null);
    setStatusResult(null);
    setRequestId('');

    try {
      const body = JSON.parse(requestBody);
      const response = await fetch(`${apiBaseUrl}/api/fal/image/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      setGenerateResult({
        success: response.ok,
        data,
        status: response.status,
        requestId: data?.data?.request_id
      });

      if (data?.data?.request_id) {
        setRequestId(data.data.request_id);
      }
    } catch (error: any) {
      setGenerateResult({
        success: false,
        error: error.message || 'Failed to make request'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!requestId) {
      alert('Please generate a request first to get a request_id');
      return;
    }

    setIsPolling(true);
    setStatusResult(null);

    try {
      const body = JSON.parse(requestBody);
      const model = body.model;
      const response = await fetch(`${apiBaseUrl}/api/fal/tasks/${requestId}?model=${encodeURIComponent(model)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      setStatusResult({
        success: response.ok,
        data,
        status: response.status
      });
    } catch (error: any) {
      setStatusResult({
        success: false,
        error: error.message || 'Failed to check status'
      });
    } finally {
      setIsPolling(false);
    }
  };

  const startPolling = () => {
    if (!requestId) {
      alert('Please generate a request first to get a request_id');
      return;
    }

    setIsPolling(true);
    const body = JSON.parse(requestBody);
    const model = body.model;
    let attempts = 0;
    const maxAttempts = 200;

    const poll = async () => {
      try {
        attempts++;
        const response = await fetch(`${apiBaseUrl}/api/fal/tasks/${requestId}?model=${encodeURIComponent(model)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        setStatusResult({
          success: response.ok,
          data,
          status: response.status
        });

        const status = data?.data?.status;
        if (status === 'COMPLETED' || status === 'FAILED' || attempts >= maxAttempts) {
          setIsPolling(false);
        } else {
          setTimeout(poll, 2500);
        }
      } catch (error: any) {
        setIsPolling(false);
        setStatusResult({
          success: false,
          error: error.message || 'Failed to poll status'
        });
      }
    };

    poll();
  };

  const stopPolling = () => {
    setIsPolling(false);
  };

  return (
    <div className="h-screen w-screen bg-[#050506] text-white overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">API Test Page</h1>
            <p className="text-gray-400">Test image generation API calls</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Back to App
          </button>
        </div>

        {/* API Base URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">API Base URL</label>
          <input
            type="text"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            className="w-full px-4 py-2 bg-[#161719] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="http://localhost:3002"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Request */}
          <div className="space-y-6">
            <div className="bg-[#161719] rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Request</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleLoadExample}
                    className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Load Example
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    Copy
                  </button>
                </div>
              </div>

              {/* Model Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0b] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  {Object.keys(MODEL_EXAMPLES).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>

              {/* Request Body Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Request Body (JSON)</label>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full h-96 px-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Enter JSON request body..."
                />
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !requestBody}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generate Response */}
            {generateResult && (
              <div className="bg-[#161719] rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Generate Response</h2>
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    generateResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {generateResult.status || 'Error'}
                  </div>
                </div>
                <pre className="bg-[#0a0a0b] p-4 rounded-lg overflow-auto text-xs">
                  {generateResult.error 
                    ? generateResult.error 
                    : JSON.stringify(generateResult.data, null, 2)}
                </pre>
                {generateResult.requestId && (
                  <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
                    <div className="text-sm text-purple-400 mb-1">Request ID:</div>
                    <div className="font-mono text-sm">{generateResult.requestId}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Status */}
          <div className="space-y-6">
            <div className="bg-[#161719] rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Status Check</h2>
              </div>

              {requestId && (
                <div className="mb-4 p-3 bg-purple-500/10 rounded-lg">
                  <div className="text-sm text-purple-400 mb-1">Current Request ID:</div>
                  <div className="font-mono text-sm break-all">{requestId}</div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCheckStatus}
                  disabled={!requestId || isPolling}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {isPolling ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      Check Status
                    </>
                  )}
                </button>
                {isPolling ? (
                  <button
                    onClick={stopPolling}
                    className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                  >
                    Stop Polling
                  </button>
                ) : (
                  <button
                    onClick={startPolling}
                    disabled={!requestId}
                    className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                  >
                    Start Polling
                  </button>
                )}
              </div>
            </div>

            {/* Status Response */}
            {statusResult && (
              <div className="bg-[#161719] rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Status Response</h2>
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    statusResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {statusResult.status || 'Error'}
                  </div>
                </div>
                <pre className="bg-[#0a0a0b] p-4 rounded-lg overflow-auto text-xs max-h-96">
                  {statusResult.error 
                    ? statusResult.error 
                    : JSON.stringify(statusResult.data, null, 2)}
                </pre>
                {statusResult.data?.data?.status && (
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                    <div className="text-sm text-blue-400 mb-1">Status:</div>
                    <div className="font-semibold">{statusResult.data.data.status}</div>
                  </div>
                )}
                {statusResult.data?.data?.result?.images?.[0]?.url && (
                  <div className="mt-4">
                    <div className="text-sm text-green-400 mb-2">Generated Image:</div>
                    <img 
                      src={statusResult.data.data.result.images[0].url} 
                      alt="Generated" 
                      className="max-w-full rounded-lg border border-white/10"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


