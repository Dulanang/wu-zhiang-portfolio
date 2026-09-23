import rawProjects from './projects.json';
import rawAudio from './audio.json';
import {resolveAssets} from './assets.js';
export const data=resolveAssets(rawProjects);
export const audioConfig=resolveAssets(rawAudio);
