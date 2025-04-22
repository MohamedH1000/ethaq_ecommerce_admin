export interface WhatsAppMessage {
  to: string;
  message: string;
  template?: string;
  variables?: Record<string, string>;
}
