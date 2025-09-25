import { BaseHttpService } from "@/core/services/base-http.service";
import { Email } from "../interfaces/email.interface";

export class EmailService extends BaseHttpService<
    Email,
    Email,
    Email
> {
    protected baseUrl: string = "https://app.mailercheck.com/api/check/single";
    protected singleResponseKey: string = "email";
    protected pluralResponseKey: string = "emails";
    protected tempApi = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjA0OGFlYzE2MzUxYjNlMGY0NDdkN2ExZGI0NDcxYjU2MjJlYTI4MzU0YjViYTNkNGRmOGVkZTRiMTlhMjI4ODg5NDg5MDMwOTkyZmYwNGYiLCJpYXQiOjE3MzYxNzU2MTQuODMwNDgyLCJuYmYiOjE3MzYxNzU2MTQuODMwNDg0LCJleHAiOjQ4OTE4NDkyMTQuODIxODkyLCJzdWIiOiIxNjU2MTciLCJzY29wZXMiOltdfQ.eB6g-ij2c788k1jKUpDxnlscD4altIO8M0Tnn1uc4DDm6uTDV1og6WR0iV0S50vUrIqQ8OqNVwhYEvyDIKEwxQ"
    
    async verifyEmail(body: Email): Promise<string> {
        try {
            const { data } = await this.http.post<{status:string}>(
                `${this.baseUrl}`,
                { email: body.email },
                {
                    headers: {
                        Authorization: `Bearer ${this.tempApi}`,
                    }
                }
            );
            
            return data.status!;
        } catch (error: unknown) {
            throw error;
        }
    }
}

