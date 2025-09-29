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
  private voiceCommandApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/voice-command`;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public async sendAudio(audioBlob: Blob): Promise<AudioResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const response = await fetch(this.voiceCommandApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al procesar el audio');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error al procesar el comando de voz');
    }

    const formData_ = this.mapToFormData(result);

    return {
      transcription: result.message,
      formData: formData_
    };
  }

  private mapToFormData(result: {
    intent: string;
    extractedData: Record<string, string | number | boolean | null>;
  }): AnalysisResponse | undefined {
    if (!result.extractedData || Object.keys(result.extractedData).length === 0) {
      return undefined;
    }

    let path = '';
    switch (result.intent) {
      case 'CREATE_TRANSACTION':
        path = 'transactions';
        break;
      case 'CREATE_GOAL':
        path = 'goals';
        break;
      case 'CREATE_BUDGET':
        path = 'budgets';
        break;
      default:
        return undefined;
    }

    return {
      path,
      schema: result.extractedData
    };
  }
} 