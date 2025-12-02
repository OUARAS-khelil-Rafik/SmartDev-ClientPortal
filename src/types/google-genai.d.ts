declare module '@google/genai' {
  interface GoogleGenAIOptions {
    apiKey?: string;
  }

  type ChatCreateOptions = any;
  type ChatSendResult = { text?: string } & Record<string, any>;

  export class GoogleGenAI {
    constructor(options?: GoogleGenAIOptions);
    chats: {
      create: (opts: ChatCreateOptions) => {
        sendMessage: (args: { message: string }) => Promise<ChatSendResult>;
      };
    };
  }

  export default GoogleGenAI;
}
