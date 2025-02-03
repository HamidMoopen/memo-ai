export interface DataCollectionItem {
  type: 'string' | 'array' | 'object';
  identifier: string;
  description: string;
}

export interface DataCollection {
  items: DataCollectionItem[];
}

declare global {
  interface Window {
    elevenlabs: {
      agent: {
        start: (config: {
          agentId: string;
          context?: Record<string, string>;
        }) => Promise<Conversation>;
      };
    };
    elevenLabsInitialized: boolean;
  }
}

interface Conversation {
  on: (
    event: "update" | "error" | "end",
    callback: (data: string | Error) => void
  ) => void;
  stop: () => Promise<void>;
  getData: () => Promise<Record<string, string>>;
}

export {}; 