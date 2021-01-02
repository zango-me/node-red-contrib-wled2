"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToRgb = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function hexToRgb(hex) {
    if (!hex) {
        return [0, 0, 0];
    }
    return hex
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) { return "#" + r + r + g + g + b + b; })
        .substring(1)
        .match(/.{2}/g)
        .map(function (x) { return parseInt(x, 16); });
}
exports.hexToRgb = hexToRgb;
//# sourceMappingURL=helpers.js.map