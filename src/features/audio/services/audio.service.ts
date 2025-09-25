interface AudioResponse {
  transcription: string;
  formData?: {
    path: string;
    schema: {
      [key: string]: string | number | boolean | null;
    };
  };
}

interface AnalysisResponse {
  path: string;
  schema: {
    user_id?: number;
    amount?: number;
    type?: "EXPENSE" | "INCOME" | "CONTRIBUTION";
    category?: string;
    description?: string;
    payment_method_id?: number;
    goal_id?: number;
    name?: string;
    target_amount?: number;
    current_amount?: number;
    contribution_frecuency?: number;
    contribution_amount?: number;
    end_date?: string;
  };
}

export class AudioService {
  private static instance: AudioService;
  private transcriptionApiUrl = "https://srpabliss.app.n8n.cloud/webhook/a4b8adaf-8593-4cb1-a6cc-14469ad5529e";
  private analysisApiUrl = "https://srpabliss.app.n8n.cloud/webhook/f3270e72-76d5-495b-9dbf-27d15b6671c2";

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public async sendAudio(audioBlob: Blob): Promise<AudioResponse> {
    // Primero obtenemos la transcripción
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    const transcriptionResponse = await fetch(this.transcriptionApiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error('Error al obtener la transcripción');
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcription = transcriptionData.transcription || transcriptionData.text;

    if (!transcription) {
      throw new Error('No se pudo obtener la transcripción del audio');
    }

    const analysisResponse = await fetch(this.analysisApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: transcription }),
    });

    if (!analysisResponse.ok) {
      throw new Error('Error al analizar el mensaje');
    }

    const analysisResult: AnalysisResponse = await analysisResponse.json();

    return {
      transcription,
      formData: analysisResult
    };
  }
} 