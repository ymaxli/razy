/**
 * @fileOverview getClassName method
 * @author Max
 */

export default function(obj: Object) {
    const constructorStr = obj.constructor.toString();
    const indexOfLeftBrace = constructorStr.indexOf('(');
    return constructorStr.substr(0, indexOfLeftBrace).replace('function', '').trim();
}