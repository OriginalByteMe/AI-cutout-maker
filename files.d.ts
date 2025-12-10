interface Card {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
}

declare module '@files-ui/react' {
  import * as React from 'react';

  export type ExtFile = any;
  export const FileMosaic: React.FC<any>;
  export const FullScreen: React.FC<any>;
  export const ImagePreview: React.FC<any>;
  export const Dropzone: React.FC<any>;
  export type Method = any;
}
