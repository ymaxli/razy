/**
 * @fileOverview Configuration management
 *               this file injects variables to global space
 * @author Max
 */

import * as fs from 'fs';
import * as env from '../utils/env-detect';
import * as path from 'path';
import {injectConfVariable} from './utils';

const DEV_CONF_PATH = path.join(process.cwd(), 'conf/dev.json');
const TEST_CONF_PATH = path.join(process.cwd(), 'conf/test.json');
const PROD_CONF_PATH = path.join(process.cwd(), 'conf/prod.json');

// read conf file
let vanillaConfigObj;
try {
    let filePath;
    if(env.prod()) filePath = PROD_CONF_PATH;
    else if(env.test()) filePath = TEST_CONF_PATH;
    else filePath = DEV_CONF_PATH;

    vanillaConfigObj = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf8'}));
} catch (error) {
   console.error(error.stack);
   throw error;
}

// inject conf variables
injectConfVariable(vanillaConfigObj);

export {vanillaConfigObj};