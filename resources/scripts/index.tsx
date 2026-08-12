import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App';
import { setConfig } from 'react-hot-loader';
import '@/assets/css/pigeon.css';
import { initPigeonTheme } from '@/lib/pigeonTheme';

// Enable language support.
import './i18n';

// Apply the persisted theme + customization preferences before the first
// paint to avoid a flash of the default theme.
initPigeonTheme();

// Prevents page reloads while making component changes which
// also avoids triggering constant loading indicators all over
// the place in development.
//
// @see https://github.com/gaearon/react-hot-loader#hook-support
setConfig({ reloadHooks: false });

ReactDOM.render(<App />, document.getElementById('app'));
