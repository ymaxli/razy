/**
 * @fileOverview retina screen compatibility solution
 * @author Max
 **/

const RETINA_SIGN = '@';
const RETINA_RATIO = {
    RATIO_1X: '',
    RATIO_2X: RETINA_SIGN + '2x',
    RATIO_3X: RETINA_SIGN + '3x'
};
const mediaQuery3x = generateMediaQuery(3);
const mediaQuery2x = generateMediaQuery(2);
function generateMediaQuery(ratio: 2 | 3) {
    return `(-webkit-min-device-pixel-ratio: ${ratio - 0.5}),` +
        `(min--moz-device-pixel-ratio: ${ratio - 0.5}), ` +
        `(-o-min-device-pixel-ratio: ${ratio * 2 - 1}/2), ` +
        `(min-device-pixel-ratio: ${ratio - 0.5}), ` +
        `(min-resolution: ${ratio - 0.5}dppx), ` +
        `(min-resolution: ${ratio === 2 ? 240 : 400}dpi)`;
}


let devicePixelRatio: string;
let ratio: number;
/**
 * init
 */
export default function init(ratio?: string) {
    checkDevicePixelRatio(ratio);
}
export const getRatio = () => ratio;

/**
 * check device pixel ratio by mediaQuery
 * isomorphic method
 * return default ratio dicided by param `ratio` in server 
 */
function checkDevicePixelRatio(defaultRatio?: string) {

    if (typeof window === 'undefined') {
        devicePixelRatio = defaultRatio || RETINA_RATIO.RATIO_1X;
        ratio = parseInt(defaultRatio, 10) || 1;
        return;
    }

    let windowDevicePixelRatio = window.devicePixelRatio ||
        window.screen.deviceXDPI / window.screen.logicalXDPI;
    if (windowDevicePixelRatio >= 2.5) {
        devicePixelRatio = RETINA_RATIO.RATIO_3X;
        ratio = 3;
        return;
    } else if (windowDevicePixelRatio >= 1.5) {
        devicePixelRatio = RETINA_RATIO.RATIO_2X;
        ratio = 2;
        return;
    }

    if (window.matchMedia && window.matchMedia(mediaQuery3x).matches) {
        devicePixelRatio = RETINA_RATIO.RATIO_3X;
        ratio = 3;
        return;
    } else if (window.matchMedia && window.matchMedia(mediaQuery2x).matches) {
        devicePixelRatio = RETINA_RATIO.RATIO_2X;
        ratio = 2;
        return;
    }

    ratio = 1;
    devicePixelRatio = RETINA_RATIO.RATIO_1X;
}

export function ret(input: string) {
    var pieces = input.split('.');
    pieces[pieces.length - 2] += devicePixelRatio;
    var result = pieces.join('.');

    return result;
}
