require("dotenv").config();

async function embedText(text) {
  if (!text || text.trim() === "") {
    throw new Error("Text parameter is required and cannot be empty");
  }

  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_REGION || "us-central1";

  if (!project) {
    throw new Error("GOOGLE_CLOUD_PROJECT environment variable is not set");
  }

  try {
    // Alternative approach using direct HTTP request
    const { GoogleAuth } = require('google-auth-library');
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();

    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/text-embedding-004:predict`;

    const payload = {
      instances: [
        {
          content: text,
          task_type: "RETRIEVAL_DOCUMENT"
        }
      ],
      parameters: {
        outputDimensionality: 768
      }
    };

    console.log(`🔍 Attempting to embed text: "${text.substring(0, 50)}..."`);
    console.log(`📍 Using URL: ${url}`);
    console.log(`📤 Payload:`, JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`📥 Response:`, JSON.stringify(result, null, 2));

    if (!result.predictions || !result.predictions[0]) {
      throw new Error("Invalid response structure from AI Platform");
    }

    const prediction = result.predictions[0];
    let embedding;

    if (prediction.embeddings && prediction.embeddings.values) {
      embedding = prediction.embeddings.values;
    } else if (prediction.embedding && prediction.embedding.values) {
      embedding = prediction.embedding.values;
    } else if (Array.isArray(prediction.embeddings)) {
      embedding = prediction.embeddings;
    } else {
      console.error('❌ Unexpected response format:', prediction);
      throw new Error("Embedding values not found in response");
    }

    console.log(`✅ Successfully generated embedding with ${embedding.length} dimensions`);
    return embedding;

  } catch (error) {
    console.error("❌ Embedding error:", error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

module.exports = embedText;