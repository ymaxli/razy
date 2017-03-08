/**
 * @fileOverview read css/less file in server
 * @author Max
 */

import * as fs from 'fs';
import * as path from 'path';

export function importFile(filePath: string, dirname: string) {
    let filePathObj = path.parse(filePath);
    let cssFilePath = path.join(dirname, filePathObj.dir, filePathObj.name + '.css');
    try {
        let content = fs.readFileSync(cssFilePath, 'utf-8');
        return content;
    } catch (e) {
        console.error(e);
    }
    return '';
}