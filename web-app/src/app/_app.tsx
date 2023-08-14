/**
 * @node_modules
 */
import { AppProps } from 'next/app';
import { lazy, ReactElement, Suspense } from 'react';

/**
 * @lazyImports
 */
// application
const ApplicationContextProvider = lazy(() => import(/* webpackChunkName: "Application" */ '@app-context/ApplicationContextProvider')); // prettier-ignore

/**
 * @component
 */
export default function App({ Component, pageProps }: AppProps): ReactElement {
  /**
   * @render
   */
  return (
    <Suspense fallback={'loading . . .'}>
      <ApplicationContextProvider>
        <div>{'hello world'}</div>
        <Component {...pageProps} />
      </ApplicationContextProvider>
    </Suspense>
  );
}
