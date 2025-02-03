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
    elevenLabsInitialized?: boolean;
    elevenlabs: {
      init: (config: { apiKey: string }) => void;
      configure: (config: { 
        dataCollection?: DataCollection;
      }) => void;
      agent: {
        start: (config: {
          agentId: string;
          context?: any;
          history?: any[];
        }) => Promise<{
          on: (event: string, callback: (data: any) => void) => void;
          stop: () => Promise<void>;
          getData: () => Promise<any>;
        }>;
      };
    };
  }
} 