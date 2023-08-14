// node_modules
import { CSSProperties, ReactElement } from 'react';

export type ReactElementProps = ReactEventHandlerProps & {
  children?: ReactElement | ReactElement[] | string | string[] | null;
  className?: string;
  key?: string;
  style?: CSSProperties;
};

export type ReactEventHandlerProps = {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};
