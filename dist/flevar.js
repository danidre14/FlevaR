const FlevaR = (function FlevaR() {
    "use strict";
    return function (_div = document.body, _options = {}, _inits) {
        if (_options.constructor !== Object) {
            _inits = _options;
            _options = {};
        }
        const inits = [];
        const finis = [];
        const _defaults = (function () {
            const size = 100;
            const useFlevaScript = _options.useFlevaScript || false;
            const minStageWidth = 400, minStageHeight = 400;
            const maxStageWidth = 2880, maxStageHeight = 2880;
            const editMode = _options.useEditor || false;
            const devMode = _options.dev || false;
            const autosave = _options.autosave || false;
            const fps = _options.fps ? _options.fps : 30;
            const applicationName = _options.name ? _options.name : "flevar_application";
            const loadAssets = _options.useLoader ? _options.useLoader : false;
            const Canvas = function (width = size, height = size) {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                return canvas;
            }
            const extendCanvasRenderingContext2DPrototype = () => {
                CanvasRenderingContext2D.prototype.fillEllipse = function (x, y, width, height) {
                    this.beginPath();
                    this.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
                    this.fill();
                }
                CanvasRenderingContext2D.prototype.strokeEllipse = function (x, y, width, height) {
                    this.beginPath();
                    this.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
                    this.stroke();
                }
            }
            extendCanvasRenderingContext2DPrototype();
            return {
                useFlevaScript,
                loadAssets,
                size,
                sprite: (() => {
                    const canvas = Canvas(size, size);
                    const ctx = canvas.getContext("2d");

                    ctx.fillStyle = "#D3D3D3";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "#A9A9A9";
                    ctx.fillRect(canvas.width * 0.4, 0, canvas.width * 0.2, canvas.height);
                    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);

                    return canvas;
                })(),
                unknowngraphic: (() => {
                    const canvas = Canvas(size, size);
                    const ctx = canvas.getContext("2d");

                    ctx.fillStyle = "#D3D3D3";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.lineWidth = canvas.width * 0.2;
                    ctx.strokeStyle = "#A9A9A9";
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);

                    return canvas;
                })(),
                engine: {
                    version: "FlevaR Version 2.1.1"
                },
                stage: {
                    _width: _options._width !== undefined ? Math.max(Math.min(_options._width, maxStageWidth), minStageWidth) : 600,
                    _height: _options._height !== undefined ? Math.max(Math.min(_options._height, maxStageHeight), minStageHeight) : 500,
                    _color: "#fff0"
                },
                minStageWidth, minStageHeight,
                maxStageWidth, maxStageHeight,
                flevar_env: editMode ? "development" : "production",
                editor: editMode,
                devMode,

                fps, applicationName,

                inits: _inits,

                emptyFunc() { },


                graphicPath: "assets",
                graphicType: "png",

                soundPath: "assets",
                soundType: "mp3",

                autosave,

                Image,
                Audio,
                Canvas
            }
        })();

        const __config = {
            DEBUG: _options.debug,
            EDITOR: FlevaR_Editor ? FlevaR_Editor(_defaults.editor, _div) : {}
        }
        const initConstructor = function (_con, ..._args) {
            for (const args of _args)
                for (const arg of Object.keys(args))
                    defineConstructor(_con, arg, args[arg]);

            Object.defineProperty(_con, "type", {
                get: () => helperUtils.typeOf(_con),
                enumerable: true,
                configurable: false
            });
        }
        const defineConstructor = function (_obj, _key, _value) {
            Object.defineProperty(_obj, _key, {
                get: () => _value,
                enumerable: true,
                configurable: false
            });
        }
        const _constructors = {
            Engine: function Engine() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            SharedObject: function SharedObject() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            Mouse: function Mouse() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            Key: function Key() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            Floxy: function Floxy() {
                this[Symbol.toPrimitive] = () => "undefined";
            },
            Prefab: function Prefab() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            Textfield: function Textfield() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            Scene: function Scene() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            Script: function Script() {  },
            Sprite: function Sprite() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            Graphic: function Graphic() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            Sound: function Sound() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            SpriteSheet: function SpriteSheet() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            Painting: function Painting() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
            VCam: function VCam() {
                const args = Array.prototype.slice.call(arguments);
                initConstructor(this, ...args);
            },
        }

        let _symbolAutoAdder = 0;
        const _generateSymbolName = function (_symbol = "symbol") {
            const serializedID = String(Math.random()).substr(2);
            return `$${_symbol}_${_symbolAutoAdder++}_${serializedID}`;
        }

        const numberUtils = {
            DEG2RAD: Math.PI / 180,
            RAD2DEG: 180 / Math.PI,

            lerp: function (_value1, _value2, _amount, _lock = 0, _ceil) {
                _amount = _amount < 0 ? 0 : _amount;
                _amount = _amount > 1 ? 1 : _amount;

                const value = (1 - _amount) * _value1 + _amount * _value2;
                if (!_lock) return _ceil ? Math.ceil(value) : value;

                const val = (_value2 - value > -_lock && _value2 - value < _lock) ? _value2 : value;

                return _ceil ? Math.ceil(val) : val;
            },
            wheelClamp(_num, _a = 0, _b = 0) {
                if (!helperUtils.isNumber(_num)) return 0;
                if (!helperUtils.isNumber(_a)) return _num;
                if (!helperUtils.isNumber(_b)) _b = 0;


                const _min = Math.min(_a, _b);
                const _max = Math.max(_a, _b);
                if (_min === _max) return _min;

                const flattener = _min;
                const flatMin = _min - flattener;
                const flatmax = _max - flattener;
                const flatNum = _num - flattener;

                const modNum = flatNum % flatmax;

                if (modNum > 0) return modNum + _min;
                else return modNum + _max;
            },
            lock(_num, _a, _b) {
                if (!helperUtils.isNumber(_num)) return 0;
                if (!helperUtils.isNumber(_a)) return _num;
                if (!helperUtils.isNumber(_b)) _b = _a;
                if (_num < _a) _num = _a;
                else if (_num > _b) _num = _b;
                return _num;
            },
            inRange(_num, _a = 0, _b = 0) {
                if (!helperUtils.isNumber(_num)) return false;
                if (!helperUtils.isNumber(_a)) return false;
                if (!helperUtils.isNumber(_b)) return _num === _a;


                const _min = Math.min(_a, _b);
                const _max = Math.max(_a, _b);

                return _num >= _min && _num <= _max;
            },
            eitherOr(_num, _either, _or) {
                if (!helperUtils.isNumber(_num)) return 0;
                if (!helperUtils.isNumber(_either) || !helperUtils.isNumber(_or)) return _num;
                if (_num !== _either && _num !== _or) _num = _either;
                else if (_num === _either) _num = _or;
                else if (_num === _or) _num = _either;
                return _num;
            },
            cycle(_num, _max, _min = 0, _inc = 1) {
                if (!helperUtils.isNumber(_num) || !helperUtils.isNumber(_max)) return 0;
                if (!helperUtils.isNumber(_min)) _min = 0;
                if (!helperUtils.isNumber(_inc)) _inc = 1;
                _num = this.lock(_num, _min, _max);
                if (_num < _max) _num += _inc || 1;
                else _num = _min;
                return _num;
            },
            perXSeconds(_num) {
                return _num * 1000;
            },
            xPerSecond(_num) {
                return 1000 / _num;
            },
            rotatePoint(_x, _y, _angle = 0, _cx = 0, _cy = 0) {
                if (_angle === 0) return this.newPoint(_x, _y);
                const angle = this.degreesToRadians(_angle);
                const [pX, pY] = [_x, _y];

                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                const rX = ((pX - _cx) * cos) - ((pY - _cy) * sin) + _cx;
                const rY = ((pX - _cx) * sin) + ((pY - _cy) * cos) + _cy;

                return this.newPoint(rX, rY);
            },
            newPoint(_objOrX = 0, _y = 0) {
                if (typeof _objOrX === "object")
                    return { _x: _objOrX._x, _y: _objOrX._y };
                else
                    return { _x: _objOrX, _y };
            },
            minMax(_cord, _criteria, ...points) {
                const pointArray = points.map(point => point[_cord]);
                return Math[_criteria](...pointArray);
            },
            degreesToRadians(_degrees) {
                return _degrees * this.DEG2RAD;
            },
            radiansToDegrees(_radians) {
                return _radians * this.RAD2DEG;
            }
        }
        const objectUtils = {
            deepCloneObject: (function () {
                const getOwnedKeys = () => {
                    try {
                        return Reflect.ownKeys;
                    } catch {
                        const gOPNs = Object.getOwnPropertyNames;
                        const gOPSs = Object.getOwnPropertySymbols;
                        return (_obj) => {

                            return gOPNs(_obj).concat(gOPSs ? gOPSs(_obj) : []);
                        };
                    }
                }, __ownedKeys = getOwnedKeys(), {
                    create, defineProperty,
                    getPrototypeOf, getOwnPropertyDescriptor
                } = Object;

                return function __deepClone(_obj) {
                    if (_obj instanceof Element || _obj instanceof HTMLElement || _obj instanceof Node) return _obj.cloneNode(true);
                    const _temp = create(getPrototypeOf(_obj));
                    __ownedKeys(_obj).forEach(function (_key) {
                        const _descriptor = getOwnPropertyDescriptor(_obj, _key);
                        const _value = _descriptor.value;

                        if (_value) switch (true) {
                            case _value instanceof Date:
                                _descriptor.value = new Date(+_value);
                                break;

                            case _value instanceof RegExp:
                                _descriptor.value = new RegExp(_value.source, _value.flags);
                                break;

                            case _value instanceof Object:
                                if (typeof _value !== 'function') _descriptor.value = __deepClone(_value);
                                break;
                        }

                        defineProperty(_temp, _key, _descriptor);
                    });
                    return _temp;
                };
            }()),
            filterObject(_obj = {}, _string = "", _find = true) {
                if (!this.isObject(_obj)) return;
                const keys = _string.split(" ");
                const temp = {};
                for (const key of Object.keys(_obj)) {
                    if (_find === false) {
                        if (!keys.includes(key)) temp[key] = _obj[key];
                    } else {
                        if (keys.includes(key)) temp[key] = _obj[key];
                    }
                }
                return temp;
            },
            multiplyObject(_obj = {}, _multiplier) {
                const temp = [];
                for (let i = 0; i < _multiplier; i++)
                    temp.push(_obj);
                return temp;
            },
            lockObject(_obj = {}) {
                if (!_obj instanceof Object) return {};
                const obj = { ..._obj };
                for (const i of Object.keys(_obj)) {
                    if (Object.getOwnPropertyDescriptor(_obj, i).value) {
                        delete _obj[i];
                        Object.defineProperty(_obj, i, {
                            get: () => obj[i],
                            enumerable: true,
                            configurable: false
                        });
                    }
                }
                return _obj;
            },
            emptyObject(_obj = {}) {
                for (const key of Object.keys(_obj))
                    delete _obj[key];
            },
            objectLength(_obj = {}) {
                return Object.keys(_obj).length;
            },
            cloneObject(_obj) {
                if (_obj === null || typeof (_obj) !== 'object')
                    return _obj;

                let _temp;
                _temp = new _obj.constructor();
                for (let _key of Object.keys(_obj)) {
                    if (_obj.hasOwnProperty(_key)) {
                        if (Object.getOwnPropertyDescriptor(_obj, _key).value instanceof Object) {
                            _temp[_key] = this.cloneObject(_obj[_key]);
                        }
                        else {
                            Object.defineProperty(_temp, _key, Object.getOwnPropertyDescriptor(_obj, _key));
                        }
                    }

                }

                return _temp;
            }
        }
        const helperUtils = {
            random(_a, _b) {
                let result;
                let random = Math.random();
                if (_a !== null && typeof _a === "object") {
                    if (helperUtils.isArray(_a)) {
                        if (_b === 1)
                            result = _a[this.random(_a.length - 1)];
                        else
                            result = objectUtils.cloneObject(_a).sort(function () {
                                return random > .5 ? -1 : 1;
                            });
                    } else if (helperUtils.isObject(_a)) { 
                        const keys = Object.keys(_a);
                        const key = keys[keys.length * Math.random() << 0];
                        if (_b === 1)
                            return key;
                        else
                            return _a[key];
                    }
                } else if (typeof _a === "string") {
                    if (_b === 1)
                        result = _a.split("")[this.random(_a.length - 1)];
                    else
                        result = _a.split("").sort(function () {
                            return random > .5 ? -1 : 1;
                        }).join("");
                } else if (typeof _a === "number") {
                    if (typeof _b === "number") {
                        result = Math.round(random * (_b - _a)) + _a;
                    } else {
                        result = Math.round(random * _a);
                    }
                } else {
                    result = random;
                }
                return result;
            },
            isString(_val) {
                return typeof _val === "string" || _val === String;
            },
            isNumber(_val) {
                return typeof _val === "number" || _val === Number;
            },
            isBigInt(_val) {
                return typeof _val === "bigint" || _val === BigInt;
            },
            isBoolean(_val) {
                return typeof _val === "boolean" || _val === Boolean;
            },
            isObject(_val) {
                try {
                    return _val.constructor === Object || _val === Object;
                } catch {
                    return false;
                }
            },
            isError(_val) {
                try {
                    return _val.constructor === Error || _val === Error;
                } catch {
                    return false;
                }
            },
            isArray(_val) {
                try {
                    return _val.constructor === Array || _val === Array;
                } catch {
                    return false;
                }
            },
            isSharedObject(_val) {
                try {
                    return _val.constructor === _constructors.SharedObject || _val === _constructors.SharedObject;
                } catch {
                    return false;
                }
            },
            isMouse(_val) {
                try {
                    return _val.constructor === _constructors.Mouse || _val === _constructors.Mouse;
                } catch {
                    return false;
                }
            },
            isKey(_val) {
                try {
                    return _val.constructor === _constructors.Key || _val === _constructors.Key;
                } catch {
                    return false;
                }
            },
            isFloxy(_val) {
                try {
                    return _val.constructor === _constructors.Floxy || _val === _constructors.Floxy;
                } catch {
                    return false;
                }
            },
            isPrefab(_val) {
                try {
                    return _val.constructor === _constructors.Prefab || _val === _constructors.Prefab;
                } catch {
                    return false;
                }
            },
            isTextfield(_val) {
                try {
                    return _val.constructor === _constructors.Textfield || _val === _constructors.Textfield;
                } catch {
                    return false;
                }
            },
            isFlevaClip(_val) {
                return this.isPrefab(_val) || this.isTextfield(_val);
            },
            isScene(_val) {
                try {
                    return _val.constructor === _constructors.Scene || _val === _constructors.Scene;
                } catch {
                    return false;
                }
            },
            isScript(_val) {
                try {
                    return _val.constructor === _constructors.Script || _val === _constructors.Script;
                } catch {
                    return false;
                }
            },
            isSprite(_val) {
                try {
                    return _val.constructor === _constructors.Sprite || _val === _constructors.Sprite;
                } catch {
                    return false;
                }
            },
            isGraphic(_val) {
                try {
                    return _val.constructor === _constructors.Graphic || _val === _constructors.Graphic;
                } catch {
                    return false;
                }
            },
            isSound(_val) {
                try {
                    return _val.constructor === _constructors.Sound || _val === _constructors.Sound;
                } catch {
                    return false;
                }
            },
            isPainting(_val) {
                try {
                    return _val.constructor === _constructors.Painting || _val === _constructors.Painting;
                } catch {
                    return false;
                }
            },
            isSpriteSheet(_val) {
                try {
                    return _val.constructor === _constructors.SpriteSheet || _val === _constructors.SpriteSheet;
                } catch {
                    return false;
                }
            },
            isVCam(_val) {
                try {
                    return _val.constructor === _constructors.VCam || _val === _constructors.VCam;
                } catch {
                    return false;
                }
            },
            isEngine(_val) {
                try {
                    return _val.constructor === _constructors.Engine || _val === _constructors.Engine;
                } catch {
                    return false;
                }
            },
            isEngineNative(_val) {
                const notNatives = ["string", "number", "bigint", "boolean", "object", "array", "function", "undefined", "null", "unknown", "error"];
                return !notNatives.includes(this.typeOf(_val));
            },
            isFunction(_val) {
                return typeof _val === "function" || _val === Function;
            },
            isUndefined(_val) {
                return _val === undefined;
            },
            isNull(_val) {
                return _val === null;
            },
            isDefined(_val) {
                return !this.isUndefined(_val);
            },
            typeOf(_val) {
                const types = [
                    { func: this.isString, type: "string" },
                    { func: this.isNumber, type: "number" },
                    { func: this.isBigInt, type: "bigint" },
                    { func: this.isBoolean, type: "boolean" },
                    { func: this.isObject, type: "object" },
                    { func: this.isError, type: "error" },
                    { func: this.isSharedObject, type: "sharedobject" },
                    { func: this.isPrefab, type: "prefab" },
                    { func: this.isTextfield, type: "textfield" },
                    { func: this.isScene, type: "scene" },
                    { func: this.isScript, type: "script" },
                    { func: this.isSprite, type: "sprite" },
                    { func: this.isGraphic, type: "graphic" },
                    { func: this.isSound, type: "sound" },
                    { func: this.isPainting, type: "painting" },
                    { func: this.isSpriteSheet, type: "spritesheet" },
                    { func: this.isVCam, type: "vcam" },
                    { func: this.isMouse, type: "mouse" },
                    { func: this.isKey, type: "key" },
                    { func: this.isFloxy, type: "floxy" },
                    { func: this.isEngine, type: "engine" },
                    { func: this.isArray, type: "array" },
                    { func: this.isFunction, type: "function" },
                    { func: this.isUndefined, type: "undefined" },
                    { func: this.isNull, type: "null" }
                ];
                for (const { func, type } of Object.values(types))
                    if (func.call(this, _val)) return type;

                return "unknown";
            }
        }

        const engineState = {};

        const _pixelResolution = 1;
        const mainStack = {
            list: [],
            swapDepths(_stackName, _depth) {
                const stackInstance = this.list.find(elem => elem.stackName === _stackName);
                stackInstance.depth = _depth;
                stackInstance.timeSwapped = performance.now();
                this.sortStack();
            },
            sortStack() {
                function sortC(a, b) {
                    if (a.depth > b.depth) return 1;
                    if (a.depth < b.depth) return -1;
                    if ((a.timeSwapped || 0) > (b.timeSwapped || 0)) return 1;
                    if ((a.timeSwapped || 0) < (b.timeSwapped || 0)) return -1;
                    if (parseInt(a.stackName.split("_")[1]) > parseInt(b.stackName.split("_")[1])) return 1;
                    if (parseInt(a.stackName.split("_")[1]) < parseInt(b.stackName.split("_")[1])) return -1;
                }
                this.list.sort(sortC);
            }
        }


        const _screen = (function () {
            if (_div == null) _div = document.body;
            const [__width, __height] = [_defaults.stage._width, _defaults.stage._height];


            const svgToImage = function (_src) {
                const image = new _defaults.Image();
                image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(_src)}`;
                return image;
            }
            const pngToImage = function (_src) {
                const image = new _defaults.Image();
                image.src = `data:image/png;base64,${_src}`;
                return image;
            }
            const _stringToImage = function (_str) {
                const image = new _defaults.Image();
                image.src = _str;
                return image;
            }

            const cursorTypes = {
                default: pngToImage(`iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABSklEQVR4Xu2XwRLCIAxEF6+2fID//4XFXsUJ0zrasbd2iWY59WTC4y3BhOArBd8/BEAGBCegCAQXQJegIqAIBCegCAQXQFNAEVAEghNQBIILoCmgCCgCwQkoAsEF0BRQBBSB4AQUgeAC9J0C4xW1zH176BoBA2AG9oTQFQCAWmtFHlI3CC4AmAU5Z5RS6P3QC24u3WbAulJq7VB7ohb7MnE+ALTdkyG4A9DiQLwTXAJgmuAWAAuCawAMCO4BnA3hJwAsEGxeXo7+7+IWwDIOy2bD+a8B2Gtwmqa2R9Z7wI0BKaU7gBuAaX0dMiC4ALBsflz0fr0OIwB4AJgBrJs3BvZNs6C3AQMAU3+7aBb0BrB3qRsYmwCnjL73ol4BHD3tdn9PAGionRaSAU4PhtaWDKChdlpIBjg9GFpbMoCG2mkhGeD0YGhthTfgCSV1YUGzOXtqAAAAAElFTkSuQmCC`),
                text: pngToImage(`iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA/ElEQVR4Xu2YMQrDMBAET7VR3pH//yN93hHhWuGIHUwgraa4SWcIrLU7eyfcovivFT9/aIAEFHfAChQHwCFoBaxAcQesQHEA3AJWwAoUd8AKFAfALWAFrEBxB5AK9C3m2L/O5zvMfOpbxNjXziXEgB/o8vDYe2DCFxM0oDQBxzzASMSEzwpowGcjYEFgwhJwOGAFrIAzwCHoFnANeg/A7iOYcMmL0HxGb/cYefk5DcgBeH1+PeKW/1n1oQonYNVB/+loAJ0ArS8BdAK0vgTQCdD6EkAnQOtLAJ0ArS8BdAK0vgTQCdD6EkAnQOtLAJ0ArS8BdAK0vgTQCdD6b/o7OkGgJX3UAAAAAElFTkSuQmCC`),
                pointer: pngToImage(`iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABL0lEQVR4Xu2YyQrDMAwFnXOX///OLucWFwRuICRN0ZOIpqcWAo7GbyTXUyv+mYrX3wBAAooTQIHiAaAJogAKFCeAAsUDwBRAARQoTgAFigeAKYACKFCcAAoUDwBTAAVQoDgBFCgegLgpcDm1V4d/f8a9Q18/RIFe/O3xqb9dz1MoBABE9AASgALfPcBSGNEQU/SAsSGqYaQDMIfhnYrUADoM7zEpAWCHHjv4zKfAuOtL372SIAMwj7b9XhrDfecVhyU5ADv9rQEYwXhqIAHQixlj/+vh6xAA/oEAAMc/TDIFLPZ7VDhMAvZo4Fl8ivuAtYYIAEf/wxKwVQXv3QdA1J2gJWDNf8WlqXwMbila+QwAlLQzrkUCMu6K8p1IgJJ2xrVIQMZdUb4TCVDSzrjWGwb9pUFFZ0zTAAAAAElFTkSuQmCC`)
            }

            const canvasdiv = document.createElement('div');
            canvasdiv.setAttribute("style", `border-style: solid; border-width: 2px; width: ${__width}px; height: ${__height}px; position: relative;`);
            canvasdiv.style.overflow = "hidden";
            canvasdiv.style.outline = "none";
            canvasdiv.style.border = 'none';
            canvasdiv.tabIndex = "0";

            const canvas = _defaults.Canvas(__width, __height);
            canvas.setAttribute("style", "position: absolute;");
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;

            Object.defineProperties(ctx, {
                width: {
                    get() { return __width },
                    enumerable: true,
                    configurable: false
                },
                height: {
                    get() { return __height },
                    enumerable: true,
                    configurable: false
                }
            });

            canvasdiv.appendChild(canvas);
            _div.appendChild(canvasdiv);


            const drawSprite = function ({ _x = 0, _y = 0, _width = _defaults.size, _height = _defaults.size } = {}, _name) {
                if (!_name)
                    return ctx.drawImage(_defaults.unknowngraphic, _x, _y, _width, _height);

                const sprite = _library.sprites[_name];
                switch (sprite.assetSource.hasLoaded) {
                    case true:
                        ctx.drawImage(sprite.assetSource, _x, _y, _width, _height);
                        break;
                    case false:
                        ctx.drawImage(_defaults.sprite, _x, _y, _width, _height);
                        break;
                    default:
                        ctx.drawImage(_defaults.unknowngraphic, _x, _y, _width, _height);
                }
            }

            const drawGraphic = function ({ _x = 0, _y = 0, _width = _defaults.size, _height = _defaults.size } = {}, _name) {
                if (!_name)
                    return ctx.drawImage(_defaults.unknowngraphic, _x, _y, _width, _height);

                const graphic = _library.graphics[_name];
                switch (graphic.assetSource.hasLoaded) {
                    case true:
                        ctx.drawImage(graphic.assetSource, _x, _y, _width, _height);
                        break;
                    case false:
                        ctx.drawImage(_defaults.sprite, _x, _y, _width, _height);
                        break;
                    default:
                        ctx.drawImage(_defaults.unknowngraphic, _x, _y, _width, _height);
                }
            }

            const drawPainting = function ({ _x = 0, _y = 0, _width = _defaults.size, _height = _defaults.size } = {}, _painting, _state = {}) {
                const tempCanv = _defaults.Canvas(_width, _height);
                const tempCtx = tempCanv.getContext("2d");

                tempCtx.imageSmoothingEnabled = false;
                if (helperUtils.isString(_painting)) {
                    _errorsM.checkPaintingNotExist(_painting);
                    let { assetSource: src } = getPaintingFromLibrary(_painting);
                    const paintFunc = _commandUtils.getScription(src);
                    try {
                        paintFunc.bind(tempCtx)(tempCtx, { _x: 0, _y: 0, _width, _height, state: objectUtils.deepCloneObject(_state) });
                    } catch {
                        tempCtx.drawImage(_defaults.unknowngraphic, 0, 0, _width, _height);
                        console.warn("Drawing painting failed. Using default.");
                    }
                } else if (_commandUtils.isScription(_painting)) {
                    const paintFunc = _commandUtils.getScription(_painting);
                    try {
                        paintFunc.bind(tempCtx)(tempCtx, { _x: 0, _y: 0, _width, _height, state: objectUtils.deepCloneObject(_state) });
                    } catch {
                        tempCtx.drawImage(_defaults.unknowngraphic, 0, 0, _width, _height);
                        console.warn("Drawing painting failed. Using default.");
                    }
                }

                ctx.drawImage(tempCanv, _x, _y, _width, _height);
            }

            const _getDrawMethod = function (_type) {
                return _renderMethods[helperUtils.typeOf(_type)] || _type;
            }

            const _renderMethods = {
                [helperUtils.typeOf(_constructors.Sprite)]: drawSprite,
                [helperUtils.typeOf(_constructors.SpriteSheet)]: drawSprite,
                [helperUtils.typeOf(_constructors.Graphic)]: drawGraphic,
                [helperUtils.typeOf(_constructors.Painting)]: drawPainting,
            }

            return {
                ctx,
                canvas,
                div: canvasdiv,

                xScale: 1,
                yScale: 1,

                lockPointer: true,
                svgToImage,

                clearScreen(_absolute) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    if (_absolute) return;
                    this.ctx.fillStyle = _defaults.stage._color;
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                },


                takeScreenshot(_name) {
                    const name = _name ? _name : `${_defaults.applicationName}_${String(Date.now())}`;
                    const anchor = document.createElement("a");

                    anchor.download = name;
                    anchor.href = this.canvas.toDataURL();
                    anchor.click();
                },

                _isFullscreen() {
                    const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
                    return fullscreenElement === this.div;
                },
                async _openFullscreen() {
                    try {
                        if (!this._isFullscreen()) {
                            this.div.requestFullscreen = this.div.requestFullscreen || this.div.mozRequestFullScreen || this.div.webkitRequestFullscreen || this.div.msRequestFullscreen;
                            await this.div.requestFullscreen();
                        }
                    } catch { }
                },
                async _closeFullscreen() {
                    try {
                        const pointerWasLocked = this._isPointerlock();
                        document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
                        await document.exitFullscreen();
                        if (pointerWasLocked) this.openPointerlock();
                    } catch { }
                },
                setFullscreen(_value) {
                    if (_value === true) this._openFullscreen();
                    else if (_value === false) this._closeFullscreen();
                    else (this._isFullscreen() && this._closeFullscreen()) || this._openFullscreen();
                },

                _isPointerlock() {
                    const pointerLockElement = document.pointerLockElement || document.mozPointerLockElement;
                    return pointerLockElement === _screen.div;
                },
                openPointerlock(type = true) {
                    this.lockPointer = type;
                    try {
                        if (!this._isPointerlock()) {
                            _screen.div.requestPointerLock = _screen.div.requestPointerLock ||
                                _screen.div.mozRequestPointerLock;

                            _screen.div.requestPointerLock();
                        }

                        MouseModule._private_._x = _defaults.stage._width / 2;
                        MouseModule._private_._y = _defaults.stage._height / 2;
                        vcam._private_._setMouseStagePositions();
                    } catch { }
                },
                closePointerlock() {
                    try {
                        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
                        document.exitPointerLock();
                    } catch { }
                },

                _drawCursor() {
                    if (!(this._isPointerlock() && MouseModule._visible)) return;
                    const cursor = cursorTypes[MouseModule._private_._getCursorType()] || cursorTypes.default;
                    this.ctx.save();
                    this.ctx.drawImage(cursor, (vcam._xmouse * this.xScale) - 32, (vcam._ymouse * this.yScale) - 32, 64, 64);
                    this.ctx.restore();
                },

                _setPosition(_props) {
                    const ctx = this.ctx;
                    const { _x = 0, _y = 0, _width = _defaults.size, _height = _defaults.size, _rotation, _anchorX, _anchorY } = _props;
                    const offsetX = (_anchorX / 100 * _width);
                    const offsetY = (_anchorY / 100 * _height);


                    ctx.translate((_x), (_y));
                    if (_rotation) ctx.rotate(numberUtils.degreesToRadians(_rotation));
                    ctx.translate(-(_x + offsetX), -(_y + offsetY));
                },
                _isInScreen(_bounds) {
                    return _commandUtils.boxHitTest({ _x: 0, _y: 0, _width: this.ctx.width, _height: this.ctx.height }, _bounds);
                },
                _copyCanvas(_canvas, _source) {
                    const canvas = _source ? _source : _defaults.Canvas();
                    const ctx = canvas.getContext("2d");
                    canvas.width = _canvas.width;
                    canvas.height = _canvas.height;

                    ctx.imageSmoothingEnabled = false;
                    try {
                        ctx.drawImage(_canvas, 0, 0, canvas.width, canvas.height);
                    } catch {
                        ctx.drawImage(_defaults.unknowngraphic, 0, 0, canvas.width, canvas.height);
                    }
                    if (!_source) return canvas;
                },
                _getPixelMap(_canvas, _ctx = _canvas.getContext("2d")) {
                    const pixelMapData = [];

                    const _width = _canvas.width;
                    const _height = _canvas.height;
                    const canvasData = _ctx.getImageData(0, 0, _width, _height).data;
                    for (let y = 0; y < _height; y += _pixelResolution) {
                        for (let x = 0; x < _width; x += _pixelResolution) {
                            const pixelID = x + (y * _width);
                            pixelMapData[pixelID] = canvasData[pixelID * 4 + 3] >= 55;
                        }
                    }

                    return {
                        data: pixelMapData,
                        _width,
                        _height
                    };
                },
                renderFlevaClipBounds({ _bounds, ..._props }) {
                    if (!__config.EDITOR.canRenderBounds) return;
                    if (!vcam._private_._isInScreen(_bounds)) return;

                    __config.EDITOR.renderBoundedBox(this.ctx, _props, _bounds);
                    __config.EDITOR.renderRotatedBox(this.ctx, _props, this._setPosition.bind(this));
                },
                renderFlevaClip({ _bounds, _clip, ..._props }, _type, _parameters = []) {
                    if (!vcam._private_._isInScreen(_bounds)) return;
                    if (!_props._visible) return;
                    const ctx = this.ctx;
                    const { _x = 0, _y = 0, _width = _defaults.size, _height = _defaults.size, _alpha } = _props;

                    ctx.save();
                    this._setPosition(_props);

                    let x = _x;
                    let y = _y;
                    if (_width < 0) {
                        ctx.scale(-1, 1);
                        x *= -1;
                        _props._x = x;
                        _props._width *= -1;
                    }
                    if (_height < 0) {
                        ctx.scale(1, -1);
                        y *= -1;
                        _props._y = y;
                        _props._height *= -1;
                    }

                    if (_clip) {
                        ctx.beginPath();
                        ctx.rect(_props._x, _props._y, _props._width, _props._height);
                        ctx.closePath();
                        ctx.clip();
                    }
                    if (helperUtils.isDefined(_alpha) && _alpha !== 1) ctx.globalAlpha = _alpha;

                    _getDrawMethod(_type)(_props, ..._parameters);

                    ctx.restore();
                },
                renderScene(_type, _parameters = []) {
                    const ctx = this.ctx;
                    const _props = { _x: 0, _y: 0, _width: ctx.width, _height: ctx.height };

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(_props._x, _props._y, _props._width, _props._height);
                    ctx.closePath();
                    ctx.clip();
                    _getDrawMethod(_type)(_props, ..._parameters);
                    ctx.restore();
                }
            }
        })();
        const _library = {
            flevaclips: {}, scripts: {}, scenes: {}, sprites: {}, graphics: {}, spritesheets: {}, paintings: {}, sounds: {},

            hasFlevaClip(_name) {
                return !!this.flevaclips[_name];
            },
            hasScript(_name) {
                return !!this.scripts[_name];
            },
            hasScene(_name) {
                return !!this.scenes[_name];
            },
            hasSprite(_name) {
                return !!this.sprites[_name];
            },
            hasGraphic(_name) {
                return !!this.graphics[_name];
            },
            hasSound(_name) {
                return !!this.sounds[_name];
            },
            hasSpriteSheet(_name) {
                return !!this.spritesheets[_name];
            },
            hasPainting(_name) {
                return !!this.paintings[_name];
            }
        }
        const heirarchy = {
            scripts: [],
            scene: { name: "" },
            batch: []
        }

        const __privateProperties = {
            showingPage: false,
            pageFocused: false,
            currentLoopCycle: 0,
            isRunTimeStarted: false,
            runIDs: [],
            fpsIDs: [],
            runitor: { 
                fps: 0,
                spf: 0
            }
        }

        const metaUtils = {
            listFlevaClips: () => {
                const temp = [];
                for (const i of Object.keys(_library.flevaclips))
                    temp.push(`${i}->${_library.flevaclips[i].type}`);
                return temp;
            },
            listScripts: () => {
                return Object.keys(_library.scripts);
            },
            listScenes: () => {
                return Object.keys(_library.scenes);
            },
            listSprites: () => {
                return Object.keys(_library.sprites).filter(_name => _name.substr(0, 1) !== "$");
            },
            listSpriteSheets: () => {
                return Object.keys(_library.spritesheets);
            }
        }

        const DebugModule = {
            makeStringFromArray(_list, _conj = "or") {
                if (_list.length === 0) return "";
                else if (_list.length === 1) return _list[0];
                const firsts = _list.slice(0, _list.length - 1);
                const last = _list[_list.length - 1];
                return `${firsts.join(", ")} ${_conj} ${last}`;
            },
            typeCheck(_func, _name, _value, ..._types) {
                const expectations = this.makeStringFromArray([..._types.map(e => helperUtils.typeOf(e))]);
                const valueType = helperUtils.typeOf(_value);
                let haveType = false;
                for (const type of _types)
                    if (valueType === helperUtils.typeOf(type)) {
                        haveType = true;
                        break;
                    }

                const params = helperUtils.isString(_func) ? `(${_func})` : this.getParams(_func);
                if (!haveType)
                    throw `TypeError: Expected ${expectations} for ${_name}, but received ${valueType} instead.\n> Parameters: ${params}`;
            },
            getParams(_func) {

                let str = _func.toString();

                str = str.replace(/\/\*[\s\S]*?\*\//g, '')
                    .replace(/\/\/(.)*/g, '')
                    .replace(/{[\s\S]*}/, '')
                    .replace(/=>/g, '')
                    .trim();

                const start = str.indexOf("(") + 1;

                const end = str.length - 1;

                const result = str.substring(start, end).split(", ");

                const params = [];

                result.forEach(element => {

                    element = element.replace(/=[\s\S]*/g, "").trim();

                    if (element.length > 1)
                        element = element.replace(/^_/, "").trim();

                    if (element.length > 0)
                        params.push(element);
                });

                return `(${params.join(", ")})`;
            },
            getLineNumber(stacksDeep = 0, _error = new Error()) {
                const e = _error;
                if (!e.stack)
                    try {
                        throw e;
                    } catch (e) { }
                let line;
                if (!e.stack)
                    line = "<anonymous>";
                else {
                    const erray = e.stack.split(/\r\n|\n/);
                    if (erray[0].includes("http")) erray.unshift("Error");
                    line = erray[1 + stacksDeep];
                    if (line === undefined)
                        line = "<anonymous>";

                    line = (line.indexOf("(") >= 0
                        ? line.split("(")[1].substring(0, line.length - 1)
                        : line.indexOf("at") >= 0
                            ? line.split('at')[1]
                            : line
                    );
                    if (line.indexOf("@http") >= 0)
                        line = "http" + line.split("@http")[1];
                    if (line[line.length - 1] === ")")
                        line = line.slice(0, line.length - 1);
                    line = line.trim();
                }
                if (line.includes("@debugger eval code"))
                    line = "<anonymous>";

                return line;
            },
            displayTracedValue(_value, { _level = 0 } = {}) {
                let result;
                if (_value === _root) {
                    result = "[root Stage]";
                } else if (_value === MetaModule) {
                    result = "[type Meta]";
                } else if (_value === SharedObjectModule) {
                    result = "[type SharedObject]";
                } else if (helperUtils.isString(_value))
                    result = `"${_value}"`;
                else if (helperUtils.isNumber(_value) || helperUtils.isBoolean(_value) || helperUtils.isUndefined(_value) || helperUtils.isNull(_value))
                    result = _value;
                else if (helperUtils.isBigInt(_value))
                    result = _value + "n";
                else if (helperUtils.isObject(_value) && !_level) {
                    if (_value.hasOwnProperty("toString")) {
                        if (_commandUtils.isScription(_value.toString))
                            result = _value.toString();
                        else
                            result = _value.toString;
                    } else {
                        const objLength = Object.keys(_value).length;
                        if (!objLength) result = "{}";
                        else {
                            const maxPropsShown = 4;
                            let i = 0;
                            result = "{ ";
                            for (const [key, value] of Object.entries(_value)) {
                                const _result = this.displayTracedValue(value, { _level: _level + 1 });
                                result += `${key}: ${_result}, `;
                                if (objLength !== maxPropsShown && ++i >= maxPropsShown) {
                                    result += `[${objLength - maxPropsShown}] left...  `;
                                    break;
                                }
                            }
                            result = result.slice(0, result.length - 2);
                            result += " }";
                        }
                    }
                } else if (helperUtils.isArray(_value) && !_level) {
                    const objLength = _value.length;
                    if (!objLength) result = "[]";
                    else {
                        const maxPropsShown = 4;
                        let i = 0;
                        result = "[ ";
                        for (const value of _value) {
                            const _result = this.displayTracedValue(value, { _level: _level + 1 });
                            result += `${_result}, `;
                            if (objLength !== maxPropsShown && ++i >= maxPropsShown) {
                                result += `[${objLength - maxPropsShown}] left...  `;
                                break;
                            }
                        }
                        result = result.slice(0, result.length - 2);
                        result += " ]";
                    }
                }
                else if (helperUtils.isFloxy(_value)) {
                    result = _value[Symbol.toPrimitive]();
                }
                else {
                    const string = helperUtils.typeOf(_value);
                    result = `[type ${string.replace(/^./, string[0].toUpperCase())}]`;
                }

                return result;
            },
            trace(value, stacksDeep = 0) {
                const lineNumber = this.getLineNumber(stacksDeep + 1, new Error());
                const result = this.displayTracedValue(value);
                console.log(`> ${result}\n@:[${lineNumber}]`);
            },
            resolveError(erroptions = {}) {
                if (!erroptions.bubble)
                    throw (erroptions);

                const { type, from, error, src } = erroptions;
                throw (`${type} Error!\n\n> ${error}\n\nIn ${from}\n@:[${src}]`);
            },
            bubbleError({ type = "Engine", from, error = "", src = "<anonymous>" } = {}, resolve = false, crash = true) {
                const args = Array.prototype.slice.call(arguments);
                if (_defaults.devMode || _defaults.useFlevaScript) throw error || args[0];
                let hasStringErr = false,
                    errMsg = "";
                if (helperUtils.isString(args[0])) {
                    hasStringErr = true;
                    errMsg = args[0];
                } else if (helperUtils.isString(error)) {
                    hasStringErr = true;
                    errMsg = error;
                }
                if (hasStringErr) {
                    if (DebugModule.hasResolved(errMsg)) {
                        if (crash)
                            DebugModule.addAsyncError(() =>
                                DebugModule.throwError(errMsg, crash));

                        DebugModule.throwError(errMsg, crash);
                    }
                }
                const options = error;

                let fromChain = [];
                if (options.bubble && options.from) fromChain.push(...options.from.split(";\nIn "));
                if (from && !fromChain.includes(from)) fromChain.push(from);
                fromChain = fromChain.join(";\nIn ");

                const erroptions = {
                    bubble: true,
                    type: options.bubble && options.type ? options.type : type,
                    from: fromChain,
                    error: options.bubble && options.error ? options.error : error
                }
                if (options.bubble && options.src && options.src !== "<anonymous>")
                    erroptions.src = options.src;
                else {
                    const lineNumber = this.getLineNumber(0, error);

                    erroptions.src = lineNumber === "<anonymous>" ? src : lineNumber;
                }

                erroptions.toString = () => {
                    try {
                        this.resolveError(erroptions);
                    } catch (bubbledError) {
                        return bubbledError;
                    }
                }

                if (resolve) {
                    if (crash)
                        DebugModule.addAsyncError(() =>
                            DebugModule.throwError(erroptions.toString(), crash, true));
                    DebugModule.throwError(erroptions.toString(), crash, true);
                }
                else DebugModule.throwError(erroptions, crash);
            },
            throwError(error, crash = true, brute) {
                if (_defaults.devMode) throw error;

                const hasResolved = DebugModule.hasResolved(error);
                let wasLM = false;
                if (hasResolved && brute) {
                    if (DebugModule.lastMessage === error)
                        wasLM = true;
                    DebugModule.lastMessage = error;
                }
                if (wasLM && crash)
                    throw ("> Error! Engine crashed <\n\n" + error);
                else
                    throw (error);
            },
            addAsyncError(_callback) {
                addToBatch(() => {
                    _screen.clearScreen(true);
                    _callback();
                });
            },
            hasResolved(error) {
                return helperUtils.isString(error) && error.includes("Error!") && error.includes("> ");
            }

        }

        const _commandUtils = {
            createFlevaScript(_scription, objScope = {}, objRef = {}, sourceURL = "anonymous", params = "(self)(self)") {
                if (!_defaults.useFlevaScript || !_commandUtils.isScription(_scription)) return _scription;
                const functionString = this.getScription(_scription).toString();

                let mask;
                const reservedWords = ["self", "state", "include", "require"]; 
                const reservedScope = { flevar: _engineObj, get scene() { return _stage._scene } };
                const handler = {
                    has() { return true; },
                    get(object, property) {
                        if (property === "self") return objRef;
                        const config = Object.getOwnPropertyDescriptor(object, property);
                        if (config && config.configurable === false && config.writable === false)
                            return object[property];

                        if (Reflect.has(objRef, property))
                            return Reflect.get(objRef, property);

                        try {
                            if (Reflect.has(reservedScope.scene))
                                return Reflect.get(reservedScope.scene, property);
                        } catch {
                        }

                        if (Reflect.has(reservedScope.flevar, property))
                            return Reflect.get(reservedScope.flevar, property);

                        if (Reflect.has(reservedScope, property))
                            return Reflect.get(reservedScope, property);

                        if (Reflect.has(object, property))
                            return Reflect.get(object, property);

                        if (Reflect.has(_engineScope, property))
                            return Reflect.get(_engineScope, property);

                        return Reflect.get(object, property);
                    },
                    set(object, property, value) {
                        if (reservedWords.includes(property)) return true;

                        const config = Object.getOwnPropertyDescriptor(object, property);
                        if (config && config.configurable === false && config.writable === false) return true;

                        if (Reflect.has(objRef, property)) {
                            Reflect.set(objRef, property, value);
                            return true;
                        }

                        try {
                            if (Reflect.has(reservedScope.scene, property)) {
                                Reflect.set(reservedScope.scene, property, value);
                                return true;
                            }
                        } catch {
                        }

                        if (Reflect.has(reservedScope.flevar, property)) {
                            Reflect.set(reservedScope.flevar, property, value);
                            return true;
                        }


                        Reflect.set(object, property, value);
                        return true;
                    }
                }
                if (helperUtils.isUndefined(objScope.self)) { 
                    const scope = {
                        console, Math, include(val) {
                            if (window[val]) _engineScope[val] = window[val];
                        }, require(val) {
                            if (window[val]) return window[val];
                        }
                    };
                    Object.assign(objScope, scope, { self: true });
                    mask = new Proxy(objScope, handler);
                } else { 
                    mask = new Proxy(objScope, handler);
                }
                const flevaScriptString = `
    with(this) {
        return (function(){
            "use strict";
            const scription = ${functionString};
            return scription.bind${params};
        })();
    }
    //# sourceURL=${sourceURL}.js
    `;
                const flevaScript = (new Function(flevaScriptString)).bind(mask);
                return flevaScript;
            },
            flatted: (() => {
                'use strict';

                const { parse: $parse, stringify: $stringify } = JSON;
                const { keys } = Object;

                const Primitive = String;   
                const primitive = 'string'; 

                const object = 'object';

                const noop = (_, value) => value;

                const primitives = value => (
                    value instanceof Primitive ? Primitive(value) : value
                );

                const Primitives = (_, value) => (
                    typeof value === primitive ? new Primitive(value) : value
                );

                const revive = (input, parsed, output, $) => keys(output).reduce(
                    (output, key) => {
                        const value = output[key];
                        if (value instanceof Primitive) {
                            const tmp = input[value];
                            if (typeof tmp === object && !parsed.has(tmp)) {
                                parsed.add(tmp);
                                output[key] = $.call(output, key, revive(input, parsed, tmp, $));
                            } else {
                                output[key] = $.call(output, key, tmp);
                            }
                        } else
                            output[key] = $.call(output, key, value);
                        return output;
                    },
                    output
                );

                const set = (known, input, value) => {
                    const index = Primitive(input.push(value) - 1);
                    known.set(value, index);
                    return index;
                };

                const parse = (text, reviver) => {
                    const input = $parse(text, Primitives).map(primitives);
                    const value = input[0];
                    const $ = reviver || noop;
                    const tmp = typeof value === object && value ?
                        revive(input, new Set, value, $) :
                        value;
                    return $.call({ '': tmp }, '', tmp);
                };

                const stringify = (value, replacer, space) => {
                    const $ = replacer && typeof replacer === object ?
                        (k, v) => (k === '' || -1 < replacer.indexOf(k) ? v : void 0) :
                        (replacer || noop);
                    const known = new Map;
                    const input = [];
                    const output = [];
                    let i = +set(known, input, $.call({ '': value }, '', value));
                    let firstRun = !i;
                    while (i < input.length) {
                        firstRun = true;
                        output[i] = $stringify(input[i++], replace, space);
                    }
                    return '[' + output.join(',') + ']';
                    function replace(key, value) {
                        if (firstRun) {
                            firstRun = !firstRun;
                            return value;
                        }
                        const after = $.call(this, key, value);
                        switch (typeof after) {
                            case object:
                                if (after === null) return after;
                            case primitive:
                                return known.get(after) || set(known, input, after);
                        }
                        return after;
                    }
                };
                return {
                    parse, stringify
                }
            })(),
            isRawGraphic(_definition) {
                return _definition instanceof HTMLImageElement || _definition instanceof HTMLCanvasElement;
            },
            getPixelMap(_type, _name) {
                let pixelMap;
                try {
                    pixelMap = _library[`${helperUtils.typeOf(_type)}s`][_name].pixelMap;
                } catch { }
                return pixelMap;
            },
            getRotatedMappedPoint(_point, props) {
                const _flattenedPoint = {
                    _x: _point._x - props._x,
                    _y: _point._y - props._y
                }
                const _unrotatedPoint = props._rotation === 0 ?
                    _flattenedPoint :
                    numberUtils.rotatePoint(_flattenedPoint._x, _flattenedPoint._y, -props._rotation);
                const _unflattenedPoint = {
                    _x: _unrotatedPoint._x + props._x,
                    _y: _unrotatedPoint._y + props._y
                }
                const _initialPoint = {
                    _x: _unflattenedPoint._x + (props._anchorX / 100 * props._width),
                    _y: _unflattenedPoint._y + (props._anchorY / 100 * props._height),
                }
                return _initialPoint;
            },
            boxHitTest(_source, _target) {
                const sX = _source._width >= 0 ? _source._x : _source._x + _source._width;
                const sY = _source._height >= 0 ? _source._y : _source._y + _source._height;
                const sW = Math.abs(_source._width);
                const sH = Math.abs(_source._height);

                const tX = _target._width >= 0 ? _target._x : _target._x + _target._width;
                const tY = _target._height >= 0 ? _target._y : _target._y + _target._height;
                const tW = Math.abs(_target._width);
                const tH = Math.abs(_target._height);
                return !(
                    ((sY + sH) < (tY)) ||
                    (sY > (tY + tH)) ||
                    ((sX + sW) < tX) ||
                    (sX > (tX + tW))
                );
            },
            boxHitTestPoint(_source, _point) {
                const sX = _source._width >= 0 ? _source._x : _source._x + _source._width;
                const sY = _source._height >= 0 ? _source._y : _source._y + _source._height;
                const sW = Math.abs(_source._width);
                const sH = Math.abs(_source._height);
                return !(
                    ((sY + sH) < (_point._y)) ||
                    (sY > _point._y) ||
                    ((sX + sW) < _point._x) ||
                    (sX > _point._x)
                );
            },
            pixelHitTestPoint(_source, _point) {
                if (!_source.pixelMap) return false;

                const flatX = (_point._x - _source._x);
                const flatY = (_point._y - _source._y);

                const spriteX = flatX * (_source.pixelMap._width / _source._width);
                const spriteY = flatY * (_source.pixelMap._height / _source._height);

                const fX = Math.floor(spriteX / _pixelResolution) * _pixelResolution;
                const fY = Math.floor(spriteY / _pixelResolution) * _pixelResolution;

                const pixel = _source.pixelMap.data[fX + (fY * _source.pixelMap._width)];

                return pixel || false;
            },
            getScription(_script) {
                let newScript;
                if (helperUtils.isScript(_script) && _script.idName) {
                    newScript = getScriptFromLibrary(_script.idName);
                } else if (_commandUtils.isScription(_script)) {
                    newScript = _script;
                }
                return newScript;
            },
            isScription(_val) {
                return helperUtils.isScript(_val) || helperUtils.isFunction(_val);
            },
        }
        const _errorsM = {
            checkCanUseName(_name, _symbol = "symbol") {
                let canUseName = typeof _name === "string" && _name.trim() !== "" && _name.match(/^[^a-zA-Z_]|[^\w]/g) === null;
                if (!canUseName) throw `Invalid ${_symbol} name declaration: "${_name}".`;
            },
            checkFlevaClipExist(_name, _obj) {
                this.checkCanUseName(_name, "flevaclip");
                if (_obj) {
                    if (_obj[_name]) throw `FlevaClip already exists: "${_name}".`;
                } else
                    if (_library.hasFlevaClip(_name)) throw `FlevaClip already exists: "${_name}".`;
            },
            checkFlevaClipNotExist(_name, _obj) {
                if (_obj) {
                    if (!_obj[_name]) throw `FlevaClip does not exist: "${_name}".`;
                } else
                    if (!_library.hasFlevaClip(_name)) throw `FlevaClip does not exist: "${_name}".`;
            },
            checkScriptExist(_name, _obj) {
                this.checkCanUseName(_name, "script");
                if (_obj) {
                    if (_obj[_name]) throw `Script already exists: "${_name}".`;
                } else
                    if (_library.hasScript(_name)) throw `Script already exists: "${_name}".`;
            },
            checkScriptNotExist(_name, _obj) {
                if (_obj) {
                    if (!_obj[_name]) throw `Script does not exist: "${_name}".`;
                } else
                    if (!_library.hasScript(_name)) throw `Script does not exist: "${_name}".`;
            },
            checkSceneExist(_name, _obj) {
                this.checkCanUseName(_name, "scene");
                if (_obj) {
                    if (_obj[_name]) throw `Scene already exists: "${_name}".`;
                } else
                    if (_library.hasScene(_name)) throw `Scene already exists: "${_name}".`;
            },
            checkSceneNotExist(_name, _obj) {
                if (_obj) {
                    if (!_obj[_name]) throw `Scene does not exist: "${_name}".`;
                } else
                    if (!_library.hasScene(_name)) throw `Scene does not exist: "${_name}".`;
            },
            checkSpriteExist(_name, _obj) {
                this.checkCanUseName(_name, "sprite");
                if (_obj) {
                    if (_obj[_name]) throw `Sprite already exists: "${_name}".`;
                } else
                    if (_library.hasSprite(_name)) throw `Sprite already exists: "${_name}".`;
            },
            checkSpriteNotExist(_name, _obj) {
                if (_obj) {
                    if (!_obj[_name]) throw `Sprite does not exist: "${_name}".`;
                } else
                    if (!_library.hasSprite(_name)) throw `Sprite does not exist: "${_name}".`;
            },
            checkGraphicExist(_name, _obj) {
                this.checkCanUseName(_name, "graphic");
                if (_obj) {
                    if (_obj[_name]) throw `Graphic already exists: "${_name}".`;
                } else
                    if (_library.hasGraphic(_name)) throw `Graphic already exists: "${_name}".`;
            },
            checkGraphicNotExist(_name, _obj) {
                if (_obj) {
                    if (!_obj[_name]) throw `Graphic does not exist: "${_name}".`;
                } else
                    if (!_library.hasGraphic(_name)) throw `Graphic does not exist: "${_name}".`;
            },
            checkSoundExist(_name, _obj) {
                this.checkCanUseName(_name, "sound");
                if (_obj) {
                    if (_obj[_name]) throw `Sound already exists: "${_name}".`;
                } else
                    if (_library.hasSound(_name)) throw `Sound already exists: "${_name}".`;
            },
            checkSoundNotExist(_name, _obj) {
                if (_obj) {
                    if (!_obj[_name]) throw `Sound does not exist: "${_name}".`;
                } else
                    if (!_library.hasSound(_name)) throw `Sound does not exist: "${_name}".`;
            },
            checkSpriteSheetExist(_name, _obj) {
                this.checkCanUseName(_name, "spritesheet");
                if (_obj) {
                    if (_obj[_name]) throw `SpriteSheet already exists: "${_name}".`;
                } else
                    if (_library.hasSpriteSheet(_name)) throw `SpriteSheet already exists: "${_name}".`;
            },
            checkSpriteSheetNotExist(_name, _obj) {
                if (_obj) {
                    if (!_obj[_name]) throw `SpriteSheet does not exist: "${_name}".`;
                } else
                    if (!_library.hasSpriteSheet(_name)) throw `SpriteSheet does not exist: "${_name}".`;
            },
            checkPaintingExist(_name, _obj) {
                this.checkCanUseName(_name, "painting");
                if (_obj) {
                    if (_obj[_name]) throw `Painting already exists: "${_name}".`;
                } else
                    if (_library.hasPainting(_name)) throw `Painting already exists: "${_name}".`;
            },
            checkPaintingNotExist(_name, _obj) {
                if (_obj) {
                    if (!_obj[_name]) throw `Painting does not exist: "${_name}".`;
                } else
                    if (!_library.hasPainting(_name)) throw `Painting does not exist: "${_name}".`;
            }
        }

        const _runTime = (function __loopWorker() {
            const webworker = () => {
                const queue = {};
                self.onmessage = function ({ data }) {
                    const { code, id, interval } = data;
                    if (code === "nextloop") {
                        queue[id] = setTimeout(() => {
                            self.postMessage({ message: "nextloop", id });
                        }, interval);
                    } else if (code === "clear") {
                        clearTimeout(queue[id]);

                        delete queue[id];
                    }
                }
            }

            let code = webworker.toString();
            code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

            let blob;
            try {
                blob = new Blob([code], { type: "application/javascript" });
            } catch (e) {
                const blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)();
                blobBuilder.append(code);
                blob = blobBuilder.getBlob("application/javascript");
            }

            const worker = new Worker(URL.createObjectURL(blob));
            return worker;
        })();

        const _pureLoop = class pureLoop {
            constructor(_crash, id, [FLN, type], [workFunc, args = [], errorFunc = null], interval = 1000, skipOlds = false, maxTimes = 0) {
                this.id = id;
                this.expected;
                this.timeout;
                this._crash = _crash;
                this.FLN = FLN;
                this.type = type;
                if (type === "loop") {
                    if (!helperUtils.isNumber(interval))
                        this.interval = 1000;
                    else if (interval < 10)
                        this.interval = 10;
                    else
                        this.interval = interval;
                } else if (type === "timeout") {
                    if (!helperUtils.isNumber(interval))
                        this.interval = 0;
                    else
                        this.interval = interval;
                }
                this.workFunc = workFunc;
                this.args = args;
                this.errorFunc = errorFunc;
                this.skipOlds = skipOlds;
                this.maxTimes = maxTimes;
                this.isRunning = false;
                this.timesExecuted = 0;
            }

            start(startNow) {
                if (this.isRunning) return;
                this.isRunning = true;
                const intv = (startNow ? 0 : this.interval);
                this.expected = Date.now() + intv;
                _runTime.postMessage({ code: "nextloop", id: this.id, interval: intv });
            }

            stop() {
                if (!this.isRunning) return;

                this.isRunning = false;
                _runTime.postMessage({ code: "clear", id: this.id });
            }

            async nextloop() {
                if (!this.isRunning) return;
                let drift = Date.now() - this.expected;
                try {
                    await this.workFunc(...this.args);
                } catch (e) {
                    if (this._crash)
                        DebugModule.bubbleError({ type: "Stage", from: `create${this.type}`, error: e, src: this.FLN.includes("<anonymous>") ? this.workFunc : this.FLN }, true, false)
                    else
                        setTimeout(() =>
                            DebugModule.bubbleError({ type: "Stage", from: `create${this.type}`, error: e, src: this.FLN.includes("<anonymous>") ? this.workFunc : this.FLN }, true, false)
                        );
                }
                if (drift > this.interval) {
                    if (this.errorFunc) this.errorFunc();
                    else if (this.skipOlds) this.expected += drift;
                    else this.expected += this.interval;
                }
                else this.expected += this.interval;

                if (this.maxTimes > 0) {
                    this.timesExecuted++;
                    if (this.timesExecuted >= this.maxTimes) {
                        return this.stop();
                    }
                }
                _runTime.postMessage({ code: "nextloop", id: this.id, interval: Math.max(0, this.interval - drift) });
            }
        }

        const _loopManager = (function () {
            const loops = {};
            let _loopCount = 0;
            const generateLoopID = () => {
                const serializedID = String(Math.random()).substr(2);
                return `$loop_${_loopCount++}_${serializedID}`;
            }
            const addLoop = (_crash, _func, FLN, { ms: _ms = 1000, startNow = false, skipOlds = false, loops: maxTimes = 0 } = {}, _args = []) => {
                if (!_commandUtils.isScription(_func)) return;
                const callbackFunction = _commandUtils.getScription(_func);

                const loopID = generateLoopID();
                loops[loopID] = {
                    type: "loop",
                    exec: new _pureLoop(_crash, loopID, [FLN, "loop"], [callbackFunction, _args, null], _ms, skipOlds, maxTimes)
                };
                loops[loopID].exec.start(startNow);
                return loopID;
            }
            const pauseLoop = (_id) => {
                if (!loops[_id] || !loops[_id].type === "loop") return;
                loops[_id].exec.stop();
            }
            const playLoop = (_id, _start) => {
                if (!loops[_id] || !loops[_id].type === "loop") return;
                loops[_id].exec.start(_start);
            }
            const removeLoop = (_id) => {
                if (!loops[_id] || !loops[_id].type === "loop") return;
                loops[_id].exec.stop();
                delete loops[_id];
            }
            const addTimeout = (_func, FLN, _ms = 0, _args = []) => {
                if (!_commandUtils.isScription(_func)) return;
                const callbackFunction = _commandUtils.getScription(_func);

                const loopID = generateLoopID();
                loops[loopID] = {
                    type: "timeout",
                    exec: new _pureLoop(false, loopID, [FLN, "timeout"], [callbackFunction, _args, null], _ms, false, 1)
                };
                loops[loopID].exec.start(false);
                return loopID;
            }
            const removeTimeout = (_id) => {
                if (!loops[_id] || !loops[_id].type === "timeout") return;
                loops[_id].exec.stop();
                delete loops[_id];
            }
            _runTime.onmessage = function ({ data }) {
                if (!loops[data.id]) return;
                loops[data.id].exec.nextloop();
            }

            const _returns_ = {
                addLoop, pauseLoop, playLoop, removeLoop, addTimeout, removeTimeout
            }
            Object.defineProperties(_returns_, {
                loops: {
                    get() { return Object.keys(loops).length; },
                    enumerable: false,
                    configurable: false
                }
            });

            return _returns_;
        })();




        const VirtualCamera = function (_props) {
            const props = { _x: 0, _y: 0, _width: _defaults.stage._width, _height: _defaults.stage._height, _rotation: 0, _anchorX: 0, _anchorY: 0, _xScale: 100, _yScale: 100 };

            const bounds = { _x: props._x, _y: props._y, _width: props._width, height: props._height };

            const pProps = { ...props };


            Object.defineProperties(props, {
                _x: {
                    get() { return pProps._x; },
                    set(_val) {
                        pProps._x = _val;
                        _updateAttributes();
                    },
                    enumerable: true,
                    configurable: false
                },
                _y: {
                    get() { return pProps._y; },
                    set(_val) {
                        pProps._y = _val;
                        _updateAttributes();
                    },
                    enumerable: true,
                    configurable: false
                },
                _width: {
                    get() { return pProps._width; },
                    set(_val) {
                        pProps._width = _val;
                        _updateAttributes();
                    },
                    enumerable: true,
                    configurable: false
                },
                _height: {
                    get() { return pProps._height; },
                    set(_val) {
                        pProps._height = _val;
                        _updateAttributes();
                    },
                    enumerable: true,
                    configurable: false
                },
                _rotation: {
                    get() { return pProps._rotation },
                    set(_val) {
                        if (typeof _val === "string" && /^\d+%$/.test(_val)) {
                            pProps._rotation = (parseInt(_val) / 100 * 360);
                        } else
                            pProps._rotation = parseInt(_val);
                        if (!numberUtils.inRange(pProps._rotation, -179, 180))
                            pProps._rotation = numberUtils.wheelClamp(pProps._rotation, -180, 180);
                        _updateAttributes();
                    },
                    enumerable: true,
                    configurable: false
                },
                _anchorX: {
                    get() { return pProps._anchorX },
                    set(_val) {
                        pProps._anchorX = numberUtils.lock(parseInt(_val), 0, 100);
                        _updateAttributes();
                    },
                    enumerable: true,
                    configurable: false
                },
                _anchorY: {
                    get() { return pProps._anchorY },
                    set(_val) {
                        pProps._anchorY = numberUtils.lock(parseInt(_val), 0, 100);
                        _updateAttributes();
                    },
                    enumerable: true,
                    configurable: false
                },
                _xScale: {
                    get() { return pProps._xScale; },
                    set(_val) {
                        pProps._xScale = _val;
                        _updateAttributes();
                    },
                    enumerable: true,
                    configurable: false
                },
                _yScale: {
                    get() { return pProps._yScale; },
                    set(_val) {
                        pProps._yScale = _val;
                        _updateAttributes();
                    },
                    enumerable: true,
                    configurable: false
                },
            });


            const ctx = _screen.ctx;
            const _projectCamera = function () {
                ctx.save();

                const { _x = 0, _y = 0, _width = _defaults.stage._width, _height = _defaults.stage._height, _rotation, _anchorX, _anchorY, _xScale, _yScale } = props;

                const anchorX = (_defaults.stage._width) * (_anchorX / 100);
                const anchorY = (_defaults.stage._height) * (_anchorY / 100);
                ctx.translate(anchorX, anchorY);

                const width = _defaults.stage._width / _width;
                const height = _defaults.stage._height / _height;
                ctx.scale(width, height);

                const xScale = 100 / _xScale;
                const yScale = 100 / _yScale;
                ctx.scale(xScale, yScale);

                const rotation = numberUtils.degreesToRadians(_rotation);
                ctx.rotate(-rotation);

                const x = _x;
                const y = _y;
                ctx.translate(-x, -y);
            }

            const mapPointToStage = function(_point = {_x: 0, _y: 0}, _return) {
                const { _x = 0, _y = 0, _width = _defaults.stage._width, _height = _defaults.stage._height, _rotation, _anchorX, _anchorY, _xScale, _yScale } = props;

                let x = _point.x;
                let y = _point.y;

                const anchorX = (_defaults.stage._width) * (_anchorX / 100);
                const anchorY = (_defaults.stage._height) * (_anchorY / 100);
                x -= anchorX;
                y -= anchorY;

                const width = _defaults.stage._width / _width;
                const height = _defaults.stage._height / _height;
                x /= width;
                y /= height;

                const xScale = 100 / _xScale;
                const yScale = 100 / _yScale;
                x /= xScale;
                y /= yScale;

                let rP = numberUtils.rotatePoint(x, y, _rotation);
                x = rP._x;
                y = rP._y;

                x += _x;
                y += _y;

                if(_return) {
                    return { x, y };
                } else {
                    _point.x = x;
                    _point.y = y;
                }
            }

            const _setMouseStagePositions = function () {
                const _pos = mapPointToStage({ x: MouseModule._private_._x, y: MouseModule._private_._y }, true);

                                MouseModule._private_._stageX = _pos.x;
                MouseModule._private_._stageY = _pos.y;
            }

            const _setBounds = function () {
                const { _x, _y, _width, _height, _rotation, _anchorX: ax, _anchorY: ay, _xScale, _yScale } = props;
                const offsetX = (ax * _width / 100);
                const offsetY = (ay * _height / 100);
                let fx = -offsetX, fy = -offsetY;
                let fw = _width - offsetX, fh = _height - offsetY;

                fx *= _xScale / 100;
                fw *= _xScale / 100;
                fy *= _yScale / 100;
                fh *= _yScale / 100;

                let topLeftRP;
                let bottomLeftRP;
                let topRightRP;
                let bottomRightRP;

                if (_rotation === 0) {
                    topLeftRP = numberUtils.newPoint(fx, fy);
                    bottomLeftRP = numberUtils.newPoint(fx, fh);
                    topRightRP = numberUtils.newPoint(fw, fy);
                    bottomRightRP = numberUtils.newPoint(fw, fh);
                } else {
                    topLeftRP = numberUtils.rotatePoint(fx, fy, _rotation);
                    bottomLeftRP = numberUtils.rotatePoint(fx, fh, _rotation);
                    topRightRP = numberUtils.rotatePoint(fw, fy, _rotation);
                    bottomRightRP = numberUtils.rotatePoint(fw, fh, _rotation);
                }

                const minX = numberUtils.minMax("_x", "min", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);
                const minY = numberUtils.minMax("_y", "min", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);
                const maxX = numberUtils.minMax("_x", "max", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);
                const maxY = numberUtils.minMax("_y", "max", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);

                bounds._x = minX + _x;
                bounds._y = minY + _y;
                bounds._width = maxX - minX;
                bounds._height = maxY - minY;
            }

            const _updateAttributes = function () {
                _setMouseStagePositions();
                _setBounds();
            }

            const _isInScreen = function (_bounds) {
                return _commandUtils.boxHitTest(bounds, _bounds);
            }

            const _private_ = {
                _projectCamera,
                _setMouseStagePositions,
                _setBounds,
                _isInScreen
            }

            const _returns_ = new _constructors.VCam({
                mapPointToStage
            });
            Object.defineProperties(_returns_, {
                _private_: {
                    get() { return _private_ },
                    enumerable: false,
                    configurable: false
                },
                _xmouse: {
                    get() { return MouseModule._private_._x; },
                    enumerable: true,
                    configurable: false
                },
                _ymouse: {
                    get() { return MouseModule._private_._y; },
                    enumerable: true,
                    configurable: false
                },
                _xmouseMov: {
                    get() { return MouseModule._private_._movX; },
                    enumerable: true,
                    configurable: false
                },
                _ymouseMov: {
                    get() { return MouseModule._private_._movY; },
                    enumerable: true,
                    configurable: false
                }
            });
            for (let prop of Object.keys(props)) {
                Object.defineProperty(_returns_, prop, {
                    get() { return props[prop] },
                    set() {
                        const args = Array.prototype.slice.call(arguments); props[prop] = args[0];
                    },
                    enumerable: true,
                    configurable: false
                });
            }

            const _initFunc = function () {
                if (_props) {
                    if (!helperUtils.isObject(_props)) return;
                    for (const _prop of Object.keys(_props))
                        if (helperUtils.isDefined(props[_prop])) props[_prop] = _props[_prop];
                }
                _setBounds();
            }
            _initFunc();

            return _returns_;
        }

        const _Script = function (_definition = _defaults.emptyFunc) {
            DebugModule.typeCheck(_Script, "script definition", _definition, _constructors.Script, Function);
            _definition = _commandUtils.getScription(_definition);
            const _script = _definition;
            Object.defineProperty(_script, 'constructor', { value: _constructors.Script }); 
            return _script;
        }
        const _Scene = function (_name, _inits) {
            const state = {};
            let _appearanceFunction = null;
            let _stateChanged = false;
            let isLoaded = false;

            const __callAppearanceFunction = () => {
                if (_commandUtils.isScription(_appearanceFunction)) {
                    const _appearFunc = _commandUtils.getScription(_appearanceFunction);
                    try {
                        _appearFunc.bind(_appearanceObject)(_appearanceObject);
                    } catch (bubbledError) {
                        DebugModule.bubbleError({ type: "Scene", from: "scene.setappearance", error: bubbledError, src: _appearFunc });
                    }
                }
            }
            const inits = [];
            const finis = [];
            const _heirarchy = {
                scripts: [], flevaclips: {},
                visuals: {
                    name: null,
                    src: null,
                    type: null
                },
                queue: []
            }

            let _flevaclipCount = 0;
            const _fillState = (_newState) => {
                if (!helperUtils.isObject(_newState)) return;
                for (const _name of Object.keys(_newState)) {
                    if (state[_name] !== _newState[_name]) {
                        state[_name] = _newState[_name];
                        if (!_stateChanged) _stateChanged = true;
                    }
                }
            }
            const _clearState = () => {
                for (const _name of Object.keys(state)) {
                    delete state[_name];
                }
            }

            const _stack = {
                list: [],
                addToMainStack() {
                    for (const _name of Object.keys(this.list)) {
                        mainStack.list.push(this.list[_name]);
                    }
                    mainStack.sortStack();
                },
                removeFromMainStack() {
                    for (const _name of Object.keys(this.list)) {
                        const flevaclip = this.list[_name];
                        const index = mainStack.list.findIndex(elem => elem.stackName === flevaclip.stackName);

                        if (index !== -1) {
                            mainStack.list.splice(index, 1);
                        }
                    }
                }
            }


            const changeState = (_name, _value) => {
                const functionLineNumber = DebugModule.getLineNumber(2);
                try {
                    DebugModule.typeCheck(changeState, "state's name", _name, String);
                    const _newState = {};
                    _newState[_name] = _value;

                    _fillState(_newState);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "scene.changeState", error: bubbledError, src: functionLineNumber });
                }
            }
            const useState = (_state) => { 
                try {
                    DebugModule.typeCheck(useState, "state", _state, Object, Function, _constructors.Script);
                    if (helperUtils.isObject(_state)) {
                        const _newState = _state;

                        _clearState();
                        _fillState(_newState);
                    } else if (_commandUtils.isScription(_state)) {
                        const prevState = objectUtils.deepCloneObject(state);
                        const _newState = _commandUtils.getScription(_state)(prevState);

                        _clearState();
                        _fillState(_newState);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "scene.useState", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }
            const setState = (_state) => { 
                try {
                    DebugModule.typeCheck(setState, "state", _state, Object, Function, _constructors.Script);
                    if (helperUtils.isObject(_state)) {
                        const _newState = _state;

                        _fillState(_newState);
                    } else if (_commandUtils.isScription(_state)) {
                        const prevState = objectUtils.deepCloneObject(state);
                        const _newState = _commandUtils.getScription(_state)(prevState);

                        _fillState(_newState);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "scene.setState", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }

            const _addFlevaClip = (_type, _clipID, _instanceName, _preserve, _props, _inits) => {
                const _stackName = _generateSymbolName("stack");
                const _swapDepths = (_depth) => mainStack.swapDepths(_stackName, _depth);
                const _funcs = { swapDepths: _swapDepths };

                const FlevaClip = _type === "prefab" ? _Prefab : _type === "textfield" ? _Textfield : false;

                const instance = FlevaClip(_props, _inits, _funcs);

                _heirarchy.flevaclips[_clipID] = {
                    stackName: _stackName,
                    instanceName: _instanceName,
                    preserve: _preserve,
                    instance
                }

                const stackInst = {
                    stackName: _stackName,
                    depth: 1,
                    instance,
                    render: instance._private_._render
                }
                _stack.list.push(stackInst);

                if (isLoaded) {
                    addToBatch(async function () {
                        try {
                            if (isLoaded)
                                await instance._private_._load();
                        } catch (bubbledError) {
                            DebugModule.bubbleError({ type: "Scene", from: `scene.add${_type}`, error: bubbledError }, true);
                        }
                    });
                    mainStack.list.push(stackInst);

                    mainStack.sortStack();
                }
            }
            const addFlevaClip = (_type, functionLineNumber, ..._args) => {
                if (helperUtils.isString(_args[0])) {
                    let [_name, _props, ..._inits] = _args;
                    if (!helperUtils.isObject(_props)) {
                        _inits = [_props, ..._inits];
                        _props = {};
                    }
                    const { instanceName, preserve = false, ...__props } = _props;
                    _props = __props;

                    if (!(_heirarchy.flevaclips[_flevaclipCount] && _heirarchy.flevaclips[_flevaclipCount].preserve && preserve)) {
                        const sourceRef = _getFlevaClipFromLibrary(_name)._private_;
                        const type = sourceRef._getType();

                        if (_type !== type) throw `Expected ${_type} flevaclip but received ${type} instead.`;

                        _inits = _inits.filter(elem => _commandUtils.isScription(elem));
                        for (const _init of _inits)
                            _init.FLN = functionLineNumber;

                        _inits = [...sourceRef._getRawInits(), ..._inits];
                        _props = { ...sourceRef._getRawProps(), ..._props };

                        _addFlevaClip(_type, _flevaclipCount, instanceName, preserve, _props, _inits);
                    }
                } else if (helperUtils.isArray(_args[0])) {
                    let [_names, _props, ..._inits] = _args;
                    if (!helperUtils.isObject(_props)) {
                        _inits = [_props, ..._inits];
                        _props = {};
                    }
                    const { instanceName, preserve = false, ...__props } = _props;
                    _props = __props;

                    if (!(_heirarchy.flevaclips[_flevaclipCount] && _heirarchy.flevaclips[_flevaclipCount].preserve && preserve)) {
                        const sourceRefs = _names.map(_name => _getFlevaClipFromLibrary(_name)._private_);
                        const types = sourceRefs.reduce((acc, sourceRef) => ([...acc, sourceRef._getType()]), []);

                        for (const type of types)
                            if (_type !== type) throw `Expected ${_type} flevaclip but received ${type} instead.`;

                        _inits = _inits.filter(elem => _commandUtils.isScription(elem));
                        for (const _init of _inits)
                            _init.FLN = functionLineNumber;

                        _inits = [...sourceRefs.reduce((acc, sourceRef) => ([...acc, ...sourceRef._getRawInits()]), []), ..._inits];
                        _props = { ...sourceRefs.reduce((acc, sourceRef) => ({ ...acc, ...sourceRef._getRawProps() }), {}), ..._props };

                        _addFlevaClip(_type, _flevaclipCount, instanceName, preserve, _props, _inits);
                    }
                } else {
                    let [_props, ..._inits] = _args;
                    if (!helperUtils.isObject(_props)) {
                        _inits = [_props, ..._inits];
                        _props = {};
                    }
                    _inits = _inits.filter(elem => _commandUtils.isScription(elem));
                    for (const _init of _inits)
                        _init.FLN = functionLineNumber;

                    const { instanceName, preserve = false, ...__props } = _props;
                    _props = __props;

                    if (!(_heirarchy.flevaclips[_flevaclipCount] && _heirarchy.flevaclips[_flevaclipCount].preserve && preserve)) {
                        _addFlevaClip(_type, _flevaclipCount, instanceName, preserve, _props, _inits);
                    }
                }
                _flevaclipCount++;
            }

            const addPrefab = (..._args) => {
                const functionLineNumber = DebugModule.getLineNumber(2);
                try {
                    addFlevaClip("prefab", functionLineNumber, ..._args);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "scene.addPrefab", error: bubbledError, src: functionLineNumber });
                }
            }
            const addTextfield = (..._args) => {
                const functionLineNumber = DebugModule.getLineNumber(2);
                try {
                    addFlevaClip("textfield", functionLineNumber, ..._args);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "scene.addTextfield", error: bubbledError, src: functionLineNumber });
                }
            }

            let _spriteSheet = undefined, _spriteSheetFrameID = 0, _spriteSheetLoop = undefined;
            const _resetSpriteSheet = () => {
                if (helperUtils.isDefined(_spriteSheetLoop)) {
                    deleteLoop(_spriteSheetLoop);
                    _spriteSheet = undefined;
                    _spriteSheetFrameID = 0;
                    _spriteSheetLoop = undefined;
                }
                _heirarchy.visuals.name = null;
                _heirarchy.visuals.src = null;
                _heirarchy.visuals.type = null;
            }
            const useSprite = (_name) => {
                try {
                    if (helperUtils.isSprite(_name))
                        _name = _name.idName;
                    _errorsM.checkSpriteNotExist(_name);
                    if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Sprite) && _heirarchy.visuals.name === _name) return;

                    _resetSpriteSheet();
                    _heirarchy.visuals.name = _name;
                    _heirarchy.visuals.src = _name;
                    _heirarchy.visuals.type = helperUtils.typeOf(_constructors.Sprite);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "useSprite", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }
            const useGraphic = (_name) => {
                try {
                    if (helperUtils.isGraphic(_name))
                        _name = _name.idName;
                    _errorsM.checkGraphicNotExist(_name);
                    if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Graphic) && _heirarchy.visuals.name === _name) return;

                    _resetSpriteSheet();
                    _heirarchy.visuals.name = _name;
                    _heirarchy.visuals.src = _name;
                    _heirarchy.visuals.type = helperUtils.typeOf(_constructors.Graphic);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "useGraphic", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }

            const usePainting = (_painting) => {
                try {
                    if (helperUtils.isPainting(_painting))
                        _painting = _painting.idName;
                    if (helperUtils.isString(_painting)) {
                        const _name = _painting;
                        _errorsM.checkPaintingNotExist(_name);
                        if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Painting) && _heirarchy.visuals.name === _name) return;

                        _resetSpriteSheet();
                        _heirarchy.visuals.name = _name;
                        _heirarchy.visuals.src = _name;
                        _heirarchy.visuals.type = helperUtils.typeOf(_constructors.Painting);
                    } else if (_commandUtils.isScription(_painting)) {
                        _resetSpriteSheet();
                        const _function = _commandUtils.getScription(_painting);
                        _heirarchy.visuals.name = "painting";
                        _heirarchy.visuals.src = _function;
                        _heirarchy.visuals.type = helperUtils.typeOf(_constructors.Painting);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "usePainting", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }

            const useSpriteSheet = (_name, _fps = 1, _loops = 0, _callback) => {
                const functionLineNumber = DebugModule.getLineNumber(2);
                try {
                    if (!helperUtils.isNumber(_fps)) throw `Number expected for _fps.`;
                    if (!helperUtils.isNumber(_loops)) throw `Number expected for _loop count.`;
                    if (helperUtils.isDefined(_callback) && !_commandUtils.isScription(_callback)) throw `Script or function expected for _callback.`;
                    if (helperUtils.isSpriteSheet(_name))
                        _name = _name.idName;
                    _errorsM.checkSpriteSheetNotExist(_name);
                    if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.SpriteSheet) && _heirarchy.visuals.name === _name) return;
                    let loopCount = 0;

                    _resetSpriteSheet();

                    _spriteSheet = _library.spritesheets[_name].assetSource;
                    _spriteSheetFrameID = 0;

                    _spriteSheetLoop = createLoop(true, async () => {
                        const nextID = numberUtils.cycle(_spriteSheetFrameID, _spriteSheet.length - 1);
                        if (_loops > 0 && _spriteSheet.hasLoaded) {
                            if (nextID === 0) loopCount++;
                            if (loopCount >= _loops) {
                                pauseLoop(_spriteSheetLoop);
                                if (helperUtils.isDefined(_callback)) {
                                    const callback = _commandUtils.getScription(_callback);
                                    try {
                                        await callback();
                                    } catch (errMsg) {
                                        DebugModule.addAsyncError(() =>
                                            DebugModule.bubbleError({ type: "Scene", from: "spritesheet.onend", error: errMsg, src: functionLineNumber }));
                                    }
                                }
                                return;
                            }
                        }
                        _spriteSheetFrameID = nextID;
                    }, { ms: 1000 / _fps, skipOlds: true });

                    _heirarchy.visuals.name = _name;
                    _heirarchy.visuals.src = _spriteSheet;
                    _heirarchy.visuals.type = helperUtils.typeOf(_constructors.SpriteSheet);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "useSpriteSheet", error: bubbledError, src: functionLineNumber });
                }
            }

            const thisScope = {};
            const addScript = (_script) => {
                try {
                    DebugModule.typeCheck(addScript, "script", _script, String, Function, _constructors.Script);
                    let script;
                    if (helperUtils.isString(_script)) {
                        const _newScript = getScriptFromLibrary(_script);
                        script = _Script(_newScript);
                    } else if (_commandUtils.isScription(_script)) {
                        const _newScript = _commandUtils.getScription(_script);
                        script = _Script(_newScript);
                    }
                    const flevaScript = _commandUtils.createFlevaScript(script, thisScope, _thisObj);
                    _heirarchy.scripts.push(flevaScript);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Scene", from: "scene.addScript", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }

            const setAppearanceFunction = (_script) => {
                if (helperUtils.isString(_script)) {
                    const _newScript = getScriptFromLibrary(_script);
                    const flevaScript = _commandUtils.createFlevaScript(_newScript, thisScope, _appearanceObject);

                    _appearanceFunction = flevaScript;
                } else if (_commandUtils.isScription(_script)) {
                    const _newScript = _commandUtils.getScription(_script);
                    const flevaScript = _commandUtils.createFlevaScript(_newScript, thisScope, _appearanceObject);

                    _appearanceFunction = flevaScript;
                }
            }

            const load = async () => {
                if (isLoaded) return;

                if (inits.length > 0)
                    for (const init of Object.keys(inits)) {
                        const _init = inits[init];
                        try {
                            const fini = await _init.bind(_thisObj)(_thisObj);
                            if (_commandUtils.isScription(fini)) {
                                const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(fini), thisScope, _thisObj);
                                finis.push(flevaScript);
                                finis[finis.length - 1].FLN = _init.FLN;
                            }
                        } catch (bubbledError) {
                            DebugModule.bubbleError({ type: "Scene", from: "scene.onload", error: bubbledError, src: _init.FLN || _init });
                        }
                    }

                _stack.addToMainStack();

                for (const _name of Object.keys(_heirarchy.flevaclips)) {
                    try {
                        await _heirarchy.flevaclips[_name].instance._private_._load();
                    } catch (bubbledError) {
                        DebugModule.bubbleError({ type: "Scene", from: "scene.onload", error: bubbledError });
                    }
                }

                _stateChanged = true;
                isLoaded = true;
            }
            const unload = async () => {
                if (!isLoaded) return;

                _stack.removeFromMainStack();

                for (const _name of Object.keys(_heirarchy.flevaclips)) {
                    if (!_heirarchy.flevaclips[_name].preserve) {
                        const flevaclip = _heirarchy.flevaclips[_name];
                        const index = _stack.list.findIndex(elem => elem.stackName === flevaclip.stackName);

                        if (index !== -1) {
                            _stack.list.splice(index, 1);
                        }

                        try {
                            await flevaclip.instance._private_._unload();
                        } catch (bubbledError) {
                            DebugModule.bubbleError({ type: "Scene", from: "scene.onunload", error: bubbledError });
                        }
                        delete _heirarchy.flevaclips[_name];
                    }
                }
                _flevaclipCount = 0;

                if (finis.length > 0) {
                    for (const fini of Object.keys(finis)) {
                        const _fini = finis[fini];
                        try {
                            await _fini.bind(_thisObj)(_thisObj);
                        } catch (bubbledError) {
                            DebugModule.bubbleError({ type: "Scene", from: "scene.onunload", error: bubbledError, src: _fini.FLN || _fini });
                        }
                    }
                    finis.length = 0;
                }

                _heirarchy.scripts.length = 0;

                isLoaded = false;
            }

            const tick = async function () {
                const queue = _heirarchy.queue;
                while (queue.length) {
                    const [func, ...params] = queue.shift();
                    await func(...params);
                }
                for (const _name of Object.keys(_heirarchy.scripts)) {
                    const _script = _heirarchy.scripts[_name];
                    try {
                        await _script.bind(_thisObj)(_thisObj);
                    } catch (bubbledError) {
                        DebugModule.bubbleError({ type: "Scene", from: "scene's script", error: bubbledError, src: _script.FLN || _script });
                    }
                }

                for (const _name of Object.keys(_heirarchy.flevaclips)) {
                    await _heirarchy.flevaclips[_name].instance._private_._tick();
                }

            }
            const render = function () {
                if (_stateChanged) {
                    _stateChanged = false;
                    try {
                        __callAppearanceFunction();
                    } catch (bubbledError) {
                        DebugModule.bubbleError({ type: "Scene", from: "scene's script", error: bubbledError });
                    }
                }

                if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Sprite)) {
                    _screen.renderScene(_constructors.Sprite, [_heirarchy.visuals.src]);
                } else if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.SpriteSheet)) {
                    _screen.renderScene(_constructors.SpriteSheet, [_heirarchy.visuals.src[_spriteSheetFrameID]]);
                } else if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Graphic)) {
                    _screen.renderScene(_constructors.Graphic, [_heirarchy.visuals.src]);
                } else if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Painting)) {
                    _screen.renderScene(_constructors.Painting, [_heirarchy.visuals.src, state]);
                }
            }
            const start = function () {
                for (const _name of Object.keys(_heirarchy.flevaclips)) {
                    _heirarchy.flevaclips[_name].instance._private_._start();
                }
                _stateChanged = true;
            }
            const stop = function () {
                for (const _name of Object.keys(_heirarchy.flevaclips)) {
                    _heirarchy.flevaclips[_name].instance._private_._stop();
                }
            }

            const metaUtils = {
                flevaclipCount: () => {
                    return _flevaclipCount;
                }
            }

            const _private_ = {
                metaUtils,
                _getFlevaClipByInstanceName: (_instanceName) => {
                    for (const _name of Object.keys(_heirarchy.flevaclips)) {
                        if (_heirarchy.flevaclips[_name].instanceName === _instanceName) {
                            return _heirarchy.flevaclips[_name].instance;
                        }
                    }
                },
                _start: start, _stop: stop,
                _load: load, _unload: unload,
                _tick: tick, _render: render
            }

            const _returns_ = new _constructors.Scene({
                name: _name,
                state,
                changeState,
                useState,
                setState,
                addPrefab,
                addTextfield,
                addScript,
                setAppearance: setAppearanceFunction
            });


            Object.defineProperties(_returns_, {
                _private_: {
                    get() { return _private_ },
                    enumerable: false,
                    configurable: false
                }
            });

            const _thisObj = _returns_;
            const _initFunc = function () {
                if (_commandUtils.isScription(_inits)) {
                    const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(_inits), thisScope, _thisObj);
                    inits.push(flevaScript);
                } else if (helperUtils.isArray(_inits))
                    for (const _init of Object.values(_inits))
                        if (_commandUtils.isScription(_init)) {
                            const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(_init), thisScope, _thisObj);
                            inits.push(flevaScript);
                        }
            }
            _initFunc();

            const _appearanceObject = {
                get state() { return objectUtils.deepCloneObject(state) },
                useSprite,
                useGraphic,
                useSpriteSheet,
                usePainting,
                toString() {
                    return "[type SceneAppearance]";
                }
            }

            return _returns_;
        }
        const __Textfield = function ({ _x = 0, _y = 0, _width = 100, _height = 20, _padding = 0, _fontSize = 20, _lineHeight = 0, _fontFamily = "Arial, Sans-Serif", _textAlign = "left", _text: _initialText, _multiline = true, _wordWrap = true, _type = "dynamic", _backgroundColor = 0, _borderColor = 0, _fontColor = "black" } = {}, getParent) {
            const args = Array.prototype.slice.call(arguments);
            const { div, ctx } = _screen;
            const init = {};
            init.x = parseInt(_x);
            init.y = parseInt(_y);
            init.width = parseInt(_width);
            init.height = parseInt(_height);
            init.padding = parseInt(_padding);
            init.fontSize = parseInt(_fontSize);
            init.fontColor = _fontColor;
            init.getParent = getParent;
            init.lineHeight = parseInt(_lineHeight);
            init.type = ["dynamic", "input", "password"].includes(_type) ? _type : "dynamic";
            init.fontFamily = init.type === "password" ? "monospace" : _fontFamily;
            init.backgroundColor = _backgroundColor ? _backgroundColor : init.type === "dynamic" ? "none" : "white";
            init.borderColor = _borderColor ? _borderColor : init.type === "dynamic" ? "none" : "green";
            init.textAlign = _textAlign;
            init.initialText = _initialText;
            init.multiline = init.type === "password" ? false : _multiline;
            init.wordWrap = init.multiline === false ? false : [true, false].includes(_wordWrap) ? _wordWrap : true;

            const defs = { _alpha: 1, _visible: true, _rotation: 0, _anchorX: 0, _anchorY: 0 };
            if (args[0]) {
                const _props = args[0];
                if (!helperUtils.isObject(_props)) return;
                for (const _prop of Object.keys(_props))
                    if (helperUtils.isDefined(defs[_prop])) {
                        defs[_prop] = _props[_prop];
                    }
            }

            const __private = {};
            __private.__x = init.x;
            __private.__y = init.y;
            __private.__width = init.width;
            __private.__height = init.height;
            __private.__font = init.fontFamily;
            __private.__size = init.fontSize;
            __private.__type = init.type;
            __private.__backgroundColor = init.backgroundColor;
            __private.__borderColor = init.borderColor;
            __private.__fontColor = init.fontColor;
            __private.__lineHeight = init.lineHeight || init.fontSize;
            __private.__padding = init.padding;
            __private.__wrap = init.wordWrap;
            __private.__textAlign = ["left", "center", "right"].includes(init.textAlign) ? init.textAlign : "left";

            __private.__focused = false;
            __private.__hovered = false;

            const meta = {};
            meta.newLineCode = "\n";
            meta.contents = [];
            meta.lines = [""];
            meta.linesAligned = [];
            meta.lineBreaks = [];

            meta.__cursorPosition = 0;
            meta.currentLine = 0;
            meta.currentLineCursorPosition = 0;
            meta.currentLineCursorPixels = 0;
            meta.intendedCursorPixels = 0;

            meta.cantGoThroughVals = ["\n", ".", "+", "-", "\"", "'", "/", "?", ",", ";", ":"];
            meta.goThroughVals = [" ", "(", ")"];

            meta.selectorCursorPosition1 = undefined;
            meta.selectorCursorPosition2 = undefined;
            meta.minSelectionPosition = undefined;
            meta.maxSelectionPosition = undefined;
            meta.canSelectWithMouse = false;

            const __properties = {};
            __properties.__contentX = 0;
            __properties.__contentY = 0;
            __properties.contentWidth = 0;
            __properties.contentHeight = 0;

            const defineProperties = () => {
                Object.defineProperties(_returns_,
                    {
                        _fontSize: {
                            get() {
                                return __private.__size;
                            },
                            set(val) {
                                val = Math.max(8, Math.min(parseInt(val), 80));
                                const prevSize = __private.__size;
                                const prevLineheight = __private.__lineHeight;
                                __private.__size = val;
                                __private.__lineHeight = prevLineheight / prevSize * val;
                                meta.getLinesFromContent();
                                meta.getContentPositions();
                            },
                            enumerable: true,
                        },
                        _padding: {
                            get() {
                                return __private.__padding;
                            },
                            set(val) {
                                __private.__padding = parseInt(val);
                                meta.getLinesFromContent();
                                meta.getContentPositions();
                            },
                            enumerable: true,
                        },
                        _width: {
                            get() {
                                return __private.__width;
                            },
                            set(val) {
                                val = Math.max(2, parseInt(val));
                                __private.__width = val;
                                meta.getLinesFromContent();
                                meta.getContentPositions();
                            },
                            enumerable: true,
                        },
                        _height: {
                            get() {
                                return __private.__height;
                            },
                            set(val) {
                                val = Math.max(2, parseInt(val));
                                __private.__height = val;
                                meta.getLinesFromContent();
                                meta.getContentPositions();
                            },
                            enumerable: true,
                        },
                        _x: {
                            get() {
                                return __private.__x;
                            },
                            set(val) {
                                __private.__x = val;
                            },
                            enumerable: true,
                        },
                        _y: {
                            get() {
                                return __private.__y;
                            },
                            set(val) {
                                __private.__y = val;
                            },
                            enumerable: true,
                        },
                        _text: {
                            get() {
                                return accessibles.getText();
                            },
                            set(val) {
                                accessibles.setText(val);
                            },
                            enumerable: true
                        },
                        _textAlign: {
                            get() {
                                return __private.__textAlign;
                            },
                            set(val) {
                                val = ["right", "center", "left"].includes(val) ? val : "left";
                                __private.__textAlign = val;
                                meta.getLinesFromContent();
                                meta.getContentPositions();
                            },
                            enumerable: true
                        },
                        _backgroundColor: {
                            get() {
                                return __private.__backgroundColor;
                            },
                            set(val) {
                                __private.__backgroundColor = val;
                            },
                            enumerable: true
                        },
                        _borderColor: {
                            get() {
                                return __private.__borderColor;
                            },
                            set(val) {
                                __private.__borderColor = val;
                            },
                            enumerable: true
                        },
                        _fontColor: {
                            get() {
                                return __private.__fontColor;
                            },
                            set(val) {
                                __private.__fontColor = val;
                            },
                            enumerable: true
                        }
                    });

                if (__private.__type !== "dynamic")
                    Object.defineProperties(_returns_,
                        {
                            _focused: {
                                get() {
                                    return __private.__focused;
                                },
                                set(val) {
                                    if (![true, false].includes(val)) return;
                                    const alreadySame = __private.__focused === val;
                                    __private.__focused = val;
                                    if (!alreadySame)
                                        if (val) {
                                            MouseModule._private_._clearSelectedFlevaClip();
                                            MouseModule._private_._setSelectedFlevaClip(navigation.unselect);
                                        } else
                                            MouseModule._private_._clearSelectedFlevaClip();
                                },
                                enumerable: true
                            }
                        }
                    )
                if (["input", "dynamic"].includes(__private.__type))
                    Object.defineProperties(_returns_,
                        {
                            _wordWrap: {
                                get() {
                                    return __private.__wrap;
                                },
                                set(val) {
                                    __private.__wrap = init.multiline === false ? false : [true, false].includes(val) ? val : true;
                                    meta.getLinesFromContent();
                                    meta.getContentPositions();
                                },
                                enumerable: true
                            },
                            _fontFamily: {
                                get() {
                                    return __private.__font;
                                },
                                set(val) {
                                    __private.__font = val;
                                    if (__private.__type === "password") __private.__font = "monospace";
                                    meta.getLinesFromContent();
                                    meta.getContentPositions();
                                },
                                enumerable: true,
                            },
                            _lineHeight: {
                                get() {
                                    return __private.__lineHeight;
                                },
                                set(val) {
                                    __private.__lineHeight = Math.max(1, parseInt(val));
                                    meta.getLinesFromContent();
                                    meta.getContentPositions();
                                },
                                enumerable: true,
                            },
                        });

                Object.defineProperties(__properties,
                    {
                        fontFamily: {
                            get() {
                                return `${__private.__size}px ${__private.__font}`;
                            }
                        },
                        innerWidth: {
                            get() {
                                return (__private.__width - (__private.__padding * 2) - 2) || 1;
                            }
                        },
                        innerHeight: {
                            get() {
                                return (__private.__height - (__private.__padding * 2) - 2) || 1;
                            }
                        },
                        innerX: {
                            get() {
                                return __private.__x + __private.__padding + 1;
                            }
                        },
                        innerY: {
                            get() {
                                return __private.__y + __private.__padding + 1;
                            }
                        },
                        contentX: {
                            get() {
                                return __properties.__contentX;
                            },
                            set(val) {
                                __properties.__contentX = val > 0 ? 0 : val;
                            }
                        },
                        contentY: {
                            get() {
                                return __properties.__contentY;
                            },
                            set(val) {
                                __properties.__contentY = val > 0 ? 0 : val;
                            }
                        }
                    })
                Object.defineProperties(meta,
                    {
                        cursorPosition: {
                            get: () => {
                                return meta.__cursorPosition;
                            },
                            set: (val) => {
                                meta.__cursorPosition = val;
                                meta.getCurrentLineAndCursorPosition();
                            }
                        },
                        pageY: {
                            get: () => {
                                return __private.__y + div.offsetTop;
                            },
                        },
                        pageX: {
                            get: () => {
                                return __private.__x + div.offsetLeft;
                            },
                        },
                        pageCursorY: {
                            get: () => {
                                const cursorYSize = (meta.currentLine) * __private.__lineHeight;
                                return cursorYSize + meta.pageY + __properties.contentY;
                            },
                        },
                        pageCursorX: {
                            get: () => {
                                ctx.save();
                                ctx.font = __properties.fontFamily;

                                const txt = meta.lines[meta.currentLine].substr(0, meta.currentLineCursorPosition);

                                const cursorXSize = measureText(txt);

                                ctx.restore();
                                return cursorXSize + meta.pageX + __properties.contentX;
                            },
                        },
                    })
            }

            function measureText(text) {
                if (__private.__type === "password")
                    return ctx.measureText("*").width * text.length;
                else
                    return ctx.measureText(text).width;
            }

            init.keys = {};
            init.mouse = {
                isDown: false
            };
            init.initialize = () => {
                defineProperties();
                const events = {}
                events.mouseUp = () => {
                    navigation.checkMouseAction(init.keys.shft, "up");
                }
                events.mouseMove = () => {
                    navigation.checkMouseAction(init.keys.shft, "move");
                }
                events.keyDown = e => {
                    navigation.checkKeyDown(e);
                };
                events.keyUp = e => {
                    navigation.checkKeyUp(e);
                }
                if (__private.__type !== "dynamic") {
                    _private_._load = () => {
                        div.addEventListener("mouseup", events.mouseUp);
                        div.addEventListener("mousemove", events.mouseMove);
                        div.addEventListener("keydown", events.keyDown);
                        div.addEventListener("keyup", events.keyUp);
                    }
                    _private_._unload = () => {
                        div.removeEventListener("mouseup", events.mouseUp);
                        div.removeEventListener("mousemove", events.mouseMove);
                        div.removeEventListener("keydown", events.keyDown);
                        div.removeEventListener("keyup", events.keyUp);
                        meta.resetSelectedArea();
                    }
                    _private_._setSelection = (_x, _y) => {
                        navigation.checkMouseAction(init.keys.shft, "down");
                        return navigation.unselect;
                    }
                }
                if (init.initialText) accessibleMeta.appendText(init.initialText, false);
                meta.getLinesFromContent();
            }

            function setupMeta() {
                meta.getCursorPosition = (x, y) => {
                    y = Math.floor(y / __private.__lineHeight);
                    if (y > meta.lines.length - 1) return meta.cursorPosition = meta.contents.length;
                    if (y < 0) return meta.cursorPosition = 0;

                    const cursorPosition = meta.lines[y].length || 0;

                    const lineOffset = meta.linesAligned[y];

                    const lineCursorPosition = meta.getCursorPositionByLineWidth(meta.lines[y], x - lineOffset, cursorPosition);
                    let prevCursorPositions = 0;
                    for (let i = 0; i < y; i++) {
                        prevCursorPositions += meta.lines[i].length;
                        if (meta.lineBreaks.includes(i)) prevCursorPositions++;
                    }

                    meta.cursorPosition = prevCursorPositions + lineCursorPosition;
                }
                meta.getCursorPositionByLineWidth = (str = "", width = 0, cursorPosition = 0) => {
                    let currentText = "";
                    let currentWidth = 0;
                    ctx.save();
                    ctx.font = __properties.fontFamily;
                    for (const _key of Object.keys(str)) {
                        const key = parseInt(_key)
                        const char = str[key];

                        currentText += char;
                        currentWidth = Math.round(measureText(currentText));

                        if (currentWidth > width) {
                            const previousWidth = Math.round(measureText(currentText.substr(0, key)));
                            if (Math.abs(width - previousWidth) < Math.abs(width - currentWidth)) {
                                cursorPosition = key;
                            } else {
                                cursorPosition = key + 1;
                            }
                            break;
                        }
                    }

                    ctx.restore();

                    return cursorPosition;
                }
                meta.getCurrentLineAndCursorPosition = () => {
                    const lines = meta.lines;
                    let currentLine = 0;
                    let cursorPosition = meta.cursorPosition;
                    let currentLineCursorPosition = 0;
                    let cumulativePosition = 0;

                    for (let i = 0; i < lines.length; i++) {
                        const length = lines[i].length;

                        if (cursorPosition - length > 0 && currentLine + 1 < lines.length) {
                            cursorPosition -= length;
                            cumulativePosition += length;
                            if (meta.lineBreaks.includes(i)) {
                                cursorPosition--;
                                cumulativePosition++;
                            }
                            currentLine++;
                        } else {
                            break;
                        }
                    }
                    currentLineCursorPosition = meta.cursorPosition - cumulativePosition;
                    meta.currentLine = currentLine;
                    meta.currentLineCursorPosition = currentLineCursorPosition;

                    ctx.save();
                    ctx.font = __properties.fontFamily;

                    const txt = meta.lines[meta.currentLine].substr(0, meta.currentLineCursorPosition);
                    meta.currentLineCursorPixels = measureText(txt) + meta.linesAligned[meta.currentLine];

                    ctx.restore();
                }
                meta.getWidthAtIndex = (str, index) => {
                    ctx.save();
                    ctx.font = __properties.fontFamily;

                    let txt = str.substr(0, index);
                    const width = measureText(txt);

                    ctx.restore();
                    return width;
                }
                meta.getWordAtWidth = (word = "", width = 0) => {
                    if (width === 0) return { containedWord: "", excessLength: word.length }
                    let currentText = "";

                    let currentWidth = 0;
                    let index = 0;

                    ctx.save();
                    ctx.font = __properties.fontFamily;
                    for (const _key of Object.keys(word)) {
                        const key = parseInt(_key)
                        const char = word[key];

                        currentText += char;
                        currentWidth = Math.round(measureText(currentText));
                        if (currentText.length === 1 && currentWidth >= width) {
                            index = key + 1;
                            break;
                        } else {
                            if (currentWidth >= width) {
                                index = key;
                                break;
                            }
                        }
                    }

                    const containedWord = word.substr(0, index), excessLength = word.substr(index).length;
                    ctx.restore();
                    return {
                        containedWord,
                        excessLength
                    }
                }
                meta.escapeContent = () => {
                    if (init.multiline === false) {
                        meta.contents = meta.contents.filter(char => char !== meta.newLineCode);
                    }
                }
                meta.getLinesFromContent = () => {
                    const newLineCode = meta.newLineCode;
                    ctx.save();
                    ctx.font = __properties.fontFamily;

                    meta.escapeContent();
                    const contents = meta.contents;

                    const lines = [];
                    const maxWidth = __properties.innerWidth;
                    let i = 0;
                    let firstWord = true;
                    let word = "";
                    let currentLine = "";
                    let lineNumber = 0;
                    const lineBreaks = [];

                    const wordWrap = __private.__wrap;

                    while (i < contents.length) {
                        if (contents[i] !== " " && contents[i] !== newLineCode) { 
                            word += contents[i].substring(0, 1);
                            i++;
                        }
                        if (i === (contents.length)) {
                            if (word !== "") {
                                if (wordWrap === false) {
                                    if (!firstWord) {
                                        currentLine += word; word = "";
                                    } else { 
                                        currentLine = word;
                                        firstWord = false;
                                        word = "";
                                    }
                                } else {
                                    if (!firstWord) {
                                        if (measureText(currentLine + word) >= maxWidth) {
                                            lines[lineNumber] = currentLine;
                                            lineNumber++;
                                            currentLine = "";
                                            i -= word.length;
                                            word = "";
                                            firstWord = true;
                                        } else {
                                            currentLine += word; word = "";
                                        }
                                    } else { 
                                        if (measureText(word) < maxWidth) {
                                            currentLine = word;
                                            firstWord = false;
                                            word = "";
                                        } else {
                                            const wordAtWidth = meta.getWordAtWidth(word, maxWidth);
                                            lines[lineNumber] = wordAtWidth.containedWord;
                                            lineNumber++;
                                            currentLine = "";
                                            i -= wordAtWidth.excessLength;
                                            word = "";
                                            firstWord = true;
                                        }
                                    }
                                }
                            }
                        } else if (contents[i] === " ") {
                            if (word !== "") {
                                if (wordWrap === false) {
                                    if (!firstWord) {
                                        currentLine += word + " "; word = "";
                                        i++;
                                    } else { 
                                        currentLine = word + " ";
                                        firstWord = false;
                                        word = "";
                                        i++;
                                    }
                                } else {
                                    if (!firstWord) {
                                        if (measureText(currentLine + word) >= maxWidth) {
                                            lines[lineNumber] = currentLine;
                                            lineNumber++;
                                            currentLine = "";
                                            i -= word.length;
                                            word = "";
                                            firstWord = true;
                                        } else {
                                            currentLine += word + " "; word = "";
                                            i++;
                                        }
                                    } else { 
                                        if (measureText(word) < maxWidth) {
                                            currentLine = word + " ";
                                            firstWord = false;
                                            word = "";
                                            i++;
                                        } else {
                                            const wordAtWidth = meta.getWordAtWidth(word, maxWidth);
                                            lines[lineNumber] = wordAtWidth.containedWord;
                                            lineNumber++;
                                            currentLine = "";
                                            i -= wordAtWidth.excessLength;
                                            word = "";
                                            firstWord = true;
                                        }
                                    }
                                }
                            } else { 
                                currentLine += " ";
                                i++;
                                firstWord = false;
                            }
                        } else if (contents[i] === newLineCode) { 
                            if (word !== "") {
                                if (wordWrap === false) {
                                    if (!firstWord) {
                                        currentLine += word;
                                        word = "";
                                        lineBreaks.push(lineNumber);
                                        lines[lineNumber] = currentLine;
                                        lineNumber++;
                                        firstWord = true;
                                        currentLine = "";
                                        i++;
                                    } else { 
                                        currentLine = word;
                                        firstWord = false;
                                        word = "";
                                        lineBreaks.push(lineNumber);
                                        lines[lineNumber] = currentLine;
                                        lineNumber++;
                                        firstWord = true;
                                        currentLine = "";
                                        i++;
                                    }
                                } else {
                                    if (!firstWord) {
                                        if (measureText(currentLine + word) >= maxWidth) {
                                            lines[lineNumber] = currentLine;
                                            lineNumber++;
                                            currentLine = "";
                                            i -= word.length;
                                            word = "";
                                            firstWord = true;
                                        } else {
                                            currentLine += word;
                                            word = "";
                                            lineBreaks.push(lineNumber);
                                            lines[lineNumber] = currentLine;
                                            lineNumber++;
                                            firstWord = true;
                                            currentLine = "";
                                            i++;
                                        }
                                    } else { 
                                        if (measureText(word) < maxWidth) {
                                            currentLine = word;
                                            firstWord = false;
                                            word = "";
                                            lineBreaks.push(lineNumber);
                                            lines[lineNumber] = currentLine;
                                            lineNumber++;
                                            firstWord = true;
                                            currentLine = "";
                                            i++;
                                        } else {
                                            const wordAtWidth = meta.getWordAtWidth(word, maxWidth);
                                            lines[lineNumber] = wordAtWidth.containedWord;
                                            lineNumber++;
                                            currentLine = "";
                                            i -= wordAtWidth.excessLength;
                                            word = "";
                                            firstWord = true;
                                        }
                                    }
                                }
                            } else { 
                                lineBreaks.push(lineNumber);
                                lines[lineNumber] = currentLine;
                                lineNumber++;
                                firstWord = true;
                                currentLine = "";
                                i++;
                            }
                        }
                    }

                    lines[lineNumber] = currentLine;
                    currentLine = "";

                    ctx.restore();

                    meta.lines = lines;
                    meta.lineBreaks = lineBreaks;

                    meta.getAlignments();
                    meta.getContentDimensions();
                    meta.getCurrentLineAndCursorPosition();
                }
                meta.getAlignments = () => {
                    ctx.save();
                    ctx.font = __properties.fontFamily;
                    const textAlign = __private.__textAlign;

                    for (let i = 0; i < meta.lines.length; i++) {
                        if (textAlign === "right") {
                            const width = measureText(meta.lines[i]);
                            meta.linesAligned[i] = Math.max(0, __properties.innerWidth - width);
                        } else if (textAlign === "center") {
                            const width = measureText(meta.lines[i]);
                            meta.linesAligned[i] = Math.max(0, (__properties.innerWidth / 2) - (width / 2));
                        } else {
                            meta.linesAligned[i] = 0;
                        }
                    }
                    ctx.restore();
                }
                meta.getContentDimensions = () => {
                    ctx.save();
                    ctx.font = __properties.fontFamily;
                    let biggestWidth = 0;
                    const biggestHeight = (meta.lines.length - 1) * __private.__lineHeight + __private.__size;

                    for (let i = 0; i < meta.lines.length; i++) {
                        const width = measureText(meta.lines[i]);
                        if (width > biggestWidth) biggestWidth = width;
                    }

                    __properties.contentWidth = biggestWidth;
                    __properties.contentHeight = biggestHeight;
                    ctx.restore();
                }
                meta.getContentPositions = () => {
                    ctx.save();
                    ctx.font = __properties.fontFamily;

                    const { contentY, contentHeight, innerHeight } = __properties;
                    const cursorY = (meta.currentLine) * __private.__lineHeight;
                    const flatCursorY = cursorY + contentY;
                    const flatContentHeight = contentHeight + contentY;

                    let yDifference = 0;

                    if (__private.__size > innerHeight) {
                        yDifference = flatCursorY;
                    } else if (flatContentHeight < innerHeight && contentY < 0) {
                        yDifference = flatContentHeight - innerHeight;
                    } else if (innerHeight >= contentHeight && contentY !== 0) {
                        yDifference = contentY;
                    } else if (flatCursorY < 0) {
                        yDifference = flatCursorY;
                    } else if ((flatCursorY + __private.__size) > innerHeight) {
                        yDifference = (flatCursorY + __private.__size) - innerHeight;
                    }

                    if (yDifference !== 0) {
                        __properties.contentY -= yDifference;
                    }

                    if (__private.__type !== "dynamic" && __private.__focused) {
                        if (window.pageYOffset > meta.pageCursorY) {
                            window.scroll(window.pageXOffset, meta.pageCursorY);
                        } else if (window.pageYOffset + window.innerHeight < meta.pageCursorY + __private.__lineHeight) {
                            window.scroll(window.pageXOffset, meta.pageCursorY - window.innerHeight + __private.__lineHeight);
                        }

                        if (window.pageXOffset > meta.pageCursorX) {
                            window.scroll(meta.pageCursorX, window.pageYOffset);
                        } else if (window.pageXOffset + window.innerWidth < meta.pageCursorX + __private.__lineHeight) {
                            window.scroll(meta.pageCursorX - window.innerWidth + __private.__lineHeight, window.pageYOffset);
                        }
                    }


                    let xDifference = 0;
                    const { contentX, contentWidth, innerWidth } = __properties;
                    if (__private.__wrap === false) {
                        const txt = meta.lines[meta.currentLine].substr(0, meta.currentLineCursorPosition);

                        const cursorX = measureText(txt);
                        const flatCursorX = cursorX + contentX;
                        const flatContentWidth = contentWidth + contentX;


                        if (flatContentWidth < innerWidth && contentX < 0) {
                            xDifference = flatContentWidth - innerWidth;
                        } else if (innerWidth >= contentWidth && contentX !== 0) {
                            xDifference = contentX;
                        } else if (flatCursorX < 0) {
                            xDifference = flatCursorX;
                        } else if (flatCursorX > innerWidth) {
                            xDifference = flatCursorX - innerWidth;
                        }

                    } else {
                        if (contentX !== 0) xDifference = contentX;
                    }

                    if (xDifference !== 0) {
                        __properties.contentX -= xDifference;
                    }

                    ctx.restore();
                }
                meta.getNextCursorPosition = (arr, index = 0) => {
                    let foundNotVal = false;
                    const { cantGoThroughVals, goThroughVals } = meta;
                    if (cantGoThroughVals.includes(arr[index])) {
                        return index + 1;
                    } else
                        for (let i = index; i < arr.length; i++) {
                            if (!goThroughVals.includes(arr[i])) foundNotVal = true;
                            else if (goThroughVals.includes(arr[i]) && foundNotVal) {
                                return i;
                            }
                            if (cantGoThroughVals.includes(arr[i]) && i !== index) {
                                return i;
                            }
                        }
                    return arr.length;
                }
                meta.getPrevCursorPosition = (arr, index = 0) => {
                    let foundNotVal = false;
                    const { cantGoThroughVals, goThroughVals } = meta;
                    if (cantGoThroughVals.includes(arr[index - 1])) {
                        return index - 1;
                    } else
                        for (let i = index; i >= 0; i--) {
                            if (!goThroughVals.includes(arr[i - 1])) foundNotVal = true;
                            else if (goThroughVals.includes(arr[i - 1]) && foundNotVal) {
                                return i;
                            }
                            if (cantGoThroughVals.includes(arr[i - 1]) && i !== index) {
                                return i;
                            }
                        }
                    return 0;
                }
                meta.getSelectedArea = () => {
                    const { selectorCursorPosition1: sCP1, selectorCursorPosition2: sCP2 } = meta;
                    if (sCP1 === undefined || sCP2 === undefined) {
                        meta.minSelectionPosition = undefined;
                        meta.maxSelectionPosition = undefined;
                        return null;
                    }
                    meta.minSelectionPosition = Math.min(sCP1, sCP2);
                    meta.maxSelectionPosition = Math.max(sCP1, sCP2);
                }
                meta.getSelectedText = () => {
                    return meta.contents.join("").substring(meta.minSelectionPosition, meta.maxSelectionPosition);
                }
                meta.hasSelectedArea = () => {
                    const has = meta.minSelectionPosition !== undefined && meta.maxSelectionPosition !== undefined;
                    return has;
                }
                meta.resetSelectedArea = () => {
                    meta.selectorCursorPosition1 = undefined;
                    meta.selectorCursorPosition2 = undefined;
                    meta.minSelectionPosition = undefined;
                    meta.maxSelectionPosition = undefined;
                }
            }
            setupMeta();

            const navigation = {};
            if (__private.__type !== "dynamic") {
                function setupNavigation() {
                    navigation.unselect = () => {
                        __private.__focused = false;
                        meta.resetSelectedArea();
                    }
                    navigation.checkMouseAction = (shift, mouseEventType) => {
                        if (mouseEventType === "down" && !shift) {
                            meta.resetSelectedArea();
                        }

                        if (mouseEventType === "down") {
                            __private.__focused = __private.__hovered;
                        }

                        const { _x: mouseX, _y: mouseY } = _commandUtils.getRotatedMappedPoint({ _x: MouseModule._private_._stageX, _y: MouseModule._private_._stageY }, _returns_);

                        if (mouseEventType === "move") {
                            __private.__hovered = init.getParent()._hovered;
                        }

                        if (__private.__focused) {
                            if (mouseEventType === "down") {
                                meta.canSelectWithMouse = true; init.mouse.isDown = true;
                            }
                            if (init.mouse.isDown && meta.canSelectWithMouse) {
                                meta.getCursorPosition(mouseX - __properties.innerX - __properties.contentX, mouseY - __properties.innerY - __properties.contentY);

                                meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                                meta.getContentPositions();
                            }

                            if (mouseEventType === "down") {
                                if (meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;
                                else meta.selectorCursorPosition2 = meta.cursorPosition;
                                meta.getSelectedArea();
                            } else if ((mouseEventType === "up" || mouseEventType === "move") && meta.canSelectWithMouse && init.mouse.isDown) {
                                meta.selectorCursorPosition2 = meta.cursorPosition;
                                meta.getSelectedArea();
                            }
                            if (mouseEventType === "up") {
                                init.mouse.isDown = false;
                                if (meta.selectorCursorPosition1 === meta.selectorCursorPosition2) meta.resetSelectedArea();
                            }
                        }
                    }
                    navigation.checkKeyDown = (e) => {
                        e.preventDefault();
                        const key = e.key;
                        if (__private.__focused) {
                            meta.canSelectWithMouse = false;
                            const controlDown = init.keys.ctrl;
                            const shiftDown = init.keys.shft;
                            if (key === "Enter") {
                                navigation.placeNewLine();
                            } else if (key === "Home") {
                                navigation.goToLineStart(shiftDown);
                            } else if (key === "End") {
                                navigation.goToLineEnd(shiftDown);
                            } else if (key === "PageUp") {
                                navigation.goUpByHeight(shiftDown);
                            } else if (key === "PageDown") {
                                navigation.goDownByHeight(shiftDown);
                            } else if (key === "Backspace") {
                                if (!controlDown)
                                    navigation.deleteBackwards();
                                else
                                    navigation.deleteBackwardsWithControl();
                            } else if (key === "Delete") {
                                if (!controlDown)
                                    navigation.deleteForwards();
                                else
                                    navigation.deleteForwardsWithControl();
                            } else if (key === "ArrowLeft") {
                                if (!controlDown)
                                    navigation.navigateLeft(shiftDown);
                                else
                                    navigation.navigateLeftWithControl(shiftDown);
                            } else if (key === "ArrowRight") {
                                if (!controlDown)
                                    navigation.navigateRight(shiftDown);
                                else
                                    navigation.navigateRightWithControl(shiftDown);
                            } else if (key === "ArrowUp") {
                                navigation.navigateUp(shiftDown);
                            } else if (key === "ArrowDown") {
                                navigation.navigateDown(shiftDown);
                            } else if (key === "Escape") {
                                navigation.cancelSelecton();
                            } else if (key === "Control") {
                                init.keys.ctrl = true;
                            } else if (key === "Shift") {
                                init.keys.shft = true;
                            } else {
                                if (!controlDown)
                                    navigation.placeLetter(key);
                                else
                                    navigation.checkCommand(key);
                            }
                        }
                    }
                    navigation.checkKeyUp = (e) => {
                        e.preventDefault();
                        const key = e.key;
                        if (__private.__focused) {
                            if (key === "Control") {
                                init.keys.ctrl = false;
                            } else if (key === "Shift") {
                                init.keys.shft = false;
                            }
                        }
                    }
                    navigation.cancelSelecton = () => {
                        if (meta.hasSelectedArea()) {
                            meta.resetSelectedArea();
                        }
                    }
                    navigation.goDownByHeight = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.resetSelectedArea();
                        }
                        if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;

                        if (meta.currentLine === meta.lines.length - 1) return;
                        const theY = (meta.currentLine * __private.__lineHeight) + __properties.innerHeight;
                        meta.getCursorPosition(meta.currentLineCursorPixels, theY);

                        if (shift) {
                            meta.selectorCursorPosition2 = meta.cursorPosition;
                            meta.getSelectedArea();
                        }

                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.goUpByHeight = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.resetSelectedArea();
                        }
                        if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;

                        if (meta.currentLine === 0) return;
                        const theY = (meta.currentLine * __private.__lineHeight) - __properties.innerHeight;
                        meta.getCursorPosition(meta.currentLineCursorPixels, theY);

                        if (shift) {
                            meta.selectorCursorPosition2 = meta.cursorPosition;
                            meta.getSelectedArea();
                        }

                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.goToLineStart = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.resetSelectedArea();
                        }
                        if (meta.currentLineCursorPosition === meta.lines[meta.currentLine].length && meta.currentLine < meta.lines.length - 1 && !meta.lineBreaks.includes(meta.currentLine)) return;

                        if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;

                        const theY = (meta.currentLine * __private.__lineHeight);
                        meta.getCursorPosition(0, theY);

                        if (shift) {
                            meta.selectorCursorPosition2 = meta.cursorPosition;
                            meta.getSelectedArea();
                        }

                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.goToLineEnd = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.resetSelectedArea();
                        }

                        if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;

                        ctx.save();
                        ctx.font = __properties.fontFamily;
                        let theX, theY;
                        if (meta.lineBreaks.includes(meta.currentLine) || meta.currentLine === meta.lines.length - 1) {
                            theX = measureText(meta.lines[meta.currentLine]);
                            theY = (meta.currentLine * __private.__lineHeight);
                        } else if (meta.currentLineCursorPosition === meta.lines[meta.currentLine].length) {
                            const newCurrentLine = meta.currentLine + 1;
                            if (meta.lineBreaks.includes(newCurrentLine) || newCurrentLine === meta.lines.length - 1) {
                                theX = measureText(meta.lines[newCurrentLine]);
                                theY = (newCurrentLine * __private.__lineHeight);
                            } else {
                                const txt = meta.lines[newCurrentLine];
                                theX = measureText(txt.substr(0, txt.length - 1));
                                theY = (newCurrentLine * __private.__lineHeight);
                            }
                        } else {
                            const txt = meta.lines[meta.currentLine];
                            theX = measureText(txt.substr(0, txt.length - 1));
                            theY = ((meta.currentLine) * __private.__lineHeight);
                        }
                        ctx.restore();
                        meta.getCursorPosition(theX, theY);

                        if (shift) {
                            meta.selectorCursorPosition2 = meta.cursorPosition;
                            meta.getSelectedArea();
                        }

                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.deleteForwards = () => {
                        if (!meta.hasSelectedArea()) {
                            if (meta.cursorPosition < meta.contents.length) {
                                meta.contents.splice(meta.cursorPosition, 1);
                                meta.getLinesFromContent();
                            }
                        } else {
                            const amount = meta.getSelectedText().length;

                            meta.contents.splice(meta.minSelectionPosition, amount);
                            meta.getLinesFromContent();

                            meta.cursorPosition = meta.minSelectionPosition;

                            meta.resetSelectedArea();
                            meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        }
                        meta.getContentPositions();
                    }
                    navigation.deleteForwardsWithControl = () => {
                        if (!meta.hasSelectedArea()) {
                            if (meta.cursorPosition < meta.contents.length) {
                                const amountToRemove = meta.getNextCursorPosition(meta.contents, meta.cursorPosition) - meta.cursorPosition;
                                meta.contents.splice(meta.cursorPosition, amountToRemove);
                                meta.getLinesFromContent();
                            }
                        } else {
                            const amount = meta.getSelectedText().length;

                            meta.contents.splice(meta.minSelectionPosition, amount);
                            meta.getLinesFromContent();

                            meta.cursorPosition = meta.minSelectionPosition;

                            meta.resetSelectedArea();
                            meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        }
                        meta.getContentPositions();
                    }
                    navigation.deleteBackwards = () => {
                        if (!meta.hasSelectedArea()) {
                            if (meta.cursorPosition > 0) {
                                meta.cursorPosition--;
                                meta.contents.splice(meta.cursorPosition, 1);
                                meta.getLinesFromContent();
                            }
                        } else {
                            const amount = meta.getSelectedText().length;

                            meta.contents.splice(meta.minSelectionPosition, amount);
                            meta.getLinesFromContent();

                            meta.cursorPosition = meta.minSelectionPosition;

                            meta.resetSelectedArea();
                        }
                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.deleteBackwardsWithControl = () => {
                        if (!meta.hasSelectedArea()) {
                            if (meta.cursorPosition > 0) {
                                const newCursorPosition = meta.getPrevCursorPosition(meta.contents, meta.cursorPosition);
                                const amountToRemove = meta.cursorPosition - newCursorPosition;
                                meta.cursorPosition = newCursorPosition;
                                meta.contents.splice(meta.cursorPosition, amountToRemove);
                                meta.getLinesFromContent();
                            }
                        } else {
                            const amount = meta.getSelectedText().length;

                            meta.contents.splice(meta.minSelectionPosition, amount);
                            meta.getLinesFromContent();

                            meta.cursorPosition = meta.minSelectionPosition;

                            meta.resetSelectedArea();
                        }
                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.navigateLeft = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.cursorPosition = meta.minSelectionPosition;
                            meta.resetSelectedArea()
                        } else
                            if (meta.cursorPosition > 0) {
                                if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;
                                meta.cursorPosition--;
                                if (shift) {
                                    meta.selectorCursorPosition2 = meta.cursorPosition;
                                    meta.getSelectedArea();
                                }
                            }
                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.navigateLeftWithControl = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.cursorPosition = meta.maxSelectionPosition;
                            meta.resetSelectedArea();
                        } else
                            if (meta.cursorPosition > 0) {
                                if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;
                                meta.cursorPosition = meta.getPrevCursorPosition(meta.contents, meta.cursorPosition);
                                if (shift) {
                                    meta.selectorCursorPosition2 = meta.cursorPosition;
                                    meta.getSelectedArea();
                                }
                            }
                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.navigateRight = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.cursorPosition = meta.maxSelectionPosition;
                            meta.resetSelectedArea();
                        } else
                            if (meta.cursorPosition < meta.contents.length) {
                                if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;
                                meta.cursorPosition++;
                                if (shift) {
                                    meta.selectorCursorPosition2 = meta.cursorPosition;
                                    meta.getSelectedArea();
                                }

                            }
                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.navigateRightWithControl = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.cursorPosition = meta.maxSelectionPosition;
                            meta.resetSelectedArea();
                        } else
                            if (meta.cursorPosition < meta.contents.length) {
                                if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;
                                meta.cursorPosition = meta.getNextCursorPosition(meta.contents, meta.cursorPosition);
                                if (shift) {
                                    meta.selectorCursorPosition2 = meta.cursorPosition;
                                    meta.getSelectedArea();
                                }
                            }
                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.navigateUp = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.cursorPosition = meta.minSelectionPosition;
                            meta.resetSelectedArea();
                        }
                        if (meta.cursorPosition > 0) {
                            if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;

                            let line;
                            if (meta.currentLineCursorPosition === meta.lines[meta.currentLine].length && meta.currentLine < meta.lines.length - 1 && !meta.lineBreaks.includes(meta.currentLine)) {
                                line = meta.currentLine;
                                meta.intendedCursorPixels = 0;
                            } else
                                line = meta.currentLine - 1;
                            const newLineY = (line * __private.__lineHeight);
                            meta.getCursorPosition(meta.intendedCursorPixels, newLineY);

                            if (shift) {
                                meta.selectorCursorPosition2 = meta.cursorPosition;
                                meta.getSelectedArea();
                            }
                        }
                        meta.getContentPositions();
                    }
                    navigation.navigateDown = (shift) => {
                        if (!shift && meta.hasSelectedArea()) {
                            meta.cursorPosition = meta.maxSelectionPosition;
                            meta.resetSelectedArea();
                        }
                        if (meta.cursorPosition < meta.contents.length) {
                            if (shift && meta.selectorCursorPosition1 === undefined) meta.selectorCursorPosition1 = meta.cursorPosition;

                            let line;
                            if (meta.currentLineCursorPosition === meta.lines[meta.currentLine].length && meta.currentLine < meta.lines.length - 1 && !meta.lineBreaks.includes(meta.currentLine)) {
                                line = meta.currentLine + 2;
                                meta.intendedCursorPixels = 0;
                            } else
                                line = meta.currentLine + 1;
                            const newLineY = (line * __private.__lineHeight);
                            meta.getCursorPosition(meta.intendedCursorPixels, newLineY);

                            if (shift) {
                                meta.selectorCursorPosition2 = meta.cursorPosition;
                                meta.getSelectedArea();
                            }
                        }
                        meta.getContentPositions();
                    }
                    navigation.placeLetter = (char) => {
                        if (char.length > 1) return;

                        if (!meta.hasSelectedArea()) {
                            meta.contents.splice(meta.cursorPosition, 0, char);
                            meta.getLinesFromContent();
                            meta.cursorPosition++;
                        } else {
                            const amount = meta.getSelectedText().length;

                            meta.contents.splice(meta.minSelectionPosition, amount, char);
                            meta.getLinesFromContent();

                            meta.cursorPosition = meta.minSelectionPosition + 1;

                            meta.resetSelectedArea();
                        }

                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.placeString = (string) => {
                        if (!meta.hasSelectedArea()) {
                            meta.contents.splice(meta.cursorPosition, 0, ...string);
                            meta.getLinesFromContent();
                            meta.cursorPosition += string.length;
                        } else {
                            const amount = meta.getSelectedText().length;

                            meta.contents.splice(meta.minSelectionPosition, amount, ...string);
                            meta.getLinesFromContent();

                            meta.cursorPosition = meta.minSelectionPosition + string.length;

                            meta.resetSelectedArea();
                        }

                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.placeNewLine = () => {
                        if (init.multiline === false) return;

                        if (!meta.hasSelectedArea()) {
                            meta.contents.splice(meta.cursorPosition, 0, meta.newLineCode);
                            meta.getLinesFromContent();
                            meta.cursorPosition++;
                        } else {
                            const amount = meta.getSelectedText().length;

                            meta.contents.splice(meta.minSelectionPosition, amount, meta.newLineCode);
                            meta.getLinesFromContent();

                            meta.cursorPosition = meta.minSelectionPosition + 1;

                            meta.resetSelectedArea();
                        }

                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    navigation.checkCommand = (char) => {
                        if (char.length > 1) return;
                        switch (char.toLowerCase()) {
                            case "x":
                                navigation.cutSelectedArea();
                                break;
                            case "c":
                                navigation.copySelectedArea();
                                break;
                            case "v":
                                navigation.pasteSelectedArea();
                                break;
                            case "a":
                                navigation.selectAllContent();
                                break;
                        }
                    }
                    navigation.cutSelectedArea = () => {
                        if (!meta.hasSelectedArea()) return;
                        const text = meta.getSelectedText();
                        setClipboardString(text);
                        setCustomClipboard(text);
                        navigation.deleteBackwards();
                    }
                    navigation.copySelectedArea = () => {
                        if (!meta.hasSelectedArea()) return;
                        const text = meta.getSelectedText();
                        setClipboardString(text);
                        setCustomClipboard(text);
                    }
                    navigation.pasteSelectedArea = () => {
                        const text = getCustomClipboard();
                        if (text !== "") navigation.placeString(text);
                    }
                    navigation.selectAllContent = () => {
                        meta.selectorCursorPosition1 = 0;
                        meta.selectorCursorPosition2 = meta.contents.length;
                        meta.getSelectedArea();
                        meta.cursorPosition = meta.contents.length;
                        meta.intendedCursorPixels = meta.getWidthAtIndex(meta.lines[meta.currentLine], meta.currentLineCursorPosition) + meta.linesAligned[meta.currentLine];
                        meta.getContentPositions();
                    }
                    function setClipboardString(str) {
                        const [prevScrollX, prevScrollY] = [window.pageXOffset, window.pageYOffset];
                        const el = document.createElement('textarea');
                        el.value = str;
                        el.setAttribute('readonly', '');
                        el.style = { position: 'absolute', left: '-9999px' };
                        document.body.appendChild(el);
                        el.select();
                        document.execCommand('copy');
                        document.body.removeChild(el);
                        div.focus();
                        window.scroll(prevScrollX, prevScrollY);
                    }
                    function setCustomClipboard(str) {
                        MetaModule.clipboard = str;
                    }
                    function getCustomClipboard() {
                        return MetaModule.clipboard;
                    }
                }
                setupNavigation();
            }

            const accessibleMeta = {};
            function setupAccessibleMeta() {
                accessibleMeta.getText = () => {
                    return meta.contents.join("");
                }
                accessibleMeta.clearText = (getLines) => {
                    meta.contents.length = 0;
                    if (getLines !== false) meta.getLinesFromContent();
                    meta.getContentPositions();
                }
                accessibleMeta.appendText = (val, getLines) => {
                    meta.contents.push(...val.split(""));
                    if (getLines !== false) meta.getLinesFromContent();
                    meta.getContentPositions();
                }
                accessibleMeta.prependText = (val, getLines) => {
                    meta.contents.unshift(...val.split(""));
                    if (getLines !== false) meta.getLinesFromContent();
                    meta.getContentPositions();
                }
                accessibleMeta.removeTextLinesFromTop = (num, getLines) => {
                    for (let i = 0; i < num; i++) {
                        const indexOfNL = meta.contents.indexOf(meta.newLineCode);
                        if (indexOfNL === -1)
                            accessibleMeta.clearText();
                        else
                            meta.contents.splice(0, indexOfNL + 1);
                    }
                    if (getLines !== false) meta.getLinesFromContent();
                    meta.getContentPositions();
                }
                accessibleMeta.removeTextLinesFromBottom = (num, getLines) => {
                    for (let i = 0; i < num; i++) {
                        const indexOfNL = meta.contents.lastIndexOf(meta.newLineCode);
                        if (indexOfNL === -1)
                            accessibleMeta.clearText();
                        else
                            meta.contents.splice(indexOfNL);
                    }
                    if (getLines !== false) meta.getLinesFromContent();
                    meta.getContentPositions();
                }
            }
            setupAccessibleMeta();

            const accessibles = {};
            function setupAccessibles() {
                accessibles.getText = () => {
                    return accessibleMeta.getText();
                }
                accessibles.setText = (val) => {
                    if (typeof val !== "string") return;
                    accessibleMeta.clearText(false);
                    accessibleMeta.appendText(val);
                }
                accessibles.clearText = () => {
                    accessibleMeta.clearText();
                }
                accessibles.addText = (val) => {
                    if (typeof val !== "string") return;
                    accessibleMeta.appendText(val);
                }
                accessibles.addTextLn = (val) => {
                    if (typeof val !== "string") return;
                    accessibleMeta.appendText(val + "\n");
                }
                accessibles.removeTextLn = (num = 1) => {
                    if (typeof num !== "number") return;

                    if (num < 0) {
                        accessibleMeta.removeTextLinesFromBottom(Math.abs(num));
                    } else if (num > 0) {
                        accessibleMeta.removeTextLinesFromTop(num);
                    }
                }
            }
            setupAccessibles();

            const renders = {}
            function setupRenders() {
                renders.drawText = (str, ...args) => {
                    if (__private.__type === "password") str = str.replace(/[\s\S]/g, "*");
                    ctx.fillText(str, ...args);
                }

                renders.renderText = () => {
                    if (__private.__type !== "dynamic") {
                        if (meta.hasSelectedArea())
                            renders.renderTextSelected();
                        else
                            renders.renderTextPlain();
                    } else
                        renders.renderTextPlain();
                }
                renders.renderTextPlain = () => {
                    ctx.save();
                    ctx.font = __properties.fontFamily;
                    if (__private.__fontColor === "none") return;
                    ctx.fillStyle = __private.__fontColor;

                    const minVisibleY = Math.max(0, Math.floor((Math.abs(__properties.__contentY) - __private.__lineHeight) / __private.__lineHeight));
                    const maxVisibleY = Math.min(meta.lines.length, Math.floor((Math.abs(__properties.__contentY) + (__private.__lineHeight * 2) + __properties.innerHeight) / __private.__lineHeight));

                    for (let line = minVisibleY; line < maxVisibleY; line++) {
                        const chars = meta.lines[line];
                        const defaultAlignedOffset = meta.linesAligned[line];

                        const charX = __properties.innerX + __properties.contentX + defaultAlignedOffset;
                        renders.drawText(chars, charX, __properties.innerY + __properties.contentY + line * __private.__lineHeight);
                    }
                    ctx.restore();
                }
                if (__private.__type !== "dynamic") {
                    renders.renderTextSelected = () => {
                        ctx.save();
                        ctx.font = __properties.fontFamily;
                        ctx.fillStyle = "black";

                        const minVisibleY = Math.max(0, Math.floor((Math.abs(__properties.__contentY) - __private.__lineHeight) / __private.__lineHeight));
                        const maxVisibleY = Math.min(meta.lines.length, Math.floor((Math.abs(__properties.__contentY) + (__private.__lineHeight * 2) + __properties.innerHeight) / __private.__lineHeight));

                        let ind = 0;
                        for (let i = 0; i < minVisibleY; i++) {
                            ind += meta.lines[i].length;
                            if (meta.lineBreaks.includes(i)) ind++;
                        }
                        let foundMin;
                        for (let line = minVisibleY; line < maxVisibleY; line++) {
                            const chars = meta.lines[line];
                            const l = chars.length;
                            let wbw = false;
                            const defaultAlignedOffset = meta.linesAligned[line];

                            if (foundMin === undefined && ind + l >= meta.minSelectionPosition) { 
                                wbw = true;
                                foundMin = true;
                            }
                            if (foundMin && ind + l >= meta.maxSelectionPosition) { 
                                wbw = true;
                                foundMin = false;
                            }
                            if (foundMin) wbw = true;

                            const charX = __properties.innerX + __properties.contentX + defaultAlignedOffset;

                            if (!wbw) {
                                if (__private.__fontColor !== "none") {
                                    ctx.fillStyle = __private.__fontColor;
                                    renders.drawText(chars, charX, __properties.innerY + __properties.contentY + line * __private.__lineHeight);
                                }
                                ind += l;
                            } else {
                                ctx.save();
                                let x = charX;
                                const y = __properties.innerY + __properties.contentY + line * __private.__lineHeight;
                                let w = 0;
                                const h = __private.__lineHeight;
                                const txt = chars;
                                for (const i of txt) {
                                    w = measureText(i);

                                    if (ind >= meta.minSelectionPosition && ind < meta.maxSelectionPosition) {
                                        ctx.fillStyle = "blue";
                                        ctx.fillRect(Math.ceil(x), y, Math.ceil(w), h);

                                        ctx.fillStyle = "white";
                                        renders.drawText(i, x, y);
                                    } else {
                                        if (__private.__fontColor !== "none") {
                                            ctx.fillStyle = __private.__fontColor;
                                            renders.drawText(i, x, y);
                                        }
                                    }
                                    x += w;

                                    ind++;
                                }
                                ctx.restore();
                            }
                            if (meta.lineBreaks.includes(line)) ind++;
                        }

                        ctx.restore();
                    }
                    renders.renderCursor = () => {
                        if (__private.__focused) {
                            const defaultCursorX = Math.max(Math.round(__properties.innerX + 1), Math.min(Math.round(__properties.innerX + meta.currentLineCursorPixels + __properties.contentX), Math.round(__properties.innerX + __properties.innerWidth - 1)));
                            const defaultCursorY = __properties.innerY + __properties.contentY + meta.currentLine * __private.__lineHeight;
                            ctx.fillStyle = "purple";
                            if (meta.currentLineCursorPosition === meta.lines[meta.currentLine].length && meta.currentLine < meta.lines.length - 1 && !meta.lineBreaks.includes(meta.currentLine)) {
                                ctx.fillRect(Math.round(__properties.innerX + __properties.contentX + meta.linesAligned[meta.currentLine + 1]), __properties.innerY + __properties.contentY + (meta.currentLine + 1) * __private.__lineHeight, 1, __private.__size);

                                ctx.fillRect(defaultCursorX, defaultCursorY + __private.__size * 1 / 7, 1, __private.__size / 7);
                                ctx.fillRect(defaultCursorX, defaultCursorY + __private.__size * 3 / 7, 1, __private.__size / 7);
                                ctx.fillRect(defaultCursorX, defaultCursorY + __private.__size * 5 / 7, 1, __private.__size / 7);
                            } else {
                                ctx.fillRect(defaultCursorX, defaultCursorY, 1, __private.__size);
                            }
                        }
                    }
                }
                renders.renderBorder = () => {
                    ctx.lineWidth = 1;
                    if (__private.__focused) {
                        ctx.strokeStyle = "blue";
                        ctx.strokeRect(__private.__x - 1 + 0.50, __private.__y - 1 + 0.50, __private.__width + 2, __private.__height + 2);
                    }

                    if (__private.__borderColor === "none") return;
                    ctx.strokeStyle = __private.__borderColor;
                    ctx.strokeRect(Math.round(__private.__x) + 0.50, Math.round(__private.__y) + 0.50, Math.round(__private.__width), Math.round(__private.__height));
                }
                renders.renderBackground = () => {
                    if (__private.__backgroundColor === "none") return;
                    ctx.fillStyle = __private.__backgroundColor;
                    ctx.fillRect(__private.__x, __private.__y, __private.__width, __private.__height);
                }
                renders.clip = () => {
                    ctx.beginPath();
                    ctx.rect(__properties.innerX, __properties.innerY, __properties.innerWidth, __properties.innerHeight);
                    ctx.closePath();
                    ctx.clip();
                }
            }
            setupRenders();
            const tick = () => {
                if (__private.__hovered) MouseModule._private_._setCursorType("text");
            }
            const render = (_x, _y, _width, _height) => {
                ctx.save();
                ctx.textBaseline = "top";
                renders.renderBackground();
                renders.renderBorder();

                renders.clip();
                renders.renderText();

                if (__private.__type !== "dynamic")
                    renders.renderCursor();

                ctx.restore();
            }

            const _private_ = {
                _render: render,
                _tick: tick
            }

            const _returns_ = {
                ...accessibles, ...defs
            }

            init.initialize();

            return {
                props: _returns_,
                _privateProps: _private_
            };
        }
        const _Textfield = function (_props, _inits, _funcs) {
            const state = {};
            const { props, _privateProps } = __Textfield(_props, () => _thisObj);
            let isLoaded = false;

            let __rotation = 0, __anchorX = 0, __anchorY = 0;
            Object.defineProperties(props, {
                _rotation: {
                    get() { return __rotation },
                    set(_val) {
                        if (typeof _val === "string" && /^\d+%$/.test(_val)) {
                            __rotation = (parseInt(_val) / 100 * 360);
                        } else
                            __rotation = parseInt(_val);
                        if (!numberUtils.inRange(__rotation, -179, 180))
                            __rotation = numberUtils.wheelClamp(__rotation, -180, 180);
                    },
                    enumerable: true,
                    configurable: false
                },
                _anchorX: {
                    get() { return __anchorX },
                    set(_val) {
                        __anchorX = numberUtils.lock(parseInt(_val), 0, 100);
                    },
                    enumerable: true,
                    configurable: false
                },
                _anchorY: {
                    get() { return __anchorY },
                    set(_val) {
                        __anchorY = numberUtils.lock(parseInt(_val), 0, 100);
                    },
                    enumerable: true,
                    configurable: false
                }
            });

            const inits = [];
            const finis = [];
            const _heirarchy = {
                scripts: []
            }

            const _getBounds = function () {
                const { _x, _y, _width, _height, _rotation, _anchorX: ax, _anchorY: ay } = props;
                const offsetX = (ax / 100 * _width);
                const offsetY = (ay / 100 * _height);
                const fx = -offsetX, fy = -offsetY;
                const fw = _width - offsetX, fh = _height - offsetY;

                let topLeftRP;
                let bottomLeftRP;
                let topRightRP;
                let bottomRightRP;

                if (_rotation === 0) {
                    topLeftRP = numberUtils.newPoint(fx, fy);
                    bottomLeftRP = numberUtils.newPoint(fx, fh);
                    topRightRP = numberUtils.newPoint(fw, fy);
                    bottomRightRP = numberUtils.newPoint(fw, fh);
                } else {
                    topLeftRP = numberUtils.rotatePoint(fx, fy, _rotation);
                    bottomLeftRP = numberUtils.rotatePoint(fx, fh, _rotation);
                    topRightRP = numberUtils.rotatePoint(fw, fy, _rotation);
                    bottomRightRP = numberUtils.rotatePoint(fw, fh, _rotation);
                }

                const minX = numberUtils.minMax("_x", "min", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);
                const minY = numberUtils.minMax("_y", "min", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);
                const maxX = numberUtils.minMax("_x", "max", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);
                const maxY = numberUtils.minMax("_y", "max", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);

                return {
                    _x: minX + _x, _y: minY + _y, _width: maxX - minX, _height: maxY - minY
                }
            }


            const _fillState = (_newState) => {
                if (!helperUtils.isObject(_newState)) return;
                for (const _name of Object.keys(_newState)) {
                    if (state[_name] !== _newState[_name])
                        state[_name] = _newState[_name];
                }
            }
            const _clearState = () => {
                for (const _name of Object.keys(state)) {
                    delete state[_name];
                }
            }
            const changeState = (_name, _value) => {
                const functionLineNumber = DebugModule.getLineNumber(2);
                try {
                    DebugModule.typeCheck(changeState, "state's name", _name, String);
                    const _newState = {};
                    _newState[_name] = _value;

                    _fillState(_newState);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Textfield", from: "textfield.changeState", error: bubbledError, src: functionLineNumber });
                }
            }
            const useState = (_state) => { 
                try {
                    DebugModule.typeCheck(useState, "state", _state, Object, Function, _constructors.Script);
                    if (helperUtils.isObject(_state)) {
                        const _newState = _state;

                        _clearState();
                        _fillState(_newState);
                    } else if (_commandUtils.isScription(_state)) {
                        const prevState = objectUtils.deepCloneObject(state);
                        const _newState = _commandUtils.getScription(_state)(prevState);

                        _clearState();
                        _fillState(_newState);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Textfield", from: "textfield.useState", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }
            const setState = (_state) => { 
                try {
                    DebugModule.typeCheck(setState, "state", _state, Object, Function, _constructors.Script);
                    if (helperUtils.isObject(_state)) {
                        const _newState = _state;

                        _fillState(_newState);
                    } else if (_commandUtils.isScription(_state)) {
                        const prevState = objectUtils.deepCloneObject(state);
                        const _newState = _commandUtils.getScription(_state)(prevState);

                        _fillState(_newState);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Textfield", from: "textfield.setState", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }

            const localToGlobal = (_point, _relative = false) => {
                if (_relative === true) {
                    const _reRotatedPoint = numberUtils.rotatePoint(_point.x, _point.y, props._rotation);
                    _point.x = _reRotatedPoint._x + props._x;
                    _point.y = _reRotatedPoint._y + props._y;
                } else {
                    _point.x += props._x;
                    _point.y += props._y;
                }
            }

            const globalToLocal = (_point, _relative = false) => {
                if (_relative === true) {
                    const rotatedPoint = numberUtils.rotatePoint(_point.x - props._x, _point.y - props._y, -props._rotation);
                    _point.x = rotatedPoint._x;
                    _point.y = rotatedPoint._y;
                } else {
                    _point.x -= props._x;
                    _point.y -= props._y;
                }
            }

            const swapDepths = (_depth) => {
                if (_funcs && _funcs.swapDepths) {
                    DebugModule.typeCheck(swapDepths, "depth", _depth, Number);
                    _funcs.swapDepths(_depth);
                }
            }

            const hitTest = (..._args) => {
                try {
                    if (helperUtils.isNull(_args[0])) return false;
                    if (helperUtils.isNumber(_args[0])) {
                        return hitTestPoint(..._args);
                    } else {
                        return hitTestFlevaClip(..._args);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Textfield", from: "textfield.hittest", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }



            const hitTestPoint = (_x, _y, _shapeFlag = false) => {
                DebugModule.typeCheck(hitTestPoint, "_x coordinate", _x, Number);
                DebugModule.typeCheck(hitTestPoint, "_y coordinate", _y, Number);
                DebugModule.typeCheck(hitTestPoint, "_shapeFlag", _shapeFlag, Boolean);

                const sourceProps = props;
                if (!sourceProps._visible) return false;

                const targetPoint = { _x, _y };

                if (!_shapeFlag) {
                    const sourceBounds = _getBounds();
                    return _commandUtils.boxHitTestPoint(sourceBounds, targetPoint);
                } else {
                    const rotatedPoint = _commandUtils.getRotatedMappedPoint(targetPoint, props);
                    return _commandUtils.boxHitTestPoint(sourceProps, rotatedPoint);
                }
            }

            const hitTestFlevaClip = (_target) => {
                let flevaclip;
                if (helperUtils.isFlevaClip(_target))
                    flevaclip = _target;
                else if (helperUtils.isString(_target))
                    flevaclip = _getFlevaClipByInstanceName(_target);
                else throw `Invalid target argument! FlevaClip reference or string expected.`;
                if (!flevaclip) throw `FlevaClip with instance name ${_target} not found.`;

                const sourceProps = props;
                const targetProps = flevaclip._private_._getProps();
                if (!sourceProps._visible || !targetProps._visible) return false;

                const sourceBounds = _getBounds();
                const targetBounds = flevaclip._private_._getBounds();

                return _commandUtils.boxHitTest(sourceBounds, targetBounds);
            }

            const thisScope = {};
            const addScript = (_script) => {
                try {
                    DebugModule.typeCheck(addScript, "script", _script, String, Function, _constructors.Script);
                    let script;
                    if (helperUtils.isString(_script)) {
                        const _newScript = getScriptFromLibrary(_script);
                        script = _Script(_newScript);
                    } else if (_commandUtils.isScription(_script)) {
                        const _newScript = _commandUtils.getScription(_script);
                        script = _Script(_newScript);
                    }
                    const flevaScript = _commandUtils.createFlevaScript(script, thisScope, _thisObj);
                    _heirarchy.scripts.push(flevaScript);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Textfield", from: "textfield.addScript", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }

            const load = async () => {
                if (isLoaded) return;

                if (inits.length > 0)
                    for (const init of Object.keys(inits)) {
                        const _init = inits[init];
                        try {
                            const fini = await _init.bind(_thisObj)(_thisObj);
                            if (_commandUtils.isScription(fini)) {
                                const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(fini), thisScope, _thisObj);
                                finis.push(flevaScript);
                                finis[finis.length - 1].FLN = _init.FLN;
                            }
                        } catch (bubbledError) {
                            DebugModule.bubbleError({ type: "Textfield", from: "textfield.onload", error: bubbledError, src: _init.FLN || _init });
                        }
                    }

                if (_privateProps._load) _privateProps._load();
                isLoaded = true;
            }
            const unload = async () => {
                if (!isLoaded) return;

                if (finis.length > 0) {
                    for (const fini of Object.keys(finis)) {
                        const _fini = finis[fini];
                        try {
                            await _fini.bind(_thisObj)(_thisObj);
                        } catch (bubbledError) {
                            DebugModule.bubbleError({ type: "Textfield", from: "textfield.onunload", error: bubbledError, src: _fini.FLN || _fini });
                        }
                    }
                    finis.length = 0;
                }

                _heirarchy.scripts.length = 0;
                if (_privateProps._unload) _privateProps._unload();
                isLoaded = false;
            }

            const tick = async () => {
                for (const _name of Object.keys(_heirarchy.scripts)) {
                    const _script = _heirarchy.scripts[_name];
                    try {
                        await _script.bind(_thisObj)(_thisObj);
                    } catch (bubbledError) {
                        DebugModule.bubbleError({ type: "Textfield", from: "textfield's script", error: bubbledError, src: _script.FLN || _script });
                    }
                }
                _privateProps._tick();
            }
            const render = () => {
                _screen.renderFlevaClip({ ...props, _bounds: _getBounds() }, _privateProps._render);
                _screen.renderFlevaClipBounds({ ...props, _bounds: _getBounds() });
            }
            const start = () => { }
            const stop = () => { }

            const isMouseInFlevaClip = () => {
                const { _stageX: _x, _stageY: _y } = MouseModule._private_;
                if (!helperUtils.isNumber(_x) || !helperUtils.isNumber(_y)) return false;
                return hitTestPoint(_x, _y, true);
            }

            const _private_ = {
                _overrideProps: (_props) => {
                    if (!helperUtils.isObject(_props)) return;
                    for (const _prop of Object.keys(_props))
                        if (helperUtils.isDefined(props[_prop])) props[_prop] = _props[_prop];
                },
                _getInits: () => inits,
                _getRawInits: () => _inits,
                _getType: () => helperUtils.typeOf(_thisObj),
                _getProps: () => ({ ...props }),
                _getRawProps: () => ({ ..._props }),
                _getBounds,
                _isMouseInFlevaClip: isMouseInFlevaClip,
                _hasOnPress: () => _thisObj.onClick !== _defaults.emptyFunc && _commandUtils.isScription(_thisObj.onClick),
                _start: start, _stop: stop,
                _load: load, _unload: unload,
                _tick: tick, _render: render,
            }
            if (_privateProps._setSelection) _private_._setSelection = _privateProps._setSelection;


            const _returns_ = new _constructors.Textfield({
                state,
                hitTest,
                changeState,
                useState,
                setState,
                addScript,
                localToGlobal,
                globalToLocal,
                swapDepths
            });

            let onClickFunc = _defaults.emptyFunc;

            Object.defineProperties(_returns_, {
                _private_: {
                    get() { return _private_; },
                    enumerable: false,
                    configurable: false
                },
                _hovered: {
                    get() { return MouseModule._private_._getMouseHoverTarget() === _thisObj; },
                    enumerable: true,
                    configurable: false
                },
                onClick: {
                    get() { return onClickFunc; },
                    set(func) {
                        onClickFunc = _commandUtils.createFlevaScript(_commandUtils.getScription(func), thisScope, _thisObj);
                        if (!onClickFunc.FLN) onClickFunc.FLN = DebugModule.getLineNumber(2);
                    }
                }
            });
            for (let prop of Object.keys(props)) {
                Object.defineProperty(_returns_, prop, {
                    get() { return props[prop] },
                    set() {
                        const args = Array.prototype.slice.call(arguments); props[prop] = args[0];
                    },
                    enumerable: true,
                    configurable: false
                });
            }

            const _thisObj = _returns_;
            const _initFunc = function () {
                if (_commandUtils.isScription(_inits)) {
                    const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(_inits), thisScope, _thisObj);
                    inits.push(flevaScript);
                } else if (helperUtils.isArray(_inits))
                    for (const _init of Object.values(_inits))
                        if (_commandUtils.isScription(_init)) {
                            const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(_init), thisScope, _thisObj);
                            inits.push(flevaScript);
                        }

                if (_props) {
                    if (!helperUtils.isObject(_props)) return;
                    for (const _prop of Object.keys(_props))
                        if (helperUtils.isDefined(props[_prop])) props[_prop] = _props[_prop];
                }
            }
            _initFunc();

            return _returns_;
        }
        const _Prefab = function (_props, _inits, _funcs) {
            const state = {}, props = { _x: 0, _y: 0, _width: _defaults.size, _height: _defaults.size, _alpha: 1, _visible: true, _rotation: 0, _anchorX: 0, _anchorY: 0 };
            let _appearanceFunction = null;
            let _stateChanged = false;
            let isLoaded = false;

            let __rotation = 0, __anchorX = 0, __anchorY = 0;
            Object.defineProperties(props, {
                _rotation: {
                    get() { return __rotation },
                    set(_val) {
                        if (typeof _val === "string" && /^\d+%$/.test(_val)) {
                            __rotation = (parseInt(_val) / 100 * 360);
                        } else
                            __rotation = parseInt(_val);
                        if (!numberUtils.inRange(__rotation, -179, 180))
                            __rotation = numberUtils.wheelClamp(__rotation, -180, 180);
                    },
                    enumerable: true,
                    configurable: false
                },
                _anchorX: {
                    get() { return __anchorX },
                    set(_val) {
                        __anchorX = numberUtils.lock(parseInt(_val), 0, 100);
                    },
                    enumerable: true,
                    configurable: false
                },
                _anchorY: {
                    get() { return __anchorY },
                    set(_val) {
                        __anchorY = numberUtils.lock(parseInt(_val), 0, 100);
                    },
                    enumerable: true,
                    configurable: false
                }
            });

            const __callAppearanceFunction = () => {
                if (_commandUtils.isScription(_appearanceFunction)) {
                    const _appearFunc = _commandUtils.getScription(_appearanceFunction);
                    try {
                        _appearFunc.bind(_appearanceObject)(_appearanceObject);
                    } catch (bubbledError) {
                        DebugModule.bubbleError({ type: "Prefab", from: "prefab.setappearance", error: bubbledError, src: _appearFunc });
                    }
                }
            }

            const inits = [];
            const finis = [];
            const _heirarchy = {
                scripts: [],
                visuals: {
                    src: null,
                    type: null,
                    name: null
                }
            }

            const _getBounds = function () {
                const { _x, _y, _width, _height, _rotation, _anchorX: ax, _anchorY: ay } = props;
                const offsetX = (ax * _width / 100);
                const offsetY = (ay * _height / 100);
                const fx = -offsetX, fy = -offsetY;
                const fw = _width - offsetX, fh = _height - offsetY;

                let topLeftRP;
                let bottomLeftRP;
                let topRightRP;
                let bottomRightRP;

                if (_rotation === 0) {
                    topLeftRP = numberUtils.newPoint(fx, fy);
                    bottomLeftRP = numberUtils.newPoint(fx, fh);
                    topRightRP = numberUtils.newPoint(fw, fy);
                    bottomRightRP = numberUtils.newPoint(fw, fh);
                } else {
                    topLeftRP = numberUtils.rotatePoint(fx, fy, _rotation);
                    bottomLeftRP = numberUtils.rotatePoint(fx, fh, _rotation);
                    topRightRP = numberUtils.rotatePoint(fw, fy, _rotation);
                    bottomRightRP = numberUtils.rotatePoint(fw, fh, _rotation);
                }

                const minX = numberUtils.minMax("_x", "min", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);
                const minY = numberUtils.minMax("_y", "min", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);
                const maxX = numberUtils.minMax("_x", "max", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);
                const maxY = numberUtils.minMax("_y", "max", topLeftRP, topRightRP, bottomLeftRP, bottomRightRP);

                return {
                    _x: minX + _x, _y: minY + _y, _width: maxX - minX, _height: maxY - minY
                }
            }

            const _fillState = (_newState) => {
                if (!helperUtils.isObject(_newState)) return;
                for (const _name of Object.keys(_newState)) {
                    if (state[_name] !== _newState[_name]) {
                        state[_name] = _newState[_name];
                        if (!_stateChanged) _stateChanged = true;
                    }
                }
            }
            const _clearState = () => {
                for (const _name of Object.keys(state)) {
                    delete state[_name];
                }
            }
            const changeState = (_name, _value) => {
                const functionLineNumber = DebugModule.getLineNumber(2);
                try {
                    DebugModule.typeCheck(changeState, "state's name", _name, String);
                    const _newState = {};
                    _newState[_name] = _value;

                    _fillState(_newState);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Prefab", from: "prefab.changeState", error: bubbledError, src: functionLineNumber });
                }
            }
            const useState = (_state) => { 
                try {
                    DebugModule.typeCheck(useState, "state", _state, Object, Function, _constructors.Script);
                    if (helperUtils.isObject(_state)) {
                        const _newState = _state;

                        _clearState();
                        _fillState(_newState);
                    } else if (_commandUtils.isScription(_state)) {
                        const prevState = objectUtils.deepCloneObject(state);
                        const _newState = _commandUtils.getScription(_state)(prevState);

                        _clearState();
                        _fillState(_newState);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Prefab", from: "prefab.useState", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }
            const setState = (_state) => { 
                try {
                    DebugModule.typeCheck(setState, "state", _state, Object, Function, _constructors.Script);
                    if (helperUtils.isObject(_state)) {
                        const _newState = _state;

                        _fillState(_newState);
                    } else if (_commandUtils.isScription(_state)) {
                        const prevState = objectUtils.deepCloneObject(state);
                        const _newState = _commandUtils.getScription(_state)(prevState);

                        _fillState(_newState);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Prefab", from: "prefab.setState", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }
            const localToGlobal = (_point, _relative = false) => {
                if (_relative === true) {
                    const _reRotatedPoint = numberUtils.rotatePoint(_point.x, _point.y, props._rotation);
                    _point.x = _reRotatedPoint._x + props._x;
                    _point.y = _reRotatedPoint._y + props._y;
                } else {
                    _point.x += props._x;
                    _point.y += props._y;
                }
            }

            const globalToLocal = (_point, _relative = false) => {
                if (_relative === true) {
                    const rotatedPoint = numberUtils.rotatePoint(_point.x - props._x, _point.y - props._y, -props._rotation);
                    _point.x = rotatedPoint._x;
                    _point.y = rotatedPoint._y;
                } else {
                    _point.x -= props._x;
                    _point.y -= props._y;
                }
            }

            const swapDepths = (_depth) => {
                if (_funcs && _funcs.swapDepths) {
                    _funcs.swapDepths(_depth);
                }
            }

            const hitTest = (..._args) => {
                try {
                    if (helperUtils.isNull(_args[0])) return false;
                    if (helperUtils.isNumber(_args[0])) {
                        return hitTestPoint(..._args);
                    } else {
                        return hitTestFlevaClip(..._args);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Prefab", from: "prefab.hittest", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }

            const hitTestPoint = (_x, _y, _shapeFlag = false) => {
                DebugModule.typeCheck(hitTestPoint, "_x coordinate", _x, Number);
                DebugModule.typeCheck(hitTestPoint, "_y coordinate", _y, Number);
                DebugModule.typeCheck(hitTestPoint, "_shapeFlag", _shapeFlag, Boolean);

                const sourceProps = props;
                if (!sourceProps._visible) return false;

                const targetPoint = { _x, _y };
                const isSprite = _heirarchy.visuals.type === helperUtils.typeOf(_constructors.Sprite);
                const isSpriteSheet = _heirarchy.visuals.type === helperUtils.typeOf(_constructors.SpriteSheet);
                const isGraphic = _heirarchy.visuals.type === helperUtils.typeOf(_constructors.Graphic);

                if (!_shapeFlag) {
                    const sourceBounds = _getBounds();
                    return _commandUtils.boxHitTestPoint(sourceBounds, targetPoint);
                } else if (isSprite || isSpriteSheet || isGraphic) {
                    const visualSource = (isSprite || isGraphic) ? _heirarchy.visuals.src :_heirarchy.visuals.src[_spriteSheetFrameID];
                    const pixelMap = _commandUtils.getPixelMap(isGraphic ? _constructors.Graphic : _constructors.Sprite, visualSource);
                    const source = { ...sourceProps, pixelMap };
                    const rotatedPoint = _commandUtils.getRotatedMappedPoint(targetPoint, props);

                    return _commandUtils.boxHitTestPoint(source, rotatedPoint) && _commandUtils.pixelHitTestPoint(source, rotatedPoint);
                } else {
                    const rotatedPoint = _commandUtils.getRotatedMappedPoint(targetPoint, props);
                    return _commandUtils.boxHitTestPoint(sourceProps, rotatedPoint);
                }
            }

            const hitTestFlevaClip = (_target) => {
                let flevaclip;
                if (helperUtils.isFlevaClip(_target))
                    flevaclip = _target;
                else if (helperUtils.isString(_target))
                    flevaclip = _getFlevaClipByInstanceName(_target);
                else throw `Invalid target argument! Expected ${DebugModule.displayTracedValue(_constructors.Prefab)} but received ${DebugModule.displayTracedValue(_target)}.`;
                if (!flevaclip) throw `FlevaClip with instance name ${_target} not found.`;

                const sourceProps = props;
                const targetProps = flevaclip._private_._getProps();
                if (!sourceProps._visible || !targetProps._visible) return false;

                const sourceBounds = _getBounds();
                const targetBounds = flevaclip._private_._getBounds();

                return _commandUtils.boxHitTest(sourceBounds, targetBounds);
            }

            let _spriteSheet = undefined, _spriteSheetFrameID = 0, _spriteSheetLoop = undefined;
            const _resetSpriteSheet = () => {
                if (helperUtils.isDefined(_spriteSheetLoop)) {
                    deleteLoop(_spriteSheetLoop);
                    _spriteSheet = undefined;
                    _spriteSheetFrameID = 0;
                    _spriteSheetLoop = undefined;
                }
                _heirarchy.visuals.name = null;
                _heirarchy.visuals.src = null;
                _heirarchy.visuals.type = null;
            }
            const useSprite = (_name) => {
                try {
                    if (helperUtils.isSprite(_name))
                        _name = _name.idName;
                    _errorsM.checkSpriteNotExist(_name);
                    if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Sprite) && _heirarchy.visuals.name === _name) return;

                    _resetSpriteSheet();
                    _heirarchy.visuals.name = _name;
                    _heirarchy.visuals.src = _name;
                    _heirarchy.visuals.type = helperUtils.typeOf(_constructors.Sprite);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Prefab", from: "useSprite", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }
            const useGraphic = (_name) => {
                try {
                    if (helperUtils.isGraphic(_name))
                        _name = _name.idName;
                    _errorsM.checkGraphicNotExist(_name);
                    if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Graphic) && _heirarchy.visuals.name === _name) return;

                    _resetSpriteSheet();
                    _heirarchy.visuals.name = _name;
                    _heirarchy.visuals.src = _name;
                    _heirarchy.visuals.type = helperUtils.typeOf(_constructors.Graphic);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Prefab", from: "useGraphic", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }

            const usePainting = (_painting) => {
                try {
                    if (helperUtils.isPainting(_painting))
                        _painting = _painting.idName;
                    if (helperUtils.isString(_painting)) {
                        const _name = _painting;
                        _errorsM.checkPaintingNotExist(_name);
                        if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Painting) && _heirarchy.visuals.name === _name) return;

                        _resetSpriteSheet();
                        _heirarchy.visuals.name = _name;
                        _heirarchy.visuals.src = _name;
                        _heirarchy.visuals.type = helperUtils.typeOf(_constructors.Painting);
                    } else if (_commandUtils.isScription(_painting)) {
                        _resetSpriteSheet();
                        const _function = _commandUtils.getScription(_painting);
                        _heirarchy.visuals.name = "painting";
                        _heirarchy.visuals.src = _function;
                        _heirarchy.visuals.type = helperUtils.typeOf(_constructors.Painting);
                    }
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Prefab", from: "usePainting", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }
            const useSpriteSheet = (_name, _fps = 1, _loops = 0, _callback) => {
                const functionLineNumber = DebugModule.getLineNumber(2);
                try {
                    if (!helperUtils.isNumber(_fps)) throw `Number expected for _fps.`;
                    if (!helperUtils.isNumber(_loops)) throw `Number expected for _loop count.`;
                    if (helperUtils.isDefined(_callback) && !_commandUtils.isScription(_callback)) throw `Script or function expected for _callback.`;
                    if (helperUtils.isSpriteSheet(_name))
                        _name = _name.idName;
                    _errorsM.checkSpriteSheetNotExist(_name);
                    if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.SpriteSheet) && _heirarchy.visuals.name === _name) return;
                    let loopCount = 0;

                    _resetSpriteSheet();

                    _spriteSheet = _library.spritesheets[_name].assetSource;
                    _spriteSheetFrameID = 0;

                    _spriteSheetLoop = createLoop(true, async () => {
                        const nextID = numberUtils.cycle(_spriteSheetFrameID, _spriteSheet.length - 1);
                        if (_loops > 0 && _spriteSheet.hasLoaded) {
                            if (nextID === 0) loopCount++;
                            if (loopCount >= _loops) {
                                pauseLoop(_spriteSheetLoop);
                                if (helperUtils.isDefined(_callback)) {
                                    const callback = _commandUtils.getScription(_callback);
                                    try {
                                        await callback();
                                    } catch (errMsg) {
                                        DebugModule.addAsyncError(() =>
                                            DebugModule.bubbleError({ type: "Prefab", from: "spritesheet.onend", error: errMsg, src: functionLineNumber }));
                                    }
                                }
                                return;
                            }
                        }
                        _spriteSheetFrameID = nextID;
                    }, { ms: 1000 / _fps, skipOlds: true });

                    _heirarchy.visuals.name = _name;
                    _heirarchy.visuals.src = _spriteSheet;
                    _heirarchy.visuals.type = helperUtils.typeOf(_constructors.SpriteSheet);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Prefab", from: "useSpriteSheet", error: bubbledError, src: functionLineNumber });
                }
            }

            const thisScope = {};
            const addScript = (_script) => {
                try {
                    DebugModule.typeCheck(addScript, "script", _script, String, Function, _constructors.Script);
                    let script;
                    if (helperUtils.isString(_script)) {
                        const _newScript = getScriptFromLibrary(_script);
                        script = _Script(_newScript);
                    } else if (_commandUtils.isScription(_script)) {
                        const _newScript = _commandUtils.getScription(_script);
                        script = _Script(_newScript);
                    }
                    const flevaScript = _commandUtils.createFlevaScript(script, thisScope, _thisObj);
                    _heirarchy.scripts.push(flevaScript);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Prefab", from: "prefab.addScript", error: bubbledError, src: DebugModule.getLineNumber(2) });
                }
            }

            const setAppearanceFunction = (_script) => {
                if (helperUtils.isString(_script)) {
                    const _newScript = getScriptFromLibrary(_script);
                    const flevaScript = _commandUtils.createFlevaScript(_newScript, thisScope, _appearanceObject);

                    _appearanceFunction = flevaScript;
                } else if (_commandUtils.isScription(_script)) {
                    const _newScript = _commandUtils.getScription(_script);
                    const flevaScript = _commandUtils.createFlevaScript(_newScript, thisScope, _appearanceObject);

                    _appearanceFunction = flevaScript;
                }
            }

            const load = async () => {
                if (isLoaded) return;

                if (inits.length > 0)
                    for (const init of Object.keys(inits)) {
                        const _init = inits[init];
                        try {
                            const fini = await _init.bind(_thisObj)(_thisObj);
                            if (_commandUtils.isScription(fini)) {
                                const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(fini), thisScope, _thisObj);
                                finis.push(flevaScript);
                                finis[finis.length - 1].FLN = _init.FLN;
                            }
                        } catch (bubbledError) {
                            DebugModule.bubbleError({ type: "Prefab", from: "prefab.onload", error: bubbledError, src: _init.FLN || _init });
                        }
                    }

                _stateChanged = true;
                isLoaded = true;
            }
            const unload = async () => {
                if (!isLoaded) return;

                if (finis.length > 0) {
                    for (const fini of Object.keys(finis)) {
                        const _fini = finis[fini];
                        try {
                            await _fini.bind(_thisObj)(_thisObj);
                        } catch (bubbledError) {
                            DebugModule.bubbleError({ type: "Prefab", from: "prefab.onunload", error: bubbledError, src: _fini.FLN || _fini });
                        }
                    }
                    finis.length = 0;
                }

                _resetSpriteSheet();

                _heirarchy.scripts.length = 0;
                isLoaded = false;
            }

            const tick = async () => {
                for (const _name of Object.keys(_heirarchy.scripts)) {
                    const _script = _heirarchy.scripts[_name];
                    try {
                        await _script.bind(_thisObj)(_thisObj);
                    } catch (bubbledError) {
                        DebugModule.bubbleError({ type: "Prefab", from: "prefab's script", error: bubbledError, src: _script.FLN || _script });
                    }
                }
            }
            const render = () => {
                if (_stateChanged) {
                    _stateChanged = false;
                    try {
                        __callAppearanceFunction();
                    } catch (bubbledError) {
                        DebugModule.bubbleError({ type: "Scene", from: "prefab's script", error: bubbledError });
                    }
                }
                const _clip = true;
                if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Sprite)) {
                    _screen.renderFlevaClip({ ...props, _bounds: _getBounds(), _clip }, _constructors.Sprite, [_heirarchy.visuals.src]);
                } else if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.SpriteSheet)) {
                    _screen.renderFlevaClip({ ...props, _bounds: _getBounds(), _clip }, _constructors.SpriteSheet, [_heirarchy.visuals.src[_spriteSheetFrameID]]);
                } else if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Graphic)) {
                    _screen.renderFlevaClip({ ...props, _bounds: _getBounds(), _clip }, _constructors.Graphic, [_heirarchy.visuals.src]);
                } else if (_heirarchy.visuals.type === helperUtils.typeOf(_constructors.Painting)) {
                    _screen.renderFlevaClip({ ...props, _bounds: _getBounds(), _clip }, _constructors.Painting, [_heirarchy.visuals.src, state]);
                }
                _screen.renderFlevaClipBounds({ ...props, _bounds: _getBounds() });
            }
            const start = () => {
                _stateChanged = true;
            }
            const stop = () => {
                _resetSpriteSheet();
            }

            const isMouseInFlevaClip = () => {
                const { _stageX: _x, _stageY: _y } = MouseModule._private_;
                if (!helperUtils.isNumber(_x) || !helperUtils.isNumber(_y)) return false;
                return hitTestPoint(_x, _y, true);
            }

            const _private_ = {
                _overrideProps: (_props) => {
                    if (!helperUtils.isObject(_props)) return;
                    for (const _prop of Object.keys(_props))
                        if (helperUtils.isDefined(props[_prop])) props[_prop] = _props[_prop];
                },
                _getInits: () => inits,
                _getRawInits: () => _inits,
                _getType: () => helperUtils.typeOf(_thisObj),
                _getProps: () => ({ ...props }),
                _getRawProps: () => ({ ..._props }),
                _getBounds,
                _isMouseInFlevaClip: isMouseInFlevaClip,
                _hasOnPress: () => _thisObj.onClick !== _defaults.emptyFunc && _commandUtils.isScription(_thisObj.onClick),
                _start: start, _stop: stop,
                _load: load, _unload: unload,
                _tick: tick, _render: render
            }

            const _returns_ = new _constructors.Prefab({
                state,
                hitTest,
                changeState,
                useState,
                setState,
                addScript,
                setAppearance: setAppearanceFunction,
                localToGlobal,
                globalToLocal,
                swapDepths
            });

            let onClickFunc = _defaults.emptyFunc;

            Object.defineProperties(_returns_, {
                _private_: {
                    get() { return _private_; },
                    enumerable: false,
                    configurable: false
                },
                _hovered: {
                    get() { return MouseModule._private_._getMouseHoverTarget() === _thisObj; },
                    enumerable: true,
                    configurable: false
                },
                onClick: {
                    get() { return onClickFunc; },
                    set(func) {
                        onClickFunc = _commandUtils.createFlevaScript(_commandUtils.getScription(func), thisScope, _thisObj);
                        if (!onClickFunc.FLN) onClickFunc.FLN = DebugModule.getLineNumber(2);
                    }
                }
            });
            for (let prop of Object.keys(props)) {
                Object.defineProperty(_returns_, prop, {
                    get() { return props[prop] },
                    set() {
                        const args = Array.prototype.slice.call(arguments); props[prop] = args[0];
                    },
                    enumerable: true,
                    configurable: false
                });
            }

            const _thisObj = _returns_;
            const _initFunc = function () {
                if (_commandUtils.isScription(_inits)) {
                    const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(_inits), thisScope, _thisObj);
                    inits.push(flevaScript);
                } else if (helperUtils.isArray(_inits))
                    for (const _init of Object.values(_inits))
                        if (_commandUtils.isScription(_init)) {
                            const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(_init), thisScope, _thisObj);
                            inits.push(flevaScript);
                        }


                if (_props) {
                    if (!helperUtils.isObject(_props)) return;
                    for (const _prop of Object.keys(_props))
                        if (helperUtils.isDefined(props[_prop])) props[_prop] = _props[_prop];
                }
            }
            _initFunc();

            const _appearanceObject = {
                get state() { return objectUtils.deepCloneObject(state) },
                useSprite,
                useGraphic,
                useSpriteSheet,
                usePainting,
                toString() {
                    return "[type PrefabAppearance]";
                }
            }

            return _returns_;
        }
        const _SpriteSheet = function (_name, { _width: w = _defaults.size, _height: h = _defaults.size, cut = false, props: allProps = [] } = {}, _allDefinitions = []) { 
            let _definitions, props;
            if (helperUtils.isArray(_allDefinitions)) _definitions = [..._allDefinitions];
            else _definitions = [_allDefinitions];
            if (helperUtils.isArray(allProps)) props = [...allProps];
            else props = [allProps];
            const assetSource = [];
            assetSource.hasLoaded = undefined;

            assetSource.loadSource = function () {
                return new Promise(async resolve => {
                    if (helperUtils.isDefined(assetSource.hasLoaded)) return resolve();
                    assetSource.hasLoaded = "loading";

                    const scanvas = _defaults.Canvas();
                    const sctx = scanvas.getContext("2d");


                    const canvas = _defaults.Canvas(w, h);
                    const ctx = canvas.getContext("2d");

                    function cutSprite(_width, _height, _cut) {
                        if (!_cut) {
                            ctx.clearRect(0, 0, w, h);
                            ctx.drawImage(scanvas, 0, 0, w, h, 0, 0, w, h);
                            const src = _defaults.Canvas(w, h);
                            src.hasLoaded = true;


                            _screen._copyCanvas(canvas, src);

                            const pixelMap = _screen._getPixelMap(canvas);

                            const _name = _generateSymbolName("spritesheet");
                            const _returns_ = new _constructors.Sprite({
                                assetSource: src, idName: _name,
                                pixelMap
                            });


                            _library.sprites[_name] = _returns_;
                            assetSource.push(_name);
                        } else {
                            for (let sW = 0; sW < _width; sW += w) {
                                ctx.clearRect(0, 0, w, h);
                                ctx.drawImage(scanvas, sW, 0, w, h, 0, 0, w, h);
                                const src = _defaults.Canvas(w, h);
                                src.hasLoaded = true;

                                _screen._copyCanvas(canvas, src);

                                const pixelMap = _screen._getPixelMap(canvas);

                                const _name = _generateSymbolName("spritesheet");
                                const _returns_ = new _constructors.Sprite({
                                    assetSource: src, idName: _name,
                                    pixelMap
                                });

                                _library.sprites[_name] = _returns_;
                                assetSource.push(_name);
                            }
                        }
                    }

                    let currDefinitions = 0;
                    for (const i of Object.keys(_definitions)) {
                        let _definition = _definitions[i];
                        let failedMsg = `Error occurred in "${_name}" spritesheet's #${i} definition.`;
                        let gotSprite = false;

                        const prop = props[i];
                        const sW = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop._width) ? prop._width : w) : w;
                        const sH = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop._height) ? prop._height : h) : h;
                        const sCut = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop.cut) ? prop.cut : cut) : cut;
                        if (helperUtils.isSpriteSheet(_definition)) {
                            try {
                                let src;
                                if (!_definition.assetSource) 
                                    src = getSpriteSheetFromLibrary(_definition.idName).assetSource;
                                else
                                    src = _definition.assetSource;

                                const props = objectUtils.multiplyObject({ _width: sW, _height: sH, cut: sCut }, src.length);

                                const tempSheet = _SpriteSheet(_name, { _width: w, _height: h, cut, props }, ...src);
                                await tempSheet.assetSource.loadSource();
                                if (tempSheet.assetSource.hasLoaded) {
                                    assetSource.push(...tempSheet.assetSource);

                                    gotSprite = true;
                                }
                            } catch { }
                        } else {
                            const [sX, sY] = [0, 0];
                            if (_commandUtils.isScription(_definition)) {
                                try {
                                    let src;
                                    scanvas.width = sW;
                                    scanvas.height = sH;

                                    sctx.imageSmoothingEnabled = false;
                                    src = _commandUtils.getScription(_definition);
                                    src.bind(sctx)(sctx, { _x: sX, _y: sY, _width: sW, _height: sH, state: {} });

                                    gotSprite = true;
                                } catch { }
                            } else if (helperUtils.isGraphic(_definition)) {
                                try {
                                    let src;
                                    if (!_definition.assetSource) 
                                        src = getGraphicFromLibrary(_definition.idName).assetSource;
                                    else
                                        src = _definition.assetSource;

                                    if (src.hasLoaded !== true) {
                                        throw failedMsg = `"${_definition.idName}" graphic not loaded in time for "${_name}" spritesheet's #${i} definition.`;
                                    }

                                    scanvas.width = sW;
                                    scanvas.height = sH;

                                    sctx.imageSmoothingEnabled = false;
                                    sctx.drawImage(src, sX, sY, sW, sH);

                                    gotSprite = true;
                                } catch { }
                            } else if (_commandUtils.isRawGraphic(_definition)) { 
                                try {
                                    const src = _definition;
                                    scanvas.width = sW;
                                    scanvas.height = sH;

                                    sctx.imageSmoothingEnabled = false;
                                    sctx.drawImage(src, sX, sY, sW, sH);

                                    gotSprite = true;
                                } catch { }
                            } else if (helperUtils.isString(_definition)) {
                                try {
                                    const src = getSpriteFromLibrary(_definition).assetSource;
                                    scanvas.width = sW;
                                    scanvas.height = sH;

                                    sctx.imageSmoothingEnabled = false;
                                    sctx.drawImage(src, sX, sY, sW, sH);

                                    gotSprite = true;
                                } catch { }
                            } else if (helperUtils.isSprite(_definition)) {
                                try {
                                    let src;
                                    if (!_definition.assetSource) 
                                        src = getSpriteFromLibrary(_definition.idName).assetSource;
                                    else
                                        src = _definition.assetSource;
                                    scanvas.width = sW;
                                    scanvas.height = sH;

                                    sctx.imageSmoothingEnabled = false;
                                    sctx.drawImage(src, sX, sY, sW, sH);

                                    gotSprite = true;
                                } catch { }
                            } else if (helperUtils.isPainting(_definition)) {
                                try {
                                    let src;
                                    if (!_definition.assetSource) 
                                        src = getPaintingFromLibrary(_definition.idName).assetSource;
                                    else
                                        src = _definition.assetSource;
                                    scanvas.width = sW;
                                    scanvas.height = sH;
                                    sctx.imageSmoothingEnabled = false;

                                    src.bind(sctx)(sctx, { _x: sX, _y: sY, _width: sW, _height: sH, state: {} });

                                    gotSprite = true;
                                } catch { }
                            }
                            if (!gotSprite)
                                console.warn(`${failedMsg} Skipping definition.`);
                            else
                                cutSprite(sW, sH, sCut);
                        }
                        currDefinitions += gotSprite;
                    }
                    assetSource.hasLoaded = currDefinitions > 0;
                    if (!assetSource.hasLoaded) {
                        console.warn(`Spritesheet load failed. Using default spritesheet.`);

                        const src = _defaults.sprite;
                        scanvas.width = w;
                        scanvas.height = h;

                        sctx.imageSmoothingEnabled = false;
                        sctx.drawImage(src, 0, 0, w, h);

                        cutSprite(w, h, cut);
                    }
                    resolve();
                });
            }

            const _returns_ = new _constructors.SpriteSheet({ assetSource, idName: _name });
            return _returns_;
        }
        const _Sprite = function (_name, { _width = _defaults.size, _height = _defaults.size } = {}, _definition) {
            const assetSource = _defaults.Canvas(_width, _height);
            assetSource.hasLoaded = undefined;

            assetSource.loadSource = function () {
                return new Promise(async resolve => {
                    if (helperUtils.isDefined(assetSource.hasLoaded)) return resolve();
                    assetSource.hasLoaded = "loading";
                    let failedMsg = `Definition not found for "${_name}" sprite.`;
                    let gotSprite = false;
                    const [sX, sY, sW, sH] = [0, 0, _width, _height];
                    const canvas = _defaults.Canvas(sW, sH);
                    const ctx = canvas.getContext("2d");
                    if (_commandUtils.isScription(_definition)) {
                        try {
                            let src;
                            ctx.imageSmoothingEnabled = false;

                            src = _commandUtils.getScription(_definition);
                            src.bind(ctx)(ctx, { _x: sX, _y: sY, _width: sW, _height: sH, state: {} });

                            gotSprite = true;
                        } catch { }
                    } else if (helperUtils.isGraphic(_definition)) {
                        try {
                            let src;
                            if (!_definition.assetSource) 
                                src = getGraphicFromLibrary(_definition.idName).assetSource;
                            else
                                src = _definition.assetSource;

                            if (src.hasLoaded !== true) {
                                throw failedMsg = `"${_definition.idName}" graphic not loaded in time for "${_name}" sprite.`;
                            }

                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(src, sX, sY, sW, sH);

                            gotSprite = true;
                        } catch { }
                    } else if (_commandUtils.isRawGraphic(_definition)) { 
                        try {
                            const src = _definition;

                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(src, sX, sY, sW, sH);

                            gotSprite = true;
                        } catch { }
                    } else if (helperUtils.isString(_definition)) {
                        try {
                            const src = getSpriteFromLibrary(_definition).assetSource;

                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(src, sX, sY, sW, sH);

                            gotSprite = true;
                        } catch { }
                    } else if (helperUtils.isSprite(_definition)) {
                        try {
                            let src;
                            if (!_definition.assetSource) 
                                src = getSpriteFromLibrary(_definition.idName).assetSource;
                            else
                                src = _definition.assetSource;

                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(src, sX, sY, sW, sH);

                            gotSprite = true;
                        } catch { }
                    } else if (helperUtils.isPainting(_definition)) {
                        try {
                            let src;
                            if (!_definition.assetSource) 
                                src = getPaintingFromLibrary(_definition.idName).assetSource;
                            else
                                src = _definition.assetSource;
                            ctx.imageSmoothingEnabled = false;

                            src.bind(ctx)(ctx, { _x: sX, _y: sY, _width: sW, _height: sH, state: {} });

                            gotSprite = true;
                        } catch { }
                    }
                    if (!gotSprite) {
                        console.warn(`${failedMsg} Using default sprite.`);

                        const src = _defaults.sprite;

                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(src, sX, sY, sW, sH);
                    }


                    _screen._copyCanvas(canvas, assetSource);

                    const pixelMap = _screen._getPixelMap(canvas);
                    _returns_.pixelMap = pixelMap;
                    assetSource.hasLoaded = gotSprite;
                    resolve();
                });
            }


            const _returns_ = new _constructors.Sprite({ assetSource, idName: _name });
            _returns_.pixelMap = _screen._getPixelMap(_defaults.sprite);
            return _returns_;
        }
        const _Graphic = function (_name, { _path = _defaults.graphicPath, _type = _defaults.graphicType, _name: _mName, _src } = {}) {
            const name = _mName || _name;
            const src = _src ? _src : `${_path}/${name}.${_type}`;

            const assetSource = new _defaults.Image();
            assetSource.crossOrigin = "anonymous";
            assetSource.hasLoaded = undefined;

            assetSource.loadSource = function () {
                return new Promise(resolve => {
                    if (helperUtils.isDefined(assetSource.hasLoaded)) return resolve();
                    assetSource.hasLoaded = "loading";
                    assetSource.onload = function () {
                        if ([true, false].includes(assetSource.hasLoaded)) return;
                        const canvas = _screen._copyCanvas(assetSource);
                        const pixelMap = _screen._getPixelMap(canvas);
                        _returns_.pixelMap = pixelMap;
                        assetSource.hasLoaded = true;
                        resolve();
                    }
                    assetSource.onerror = function () {
                        if ([true, false].includes(assetSource.hasLoaded)) return;
                        console.warn(`Graphic load for "${_name}" failed. Using default backup.`);
                        assetSource.hasLoaded = false;
                        resolve();
                    }

                    assetSource.src = src;
                });
            }

            const _returns_ = new _constructors.Graphic({ assetSource, idName: _name });
            _returns_.pixelMap = _screen._getPixelMap(_defaults.sprite);
            return _returns_;
        }
        const _Painting = function (_name, _function) {
            const assetSource = _function;

            const _returns_ = new _constructors.Painting({ assetSource, idName: _name });

            return _returns_;
        }









        const _getFlevaClipFromLibrary = function (_name) {
            _errorsM.checkFlevaClipNotExist(_name);
            return _library.flevaclips[_name].instance;
        }
        const _getFlevaClipByInstanceName = (_instanceName) => {
            if (getCurrentSceneName() !== "") {
                const flevaclip = getCurrentScene()._private_._getFlevaClipByInstanceName(_instanceName);
                if (flevaclip) return flevaclip;
            }

            for (const _name of Object.keys(_attachedFlevaClips)) {
                if (_attachedFlevaClips[_name].instanceName === _instanceName) {
                    return _attachedFlevaClips[_name].instance;
                }
            }
        }

        const _fillState = (_newState) => {
            if (!helperUtils.isObject(_newState)) return;
            for (const _name of Object.keys(_newState)) {
                if (engineState[_name] !== _newState[_name])
                    engineState[_name] = _newState[_name];
            }
        }
        const _clearState = () => {
            for (const _name of Object.keys(engineState)) {
                delete engineState[_name];
            }
        }




        const createFlevaClip = function (_flevaclipType, functionLineNumber, _name, _props, ..._inits) {
            _errorsM.checkFlevaClipExist(_name);
            if (!helperUtils.isObject(_props)) {
                _inits = [_props, ..._inits];
                _inits = _inits.filter(elem => _commandUtils.isScription(elem));
                for (const _init of _inits)
                    _init.FLN = functionLineNumber;

                _props = {};
            }

            const FlevaClip = _flevaclipType === "prefab" ? _Prefab : _flevaclipType === "textfield" ? _Textfield : false;
            _library.flevaclips[_name] = {
                instance: FlevaClip(_props, _inits),
                type: _flevaclipType
            };
        }

        const _attachedFlevaClips = {};
        const _attachFlevaClip = (_type, _attachedName, _instanceName, _props, _inits) => {
            const _stackName = _generateSymbolName("stack");
            const _swapDepths = (_depth) => mainStack.swapDepths(_stackName, _depth);
            const _funcs = { swapDepths: _swapDepths };

            const FlevaClip = _type === "prefab" ? _Prefab : _type === "textfield" ? _Textfield : false;

            const instance = FlevaClip(_props, _inits, _funcs);

            _attachedFlevaClips[_attachedName] = {
                stackName: _stackName,
                instanceName: _instanceName,
                instance
            }

            mainStack.list.push({
                stackName: _stackName,
                depth: 1,
                instance,
                render: instance._private_._render
            });

            mainStack.sortStack();
            addToBatch(async function () {
                try {
                    await instance._private_._load();
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Stage", from: `_root.attach${_type}`, error: bubbledError }, true);
                }
            });
        }
        const attachFlevaClip = (_type, functionLineNumber, ..._args) => {
            let attachedName = _generateSymbolName("flevaclip");
            if (helperUtils.isString(_args[0])) {
                let [_name, _props, ..._inits] = _args;
                if (!helperUtils.isObject(_props)) {
                    _inits = [_props, ..._inits];
                    _props = {};
                }

                const { instanceName, attachedName: _aName, preserve = false, ...__props } = _props;
                _props = __props;

                if (_aName) {
                    _errorsM.checkCanUseName(_aName, "flevaclip");
                    attachedName = _aName;
                }

                const sourceRef = _getFlevaClipFromLibrary(_name)._private_;
                const type = sourceRef._getType();

                if (_type !== type) throw `Expected ${_type} flevaclip but received ${type} instead.`;

                _inits = _inits.filter(elem => _commandUtils.isScription(elem));
                for (const _init of _inits)
                    _init.FLN = functionLineNumber;

                _inits = [...sourceRef._getRawInits(), ..._inits];
                _props = { ...sourceRef._getRawProps(), ..._props };

                _attachFlevaClip(_type, attachedName, instanceName, _props, _inits);
            } else if (helperUtils.isArray(_args[0])) {
                let [_names, _props, ..._inits] = _args;
                if (!helperUtils.isObject(_props)) {
                    _inits = [_props, ..._inits];
                    _props = {};
                }

                const { instanceName, attachedName: _aName, preserve = false, ...__props } = _props;
                _props = __props;

                if (_aName) {
                    _errorsM.checkCanUseName(_aName, "flevaclip");
                    attachedName = _aName;
                }

                const sourceRefs = _names.map(_name => _getFlevaClipFromLibrary(_name)._private_);
                const types = sourceRefs.reduce((acc, sourceRef) => ([...acc, sourceRef._getType()]), []);

                for (const type of types)
                    if (_type !== type) throw `Expected ${_type} flevaclip but received ${type} instead.`;

                _inits = _inits.filter(elem => _commandUtils.isScription(elem));
                for (const _init of _inits)
                    _init.FLN = functionLineNumber;

                _inits = [...sourceRefs.reduce((acc, sourceRef) => ([...acc, ...sourceRef._getRawInits()]), []), ..._inits];
                _props = { ...sourceRefs.reduce((acc, sourceRef) => ({ ...acc, ...sourceRef._getRawProps() }), {}), ..._props };

                _attachFlevaClip(_type, attachedName, instanceName, _props, _inits);
            } else {
                let [_props, ..._inits] = _args;
                if (!helperUtils.isObject(_props)) {
                    _inits = [_props, ..._inits];
                    _props = {};
                }
                _inits = _inits.filter(elem => _commandUtils.isScription(elem));
                for (const _init of _inits)
                    _init.FLN = functionLineNumber;

                const { instanceName, attachedName: _aName, preserve = false, ...__props } = _props;
                _props = __props;

                if (_aName) {
                    _errorsM.checkCanUseName(_aName, "flevaclip");
                    attachedName = _aName;
                }

                _attachFlevaClip(_type, attachedName, instanceName, _props, _inits);
            }
        }
        const removeFlevaClip = async function (_type, _attachedName) {
            if (_attachedFlevaClips[_attachedName]) {
                const flevaclip = _attachedFlevaClips[_attachedName];
                const type = flevaclip.instance._private_._getType();
                if (_type !== type) return;

                const index = mainStack.list.findIndex(elem => elem.stackName === flevaclip.stackName);
                if (index !== -1) {
                    mainStack.list.splice(index, 1);
                }

                try {
                    await flevaclip.instance._private_._unload();
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Stage", from: `_root.remove${_type}`, error: bubbledError }, true);
                }
                delete _attachedFlevaClips[_attachedName];
            }

        }

        const getCurrentSceneName = function () {
            return heirarchy.scene.name;
        }
        const setCurrentSceneName = function (name) {
            heirarchy.scene.name = name;
        }
        const getCurrentScene = function () {
            return _library.scenes[heirarchy.scene.name];
        }






        const getScriptFromLibrary = function (_name) {
            _errorsM.checkScriptNotExist(_name);
            return _library.scripts[_name];
        }
        const getSpriteFromLibrary = function (_name) {
            _errorsM.checkSpriteNotExist(_name);
            return _library.sprites[_name];
        }
        const getSpriteSheetFromLibrary = function (_name) {
            _errorsM.checkSpriteSheetNotExist(_name);
            return _library.spritesheets[_name];
        }
        const getGraphicFromLibrary = function (_name) {
            _errorsM.checkGraphicNotExist(_name);
            return _library.graphics[_name];
        }
        const getPaintingFromLibrary = function (_name) {
            _errorsM.checkPaintingNotExist(_name);
            return _library.paintings[_name];
        }
        const getSoundFromLibrary = function (_name) {
            _errorsM.checkSoundNotExist(_name);
            return _library.sounds[_name];
        }



        const _tickEngine = async function () {
            if (MouseModule._private_._getCursorType() !== "default") MouseModule._private_._setCursorType("default");
            for (const _name of Object.keys(heirarchy.scripts)) {
                const _script = heirarchy.scripts[_name];
                try {
                    await _script.bind(_engineObj)(_engineObj);
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Stage", from: "stage's script", error: bubbledError, src: _script });
                }
            }

            for (const _name of Object.keys(_attachedFlevaClips)) {
                await _attachedFlevaClips[_name].instance._private_._tick();
            }

            if (getCurrentSceneName() !== "")
                await getCurrentScene()._private_._tick();

        }

        const vcam = new VirtualCamera();

        const _renderEngine = function () {
            _screen.clearScreen();

            _screen.ctx.save();
            _screen.ctx.scale(_screen.xScale, _screen.yScale);

            vcam._private_._projectCamera();

            if (getCurrentSceneName() !== "")
                getCurrentScene()._private_._render();

            for (const _name of Object.keys(mainStack.list)) {
                const flevaclip = mainStack.list[_name];
                flevaclip.render();
            }

            _screen.ctx.restore();
            _screen.ctx.restore();

            _screen._drawCursor();
        }

        const _runEngine = async function () {
            try {
                assetLoader.checkForAsyncAssets();

                if (MouseModule._private_._hasSelectedFlevaClip()) {
                    MouseModule._private_._clearMouseStates();
                    KeyModule._private_._clearKeyStates(true);
                }

                await _tickEngine();
                __privateProperties.currentLoopCycle++;

                MouseModule._private_._clearMouseStates();
                KeyModule._private_._clearKeyStates();


                if (__privateProperties.showingPage)
                    _renderEngine();

                if (__privateProperties.pageFocused)
                    await assetLoader.checkForSyncAssets();

                await _resolveBatch();
            } catch (bubbledError) {
                MetaModule.setFullscreen(false);
                DebugModule.bubbleError({ type: "Stage", from: "stage.onupdate", error: bubbledError }, true);
            }
        }

        const _startEngine = function () {
            if (getCurrentSceneName() !== "")
                getCurrentScene()._private_._start();

            for (const _name of Object.keys(_attachedFlevaClips)) {
                _attachedFlevaClips[_name].instance._private_._start();
            }
        }

        const _stopEngine = function () {
            for (const _name of Object.keys(_attachedFlevaClips)) {
                _attachedFlevaClips[_name].instance._private_._stop();
            }


            if (getCurrentSceneName() !== "")
                getCurrentScene()._private_._stop();
        }

        const startRunTime = async function (_fps) {
            _events.handleVisibilityChanged();
            try {
                await _loadEngine();
            } catch (bubbledError) {
                DebugModule.bubbleError(bubbledError, true);
            }

            __privateProperties.isRunTimeStarted = true;

            _startEngine();

            let oldLoopTime = performance.now();
            let engineFps = 0;
            let engineSpf = 0;

            const engineLoop = async () => {

                const spfNow = performance.now();

                await _runEngine();

                const newLoopTime = performance.now();

                engineSpf = Math.round((newLoopTime - spfNow) * 10) / 10000;
                engineFps = Math.round(1000 / ((newLoopTime - oldLoopTime) || 1));
                oldLoopTime = newLoopTime;
            }

            __privateProperties.runIDs.push(createLoop(true, engineLoop, { ms: 1000 / _fps, startNow: true, skipOlds: true }));

            __privateProperties.fpsIDs.push(createLoop(true, () => {
                __privateProperties.runitor.fps = engineFps;
                __privateProperties.runitor.spf = engineSpf;
            }, 1000));
        }
        const stopRunTime = function () {
            deleteLoop(...__privateProperties.runIDs, ...__privateProperties.fpsIDs);

            __privateProperties.runitor.fps = 0;
            __privateProperties.runitor.spf = 0;

            _stopEngine();

            __privateProperties.isRunTimeStarted = false;
        }
        const blockRunTime = function (seconds = 0) {
            return new Promise(resolve => {
                createTimeout(resolve, seconds * 1000);
            });
        }

        const _events = {
            cancelContextMenu(_event) { _event.preventDefault(); _event.stopPropagation(); },
            handleVisibilityChanged() {
                if (document.hidden) {
                    __privateProperties.showingPage = false;
                } else {
                    __privateProperties.showingPage = true;
                    if (!__privateProperties.pageFocused)
                        __privateProperties.pageFocused = true;
                }
            },
            resizeApp() {
                const defaultCW = _defaults.stage._width;
                const defaultCH = _defaults.stage._height;
                const width = _screen.div.clientWidth || _screen.div.offsetWidth || defaultCW;
                const height = _screen.div.clientHeight || _screen.div.offsetHeight || defaultCH;
                let _width = width;
                let _height = height;
                let left = 0;
                let top = 0;
                const canvRatio = defaultCW / defaultCH;
                const viewRatio = width / height;
                if (viewRatio < canvRatio) {
                    const heightRatio = defaultCW / defaultCH;
                    const newW = width;
                    const newH = width / heightRatio;
                    _width = newW;
                    _height = newH;
                    left = 0;
                    top = ((height - newH) / 2);
                } else if (viewRatio > canvRatio) {
                    const widthRatio = defaultCH / defaultCW;
                    const newW = height / widthRatio;
                    const newH = height;
                    _width = newW;
                    _height = newH;
                    left = ((width - newW) / 2);
                    top = 0;
                }

                let initialCanv;
                if (__privateProperties.isRunTimeStarted) initialCanv = _screen._copyCanvas(_screen.canvas);

                _screen.canvas.width = _width;
                _screen.canvas.height = _height;
                _screen.xScale = _width / defaultCW;
                _screen.yScale = _height / defaultCH;

                _screen.canvas.style.left = left + "px";
                _screen.canvas.style.top = top + "px";

                _screen.ctx.imageSmoothingEnabled = false;
                if (__privateProperties.isRunTimeStarted) _screen.ctx.drawImage(initialCanv, 0, 0, _screen.canvas.width, _screen.canvas.height);
            },
            fullscreenHandler() {
                if (!_screen._isFullscreen()) {
                    _screen.div.scrollIntoView();
                }
            },

            setMousePosition(_event) {
                let mouseX = MouseModule._private_._x;
                let mouseY = MouseModule._private_._y;
                let _movX = MouseModule._private_._movX;
                let _movY = MouseModule._private_._movY;
                if (!_screen._isPointerlock()) {
                    const rect = _screen.canvas.getBoundingClientRect(),
                        scaleX = _screen.canvas.width / rect.width,
                        scaleY = _screen.canvas.height / rect.height;

                    const movX = ((_event.clientX - rect.left) * scaleX / _screen.xScale);
                    const movY = ((_event.clientY - rect.top) * scaleY / _screen.yScale);
                    if (!helperUtils.isNull(mouseX))
                        _movX = movX - mouseX;
                    if (!helperUtils.isNull(mouseY))
                        _movY = movY - mouseY;
                    mouseX = movX;
                    mouseY = movY;
                } else {
                    _movX = (_event.movementX / _screen.xScale);
                    _movY = (_event.movementY / _screen.yScale);

                    let movementX = mouseX;
                    let movementY = mouseY;
                    movementX += _movX;
                    movementY += _movY;
                    if (_screen.lockPointer !== true) { 
                        if (movementX > _screen.canvas.width / _screen.xScale)
                            movementX = 0;
                        if (movementY > _screen.canvas.height / _screen.yScale)
                            movementY = 0;
                        if (movementX < 0)
                            movementX = _screen.canvas.width / _screen.xScale;
                        if (movementY < 0)
                            movementY = _screen.canvas.height / _screen.yScale;
                    } else {

                        if (movementX > _screen.canvas.width / _screen.xScale)
                            movementX = _screen.canvas.width / _screen.xScale;
                        if (movementY > _screen.canvas.height / _screen.yScale)
                            movementY = _screen.canvas.height / _screen.yScale;
                        if (movementX < 0)
                            movementX = 0;
                        if (movementY < 0)
                            movementY = 0;
                    }
                    mouseX = movementX;
                    mouseY = movementY;
                }
                MouseModule._private_._movX = Math.ceil(_movX);
                MouseModule._private_._movY = Math.ceil(_movY);
                MouseModule._private_._x = numberUtils.lock(Math.ceil(mouseX), 0, _defaults.stage._width);
                MouseModule._private_._y = numberUtils.lock(Math.ceil(mouseY), 0, _defaults.stage._height);
                vcam._private_._setMouseStagePositions();
            },
            setMouseDown(_event) {
                _events.setMousePosition(_event);
                if (_event.button === 0) {
                    if (MouseModule._private_._mouseList._left === undefined) MouseModule._private_._mouseList._left = true;
                    if (MouseModule._private_._mousePressed._left === undefined) this.setMousePressed(_event);
                } else if (_event.button === 1) {
                    if (MouseModule._private_._mouseList._middle === undefined) MouseModule._private_._mouseList._middle = true;
                    if (MouseModule._private_._mousePressed._middle === undefined) this.setMousePressed(_event);
                } else if (_event.button === 2) {
                    if (MouseModule._private_._mouseList._right === undefined) MouseModule._private_._mouseList._right = true;
                    if (MouseModule._private_._mousePressed._right === undefined) this.setMousePressed(_event);
                }
            },
            setMousePressed(_event) {
                if (_event.button === 0) {
                    MouseModule._private_._mousePressed._left = true;
                    MouseModule._private_._setMouseDownTarget();
                    MouseModule._private_._checkSelectedFlevaClip();
                } else if (_event.button === 1) {
                    MouseModule._private_._mousePressed._middle = true;
                } else if (_event.button === 2) {
                    MouseModule._private_._mousePressed._right = true;
                }
            },
            setMouseUp(_event) {
                if (_event.button === 0) {
                    if (MouseModule._private_._mouseList._left) delete MouseModule._private_._mouseList._left;
                    if (!helperUtils.isUndefined(MouseModule._private_._mousePressed._left)) {
                        if (__privateProperties.isRunTimeStarted)
                            if (helperUtils.isBoolean(MouseModule._private_._mousePressed._left) && helperUtils.isUndefined(MouseModule._private_._mouseReleased._left)) this.setMouseReleased(_event);
                        delete MouseModule._private_._mousePressed._left;
                    }
                } else if (_event.button === 1) {
                    if (MouseModule._private_._mouseList._middle) delete MouseModule._private_._mouseList._middle;
                    if (!helperUtils.isUndefined(MouseModule._private_._mousePressed._middle)) {
                        if (__privateProperties.isRunTimeStarted)
                            if (helperUtils.isBoolean(MouseModule._private_._mousePressed._middle) && helperUtils.isUndefined(MouseModule._private_._mouseReleased._middle)) this.setMouseReleased(_event);
                        delete MouseModule._private_._mousePressed._middle;
                    }
                } else if (_event.button === 2) {
                    if (MouseModule._private_._mouseList._right) delete MouseModule._private_._mouseList._right;
                    if (!helperUtils.isUndefined(MouseModule._private_._mousePressed._right)) {
                        if (__privateProperties.isRunTimeStarted)
                            if (helperUtils.isBoolean(MouseModule._private_._mousePressed._right) && helperUtils.isUndefined(MouseModule._private_._mouseReleased._right)) this.setMouseReleased(_event);
                        delete MouseModule._private_._mousePressed._right;
                    }
                }
            },
            setMouseReleased(_event) {
                if (_event.button === 0) {
                    MouseModule._private_._mouseReleased._left = true;
                    MouseModule._private_._setMouseUpTarget();
                } else if (_event.button === 1) {
                    MouseModule._private_._mouseReleased._middle = true;
                } else if (_event.button === 2) {
                    MouseModule._private_._mouseReleased._right = true;
                }
            },
            setMouseLeave(_event) {
                if (__privateProperties.isRunTimeStarted) {
                    if (MouseModule._private_._mouseList._left !== undefined) delete MouseModule._private_._mouseList._left;
                    if (MouseModule._private_._mousePressed._left !== undefined) delete MouseModule._private_._mousePressed._left;
                    if (MouseModule._private_._mouseReleased._left !== undefined) delete MouseModule._private_._mouseReleased._left;

                    if (MouseModule._private_._mouseList._middle !== undefined) delete MouseModule._private_._mouseList._middle;
                    if (MouseModule._private_._mousePressed._middle !== undefined) delete MouseModule._private_._mousePressed._middle;
                    if (MouseModule._private_._mouseReleased._middle !== undefined) delete MouseModule._private_._mouseReleased._middle;

                    if (MouseModule._private_._mouseList._right !== undefined) delete MouseModule._private_._mouseList._right;
                    if (MouseModule._private_._mousePressed._right !== undefined) delete MouseModule._private_._mousePressed._right;
                    if (MouseModule._private_._mouseReleased._right !== undefined) delete MouseModule._private_._mouseReleased._right;
                }
            },
            setKeyDown(_event) {
                _event.preventDefault();

                const keyCode = "code_" + _event.keyCode;
                const keyName = "name_" + _event.key.toLowerCase();
                if (KeyModule._private_._keysList[keyCode] === undefined) KeyModule._private_._keysList[keyCode] = true;
                if (KeyModule._private_._keysList[keyName] === undefined) KeyModule._private_._keysList[keyName] = true;

                if (KeyModule._private_._keysPressed[keyCode] === undefined) KeyModule._private_._keysPressed[keyCode] = true;
                if (KeyModule._private_._keysPressed[keyName] === undefined) KeyModule._private_._keysPressed[keyName] = true;
            },
            setKeyUp(_event) {
                const keyCode = "code_" + _event.keyCode;
                const keyName = "name_" + _event.key.toLowerCase();
                if (KeyModule._private_._keysList[keyCode]) delete KeyModule._private_._keysList[keyCode];
                if (KeyModule._private_._keysList[keyName]) delete KeyModule._private_._keysList[keyName];

                if (KeyModule._private_._keysPressed[keyCode] !== undefined) {
                    if (__privateProperties.isRunTimeStarted)
                        if (helperUtils.isBoolean(KeyModule._private_._keysPressed[keyCode]) && KeyModule._private_._keysReleased[keyCode] === undefined)
                            KeyModule._private_._keysReleased[keyCode] = true;
                    delete KeyModule._private_._keysPressed[keyCode];
                }
                if (KeyModule._private_._keysPressed[keyName] !== undefined) {
                    if (__privateProperties.isRunTimeStarted)
                        if (helperUtils.isBoolean(KeyModule._private_._keysPressed[keyName]) && KeyModule._private_._keysReleased[keyName] === undefined)
                            KeyModule._private_._keysReleased[keyName] = true;
                    delete KeyModule._private_._keysPressed[keyName];
                }
            }
        }

        const _loadEngine = async function () {
            document.addEventListener("visibilitychange", _events.handleVisibilityChanged.bind(_events), false);

            window.addEventListener("resize", _events.resizeApp.bind(_events), false);

            _screen.div.addEventListener('fullscreenchange', _events.fullscreenHandler.bind(_events), false);
            _screen.div.addEventListener('mozfullscreenchange', _events.fullscreenHandler.bind(_events), false);
            _screen.div.addEventListener('MSFullscreenChange', _events.fullscreenHandler.bind(_events), false);
            _screen.div.addEventListener('webkitfullscreenchange', _events.fullscreenHandler.bind(_events), false);

            _screen.div.addEventListener('contextmenu', _events.cancelContextMenu.bind(_events));
            _screen.div.addEventListener('mousemove', _events.setMousePosition.bind(_events), false);
            _screen.div.addEventListener('mousedown', _events.setMouseDown.bind(_events), true);
            _screen.div.addEventListener('mouseup', _events.setMouseUp.bind(_events), false);
            _screen.div.addEventListener('mouseleave', _events.setMouseLeave.bind(_events), false);
            _screen.div.addEventListener("keydown", _events.setKeyDown.bind(_events), true);
            _screen.div.addEventListener("keyup", _events.setKeyUp.bind(_events), false);
            _screen.div.onselectstart = function () { return false; }

            const style = document.createElement('style');
            style.innerHTML = `
        *,
        *::before,
        *::after {
          /*box-sizing: border-box;*/
        }
        `;
            const ref = document.querySelector('script');
            ref.parentNode.insertBefore(style, ref);

            if (inits.length > 0)
                for (const init of Object.keys(inits)) {
                    const _init = inits[init];
                    try {
                        const fini = await _init.bind(_engineObj)(_engineObj);
                        if (_commandUtils.isScription(fini)) {
                            const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(fini), _engineScope, _engineObj);
                            finis.push(flevaScript);
                            finis[finis.length - 1].FLN = initLineNumber;
                        }
                    } catch (bubbledError) {
                        DebugModule.bubbleError({ type: "Stage", from: "stage.onload", error: bubbledError, src: initLineNumber || _init });
                    }
                }

            if (_defaults.loadAssets)
                await assetLoader.loadAssets();
        }
        const _engineScope = {};
        const __unloadEngine = async function () {
            stopRunTime();
            if (finis.length > 0) {
                for (const fini of Object.keys(finis)) {
                    const _fini = finis[fini];
                    await _fini.bind(_engineObj)(_engineObj);
                }
                finis.length = 0;
            }

            document.removeEventListener("visibilitychange", _events.handleVisibilityChanged);

            window.removeEventListener("resize", _events.resizeApp);

            _screen.div.removeEventListener('fullscreenchange', _events.fullscreenHandler.bind(_events));
            _screen.div.removeEventListener('mozfullscreenchange', _events.fullscreenHandler.bind(_events));
            _screen.div.removeEventListener('MSFullscreenChange', _events.fullscreenHandler.bind(_events));
            _screen.div.removeEventListener('webkitfullscreenchange', _events.fullscreenHandler.bind(_events));

            _screen.div.removeEventListener('contextmenu', _events.cancelContextMenu.bind(_events));
            _screen.div.removeEventListener('mousemove', _events.setMousePosition.bind(_events));
            _screen.div.removeEventListener('mousedown', _events.setMouseDown.bind(_events));
            _screen.div.removeEventListener('mouseup', _events.setMouseUp.bind(_events));
            _screen.div.removeEventListener('mouseleave', _events.setMouseLeave.bind(_events));
            _screen.div.removeEventListener("keydown", _events.setKeyDown.bind(_events));
            _screen.div.removeEventListener("keyup", _events.setKeyUp.bind(_events));
            _screen.div.onselectstart = null;
        }


        const MetaModule = {
            clipboard: "",
            get version() { return _defaults.engine.version; },
            get loops() { return _loopManager.loops; },
            get FLEVAR_ENV() { return _defaults.flevar_env; },
            get takeScreenshot() { return _screen.takeScreenshot.bind(_screen); },
            get setFullscreen() { return _screen.setFullscreen.bind(_screen); },
            get FPS() { return __privateProperties.runitor.fps },
            get SPF() { return __privateProperties.runitor.spf },
        }
        const MouseModule = (function MouseModule() {
            const _mouseList = {}, _mousePressed = {}, _mouseReleased = {};
            let isHidden = false;

            const LEFT = 0;
            const MIDDLE = 1;
            const RIGHT = 2;
            const isDown = function (_key) {
                if (typeof _key === "string") _key = _key.toLowerCase();

                if (_key === "left" || _key === LEFT) return _mouseList._left === true;
                if (_key === "middle" || _key === MIDDLE) return _mouseList._middle === true;
                if (_key === "right" || _key === RIGHT) return _mouseList._right === true;
                return false;
            }
            const isUp = function (_key) {
                return !isDown(_key);
            }
            const isPressed = function (_key) {
                if (typeof _key === "string") _key = _key.toLowerCase();

                if (_key === "left" || _key === LEFT) return _mousePressed._left === true;
                if (_key === "middle" || _key === MIDDLE) return _mousePressed._middle === true;
                if (_key === "right" || _key === RIGHT) return _mousePressed._right === true;
                return false;
            }
            const isReleased = function (_key) {
                if (typeof _key === "string") _key = _key.toLowerCase();

                if (_key === "left" || _key === LEFT) return _mouseReleased._left === true;
                if (_key === "middle" || _key === MIDDLE) return _mouseReleased._middle === true;
                if (_key === "right" || _key === RIGHT) return _mouseReleased._right === true;
                return false;
            }
            const show = function () {
                if (isHidden) isHidden = false;
                _setCursorType("default");
            }
            const hide = function () {
                if (!isHidden) isHidden = true;
                _setCursorType("none");
            }
            const lock = function (type) {
                _screen.openPointerlock(type);
            }
            const unlock = function () {
                _screen.closePointerlock();
            }
            const _setCursorType = function (_value) {
                if (isHidden)
                    _screen.div.style.cursor = "none";
                else
                    _screen.div.style.cursor = _value;
            }
            const _getCursorType = function (_value) {
                return _screen.div.style.cursor;
            }

            let mouseIsDownOn = undefined;
            let _selectedFlevaClip = undefined;
            const emptyTarget = { _private_: {} };
            const _getMouseOverTarget = () => {
                const stack = [...mainStack.list].reverse();
                for (const { instance } of Object.values(stack))
                    if (instance._private_._setSelection || instance._private_._hasOnPress())
                        if (instance._private_._isMouseInFlevaClip())
                            return instance;
                return emptyTarget;
            }

            const _private_ = {
                _x: null, _y: null,
                _movX: 0, _movY: 0,
                _stageX: null, _stageY: null,
                _mouseList, _mousePressed, _mouseReleased,

                _clearMouseStates() {
                    for (const _key of Object.keys(_mousePressed)) {
                        if (_mousePressed[_key] === true) _mousePressed[_key] = false;
                    }
                    for (const _key of Object.keys(_mouseReleased)) {
                        delete _mouseReleased[_key];
                    }
                    this._movX = 0;
                    this._movY = 0;
                },
                _expireMousePressedStates() {
                    for (const _key of Object.keys(_mousePressed))
                        _mousePressed[_key] = "expired";
                },
                _checkSelectedFlevaClip() {
                    this._clearSelectedFlevaClip();

                    const instance = _getMouseOverTarget();
                    if (instance._private_._setSelection)
                        this._setSelectedFlevaClip(instance._private_._setSelection());

                    if (this._hasSelectedFlevaClip()) {
                        this._clearMouseStates();
                        KeyModule._private_._clearKeyStates();
                    }
                },
                _clearSelectedFlevaClip() {
                    if (this._hasSelectedFlevaClip()) this._setSelectedFlevaClip(_selectedFlevaClip());
                },
                _setSelectedFlevaClip(_state) {
                    _selectedFlevaClip = _state;
                },
                _hasSelectedFlevaClip() {
                    return _selectedFlevaClip !== undefined;
                },
                async _emitClick(target) {
                    const func = _commandUtils.getScription(target.onClick);
                    try {
                        if (_commandUtils.isScription(func))
                            await func.bind(target)(target);
                    } catch (bubbledError) {
                        const type = target.type;
                        DebugModule.bubbleError({ type: type.replace(/^./, type[0].toUpperCase()), from: `${type}.onClick`, error: bubbledError, src: func.FLN || func });
                    }
                },
                _setMouseUpTarget() {
                    const mouseIsUpOn = _getMouseOverTarget();

                    if (mouseIsDownOn === mouseIsUpOn) {
                        addToBatch(this._emitClick, mouseIsUpOn);
                    }

                    mouseIsDownOn = undefined;
                },
                _setMouseDownTarget() {
                    mouseIsDownOn = _getMouseOverTarget();
                },
                _getMouseHoverTarget() {
                    return helperUtils.isUndefined(mouseIsDownOn) ? _getMouseOverTarget() : mouseIsDownOn;
                },
                _setCursorType, _getCursorType
            }

            const _returns_ = new _constructors.Mouse({
                isDown, isUp,
                isPressed, isReleased,
                show, hide,
                lock, unlock,
                LEFT, MIDDLE, RIGHT
            });
            Object.defineProperties(_returns_, {
                _private_: {
                    get() { return _private_ },
                    enumerable: false,
                    configurable: false
                },
                _visible: {
                    get() { return !isHidden },
                    enumerable: false,
                    configurable: false
                }
            });

            return _returns_;
        })();
        const KeyModule = (function KeyModule() {
            const _keysList = {}, _keysPressed = {}, _keysReleased = {};
            const CODES = {
                ALT: 18,
                BACKSPACE: 8,
                CAPSLOCK: 20,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                PGDN: 34,
                PGUP: 33,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
            }

            const DIGITS = {
                ZERO: 48,
                ONE: 49,
                TWO: 50,
                THREE: 51,
                FOUR: 52,
                FIVE: 53,
                SIX: 54,
                SEVEN: 55,
                EIGHT: 56,
                NINE: 57
            }

            const ALPHABET = {
                A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90
            }
            const MAP = Object.entries({ ...CODES, ...DIGITS }).reduce(function (_obj, _entry) {
                _obj[_entry[0].toLowerCase()] = _entry[1];
                return _obj;
            }, {});

            const isDown = function (_key) {
                if (typeof _key === "string") {
                    _key = _key.toLowerCase();
                    if (MAP[_key]) _key = MAP[_key];
                }

                const keyDown = _keysList['code_' + _key] || _keysList['name_' + _key] || false;
                return keyDown === true;
            }
            const isUp = function (_key) {
                return !isDown(_key);
            }
            const isPressed = function (_key) {
                if (typeof _key === "string") {
                    _key = _key.toLowerCase();
                    if (MAP[_key]) _key = MAP[_key];
                }

                const keysPressed = _keysPressed['code_' + _key] || _keysPressed['name_' + _key] || false;
                return keysPressed === true;
            }
            const isReleased = function (_key) {
                if (typeof _key === "string") {
                    _key = _key.toLowerCase();
                    if (MAP[_key]) _key = MAP[_key];
                }

                const keyReleased = _keysReleased['code_' + _key] || _keysReleased['name_' + _key] || false;
                return keyReleased === true;
            }

            const _private_ = {
                _keysList, _keysPressed, _keysReleased,
                _clearKeyStates(absolute) {
                    for (const _key of Object.keys(_keysPressed))
                        if (_keysPressed[_key] === true) _keysPressed[_key] = false;
                    for (const _key of Object.keys(_keysReleased))
                        delete _keysReleased[_key];
                    if (absolute)
                        for (const _key of Object.keys(_keysList))
                            delete _keysList[_key];
                },
                _expireKeyPressedStates() {
                    for (const _key of Object.keys(_keysPressed))
                        _keysPressed[_key] = "expired";
                }
            }

            const _returns_ = new _constructors.Key({
                isDown, isUp,
                isPressed, isReleased,
                ...CODES,
                ...ALPHABET,
                ...DIGITS
            });
            Object.defineProperties(_returns_, {
                _private_: {
                    get() { return _private_ },
                    enumerable: false,
                    configurable: false
                }
            });

            return _returns_;
        })();
        const SoundComponent = (function SoundComponent() {
            let sounds = _library.sounds;
            let masterVolume = 1;
            const _Sound = function (_name, { _path = _defaults.soundPath, _type = _defaults.soundType, _name: _mName, _src, _volume = 100, _loop = false } = {}) {
                const name = _mName || _name;
                const src = _src ? _src : `${_path}/${name}.${_type}`;

                const assetSource = new _defaults.Audio();
                assetSource.crossOrigin = "anonymous";
                assetSource.preload = false;
                assetSource.hasLoaded = undefined;
                assetSource.rawsrc = src;

                const tempVolume = _validateVolume(_volume);

                assetSource.loadSource = function () {
                    return new Promise((resolve, reject) => {
                        if (helperUtils.isDefined(assetSource.hasLoaded)) return resolve();
                        assetSource.hasLoaded = "loading";

                        assetSource.onended = () => _onStop(_name);
                        assetSource.onloadeddata = function () {
                            if ([true, false].includes(assetSource.hasLoaded)) return;
                            assetSource.hasLoaded = true;
                            resolve();
                        }

                        assetSource.onerror = async function () {
                            if ([true, false].includes(assetSource.hasLoaded)) return;
                            console.warn(`Sound load for "${_name}" failed.`);
                            assetSource.hasLoaded = false;
                            resolve();
                        }

                        assetSource.volume = tempVolume * masterVolume;

                        assetSource.loop = _loop;

                        assetSource.src = src;
                    });
                }

                const soundSource = new SoundSource(_name, assetSource);

                const _returns_ = new _constructors.Sound({ idName: _name, assetSource, soundSource });
                _returns_.volume = tempVolume;

                return _returns_;
            }

            class SoundSource {
                constructor(name, src) {
                    this._name = name;
                    this._src = src;
                    this.type = helperUtils.typeOf(_constructors.Sound);
                }
                async play() {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        if (!this._src.hasLoaded) throw "Sound file not loaded.";

                        await this._src.play();
                    } catch (e) {
                        return _emitError(`Cannot play "${this._name}": ${e.msg || e}`, functionLineNumber, "play");
                    }
                }
                pause() {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        if (!this._src.hasLoaded) throw "Sound file not loaded.";

                        this._src.pause();
                    } catch (e) {
                        return _emitError(`Cannot pause "${this._name}": ${e.msg || e}`, functionLineNumber, "pause");
                    }
                }
                stop() {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        if (!this._src.hasLoaded) throw "Sound file not loaded.";

                        if (!this._src.paused)
                            this._src.pause();

                        this._src.currentTime = 0;
                        this._src.loop = false;

                        _onStop(this._name);
                    } catch (e) {
                        return _emitError(`Cannot stop "${this._name}": ${e.msg || e}`, functionLineNumber, "stop");
                    }
                }
                async restart() {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        if (!this._src.hasLoaded) throw "Sound file not loaded.";

                        if (!this._src.paused)
                            this._src.pause();

                        this._src.currentTime = 0;

                        await this._src.play();
                    } catch (e) {
                        return _emitError(`Cannot restart "${this._name}": ${e.msg || e}`, functionLineNumber, "restart");
                    }
                }
                seekForward(time) {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        if (!this._src.hasLoaded) throw "Sound file not loaded.";

                        const { currentTime, duration } = this._src;
                        time = (currentTime + time) > duration ? duration - currentTime : time;
                        this._src.currentTime += time;
                    } catch (e) {
                        return _emitError(`Cannot let "${this._name}" go forward: ${e.msg || e}`, functionLineNumber, "seekForward");
                    }
                }
                seekBackward(time) {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        if (!this._src.hasLoaded) throw "Sound file not loaded.";

                        const { currentTime } = this._src;
                        time = (currentTime - time) < 0 ? currentTime : time;
                        this._src.currentTime -= time;
                    } catch (e) {
                        return _emitError(`Cannot let "${this._name}" go backward: ${e.msg || e}`, functionLineNumber, "seekBackward");
                    }
                }

                async playLoop() {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        if (!this._src.hasLoaded) throw "Sound file not loaded.";

                        await this._src.play();
                        this._src.loop = true;
                    } catch (e) {
                        return _emitError(`Cannot play "${this._name}": ${e.msg || e}`, functionLineNumber, "playLoop");
                    }
                }
                async playOnce() {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        if (!this._src.hasLoaded) throw "Sound file not loaded.";

                        this._src.pause();
                        this._src.currentTime = 0;
                        await this._src.play();
                        this._src.loop = false;
                    } catch (e) {
                        return _emitError(`Cannot play "${this._name}": ${e.msg || e}`, functionLineNumber, "playOnce");
                    }
                }
                playClone({ _volume, onend } = {}) {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        if (!this._src.hasLoaded) throw "Sound file not loaded.";

                        return new Promise((resolve, reject) => {
                            const assetSource = new _defaults.Audio();
                            assetSource.crossOrigin = "anonymous";
                            assetSource.preload = false;
                            assetSource.hasLoaded = undefined;
                            assetSource.onended = function () {
                                if (_commandUtils.isScription(onend))
                                    _commandUtils.getScription(onend)();
                                assetSource.src = "";
                            }
                            assetSource.oncanplaythrough = async function () {
                                assetSource.hasLoaded = true;
                                await assetSource.play();
                                resolve();
                            }

                            assetSource.onerror = async function () {
                                if (!assetSource.hasLoaded) {
                                    console.warn(`Sound load for "${this._name}" clone failed.`);
                                    assetSource.hasLoaded = false;
                                }
                                resolve();
                            }

                            assetSource.volume = (_volume !== undefined ? _volume : this._src.volume);

                            assetSource.loop = false;

                            assetSource.src = this._src.rawsrc;
                        });
                    } catch (e) {
                        return _emitError(`Cannot play "${this._name}" clone: ${e.msg || e}`, functionLineNumber, "playClone");
                    }
                }
                async duplicate(_newName, { _volume, _loop } = {}) {
                    const functionLineNumber = DebugModule.getLineNumber(2);
                    try {
                        const sound = sounds[this._name];

                        let newName;
                        if (_newName) {
                            newName = _newName;
                            _errorsM.checkSoundExist(newName);
                        } else newName = _generateSymbolName("sound");

                        sounds[newName] = _Sound(newName, { _src: sound.assetSource.rawsrc, _volume: (_volume !== undefined ? _volume : sound.volume * 100), _loop: (_loop !== undefined ? _loop : sound.assetSource.loop) });

                        await sounds[newName].assetSource.loadSource();


                        return newName;
                    } catch (e) {
                        return _emitError(`Cannot duplicate "${this._name}": ${e.msg || e}`, functionLineNumber, "duplicate");
                    }
                }
                mute() {
                    this._src.muted = true;
                }
                unmute() {
                    this._src.muted = false;
                }
                get _volume() {
                    const sound = sounds[this._name];
                    return sound.volume * 100;
                }
                set _volume(_volume) {
                    const sound = sounds[this._name];

                    const tempVolume = _validateVolume(_volume);

                    sound.volume = tempVolume;

                    sound.assetSource.volume = sound.volume * masterVolume;
                }
                get hasLoaded() {
                    return this._src.hasLoaded;
                }
                get _loop() {
                    return this._src.loop;
                }
                set _loop(_value) {
                    this._src.loop = _value;
                }
                get _time() {
                    return this._src.currentTime;
                }
                set _time(_value) {
                    this._src.currentTime = _value;
                }
                get _paused() {
                    return this._src.paused;
                }
                get _muted() {
                    return this._src.muted;
                }
                get _duration() {
                    return this._src.duration;
                }
            }

            const _emitError = function (error, FLN, name = "unknown") {
                if (helperUtils.isString(error)) error = error.replace(": ", ":\n  ");
                if (_commandUtils.isScription(getSoundClip.onError)) {
                    _commandUtils.getScription(getSoundClip.onError)(error);
                } else {
                    DebugModule.bubbleError({ type: "Sound", from: `sound.${name}`, error, src: FLN });
                }
            }

            const _onStop = function (name) {
            }

            const _validateVolume = function (val) {
                return numberUtils.lock(parseInt(val) || 0, 0, 100) / 100;
            }

            const _validateSound = function (nameOrSound, ignoreLoaded) {
                const name = helperUtils.isSound(nameOrSound) ? nameOrSound.idName : nameOrSound;

                if (!sounds[name]) {
                    throw ({ msg: "Sound file does not exist." });
                } else if (sounds[name].assetSource.hasLoaded !== true && !ignoreLoaded) {
                    throw "Sound file not loaded.";
                }

                return sounds[name];
            }

            const create = function (_name, _config) {
                const functionLineNumber = DebugModule.getLineNumber(2);
                try {
                    _errorsM.checkSoundExist(_name);
                    sounds[_name] = _Sound(_name, _config);
                    assetLoader.asyncQueue(_name, sounds[_name].assetSource, helperUtils.typeOf(_constructors.Sound));
                } catch (e) {
                    return _emitError(`Cannot create "${_name}": ${e.msg || e}`, functionLineNumber, "create");
                }
            }

            const getVolume = function () {
                return masterVolume * 100;
            }

            const setVolume = function (_volume) {
                const tempVolume = _validateVolume(_volume);
                masterVolume = tempVolume;

                for (const sound of Object.values(sounds))
                    sound.assetSource.volume = sound.volume * masterVolume;
            }


            const getSoundClip = function (_name) {
                const functionLineNumber = DebugModule.getLineNumber(2);
                try {
                    const sound = _validateSound(_name, true);

                    return sound.soundSource;
                } catch (e) {
                    return _emitError(`Cannot get "${_name}" sound clip: ${e.msg || e}`, functionLineNumber, "GetSound");
                }
            }

            const _returns_ = new _constructors.Sound({
                create,
                getVolume,
                setVolume,
                getSoundClip
            });

            return _returns_;
        })();
        const SoundModule = SoundComponent.getSoundClip;
        SoundModule.type = helperUtils.typeOf(_constructors.Sound);
        Object.defineProperty(SoundModule, 'constructor', { value: _constructors.Sound }); 
        Object.defineProperty(SoundModule, '_volume', { get: SoundComponent.getVolume, set: SoundComponent.setVolume }); 

        const SharedObjectModule = (function SharedObjectModule() {
            const LS = "localstorage";
            const IDB = "indexeddb";
            const drivers = {};
            const driver = (!window.indexedDB || _defaults.autosave) ? LS : IDB;

            const signData = (data) => _commandUtils.flatted.stringify(data);
            const unsignData = (data) => _commandUtils.flatted.parse(data);

            const persistedObjects = {};

            const persistObject = function (_objectName, _objectData, _objectFlush, _objectClear, _objectGetSize) {
                if (persistedObjects[_objectName]) return;
                persistedObjects[_objectName] = {
                    data: _objectData,
                    flush: _objectFlush,
                    clear: _objectClear,
                    getSize: _objectGetSize
                }
            }

            const asyncQueue = {};
            const addToQueue = function (key) {
                asyncQueue[key] = key;
            }
            const removeFromQueue = function (key) {
                delete asyncQueue[key];
            }
            const flushObjects = async function () {
                for (const _objectName of Object.keys(persistedObjects))
                    await persistedObjects[_objectName].flush();
            }

            const promptSave = function (e) {
                if (objectUtils.objectLength(asyncQueue) === 0) return;
                e.preventDefault();
                e.returnValue = '';
            }

            if (driver === LS)
                window.addEventListener("beforeunload", flushObjects);
            if (driver === IDB)
                window.addEventListener("beforeunload", promptSave);

            drivers[LS] = (function () {
                const getLocal = function (_objectName) {
                    return new Promise(async (resolve, reject) => {
                        if (!helperUtils.isString(_objectName)) return resolve(null);
                        const objectName = `flevar_ls_${_objectName}`;
                        let data = {};
                        let flush;
                        let clear;
                        let getSize;
                        if (persistedObjects[objectName]) {
                            data = persistedObjects[objectName].data;
                            flush = persistedObjects[objectName].flush;
                            clear = persistedObjects[objectName].clear;
                            getSize = persistedObjects[objectName].getSize;
                        } else {
                            const value = localStorage.getItem(objectName);
                            if (value) data = unsignData(value);

                            flush = function () {
                                return new Promise(async (resolve, reject) => {
                                    try {
                                        if (objectUtils.objectLength(data) > 0)
                                            localStorage.setItem(objectName, signData(data));
                                        else
                                            await clear();
                                        resolve(true);
                                    } catch {
                                        resolve(false);
                                    }
                                });
                            }

                            clear = function () {
                                return new Promise(async (resolve, reject) => {
                                    try {
                                        objectUtils.emptyObject(data);
                                        localStorage.removeItem(objectName);
                                        resolve(true);
                                    } catch {
                                        resolve(false);
                                    }
                                });
                            }

                            getSize = function () {
                                return new Blob([signData(data)]).size;
                            }
                        }

                        persistObject(objectName, data, flush, clear, getSize);

                        const _returns_ = new _constructors.SharedObject();
                        Object.defineProperties(_returns_, {
                            data: {
                                get() { return data },
                                enumerable: true,
                                configurable: false
                            },
                            flush: {
                                get() { return flush },
                                enumerable: false,
                                configurable: false
                            },
                            clear: {
                                get() { return clear },
                                enumerable: false,
                                configurable: false
                            },
                            getSize: {
                                get() { return getSize },
                                enumerable: false,
                                configurable: false
                            }
                        });

                        resolve(_returns_);
                    });
                }
                return {
                    getLocal
                }
            })();
            drivers[IDB] = (function () {
                const idbStorage = {
                    DB_NAME: "flevar_idb",
                    DB_STORE_NAME: "idbStorage",
                    READ_ONLY: 'readonly',
                    READ_WRITE: 'readwrite',
                    DATABASE: undefined,
                    _openDB: async function () {
                        return new Promise((resolve, reject) => {
                            if (!!idbStorage.DATABASE) return resolve();
                            let request = indexedDB.open(idbStorage.DB_NAME);
                            request.onupgradeneeded = (event) => {
                                idbStorage.DATABASE = event.target.result;
                                idbStorage.DATABASE.onerror = function (event) {
                                    console.error("Database error: " + event.target.errorCode);
                                };
                                const store = idbStorage.DATABASE.createObjectStore(idbStorage.DB_STORE_NAME);
                                store.transaction.oncomplete = function () {
                                    resolve();
                                }
                            }

                            request.onsuccess = function (event) {
                                idbStorage.DATABASE = event.target.result;
                                idbStorage.DATABASE.onerror = function (event) {
                                    console.error("Database error: " + event.target.errorCode);
                                };
                                resolve();
                            };
                            request.onerror = function (event) {
                                console.error("Why didn't you allow my web app to use IndexedDB?!");
                                reject("Why didn't you allow my web app to use IndexedDB?!");
                            };
                        });
                    },
                    _closeDB() {
                        if (!idbStorage.DATABASE) return;
                        idbStorage.DATABASE.close();
                        idbStorage.DATABASE = undefined;
                    },
                    _handleItemQuery(ranID, response, ...params) {
                        removeFromQueue(ranID);
                        idbStorage._closeDB();
                        response(...params);
                    },
                    _createTransaction(mode) {
                        return new Promise(async (resolve, reject) => {
                            await idbStorage._openDB();
                            resolve(idbStorage.DATABASE.transaction(idbStorage.DB_STORE_NAME, mode));
                        });
                    },
                    getItem(key) {
                        return new Promise(async (resolve, reject) => {
                            const ranID = _generateSymbolName("idbqueue");
                            addToQueue(ranID);
                            try {
                                const transaction = await idbStorage._createTransaction(idbStorage.READ_ONLY);
                                const store = transaction.objectStore(idbStorage.DB_STORE_NAME);
                                const req = store.get(key);

                                req.onsuccess = () => {
                                    let value = req.result;
                                    if (value === undefined) {
                                        value = null;
                                    }
                                    idbStorage._handleItemQuery(ranID, resolve, value);
                                };

                                req.onerror = () => {
                                    idbStorage._handleItemQuery(ranID, reject, req.error);
                                };
                            } catch (e) {
                                idbStorage._handleItemQuery(ranID, reject, e);
                            }
                        });
                    },
                    setItem(key, value) {
                        return new Promise(async (resolve, reject) => {
                            const ranID = _generateSymbolName("idbqueue");
                            addToQueue(ranID);
                            try {
                                const transaction = await idbStorage._createTransaction(idbStorage.READ_WRITE);
                                const store = transaction.objectStore(idbStorage.DB_STORE_NAME);
                                if (value === null) {
                                    value = undefined;
                                }
                                const req = store.put(value, key);

                                transaction.oncomplete = () => {
                                    idbStorage._handleItemQuery(ranID, resolve);
                                };
                                transaction.onabort = transaction.onerror = () => {
                                    const err = req.error
                                        ? req.error
                                        : req.transaction.error;
                                    idbStorage._handleItemQuery(ranID, reject, err);
                                };
                            } catch (e) {
                                idbStorage._handleItemQuery(ranID, reject, e);
                            }
                        });
                    },
                    removeItem(key) {
                        return new Promise(async (resolve, reject) => {
                            const ranID = _generateSymbolName("idbqueue");
                            addToQueue(ranID);
                            try {
                                const transaction = await idbStorage._createTransaction(idbStorage.READ_WRITE);
                                const store = transaction.objectStore(idbStorage.DB_STORE_NAME);

                                const req = store.delete(key);
                                transaction.oncomplete = () => {
                                    idbStorage._handleItemQuery(ranID, resolve);
                                };

                                transaction.onerror = () => {
                                    idbStorage._handleItemQuery(ranID, reject, req.error);
                                };

                                transaction.onabort = () => {
                                    const err = req.error
                                        ? req.error
                                        : req.transaction.error;
                                    idbStorage._handleItemQuery(ranID, reject, err);
                                };
                            } catch (e) {
                                idbStorage._handleItemQuery(ranID, reject, e);
                            }
                        });
                    }
                }
                const getLocal = function (_objectName) {
                    return new Promise(async (resolve, reject) => {
                        if (!helperUtils.isString(_objectName)) return resolve(null);
                        const objectName = `flevar_idb_${_objectName}`;
                        let data = {};
                        let flush;
                        let clear;
                        let getSize;
                        if (persistedObjects[objectName]) {
                            data = persistedObjects[objectName].data;
                            flush = persistedObjects[objectName].flush;
                            clear = persistedObjects[objectName].clear;
                            getSize = persistedObjects[objectName].getSize;
                        } else {
                            const value = await idbStorage.getItem(objectName);
                            if (value) data = unsignData(value);

                            flush = function () {
                                return new Promise(async (resolve, reject) => {
                                    try {
                                        if (objectUtils.objectLength(data) > 0)
                                            await idbStorage.setItem(objectName, signData(data));
                                        else
                                            await clear();
                                        resolve(true);
                                    } catch {
                                        resolve(false);
                                    }
                                });
                            }

                            clear = function () {
                                return new Promise(async (resolve, reject) => {
                                    try {
                                        objectUtils.emptyObject(data);
                                        await idbStorage.removeItem(objectName);
                                        resolve(true);
                                    } catch {
                                        resolve(false);
                                    }
                                });
                            }

                            getSize = function () {
                                return new Blob([signData(data)]).size;
                            }
                        }

                        persistObject(objectName, data, flush, clear, getSize);

                        const _returns_ = new _constructors.SharedObject();
                        Object.defineProperties(_returns_, {
                            data: {
                                get() { return data },
                                enumerable: true,
                                configurable: false
                            },
                            flush: {
                                get() { return flush },
                                enumerable: false,
                                configurable: false
                            },
                            clear: {
                                get() { return clear },
                                enumerable: false,
                                configurable: false
                            },
                            getSize: {
                                get() { return getSize },
                                enumerable: false,
                                configurable: false
                            }
                        });

                        resolve(_returns_);
                    });
                }
                return {
                    getLocal
                }
            })();

            const _returns_ = new _constructors.SharedObject({
                ...drivers[driver],
                flush: flushObjects,
                driver
            });

            return _returns_;
        })();

        const _stage = {
            get _width() {
                return _defaults.stage._width;
            },
            get _height() {
                return _defaults.stage._height;
            },
            get _scene() {
                return getCurrentScene();
            },
            get _xmouse() {
                return MouseModule._private_._stageX;
            },
            get _ymouse() {
                return MouseModule._private_._stageY;
            },
            get _color() {
                return _defaults.stage._color;
            },
            set _color(_color) {
                _defaults.stage._color = _color;
            }
        }

        const _root = new Proxy({}, {
            has() { return false; },
            get: (object, property) => {
                if ([Symbol.toPrimitive, "toString"].includes(property)) return () => "[root Stage]";
                if (property === "type") return "stage";
                const config = Object.getOwnPropertyDescriptor(object, property);
                if (config && config.configurable === false && config.writable === false)
                    return object[property];

                let result = _getFlevaClipByInstanceName(property);
                if (result) return result;

                if (Reflect.has(_stage, property))
                    return Reflect.get(_stage, property);

                if (Reflect.has(__functions, property))
                    return Reflect.get(__functions, property);

                function floxyChain() {
                    const proxy = new Proxy(() => proxy, {
                        has(object, property) {
                            if ([Symbol.toPrimitive, "toString", "constructor"].includes(property)) return true;
                        },
                        get(object, property) {
                            if ([Symbol.toPrimitive, "toString"].includes(property)) return () => "undefined";
                            if (["constructor"].includes(property)) return _constructors.Floxy;
                            const config = Object.getOwnPropertyDescriptor(object, property);
                            if (config && config.configurable === false && config.writable === false)
                                return object[property];

                            return proxy;
                        },
                    });
                    return proxy;
                }

                return floxyChain();
            },
            set: (object, property, value) => {
                if (property === "type") return true;

                const config = Object.getOwnPropertyDescriptor(object, property);
                if (config && config.configurable === false && config.writable === false) return true;

                let result = _getFlevaClipByInstanceName(property);
                if (result) return true;

                if (Reflect.has(_stage, property)) {
                    Reflect.set(_stage, property, value);
                    return true;
                }

                if (Reflect.has(__functions, property)) return true;
                return true;
            }
        });

        const changeState = (_name, _value) => {
            const functionLineNumber = DebugModule.getLineNumber(2);
            try {
                DebugModule.typeCheck(changeState, "state's name", _name, String);
                const _newState = {};
                _newState[_name] = _value;

                _fillState(_newState);
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Stage", from: "stage.changeState", error: bubbledError, src: functionLineNumber });
            }
        }
        const useState = (_state) => { 
            try {
                DebugModule.typeCheck(useState, "state", _state, Object, Function, _constructors.Script);
                if (helperUtils.isObject(_state)) {
                    const _newState = _state;

                    _clearState();
                    _fillState(_newState);
                } else if (_commandUtils.isScription(_state)) {
                    const prevState = objectUtils.deepCloneObject(engineState);
                    const _newState = _commandUtils.getScription(_state)(prevState);

                    _clearState();
                    _fillState(_newState);
                }
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Stage", from: "stage.useState", error: bubbledError, src: DebugModule.getLineNumber(2) });
            }
        }
        const setState = (_state) => { 
            try {
                DebugModule.typeCheck(setState, "state", _state, Object, Function, _constructors.Script);
                if (helperUtils.isObject(_state)) {
                    const _newState = _state;

                    _fillState(_newState);
                } else if (_commandUtils.isScription(_state)) {
                    const prevState = objectUtils.deepCloneObject(engineState);
                    const _newState = _commandUtils.getScription(_state)(prevState);

                    _fillState(_newState);
                }
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Stage", from: "stage.setState", error: bubbledError, src: DebugModule.getLineNumber(2) });
            }
        }

        const addScript = function (_script) {
            try {
                DebugModule.typeCheck(addScript, "script", _script, String, Function, _constructors.Script);
                let script;
                if (helperUtils.isString(_script)) {
                    const _newScript = getScriptFromLibrary(_script);
                    script = _Script(_newScript);
                } else if (_commandUtils.isScription(_script)) {
                    const _newScript = _commandUtils.getScription(_script);
                    script = _Script(_newScript);
                }
                const flevaScript = _commandUtils.createFlevaScript(script, _engineScope, _engineObj);
                heirarchy.scripts.push(flevaScript);
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Stage", from: "stage.addScript", error: bubbledError, src: DebugModule.getLineNumber(2) });
            }
        }


        const addToBatch = function (func, ...params) {
            heirarchy.batch.push([func, __privateProperties.currentLoopCycle, ...params]);
        }

        const _resolveBatch = async function () {
            const batch = heirarchy.batch;
            const currBatch = batch.filter(elem => elem[1] === __privateProperties.currentLoopCycle - 1);
            while (currBatch.length) {
                const [func, u, ...params] = currBatch.shift();
                await func(...params);
                batch.shift();
            }
        }

        const useScene = async function (_name) {
            _errorsM.checkSceneNotExist(_name);

            if (getCurrentSceneName() === _name) return;

            if (getCurrentSceneName() !== "") {
                try {
                    await getCurrentScene()._private_._unload();
                } catch (bubbledError) {
                    DebugModule.bubbleError({ type: "Stage", from: "stage.usescene", error: bubbledError });
                }
                KeyModule._private_._expireKeyPressedStates();
                MouseModule._private_._expireMousePressedStates();
                MouseModule._private_._clearSelectedFlevaClip();
            }

            setCurrentSceneName(_name);
            try {
                await getCurrentScene()._private_._load();
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Stage", from: "stage.usescene", error: bubbledError });
            }
        }
        const resetScene = async function () {
            if (getCurrentSceneName() === "") return;

            try {
                await getCurrentScene()._private_._unload();
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Stage", from: "stage.resetscene", error: bubbledError });
            }
            KeyModule._private_._expireKeyPressedStates();
            MouseModule._private_._expireMousePressedStates();
            MouseModule._private_._clearSelectedFlevaClip();

            try {
                await getCurrentScene()._private_._load();
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Stage", from: "stage.resetscene", error: bubbledError });
            }
        }

        const attachPrefab = (..._args) => {
            const functionLineNumber = DebugModule.getLineNumber(2);
            try {
                attachFlevaClip("prefab", functionLineNumber, ..._args);
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Stage", from: "stage.attachPrefab", error: bubbledError, src: functionLineNumber })
            }
        }
        const attachTextfield = (..._args) => {
            const functionLineNumber = DebugModule.getLineNumber(2);
            try {
                attachFlevaClip("textfield", functionLineNumber, ..._args);
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Stage", from: "stage.attachTextfield", error: bubbledError, src: functionLineNumber });
            }
        }

        const removePrefab = function (_instanceName) {
            removeFlevaClip("prefab", _instanceName);
        }
        const removeTextfield = function (_instanceName) {
            removeFlevaClip("textfield", _instanceName);
        }

        const __functions = {
            attachPrefab,
            attachTextfield,

            removePrefab,
            removeTextfield
        }

        class assetLoader {
            static asyncList = [];
            static syncList = [];
            static loaded = [];
            static isAsyncLoading = false;
            static asyncQueue(name, source, type = "unknown", dependency = "none") {
                this.asyncList.push({ name, type, source, dependency, time: performance.now() });
            }
            static syncQueue(name, source, type = "unknown", dependency = "none") {
                this.syncList.push({ name, type, source, dependency, time: performance.now() });
            }
            static async loadAsyncAssets() {
                this.isAsyncLoading = true;
                while (this.asyncList.length) {
                    const { name, type, source } = this.asyncList[0];
                    if (source.hasLoaded !== undefined) break;
                    await source.loadSource();
                    this.loaded.push([type, name]);
                    this.asyncList.shift();
                }
                this.isAsyncLoading = false;
            }
            static async loadSyncAssets() {
                while (this.syncList.length) {
                    const { name, type, source } = this.syncList[0];
                    await source.loadSource();
                    this.loaded.push([type, name]);
                    this.syncList.shift();
                }
            }
            static checkForAsyncAssets() {
                if (this.asyncList.length && !this.isAsyncLoading) createTimeout(this.loadAsyncAssets.bind(this), 1);
            }
            static async checkForSyncAssets() {
                if (this.syncList.length) await this.loadSyncAssets();
            }
            static loadAssets = (() => {
                const queueList = [];
                const _loadPercentInc = (_counter = loadCounter, _count = queueList.length || 1) => {
                    const percent = Math.floor(_counter / _count * 100) / 100;
                    loadScreen.drawLoadBar(_screen.ctx, percent);
                }

                const _loadQueues = () => {
                    queueList.push(...this.asyncList, ...this.syncList);
                    this.syncList.length = 0;
                    this.asyncList.length = 0;

                    queueList.sort((a, b) => a.time - b.time);
                }
                let loadCounter = 0;
                let _loadedFromQueue = false;
                const _loadFromQueue = async () => {
                    _loadQueues();
                    for (const elem of queueList) {
                        const { name, type, source } = elem;
                        try {
                            await source.loadSource();
                            this.loaded.push([type, name]);
                        } catch (e) {
                            console.error("Error while loading assets: " + e);
                        }
                        loadCounter++;
                        renderLoadScreen();
                    }
                    _loadedFromQueue = true;
                }
                const renderLoadScreen = () => {
                    _screen.ctx.save();
                    _screen.ctx.scale(_screen.xScale, _screen.yScale);
                    loadScreen.drawLoadStart(_screen.ctx);
                    _loadPercentInc();
                    if (_loadedFromQueue)
                        loadScreen.drawLoadEnd(_screen.ctx);
                    _screen.ctx.restore();
                }
                const loadAssets = () => {
                    return new Promise(async resolve => {
                        window.addEventListener("resize", renderLoadScreen, false);
                        try {
                            renderLoadScreen();
                            await _loadFromQueue();
                            renderLoadScreen();
                        } catch (e) {
                            console.warn(e);
                            return resolve();
                        }

                        const finishLoad = () => {
                            queueList.length = 0;
                            window.removeEventListener("resize", renderLoadScreen, false);
                            _screen.div.removeEventListener('mousedown', finishLoad, true);
                            _screen.div.removeEventListener("keydown", finishLoad, true);
                            resolve();
                        }
                        _screen.div.addEventListener('mousedown', finishLoad, true);
                        _screen.div.addEventListener("keydown", finishLoad, true);
                    });
                }
                const loadScreen = {
                    svgs: {
                        logoold: _screen.svgToImage(`<svg width="331" height="331" viewBox="0 0 331 331" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.0936127" y="63.259" width="275" height="275" rx="27" transform="rotate(-13.279 0.0936127 63.259)" fill="#E44D26"/>
            <path d="M90.6 255V93H153.2V109.2H113.2V163.2H144.2V179.2H113.2V255H90.6ZM168.725 255V93H208.925C218.658 93 226.392 94.8 232.125 98.4C237.992 101.867 242.258 106.933 244.925 113.6C247.592 120.267 248.925 128.333 248.925 137.8C248.925 146.333 247.392 153.733 244.325 160C241.392 166.267 236.992 171.133 231.125 174.6C225.258 177.933 217.925 179.6 209.125 179.6H191.325V255H168.725ZM191.325 163.4H201.725C208.258 163.4 213.392 162.667 217.125 161.2C220.858 159.733 223.525 157.2 225.125 153.6C226.725 149.867 227.525 144.667 227.525 138C227.525 130.267 226.925 124.333 225.725 120.2C224.658 116.067 222.325 113.2 218.725 111.6C215.125 110 209.525 109.2 201.925 109.2H191.325V163.4Z" fill="#FBC5B7"/>
            </svg>`),
                        logo: _screen.svgToImage(`<svg xmlns="http://www.w3.org/2000/svg" width="309" height="309" viewBox="0 0 309 309" fill="none">
                    <path d="M76.3824 5.61113C65.7358 2.66881 54.7198 8.91437 51.7775 19.561L50.6676 23.5769L165.207 30.1588L76.3824 5.61113Z" fill="#AB3A1C"/>
                    <path d="M6.04183 232.477C3.09951 243.123 9.34507 254.139 19.9917 257.081L24.0076 258.191L30.5808 143.684L6.04183 232.477Z" fill="#AB3A1C"/>
                    <path d="M257.512 288.867C254.57 299.514 243.554 305.759 232.907 302.817L144.083 278.269L258.622 284.851L257.512 288.867Z" fill="#AB3A1C"/>
                    <path d="M303.248 75.9517C306.19 65.3051 299.945 54.2891 289.298 51.3468L285.282 50.2369L278.7 164.776L303.248 75.9517Z" fill="#AB3A1C"/>
                    <rect x="17.4487" y="41.565" width="251.048" height="251.048" rx="20" transform="rotate(-5.61125 17.4487 41.565)" fill="#F2F2F2"/>
                    <rect x="3.6449" y="60.878" width="251.048" height="251.048" rx="20" transform="rotate(-13.279 3.6449 60.878)" fill="#E44D26"/>
                    <path d="M117.59 213.06L101.127 216.856L82.4083 135.657C81.9099 133.495 81.8422 131.256 82.2091 129.068C82.576 126.879 83.3702 124.785 84.5466 122.904C85.7229 121.023 87.2582 119.392 89.0648 118.104C90.8715 116.816 92.9141 115.897 95.0761 115.398L192.738 92.8839C194.9 92.3855 197.139 92.3178 199.327 92.6847C201.515 93.0516 203.61 93.8459 205.491 95.0222C207.372 96.1985 209.003 97.7338 210.291 99.5404C211.579 101.347 212.498 103.39 212.996 105.552L216.792 122.015C217.29 124.177 217.358 126.416 216.991 128.604C216.624 130.792 215.83 132.886 214.653 134.767C213.477 136.649 211.942 138.28 210.135 139.567L240.791 184.659L223.132 188.729L193.28 144.773L171.198 149.864L182.326 198.137L165.863 201.932L154.735 153.659L150.94 137.196L192.097 127.708C193.178 127.458 194.199 126.999 195.103 126.355C196.006 125.711 196.774 124.895 197.362 123.955C197.95 123.014 198.347 121.967 198.531 120.873C198.714 119.779 198.68 118.659 198.431 117.578C198.182 116.497 197.722 115.476 197.078 114.573C196.434 113.67 195.619 112.902 194.678 112.314C193.738 111.726 192.69 111.328 191.596 111.145C190.503 110.962 189.385 110.995 188.304 111.244L188.302 111.245L98.8713 131.861L102.667 148.324L135.593 140.734L139.388 157.197L106.462 164.787L117.59 213.06Z" fill="#F2F2F2"/>
                    </svg>`),
                        loaded: _screen.svgToImage(`<svg width="322" height="34" viewBox="0 0 322 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.706975 8.02631H5.17137V9.47068C6.37501 8.31081 7.66618 7.73088 9.04489 7.73088C10.5768 7.73088 11.6601 8.36552 12.2947 9.63481C12.9294 10.9041 13.2467 12.3813 13.2467 14.0664V20.5004C13.2467 22.5356 12.8856 24.1769 12.1634 25.4243C11.4631 26.6717 10.347 27.2954 8.81511 27.2954C7.58959 27.2954 6.37501 26.7264 5.17137 25.5885V33.237H0.706975V8.02631ZM7.14096 24.1769C7.7756 24.1769 8.20235 23.8705 8.42119 23.2578C8.66192 22.645 8.78228 21.7806 8.78228 20.6645V13.8366C8.78228 12.8518 8.66192 12.0859 8.42119 11.5387C8.18046 10.9916 7.74278 10.7181 7.10813 10.7181C6.4516 10.7181 5.80602 10.9916 5.17137 11.5387V23.5204C5.78413 23.9581 6.44066 24.1769 7.14096 24.1769ZM16.4173 8.02631H20.8816V10.9479C21.5163 9.83177 22.1619 9.03299 22.8184 8.55154C23.4749 8.0482 24.2081 7.79653 25.0178 7.79653C25.3023 7.79653 25.5321 7.81841 25.7071 7.86218V12.4907C25.0068 12.2281 24.3941 12.0968 23.8689 12.0968C22.6871 12.0968 21.6914 12.7096 20.8816 13.9351V27H16.4173V8.02631ZM33.636 27.2954C31.5351 27.2954 29.9923 26.7155 29.0075 25.5556C28.0227 24.3739 27.5303 22.6341 27.5303 20.3362V14.6901C27.5303 12.3703 28.0227 10.6305 29.0075 9.47068C30.0142 8.31081 31.557 7.73088 33.636 7.73088C35.7807 7.73088 37.2907 8.33269 38.1661 9.53633C39.0633 10.74 39.5119 12.5564 39.5119 14.9855V17.7101H31.9619V21.4523C31.9619 22.3715 32.0932 23.0389 32.3558 23.4547C32.6403 23.8705 33.078 24.0784 33.6688 24.0784C34.2378 24.0784 34.6427 23.8815 34.8834 23.4876C35.146 23.0718 35.2773 22.4481 35.2773 21.6165V20.008H39.4791V21.321C39.4791 23.2687 38.9867 24.7569 38.0019 25.7854C37.0171 26.7921 35.5618 27.2954 33.636 27.2954ZM35.2773 15.5107V13.7053C35.2773 12.7205 35.157 12.0202 34.9162 11.6044C34.6755 11.1667 34.2488 10.9479 33.636 10.9479C33.0014 10.9479 32.5637 11.1777 32.3229 11.6372C32.0822 12.0968 31.9619 12.9503 31.9619 14.1977V15.5107H35.2773ZM47.6952 27.2954C46.0977 27.2954 44.7846 26.8687 43.756 26.0152C42.7275 25.1617 41.9944 23.9143 41.5567 22.273L44.8721 20.9928C45.3755 23.1155 46.2946 24.1769 47.6296 24.1769C48.1329 24.1769 48.5159 24.0456 48.7785 23.783C49.063 23.5204 49.2052 23.1593 49.2052 22.6997C49.2052 22.1964 49.052 21.7368 48.7457 21.321C48.4393 20.8833 47.8922 20.3362 47.1043 19.6797L44.8393 17.7101C43.8764 16.9223 43.1652 16.1563 42.7056 15.4123C42.246 14.6682 42.0162 13.76 42.0162 12.6877C42.0162 11.1995 42.5196 10.0068 43.5263 9.10959C44.5548 8.19045 45.846 7.73088 47.3998 7.73088C48.8879 7.73088 50.1025 8.1795 51.0435 9.07676C51.9845 9.95213 52.5973 11.1448 52.8818 12.6548L49.9602 13.9022C49.7852 13.0269 49.4897 12.3156 49.0739 11.7685C48.68 11.1995 48.1657 10.915 47.5311 10.915C47.0715 10.915 46.6995 11.0573 46.415 11.3418C46.1524 11.6263 46.0211 11.9874 46.0211 12.4251C46.0211 12.7752 46.1743 13.1472 46.4806 13.5412C46.787 13.9351 47.2466 14.3946 47.8593 14.9199L50.1572 17.0208C51.142 17.8742 51.897 18.6949 52.4222 19.4827C52.9693 20.2487 53.2429 21.1788 53.2429 22.273C53.2429 23.8705 52.7177 25.107 51.6672 25.9824C50.6387 26.8578 49.3147 27.2954 47.6952 27.2954ZM60.8386 27.2954C59.2411 27.2954 57.928 26.8687 56.8994 26.0152C55.8709 25.1617 55.1378 23.9143 54.7001 22.273L58.0155 20.9928C58.5189 23.1155 59.438 24.1769 60.773 24.1769C61.2763 24.1769 61.6593 24.0456 61.9219 23.783C62.2064 23.5204 62.3486 23.1593 62.3486 22.6997C62.3486 22.1964 62.1954 21.7368 61.8891 21.321C61.5827 20.8833 61.0356 20.3362 60.2477 19.6797L57.9827 17.7101C57.0198 16.9223 56.3086 16.1563 55.849 15.4123C55.3894 14.6682 55.1596 13.76 55.1596 12.6877C55.1596 11.1995 55.663 10.0068 56.6697 9.10959C57.6982 8.19045 58.9894 7.73088 60.5432 7.73088C62.0313 7.73088 63.2459 8.1795 64.1869 9.07676C65.1279 9.95213 65.7407 11.1448 66.0252 12.6548L63.1036 13.9022C62.9286 13.0269 62.6331 12.3156 62.2173 11.7685C61.8234 11.1995 61.3091 10.915 60.6745 10.915C60.2149 10.915 59.8429 11.0573 59.5584 11.3418C59.2958 11.6263 59.1645 11.9874 59.1645 12.4251C59.1645 12.7752 59.3177 13.1472 59.624 13.5412C59.9304 13.9351 60.39 14.3946 61.0027 14.9199L63.3006 17.0208C64.2854 17.8742 65.0404 18.6949 65.5656 19.4827C66.1127 20.2487 66.3863 21.1788 66.3863 22.273C66.3863 23.8705 65.8611 25.107 64.8106 25.9824C63.7821 26.8578 62.4581 27.2954 60.8386 27.2954ZM80.487 27.2954C79.6773 27.2954 78.9551 27.0766 78.3205 26.6389C77.7077 26.2012 77.2263 25.6432 76.8761 24.9648C76.5479 24.2645 76.3837 23.5423 76.3837 22.7982C76.3837 21.332 76.7229 20.1283 77.4014 19.1873C78.1016 18.2244 78.9551 17.4803 79.9618 16.9551C80.9904 16.4299 82.3472 15.8499 84.0323 15.2153V13.574C84.0323 12.6986 83.9229 12.064 83.704 11.67C83.5071 11.2542 83.1132 11.0463 82.5223 11.0463C81.5156 11.0463 80.9904 11.7466 80.9466 13.1472L80.881 14.2962L76.6463 14.132C76.712 11.9436 77.2482 10.3351 78.2548 9.30654C79.2834 8.2561 80.8262 7.73088 82.8834 7.73088C84.7435 7.73088 86.1222 8.24516 87.0195 9.27372C87.9168 10.2804 88.3654 11.7138 88.3654 13.574V22.3386C88.3654 23.6955 88.4748 25.2493 88.6937 27H84.6888C84.47 25.8182 84.3168 24.91 84.2293 24.2754C83.9666 25.1289 83.518 25.8511 82.8834 26.442C82.2706 27.0109 81.4718 27.2954 80.487 27.2954ZM82.1284 23.98C82.5004 23.98 82.8505 23.8487 83.1788 23.586C83.529 23.3234 83.8135 23.0389 84.0323 22.7326V17.4147C82.8724 18.0931 82.008 18.7496 81.439 19.3843C80.87 19.997 80.5855 20.7739 80.5855 21.7149C80.5855 22.4152 80.7168 22.9733 80.9794 23.3891C81.2639 23.783 81.6469 23.98 82.1284 23.98ZM91.6529 8.02631H96.1173V9.89742C97.6273 8.45306 99.1592 7.73088 100.713 7.73088C101.785 7.73088 102.584 8.12479 103.109 8.91263C103.656 9.70046 103.93 10.6962 103.93 11.8998V27H99.4656V12.7861C99.4656 12.1734 99.3671 11.7248 99.1702 11.4403C98.9951 11.1558 98.6668 11.0135 98.1854 11.0135C97.6601 11.0135 96.9708 11.3199 96.1173 11.9327V27H91.6529V8.02631ZM107.332 28.9368C108.514 28.9368 109.345 28.8273 109.827 28.6085C110.33 28.4115 110.582 28.0176 110.582 27.4267C110.582 27.0328 110.352 25.9167 109.892 24.0784L105.723 8.02631H110.056L112.518 20.566L114.652 8.02631H118.952L114.521 27.755C114.149 29.3526 113.438 30.4796 112.387 31.1361C111.359 31.8145 109.958 32.1538 108.185 32.1538H107.332V28.9368ZM129.065 0.37775H133.497V15.6749L138.355 8.02631H143.246L138.486 15.642L143.148 27H138.453L135.007 17.6445L133.497 19.7454V26.9672H129.065V0.37775ZM150.676 27.2954C148.576 27.2954 147.033 26.7155 146.048 25.5556C145.063 24.3739 144.571 22.6341 144.571 20.3362V14.6901C144.571 12.3703 145.063 10.6305 146.048 9.47068C147.055 8.31081 148.597 7.73088 150.676 7.73088C152.821 7.73088 154.331 8.33269 155.206 9.53633C156.104 10.74 156.552 12.5564 156.552 14.9855V17.7101H149.002V21.4523C149.002 22.3715 149.134 23.0389 149.396 23.4547C149.681 23.8705 150.118 24.0784 150.709 24.0784C151.278 24.0784 151.683 23.8815 151.924 23.4876C152.186 23.0718 152.318 22.4481 152.318 21.6165V20.008H156.52V21.321C156.52 23.2687 156.027 24.7569 155.042 25.7854C154.058 26.7921 152.602 27.2954 150.676 27.2954ZM152.318 15.5107V13.7053C152.318 12.7205 152.197 12.0202 151.957 11.6044C151.716 11.1667 151.289 10.9479 150.676 10.9479C150.042 10.9479 149.604 11.1777 149.363 11.6372C149.123 12.0968 149.002 12.9503 149.002 14.1977V15.5107H152.318ZM159.713 28.9368C160.895 28.9368 161.727 28.8273 162.208 28.6085C162.711 28.4115 162.963 28.0176 162.963 27.4267C162.963 27.0328 162.733 25.9167 162.274 24.0784L158.105 8.02631H162.438L164.9 20.566L167.033 8.02631H171.334L166.902 27.755C166.53 29.3526 165.819 30.4796 164.768 31.1361C163.74 31.8145 162.339 32.1538 160.567 32.1538H159.713V28.9368ZM186.863 27.2298C185.134 27.2298 183.908 26.814 183.186 25.9824C182.486 25.1508 182.136 23.9143 182.136 22.273V10.9479H180.232V8.02631H182.136V2.34734H186.633V8.02631H189.489V10.9479H186.633V21.8791C186.633 22.5137 186.764 22.9733 187.027 23.2578C187.311 23.5423 187.749 23.6845 188.34 23.6845C188.887 23.6845 189.347 23.6408 189.719 23.5532V27C188.843 27.1532 187.891 27.2298 186.863 27.2298ZM198.025 27.2954C195.989 27.2954 194.468 26.7374 193.462 25.6213C192.455 24.4833 191.952 22.842 191.952 20.6973V14.329C191.952 12.1843 192.455 10.5539 193.462 9.43785C194.468 8.29987 195.989 7.73088 198.025 7.73088C200.06 7.73088 201.581 8.29987 202.588 9.43785C203.616 10.5539 204.13 12.1843 204.13 14.329V20.6973C204.13 22.842 203.616 24.4833 202.588 25.6213C201.581 26.7374 200.06 27.2954 198.025 27.2954ZM198.058 24.2098C198.736 24.2098 199.185 23.9471 199.403 23.4219C199.622 22.8748 199.732 22.076 199.732 21.0256V14.0336C199.732 12.9831 199.622 12.1843 199.403 11.6372C199.185 11.0901 198.736 10.8166 198.058 10.8166C197.357 10.8166 196.898 11.0901 196.679 11.6372C196.46 12.1843 196.351 12.9831 196.351 14.0336V21.0256C196.351 22.076 196.46 22.8748 196.679 23.4219C196.898 23.9471 197.357 24.2098 198.058 24.2098ZM220.913 27.2954C218.79 27.2954 217.247 26.7046 216.284 25.5228C215.321 24.3192 214.84 22.6013 214.84 20.3691V14.6573C214.84 12.4032 215.321 10.6853 216.284 9.5035C217.247 8.32175 218.79 7.73088 220.913 7.73088C222.926 7.73088 224.392 8.21233 225.311 9.17524C226.252 10.1381 226.723 11.6044 226.723 13.574V15.1497H222.521V13.4755C222.521 12.4907 222.401 11.8123 222.16 11.4403C221.941 11.0682 221.536 10.8822 220.946 10.8822C220.311 10.8822 219.873 11.112 219.632 11.5716C219.414 12.0311 219.304 12.8737 219.304 14.0992V21.0584C219.304 22.2402 219.425 23.0499 219.665 23.4876C219.928 23.9253 220.355 24.1441 220.946 24.1441C221.558 24.1441 221.974 23.9471 222.193 23.5532C222.412 23.1374 222.521 22.4809 222.521 21.5836V19.5484H226.723V21.3539C226.723 23.3016 226.252 24.7787 225.311 25.7854C224.37 26.7921 222.904 27.2954 220.913 27.2954ZM235.435 27.2954C233.4 27.2954 231.879 26.7374 230.872 25.6213C229.866 24.4833 229.362 22.842 229.362 20.6973V14.329C229.362 12.1843 229.866 10.5539 230.872 9.43785C231.879 8.29987 233.4 7.73088 235.435 7.73088C237.471 7.73088 238.992 8.29987 239.998 9.43785C241.027 10.5539 241.541 12.1843 241.541 14.329V20.6973C241.541 22.842 241.027 24.4833 239.998 25.6213C238.992 26.7374 237.471 27.2954 235.435 27.2954ZM235.468 24.2098C236.147 24.2098 236.595 23.9471 236.814 23.4219C237.033 22.8748 237.142 22.076 237.142 21.0256V14.0336C237.142 12.9831 237.033 12.1843 236.814 11.6372C236.595 11.0901 236.147 10.8166 235.468 10.8166C234.768 10.8166 234.308 11.0901 234.089 11.6372C233.871 12.1843 233.761 12.9831 233.761 14.0336V21.0256C233.761 22.076 233.871 22.8748 234.089 23.4219C234.308 23.9471 234.768 24.2098 235.468 24.2098ZM244.629 8.02631H249.094V9.89742C250.604 8.45306 252.136 7.73088 253.689 7.73088C254.762 7.73088 255.56 8.12479 256.086 8.91263C256.633 9.70046 256.906 10.6962 256.906 11.8998V27H252.442V12.7861C252.442 12.1734 252.343 11.7248 252.147 11.4403C251.971 11.1558 251.643 11.0135 251.162 11.0135C250.637 11.0135 249.947 11.3199 249.094 11.9327V27H244.629V8.02631ZM265.659 27.2298C263.93 27.2298 262.705 26.814 261.982 25.9824C261.282 25.1508 260.932 23.9143 260.932 22.273V10.9479H259.028V8.02631H260.932V2.34734H265.429V8.02631H268.285V10.9479H265.429V21.8791C265.429 22.5137 265.56 22.9733 265.823 23.2578C266.108 23.5423 266.545 23.6845 267.136 23.6845C267.683 23.6845 268.143 23.6408 268.515 23.5532V27C267.639 27.1532 266.688 27.2298 265.659 27.2298ZM271.208 1.29689H275.672V5.00628H271.208V1.29689ZM271.208 8.02631H275.672V27H271.208V8.02631ZM279.219 8.02631H283.683V9.89742C285.193 8.45306 286.725 7.73088 288.279 7.73088C289.351 7.73088 290.15 8.12479 290.675 8.91263C291.222 9.70046 291.496 10.6962 291.496 11.8998V27H287.032V12.7861C287.032 12.1734 286.933 11.7248 286.736 11.4403C286.561 11.1558 286.233 11.0135 285.751 11.0135C285.226 11.0135 284.537 11.3199 283.683 11.9327V27H279.219V8.02631ZM297.819 27.2954C296.747 27.2954 295.948 26.9015 295.423 26.1137C294.898 25.3259 294.635 24.3301 294.635 23.1265V8.02631H299.067V22.3058C299.067 22.8967 299.165 23.3453 299.362 23.6517C299.559 23.9581 299.898 24.1113 300.38 24.1113C300.883 24.1113 301.551 23.8158 302.382 23.225V8.02631H306.847V27H302.382V25.1945C300.916 26.5951 299.395 27.2954 297.819 27.2954ZM316.027 27.2954C313.926 27.2954 312.383 26.7155 311.398 25.5556C310.413 24.3739 309.921 22.6341 309.921 20.3362V14.6901C309.921 12.3703 310.413 10.6305 311.398 9.47068C312.405 8.31081 313.948 7.73088 316.027 7.73088C318.171 7.73088 319.681 8.33269 320.557 9.53633C321.454 10.74 321.903 12.5564 321.903 14.9855V17.7101H314.353V21.4523C314.353 22.3715 314.484 23.0389 314.747 23.4547C315.031 23.8705 315.469 24.0784 316.06 24.0784C316.629 24.0784 317.033 23.8815 317.274 23.4876C317.537 23.0718 317.668 22.4481 317.668 21.6165V20.008H321.87V21.321C321.87 23.2687 321.378 24.7569 320.393 25.7854C319.408 26.7921 317.953 27.2954 316.027 27.2954ZM317.668 15.5107V13.7053C317.668 12.7205 317.548 12.0202 317.307 11.6044C317.066 11.1667 316.64 10.9479 316.027 10.9479C315.392 10.9479 314.954 11.1777 314.714 11.6372C314.473 12.0968 314.353 12.9503 314.353 14.1977V15.5107H317.668Z" fill="#2E323F"/>
                </svg>`)
                    },
                    dimensions: (function () {
                        const width = _defaults.stage._width;
                        const height = _defaults.stage._height;

                        const baseDim = Math.min(width, height);
                        const baseSize = Math.min(baseDim * 0.4, 400);
                        const basePadding = baseSize / 5;

                        const logoSize = baseSize;

                        const barOffset = 2;
                        const yOffset = height / 10;

                        const loadBarWidth = baseSize;
                        const loadBarHeight = baseSize / 10;

                        const loadingBarWidth = loadBarWidth - barOffset * 2;
                        const loadingBarHeight = loadBarHeight - barOffset * 2;

                        const generalHeight = logoSize + loadBarHeight + basePadding;


                        const logoX = width / 2 - logoSize / 2;
                        const logoY = -yOffset + height / 2 - generalHeight / 2;

                        const loadBarX = width / 2 - loadBarWidth / 2;
                        const loadBarY = -yOffset + height / 2 + generalHeight / 2 - loadBarHeight;

                        const loadedTextY = loadBarY + loadBarHeight + basePadding / 2;

                        const loadingBarX = loadBarX + barOffset;
                        const loadingBarY = loadBarY + barOffset;
                        return {
                            logoX, logoY, logoSize,
                            loadBarWidth, loadBarHeight, loadBarX, loadBarY,
                            loadingBarWidth, loadingBarHeight, loadingBarX, loadingBarY,
                            loadedTextY
                        };
                    })(),
                    drawLoadBar(_ctx, _percent) {
                        const { loadBarWidth, loadBarHeight, loadBarX, loadBarY,
                            loadingBarWidth, loadingBarHeight, loadingBarX, loadingBarY } = this.dimensions;

                        _ctx.fillStyle = "#6F737F"
                        _ctx.fillRect(loadBarX, loadBarY, loadBarWidth, loadBarHeight);

                        _ctx.fillStyle = "#2E323F"
                        _ctx.fillRect(loadingBarX, loadingBarY, loadingBarWidth * _percent, loadingBarHeight);
                    },
                    drawLoadStart(_ctx) {
                        const { width, height } = _ctx;

                        _ctx.fillStyle = "#3B4050";
                        _ctx.fillRect(0, 0, width, height);

                        this.drawLogo(_ctx);
                    },
                    drawLoadEnd(_ctx) {
                        this.drawLoaded(_ctx);
                    },
                    drawLogo(_ctx) {
                        const { logoX, logoY, logoSize } = this.dimensions;
                        const svg = this.svgs.logo;

                        try {
                            _ctx.drawImage(svg, logoX, logoY, logoSize, logoSize);
                        } catch {
                            _ctx.save();
                            _ctx.fillStyle = "#E44D26"
                            _ctx.fillRect(logoX, logoY, logoSize, logoSize);
                            _ctx.restore();
                        }
                    },
                    drawLoaded(_ctx) {
                        const { loadBarWidth, loadBarHeight, loadedTextY, loadBarX } = this.dimensions;
                        const svg = this.svgs.loaded;

                        try {
                            _ctx.drawImage(svg, loadBarX, loadedTextY, loadBarWidth, loadBarHeight);
                        } catch {
                            _ctx.save();
                            _ctx.fillStyle = "#2E323F"
                            _ctx.font = `bold ${loadBarHeight}px sans-serif`;
                            _ctx.textBaseline = "top";
                            _ctx.fillText("press any key to continue", loadBarX, loadedTextY, loadBarWidth);
                            _ctx.restore();
                        }
                    }
                }
                return loadAssets;
            })();
        };
        const createPrefab = function (_name, _props, ..._init) {
            const functionLineNumber = DebugModule.getLineNumber(2);
            try {
                createFlevaClip("prefab", functionLineNumber, _name, _props, ..._init);
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Library", from: "createPrefab", error: bubbledError, src: functionLineNumber });
            }
        }
        const createTextfield = function (_name, _props, ..._init) {
            const functionLineNumber = DebugModule.getLineNumber(2);
            try {
                createFlevaClip("textfield", functionLineNumber, _name, _props, ..._init);
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Library", from: "createTextfield", error: bubbledError, src: functionLineNumber });
            }
        }
        const createScene = function (_name, ..._inits) {
            const functionLineNumber = DebugModule.getLineNumber(2);
            try {
                _errorsM.checkSceneExist(_name);
                _inits = _inits.filter(elem => _commandUtils.isScription(elem));
                for (const _init of _inits)
                    _init.FLN = functionLineNumber;
                _library.scenes[_name] = _Scene(_name, _inits);
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Library", from: "createScene", error: bubbledError, src: functionLineNumber });
            }
        }
        const createSound = SoundComponent.create;
        const createScript = function (_name, _func) {
            const functionLineNumber = DebugModule.getLineNumber(2);
            try {
                _errorsM.checkScriptExist(_name);
                _func.FLN = functionLineNumber;
                _library.scripts[_name] = _Script(_func);
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Library", from: "createScript", error: bubbledError, src: functionLineNumber });
            }
        }
        const createSprite = function (_name, _props, _definition) {
            try {
                _errorsM.checkSpriteExist(_name);
                if (!helperUtils.isObject(_props)) {
                    _definition = _props;
                    _props = {};
                }
                _library.sprites[_name] = _Sprite(_name, _props, _definition);
                assetLoader.asyncQueue(_name, _library.sprites[_name].assetSource, helperUtils.typeOf(_constructors.Sprite));
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Library", from: "createSprite", error: bubbledError, src: DebugModule.getLineNumber(2) });
            }
        }
        const createSpriteSheet = function (_name, _props, _func) {
            try {
                _errorsM.checkSpriteSheetExist(_name);
                if (!helperUtils.isObject(_props)) {
                    _func = _props;
                    _props = {};
                }
                _library.spritesheets[_name] = _SpriteSheet(_name, _props, _func);
                assetLoader.asyncQueue(_name, _library.spritesheets[_name].assetSource, helperUtils.typeOf(_constructors.SpriteSheet));
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Library", from: "createSpriteSheet", error: bubbledError, src: DebugModule.getLineNumber(2) });
            }
        }
        const createGraphic = function (_name, _config) {
            try {
                _errorsM.checkGraphicExist(_name);
                _library.graphics[_name] = _Graphic(_name, _config);
                assetLoader.asyncQueue(_name, _library.graphics[_name].assetSource, helperUtils.typeOf(_constructors.Graphic));
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Library", from: "createGraphic", error: bubbledError, src: DebugModule.getLineNumber(2) });
            }
        }
        const createPainting = function (_name, _formula) {
            try {
                _errorsM.checkPaintingExist(_name);
                _library.paintings[_name] = _Painting(_name, _formula);
            } catch (bubbledError) {
                DebugModule.bubbleError({ type: "Library", from: "createPainting", error: bubbledError, src: DebugModule.getLineNumber(2) });
            }
        }

        const getScriptSignature = function (_name) {
            const signature = new _constructors.Script();
            signature.idName = _name;
            objectUtils.lockObject(signature);
            return signature;
        }
        const getSpriteSignature = function (_name) {
            const signature = new _constructors.Sprite({ idName: _name });
            return signature;
        }
        const getSpriteSheetSignature = function (_name) {
            const signature = new _constructors.SpriteSheet({ idName: _name });
            return signature;
        }
        const getGraphicSignature = function (_name) {
            const signature = new _constructors.Graphic({ idName: _name });
            return signature;
        }
        const getPaintingSignature = function (_name) {
            const signature = new _constructors.Painting({ idName: _name });
            return signature;
        }
        const getSoundSignature = function (_name) {
            const signature = new _constructors.Sound({ idName: _name });
            return signature;
        }
        const getRawGraphic = function (_name) {
            let source = _defaults.unknowngraphic;
            try {
                let src;
                let name = "";
                if (_commandUtils.isRawGraphic(_name)) {
                    return _name;
                } else if (helperUtils.isString(_name)) {
                    src = getGraphicFromLibrary(_name).assetSource;
                    name = _name;
                } else if (!_name.assetSource) {
                    src = getGraphicFromLibrary(_name.idName).assetSource;
                    name = _name.idName;
                } else {
                    src = _name.assetSource;
                    name = _name.idName;
                }

                if (src.hasLoaded !== true) {
                    throw `Graphic not loaded: "${name}"`;
                }

                source = src;
            } catch (e) { console.warn(`Get raw graphic failed: ${e}`); }
            return source;
        }
        const getRawSprite = function (_name) {
            let source = _defaults.unknowngraphic;
            try {
                let src;
                let name = "";
                if (_commandUtils.isRawGraphic(_name)) {
                    return _name;
                } else if (helperUtils.isString(_name)) {
                    src = getSpriteFromLibrary(_name).assetSource;
                    name = _name;
                } else if (!_name.assetSource) { 
                    src = getSpriteFromLibrary(_name.idName).assetSource;
                    name = _name.idName;
                } else {
                    src = _name.assetSource;
                    name = _name.idName;
                }

                if (src.hasLoaded !== true) {
                    throw `Sprite not loaded: "${name}"`;
                }

                source = src;
            } catch (e) { console.warn(`Get raw sprite failed: ${e}`); }
            return source;
        }

        const createLoop = function (_crash, _func, _options, ..._args) {
            if (helperUtils.isNumber(_options))
                _options = { ms: _options };

            return _loopManager.addLoop(_crash, _func, DebugModule.getLineNumber(3), _options, _args);
        }
        const pauseLoop = function (_id) {
            _loopManager.pauseLoop(_id);
        }
        const playLoop = function (_id, _startNow) {
            _loopManager.playLoop(_id, _startNow);
        }
        const deleteLoop = function (..._ids) {
            for (const _id of _ids)
                _loopManager.removeLoop(_id);
        }
        const createTimeout = function (_func, _TPS = 0, ..._args) {
            return _loopManager.addTimeout(_func, DebugModule.getLineNumber(2), _TPS, _args);
        }
        const deleteTimeout = function (_id) {
            _loopManager.removeTimeout(_id);
        }

        const _returns_ = new _constructors.Engine({
            Meta: MetaModule,
            Mouse: MouseModule,
            Key: KeyModule,
            Sound: SoundModule,
            SharedObject: SharedObjectModule,

            utils: helperUtils, 

            _root,
            state: engineState, 

            changeState,
            useState,
            setState,

            addScript,

            useScene(_name) {
                addToBatch(useScene, _name);
            },
            resetScene() {
                addToBatch(resetScene);
            },

            createPrefab,
            createTextfield,
            createScene,

            createSound,
            createScript,
            createSprite,
            createSpriteSheet,
            createGraphic,
            createPainting,

            getScript: getScriptSignature,
            getSprite: getSpriteSignature,
            getSpriteSheet: getSpriteSheetSignature,
            getGraphic: getGraphicSignature,
            getPainting: getPaintingSignature,
            getRawGraphic, getRawSprite,


            VCam: vcam,



            trace: (value) => DebugModule.trace(value, 1), 

            createLoop: (_func, _options, ..._args) => createLoop(false, _func, _options, ..._args),
            pauseLoop,
            playLoop,
            deleteLoop: (id) => deleteLoop(id),
            createTimeout,
            deleteTimeout,

            sleep: blockRunTime, 
        });

        const _engineObj = _returns_;
        const _initFunc = function () {
            if (_commandUtils.isScription(_defaults.inits)) {
                const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(_defaults.inits), _engineScope, _engineObj);
                inits.push(flevaScript);
            } else if (helperUtils.isArray(_defaults.inits))
                for (const _init of Object.values(_defaults.inits))
                    if (_commandUtils.isScription(_init)) {
                        const flevaScript = _commandUtils.createFlevaScript(_commandUtils.getScription(_init), _engineScope, _engineObj);
                        inits.push(flevaScript);
                    }
        }
        _initFunc();

        const initLineNumber = DebugModule.getLineNumber(2);
        if (_options.useLoader)
            window.addEventListener('load', () => startRunTime(_defaults.fps));
        else
            startRunTime(_defaults.fps);

        return _returns_;
    }
    function FlevaR_Editor(editMode, _div) {
        if (!editMode) return {};
        if (_div == null) _div = document.body;
        const editor = {
            canRenderBounds: false,
            renderBoundedBox(_ctx, { _x: __x, _y: __y, _rotation } = {}, { _x, _y, _width, _height } = {}) {
                if (!_ctx || !_rotation) return;
                const colour = "#ACCDF455";
                _ctx.save();

                _ctx.lineJoin = "round";
                _ctx.lineCap = "round";

                _ctx.strokeStyle = colour;


                _ctx.setLineDash([8, 6]);
                _ctx.strokeRect(Math.floor(_x) - 0.5, Math.floor(_y) - 0.5, _width, _height);

                _ctx.restore();
            },
            renderRotatedBox(_ctx, _props, _setPosition) {
                _ctx.save();
                _ctx.lineJoin = "round";
                _ctx.lineCap = "round";
                _setPosition(_props);
                const { _x, _y, _width, _height, _rotation, _anchorX, _anchorY } = _props;
                const offsetX = (_anchorX / 100 * _width);
                const offsetY = (_anchorY / 100 * _height);
                const oS = 2;
                const pS = oS * 2;
                const bS = 1.5;
                const colour = "#3A7FBA";

                _ctx.setLineDash([8, 6]);
                _ctx.strokeStyle = colour;
                _ctx.strokeRect(Math.floor(_x) - 0.5, Math.floor(_y) - 0.5, _width, _height);

                _ctx.fillStyle = colour;
                _ctx.fillRect(_x - oS, _y - oS, pS, pS);
                _ctx.fillRect(_x + _width - oS, _y - oS, pS, pS);
                _ctx.fillRect(_x - oS, _y + _height - oS, pS, pS);
                _ctx.fillRect(_x + _width - oS, _y + _height - oS, pS, pS);

                _ctx.setLineDash([]);
                _ctx.beginPath();
                _ctx.moveTo(Math.floor(_x + offsetX) - 0.5, Math.floor(_y + offsetY) - 0.5);
                _ctx.lineTo(Math.floor(_x + offsetX) - 0.5, Math.floor(_y + offsetY) - 0.5 - 20);
                _ctx.stroke();
                _ctx.fillEllipse((_x + offsetX) - oS * bS, (_y + offsetY) - oS * bS, pS * bS, pS * bS);

                _ctx.restore();
            }
        }

        const toggleBounds = () => {
            editor.canRenderBounds = !editor.canRenderBounds;
        }

        const editorDiv = document.createElement('div');
        const toggleBoundsButton = document.createElement('button');
        toggleBoundsButton.innerText = "Toggle Bounds"
        toggleBoundsButton.onclick = toggleBounds;

        editorDiv.appendChild(toggleBoundsButton);
        _div.appendChild(editorDiv);

        return editor;
    }
})();