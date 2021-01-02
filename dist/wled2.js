"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var discover_1 = __importDefault(require("./controllers/discover"));
var effects_1 = __importDefault(require("./controllers/effects"));
var helpers = __importStar(require("./helpers"));
var NodeGlobals = __importStar(require("./nodeGlobals"));
var palettes_1 = __importDefault(require("./controllers/palettes"));
var WledDevice_1 = __importDefault(require("./WledDevice"));
module.exports = function (RED) {
    NodeGlobals.setRed(RED);
    RED.httpAdmin.get("/wled2/discover", discover_1.default);
    RED.httpAdmin.get("/wled2/effects/:address", effects_1.default);
    RED.httpAdmin.get("/wled2/palettes/:address", palettes_1.default);
    RED.nodes.registerType("wled2", function (props) {
        var _this = this;
        this.config = props;
        RED.nodes.createNode(this, props);
        // When this is loaded for the node palette there's no address
        // so just skip the rest and return silently.
        if (!this.config.address) {
            return;
        }
        this.wled = new WledDevice_1.default({ server: this.config.address });
        this.on("input", setState.bind(this));
        this.wled.on("connected", onConnected.bind(this));
        this.wled.on("connecting", onConnecting.bind(this));
        this.wled.on("disconnected", onDisconnected.bind(this));
        this.wled.on("error", onError.bind(this));
        // On failures the node can just do nothing. Error state
        // will get set automatically by an event fired from the WledDevice object.
        this.wled.getState().catch(function (e) {
            _this.error("Unable to get state at startup: " + e);
            return;
        });
    });
    function setState(msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __awaiter(this, void 0, void 0, function () {
            var payload, delay, targetState, requestedState, e_1, on, state;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        // Any setting of state stops any prior delayed attempt to set the state to solid
                        clearTimeout(this.solidTimer);
                        payload = msg.payload;
                        delay = (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.delay) !== null && _a !== void 0 ? _a : Number(this.config.delay)) !== null && _b !== void 0 ? _b : 0;
                        requestedState = (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.state) !== null && _c !== void 0 ? _c : this.config.state) !== null && _d !== void 0 ? _d : "on";
                        _r.label = 1;
                    case 1:
                        _r.trys.push([1, 5, , 6]);
                        if (!(requestedState.toLowerCase() === "toggle")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.wled.getCurrentOnState().catch(function (e) {
                                throw Error("Unable to obtain current device on state to perform toggle: " + e);
                            })];
                    case 2:
                        targetState = !(_r.sent());
                        return [3 /*break*/, 4];
                    case 3:
                        targetState = requestedState.toLowerCase() === "on";
                        _r.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _r.sent();
                        // This means the current on state couldn't be retrieved so just give up.
                        this.error(e_1);
                        return [2 /*return*/];
                    case 6:
                        // If the targetState couldn't be obtained for toggle then bail as failed.
                        if (targetState == null)
                            return [2 /*return*/];
                        on = delay ? true : targetState;
                        state = {
                            on: on,
                        };
                        // If a preset was set then that overrides everything else
                        if ((payload === null || payload === void 0 ? void 0 : payload.preset) || this.config.preset) {
                            state.ps = (_e = payload === null || payload === void 0 ? void 0 : payload.preset) !== null && _e !== void 0 ? _e : Number(this.config.preset);
                        }
                        else {
                            state.bri = (_f = payload === null || payload === void 0 ? void 0 : payload.brightness) !== null && _f !== void 0 ? _f : Number(this.config.brightness);
                            // Multi-segment support is provided via the incoming payload. If the
                            // seg object is specified in the payload then it's what gets used
                            // to set the entire segment object. Otherwise the individual
                            // properties are set manually.
                            if (payload === null || payload === void 0 ? void 0 : payload.seg) {
                                state.seg = payload.seg;
                            }
                            else {
                                state.seg = [{
                                        id: (_g = payload === null || payload === void 0 ? void 0 : payload.segmentId) !== null && _g !== void 0 ? _g : Number(this.config.segmentId),
                                        on: (_h = payload === null || payload === void 0 ? void 0 : payload.state) !== null && _h !== void 0 ? _h : true,
                                        col: [
                                            (_j = payload === null || payload === void 0 ? void 0 : payload.color1) !== null && _j !== void 0 ? _j : helpers.hexToRgb(this.config.color1),
                                            (_k = payload === null || payload === void 0 ? void 0 : payload.color2) !== null && _k !== void 0 ? _k : helpers.hexToRgb(this.config.color2),
                                            (_l = payload === null || payload === void 0 ? void 0 : payload.color3) !== null && _l !== void 0 ? _l : helpers.hexToRgb(this.config.color3),
                                        ],
                                        fx: (_m = payload === null || payload === void 0 ? void 0 : payload.effect) !== null && _m !== void 0 ? _m : Number(this.config.effect),
                                        ix: (_o = payload === null || payload === void 0 ? void 0 : payload.effectIntensity) !== null && _o !== void 0 ? _o : Number(this.config.effectIntensity),
                                        pal: (_p = payload === null || payload === void 0 ? void 0 : payload.palette) !== null && _p !== void 0 ? _p : Number(this.config.palette),
                                        sx: (_q = payload === null || payload === void 0 ? void 0 : payload.effectSpeed) !== null && _q !== void 0 ? _q : Number(this.config.effectSpeed),
                                    }];
                            }
                        }
                        // debug: todo set flag in object for this?
                        if (this.config.debug === "on") {
                            this.warn(state);
                        }
                        // On failures the node can just do nothing. Error state
                        // will get set automatically by an event fired from the WledDevice object.
                        return [4 /*yield*/, this.wled.setState(state).catch(function () {
                                return;
                            })];
                    case 7:
                        // On failures the node can just do nothing. Error state
                        // will get set automatically by an event fired from the WledDevice object.
                        _r.sent();
                        // If a delay was requested flip to solid state after the specified number of seconds.
                        if (delay) {
                            this.solidTimer = setTimeout(setSolidState.bind(this), delay * 1000, targetState);
                        }
                        // Pass the message on
                        this.send(msg);
                        return [2 /*return*/];
                }
            });
        });
    }
    function setSolidState(on) {
        this.wled
            .setState({
            on: on,
            seg: [
                {
                    id: Number(this.config.segmentId),
                    fx: 0,
                },
            ],
        })
            // On failures the node can just do nothing. Error state
            // will get set automatically by an event fired from the WledDevice object.
            .catch(function () {
            return;
        });
    }
    function onConnected() {
        this.status({ fill: "green", shape: "dot", text: "Connected to " + this.config.address });
    }
    function onConnecting() {
        this.status({ fill: "yellow", shape: "dot", text: "Connecting to " + this.config.address });
    }
    function onDisconnected() {
        this.status({ fill: "red", shape: "dot", text: "Disconnected" });
    }
    function onError() {
        this.status({ fill: "red", shape: "dot", text: "Error at " + getPrettyDate() });
    }
    function getPrettyDate() {
        return new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour12: false,
            hour: "numeric",
            minute: "numeric",
        });
    }
};
//# sourceMappingURL=wled2.js.map