import base from './vite.config.js';
import path from 'path';
// HBuilderX ships a matched, patched Vue runtime. Keep all Vue internals on that version.
export default (...args) => {
  const config = base(...args);
  const modules = path.join(process.env.UNI_HBUILDERX_PLUGINS || 'D:/HBuilderX/plugins', 'uniapp-cli-vite/node_modules');
  config.resolve = { ...(config.resolve || {}), alias: {
    vue: path.join(modules, process.env.UNI_PLATFORM === 'h5' ? '@dcloudio/uni-h5-vue/dist/vue.runtime.esm.js' : '@dcloudio/uni-mp-vue/dist/vue.runtime.esm.js'),
    ...Object.fromEntries(['runtime-core', 'runtime-dom', 'reactivity', 'shared'].map(name => ['@vue/' + name, path.join(modules, '@vue', name)]))
  }};
  return config;
};
