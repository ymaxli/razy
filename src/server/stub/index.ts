/**
 * @fileOverview stub server
 * @author Max
 */

import * as express from 'express';
import * as _expressStatic from 'express-serve-static-core'; // https://github.com/Microsoft/TypeScript/issues/5938
import * as fs from 'fs';
import * as path from 'path';
import * as jr from '../utils/json-result';
const router = express.Router();

router.all('*', (req, res, next) => {
    res.json(handleStubReq(req.path));
});

export function handleStubReq(reqPath: string) {
    const stubFilePath = path.join(
        process.cwd(), 
        __STUB_SERVER_FILE_DIR__,
        reqPath.substr(1).split('/').join('.') + '.json'
    );
    
    console.log(`visit stub file ${stubFilePath}`);
    
    let content: any;
    try{
        content = JSON.parse(fs.readFileSync(stubFilePath, {encoding: 'utf8'}));
    } catch(e) {
        content = jr.error('404 Not Found');
    }

    return content;
}

export {router};