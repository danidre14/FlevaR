function FlevaR(_div = document.body, _options = {}, _inits) {
    const inits = [];
    const finis = [];
    const __defaults = (function () {
        const minStageWidth = 400, minStageHeight = 400;
        const editMode = _options.editor || false;
        const autosave = _options.autosave ? _options.autosave : false;
        const fps = _options.fps ? _options.fps : 30;
        const applicationName = _options.name ? _options.name : "flevar_application";
        return {
            sprite: (() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 50;
                canvas.height = 50;

                ctx.fillStyle = "#D3D3D3";
                ctx.fillRect(0, 0, 50, 50);
                ctx.fillStyle = "#A9A9A9";
                ctx.fillRect(20, 0, 10, 50);
                ctx.fillRect(0, 20, 50, 10);

                return canvas;
            })(),
            unknowngraphic: (() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 50;
                canvas.height = 50;

                ctx.fillStyle = "#D3D3D3";
                ctx.fillRect(0, 0, 50, 50);
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#A9A9A9";
                ctx.strokeRect(0, 0, 50, 50);

                return canvas;
            })(),
            useUnknownSound: () => {
                function createSilentAudio(time, freq = 44100) {
                    const length = time * freq;
                    const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
                    if (!AudioContext) {
                        console.warn("No audio context found on this browser.");
                    }
                    const context = new AudioContext();
                    const audioFile = context.createBuffer(1, length, freq);
                    return URL.createObjectURL(bufferToWave(audioFile, length));
                }

                function bufferToWave(abuffer, len) {
                    let numOfChan = abuffer.numberOfChannels,
                        length = len * numOfChan * 2 + 44,
                        buffer = new ArrayBuffer(length),
                        view = new DataView(buffer),
                        channels = [], i, sample,
                        offset = 0,
                        pos = 0;

                    setUint32(0x46464952);
                    setUint32(length - 8);
                    setUint32(0x45564157);

                    setUint32(0x20746d66);
                    setUint32(16);
                    setUint16(1);
                    setUint16(numOfChan);
                    setUint32(abuffer.sampleRate);
                    setUint32(abuffer.sampleRate * 2 * numOfChan);
                    setUint16(numOfChan * 2);
                    setUint16(16);

                    setUint32(0x61746164);
                    setUint32(length - pos - 4);

                    for (i = 0; i < abuffer.numberOfChannels; i++)
                        channels.push(abuffer.getChannelData(i));

                    while (pos < length) {
                        for (i = 0; i < numOfChan; i++) {
                            sample = Math.max(-1, Math.min(1, channels[i][offset]));
                            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                            view.setInt16(pos, sample, true);
                            pos += 2;
                        }
                        offset++
                    }

                    return new Blob([buffer], { type: "audio/wav" });

                    function setUint16(data) {
                        view.setUint16(pos, data, true);
                        pos += 2;
                    }

                    function setUint32(data) {
                        view.setUint32(pos, data, true);
                        pos += 4;
                    }
                }

                try {
                    return createSilentAudio(3, 44100);
                } catch { return false }
            },
            engine: {
                version: "FlevaR Version 1.2.0"
            },
            stage: {
                _width: _options._width !== undefined ? Math.max(minStageWidth, _options._width) : 600,
                _height: _options._height !== undefined ? Math.max(minStageHeight, _options._height) : 500,
                _color: "#fff0"
            },
            minStageWidth, minStageHeight,
            flevar_env: editMode ? "development" : "production",
            editor: editMode,

            fps, applicationName,

            inits: _inits,


            graphicPath: "assets",
            graphicType: "png",

            soundPath: "assets",
            soundType: "mp3",

            autosave,

            Image,
            Audio
        }
    })();

    const __takeScreenShot = function (_name) {
        const name = _name ? _name : `${__defaults.applicationName}_${String(Date.now())}`;
        const anchor = document.createElement("a");

        anchor.download = name;
        anchor.href = __screen.canvas.toDataURL();
        anchor.click();
    }

    const __config = {
        DEBUG: _options.debug,
        EDITOR: FlevaR_Editor ? FlevaR_Editor(__defaults.editor, _div) : {}
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
    const __constructors = {
        Engine: function Engine() {
            initConstructor(this, ...arguments);
        },
        SharedObject: function SharedObject() {
            initConstructor(this, ...arguments);
        },
        Mouse: function Mouse() {
            initConstructor(this, ...arguments);
        },
        Key: function Key() {
            initConstructor(this, ...arguments);
        },
        Prefab: function Prefab() {
            initConstructor(this, ...arguments);
        },
        TextField: function TextField() {
            initConstructor(this, ...arguments);
        },
        Scene: function Scene() {
            initConstructor(this, ...arguments);
        },
        Script: function Script() { },
        Sprite: function Sprite() {
            initConstructor(this, ...arguments);
        },
        Graphic: function Graphic() {
            initConstructor(this, ...arguments);
        },
        Sound: function Sound() {
            initConstructor(this, ...arguments);
        },
        SpriteSheet: function SpriteSheet() {
            initConstructor(this, ...arguments);
        },
        Painting: function Painting() {
            initConstructor(this, ...arguments);
        }
    }

    let __symbolAutoAdder = 0;
    const __generateSymbolName = function (_symbol = "symbol") {
        const serializedID = String(Math.random()).substr(2);
        return `$${_symbol}_${__symbolAutoAdder++}_${serializedID}`;
    }

    const numberUtils = {
        DEG2RAD: Math.PI / 180,
        RAD2DEG: 180 / Math.PI,

        wheelClamp: function (_num, _a = 0, _b = 0) {
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
        lock: function (_num, _a, _b) {
            if (!helperUtils.isNumber(_num)) return 0;
            if (!helperUtils.isNumber(_a)) return _num;
            if (!helperUtils.isNumber(_b)) _b = _a;
            if (_num < _a) _num = _a;
            else if (_num > _b) _num = _b;
            return _num;
        },
        inRange: function (_num, _a = 0, _b = 0) {
            if (!helperUtils.isNumber(_num)) return false;
            if (!helperUtils.isNumber(_a)) return false;
            if (!helperUtils.isNumber(_b)) return _num === _a;


            const _min = Math.min(_a, _b);
            const _max = Math.max(_a, _b);

            return _num >= _min && _num <= _max;
        },
        validateNum: function (_val, _range = 1, _min = 0, _max = 1) {
            if (typeof _val === "string" && /^-?\d+%$/.test(_val)) {
                _val = parseInt(_val) / 100 * _range;
            } else
                _val = _val;
            return this.lock(_val, _min, _max);
        },
        eitherOr: function (_num, _either, _or) {
            if (!helperUtils.isNumber(_num)) return 0;
            if (!helperUtils.isNumber(_either) || !helperUtils.isNumber(_or)) return _num;
            if (_num !== _either && _num !== _or) _num = _either;
            else if (_num === _either) _num = _or;
            else if (_num === _or) _num = _either;
            return _num;
        },
        cycle: function (_num, _max, _min = 0, _inc = 1) {
            if (!helperUtils.isNumber(_num) || !helperUtils.isNumber(_max)) return 0;
            if (!helperUtils.isNumber(_min)) _min = 0;
            if (!helperUtils.isNumber(_inc)) _inc = 1;
            _num = this.lock(_num, _min, _max);
            if (_num < _max) _num += _inc || 1;
            else _num = _min;
            return _num;
        },
        perXSeconds: function (_num) {
            return _num * 1000;
        },
        xPerSecond: function (_num) {
            return 1000 / _num;
        },
        rotatePoint: function (_x, _y, _angle) {
            if (_angle === 0) return this.newPoint(_x, _y);
            const angle = this.degreesToRadians(_angle);
            const [pX, pY] = [_x, _y];

            const rX = pX * Math.cos(angle) - pY * Math.sin(angle);
            const rY = pX * Math.sin(angle) + pY * Math.cos(angle);

            return this.newPoint(rX, rY);
        },
        newPoint: function (_objOrX = 0, _y = 0) {
            if (typeof _objOrX === "object")
                return { _x: _objOrX._x, _y: _objOrX._y };
            else
                return { _x: _objOrX, _y };
        },
        minMax: function (_cord, _criteria, ...points) {
            const pointArray = points.map(point => point[_cord]);
            return Math[_criteria](...pointArray);
        },
        degreesToRadians: function (_degrees) {
            return _degrees * this.DEG2RAD;
        },
        radiansToDegrees: function (_radians) {
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
        filterObject: function (_obj = {}, _string = "", _find = true) {
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
        multiplyObject: function (_obj = {}, _multiplier) {
            const temp = [];
            for (let i = 0; i < _multiplier; i++)
                temp.push(_obj);
            return temp;
        },
        lockObject: function (_obj = {}) {
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
        emptyObject: function (_obj = {}) {
            for (const key of Object.keys(_obj))
                delete _obj[key];
        },
        objectLength: function (_obj = {}) {
            return Object.keys(_obj).length;
        },
        clone: function (_obj) {
            if (_obj === null || typeof (_obj) !== 'object')
                return _obj;

            let _temp;
            _temp = new _obj.constructor();
            for (let _key of Object.keys(_obj)) {
                if (_obj.hasOwnProperty(_key)) {
                    if (Object.getOwnPropertyDescriptor(_obj, _key).value instanceof Object) {
                        _temp[_key] = this.clone(_obj[_key]);
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
        random: function (_a, _b) {
            let result;
            let random = Math.random();
            if (_a !== null && typeof _a === "object") {
                if (helperUtils.isArray(_a)) {
                    if (_b === 1)
                        result = _a[this.random(_a.length - 1)];
                    else
                        result = cloneObject(_a).sort(function () {
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
        isString: function (_val) {
            return typeof _val === "string" || _val === String;
        },
        isNumber: function (_val) {
            return typeof _val === "number" || _val === Number;
        },
        isBigInt: function (_val) {
            return typeof _val === "bigint" || _val === BigInt;
        },
        isBoolean: function (_val) {
            return typeof _val === "boolean" || _val === Boolean;
        },
        isObject: function (_val) {
            try {
                return _val.constructor === Object || _val === Object;
            } catch {
                return false;
            }
        },
        isArray: function (_val) {
            try {
                return _val.constructor === Array || _val === Array;
            } catch {
                return false;
            }
        },
        isSharedObject: function (_val) {
            try {
                return _val.constructor === __constructors.SharedObject || _val === __constructors.SharedObject;
            } catch {
                return false;
            }
        },
        isMouse: function (_val) {
            try {
                return _val.constructor === __constructors.Mouse || _val === __constructors.Mouse;
            } catch {
                return false;
            }
        },
        isKey: function (_val) {
            try {
                return _val.constructor === __constructors.Key || _val === __constructors.Key;
            } catch {
                return false;
            }
        },
        isPrefab: function (_val) {
            try {
                return _val.constructor === __constructors.Prefab || _val === __constructors.Prefab;
            } catch {
                return false;
            }
        },
        isTextField: function (_val) {
            try {
                return _val.constructor === __constructors.TextField || _val === __constructors.TextField;
            } catch {
                return false;
            }
        },
        isFlevaClip: function (_val) {
            return this.isPrefab(_val) || this.isTextField(_val);
        },
        isScene: function (_val) {
            try {
                return _val.constructor === __constructors.Scene || _val === __constructors.Scene;
            } catch {
                return false;
            }
        },
        isScript: function (_val) {
            try {
                return _val.constructor === __constructors.Script || _val === __constructors.Script;
            } catch {
                return false;
            }
        },
        isSprite: function (_val) {
            try {
                return _val.constructor === __constructors.Sprite || _val === __constructors.Sprite;
            } catch {
                return false;
            }
        },
        isGraphic: function (_val) {
            try {
                return _val.constructor === __constructors.Graphic || _val === __constructors.Graphic;
            } catch {
                return false;
            }
        },
        isSound: function (_val) {
            try {
                return _val.constructor === __constructors.Sound || _val === __constructors.Sound;
            } catch {
                return false;
            }
        },
        isPainting: function (_val) {
            try {
                return _val.constructor === __constructors.Painting || _val === __constructors.Painting;
            } catch {
                return false;
            }
        },
        isSpriteSheet: function (_val) {
            try {
                return _val.constructor === __constructors.SpriteSheet || _val === __constructors.SpriteSheet;
            } catch {
                return false;
            }
        },
        isEngine: function (_val) {
            try {
                return _val.constructor === __constructors.Engine || _val === __constructors.Engine;
            } catch {
                return false;
            }
        },
        isEngineNative: function (_val) {
            const notNatives = ["string", "number", "bigint", "boolean", "object", "array", "function", "undefined", "null", "unknown"];
            return !notNatives.includes(this.typeOf(_val));
        },
        isFunction: function (_val) {
            return typeof _val === "function" || _val === Function;
        },
        isScriptOrFunction: function (_val) {
            return this.isScript(_val) || this.isFunction(_val);
        },
        isUndefined: function (_val) {
            return _val === undefined;
        },
        isNull: function (_val) {
            return !this.isUndefined(_val) && !this.isObject(_val);
        },
        isDefined: function (_val) {
            return !this.isUndefined(_val);
        },
        typeOf: function (_val) {
            const types = [
                { func: this.isString, type: "string" },
                { func: this.isNumber, type: "number" },
                { func: this.isBigInt, type: "bigint" },
                { func: this.isBoolean, type: "boolean" },
                { func: this.isObject, type: "object" },
                { func: this.isSharedObject, type: "sharedobject" },
                { func: this.isPrefab, type: "prefab" },
                { func: this.isTextField, type: "textfield" },
                { func: this.isScene, type: "scene" },
                { func: this.isScript, type: "script" },
                { func: this.isSprite, type: "sprite" },
                { func: this.isGraphic, type: "graphic" },
                { func: this.isSound, type: "sound" },
                { func: this.isPainting, type: "painting" },
                { func: this.isSpriteSheet, type: "spritesheet" },
                { func: this.isMouse, type: "mouse" },
                { func: this.isKey, type: "key" },
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

    let __pixelResolution = _options.hitAccuracy || 10;
    let __appearanceFunction = null;
    const __mainStack = {
        list: []
    }

    __mainStack.swapDepths = (_stackName, _depth) => {
        __mainStack.list.find(elem => elem.stackName === _stackName).depth = _depth;
        __mainStack.sortList();
    }
    __mainStack.sortList = () => {
        __mainStack.list.sort((a, b) => a.depth - b.depth);
    }

    const __mouse = {
        _x: 0, _y: 0,
        movX: 0, movY: 0
    }
    const __mouseList = {
        isHidden: false,
    };
    const __mousePressed = {}, __mouseReleased = {};


    const __setMousePosition = function (_event) {
        const rect = __screen.canvas.getBoundingClientRect(),
            scaleX = __screen.canvas.width / rect.width,
            scaleY = __screen.canvas.height / rect.height;

        __mouse.movX = parseInt((_event.clientX - rect.left) * scaleX);
        __mouse.movY = parseInt((_event.clientY - rect.top) * scaleY);
        __mouse._x = __mouse.movX;
        __mouse._y = __mouse.movY;
    }
    const __setMouseDown = function (_event) {
        __setMousePosition(_event);
        if (_event.button === 0) {
            if (__mouseList._left === undefined) __mouseList._left = true;
            if (__mousePressed._left === undefined) __mousePressed._left = true;
        } else if (_event.button === 1) {
            if (__mouseList._middle === undefined) __mouseList._middle = true;
            if (__mousePressed._middle === undefined) __mousePressed._middle = true;
        } else if (_event.button === 2) {
            if (__mouseList._right === undefined) __mouseList._right = true;
            if (__mousePressed._right === undefined) __mousePressed._right = true;
        }
    }
    const __setMouseUp = function (_event) {
        if (_event.button === 0) {
            if (__mouseList._left) delete __mouseList._left;
            if (__mousePressed._left !== undefined) {
                delete __mousePressed._left;
                if (__isRunning) if (__mouseReleased._left === undefined) __mouseReleased._left = true;
            }
        } else if (_event.button === 1) {
            if (__mouseList._middle) delete __mouseList._middle;
            if (__mousePressed._middle !== undefined) {
                delete __mousePressed._middle;
                if (__isRunning) if (__mouseReleased._middle === undefined) __mouseReleased._middle = true;
            }
        } else if (_event.button === 2) {
            if (__mouseList._right) delete __mouseList._right;
            if (__mousePressed._right !== undefined) {
                delete __mousePressed._right;
                if (__isRunning) if (__mouseReleased._right === undefined) __mouseReleased._right = true;
            }
        }
    }
    const __setMouseLeave = function (_event) {
        if (__isRunning) {
            if (__mouseList._left !== undefined) delete __mouseList._left;
            if (__mousePressed._left !== undefined) delete __mousePressed._left;
            if (__mouseReleased._left !== undefined) delete __mouseReleased._left;

            if (__mouseList._middle !== undefined) delete __mouseList._middle;
            if (__mousePressed._middle !== undefined) delete __mousePressed._middle;
            if (__mouseReleased._middle !== undefined) delete __mouseReleased._middle;

            if (__mouseList._right !== undefined) delete __mouseList._right;
            if (__mousePressed._right !== undefined) delete __mousePressed._right;
            if (__mouseReleased._right !== undefined) delete __mouseReleased._right;
        }
    }
    const __clearMouseStates = function () {
        for (const _key of Object.keys(__mousePressed)) {
            if (__mousePressed[_key]) __mousePressed[_key] = false;
        }
        for (const _key of Object.keys(__mouseReleased)) {
            delete __mouseReleased[_key];
        }
    }
    const __setMouseCursor = function (_value) {
        if (MouseModule.hidden)
            __screen.div.style.cursor = "none";
        else
            __screen.div.style.cursor = _value;
    }
    const __getMouseCursor = function (_value) {
        return __screen.div.style.cursor;
    }

    const __keysList = {}, __keysPressed = {}, __keysReleased = {};
    const __setKeyDown = function (_event) {
        _event.preventDefault();

        if (__keysList['code_' + _event.keyCode] === undefined) __keysList['code_' + _event.keyCode] = true;
        if (__keysList['name_' + _event.key.toLowerCase()] === undefined) __keysList['name_' + _event.key.toLowerCase()] = true;

        if (__keysPressed['code_' + _event.keyCode] === undefined) __keysPressed['code_' + _event.keyCode] = true;
        if (__keysPressed['name_' + _event.key.toLowerCase()] === undefined) __keysPressed['name_' + _event.key.toLowerCase()] = true;
    }
    const __setKeyUp = function (_event) {
        if (__keysList['code_' + _event.keyCode]) delete __keysList['code_' + _event.keyCode];
        if (__keysList['name_' + _event.key.toLowerCase()]) delete __keysList['name_' + _event.key.toLowerCase()];

        if (__keysPressed['code_' + _event.keyCode] !== undefined) {
            delete __keysPressed['code_' + _event.keyCode];
            if (__isRunning)
                if (__keysReleased['code_' + _event.keyCode] === undefined) __keysReleased['code_' + _event.keyCode] = true;
        }
        if (__keysPressed['name_' + _event.key.toLowerCase()] !== undefined) {
            delete __keysPressed['name_' + _event.key.toLowerCase()];
            if (__isRunning)
                if (__keysReleased['name_' + _event.key.toLowerCase()] === undefined) __keysReleased['name_' + _event.key.toLowerCase()] = true;
        }
    }
    const __clearKeyStates = function (absolute) {
        for (const _key of Object.keys(__keysPressed)) {
            if (__keysPressed[_key]) __keysPressed[_key] = false;
        }
        for (const _key of Object.keys(__keysReleased)) {
            delete __keysReleased[_key];
        }
        if (absolute) {
            for (const _key of Object.keys(__keysList)) {
                delete __keysList[_key];
            }
        }
    }

    const __callAppearanceFunction = () => {
        if (helperUtils.isScriptOrFunction(__appearanceFunction)) {
            __commandUtils.getScriptOrFunction(__appearanceFunction)(____thisObj);
        }
    }
    const __screen = (function () {
        if (_div == null) _div = document.body;
        const [__width, __height] = [__defaults.stage._width, __defaults.stage._height];

        const canvasdiv = document.createElement('div');
        canvasdiv.setAttribute("style", `border-style: solid; border-width: 2px; width: ${__width}px; height: ${__height}px; position: relative;`);
        canvasdiv.style.overflow = "hidden";
        canvasdiv.style.outline = "none";
        canvasdiv.style.border = 'none';
        canvasdiv.tabIndex = "0";

        const canvas = document.createElement('canvas');
        canvas.setAttribute("style", "position: absolute;");
        canvas.width = __width;
        canvas.height = __height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        Object.defineProperties(ctx, {
            width: {
                get: function () { return __width },
                enumerable: true,
                configurable: false
            },
            height: {
                get: function () { return __height },
                enumerable: true,
                configurable: false
            }
        });

        canvasdiv.appendChild(canvas);
        _div.appendChild(canvasdiv);

        return {
            ctx,
            canvas,
            div: canvasdiv
        }
    })();
    const __library = {
        flevaclips: {}, scripts: {}, scenes: {}, sprites: {}, graphics: {}, spritesheets: {}, paintings: {}, sounds: {},

        hasFlevaClip: function (_name) {
            return !!this.flevaclips[_name];
        },
        hasScript: function (_name) {
            return !!this.scripts[_name];
        },
        hasScene: function (_name) {
            return !!this.scenes[_name];
        },
        hasSprite: function (_name) {
            return !!this.sprites[_name];
        },
        hasGraphic: function (_name) {
            return !!this.graphics[_name];
        },
        hasSound: function (_name) {
            return !!this.sounds[_name];
        },
        hasSpriteSheet: function (_name) {
            return !!this.spritesheets[_name];
        },
        hasPainting: function (_name) {
            return !!this.paintings[_name];
        }
    }
    const heirarchy = {
        scripts: [],
        scene: ""
    }

    const __privateProperties = {
        showingPage: true
    }

    const __private = {
        __emptyFunc: function () { }
    }
    const propertyUtils = {
        listFlevaClips: () => {
            const temp = [];
            for (const i of Object.keys(__library.flevaclips))
                temp.push(`${i}->${__library.flevaclips[i].type}`);
            return temp;
        },
        listScripts: () => {
            return Object.keys(__library.scripts);
        },
        listScenes: () => {
            return Object.keys(__library.scenes);
        },
        listSprites: () => {
            return Object.keys(__library.sprites).filter(_name => _name.substr(0, 1) !== "$");
        },
        listSpriteSheets: () => {
            return Object.keys(__library.spritesheets);
        }
    }

    const __commandUtils = {
        trace: console.log.bind(window.console),
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
        renderFlevaClip: ({ _bounds, _clip, ..._props }, _renderFunc, _parameters = []) => {
            const { ctx } = __screen;
            const { _x = 0, _y = 0, _width = 50, _height = 50, _alpha = 1, _visible, _rotation, _anchorX, _anchorY } = _props;
            if (!__commandUtils.boxHitTest({ _x: 0, _y: 0, _width: ctx.width, _height: ctx.height }, _bounds)) return;
            if (_visible) {
                ctx.save();
                if (helperUtils.isDefined(_alpha) && _alpha !== 1) ctx.globalAlpha = _alpha;
                ctx.translate((_x), (_y));
                if (_rotation) ctx.rotate(numberUtils.degreesToRadians(_rotation));
                ctx.translate(-(_x + _anchorX), -(_y + _anchorY));
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
                _renderFunc(_props, ..._parameters);

                ctx.restore();
            }
            if (__config.EDITOR.canRenderBounds) {
                __config.EDITOR.renderBounds(ctx, { _x, _y, _rotation, _bounds });
            }

        },
        renderScene: (_renderFunc, _parameters = []) => {
            const { ctx } = __screen;
            const _props = { _x: 0, _y: 0, _width: ctx.width, _height: ctx.height };

            ctx.save();
            ctx.beginPath();
            ctx.rect(_props._x, _props._y, _props._width, _props._height);
            ctx.closePath();
            ctx.clip();
            _renderFunc(_props, ..._parameters);
            ctx.restore();
        },
        drawSprite: ({ _x = 0, _y = 0, _width = 50, _height = 50 } = {}, _name) => {
            ___errorsM.checkSpriteNotExist(_name);
            __screen.ctx.drawImage(__library.sprites[_name].src, _x, _y, _width, _height);
        },
        drawGraphic: ({ _x = 0, _y = 0, _width = 50, _height = 50 } = {}, _name) => {
            ___errorsM.checkGraphicNotExist(_name);
            __screen.ctx.drawImage(__library.graphics[_name].src, _x, _y, _width, _height);
        },
        drawPainting: ({ _x = 0, _y = 0, _width = 50, _height = 50 } = {}, _painting) => {
            if (helperUtils.isString(_painting)) {
                ___errorsM.checkPaintingNotExist(_painting);
                let { src } = getPaintingFromLibrary(_painting);
                src = src.bind(__screen.ctx);
                src(__screen.ctx, _x, _y, _width, _height);
            } else if (helperUtils.isScriptOrFunction(_painting))
                __commandUtils.getScriptOrFunction(_painting)(__screen.ctx, _x, _y, _width, _height);
        },
        getPixelMap: (_name) => {
            let pixelMap;
            try {
                pixelMap = __library.sprites[_name].pixelMap;
            } catch { }
            return pixelMap;
        },
        getRotatedMappedPoint: function (_point, props) {
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
                _x: _unflattenedPoint._x + props._anchorX,
                _y: _unflattenedPoint._y + props._anchorY,
            }
            return _initialPoint;
        },
        boxHitTest: function (_source, _target) {
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
        boxHitTestPoint: function (_source, _point) {
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
        pixelHitTest: function (_source, _target) {
            if (!_source.pixelMap) return false;
            return true;
            const __pR = 1;
            const top = Math.floor(Math.max(_source._y, (_target._y - 0)) / __pR) * __pR;
            const bottom = Math.floor(Math.min(_source._y + _source._height, (_target._y - 0) + _target._height) / __pR) * __pR;
            const left = Math.floor(Math.max(_source._x, (_target._x - 0)) / __pR) * __pR;
            const right = Math.floor(Math.min(_source._x + _source._width, (_target._x - 0) + _target._width) / __pR) * __pR;

            const sX = Math.floor((_source._x - 1) / __pixelResolution) * __pixelResolution;
            const sY = Math.floor((_source._y - 1) / __pixelResolution) * __pixelResolution;
            const tX = Math.floor((_target._x - 1) / __pixelResolution) * __pixelResolution;
            const tY = Math.floor((_target._y - 1) / __pixelResolution) * __pixelResolution;

            for (let y = top - 1; y < bottom; y += __pixelResolution) {
                for (let x = left - 1; x < right; x += __pixelResolution) {
                    const pX = Math.floor((x - 0) / __pixelResolution) * __pixelResolution;
                    const pY = Math.floor((y - 0) / __pixelResolution) * __pixelResolution;
                    const pixel1 = _source.pixelMap.data[(pX - sX) + "_" + (pY - sY)];
                    const pixel2 = _target.pixelMap.data[(pX - tX) + "_" + (pY - tY)];

                    if (!pixel1 || !pixel2) {
                        continue;
                    };

                    if (pixel1 > 5 && pixel2 > 5) {
                        return true;
                    }
                }
            }

            return false;
        },
        pixelHitTestPoint: function (_source, _point) {
            if (!_source.pixelMap) return false;

            const flatX = (_point._x - _source._x);
            const flatY = (_point._y - _source._y);



            const spriteX = flatX * (_source.pixelMap._width / _source._width);
            const spriteY = flatY * (_source.pixelMap._height / _source._height);



            const fX = Math.floor(spriteX / __pixelResolution) * __pixelResolution;
            const fY = Math.floor(spriteY / __pixelResolution) * __pixelResolution;


            const pixel = _source.pixelMap.data[(fX) + "_" + (fY)];

            if (!pixel) {
                return false;
            };

            if (pixel > 55) {
                return true;
            }

            return false;
        },
        getScriptOrFunction: function (_script) {
            let newScript;
            if (helperUtils.isScript(_script) && _script.idName) {
                newScript = getScriptFromLibrary(_script.idName);
            } else if (helperUtils.isScriptOrFunction(_script)) {
                newScript = _script;
            }
            return newScript;
        }
    }
    const ___errorsM = {
        checkCanUseName: function (_name, _symbol = "symbol") {
            let canUseName = typeof _name === "string" && _name.trim() !== "" && _name.match(/^[^a-zA-Z_]|[^\w]/g) === null;
            if (!canUseName) throw `Invalid ${_symbol} name declaration: "${_name}".`;
        },
        checkFlevaClipExist: function (_name, _obj) {
            this.checkCanUseName(_name, "flevaclip");
            if (_obj) {
                if (_obj[_name]) throw `FlevaClip already exists: "${_name}".`;
            } else
                if (__library.hasFlevaClip(_name)) throw `FlevaClip already exists: "${_name}".`;
        },
        checkFlevaClipNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `FlevaClip does not exist: "${_name}".`;
            } else
                if (!__library.hasFlevaClip(_name)) throw `FlevaClip does not exist: "${_name}".`;
        },
        checkScriptExist: function (_name, _obj) {
            this.checkCanUseName(_name, "script");
            if (_obj) {
                if (_obj[_name]) throw `Script already exists: "${_name}".`;
            } else
                if (__library.hasScript(_name)) throw `Script already exists: "${_name}".`;
        },
        checkScriptNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Script does not exist: "${_name}".`;
            } else
                if (!__library.hasScript(_name)) throw `Script does not exist: "${_name}".`;
        },
        checkSceneExist: function (_name, _obj) {
            this.checkCanUseName(_name, "scene");
            if (_obj) {
                if (_obj[_name]) throw `Scene already exists: "${_name}".`;
            } else
                if (__library.hasScene(_name)) throw `Scene already exists: "${_name}".`;
        },
        checkSceneNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Scene does not exist: "${_name}".`;
            } else
                if (!__library.hasScene(_name)) throw `Scene does not exist: "${_name}".`;
        },
        checkSpriteExist: function (_name, _obj) {
            this.checkCanUseName(_name, "sprite");
            if (_obj) {
                if (_obj[_name]) throw `Sprite already exists: "${_name}".`;
            } else
                if (__library.hasSprite(_name)) throw `Sprite already exists: "${_name}".`;
        },
        checkSpriteNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Sprite does not exist: "${_name}".`;
            } else
                if (!__library.hasSprite(_name)) throw `Sprite does not exist: "${_name}".`;
        },
        checkGraphicExist: function (_name, _obj) {
            this.checkCanUseName(_name, "graphic");
            if (_obj) {
                if (_obj[_name]) throw `Graphic already exists: "${_name}".`;
            } else
                if (__library.hasGraphic(_name)) throw `Graphic already exists: "${_name}".`;
        },
        checkGraphicNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Graphic does not exist: "${_name}".`;
            } else
                if (!__library.hasGraphic(_name)) throw `Graphic does not exist: "${_name}".`;
        },
        checkSoundExist: function (_name, _obj) {
            this.checkCanUseName(_name, "sound");
            if (_obj) {
                if (_obj[_name]) throw `Sound already exists: "${_name}".`;
            } else
                if (__library.hasSound(_name)) throw `Sound already exists: "${_name}".`;
        },
        checkSoundNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Sound does not exist: "${_name}".`;
            } else
                if (!__library.hasSound(_name)) throw `Sound does not exist: "${_name}".`;
        },
        checkSpriteSheetExist: function (_name, _obj) {
            this.checkCanUseName(_name, "spritesheet");
            if (_obj) {
                if (_obj[_name]) throw `SpriteSheet already exists: "${_name}".`;
            } else
                if (__library.hasSpriteSheet(_name)) throw `SpriteSheet already exists: "${_name}".`;
        },
        checkSpriteSheetNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `SpriteSheet does not exist: "${_name}".`;
            } else
                if (!__library.hasSpriteSheet(_name)) throw `SpriteSheet does not exist: "${_name}".`;
        },
        checkPaintingExist: function (_name, _obj) {
            this.checkCanUseName(_name, "painting");
            if (_obj) {
                if (_obj[_name]) throw `Painting already exists: "${_name}".`;
            } else
                if (__library.hasPainting(_name)) throw `Painting already exists: "${_name}".`;
        },
        checkPaintingNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Painting does not exist: "${_name}".`;
            } else
                if (!__library.hasPainting(_name)) throw `Painting does not exist: "${_name}".`;
        }
    }

    const __loopWorker = (function () {
        const webworker = () => {
            const queue = {};
            self.onmessage = function ({ data }) {
                const { code, id, interval } = data;
                if (code === "step") {
                    queue[id] = setTimeout(() => {
                        self.postMessage({ message: "step", id });
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
            const blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
            blobBuilder.append(code);
            blob = blobBuilder.getBlob("application/javascript");
        }

        const worker = new Worker(URL.createObjectURL(blob));
        return worker;
    })();

    const __pureLoop = class pureLoop {
        constructor(id, workFunc, interval = 1000, errorFunc, skipOlds = false, maxTimes = 0) {
            this.id = id;
            this.expected;
            this.timeout;
            this.interval = interval;
            this.workFunc = workFunc;
            this.errorFunc = errorFunc;
            this.skipOlds = skipOlds;
            this.maxTimes = maxTimes;
            this.isRunning = false;
            this.timesExecuted = 0;

            this.step = this.step.bind(this);
        }

        start(startNow) {
            if (this.isRunning) return;
            this.isRunning = true;
            const intv = (startNow ? 0 : this.interval);
            this.expected = Date.now() + intv;
            __loopWorker.postMessage({ code: "step", id: this.id, interval: intv });
        }

        stop() {
            if (!this.isRunning) return;

            this.isRunning = false;
            __loopWorker.postMessage({ code: "clear", id: this.id });
        }

        async step() {
            let drift = Date.now() - this.expected;
            await this.workFunc();
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
            __loopWorker.postMessage({ code: "step", id: this.id, interval: Math.max(0, this.interval - drift) });
        }
    }

    const __loopManager = (function () {
        const loops = {};
        let __loopCount = 0;
        const generateLoopID = () => {
            const serializedID = String(Math.random()).substr(2);
            return `$loop_${__loopCount++}_${serializedID}`;
        }
        const addLoop = (_func, _TPS, { _startNow: _start = false, _skipOlds = false, _iterations = 0 } = {}) => {
            const loopID = generateLoopID();
            loops[loopID] = {
                type: "loop",
                exec: new __pureLoop(loopID, _func, _TPS, null, _skipOlds, _iterations)
            };
            loops[loopID].exec.start(_start);
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
        const addTimeout = (_func, _TPS) => {
            const loopID = generateLoopID();
            loops[loopID] = {
                type: "timeout",
                exec: new __pureLoop(loopID, _func, _TPS, null, false, 1)
            };
            loops[loopID].exec.start(false);
            return loopID;
        }
        const removeTimeout = (_id) => {
            if (!loops[_id] || !loops[_id].type === "timeout") return;
            loops[_id].exec.stop();
            delete loops[_id];
        }
        __loopWorker.onmessage = function ({ data }) {
            if (!loops[data.id]) return;
            loops[data.id].exec.step();
        }

        const ____returns = {
            addLoop, pauseLoop, playLoop, removeLoop, addTimeout, removeTimeout
        }
        Object.defineProperties(____returns, {
            loops: {
                get: function () { return Object.keys(loops).length; },
                enumerable: false,
                configurable: false
            }
        });

        return ____returns;
    })();


    const __Script = function (_func) {
        _func = __commandUtils.getScriptOrFunction(_func);
        const _script = _func;
        _script.constructor = __constructors.Script;
        return _script;
    }
    const __Scene = function (_inits) {
        const state = {};
        let __appearanceFunction = null;
        let isLoaded = false;

        const __callAppearanceFunction = () => {
            if (helperUtils.isScriptOrFunction(__appearanceFunction)) {
                __commandUtils.getScriptOrFunction(__appearanceFunction)(____appearanceObject);
            }
        }
        const __heirarchy = {
            scripts: [], flevaclips: {},
            visuals: {
                name: null,
                src: null,
                type: null
            }
        }

        const inits = [];
        const finis = [];
        if (helperUtils.isScriptOrFunction(_inits)) {
            inits.push(__commandUtils.getScriptOrFunction(_inits));
        } else if (helperUtils.isArray(_inits)) {
            for (const _init of Object.keys(_inits)) {
                const init = _inits[_init];
                if (helperUtils.isScriptOrFunction(init)) inits.push(__commandUtils.getScriptOrFunction(init));
            }
        }


        let __flevaclipCount = 0;
        const __fillState = (_newState) => {
            for (const _name of Object.keys(_newState)) {
                state[_name] = _newState[_name];
            }
        }
        const __clearState = () => {
            for (const _name of Object.keys(state)) {
                delete state[_name];
            }
        }


        const changeState = (_name, _value) => {
            const _newState = {};
            _newState[_name] = _value;

            __fillState(_newState);
            __callAppearanceFunction();
        }
        const useState = (_objOrFunc) => {
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __clearState();
                __fillState(_newState);
                __callAppearanceFunction();
            } else if (helperUtils.isScriptOrFunction(_objOrFunc)) {
                const prevState = objectUtils.deepCloneObject(state);
                const _newState = __commandUtils.getScriptOrFunction(_objOrFunc)(prevState);

                __clearState();
                __fillState(_newState);
                __callAppearanceFunction();
            }
        }
        const setState = (_objOrFunc) => {
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __fillState(_newState);
                __callAppearanceFunction();
            } else if (helperUtils.isScriptOrFunction(_objOrFunc)) {
                const prevState = objectUtils.deepCloneObject(state);
                const _newState = __commandUtils.getScriptOrFunction(_objOrFunc)(prevState);

                __fillState(_newState);
                __callAppearanceFunction();
            }
        }

        const __stack = {
            list: []
        }

        __stack.addToMainStack = () => {
            for (const _name of Object.keys(__stack.list)) {
                __mainStack.list.push(__stack.list[_name]);
            }
            __mainStack.sortList();
        }

        __stack.removeFromMainStack = () => {
            for (const _name of Object.keys(__stack.list)) {
                const flevaclip = __stack.list[_name];
                const index = __mainStack.list.findIndex(elem => elem.stackName === flevaclip.stackName);

                if (index !== -1) {
                    __mainStack.list.splice(index, 1);
                }
            }
        }

        const __addFlevaClip = (_flevaclipType, _flevaclipCount, _instanceName, _preserve, _props, _inits) => {
            const _stackName = __generateSymbolName("stack");
            const _swapDepths = (_depth) => __mainStack.swapDepths(_stackName, _depth);
            const _funcs = { swapDepths: _swapDepths };

            const FlevaClip = _flevaclipType === "prefab" ? __Prefab : _flevaclipType === "textfield" ? __TextField : false;

            __heirarchy.flevaclips[_flevaclipCount] = {
                stackName: _stackName,
                instanceName: _instanceName,
                preserve: _preserve,
                instance: FlevaClip(_props, _inits, _funcs)
            }
            __stack.list[__stack.list.length] = {
                stackName: _stackName,
                depth: 1,
                instance: __heirarchy.flevaclips[_flevaclipCount].instance,
                render: function () {
                    this.instance.__private__.__render();
                }
            }

            if (isLoaded)
                __mainStack.sortList();
        }
        const addFlevaClip = (_flevaclipType, ..._args) => {
            let modifiedInit, modifiedProps = {}, instanceName, preserve = false, _props;
            if (helperUtils.isString(_args[0])) {
                const _name = _args[0];

                if (helperUtils.isObject(_args[1]) && helperUtils.isScriptOrFunction(_args[2])) {
                    modifiedProps = _args[1] || {};
                    modifiedInit = __commandUtils.getScriptOrFunction(_args[2]);
                } else if (helperUtils.isScriptOrFunction(_args[1])) {
                    modifiedInit = __commandUtils.getScriptOrFunction(_args[1]);
                } else if (helperUtils.isObject(_args[1])) {
                    modifiedProps = _args[1] || {};
                }
                const { instanceName: __instanceName, preserve: __preserve = false, ...__props } = modifiedProps;
                [instanceName, preserve, _props] = [__instanceName, __preserve, __props];

                if (!(__heirarchy.flevaclips[__flevaclipCount] && __heirarchy.flevaclips[__flevaclipCount].preserve && preserve)) {
                    const originalPrefabSkeleton = __getFlevaClipFromLibrary(_name).__private__;
                    const flevaclipType = originalPrefabSkeleton.___getType();

                    if (_flevaclipType !== flevaclipType) throw `Expected ${_flevaclipType} flevaclip but received ${flevaclipType} instead.`;
                    let _init = originalPrefabSkeleton.___getInit();
                    if (modifiedInit) _init = [..._init, modifiedInit];

                    const _oldProps = originalPrefabSkeleton.___getProps();

                    __addFlevaClip(_flevaclipType, __flevaclipCount, instanceName, preserve, { ..._oldProps, ..._props }, _init);
                }
                __flevaclipCount++;
            } else if (helperUtils.isObject(_args[0]) && helperUtils.isScriptOrFunction(_args[1])) {
                modifiedProps = _args[0] || {};
                const _init = __commandUtils.getScriptOrFunction(_args[1]);
                const { instanceName: __instanceName, preserve: __preserve = false, ...__props } = modifiedProps;
                [instanceName, preserve, _props] = [__instanceName, __preserve, __props];

                if (!(__heirarchy.flevaclips[__flevaclipCount] && __heirarchy.flevaclips[__flevaclipCount].preserve && preserve)) {
                    __addFlevaClip(_flevaclipType, __flevaclipCount, instanceName, preserve, _props, _init);
                }
                __flevaclipCount++;
            } else if (helperUtils.isScriptOrFunction(_args[0])) {
                const _init = __commandUtils.getScriptOrFunction(_args[0]);
                const { instanceName: __instanceName, preserve: __preserve = false, ...__props } = modifiedProps;
                [instanceName, preserve, _props] = [__instanceName, __preserve, __props];

                if (!(__heirarchy.flevaclips[__flevaclipCount] && __heirarchy.flevaclips[__flevaclipCount].preserve && preserve)) {
                    __addFlevaClip(_flevaclipType, __flevaclipCount, instanceName, preserve, _props, _init);
                }
                __flevaclipCount++;
            } else if (helperUtils.isObject(_args[0])) {
                modifiedProps = _args[0] || {};
                const _init = __private.__emptyFunc;
                const { instanceName: __instanceName, preserve: __preserve = false, ...__props } = modifiedProps;
                [instanceName, preserve, _props] = [__instanceName, __preserve, __props];

                if (!(__heirarchy.flevaclips[__flevaclipCount] && __heirarchy.flevaclips[__flevaclipCount].preserve && preserve)) {
                    __addFlevaClip(_flevaclipType, __flevaclipCount, instanceName, preserve, _props, _init);
                }
                __flevaclipCount++;
            }




        }

        const addTextField = (...args) => {
            addFlevaClip("textfield", ...args);
        }
        const addPrefab = (...args) => {
            addFlevaClip("prefab", ...args);
        }

        const __clearBackground = () => {
            __heirarchy.visuals.name = null;
            __heirarchy.visuals.src = null;
            __heirarchy.visuals.type = null;
        }

        const useGraphic = (_name) => {
            if (helperUtils.isGraphic(_name))
                _name = _name.idName;
            ___errorsM.checkGraphicNotExist(_name);
            if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Graphic) && __heirarchy.visuals.name === _name) return;

            __clearBackground();
            __heirarchy.visuals.name = _name;
            __heirarchy.visuals.src = _name;
            __heirarchy.visuals.type = helperUtils.typeOf(__constructors.Graphic);
        }

        const usePainting = (_painting) => {
            if (helperUtils.isPainting(_painting))
                _painting = _painting.idName;
            if (helperUtils.isString(_painting)) {
                const _name = _painting;
                ___errorsM.checkPaintingNotExist(_name);
                if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Painting) && __heirarchy.visuals.name === _name) return;

                __clearBackground();
                __heirarchy.visuals.name = _name;
                __heirarchy.visuals.src = _name;
                __heirarchy.visuals.type = helperUtils.typeOf(__constructors.Painting);
            } else if (helperUtils.isScriptOrFunction(_painting)) {
                __clearBackground();
                const _function = __commandUtils.getScriptOrFunction(_painting);
                __heirarchy.visuals.name = "painting";
                __heirarchy.visuals.src = _function.bind(__screen.ctx);
                __heirarchy.visuals.type = helperUtils.typeOf(__constructors.Painting);
            }
        }

        const addScript = (_script) => {
            if (helperUtils.isString(_script)) {
                const _newScript = getScriptFromLibrary(_script);
                __heirarchy.scripts.push(__Script(_newScript).bind(____thisObj));
            } else if (helperUtils.isScriptOrFunction(_script)) {
                const _newScript = __commandUtils.getScriptOrFunction(_script);
                __heirarchy.scripts.push(__Script(_newScript).bind(____thisObj));
            }
        }

        const setAppearanceFunction = (_script) => {
            if (helperUtils.isString(_script)) {
                const _newScript = getScriptFromLibrary(_script);
                __appearanceFunction = __Script(_newScript).bind(____appearanceObject);
            } else if (helperUtils.isScriptOrFunction(_script)) {
                const _newScript = __commandUtils.getScriptOrFunction(_script);
                __appearanceFunction = __Script(_newScript).bind(____appearanceObject);
            }
        }

        const load = async () => {
            if (isLoaded) return;
            if (inits.length > 0)
                for (const init of Object.keys(inits)) {
                    const _init = inits[init].bind(____thisObj);
                    const fini = await _init(____thisObj);
                    if (helperUtils.isScriptOrFunction(fini)) finis.push(__commandUtils.getScriptOrFunction(fini));
                }

            __stack.addToMainStack();

            for (const _name of Object.keys(__heirarchy.flevaclips)) {
                await __heirarchy.flevaclips[_name].instance.__private__.__load();
            }

            __callAppearanceFunction();
            isLoaded = true;
        }
        const unload = async () => {
            if (!isLoaded) return;

            if (finis.length > 0) {
                for (const fini of Object.keys(finis)) {
                    const _fini = finis[fini].bind(____thisObj);
                    await _fini(____thisObj);
                }
                finis.length = 0;
            }

            __stack.removeFromMainStack();

            for (const _name of Object.keys(__heirarchy.flevaclips)) {
                if (!__heirarchy.flevaclips[_name].preserve) {
                    const flevaclip = __heirarchy.flevaclips[_name];
                    const index = __stack.list.findIndex(elem => elem.stackName === flevaclip.stackName);

                    if (index !== -1) {
                        __stack.list.splice(index, 1);
                    }

                    await flevaclip.instance.__private__.__unload();
                    delete __heirarchy.flevaclips[_name];
                }
            }
            __flevaclipCount = 0;

            __heirarchy.scripts.length = 0;

            isLoaded = false;
        }

        const tick = async function () {
            for (const _name of Object.keys(__heirarchy.scripts)) {
                const _script = __heirarchy.scripts[_name];
                await _script(____thisObj);
            }

            for (const _name of Object.keys(__heirarchy.flevaclips)) {
                if (helperUtils.isDefined(__heirarchy.flevaclips[_name])) await __heirarchy.flevaclips[_name].instance.__private__.__tick();
            }

        }
        const render = function () {
            const _clip = true;
            if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Sprite) ||
                __heirarchy.visuals.type === helperUtils.typeOf(__constructors.SpriteSheet)) {
                __commandUtils.renderScene(__commandUtils.drawSprite, [__heirarchy.visuals.src]);
            } else if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Graphic)) {
                __commandUtils.renderScene(__commandUtils.drawGraphic, [__heirarchy.visuals.src]);
            } else if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Painting)) {
                __commandUtils.renderScene(__commandUtils.drawPainting, [__heirarchy.visuals.src]);
            }
        }
        const start = function () {
            for (const _name of Object.keys(__heirarchy.flevaclips)) {
                __heirarchy.flevaclips[_name].instance.__private__.__start();
            }
        }
        const stop = function () {
            for (const _name of Object.keys(__heirarchy.flevaclips)) {
                __heirarchy.flevaclips[_name].instance.__private__.__stop();
            }
        }

        const propertyUtils = {
            flevaclipCount: () => {
                return __flevaclipCount;
            }
        }

        const __private__ = {
            ___getFlevaClipByInstanceName: (_instanceName) => {
                for (const _name of Object.keys(__heirarchy.flevaclips)) {
                    if (__heirarchy.flevaclips[_name].instanceName === _instanceName) {
                        return __heirarchy.flevaclips[_name].instance;
                    }
                }
                return undefined;
            },
            __start: start, __stop: stop,
            __load: load, __unload: unload,
            __tick: tick, __render: render
        }

        const ____returns = new __constructors.Scene({
            propertyUtils,
            state,
            changeState,
            useState,
            setState,
            addPrefab,
            addTextField,
            addScript,
            setAppearance: setAppearanceFunction
        });


        Object.defineProperties(____returns, {
            __private__: {
                get: function () { return __private__ },
                enumerable: false,
                configurable: false
            }
        });

        const ____initFunc = function () {
            return ____returns;
        }
        const ____thisObj = ____initFunc();
        const ____appearanceObject = {
            state,
            useGraphic,
            usePainting
        }
        return ____returns;
    }
    const ___TextField = function ({ _x = 0, _y = 0, _width = 100, _height = 20, _padding = 0, _fontSize = 20, _lineHeight = 0, _fontFamily = "sansSerif", _textAlign = "left", _text: _initialText, _multiline = true, _wordWrap = true, _type = "dynamic", _backgroundColor = 0, _borderColor = 0, _fontColor = "black", _alpha = 1, _visible = true, _rotation = 0, _anchorX = 0, _anchorY = 0 } = {}) {
        const { div, ctx } = __screen;
        const init = {};
        init.x = parseInt(_x);
        init.y = parseInt(_y);
        init.width = parseInt(_width);
        init.height = parseInt(_height);
        init.padding = parseInt(_padding);
        init.fontSize = parseInt(_fontSize);
        init.fontColor = _fontColor;
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
        if (arguments[0]) {
            const _props = arguments[0];
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
            Object.defineProperties(__returns,
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
                Object.defineProperties(__returns,
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
                                        __clearSelectedFlevaClip();
                                        __setSelectedFlevaClip(navigation.unselect);
                                    } else
                                        __clearSelectedFlevaClip();
                            },
                            enumerable: true
                        }
                    }
                )
            if (["input", "dynamic"].includes(__private.__type))
                Object.defineProperties(__returns,
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
                                __private.__font = val.replace(/-([A-Za-z])/g, (a, b) => b.toUpperCase());
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
                                __private.__lineHeight = parseInt(val);
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
            events.mouseUp = e => {
                navigation.checkMouseAction(e, init.keys.shft, "up");
            }
            events.mouseMove = e => {
                navigation.checkMouseAction(e, init.keys.shft, "move");
            }
            events.keyDown = e => {
                navigation.checkKeyDown(e);
            };
            events.keyUp = e => {
                navigation.checkKeyUp(e);
            }
            if (__private.__type !== "dynamic") {
                __private__.__load = () => {
                    div.addEventListener("mouseup", events.mouseUp);
                    div.addEventListener("mousemove", events.mouseMove);
                    div.addEventListener("keydown", events.keyDown);
                    div.addEventListener("keyup", events.keyUp);
                }
                __private__.__unload = () => {
                    div.removeEventListener("mouseup", events.mouseUp);
                    div.removeEventListener("mousemove", events.mouseMove);
                    div.removeEventListener("keydown", events.keyDown);
                    div.removeEventListener("keyup", events.keyUp);
                    meta.resetSelectedArea();
                }
                __private__.___setSelection = (_x, _y) => {
                    navigation.checkMouseAction({ offsetX: _x, offsetY: _y }, init.keys.shft, "down");
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
                navigation.checkMouseAction = ({ offsetX, offsetY }, shift, mouseEventType) => {
                    if (mouseEventType === "down" && !shift) {
                        meta.resetSelectedArea();
                    }

                    if (mouseEventType === "down") {
                        __private.__focused = __private.__hovered;
                    }

                    const { _x: mouseX, _y: mouseY } = __commandUtils.getRotatedMappedPoint({ _x: offsetX, _y: offsetY }, __returns);

                    if (mouseEventType === "move") {
                        __private.__hovered =
                            mouseX >= __private.__x &&
                            mouseX <= __private.__x + __private.__width &&
                            mouseY >= __private.__y &&
                            mouseY <= __private.__y + __private.__height;
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
            if (__private.__hovered) __setMouseCursor("text");
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

        const __private__ = {
            __render: render,
            __tick: tick
        }

        const __returns = {
            ...accessibles, ...defs
        }

        init.initialize();

        return {
            props: __returns,
            __privateProps: __private__
        };
    }
    const __TextField = function (_props, _inits, _funcs) {
        const state = {};
        const { props, __privateProps } = ___TextField(_props);
        let isLoaded = false;

        let __rotation = 0, __anchorX = 0, __anchorY = 0;
        Object.defineProperties(props, {
            _rotation: {
                get: function () { return __rotation },
                set: function (_val) {
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
                get: function () { return __anchorX * props._width },
                set: function (_val) {
                    if (typeof _val === "string" && /^\d+%$/.test(_val)) {
                        __anchorX = parseInt(_val) / 100;
                    } else
                        __anchorX = _val / (props._width || 1);
                },
                enumerable: true,
                configurable: false
            },
            _anchorY: {
                get: function () { return __anchorY * props._height },
                set: function (_val) {
                    if (typeof _val === "string" && /^\d+%$/.test(_val)) {
                        __anchorY = parseInt(_val) / 100;
                    } else
                        __anchorY = _val / (props._height || 1);
                },
                enumerable: true,
                configurable: false
            }
        });

        if (_props) {
            if (!helperUtils.isObject(_props)) return;
            for (const _prop of Object.keys(_props))
                if (helperUtils.isDefined(props[_prop])) props[_prop] = _props[_prop];
        }

        const __heirarchy = {
            scripts: []
        }

        const inits = [];
        const finis = [];
        if (helperUtils.isScriptOrFunction(_inits)) {
            inits.push(__commandUtils.getScriptOrFunction(_inits));
        } else if (helperUtils.isArray(_inits)) {
            for (const _init of Object.keys(_inits)) {
                const init = _inits[_init];
                if (helperUtils.isScriptOrFunction(init)) inits.push(__commandUtils.getScriptOrFunction(init));
            }
        }
        const __getBounds = function () {
            const { _x, _y, _width, _height, _rotation, _anchorX: ax, _anchorY: ay } = props;
            const fx = -ax, fy = -ay;
            const fw = _width - ax, fh = _height - ay;

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


        const __fillState = (_newState) => {
            for (const _name of Object.keys(_newState)) {
                state[_name] = _newState[_name];
            }
        }
        const __clearState = () => {
            for (const _name of Object.keys(state)) {
                delete state[_name];
            }
        }
        const changeState = (_name, _value) => {
            const _newState = {};
            _newState[_name] = _value;

            __fillState(_newState);
        }
        const useState = (_objOrFunc) => {
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __clearState();
                __fillState(_newState);
            } else if (helperUtils.isScriptOrFunction(_objOrFunc)) {
                const prevState = objectUtils.deepCloneObject(state);
                const _newState = __commandUtils.getScriptOrFunction(_objOrFunc)(prevState);

                __clearState();
                __fillState(_newState);
            }
        }
        const setState = (_objOrFunc) => {
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __fillState(_newState);
            } else if (helperUtils.isScriptOrFunction(_objOrFunc)) {
                const prevState = objectUtils.deepCloneObject(state);
                const _newState = __commandUtils.getScriptOrFunction(_objOrFunc)(prevState);

                __fillState(_newState);
            }
        }

        const localToGlobal = (_point) => {
            return {
                _x: _point._x + props._x,
                _y: _point._y + props._y
            }
        }

        const localRelativeToGlobal = (_point) => {
            const _reRotatedPoint = numberUtils.rotatePoint(_point._x, _point._y, -props._rotation);
            return {
                _x: _reRotatedPoint._x + props._x,
                _y: _reRotatedPoint._y + props._y
            }
        }

        const globalToLocal = (_point) => {
            return {
                _x: _point._x - props._x,
                _y: _point._y - props._y
            }
        }

        const globalToLocalRelative = (_point) => {
            return numberUtils.rotatePoint(_point._x - props._x, _point._y - props._y, props._rotation);
        }

        const swapDepths = (_depth) => {
            if (_funcs && _funcs.swapDepths) _funcs.swapDepths(_depth);
        }

        const hitTestPoint = (_x, _y, _pixel) => {
            if (!helperUtils.isNumber(_x)) throw `Number expected for _x point.`;
            if (!helperUtils.isNumber(_y)) throw `Number expected for _y point.`;

            const sourceProps = props;
            const targetPoint = { _x, _y };
            if (!sourceProps._visible) return false;

            if (!_pixel) {
                const sourceBounds = __getBounds();
                return __commandUtils.boxHitTestPoint(sourceBounds, targetPoint);
            } else {
                const rotatedPoint = __commandUtils.getRotatedMappedPoint(targetPoint, props);
                return __commandUtils.boxHitTestPoint(sourceProps, rotatedPoint);
            }
        }

        const hitTestFlevaClip = (_flevaclipOrName, _pixel) => {
            let flevaclip;
            if (helperUtils.isFlevaClip(_flevaclipOrName))
                flevaclip = _flevaclipOrName;
            else if (helperUtils.isString(_flevaclipOrName))
                flevaclip = __getFlevaClipByInstanceName(_flevaclipOrName);
            else throw `Invalid flevaclip argument! FlevaClip or string expected.`;
            if (!flevaclip) throw `FlevaClip with instance name ${_flevaclipOrName} not found.`;

            const sourceProps = props;
            const targetProps = flevaclip.__private__.___getProps();
            const sourceBounds = __getBounds();
            const targetBounds = flevaclip.__private__.___getBounds();
            if (!sourceProps._visible || !targetProps._visible) return false;

            if (__commandUtils.boxHitTest(sourceBounds, targetBounds)) {
                return true;
            }

            return false;
        }

        const addScript = (_script) => {
            if (helperUtils.isString(_script)) {
                const _newScript = getScriptFromLibrary(_script);
                __heirarchy.scripts.push(__Script(_newScript).bind(____thisObj));
            } else if (helperUtils.isScriptOrFunction(_script)) {
                const _newScript = __commandUtils.getScriptOrFunction(_script);
                __heirarchy.scripts.push(__Script(_newScript).bind(____thisObj));
            }
        }
        const load = async () => {
            if (isLoaded) return;
            if (inits.length > 0)
                for (const init of Object.keys(inits)) {
                    const _init = inits[init].bind(____thisObj);
                    const fini = await _init(____thisObj);
                    if (helperUtils.isScriptOrFunction(fini)) finis.push(__commandUtils.getScriptOrFunction(fini));
                }

            if (__privateProps.__load) __privateProps.__load();
            isLoaded = true;
        }
        const unload = async () => {
            if (!isLoaded) return;

            if (finis.length > 0) {
                for (const fini of Object.keys(finis)) {
                    const _fini = finis[fini].bind(____thisObj);
                    await _fini(____thisObj);
                }
                finis.length = 0;
            }

            __heirarchy.scripts.length = 0;
            if (__privateProps.__unload) __privateProps.__unload();
            isLoaded = false;
        }

        const tick = async () => {
            for (const _name of Object.keys(__heirarchy.scripts)) {
                const _script = __heirarchy.scripts[_name];
                await _script(____thisObj);
            }
            __privateProps.__tick();
        }
        const render = () => {
            __commandUtils.renderFlevaClip({ ...props, _bounds: __getBounds() }, __privateProps.__render);
        }
        const start = () => {
        }
        const stop = () => {
        }

        const isMouseInFlevaClip = (_x, _y) => {
            if (!props._visible) return false;
            const source = props;
            const rotatedPoint = __commandUtils.getRotatedMappedPoint({ _x, _y }, props);
            if (__commandUtils.boxHitTestPoint(source, rotatedPoint)) {
                return true;
            }

            return false;
        }

        const __private__ = {
            ___overrideProps: (_props) => {
                if (!helperUtils.isObject(_props)) return;
                for (const _prop of Object.keys(_props))
                    if (helperUtils.isDefined(props[_prop])) props[_prop] = _props[_prop];
            },
            ___getInit: () => inits,
            ___getType: () => helperUtils.typeOf(____thisObj),
            ___getProps: () => ({ ...props }),
            ___getBounds: __getBounds,
            _isMouseInFlevaClip: isMouseInFlevaClip,
            __start: start, __stop: stop,
            __load: load, __unload: unload,
            __tick: tick, __render: render,
        }
        if (__privateProps.___setSelection) __private__.___setSelection = __privateProps.___setSelection;


        const ____returns = new __constructors.TextField({
            state,
            hitTestFlevaClip,
            hitTestPoint,
            changeState,
            useState,
            setState,
            addScript,
            localToGlobal,
            localRelativeToGlobal,
            globalToLocal,
            globalToLocalRelative,
            swapDepths
        });

        Object.defineProperties(____returns, {
            __private__: {
                get: function () { return __private__ },
                enumerable: false,
                configurable: false
            }
        });
        for (let prop of Object.keys(props)) {
            Object.defineProperty(____returns, prop, {
                get: function () { return props[prop] },
                set: function () { props[prop] = arguments[0] },
                enumerable: true,
                configurable: false
            });
        }

        const ____initFunc = function () {
            return ____returns;
        }
        const ____thisObj = ____initFunc();

        return ____returns;
    }
    const __Prefab = function (_props = { _x: 0, _y: 0, _width: 50, _height: 50, _alpha: 1, _visible: true, _rotation: 0, _anchorX: 0, _anchorY: 0 }, _inits, _funcs) {
        const state = {}, props = { _x: 0, _y: 0, _width: 50, _height: 50, _alpha: 1, _visible: true, _rotation: 0, _anchorX: 0, _anchorY: 0 };
        let __appearanceFunction = null;
        let isLoaded = false;

        let __rotation = 0, __anchorX = 0, __anchorY = 0;
        Object.defineProperties(props, {
            _rotation: {
                get: function () { return __rotation },
                set: function (_val) {
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
                get: function () { return __anchorX * props._width },
                set: function (_val) {
                    if (typeof _val === "string" && /^\d+%$/.test(_val)) {
                        __anchorX = parseInt(_val) / 100;
                    } else
                        __anchorX = _val / (props._width || 1);
                },
                enumerable: true,
                configurable: false
            },
            _anchorY: {
                get: function () { return __anchorY * props._height },
                set: function (_val) {
                    if (typeof _val === "string" && /^\d+%$/.test(_val)) {
                        __anchorY = parseInt(_val) / 100;
                    } else
                        __anchorY = _val / (props._height || 1);
                },
                enumerable: true,
                configurable: false
            }
        });

        const __callAppearanceFunction = () => {
            if (helperUtils.isScriptOrFunction(__appearanceFunction)) {
                __commandUtils.getScriptOrFunction(__appearanceFunction)(____appearanceObject);
            }
        }
        if (_props) {
            if (!helperUtils.isObject(_props)) return;
            for (const _prop of Object.keys(_props))
                if (helperUtils.isDefined(props[_prop])) props[_prop] = _props[_prop];
        }

        const __heirarchy = {
            scripts: [],
            visuals: {
                src: null,
                type: null,
                name: null
            }
        }

        const inits = [];
        const finis = [];
        if (helperUtils.isScriptOrFunction(_inits)) {
            inits.push(__commandUtils.getScriptOrFunction(_inits));
        } else if (helperUtils.isArray(_inits)) {
            for (const _init of Object.keys(_inits)) {
                const init = _inits[_init];
                if (helperUtils.isScriptOrFunction(init)) inits.push(__commandUtils.getScriptOrFunction(init));
            }
        }
        const __getBounds = function () {
            const { _x, _y, _width, _height, _rotation, _anchorX: ax, _anchorY: ay } = props;
            const fx = -ax, fy = -ay;
            const fw = _width - ax, fh = _height - ay;

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

        const __fillState = (_newState) => {
            for (const _name of Object.keys(_newState)) {
                state[_name] = _newState[_name];
            }
        }
        const __clearState = () => {
            for (const _name of Object.keys(state)) {
                delete state[_name];
            }
        }
        const changeState = (_name, _value) => {
            const _newState = {};
            _newState[_name] = _value;

            __fillState(_newState);
            __callAppearanceFunction();
        }
        const useState = (_objOrFunc) => {
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __clearState();
                __fillState(_newState);
                __callAppearanceFunction();
            } else if (helperUtils.isScriptOrFunction(_objOrFunc)) {
                const prevState = objectUtils.deepCloneObject(state);
                const _newState = __commandUtils.getScriptOrFunction(_objOrFunc)(prevState);

                __clearState();
                __fillState(_newState);
                __callAppearanceFunction();
            }
        }
        const setState = (_objOrFunc) => {
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __fillState(_newState);
                __callAppearanceFunction();
            } else if (helperUtils.isScriptOrFunction(_objOrFunc)) {
                const prevState = objectUtils.deepCloneObject(state);
                const _newState = __commandUtils.getScriptOrFunction(_objOrFunc)(prevState);

                __fillState(_newState);
                __callAppearanceFunction();
            }
        }

        const localToGlobal = (_point) => {
            return {
                _x: _point._x + props._x,
                _y: _point._y + props._y
            }
        }

        const localRelativeToGlobal = (_point) => {
            const _reRotatedPoint = numberUtils.rotatePoint(_point._x, _point._y, -props._rotation);
            return {
                _x: _reRotatedPoint._x + props._x,
                _y: _reRotatedPoint._y + props._y
            }
        }

        const globalToLocal = (_point) => {
            return {
                _x: _point._x - props._x,
                _y: _point._y - props._y
            }
        }

        const globalToLocalRelative = (_point) => {
            return numberUtils.rotatePoint(_point._x - props._x, _point._y - props._y, props._rotation);
        }

        const swapDepths = (_depth) => {
            if (_funcs && _funcs.swapDepths) _funcs.swapDepths(_depth);
        }

        const hitTestPoint = (_x, _y, _pixel) => {
            if (!helperUtils.isNumber(_x)) throw `Number expected for _x point.`;
            if (!helperUtils.isNumber(_y)) throw `Number expected for _y point.`;

            const sourceProps = props;
            const targetPoint = { _x, _y };
            if (!sourceProps._visible) return false;

            const isSpriteOrSheet = (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Sprite) ||
                __heirarchy.visuals.type === helperUtils.typeOf(__constructors.SpriteSheet));
            if (!_pixel || !isSpriteOrSheet) {
                const sourceBounds = __getBounds();
                if (__commandUtils.boxHitTestPoint(sourceBounds, targetPoint)) {
                    return true;
                }
            } else {
                const sourceSprite = __heirarchy.visuals.src;
                if (!sourceSprite) return false;
                const sourcePixelMap = __commandUtils.getPixelMap(sourceSprite);
                const source = { ...sourceProps, pixelMap: sourcePixelMap };
                const rotatedPoint = __commandUtils.getRotatedMappedPoint(targetPoint, props);

                if (__commandUtils.boxHitTestPoint(source, rotatedPoint)) {
                    if (__commandUtils.pixelHitTestPoint(source, rotatedPoint)) {
                        return true;
                    }
                }
            }

            return false;
        }

        const hitTestFlevaClip = (_flevaclipOrName, _pixel) => {
            let flevaclip;
            if (helperUtils.isFlevaClip(_flevaclipOrName))
                flevaclip = _flevaclipOrName;
            else if (helperUtils.isString(_flevaclipOrName))
                flevaclip = __getFlevaClipByInstanceName(_flevaclipOrName);
            else throw `Invalid flevaclip argument! FlevaClip or string expected.`;
            if (!flevaclip) throw `FlevaClip with instance name ${_flevaclipOrName} not found.`;

            const sourceProps = props;
            const targetProps = flevaclip.__private__.___getProps();
            const sourceBounds = __getBounds();
            const targetBounds = flevaclip.__private__.___getBounds();
            if (!sourceProps._visible || !targetProps._visible) return false;

            if (__commandUtils.boxHitTest(sourceBounds, targetBounds)) {
                return true;
            }

            return false;
        }

        const __spriteSheet = [];
        let __spriteSheetID = 0, __spriteSheetLoop = undefined;
        const __resetSpriteSheet = () => {
            if (helperUtils.isDefined(__spriteSheetLoop)) {
                deleteLoop(__spriteSheetLoop);
                __spriteSheet.length = 0;
                __spriteSheetID = 0;
                __spriteSheetLoop = undefined;

            }
            __heirarchy.visuals.name = null;
            __heirarchy.visuals.src = null;
            __heirarchy.visuals.type = null;
        }
        const useSprite = (_name) => {
            if (helperUtils.isSprite(_name))
                _name = _name.idName;
            ___errorsM.checkSpriteNotExist(_name);
            if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Sprite) && __heirarchy.visuals.name === _name) return;

            __resetSpriteSheet();
            __heirarchy.visuals.name = _name;
            __heirarchy.visuals.src = _name;
            __heirarchy.visuals.type = helperUtils.typeOf(__constructors.Sprite);
        }
        const useGraphic = (_name) => {
            if (helperUtils.isGraphic(_name))
                _name = _name.idName;
            ___errorsM.checkGraphicNotExist(_name);
            if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Graphic) && __heirarchy.visuals.name === _name) return;

            __resetSpriteSheet();
            __heirarchy.visuals.name = _name;
            __heirarchy.visuals.src = _name;
            __heirarchy.visuals.type = helperUtils.typeOf(__constructors.Graphic);
        }

        const usePainting = (_painting) => {
            if (helperUtils.isPainting(_painting))
                _painting = _painting.idName;
            if (helperUtils.isString(_painting)) {
                const _name = _painting;
                ___errorsM.checkPaintingNotExist(_name);
                if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Painting) && __heirarchy.visuals.name === _name) return;

                __resetSpriteSheet();
                __heirarchy.visuals.name = _name;
                __heirarchy.visuals.src = _name;
                __heirarchy.visuals.type = helperUtils.typeOf(__constructors.Painting);
            } else if (helperUtils.isScriptOrFunction(_painting)) {
                __resetSpriteSheet();
                const _function = __commandUtils.getScriptOrFunction(_painting);
                __heirarchy.visuals.name = "painting";
                __heirarchy.visuals.src = _function.bind(__screen.ctx);
                __heirarchy.visuals.type = helperUtils.typeOf(__constructors.Painting);
            }
        }
        const useSpriteSheet = (_name, _interval = 1000) => {
            if (helperUtils.isSpriteSheet(_name))
                _name = _name.idName;
            ___errorsM.checkSpriteSheetNotExist(_name);
            if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.SpriteSheet) && __heirarchy.visuals.name === _name) return;

            __resetSpriteSheet();

            __spriteSheet.push(...__library.spritesheets[_name].src);
            __spriteSheetID = 0;

            __spriteSheetLoop = createLoop(() => {
                __spriteSheetID = numberUtils.cycle(__spriteSheetID, __spriteSheet.length - 1);
                const currentSprite = __spriteSheet[__spriteSheetID];
                __heirarchy.visuals.src = currentSprite;
            }, _interval, { _startNow: false, _skipOlds: true });

            __heirarchy.visuals.name = _name;
            __heirarchy.visuals.src = __spriteSheet[__spriteSheetID];
            __heirarchy.visuals.type = helperUtils.typeOf(__constructors.SpriteSheet);
        }
        const addScript = (_script) => {
            if (helperUtils.isString(_script)) {
                const _newScript = getScriptFromLibrary(_script);
                __heirarchy.scripts.push(__Script(_newScript).bind(____thisObj));
            } else if (helperUtils.isScriptOrFunction(_script)) {
                const _newScript = __commandUtils.getScriptOrFunction(_script);
                __heirarchy.scripts.push(__Script(_newScript).bind(____thisObj));
            }
        }

        const setAppearanceFunction = (_script) => {
            if (helperUtils.isString(_script)) {
                const _newScript = getScriptFromLibrary(_script);
                __appearanceFunction = __Script(_newScript).bind(____appearanceObject);
            } else if (helperUtils.isScriptOrFunction(_script)) {
                const _newScript = __commandUtils.getScriptOrFunction(_script);
                __appearanceFunction = __Script(_newScript).bind(____appearanceObject);
            }
        }

        const load = async () => {
            if (isLoaded) return;
            if (inits.length > 0)
                for (const init of Object.keys(inits)) {
                    const _init = inits[init].bind(____thisObj);
                    const fini = await _init(____thisObj);
                    if (helperUtils.isScriptOrFunction(fini)) finis.push(__commandUtils.getScriptOrFunction(fini));
                }

            __callAppearanceFunction();
            isLoaded = true;
        }
        const unload = async () => {
            if (!isLoaded) return;

            if (finis.length > 0) {
                for (const fini of Object.keys(finis)) {
                    const _fini = finis[fini].bind(____thisObj);
                    await _fini(____thisObj);
                }
                finis.length = 0;
            }

            __resetSpriteSheet();

            __heirarchy.scripts.length = 0;
            isLoaded = false;
        }

        const tick = async () => {
            for (const _name of Object.keys(__heirarchy.scripts)) {
                const _script = __heirarchy.scripts[_name];
                await _script(____thisObj);
            }
        }
        const render = () => {
            const _clip = true;
            if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Sprite) ||
                __heirarchy.visuals.type === helperUtils.typeOf(__constructors.SpriteSheet)) {
                __commandUtils.renderFlevaClip({ ...props, _bounds: __getBounds(), _clip }, __commandUtils.drawSprite, [__heirarchy.visuals.src]);
            } else if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Graphic)) {
                __commandUtils.renderFlevaClip({ ...props, _bounds: __getBounds(), _clip }, __commandUtils.drawGraphic, [__heirarchy.visuals.src]);
            } else if (__heirarchy.visuals.type === helperUtils.typeOf(__constructors.Painting)) {
                __commandUtils.renderFlevaClip({ ...props, _bounds: __getBounds(), _clip }, __commandUtils.drawPainting, [__heirarchy.visuals.src]);
            }
        }
        const start = () => {
            __callAppearanceFunction();
        }
        const stop = () => {
            __resetSpriteSheet();
        }

        const isMouseInFlevaClip = (_x, _y) => {
            if (!props._visible) return false;
            const source = props;
            const rotatedPoint = __commandUtils.getRotatedMappedPoint({ _x, _y }, props);
            if (__commandUtils.boxHitTestPoint(source, rotatedPoint)) {
                return true;
            }

            return false;
        }

        const __private__ = {
            ___overrideProps: (_props) => {
                if (!helperUtils.isObject(_props)) return;
                for (const _prop of Object.keys(_props))
                    if (helperUtils.isDefined(props[_prop])) props[_prop] = _props[_prop];
            },
            ___getInit: () => inits,
            ___getType: () => helperUtils.typeOf(____thisObj),
            ___getProps: () => ({ ...props }),
            ___getBounds: __getBounds,
            _isMouseInFlevaClip: isMouseInFlevaClip,
            __start: start, __stop: stop,
            __load: load, __unload: unload,
            __tick: tick, __render: render
        }

        const ____returns = new __constructors.Prefab({
            state,
            hitTestFlevaClip,
            hitTestPoint,
            changeState,
            useState,
            setState,
            addScript,
            setAppearance: setAppearanceFunction,
            localToGlobal,
            localRelativeToGlobal,
            globalToLocal,
            globalToLocalRelative,
            swapDepths
        });

        Object.defineProperties(____returns, {
            __private__: {
                get: function () { return __private__ },
                enumerable: false,
                configurable: false
            }
        });
        for (let prop of Object.keys(props)) {
            Object.defineProperty(____returns, prop, {
                get: function () { return props[prop] },
                set: function () { props[prop] = arguments[0] },
                enumerable: true,
                configurable: false
            });
        }

        const ____initFunc = function () {
            return ____returns;
        }
        const ____thisObj = ____initFunc();
        const ____appearanceObject = {
            state,
            useSprite,
            useGraphic,
            useSpriteSheet,
            usePainting
        }

        return ____returns;
    }
    const __SpriteSheet = function (_name, { _width: w = 100, _height: h = 100, cut = false, _canHit = true, props = [] } = {}, ..._definitions) {
        return new Promise(async (resolve, reject) => {
            const __spriteList = [];
            let scanvas, sctx, canvas, ctx;

            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            canvas.width = w;
            canvas.height = h;

            async function cutSprite(_canvas, _width, _height, _cut, _defaultName) {
                if (!_cut) {
                    ctx.clearRect(0, 0, w, h);
                    ctx.drawImage(scanvas, 0, 0, w, h, 0, 0, w, h);

                    const src = await __turnCanvasToImage(canvas);

                    let pixelMap;
                    if (_canHit) {
                        const pixelMapData = __turnCanvasToPixelData(canvas, ctx);
                        pixelMap = {
                            data: pixelMapData,
                            _width: canvas.width,
                            _height: canvas.height
                        }
                    }

                    const ____returns = new __constructors.Sprite({
                        src,
                        pixelMap
                    });


                    const _name = __generateSymbolName("spritesheet");
                    __library.sprites[_name] = ____returns;
                    __spriteList.push(_name);
                } else {
                    for (let sW = 0; sW < _width; sW += w) {
                        ctx.clearRect(0, 0, w, h);
                        ctx.drawImage(scanvas, sW, 0, w, h, 0, 0, w, h);

                        const src = await __turnCanvasToImage(canvas);

                        let pixelMap;
                        if (_canHit) {
                            const pixelMapData = __turnCanvasToPixelData(canvas, ctx);
                            pixelMap = {
                                data: pixelMapData,
                                _width: canvas.width,
                                _height: canvas.height
                            }
                        }

                        const ____returns = new __constructors.Sprite({
                            src,
                            pixelMap
                        });


                        const _name = __generateSymbolName("spritesheet");
                        __library.sprites[_name] = ____returns;
                        __spriteList.push(_name);
                    }
                }
            }

            for (const i of Object.keys(_definitions)) {
                let _definition = _definitions[i];
                let gotSprite;

                const prop = props[i];
                const sW = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop._width) ? prop._width : w) : w;
                const sH = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop._height) ? prop._height : h) : h;
                const sCut = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop.cut) ? prop.cut : cut) : cut;
                if (helperUtils.isSpriteSheet(_definition)) {
                    try {
                        let src;
                        if (!_definition.src)
                            src = getSpriteSheetFromLibrary(_definition.idName).src;
                        else
                            src = _definition.src;

                        const props = objectUtils.multiplyObject({ _width: sW, _height: sH, cut: sCut }, src.length);

                        const tempSheet = await __SpriteSheet(_name, { _width: w, _height: h, cut, _canHit, props }, ...src);
                        __spriteList.push(...tempSheet.src);
                    } catch { }
                } else {
                    const [sX, sY] = [0, 0];
                    if (helperUtils.isScriptOrFunction(_definition)) {
                        try {
                            scanvas = document.createElement('canvas');
                            sctx = scanvas.getContext('2d');
                            scanvas.width = sW;
                            scanvas.height = sH;

                            _definition = __commandUtils.getScriptOrFunction(_definition).bind(sctx);
                            _definition(sctx, sX, sY, sW, sH);

                            gotSprite = true;
                        } catch { }
                    } else if (helperUtils.isGraphic(_definition)) {
                        try {
                            let src;
                            if (!_definition.src)
                                src = getGraphicFromLibrary(_definition.idName).src;
                            else
                                src = _definition.src;
                            scanvas = document.createElement('canvas');
                            sctx = scanvas.getContext('2d');
                            scanvas.width = sW;
                            scanvas.height = sH;

                            sctx.imageSmoothingEnabled = false;
                            sctx.drawImage(src, sX, sY, sW, sH);

                            gotSprite = true;
                        } catch { }
                    } else if (helperUtils.isString(_definition)) {
                        try {
                            let src;
                            if (!_definition.src)
                                src = getSpriteFromLibrary(_definition).src;
                            else
                                src = _definition.src;
                            scanvas = document.createElement('canvas');
                            sctx = scanvas.getContext('2d');
                            scanvas.width = sW;
                            scanvas.height = sH;

                            sctx.imageSmoothingEnabled = false;
                            sctx.drawImage(src, sX, sY, sW, sH);

                            gotSprite = true;
                        } catch { }
                    } else if (helperUtils.isSprite(_definition)) {
                        try {
                            let src;
                            if (!_definition.src)
                                src = getSpriteFromLibrary(_definition.idName).src;
                            else
                                src = _definition.src;
                            scanvas = document.createElement('canvas');
                            sctx = scanvas.getContext('2d');
                            scanvas.width = sW;
                            scanvas.height = sH;

                            sctx.imageSmoothingEnabled = false;
                            sctx.drawImage(src, sX, sY, sW, sH);

                            gotSprite = true;
                        } catch { }
                    } else if (helperUtils.isPainting(_definition)) {
                        try {
                            let src;
                            if (!_definition.src)
                                src = getPaintingFromLibrary(_definition.idName).src;
                            else
                                src = _definition.src;
                            scanvas = document.createElement('canvas');
                            sctx = scanvas.getContext('2d');
                            scanvas.width = sW;
                            scanvas.height = sH;

                            src = src.bind(sctx);
                            src(sctx, sX, sY, sW, sH);

                            gotSprite = true;
                        } catch { }
                    }
                    if (!gotSprite) {
                        console.warn(`No sprite method found for "${_name}". Using default backup.`);
                        const src = __defaults.sprite;
                        scanvas = document.createElement('canvas');
                        sctx = scanvas.getContext('2d');
                        scanvas.width = sW;
                        scanvas.height = sH;

                        sctx.imageSmoothingEnabled = false;
                        sctx.drawImage(src, sX, sY, sW, sH);
                    }

                    await cutSprite(scanvas, sW, sH, sCut);
                }
            }

            const ____returns = new __constructors.SpriteSheet({
                idName: _name,
                src: __spriteList
            });

            resolve(____returns);
        });
    }
    const __Sprite = function (_name, { _width = 100, _height = 100, _canHit = true } = {}, _definition) {
        return new Promise(async (resolve, reject) => {
            let canvas;
            let ctx;
            let gotSprite;
            const [sX, sY, sW, sH] = [0, 0, _width, _height];
            if (helperUtils.isScriptOrFunction(_definition)) {
                try {
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');
                    canvas.width = sW;
                    canvas.height = sH;

                    _definition = __commandUtils.getScriptOrFunction(_definition).bind(ctx);
                    _definition(ctx, sX, sY, sW, sH);

                    gotSprite = true;
                } catch { }
            } else if (helperUtils.isGraphic(_definition)) {
                try {
                    let src;
                    if (!_definition.src)
                        src = getGraphicFromLibrary(_definition.idName).src;
                    else
                        src = _definition.src;
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');
                    canvas.width = sW;
                    canvas.height = sH;

                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(src, sX, sY, sW, sH);

                    gotSprite = true;
                } catch { }
            } else if (helperUtils.isString(_definition)) {
                try {
                    let src;
                    if (!_definition.src)
                        src = getSpriteFromLibrary(_definition).src;
                    else
                        src = _definition.src;
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');
                    canvas.width = sW;
                    canvas.height = sH;

                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(src, sX, sY, sW, sH);

                    gotSprite = true;
                } catch { }
            } else if (helperUtils.isSprite(_definition)) {
                try {
                    let src;
                    if (!_definition.src)
                        src = getSpriteFromLibrary(_definition.idName).src;
                    else
                        src = _definition.src;
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');
                    canvas.width = sW;
                    canvas.height = sH;

                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(src, sX, sY, sW, sH);

                    gotSprite = true;
                } catch { }
            } else if (helperUtils.isPainting(_definition)) {
                try {
                    let src;
                    if (!_definition.src)
                        src = getPaintingFromLibrary(_definition.idName).src;
                    else
                        src = _definition.src;
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');
                    canvas.width = sW;
                    canvas.height = sH;

                    src = src.bind(ctx);
                    src(ctx, sX, sY, sW, sH);

                    gotSprite = true;
                } catch { }
            }
            if (!gotSprite) {
                console.warn(`No sprite method found for "${_name}". Using default backup.`);
                const src = __defaults.sprite;
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('2d');
                canvas.width = sW;
                canvas.height = sH;

                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(src, sX, sY, sW, sH);
            }

            const src = await __turnCanvasToImage(canvas);

            let pixelMap;
            if (_canHit) {
                const pixelMapData = __turnCanvasToPixelData(canvas, ctx);
                pixelMap = {
                    data: pixelMapData,
                    _width: canvas.width,
                    _height: canvas.height
                }
            }

            const ____returns = new __constructors.Sprite({
                idName: _name,
                src,
                pixelMap
            });

            resolve(____returns);
        });
    }
    const __Graphic = function (_name, { _path = __defaults.graphicPath, _type = __defaults.graphicType, _name: _mName, _src } = {}) {
        return new Promise((resolve, reject) => {
            const name = _mName || _name;
            const src = _src ? _src : `${_path}/${name}.${_type}`;

            const img = new __defaults.Image();
            img.onload = function () {
                const ____returns = new __constructors.Graphic({ src: img, idName: _name });

                resolve(____returns);
            }
            img.onerror = function () {
                console.warn(`Graphic load for "${_name}" failed. Using default backup.`);
                const ____returns = new __constructors.Graphic({ src: __defaults.unknowngraphic, idName: _name });

                resolve(____returns);
            }
            img.src = src;
        });
    }
    const __Painting = function (_name, _function) {
        const painting = _function.bind(__screen.ctx);

        const ____returns = new __constructors.Painting({ src: painting, idName: _name });

        return ____returns;
    }

    const __turnCanvasToImage = function (_canvas) {
        return new Promise((resolve, reject) => {
            const _sprite = new __defaults.Image(_canvas.width, _canvas.height);
            _sprite.onload = function () {
                resolve(_sprite);
            }
            _sprite.onerror = function () {
                console.warn("Graphic load failed. Using default backup.");
                resolve(__defaults.unknowngraphic);
            }
            _sprite.src = _canvas.toDataURL();
        });
    }

    const __turnCanvasToPixelData = function (_canvas, _ctx) {
        const pixelMapData = [];

        for (let y = 0; y < _canvas.height; y += __pixelResolution) {
            for (let x = 0; x < _canvas.width; x += __pixelResolution) {
                const dataRowColOffset = x + "_" + y;
                const pixel = _ctx.getImageData(x, y, 1, 1);
                const pixelData = pixel.data[3];

                pixelMapData[dataRowColOffset] = pixelData;
            }
        }

        return pixelMapData;
    }



    const __getFlevaClipFromLibrary = function (_name) {
        ___errorsM.checkFlevaClipNotExist(_name);
        return __library.flevaclips[_name].instance;
    }
    const __getFlevaClipByInstanceName = (_instanceName) => {
        if (heirarchy.scene !== "") {
            const flevaclip = __library.scenes[heirarchy.scene].__private__.___getFlevaClipByInstanceName(_instanceName);
            if (flevaclip) return flevaclip;
        }

        for (const _name of Object.keys(__attachedFlevaClips)) {
            if (__attachedFlevaClips[_name].instanceName === _instanceName) {
                return __attachedFlevaClips[_name].instance;
            }
        }
        return {};
    }

    const __fillState = (_newState) => {
        for (const _name of Object.keys(_newState)) {
            engineState[_name] = _newState[_name];
        }
    }
    const __clearState = () => {
        for (const _name of Object.keys(engineState)) {
            delete engineState[_name];
        }
    }




    const createFlevaClip = function (_flevaclipType, ..._args) {
        const _name = _args[0];
        ___errorsM.checkFlevaClipExist(_name);
        let props = {}, init = __private.__emptyFunc;
        if (helperUtils.isObject(_args[1]) && helperUtils.isScriptOrFunction(_args[2])) {
            props = _args[1] || {};
            init = __commandUtils.getScriptOrFunction(_args[2]);
        } else if (helperUtils.isScriptOrFunction(_args[1])) {
            init = __commandUtils.getScriptOrFunction(_args[1]);
        } else if (helperUtils.isObject(_args[1])) {
            props = _args[1] || {};
        }

        const FlevaClip = _flevaclipType === "prefab" ? __Prefab : _flevaclipType === "textfield" ? __TextField : false;
        __library.flevaclips[_name] = {
            instance: FlevaClip(props, init),
            type: _flevaclipType
        };
    }

    const __attachedFlevaClips = {};
    const __attachFlevaClip = async (_flevaclipType, _instanceName, _instName, _props, _inits) => {
        const _stackName = __generateSymbolName("stack");
        const _swapDepths = (_depth) => __mainStack.swapDepths(_stackName, _depth);
        const _funcs = { swapDepths: _swapDepths };

        const FlevaClip = _flevaclipType === "prefab" ? __Prefab : _flevaclipType === "textfield" ? __TextField : false;

        __attachedFlevaClips[_instanceName] = {
            stackName: _stackName,
            instanceName: _instName,
            instance: FlevaClip(_props, _inits, _funcs)
        }
        __mainStack.list[__mainStack.list.length] = {
            stackName: _stackName,
            depth: 1,
            instance: __attachedFlevaClips[_instanceName].instance,
            render: function () {
                this.instance.__private__.__render();
            }
        }

        __mainStack.sortList();
        await __attachedFlevaClips[_instanceName].instance.__private__.__load();
    }
    const attachFlevaClip = async (_flevaclipType, ..._args) => {
        let _instanceName, modifiedInit, modifiedProps = {}, instanceName, preserve = false, _props;
        if (_args.length > 1 && helperUtils.isString(_args[_args.length - 1])) _instanceName = _args[_args.length - 1];
        if (_instanceName) {
            ___errorsM.checkCanUseName(_instanceName, "prefab");
        } else {
            _instanceName = __generateSymbolName("prefab");
        }

        if (helperUtils.isString(_args[0])) {
            const _name = _args[0];

            if (helperUtils.isObject(_args[1]) && helperUtils.isScriptOrFunction(_args[2])) {
                modifiedProps = _args[1] || {};
                modifiedInit = __commandUtils.getScriptOrFunction(_args[2]);
            } else if (helperUtils.isScriptOrFunction(_args[1])) {
                modifiedInit = __commandUtils.getScriptOrFunction(_args[1]);
            } else if (helperUtils.isObject(_args[1])) {
                modifiedProps = _args[1] || {};
            }
            const { instanceName: __instanceName, preserve: __preserve = false, ...__props } = modifiedProps;
            [instanceName, preserve, _props] = [__instanceName, __preserve, __props];

            const originalPrefabSkeleton = __getFlevaClipFromLibrary(_name).__private__;
            const flevaclipType = originalPrefabSkeleton.___getType();

            if (_flevaclipType !== flevaclipType) throw `Expected ${_flevaclipType} flevaclip but received ${flevaclipType} instead.`;

            let _init = originalPrefabSkeleton.___getInit();
            if (modifiedInit) _init = [..._init, modifiedInit];

            const _oldProps = originalPrefabSkeleton.___getProps();

            await __attachFlevaClip(_flevaclipType, _instanceName, instanceName, { ..._oldProps, ..._props }, _init);
        } else if (helperUtils.isObject(_args[0]) && helperUtils.isScriptOrFunction(_args[1])) {
            modifiedProps = _args[0] || {};
            const _init = __commandUtils.getScriptOrFunction(_args[1]);
            const { instanceName: __instanceName, preserve: __preserve = false, ...__props } = modifiedProps;
            [instanceName, preserve, _props] = [__instanceName, __preserve, __props];

            await __attachFlevaClip(_flevaclipType, _instanceName, instanceName, _props, _init);
        } else if (helperUtils.isScriptOrFunction(_args[0])) {
            const _init = __commandUtils.getScriptOrFunction(_args[0]);
            const { instanceName: __instanceName, preserve: __preserve = false, ...__props } = modifiedProps;
            [instanceName, preserve, _props] = [__instanceName, __preserve, __props];

            await __attachFlevaClip(_flevaclipType, _instanceName, instanceName, _props, _init);
        } else if (helperUtils.isObject(_args[0])) {
            modifiedProps = _args[0] || {};
            const _init = __private.__emptyFunc;
            const { instanceName: __instanceName, preserve: __preserve = false, ...__props } = modifiedProps;
            [instanceName, preserve, _props] = [__instanceName, __preserve, __props];

            await __attachFlevaClip(_flevaclipType, _instanceName, instanceName, _props, _init);
        }
    }
    const removeFlevaClip = async function (_flevaclipType, _instanceName) {
        if (__attachedFlevaClips[_instanceName]) {
            const flevaclip = __attachedFlevaClips[_instanceName];
            const flevaclipType = flevaclip.instance.__private__.___getType();
            if (_flevaclipType !== flevaclipType) return;

            const index = __mainStack.list.findIndex(elem => elem.stackName === flevaclip.stackName);
            if (index !== -1) {
                __mainStack.list.splice(index, 1);
            }

            await flevaclip.instance.__private__.__unload();
            delete __attachedFlevaClips[_instanceName];
        }

    }

    const getCurrentScene = function () {
        return heirarchy.scene;
    }






    const getScriptFromLibrary = function (_name) {
        ___errorsM.checkScriptNotExist(_name);
        return __library.scripts[_name];
    }
    const getSpriteFromLibrary = function (_name) {
        ___errorsM.checkSpriteNotExist(_name);
        return __library.sprites[_name];
    }
    const getSpriteSheetFromLibrary = function (_name) {
        ___errorsM.checkSpriteSheetNotExist(_name);
        return __library.spritesheets[_name];
    }
    const getGraphicFromLibrary = function (_name) {
        ___errorsM.checkGraphicNotExist(_name);
        return __library.graphics[_name];
    }
    const getPaintingFromLibrary = function (_name) {
        ___errorsM.checkPaintingNotExist(_name);
        return __library.paintings[_name];
    }
    const getSoundFromLibrary = function (_name) {
        ___errorsM.checkSoundNotExist(_name);
        return __library.sounds[_name];
    }



    let ___selectedFlevaClip = undefined;
    const __hasSelectedFlevaClip = () => {
        return ___selectedFlevaClip !== undefined;
    }
    const __setSelectedFlevaClip = (_state) => {
        ___selectedFlevaClip = _state;
    }
    const __clearSelectedFlevaClip = () => {
        if (__hasSelectedFlevaClip()) __setSelectedFlevaClip(___selectedFlevaClip());
    }
    const __checkSelectedFlevaClip = () => {
        if (MouseModule.isPressed("left")) {
            const stack = [...__mainStack.list].reverse();
            __clearSelectedFlevaClip();

            for (const _key of Object.keys(stack)) {
                const instance = stack[_key].instance;
                if (instance.__private__.___setSelection)
                    if (instance.__private__._isMouseInFlevaClip(stage._xmouse, stage._ymouse)) {
                        __setSelectedFlevaClip(instance.__private__.___setSelection(stage._xmouse, stage._ymouse));
                        if (__hasSelectedFlevaClip()) break;
                    }
            }

            if (__hasSelectedFlevaClip()) {
                __clearMouseStates();
                __clearKeyStates();
            }
        }
        if (__hasSelectedFlevaClip()) {
            __clearMouseStates();
            __clearKeyStates(true);
        }
    }

    const __tick = async function () {
        if (__getMouseCursor() !== "default") __setMouseCursor("default");
        for (const _name of Object.keys(heirarchy.scripts)) {
            const _script = heirarchy.scripts[_name];
            await _script(____thisObj);
        }
        for (const _name of Object.keys(__attachedFlevaClips)) {
            await __attachedFlevaClips[_name].instance.__private__.__tick();
        }

        try {
            if (heirarchy.scene !== "")
                await __library.scenes[heirarchy.scene].__private__.__tick();
        } catch (e) { console.error("Error on engine tick:", e) }
    }

    const __render = function () {
        if (heirarchy.scene !== "")
            __library.scenes[heirarchy.scene].__private__.__render();

        for (const _name of Object.keys(__mainStack.list)) {
            const flevaclip = __mainStack.list[_name];
            flevaclip.render();
        }
    }

    const __clearScreen = function () {
        __screen.ctx.clearRect(0, 0, __screen.canvas.width, __screen.canvas.height);
        __screen.ctx.fillStyle = __defaults.stage._color;
        __screen.ctx.fillRect(0, 0, __screen.canvas.width, __screen.canvas.height);
    }
    let __runID = 0;
    let __fpsID = 0;
    let runitor = {
        fps: 0,
        spf: 0
    }

    const __run = async function () {
        __checkSelectedFlevaClip();

        await __tick();

        __clearMouseStates();
        __clearKeyStates();
        if (__privateProperties.showingPage) {
            __clearScreen();
            __render();
        }
    }
    let __isRunning = false;
    const startRunTime = function (_fps) {
        if (LoaderManager.state === "false") {
            LoaderManager.performload();
        }
        if (LoaderManager.state === "loaded") return console.error("App loaded. Press any key to continue.");
        if (LoaderManager.state !== "ready") return console.error("Can't start app. Loading not complete.");

        stopRunTime();
        __isRunning = true;

        if (heirarchy.scene !== "")
            __library.scenes[heirarchy.scene].__private__.__start();

        for (const _name of Object.keys(__attachedFlevaClips)) {
            __attachedFlevaClips[_name].instance.__private__.__start();
        }

        let lastLoop = performance.now();
        let engineFps = 0;
        let engineSpf = 0;

        __runID = createLoop(async () => {
            const spfNow = performance.now();

            await __run();

            const currentLoop = performance.now();

            engineSpf = Math.round((currentLoop - spfNow) * 10) / 10000;
            engineFps = Math.round(1000 / ((currentLoop - lastLoop) || 1));
            lastLoop = currentLoop;
        }, 1000 / _fps, { _skipOlds: true });

        __fpsID = createLoop(() => {
            runitor.fps = engineFps;
            runitor.spf = engineSpf;
        }, 1000);
    }
    const stopRunTime = function () {
        deleteLoop(__runID);
        deleteLoop(__fpsID);


        for (const _name of Object.keys(__attachedFlevaClips)) {
            __attachedFlevaClips[_name].instance.__private__.__stop();
        }


        if (heirarchy.scene !== "")
            __library.scenes[heirarchy.scene].__private__.__stop();

        __isRunning = false;
    }
    const blockRunTime = function (intv) {
        return new Promise((resolve, reject) => {
            createTimeout(() => resolve(), intv);
        });
    }

    const __cancelContextMenu = function (_event) { _event.preventDefault(); _event.stopPropagation(); }
    const __handleVisibilityChanged = function () {
        if (document.hidden) {
            __privateProperties.showingPage = false;
        } else {
            __privateProperties.showingPage = true;
        }
    }
    const __loadEngine = async function () {
        document.addEventListener("visibilitychange", __handleVisibilityChanged, false);
        __screen.div.addEventListener('contextmenu', __cancelContextMenu);
        __screen.div.addEventListener('mousemove', __setMousePosition, false);
        __screen.div.addEventListener('mousedown', __setMouseDown, true);
        __screen.div.addEventListener('mouseup', __setMouseUp, false);
        __screen.div.addEventListener('mouseleave', __setMouseLeave, false);
        __screen.div.addEventListener("keydown", __setKeyDown, true);
        __screen.div.addEventListener("keyup", __setKeyUp, false);
        __screen.div.onselectstart = function () { return false; }

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


        if (helperUtils.isScriptOrFunction(__defaults.inits)) {
            inits.push(__commandUtils.getScriptOrFunction(__defaults.inits));
        } else if (helperUtils.isArray(__defaults.inits)) {
            for (const _init of Object.keys(__defaults.inits)) {
                const init = __defaults.inits[_init];
                if (helperUtils.isScriptOrFunction(init)) inits.push(__commandUtils.getScriptOrFunction(init));
            }
        }
        if (inits.length > 0) {
            for (const init of Object.keys(inits)) {
                const _init = inits[init].bind(____thisObj);
                const fini = await _init(____thisObj);
                if (helperUtils.isScriptOrFunction(fini)) finis.push(__commandUtils.getScriptOrFunction(fini));
            }

        }
        LoaderManager.endload();
    }
    const __unloadEngine = async function () {
        stopRunTime();
        if (finis.length > 0) {
            for (const fini of Object.keys(finis)) {
                const _fini = finis[fini].bind(____thisObj);
                await _fini(____thisObj);
            }
            finis.length = 0;
        }

        __screen.div.removeEventListener('contextmenu', __cancelContextMenu);
        __screen.div.removeEventListener('mousemove', __setMousePosition);
        __screen.div.removeEventListener('mousedown', __setMouseDown);
        __screen.div.removeEventListener('mouseup', __setMouseUp);
        __screen.div.removeEventListener('mouseleave', __setMouseLeave);
        __screen.div.removeEventListener("keydown", __setKeyDown);
        __screen.div.removeEventListener("keyup", __setKeyUp);
        __screen.div.onselectstart = null;
    }


    const MetaModule = {
        clipboard: "",
        get version() { return __defaults.engine.version; },
        get loops() { return __loopManager.loops; },
        get FLEVAR_ENV() { return __defaults.flevar_env; },
        get takeScreenShot() { return __takeScreenShot; }
    }
    const MouseModule = (function MouseModule() {
        const LEFT = 0;
        const MIDDLE = 1;
        const RIGHT = 2;
        const isDown = function (_key) {
            if (typeof _key === "string") _key = _key.toLowerCase();

            if (_key === "left" || _key === LEFT) return __mouseList._left || false;
            if (_key === "middle" || _key === MIDDLE) return __mouseList._middle || false;
            if (_key === "right" || _key === RIGHT) return __mouseList._right || false;
            return false;
        }
        const isUp = function (_key) {
            return !isDown(_key);
        }
        const isPressed = function (_key) {
            if (typeof _key === "string") _key = _key.toLowerCase();

            if (_key === "left" || _key === LEFT) return __mousePressed._left || false;
            if (_key === "middle" || _key === MIDDLE) return __mousePressed._middle || false;
            if (_key === "right" || _key === RIGHT) return __mousePressed._right || false;
            return false;
        }
        const isReleased = function (_key) {
            if (typeof _key === "string") _key = _key.toLowerCase();

            if (_key === "left" || _key === LEFT) return __mouseReleased._left || false;
            if (_key === "middle" || _key === MIDDLE) return __mouseReleased._middle || false;
            if (_key === "right" || _key === RIGHT) return __mouseReleased._right || false;
            return false;
        }
        const show = function () {
            __setMouseCursor("default");
            if (__mouseList.isHidden) __mouseList.isHidden = false;
        }
        const hide = function () {
            __setMouseCursor("none");
            if (!__mouseList.isHidden) __mouseList.isHidden = true;
        }

        const ____returns = new __constructors.Mouse({
            isDown, isUp,
            isPressed, isReleased,
            show, hide,
            LEFT, MIDDLE, RIGHT
        });


        Object.defineProperties(____returns, {
            hidden: {
                get: function () { return __mouseList.isHidden },
                enumerable: false,
                configurable: false
            },
            _x: {
                get: function () { return __mouse._x },
                enumerable: false,
                configurable: false
            },
            _y: {
                get: function () { return __mouse._y },
                enumerable: false,
                configurable: false
            }
        });

        return ____returns;
    })();
    const KeyModule = (function KeyModule() {
        const LEFT = 37;
        const RIGHT = 39;
        const UP = 38;
        const DOWN = 40;
        const SPACE = 32;
        const BACKSPACE = 8;
        const TAB = 9;
        const ENTER = 13;
        const SHIFT = 16;
        const CONTROL = 17;
        const CTRL = 17;
        const ALTERNATE = 18;
        const ALT = 18;
        const ALPHABET = {
            A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90
        }
        const MAP = {
            'space': ' ',
            'left': 'arrowleft',
            'up': 'arrowup',
            'right': 'arrowright',
            'down': 'arrowdown',
            'ctrl': 'control',
            'alternate': 'alt'
        }
        const isDown = function (_key) {
            if (typeof _key === "string") {
                _key = _key.toLowerCase();
                if (MAP[_key]) _key = MAP[_key];
            }

            const keyDown = __keysList['code_' + _key] || __keysList['name_' + _key] || false;
            return keyDown;
        }
        const isUp = function (_key) {
            return !isDown(_key);
        }
        const isPressed = function (_key) {
            if (typeof _key === "string") {
                _key = _key.toLowerCase();
                if (MAP[_key]) _key = MAP[_key];
            }

            const keysPressed = __keysPressed['code_' + _key] || __keysPressed['name_' + _key] || false;
            return keysPressed;
        }
        const isReleased = function (_key) {
            if (typeof _key === "string") {
                _key = _key.toLowerCase();
                if (MAP[_key]) _key = MAP[_key];
            }

            const keyReleased = __keysReleased['code_' + _key] || __keysReleased['name_' + _key] || false;
            return keyReleased;
        }
        const ____returns = new __constructors.Key({
            isDown, isUp,
            isPressed, isReleased,
            LEFT, RIGHT, UP, DOWN,
            SPACE, BACKSPACE, ENTER,
            TAB, SHIFT, CONTROL, CTRL, ALTERNATE, ALT,
            ...ALPHABET
        });

        return ____returns;
    })();
    const SoundModule = (function SoundModule() {
        let sounds = __library.sounds;
        let masterVolume = 1;
        const __Sound = function (_name, { _path = __defaults.soundPath, _type = __defaults.soundType, _name: _mName, _src } = {}, { clone = false, unknown = false } = {}) {
            return new Promise((resolve, reject) => {
                const name = _mName || _name;
                const src = _src ? _src : `${_path}/${name}.${_type}`;

                const sound = new __defaults.Audio(src);

                sound.onended = () => __onStop(_name);
                sound.onloadeddata = function () {
                    const ____returns = new __constructors.Sound({ idName: _name, src: sound, clone, unknown });

                    ____returns.volume = 1;
                    resolve(____returns);
                }

                sound.onerror = async function () {
                    const failedMsg = `Sound load for "${_name}" failed.`;

                    const unknownSoundSource = __defaults.useUnknownSound();
                    if (!unknownSoundSource) return console.warn(`${failedMsg} Default backup not supported in this browser. Sound not created.`), resolve();

                    console.warn(`${failedMsg} Using default backup.`);
                    const ____returns = await __Sound(_name, { _src: unknownSoundSource }, { clone, unknown: true });

                    resolve(____returns);
                }
            });
        }

        const __checkSoundName = function (_value) {
            if (helperUtils.isSound(_value)) {
                return _value.idName;
            }
            return _value;
        }

        const __emitError = function (error) {
            if (helperUtils.isScriptOrFunction(____returns.onerror)) {
                __commandUtils.getScriptOrFunction(____returns.onerror)(error);
            } else {
                throw error;
            }
        }

        const __onStop = function (_name) {
            if (sounds[_name].unknown) {
                console.warn("Default sound file ended.");
            }
            if (sounds[_name].clone) {
                remove(_name);
            }
        }

        const create = async function (_name, _props) {
            try {
                ___errorsM.checkSoundExist(_name);
                sounds[_name] = await __Sound(_name, _props);
            } catch (e) {
                return __emitError(`Cannot create "${_name}": ${e.msg || e}`);
            }
        }
        const remove = function (_value) {
            try {
                if (helperUtils.isSound(_value)) {
                    delete sounds[_value.idName];
                    try {
                        _value.constructor = Object;
                    } catch (e) { throw (e); };
                } else {
                    ___errorsM.checkSoundNotExist(_value);
                    delete sounds[_value];
                }
            } catch (e) {
                return __emitError(`Cannot remove sound: ${e.msg || e}`);
            }
        }

        const play = async function (_name) {
            try {
                _name = __checkSoundName(_name);
                if (!sounds[_name]) {
                    throw ({ msg: "Sound file does not exist." });
                }

                await sounds[_name].src.play();
            } catch (e) {
                return __emitError(`Cannot play "${_name}": ${e.msg || e}`);
            }
        }


        const pause = function (_name) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot pause "${_name}": Sound file does not exist.`);
            }

            sounds[_name].src.pause();
        }


        const stop = function (_name) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot stop "${_name}": Sound file does not exist.`);
            }

            if (!getPaused(_name))
                sounds[_name].src.pause();

            sounds[_name].src.currentTime = 0;
            sounds[_name].src.loop = false;
            if (!getPaused(_name))
                __onStop(_name);
        }


        const restart = async function (_name) {
            try {
                _name = __checkSoundName(_name);
                if (!sounds[_name]) {
                    throw ({ msg: "Sound file does not exist." });
                }

                sounds[_name].src.pause();
                sounds[_name].src.currentTime = 0;
                await sounds[_name].src.play();
            } catch (e) {
                return __emitError(`Cannot restart "${_name}": ${e.msg || e}`);
            }
        }


        const skipForward = function (_name, time) {
            try {
                _name = __checkSoundName(_name);
                if (!sounds[_name]) {
                    throw ({ msg: "Sound file does not exist." });
                }

                const { currentTime, duration } = sounds[_name].src;
                time = (currentTime + time) > duration ? duration - currentTime : time;
                sounds[_name].src.currentTime += time;
            } catch (e) {
                return __emitError(`Cannot skip "${_name}" forward: ${e.msg || e}`);
            }
        }


        const skipBackward = function (_name, time) {
            try {
                _name = __checkSoundName(_name);
                if (!sounds[_name]) {
                    throw ({ msg: "Sound file does not exist." });;
                }

                const { currentTime, duration } = sounds[_name].src;
                time = (currentTime - time) < 0 ? currentTime : time;
                sounds[_name].src.currentTime -= time;
            } catch (e) {
                return __emitError(`Cannot skip "${_name}" backward: ${e.msg || e}`);
            }
        }


        const playLoop = async function (_name) {
            try {
                _name = __checkSoundName(_name);
                if (!sounds[_name]) {
                    throw ({ msg: "Sound file does not exist." });
                }

                await sounds[_name].src.play();
                sounds[_name].src.loop = true;
            } catch (e) {
                return __emitError(`Cannot play "${_name}": ${e.msg || e}`);
            }
        }


        const playOnce = async function (_name) {
            try {
                _name = __checkSoundName(_name);
                if (!sounds[_name]) {
                    throw ({ msg: "Sound file does not exist." });
                }

                sounds[_name].src.pause();
                sounds[_name].src.currentTime = 0;
                await sounds[_name].src.play();
                sounds[_name].src.loop = false;
            } catch (e) {
                return __emitError(`Cannot play "${_name}": ${e.msg || e}`);
            }
        }


        const playClone = async function (_name) {
            try {
                _name = __checkSoundName(_name);
                if (!sounds[_name]) {
                    throw ({ msg: "Sound file does not exist." });
                }

                const newName = __generateSymbolName("sound");
                sounds[newName] = await __Sound(newName, { _src: sounds[_name].src.src }, { clone: true, unknown: sounds[_name].unknown });

                await sounds[newName].src.play();

                return getSoundAcknowledgement(newName);
            } catch (e) {
                return __emitError(`Cannot playyyy "${_name}": ${e.msg || e}`);
            }
        }


        const duplicate = async function (_oldName, _newName) {
            try {
                _oldName = __checkSoundName(_oldName);
                if (!sounds[_oldName]) {
                    throw ({ msg: "Sound file does not exist." });
                }

                let newName;
                if (_newName) {
                    newName = _newName;
                    ___errorsM.checkSoundExist(newName);
                } else newName = __generateSymbolName("sound");

                sounds[newName] = await __Sound(newName, { _src: sounds[_oldName].src.src }, { unknown: sounds[_oldName].unknown });

                return getSoundAcknowledgement(newName);
            } catch (e) {
                return __emitError(`Cannot duplicate "${_oldName}": ${e.msg || e}`);
            }
        }


        const mute = function (_name) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot mute "${_name}": Sound file does not exist.`);
            }

            sounds[_name].src.muted = true;
        }


        const unmute = function (_name) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot unmute "${_name}": Sound file does not exist.`);
            }

            sounds[_name].src.muted = false;
        }


        const togglemute = function (_name) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot toggle mute "${_name}": Sound file does not exist.`);
            }

            sounds[_name].src.muted = !sounds[_name].src.muted;
        }

        const getVolume = function (_name) {
            if (!_name) {
                return masterVolume;
            } else {
                _name = __checkSoundName(_name);
                if (!sounds[_name]) {
                    return __emitError(`Cannot set volume of "${_name}": Sound file does not exist.`);
                }
                return sounds[_name].src.volume;
            }
        }


        const setVolume = function (_name, _volume) {
            let tempVolume;
            if (typeof _name !== "string") {
                tempVolume = numberUtils.validateNum(_name);
                masterVolume = tempVolume;

                for (const soundNames of Object.keys(sounds))
                    sounds[soundNames].src.volume = sounds[soundNames].volume * masterVolume;
            } else {
                _name = __checkSoundName(_name);
                if (!sounds[_name]) {
                    return __emitError(`Cannot set volume of "${_name}": Sound file does not exist.`);
                }
                tempVolume = numberUtils.validateNum(_volume);
                sounds[_name].volume = tempVolume;

                sounds[_name].src.volume = sounds[_name].volume * masterVolume;
            }
        }

        const getLoop = function (_name) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot get loop for "${_name}": Sound file does not exist.`);
            }

            return sounds[_name].src.loop;
        }
        const setLoop = function (_name, value) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot set loop for "${_name}": Sound file does not exist.`);
            }

            return sounds[_name].src.loop = value;
        }

        const getTime = function (_name) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot get time for "${_name}": Sound file does not exist.`);
            }

            return sounds[_name].src.currentTime;
        }
        const setTime = function (_name, value) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot set time for "${_name}": Sound file does not exist.`);
            }

            return sounds[_name].src.currentTime = value;
        }

        const getPaused = function (_name) {
            _name = __checkSoundName(_name);
            if (!sounds[_name]) {
                return __emitError(`Cannot get paused for "${_name}": Sound file does not exist.`);
            }

            return sounds[_name].src.paused;
        }

        const ____returns = new __constructors.Sound({
            create,
            remove,
            play,
            pause,
            stop,
            restart,
            skipForward,
            skipBackward,
            playLoop,
            playOnce,
            playClone,
            duplicate,
            mute,
            unmute,
            togglemute,
            getVolume,
            setVolume,
            getLoop,
            setLoop,
            getTime,
            setTime,
            getPaused
        });

        return ____returns;
    })();
    const SharedObjectModule = (function SharedObjectModule() {
        const LS = "localstorage";
        const IDB = "indexeddb";
        const drivers = {};
        const driver = (!window.indexedDB || __defaults.autosave) ? LS : IDB;

        const signData = (data) => __commandUtils.flatted.stringify(data);
        const unsignData = (data) => __commandUtils.flatted.parse(data);

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

                    const ____returns = new __constructors.SharedObject();
                    Object.defineProperties(____returns, {
                        data: {
                            get: function () { return data },
                            enumerable: true,
                            configurable: false
                        },
                        flush: {
                            get: function () { return flush },
                            enumerable: false,
                            configurable: false
                        },
                        clear: {
                            get: function () { return clear },
                            enumerable: false,
                            configurable: false
                        },
                        getSize: {
                            get: function () { return getSize },
                            enumerable: false,
                            configurable: false
                        }
                    });

                    resolve(____returns);
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
                _closeDB: function () {
                    if (!idbStorage.DATABASE) return;
                    idbStorage.DATABASE.close();
                    idbStorage.DATABASE = undefined;
                },
                _handleItemQuery: function (ranID, response, ...params) {
                    removeFromQueue(ranID);
                    idbStorage._closeDB();
                    response(...params);
                },
                _createTransaction: function (mode) {
                    return new Promise(async (resolve, reject) => {
                        await idbStorage._openDB();
                        resolve(idbStorage.DATABASE.transaction(idbStorage.DB_STORE_NAME, mode));
                    });
                },
                getItem: function (key) {
                    return new Promise(async (resolve, reject) => {
                        const ranID = __generateSymbolName("idbqueue");
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
                setItem: function (key, value) {
                    return new Promise(async (resolve, reject) => {
                        const ranID = __generateSymbolName("idbqueue");
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
                removeItem: function (key) {
                    return new Promise(async (resolve, reject) => {
                        const ranID = __generateSymbolName("idbqueue");
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

                    const ____returns = new __constructors.SharedObject();
                    Object.defineProperties(____returns, {
                        data: {
                            get: function () { return data },
                            enumerable: true,
                            configurable: false
                        },
                        flush: {
                            get: function () { return flush },
                            enumerable: false,
                            configurable: false
                        },
                        clear: {
                            get: function () { return clear },
                            enumerable: false,
                            configurable: false
                        },
                        getSize: {
                            get: function () { return getSize },
                            enumerable: false,
                            configurable: false
                        }
                    });

                    resolve(____returns);
                });
            }
            return {
                getLocal
            }
        })();

        const ____returns = new __constructors.SharedObject({
            ...drivers[driver],
            flush: flushObjects,
            driver
        });

        return ____returns;
    })();

    const stage = {
        get _width() {
            return __defaults.stage._width;
        },
        get _height() {
            return __defaults.stage._height;
        },
        get _scene() {
            return getCurrentScene();
        },
        get _xmouse() {
            return __mouse._x;
        },
        get _ymouse() {
            return __mouse._y;
        },
        get _color() {
            return __defaults.stage._color;
        },
        set _color(_color) {
            return __defaults.stage._color = _color;
        }
    }

    const _root = new Proxy(this, {
        get: function (object, property) {
            return __getFlevaClipByInstanceName(property);
        }
    });

    const changeState = (_name, _value) => {
        const _newState = {};
        _newState[_name] = _value;

        __fillState(_newState);
        __callAppearanceFunction();
    }
    const useState = (_objOrFunc) => {
        if (helperUtils.isObject(_objOrFunc)) {
            const _newState = _objOrFunc;

            __clearState();
            __fillState(_newState);
            __callAppearanceFunction();
        } else if (helperUtils.isScriptOrFunction(_objOrFunc)) {
            const prevState = objectUtils.deepCloneObject(engineState);
            const _newState = __commandUtils.getScriptOrFunction(_objOrFunc)(prevState);

            __clearState();
            __fillState(_newState);
            __callAppearanceFunction();
        }
    }
    const setState = (_objOrFunc) => {
        if (helperUtils.isObject(_objOrFunc)) {
            const _newState = _objOrFunc;

            __fillState(_newState);
            __callAppearanceFunction();
        } else if (helperUtils.isScriptOrFunction(_objOrFunc)) {
            const prevState = objectUtils.deepCloneObject(engineState);
            const _newState = __commandUtils.getScriptOrFunction(_objOrFunc)(prevState);

            __fillState(_newState);
            __callAppearanceFunction();
        }
    }

    const addScript = function (_script) {
        if (helperUtils.isString(_script)) {
            const _newScript = getScriptFromLibrary(_script);
            heirarchy.scripts.push(__Script(_newScript).bind(____thisObj));
        } else if (helperUtils.isScriptOrFunction(_script)) {
            const _newScript = __commandUtils.getScriptOrFunction(_script);
            heirarchy.scripts.push(__Script(_newScript).bind(____thisObj));
        }
    }

    const useScene = async function (_name) {
        ___errorsM.checkSceneNotExist(_name);
        if (heirarchy.scene === _name) return;
        if (heirarchy.scene !== "") {
            await __library.scenes[heirarchy.scene].__private__.__unload();
            __clearSelectedFlevaClip();
        }
        heirarchy.scene = _name;
        await __library.scenes[heirarchy.scene].__private__.__load();
    }
    const resetScene = async function () {
        if (heirarchy.scene === "") return;
        await __library.scenes[heirarchy.scene].__private__.__unload();
        __clearSelectedFlevaClip();
        await __library.scenes[heirarchy.scene].__private__.__load();
    }

    const attachPrefab = async (..._args) => {
        await attachFlevaClip("prefab", ..._args);
    }
    const attachTextField = async (..._args) => {
        await attachFlevaClip("textfield", ..._args);
    }

    const removePrefab = function (_instanceName) {
        removeFlevaClip("prefab", _instanceName);
    }
    const removeTextField = function (_instanceName) {
        removeFlevaClip("textfield", _instanceName);
    }

    const createPrefab = function (_name, _props, _init) {
        createFlevaClip("prefab", _name, _props, _init)
    }
    const createTextField = function (_name, _props, _init) {
        createFlevaClip("textfield", _name, _props, _init)
    }
    const createScene = function (_name, _init) {
        ___errorsM.checkSceneExist(_name);
        __library.scenes[_name] = __Scene(_init);
    }

    const createScript = function (_name, _func) {
        ___errorsM.checkScriptExist(_name);
        __library.scripts[_name] = __Script(_func);
    }
    const createSprite = async function (_name, _props, _func) {
        ___errorsM.checkSpriteExist(_name);
        __library.sprites[_name] = await __Sprite(_name, _props, _func);
    }
    const createSpriteSheet = async function (_name, _props, ..._func) {
        ___errorsM.checkSpriteSheetExist(_name);
        __library.spritesheets[_name] = await __SpriteSheet(_name, _props, ..._func);
    }
    const createGraphic = async function (_name, _props) {
        ___errorsM.checkGraphicExist(_name);
        __library.graphics[_name] = await __Graphic(_name, _props);
    }
    const createPainting = function (_name, _func) {
        ___errorsM.checkPaintingExist(_name);
        __library.paintings[_name] = __Painting(_name, _func);
    }
    const createSound = async function (_name, _props) {
        await SoundModule.create(_name, _props);
    }

    const getScriptAcknowledgement = function (_name) {
        const acknowledgemant = new __constructors.Script();
        acknowledgemant.idName = _name;
        objectUtils.lockObject(acknowledgemant);
        return acknowledgemant;
    }
    const getSpriteAcknowledgement = function (_name) {
        const acknowledgemant = new __constructors.Sprite({ idName: _name });
        return acknowledgemant;
    }
    const getSpriteSheetAcknowledgement = function (_name) {
        const acknowledgemant = new __constructors.SpriteSheet({ idName: _name });
        return acknowledgemant;
    }
    const getGraphicAcknowledgement = function (_name) {
        const acknowledgemant = new __constructors.Graphic({ idName: _name });
        return acknowledgemant;
    }
    const getPaintingAcknowledgement = function (_name) {
        const acknowledgemant = new __constructors.Painting({ idName: _name });
        return acknowledgemant;
    }
    const getSoundAcknowledgement = function (_name) {
        const acknowledgemant = new __constructors.Sound({ idName: _name });
        return acknowledgemant;
    }

    const createLoop = function (_func, _TPS, _options) {
        return __loopManager.addLoop(_func, _TPS, _options);
    }
    const pauseLoop = function (_id) {
        __loopManager.pauseLoop(_id);
    }
    const playLoop = function (_id, _startNow) {
        __loopManager.playLoop(_id, _startNow);
    }
    const deleteLoop = function (_id) {
        __loopManager.removeLoop(_id);
    }
    const createTimeout = function (_func, _TPS) {
        return __loopManager.addTimeout(_func, _TPS);
    }
    const deleteTimeout = function (_id) {
        __loopManager.removeTimeout(_id);
    }

    const LoaderManager = (() => {
        let __loadToQueue = null;
        let onLoad = null;
        let __loaderState = "false";
        const __loaderQueue = [];
        const __loaderObj = {
            createSprite: function () {
                __loaderQueue.push({
                    type: "async",
                    args: [...arguments],
                    method: ____engine.createSprite
                });
            },
            createSpriteSheet: function () {
                __loaderQueue.push({
                    type: "async",
                    args: [...arguments],
                    method: ____engine.createSpriteSheet
                });
            },
            createGraphic: function () {
                __loaderQueue.push({
                    type: "async",
                    args: [...arguments],
                    method: ____engine.createGraphic
                });
            },
            createSound: function () {
                __loaderQueue.push({
                    type: "async",
                    args: [...arguments],
                    method: ____engine.createSound
                });
            },
            createPrefab: function () {
                __loaderQueue.push({
                    type: "sync",
                    args: [...arguments],
                    method: ____engine.createPrefab
                });
            },
            createTextField: function () {
                __loaderQueue.push({
                    type: "sync",
                    args: [...arguments],
                    method: ____engine.createTextField
                });
            },
            createScript: function () {
                __loaderQueue.push({
                    type: "sync",
                    args: [...arguments],
                    method: ____engine.createScript
                });
            },
            createScene: function () {
                __loaderQueue.push({
                    type: "sync",
                    args: [...arguments],
                    method: ____engine.createScene
                });
            },
            createPainting: function () {
                __loaderQueue.push({
                    type: "sync",
                    args: [...arguments],
                    method: ____engine.createPainting
                });
            }
        }
        const __loadPercentInc = (_counter, _count) => {
            const percent = Math.floor(_counter / _count * 100) / 100;
            __simulateLoad.drawLoadBar(__screen.ctx, percent);
        }
        const __loadFromQueue = async () => {
            const loadCount = __loaderQueue.filter(({ type }) => type === "async").length;
            let loadCounter = 0;
            __loadPercentInc(loadCounter, loadCount);
            for (const _id of Object.keys(__loaderQueue)) {
                const { method, args, type } = __loaderQueue[_id];
                try {
                    if (type === "async")
                        await method(...args);
                    else
                        method(...args);
                } catch (e) {
                    console.error(e);
                }
                if (type === "async") loadCounter++;
                __loadPercentInc(loadCounter, loadCount);
            }
        }
        const __simulateLoad = () => {
            return new Promise(async (resolve, reject) => {
                try {
                    await __simulateLoad.drawLoadStart(__screen.ctx);
                    onLoad = await __loadToQueue(__loaderObj);
                    await __loadFromQueue();
                    await __simulateLoad.drawLoadEnd(__screen.ctx);
                    __loaderQueue.length = 0;
                } catch (e) {
                    console.warn(e);
                    return resolve();
                }

                const finishLoad = () => {
                    __screen.div.removeEventListener('mousedown', finishLoad, true);
                    __screen.div.removeEventListener("keydown", finishLoad, true);
                    resolve();
                }
                __screen.div.addEventListener('mousedown', finishLoad, true);
                __screen.div.addEventListener("keydown", finishLoad, true);

                __loaderState = "loaded";
            });
        }
        __simulateLoad.svgs = {
            logoold: `<svg width="331" height="331" viewBox="0 0 331 331" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.0936127" y="63.259" width="275" height="275" rx="27" transform="rotate(-13.279 0.0936127 63.259)" fill="#E44D26"/>
    <path d="M90.6 255V93H153.2V109.2H113.2V163.2H144.2V179.2H113.2V255H90.6ZM168.725 255V93H208.925C218.658 93 226.392 94.8 232.125 98.4C237.992 101.867 242.258 106.933 244.925 113.6C247.592 120.267 248.925 128.333 248.925 137.8C248.925 146.333 247.392 153.733 244.325 160C241.392 166.267 236.992 171.133 231.125 174.6C225.258 177.933 217.925 179.6 209.125 179.6H191.325V255H168.725ZM191.325 163.4H201.725C208.258 163.4 213.392 162.667 217.125 161.2C220.858 159.733 223.525 157.2 225.125 153.6C226.725 149.867 227.525 144.667 227.525 138C227.525 130.267 226.925 124.333 225.725 120.2C224.658 116.067 222.325 113.2 218.725 111.6C215.125 110 209.525 109.2 201.925 109.2H191.325V163.4Z" fill="#FBC5B7"/>
    </svg>`,
            logo: `<svg xmlns="http://www.w3.org/2000/svg" width="309" height="309" viewBox="0 0 309 309" fill="none">
            <path d="M76.3824 5.61113C65.7358 2.66881 54.7198 8.91437 51.7775 19.561L50.6676 23.5769L165.207 30.1588L76.3824 5.61113Z" fill="#AB3A1C"/>
            <path d="M6.04183 232.477C3.09951 243.123 9.34507 254.139 19.9917 257.081L24.0076 258.191L30.5808 143.684L6.04183 232.477Z" fill="#AB3A1C"/>
            <path d="M257.512 288.867C254.57 299.514 243.554 305.759 232.907 302.817L144.083 278.269L258.622 284.851L257.512 288.867Z" fill="#AB3A1C"/>
            <path d="M303.248 75.9517C306.19 65.3051 299.945 54.2891 289.298 51.3468L285.282 50.2369L278.7 164.776L303.248 75.9517Z" fill="#AB3A1C"/>
            <rect x="17.4487" y="41.565" width="251.048" height="251.048" rx="20" transform="rotate(-5.61125 17.4487 41.565)" fill="#F2F2F2"/>
            <rect x="3.6449" y="60.878" width="251.048" height="251.048" rx="20" transform="rotate(-13.279 3.6449 60.878)" fill="#E44D26"/>
            <path d="M117.59 213.06L101.127 216.856L82.4083 135.657C81.9099 133.495 81.8422 131.256 82.2091 129.068C82.576 126.879 83.3702 124.785 84.5466 122.904C85.7229 121.023 87.2582 119.392 89.0648 118.104C90.8715 116.816 92.9141 115.897 95.0761 115.398L192.738 92.8839C194.9 92.3855 197.139 92.3178 199.327 92.6847C201.515 93.0516 203.61 93.8459 205.491 95.0222C207.372 96.1985 209.003 97.7338 210.291 99.5404C211.579 101.347 212.498 103.39 212.996 105.552L216.792 122.015C217.29 124.177 217.358 126.416 216.991 128.604C216.624 130.792 215.83 132.886 214.653 134.767C213.477 136.649 211.942 138.28 210.135 139.567L240.791 184.659L223.132 188.729L193.28 144.773L171.198 149.864L182.326 198.137L165.863 201.932L154.735 153.659L150.94 137.196L192.097 127.708C193.178 127.458 194.199 126.999 195.103 126.355C196.006 125.711 196.774 124.895 197.362 123.955C197.95 123.014 198.347 121.967 198.531 120.873C198.714 119.779 198.68 118.659 198.431 117.578C198.182 116.497 197.722 115.476 197.078 114.573C196.434 113.67 195.619 112.902 194.678 112.314C193.738 111.726 192.69 111.328 191.596 111.145C190.503 110.962 189.385 110.995 188.304 111.244L188.302 111.245L98.8713 131.861L102.667 148.324L135.593 140.734L139.388 157.197L106.462 164.787L117.59 213.06Z" fill="#F2F2F2"/>
            </svg>`,
            loaded: `<svg width="322" height="34" viewBox="0 0 322 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.706975 8.02631H5.17137V9.47068C6.37501 8.31081 7.66618 7.73088 9.04489 7.73088C10.5768 7.73088 11.6601 8.36552 12.2947 9.63481C12.9294 10.9041 13.2467 12.3813 13.2467 14.0664V20.5004C13.2467 22.5356 12.8856 24.1769 12.1634 25.4243C11.4631 26.6717 10.347 27.2954 8.81511 27.2954C7.58959 27.2954 6.37501 26.7264 5.17137 25.5885V33.237H0.706975V8.02631ZM7.14096 24.1769C7.7756 24.1769 8.20235 23.8705 8.42119 23.2578C8.66192 22.645 8.78228 21.7806 8.78228 20.6645V13.8366C8.78228 12.8518 8.66192 12.0859 8.42119 11.5387C8.18046 10.9916 7.74278 10.7181 7.10813 10.7181C6.4516 10.7181 5.80602 10.9916 5.17137 11.5387V23.5204C5.78413 23.9581 6.44066 24.1769 7.14096 24.1769ZM16.4173 8.02631H20.8816V10.9479C21.5163 9.83177 22.1619 9.03299 22.8184 8.55154C23.4749 8.0482 24.2081 7.79653 25.0178 7.79653C25.3023 7.79653 25.5321 7.81841 25.7071 7.86218V12.4907C25.0068 12.2281 24.3941 12.0968 23.8689 12.0968C22.6871 12.0968 21.6914 12.7096 20.8816 13.9351V27H16.4173V8.02631ZM33.636 27.2954C31.5351 27.2954 29.9923 26.7155 29.0075 25.5556C28.0227 24.3739 27.5303 22.6341 27.5303 20.3362V14.6901C27.5303 12.3703 28.0227 10.6305 29.0075 9.47068C30.0142 8.31081 31.557 7.73088 33.636 7.73088C35.7807 7.73088 37.2907 8.33269 38.1661 9.53633C39.0633 10.74 39.5119 12.5564 39.5119 14.9855V17.7101H31.9619V21.4523C31.9619 22.3715 32.0932 23.0389 32.3558 23.4547C32.6403 23.8705 33.078 24.0784 33.6688 24.0784C34.2378 24.0784 34.6427 23.8815 34.8834 23.4876C35.146 23.0718 35.2773 22.4481 35.2773 21.6165V20.008H39.4791V21.321C39.4791 23.2687 38.9867 24.7569 38.0019 25.7854C37.0171 26.7921 35.5618 27.2954 33.636 27.2954ZM35.2773 15.5107V13.7053C35.2773 12.7205 35.157 12.0202 34.9162 11.6044C34.6755 11.1667 34.2488 10.9479 33.636 10.9479C33.0014 10.9479 32.5637 11.1777 32.3229 11.6372C32.0822 12.0968 31.9619 12.9503 31.9619 14.1977V15.5107H35.2773ZM47.6952 27.2954C46.0977 27.2954 44.7846 26.8687 43.756 26.0152C42.7275 25.1617 41.9944 23.9143 41.5567 22.273L44.8721 20.9928C45.3755 23.1155 46.2946 24.1769 47.6296 24.1769C48.1329 24.1769 48.5159 24.0456 48.7785 23.783C49.063 23.5204 49.2052 23.1593 49.2052 22.6997C49.2052 22.1964 49.052 21.7368 48.7457 21.321C48.4393 20.8833 47.8922 20.3362 47.1043 19.6797L44.8393 17.7101C43.8764 16.9223 43.1652 16.1563 42.7056 15.4123C42.246 14.6682 42.0162 13.76 42.0162 12.6877C42.0162 11.1995 42.5196 10.0068 43.5263 9.10959C44.5548 8.19045 45.846 7.73088 47.3998 7.73088C48.8879 7.73088 50.1025 8.1795 51.0435 9.07676C51.9845 9.95213 52.5973 11.1448 52.8818 12.6548L49.9602 13.9022C49.7852 13.0269 49.4897 12.3156 49.0739 11.7685C48.68 11.1995 48.1657 10.915 47.5311 10.915C47.0715 10.915 46.6995 11.0573 46.415 11.3418C46.1524 11.6263 46.0211 11.9874 46.0211 12.4251C46.0211 12.7752 46.1743 13.1472 46.4806 13.5412C46.787 13.9351 47.2466 14.3946 47.8593 14.9199L50.1572 17.0208C51.142 17.8742 51.897 18.6949 52.4222 19.4827C52.9693 20.2487 53.2429 21.1788 53.2429 22.273C53.2429 23.8705 52.7177 25.107 51.6672 25.9824C50.6387 26.8578 49.3147 27.2954 47.6952 27.2954ZM60.8386 27.2954C59.2411 27.2954 57.928 26.8687 56.8994 26.0152C55.8709 25.1617 55.1378 23.9143 54.7001 22.273L58.0155 20.9928C58.5189 23.1155 59.438 24.1769 60.773 24.1769C61.2763 24.1769 61.6593 24.0456 61.9219 23.783C62.2064 23.5204 62.3486 23.1593 62.3486 22.6997C62.3486 22.1964 62.1954 21.7368 61.8891 21.321C61.5827 20.8833 61.0356 20.3362 60.2477 19.6797L57.9827 17.7101C57.0198 16.9223 56.3086 16.1563 55.849 15.4123C55.3894 14.6682 55.1596 13.76 55.1596 12.6877C55.1596 11.1995 55.663 10.0068 56.6697 9.10959C57.6982 8.19045 58.9894 7.73088 60.5432 7.73088C62.0313 7.73088 63.2459 8.1795 64.1869 9.07676C65.1279 9.95213 65.7407 11.1448 66.0252 12.6548L63.1036 13.9022C62.9286 13.0269 62.6331 12.3156 62.2173 11.7685C61.8234 11.1995 61.3091 10.915 60.6745 10.915C60.2149 10.915 59.8429 11.0573 59.5584 11.3418C59.2958 11.6263 59.1645 11.9874 59.1645 12.4251C59.1645 12.7752 59.3177 13.1472 59.624 13.5412C59.9304 13.9351 60.39 14.3946 61.0027 14.9199L63.3006 17.0208C64.2854 17.8742 65.0404 18.6949 65.5656 19.4827C66.1127 20.2487 66.3863 21.1788 66.3863 22.273C66.3863 23.8705 65.8611 25.107 64.8106 25.9824C63.7821 26.8578 62.4581 27.2954 60.8386 27.2954ZM80.487 27.2954C79.6773 27.2954 78.9551 27.0766 78.3205 26.6389C77.7077 26.2012 77.2263 25.6432 76.8761 24.9648C76.5479 24.2645 76.3837 23.5423 76.3837 22.7982C76.3837 21.332 76.7229 20.1283 77.4014 19.1873C78.1016 18.2244 78.9551 17.4803 79.9618 16.9551C80.9904 16.4299 82.3472 15.8499 84.0323 15.2153V13.574C84.0323 12.6986 83.9229 12.064 83.704 11.67C83.5071 11.2542 83.1132 11.0463 82.5223 11.0463C81.5156 11.0463 80.9904 11.7466 80.9466 13.1472L80.881 14.2962L76.6463 14.132C76.712 11.9436 77.2482 10.3351 78.2548 9.30654C79.2834 8.2561 80.8262 7.73088 82.8834 7.73088C84.7435 7.73088 86.1222 8.24516 87.0195 9.27372C87.9168 10.2804 88.3654 11.7138 88.3654 13.574V22.3386C88.3654 23.6955 88.4748 25.2493 88.6937 27H84.6888C84.47 25.8182 84.3168 24.91 84.2293 24.2754C83.9666 25.1289 83.518 25.8511 82.8834 26.442C82.2706 27.0109 81.4718 27.2954 80.487 27.2954ZM82.1284 23.98C82.5004 23.98 82.8505 23.8487 83.1788 23.586C83.529 23.3234 83.8135 23.0389 84.0323 22.7326V17.4147C82.8724 18.0931 82.008 18.7496 81.439 19.3843C80.87 19.997 80.5855 20.7739 80.5855 21.7149C80.5855 22.4152 80.7168 22.9733 80.9794 23.3891C81.2639 23.783 81.6469 23.98 82.1284 23.98ZM91.6529 8.02631H96.1173V9.89742C97.6273 8.45306 99.1592 7.73088 100.713 7.73088C101.785 7.73088 102.584 8.12479 103.109 8.91263C103.656 9.70046 103.93 10.6962 103.93 11.8998V27H99.4656V12.7861C99.4656 12.1734 99.3671 11.7248 99.1702 11.4403C98.9951 11.1558 98.6668 11.0135 98.1854 11.0135C97.6601 11.0135 96.9708 11.3199 96.1173 11.9327V27H91.6529V8.02631ZM107.332 28.9368C108.514 28.9368 109.345 28.8273 109.827 28.6085C110.33 28.4115 110.582 28.0176 110.582 27.4267C110.582 27.0328 110.352 25.9167 109.892 24.0784L105.723 8.02631H110.056L112.518 20.566L114.652 8.02631H118.952L114.521 27.755C114.149 29.3526 113.438 30.4796 112.387 31.1361C111.359 31.8145 109.958 32.1538 108.185 32.1538H107.332V28.9368ZM129.065 0.37775H133.497V15.6749L138.355 8.02631H143.246L138.486 15.642L143.148 27H138.453L135.007 17.6445L133.497 19.7454V26.9672H129.065V0.37775ZM150.676 27.2954C148.576 27.2954 147.033 26.7155 146.048 25.5556C145.063 24.3739 144.571 22.6341 144.571 20.3362V14.6901C144.571 12.3703 145.063 10.6305 146.048 9.47068C147.055 8.31081 148.597 7.73088 150.676 7.73088C152.821 7.73088 154.331 8.33269 155.206 9.53633C156.104 10.74 156.552 12.5564 156.552 14.9855V17.7101H149.002V21.4523C149.002 22.3715 149.134 23.0389 149.396 23.4547C149.681 23.8705 150.118 24.0784 150.709 24.0784C151.278 24.0784 151.683 23.8815 151.924 23.4876C152.186 23.0718 152.318 22.4481 152.318 21.6165V20.008H156.52V21.321C156.52 23.2687 156.027 24.7569 155.042 25.7854C154.058 26.7921 152.602 27.2954 150.676 27.2954ZM152.318 15.5107V13.7053C152.318 12.7205 152.197 12.0202 151.957 11.6044C151.716 11.1667 151.289 10.9479 150.676 10.9479C150.042 10.9479 149.604 11.1777 149.363 11.6372C149.123 12.0968 149.002 12.9503 149.002 14.1977V15.5107H152.318ZM159.713 28.9368C160.895 28.9368 161.727 28.8273 162.208 28.6085C162.711 28.4115 162.963 28.0176 162.963 27.4267C162.963 27.0328 162.733 25.9167 162.274 24.0784L158.105 8.02631H162.438L164.9 20.566L167.033 8.02631H171.334L166.902 27.755C166.53 29.3526 165.819 30.4796 164.768 31.1361C163.74 31.8145 162.339 32.1538 160.567 32.1538H159.713V28.9368ZM186.863 27.2298C185.134 27.2298 183.908 26.814 183.186 25.9824C182.486 25.1508 182.136 23.9143 182.136 22.273V10.9479H180.232V8.02631H182.136V2.34734H186.633V8.02631H189.489V10.9479H186.633V21.8791C186.633 22.5137 186.764 22.9733 187.027 23.2578C187.311 23.5423 187.749 23.6845 188.34 23.6845C188.887 23.6845 189.347 23.6408 189.719 23.5532V27C188.843 27.1532 187.891 27.2298 186.863 27.2298ZM198.025 27.2954C195.989 27.2954 194.468 26.7374 193.462 25.6213C192.455 24.4833 191.952 22.842 191.952 20.6973V14.329C191.952 12.1843 192.455 10.5539 193.462 9.43785C194.468 8.29987 195.989 7.73088 198.025 7.73088C200.06 7.73088 201.581 8.29987 202.588 9.43785C203.616 10.5539 204.13 12.1843 204.13 14.329V20.6973C204.13 22.842 203.616 24.4833 202.588 25.6213C201.581 26.7374 200.06 27.2954 198.025 27.2954ZM198.058 24.2098C198.736 24.2098 199.185 23.9471 199.403 23.4219C199.622 22.8748 199.732 22.076 199.732 21.0256V14.0336C199.732 12.9831 199.622 12.1843 199.403 11.6372C199.185 11.0901 198.736 10.8166 198.058 10.8166C197.357 10.8166 196.898 11.0901 196.679 11.6372C196.46 12.1843 196.351 12.9831 196.351 14.0336V21.0256C196.351 22.076 196.46 22.8748 196.679 23.4219C196.898 23.9471 197.357 24.2098 198.058 24.2098ZM220.913 27.2954C218.79 27.2954 217.247 26.7046 216.284 25.5228C215.321 24.3192 214.84 22.6013 214.84 20.3691V14.6573C214.84 12.4032 215.321 10.6853 216.284 9.5035C217.247 8.32175 218.79 7.73088 220.913 7.73088C222.926 7.73088 224.392 8.21233 225.311 9.17524C226.252 10.1381 226.723 11.6044 226.723 13.574V15.1497H222.521V13.4755C222.521 12.4907 222.401 11.8123 222.16 11.4403C221.941 11.0682 221.536 10.8822 220.946 10.8822C220.311 10.8822 219.873 11.112 219.632 11.5716C219.414 12.0311 219.304 12.8737 219.304 14.0992V21.0584C219.304 22.2402 219.425 23.0499 219.665 23.4876C219.928 23.9253 220.355 24.1441 220.946 24.1441C221.558 24.1441 221.974 23.9471 222.193 23.5532C222.412 23.1374 222.521 22.4809 222.521 21.5836V19.5484H226.723V21.3539C226.723 23.3016 226.252 24.7787 225.311 25.7854C224.37 26.7921 222.904 27.2954 220.913 27.2954ZM235.435 27.2954C233.4 27.2954 231.879 26.7374 230.872 25.6213C229.866 24.4833 229.362 22.842 229.362 20.6973V14.329C229.362 12.1843 229.866 10.5539 230.872 9.43785C231.879 8.29987 233.4 7.73088 235.435 7.73088C237.471 7.73088 238.992 8.29987 239.998 9.43785C241.027 10.5539 241.541 12.1843 241.541 14.329V20.6973C241.541 22.842 241.027 24.4833 239.998 25.6213C238.992 26.7374 237.471 27.2954 235.435 27.2954ZM235.468 24.2098C236.147 24.2098 236.595 23.9471 236.814 23.4219C237.033 22.8748 237.142 22.076 237.142 21.0256V14.0336C237.142 12.9831 237.033 12.1843 236.814 11.6372C236.595 11.0901 236.147 10.8166 235.468 10.8166C234.768 10.8166 234.308 11.0901 234.089 11.6372C233.871 12.1843 233.761 12.9831 233.761 14.0336V21.0256C233.761 22.076 233.871 22.8748 234.089 23.4219C234.308 23.9471 234.768 24.2098 235.468 24.2098ZM244.629 8.02631H249.094V9.89742C250.604 8.45306 252.136 7.73088 253.689 7.73088C254.762 7.73088 255.56 8.12479 256.086 8.91263C256.633 9.70046 256.906 10.6962 256.906 11.8998V27H252.442V12.7861C252.442 12.1734 252.343 11.7248 252.147 11.4403C251.971 11.1558 251.643 11.0135 251.162 11.0135C250.637 11.0135 249.947 11.3199 249.094 11.9327V27H244.629V8.02631ZM265.659 27.2298C263.93 27.2298 262.705 26.814 261.982 25.9824C261.282 25.1508 260.932 23.9143 260.932 22.273V10.9479H259.028V8.02631H260.932V2.34734H265.429V8.02631H268.285V10.9479H265.429V21.8791C265.429 22.5137 265.56 22.9733 265.823 23.2578C266.108 23.5423 266.545 23.6845 267.136 23.6845C267.683 23.6845 268.143 23.6408 268.515 23.5532V27C267.639 27.1532 266.688 27.2298 265.659 27.2298ZM271.208 1.29689H275.672V5.00628H271.208V1.29689ZM271.208 8.02631H275.672V27H271.208V8.02631ZM279.219 8.02631H283.683V9.89742C285.193 8.45306 286.725 7.73088 288.279 7.73088C289.351 7.73088 290.15 8.12479 290.675 8.91263C291.222 9.70046 291.496 10.6962 291.496 11.8998V27H287.032V12.7861C287.032 12.1734 286.933 11.7248 286.736 11.4403C286.561 11.1558 286.233 11.0135 285.751 11.0135C285.226 11.0135 284.537 11.3199 283.683 11.9327V27H279.219V8.02631ZM297.819 27.2954C296.747 27.2954 295.948 26.9015 295.423 26.1137C294.898 25.3259 294.635 24.3301 294.635 23.1265V8.02631H299.067V22.3058C299.067 22.8967 299.165 23.3453 299.362 23.6517C299.559 23.9581 299.898 24.1113 300.38 24.1113C300.883 24.1113 301.551 23.8158 302.382 23.225V8.02631H306.847V27H302.382V25.1945C300.916 26.5951 299.395 27.2954 297.819 27.2954ZM316.027 27.2954C313.926 27.2954 312.383 26.7155 311.398 25.5556C310.413 24.3739 309.921 22.6341 309.921 20.3362V14.6901C309.921 12.3703 310.413 10.6305 311.398 9.47068C312.405 8.31081 313.948 7.73088 316.027 7.73088C318.171 7.73088 319.681 8.33269 320.557 9.53633C321.454 10.74 321.903 12.5564 321.903 14.9855V17.7101H314.353V21.4523C314.353 22.3715 314.484 23.0389 314.747 23.4547C315.031 23.8705 315.469 24.0784 316.06 24.0784C316.629 24.0784 317.033 23.8815 317.274 23.4876C317.537 23.0718 317.668 22.4481 317.668 21.6165V20.008H321.87V21.321C321.87 23.2687 321.378 24.7569 320.393 25.7854C319.408 26.7921 317.953 27.2954 316.027 27.2954ZM317.668 15.5107V13.7053C317.668 12.7205 317.548 12.0202 317.307 11.6044C317.066 11.1667 316.64 10.9479 316.027 10.9479C315.392 10.9479 314.954 11.1777 314.714 11.6372C314.473 12.0968 314.353 12.9503 314.353 14.1977V15.5107H317.668Z" fill="#2E323F"/>
        </svg>`
        };
        __simulateLoad.dimensions = function () {
            const width = __defaults.stage._width;
            const height = __defaults.stage._height;

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
        }()
        __simulateLoad.drawLoadBar = function (_ctx, _percent) {
            const { loadBarWidth, loadBarHeight, loadBarX, loadBarY,
                loadingBarWidth, loadingBarHeight, loadingBarX, loadingBarY } = this.dimensions;

            _ctx.fillStyle = "#6F737F"
            _ctx.fillRect(loadBarX, loadBarY, loadBarWidth, loadBarHeight);

            _ctx.fillStyle = "#2E323F"
            _ctx.fillRect(loadingBarX, loadingBarY, loadingBarWidth * _percent, loadingBarHeight);
        }
        __simulateLoad.drawLoadStart = async function (_ctx) {
            const { width, height } = _ctx;

            _ctx.fillStyle = "#3B4050";
            _ctx.fillRect(0, 0, width, height);

            await this.drawLogo(_ctx);
        }
        __simulateLoad.drawLoadEnd = async function (_ctx) {
            await this.drawLoaded(_ctx);
        }
        __simulateLoad.drawLogo = function (_ctx) {
            const { logoX, logoY, logoSize } = this.dimensions;
            const svg = this.svgs.logo;

            return new Promise((resolve, reject) => {
                const logo = new __defaults.Image();
                logo.onload = () => {
                    _ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                    resolve();
                }
                logo.onerror = () => {
                    _ctx.fillStyle = "#E44D26"
                    _ctx.fillRect(logoX, logoY, logoSize, logoSize);
                    resolve();
                }
                logo.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
            });
        }
        __simulateLoad.drawLoaded = function (_ctx) {
            const { loadBarWidth, loadBarHeight, loadedTextY, loadBarX } = this.dimensions;
            const svg = this.svgs.loaded;

            return new Promise((resolve, reject) => {
                const logo = new __defaults.Image();
                logo.onload = () => {
                    _ctx.drawImage(logo, loadBarX, loadedTextY, loadBarWidth, loadBarHeight);
                    resolve();
                }
                logo.onerror = () => {
                    _ctx.save();
                    _ctx.fillStyle = "#2E323F"
                    _ctx.font = `bold ${loadBarHeight}px sans-serif`;
                    _ctx.textBaseline = "top";
                    _ctx.fillText("press any key to continue", loadBarX, loadedTextY, loadBarWidth);
                    _ctx.restore();
                    resolve();
                }
                logo.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
            });
        }
        const __callLoaderFunction = async () => {
            __loaderState = "loading";
            if (helperUtils.isScriptOrFunction(__loadToQueue)) {
                await __simulateLoad();
            }
            __loaderState = "ready";
            if (helperUtils.isScriptOrFunction(onLoad)) await __commandUtils.getScriptOrFunction(onLoad)();
            endload();
        }
        const performload = function (_script) {
            stopRunTime();
            if (helperUtils.isScriptOrFunction(_script)) __loadToQueue = __Script(__commandUtils.getScriptOrFunction(_script)).bind(__loaderObj);
            __callLoaderFunction();
        }
        const endload = function (_script) {
            startRunTime(__defaults.fps);
        }

        return {
            performload,
            endload,
            get state() {
                return __loaderState;
            }
        }
    })();

    const ____returns = new __constructors.Engine({
        meta: MetaModule,
        Mouse: MouseModule,
        Key: KeyModule,
        Sound: SoundModule,
        SharedObject: SharedObjectModule,

        stage,
        utils: helperUtils,

        _root,
        state: engineState,

        changeState,
        useState,
        setState,

        addScript,

        useScene,
        resetScene,

        attachPrefab,
        attachTextField,

        removePrefab,
        removeTextField,

        createPrefab,
        createTextField,
        createScene,

        createScript,
        createSprite,
        createSpriteSheet,
        createGraphic,
        createPainting,
        createSound,

        getScript: getScriptAcknowledgement,
        getSprite: getSpriteAcknowledgement,
        getSpriteSheet: getSpriteSheetAcknowledgement,
        getGraphic: getGraphicAcknowledgement,
        getPainting: getPaintingAcknowledgement,
        getSound: getSoundAcknowledgement,


        PXS: numberUtils.perXSeconds,
        XPS: numberUtils.xPerSecond,

        trace: __commandUtils.trace,

        createLoop,
        pauseLoop,
        playLoop,
        deleteLoop,
        createTimeout,
        deleteTimeout,

        start: startRunTime,
        stop: stopRunTime,
        sleep: blockRunTime,

        useLoader: LoaderManager.performload
    });

    Object.defineProperties(____returns, {
        FPS: {
            get: function () { return runitor.fps },
            enumerable: false,
            configurable: false
        },
        SPF: {
            get: function () { return runitor.spf },
            enumerable: false,
            configurable: false
        }
    });

    const ____initFunc = function () {
        return ____returns;
    }
    const ____thisObj = ____initFunc();
    const ____engine = ____thisObj;

    __loadEngine();
    return ____returns;
}