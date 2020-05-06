function FlevaR(_div = document.body, _options = {}) {
    const __defaults = function () {
        const minStageWidth = 400, minStageHeight = 400;
        return {
            sprite: (() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 50;
                canvas.height = 50;

                ctx.fillStyle = "#888";
                ctx.fillRect(0, 0, 50, 50);
                ctx.fillStyle = "#333";
                ctx.fillRect(20, 0, 10, 50);
                ctx.fillRect(0, 20, 50, 10);

                return canvas;
            })(),
            engine: {
                version: "FlevaR Version 0.0.7"
            },
            stage: {
                _width: Math.max(minStageWidth, _options._width) || 600,
                _height: Math.max(minStageHeight, _options._height) || 500,
                _color: "#fff0"
            },
            minStageWidth, minStageHeight
        }
    }()

    __config = {
        DEBUG: _options.debug
    }
    
    const state = {};
    let __pixelResolution = _options.hitAccuracy || 10;
    let __renderFunction = null;

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
    const MouseTypes = (function () {
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
            __screen.div.style.cursor = 'default';
            if (__mouseList.isHidden) __mouseList.isHidden = false;
        }
        const hide = function () {
            __screen.div.style.cursor = 'none';
            if (!__mouseList.isHidden) __mouseList.isHidden = true;
        }

        return {
            isDown, isUp,
            isPressed, isReleased,
            show, hide,
            LEFT, MIDDLE, RIGHT
        }
    })();

    Object.defineProperties(MouseTypes, {
        hidden: {
            get: function () { return __mouseList.isHidden },
            enumerable: false,
            configurable: false
        }
    });

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
    const __clearKeyStates = function () {
        for (const _key of Object.keys(__keysPressed)) {
            if (__keysPressed[_key]) __keysPressed[_key] = false;
        }
        for (const _key of Object.keys(__keysReleased)) {
            delete __keysReleased[_key];
        }
    }
    const KeyTypes = (function () {
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
        return {
            isDown, isUp,
            isPressed, isReleased,
            LEFT, RIGHT, UP, DOWN,
            SPACE, BACKSPACE, ENTER,
            TAB, SHIFT, CONTROL, CTRL, ALTERNATE, ALT,
            ...ALPHABET
        }
    })();

    const __callRenderFunction = () => {
        if (helperUtils.isFunction(__renderFunction)) {
            __renderFunction(____thisObj, ____engine);
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
        prefabs: {}, scripts: {}, scenes: {}, layers: {}, sprites: {}, spritesheets: {}
    }
    const properties = {
        scripts: [],
        scene: ""
    }

    const __privateProperties = {
        showingPage: true
    }

    const propertyUtils = {
        listPrefabs: () => {
            return Object.keys(__library.prefabs);
        },
        listScripts: () => {
            return Object.keys(__library.scripts);
        },
        listScenes: () => {
            return Object.keys(__library.scenes);
        },
        listLayers: () => {
            return Object.keys(__library.layers);
        },
        listSprites: () => {
            return Object.keys(__library.sprites).filter(_name => _name.substr(0, 1) !== "$");
        },
        listSpriteSheets: () => {
            return Object.keys(__library.spritesheets);
        },
        getObjName: ({ ..._obj }) => {
            string = Object.keys({ _obj })[0];
            return string[0].toUpperCase() + string.slice(1, -1);
        }
    }

    const __constructors = {
        Engine: function Engine() {
            for (const args of arguments)
                for (const arg of Object.keys(args))
                    this[arg] = args[arg];
        },
        Prefab: function Prefab() {
            for (const args of arguments)
                for (const arg of Object.keys(args))
                    this[arg] = args[arg];
        },
        Scene: function Scene() {
            for (const args of arguments)
                for (const arg of Object.keys(args))
                    this[arg] = args[arg];
        },
        Layer: function Layer() {
            for (const args of arguments)
                for (const arg of Object.keys(args))
                    this[arg] = args[arg];
        },
        Script: function Script() {  },
        Sprite: function Sprite() {
            for (const args of arguments)
                for (const arg of Object.keys(args))
                    this[arg] = args[arg];
        },
        SpriteSheet: function SpriteSheet() {
            for (const args of arguments)
                for (const arg of Object.keys(args))
                    this[arg] = args[arg];
        }
        
        
        
        
        
        
    }
    const __commandUtils = {
        print: console.log.bind(window.console),
        drawSprite: (_name, { _x = 0, _y = 0, _width = 50, _height = 50, _alpha = 1, _visible }) => {
            ___errorsM.checkSpriteNotExist(_name);
            if (_visible) {
                const { ctx } = __screen;
                if (helperUtils.isDefined(_alpha) && _alpha !== 1) ctx.globalAlpha = _alpha;
                ctx.drawImage(__library.sprites[_name].img, _x, _y, _width, _height);
                if (helperUtils.isDefined(_alpha) && _alpha !== 1) ctx.globalAlpha = 1;
            }
        },
        getPixelMap: (_name) => {
            ___errorsM.checkSpriteNotExist(_name);
            return __library.sprites[_name].pixelMap;
        },
        boxHitTest: function (_source, _target) {
            return !(
                ((_source._y + _source._height) < (_target._y)) ||
                (_source._y > (_target._y + _target._height)) ||
                ((_source._x + _source._width) < _target._x) ||
                (_source._x > (_target._x + _target._width))
            );
        },
        boxHitTestPoint: function (_source, _point) {
            return !(
                ((_source._y + _source._height) < (_point._y)) ||
                (_source._y > _point._y) ||
                ((_source._x + _source._width) < _point._x) ||
                (_source._x > _point._x)
            );
        },
        pixelHitTest: function (_source, _target) {
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
                    const pixel1 = _source.pixelMap[(pX - sX) + "_" + (pY - sY)];
                    const pixel2 = _target.pixelMap[(pX - tX) + "_" + (pY - tY)];

                    if (!pixel1 || !pixel2) {
                        continue;
                    };

                    
                    if (pixel1[3] > 5 && pixel2[3] > 5) {
                        return true;
                    }
                }
            }

            return false;
        },
        pixelHitTestPoint: function (_source, _point) {
            
            
            
            



            const spriteX = (_point._x - _source._x) * (_source.pixelMap._width / _source._width);
            const spriteY = (_point._y - _source._y) * (_source.pixelMap._height / _source._height);

            const fX = Math.floor(spriteX / __pixelResolution) * __pixelResolution;
            const fY = Math.floor(spriteY / __pixelResolution) * __pixelResolution;

            const pixel = _source.pixelMap.data[(fX) + "_" + (fY)];

            if (!pixel) {
                return false;
            };

            if (pixel[3] > 55) {
                return true;
            }

            return false;
        }
    }
    const ___errorsM = {
        checkCanUseName: function (_name, _symbol = "symbol") {
            let canUseName = typeof _name === "string" && _name.trim() !== "" && _name.match(/^[^a-zA-Z_]|[^\w]/g) === null;
            if (!canUseName) throw `Invalid ${_symbol} name declaration: ${_name}`;
        },
        checkPrefabExist: function (_name, _obj) {
            this.checkCanUseName(_name, "prefab");
            if (_obj) {
                if (_obj[_name]) throw `Prefab already exists: ${_name}.`;
            } else
                if (__library.prefabs[_name]) throw `Prefab already exists: ${_name}.`;
        },
        checkPrefabNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Prefab does not exist: ${_name}`;
            } else
                if (!__library.prefabs[_name]) throw `Prefab does not exist: ${_name}`;
        },
        checkScriptExist: function (_name, _obj) {
            this.checkCanUseName(_name, "script");
            if (_obj) {
                if (_obj[_name]) throw `Script already exists: ${_name}.`;
            } else
                if (__library.scripts[_name]) throw `Script already exists: ${_name}.`;
        },
        checkScriptNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Script does not exist: ${_name}`;
            } else
                if (!__library.scripts[_name]) throw `Script does not exist: ${_name}`;
        },
        checkSceneExist: function (_name, _obj) {
            this.checkCanUseName(_name, "scene");
            if (_obj) {
                if (_obj[_name]) throw `Scene already exists: ${_name}.`;
            } else
                if (__library.scenes[_name]) throw `Scene already exists: ${_name}.`;
        },
        checkSceneNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Scene does not exist: ${_name}`;
            } else
                if (!__library.scenes[_name]) throw `Scene does not exist: ${_name}`;
        },
        checkLayerExist: function (_name, _obj) {
            this.checkCanUseName(_name, "layer");
            if (_obj) {
                if (_obj[_name]) throw `Layer already exists: ${_name}.`;
            } else
                if (__library.layers[_name]) throw `Layer already exists: ${_name}.`;
        },
        checkLayerNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Layer does not exist: ${_name}`;
            } else
                if (!__library.layers[_name]) throw `Layer does not exist: ${_name}`;
        },
        checkSpriteExist: function (_name, _obj) {
            this.checkCanUseName(_name, "sprite");
            if (_obj) {
                if (_obj[_name]) throw `Sprite already exists: ${_name}.`;
            } else
                if (__library.sprites[_name]) throw `Sprite already exists: ${_name}.`;
        },
        checkSpriteNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `Sprite does not exist: ${_name}`;
            } else
                if (!__library.sprites[_name]) throw `Sprite does not exist: ${_name}`;
        },
        checkSpriteSheetExist: function (_name, _obj) {
            this.checkCanUseName(_name, "spritesheet");
            if (_obj) {
                if (_obj[_name]) throw `SpriteSheet already exists: ${_name}.`;
            } else
                if (__library.spritesheets[_name]) throw `SpriteSheet already exists: ${_name}.`;
        },
        checkSpriteSheetNotExist: function (_name, _obj) {
            if (_obj) {
                if (!_obj[_name]) throw `SpriteSheet does not exist: ${_name}`;
            } else
                if (!__library.spritesheets[_name]) throw `SpriteSheet does not exist: ${_name}`;
        }
    }

    const __loopWorker = (function () {
        const webworker = () => {
            self.postMessage({ id: "hi" })
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
        constructor(id, workFunc, interval, errorFunc) {
            this.id = id;
            this.expected;
            this.timeout;
            this.interval = interval;
            this.workFunc = workFunc;
            this.errorFunc = errorFunc;
            this.isRunning = false;

            this.step = this.step.bind(this);
        }

        start(instant) {
            if (this.isRunning) return;
            this.isRunning = true;
            const intv = (instant ? 0 : this.interval);
            this.expected = Date.now() + intv;
            __loopWorker.postMessage({ code: "step", id: this.id, interval: intv });
        }

        stop() {
            if (!this.isRunning) return;

            this.isRunning = false;
            __loopWorker.postMessage({ code: "clear", id: this.id });
        }

        step() {
            let drift = Date.now() - this.expected;
            if (drift > this.interval) {
                
                if (this.errorFunc) this.errorFunc();
            }
            this.workFunc();
            this.expected += this.interval;
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
        const addLoop = (_func, _TPS, _start) => {
            const loopID = generateLoopID();
            loops[loopID] = new __pureLoop(loopID, _func, _TPS);
            loops[loopID].start(_start);
            return loopID;
        }
        const pauseLoop = (_id) => {
            if (!loops[_id]) return;
            loops[_id].stop();
        }
        const playLoop = (_id, _start) => {
            if (!loops[_id]) return;
            loops[_id].start(_start);
        }
        const removeLoop = (_id) => {
            if (!loops[_id]) return;
            loops[_id].stop();
            delete loops[_id];
        }
        __loopWorker.onmessage = function ({ data }) {
            if (!loops[data.id]) return;
            loops[data.id].step();
        }

        const ____returns = {
            addLoop, pauseLoop, playLoop, removeLoop
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

    const Native = {
        version: __defaults.engine.version
    }
    Object.defineProperties(Native, {
        loops: {
            get: function () { return __loopManager.loops; },
            enumerable: false,
            configurable: false
        }
    });

    const stage = {
        _width: __defaults.stage._width,
        _height: __defaults.stage._height
    }
    Object.defineProperties(stage, {
        _color: {
            get: function () { return __defaults.stage._color },
            set: function (_color) { __defaults.stage._color = _color },
            enumerable: false,
            configurable: false
        },
        _xmouse: {
            get: function () { return __mouse._x },
            enumerable: false,
            configurable: false
        },
        _ymouse: {
            get: function () { return __mouse._y },
            enumerable: false,
            configurable: false
        }
    });

    const __Script = function (_func) {
        const _script = _func;
        _script.constructor = __constructors.Script;
        return _script;
    }
    const __Scene = function (_init) {
        
        const state = {};
        let __renderFunction = null;
        let isLoaded = false;

        const __callRenderFunction = () => {
            if (helperUtils.isFunction(__renderFunction)) {
                
                for (const _name of Object.keys(__properties.layers)) {
                    __properties.layers[_name].hidden = true;
                }
                __renderFunction(____thisObj, ____engine);
            }
        }
        const __properties = {
            prefabs: {}, layers: {}, scripts: []
        }
        let __prefabCount = 0;
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
            __callRenderFunction();
        }
        const useState = (_objOrFunc) => { 
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.deepClone(state);
                const _newState = _objOrFunc(prevState);

                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            }
        }
        const setState = (_objOrFunc) => { 
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.deepClone(state);
                const _newState = _objOrFunc(prevState);

                __fillState(_newState);
                __callRenderFunction();
            }
        }

        const addPrefab = (_prefabOrInit,
            { name: instanceName, preserve = false, ..._props } = {}, _forceLoad) => {
            if (helperUtils.isString(_prefabOrInit)) {
                const _name = _prefabOrInit;

                if (!(__properties.prefabs[__prefabCount] && __properties.prefabs[__prefabCount].preserve && preserve)) {
                    const originalPrefabSkeleton = __getPrefab(_name).___unsafe;
                    const _init = originalPrefabSkeleton.___pullOutInit();
                    const _oldProps = originalPrefabSkeleton.___pullOutProps();
                    __properties.prefabs[__prefabCount] = {
                        instanceName,
                        preserve,
                        prefab: new __Prefab({ ..._oldProps, ..._props }, _init, _forceLoad)
                    }
                }
                __prefabCount++;
            } else if (helperUtils.isFunction(_prefabOrInit)) {
                if (!(__properties.prefabs[__prefabCount] && __properties.prefabs[__prefabCount].preserve && preserve)) {
                    const _init = _prefabOrInit;
                    __properties.prefabs[__prefabCount] = {
                        instanceName,
                        preserve,
                        prefab: new __Prefab(_props, _init, _forceLoad)
                    }
                }
                __prefabCount++;
            }
        }

        const addScript = (_script) => {
            if (helperUtils.isString(_script)) {
                const _newScript = __getScript(_script);
                __properties.scripts.push(new __Script(_newScript).bind(____thisObj));
            } else if (helperUtils.isFunction(_script)) {
                __properties.scripts.push(new __Script(_script).bind(____thisObj));
            }
        }

        const addLayer = (_name, { preserve = false } = {}) => {
            if (!helperUtils.isString(_name)) throw `Layer name expected.`;
            const _newLayer = __getLayer(_name);
            if (!__properties.layers[_name] || (__properties.layers[_name] && !__properties.layers[_name].preserve)) {
                __properties.layers[_name] = {
                    hidden: true,
                    preserve,
                    layer: helperUtils.clone(_newLayer)
                };
            }
        }

        const useLayer = (_name) => {
            ___errorsM.checkLayerNotExist(_name);
            ___errorsM.checkLayerNotExist(_name, __properties.layers);
            __properties.layers[_name].hidden = false;
        }

        const renderer = (_script) => {
            if (helperUtils.isString(_script)) {
                const _newScript = __getScript(_script);
                __renderFunction = new __Script(_newScript).bind(____thisObj);
            } else if (helperUtils.isFunction(_script)) {
                __renderFunction = new __Script(_script).bind(____thisObj);
            }
        }

        const load = () => {
            if (isLoaded) return;
            if (_init) {
                _init = _init.bind(____thisObj);
                _init(____thisObj, ____engine);
            }

            
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.load();
            }

            
            for (const _name of Object.keys(__properties.layers)) {
                __properties.layers[_name].layer.load();
            }

            __callRenderFunction();
            isLoaded = true;
        }
        const unload = () => {
            if (!isLoaded) return;
            
            for (const _name of Object.keys(__properties.prefabs)) {
                if (!__properties.prefabs[_name].preserve) {
                    __properties.prefabs[_name].prefab.unload();
                    delete __properties.prefabs[_name];
                }
            }
            __prefabCount = 0;

            
            for (const _name of Object.keys(__properties.layers)) {
                if (!__properties.layers[_name].preserve) {
                    __properties.layers[_name].layer.unload();
                    delete __properties.layers[_name];
                }
            }

            
            __properties.scripts.length = 0;

            isLoaded = false;
        }

        const tick = function () {
            
            __properties.scripts.forEach(_script => {
                _script(____thisObj, ____engine);
            });

            
            for (const _name of Object.keys(__properties.prefabs)) {
                if (helperUtils.isDefined(__properties.prefabs[_name])) __properties.prefabs[_name].prefab.tick();
            }

            
            for (const _name of Object.keys(__properties.layers)) {
                if (helperUtils.isDefined(__properties.layers[_name])) __properties.layers[_name].layer.tick();
            }

        }
        const render = function () {
            
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.render();
            }

            
            for (const _name of Object.keys(__properties.layers)) {
                if (!__properties.layers[_name].hidden)
                    __properties.layers[_name].layer.render();
            }
        }
        const start = function () {
            
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.start();
            }

            
            for (const _name of Object.keys(__properties.layers)) {
                __properties.layers[_name].layer.start();
            }
        }
        const stop = function () {
            
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.stop();
            }

            
            for (const _name of Object.keys(__properties.layers)) {
                __properties.layers[_name].layer.stop();
            }
        }

        const propertyUtils = {
            prefabCount: () => {
                return __prefabCount;
            },
            listLayers: () => {
                return Object.keys(__properties.layers);
            }
        }

        const ___unsafe = {
            ___getPrefabFromInstanceName: (_instanceName) => {
                
                for (const _name of Object.keys(__properties.prefabs)) {
                    if (__properties.prefabs[_name].instanceName === _instanceName) {
                        return __properties.prefabs[_name].prefab;
                    }
                }
                
                for (const _name of Object.keys(__properties.layers)) {
                    if (!__properties.layers[_name].hidden) {
                        const prefab = __properties.layers[_name].layer.___unsafe.___getPrefabFromInstanceName(_instanceName);
                        if (prefab) return prefab;
                    }
                }
                return false;
            }
        }

        const ____returns = new __constructors.Scene({
            propertyUtils,
            ___unsafe,
            state,
            changeState,
            useState,
            setState,
            addPrefab,
            addScript,
            addLayer,
            useLayer,
            renderer,
            load,
            unload,
            tick,
            render,
            start,
            stop
        });
        const ____initFunc = function () {
            return ____returns;
        }
        const ____thisObj = new ____initFunc();
        return ____returns;
    }

    const __Layer = function (_init) {
        
        const state = {};
        let __renderFunction = null;
        let isLoaded = false;

        const __callRenderFunction = () => {
            if (helperUtils.isFunction(__renderFunction)) {
                __renderFunction(____thisObj, ____engine);
            }
        }
        const __properties = {
            prefabs: {}, scripts: []
        }
        let __prefabCount = 0;
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
            __callRenderFunction();
        }
        const useState = (_objOrFunc) => { 
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.deepClone(state);
                const _newState = _objOrFunc(prevState);

                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            }
        }
        const setState = (_objOrFunc) => { 
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.deepClone(state);
                const _newState = _objOrFunc(prevState);

                __fillState(_newState);
                __callRenderFunction();
            }
        }

        const addPrefab = (_prefabOrInit,
            { name: instanceName, ..._props } = {}) => {
            if (helperUtils.isString(_prefabOrInit)) {
                const _name = _prefabOrInit;

                const originalPrefabSkeleton = __getPrefab(_name).___unsafe;
                const _init = originalPrefabSkeleton.___pullOutInit();
                const _oldProps = originalPrefabSkeleton.___pullOutProps();
                __properties.prefabs[__prefabCount] = {
                    instanceName,
                    prefab: new __Prefab({ ..._oldProps, ..._props }, _init)
                }
                __prefabCount++;
            } else if (helperUtils.isFunction(_prefabOrInit)) {
                const _init = _prefabOrInit;
                __properties.prefabs[__prefabCount] = {
                    instanceName,
                    prefab: new __Prefab(_props, _init)
                }
                __prefabCount++;
            }
        }

        const addScript = (_script) => {
            if (helperUtils.isString(_script)) {
                const _newScript = __getScript(_script);
                __properties.scripts.push(new __Script(_newScript).bind(____thisObj));
            } else if (helperUtils.isFunction(_script)) {
                __properties.scripts.push(new __Script(_script).bind(____thisObj));
            }
        }
        const load = () => {
            if (isLoaded) return;
            if (_init) {
                _init = _init.bind(____thisObj);
                _init(____thisObj, ____engine);
            }

            
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.load();
            }

            isLoaded = true;
        }

        const unload = () => {
            if (!isLoaded) return;
            
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.unload();
                delete __properties.prefabs[_name];
            }
            __prefabCount = 0;

            
            __properties.scripts.length = 0;

            isLoaded = false;
        }

        const tick = function () {
            
            __properties.scripts.forEach(_script => {
                _script(____thisObj, ____engine);
            });

            
            for (const _name of Object.keys(__properties.prefabs)) {
                if (helperUtils.isDefined(__properties.prefabs[_name])) __properties.prefabs[_name].prefab.tick();
            }

        }
        const render = function () {
            
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.render();
            }
        }

        const start = function () {
            
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.start();
            }
        }
        const stop = function () {
            
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.stop();
            }
        }

        const propertyUtils = {
            prefabCount: () => {
                return __prefabCount;
            }
        }

        const ___unsafe = {
            ___getPrefabFromInstanceName: (_instanceName) => {
                
                for (const _name of Object.keys(__properties.prefabs)) {
                    if (__properties.prefabs[_name].instanceName === _instanceName) {
                        return __properties.prefabs[_name].prefab;
                    }
                }
                return false;
            }
        }

        const ____returns = new __constructors.Layer({
            propertyUtils,
            ___unsafe,
            state,
            changeState,
            useState,
            setState,
            addPrefab,
            addScript,
            load,
            unload,
            tick,
            render,
            start,
            stop
        });
        const ____initFunc = function () {
            return ____returns;
        }
        const ____thisObj = new ____initFunc();
        if (_init) {
            _init = _init.bind(____thisObj);
            _init(____thisObj, ____engine);
        }
        return ____returns;
    }
    const __Prefab = function (_props = { _x: 0, _y: 0, _width: 50, _height: 50, _alpha: 1, _visible: true }, _init, _forceLoad) {
        
        const state = {}, props = { _x: 0, _y: 0, _width: 50, _height: 50, _alpha: 1, _visible: true };
        let __renderFunction = null;
        let isLoaded = false;

        const __callRenderFunction = () => {
            if (helperUtils.isFunction(__renderFunction)) {
                __renderFunction(____thisObj, ____engine);
            }
        }
        if (_props) {
            if (!helperUtils.isObject(_props)) return;
            props._x = helperUtils.isDefined(_props._x) ? _props._x : props._x;
            props._y = helperUtils.isDefined(_props._y) ? _props._y : props._y;
            props._width = helperUtils.isDefined(_props._width) ? _props._width : props._width;
            props._height = helperUtils.isDefined(_props._height) ? _props._height : props._height;
            props._alpha = helperUtils.isDefined(_props._alpha) ? _props._alpha : props._alpha;
            props._visible = helperUtils.isDefined(_props._visible) ? _props._visible : props._visible;
        }

        const __properties = {
            scripts: [],
            graphic: {
                sprite: null,
                type: null,
                name: null
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
            __callRenderFunction();
        }
        const useState = (_objOrFunc) => { 
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.deepClone(state);
                const _newState = _objOrFunc(prevState);

                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            }
        }
        const setState = (_objOrFunc) => { 
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = _objOrFunc;

                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.deepClone(state);
                const _newState = _objOrFunc(prevState);

                __fillState(_newState);
                __callRenderFunction();
            }
        }

        const hitTestPoint = (_x, _y, _pixel) => {
            if (!helperUtils.isNumber(_x)) throw `Number expected for _x point.`;
            if (!helperUtils.isNumber(_y)) throw `Number expected for _y point.`;

            const sourceProps = props;
            const targetPoint = { _x, _y };
            if (!sourceProps._visible) return false;
            if (!_pixel) {
                const source = { ...sourceProps };
                if (__commandUtils.boxHitTestPoint(source, targetPoint)) {
                    return true;
                }
            } else {
                const sourceSprite = __properties.graphic.sprite;
                if (!sourceSprite) return false;
                const sourcePixelMap = __commandUtils.getPixelMap(sourceSprite);
                const source = { ...sourceProps, pixelMap: sourcePixelMap };

                if (__commandUtils.boxHitTestPoint(source, targetPoint)) {
                    if (__commandUtils.pixelHitTestPoint(source, targetPoint)) {
                        return true;
                    }
                }
            }

            return false;
        }

        const hitTestPrefab = (_prefabOrName, _pixel) => {
            let prefab;
            if (helperUtils.isPrefab(_prefabOrName))
                prefab = _prefabOrName;
            else if (helperUtils.isString(_prefabOrName))
                prefab = __getPrefabFromInstanceName(_prefabOrName);
            else throw `Invalid prefab argument! Prefab or string expected.`;
            if (!prefab) throw `Prefab with instance name ${_prefabOrName} not found.`;

            const sourceProps = props;
            const targetProps = prefab.___unsafe.___pullOutProps();
            if (!sourceProps._visible || !targetProps._visible) return false;
            
            const source = { ...sourceProps };
            const target = { ...targetProps };
            if (__commandUtils.boxHitTest(source, target)) {
                return true;
            }
            
            
            
            
            

            
            
            
            

            
            
            
            
            
            

            return false;
        }

        let __spriteSheet = [], __spriteSheetID = 0, __spriteSheetLoop = undefined;
        const __resetSpriteSheet = () => {
            if (helperUtils.isDefined(__spriteSheetLoop)) {
                deleteLoop(__spriteSheetLoop);
                __spriteSheet = [];
                __spriteSheetID = 0;
                __spriteSheetLoop = undefined;

                __properties.graphic.name = null;
            }
        }
        const useSprite = (_name) => {
            ___errorsM.checkSpriteNotExist(_name);
            if (__properties.graphic.type === helperUtils.typeOf(__constructors.Sprite) && __properties.graphic.name === _name) return;

            __resetSpriteSheet();
            __properties.graphic.sprite = _name;
            __properties.graphic.name = _name;
            __properties.graphic.type = helperUtils.typeOf(__constructors.Sprite);
        }
        const useSpriteSheet = (_name, _interval = 1000) => {
            ___errorsM.checkSpriteSheetNotExist(_name);
            if (__properties.graphic.type === helperUtils.typeOf(__constructors.SpriteSheet) && __properties.graphic.name === _name) return;

            __resetSpriteSheet();

            __spriteSheet = __library.spritesheets[_name].spriteList;
            __spriteSheetID = 0;

            __spriteSheetLoop = createLoop(() => {
                __spriteSheetID = numberUtils.cycle(__spriteSheetID, __spriteSheet.length - 1);
                const currentSprite = __spriteSheet[__spriteSheetID];
                __properties.graphic.sprite = currentSprite;
            }, _interval, true);

            __properties.graphic.name = _name;
            __properties.graphic.type = helperUtils.typeOf(__constructors.SpriteSheet);
        }
        const addScript = (_script) => {
            if (helperUtils.isString(_script)) {
                let _newScript = __getScript(_script);
                __properties.scripts.push(new __Script(_newScript).bind(____thisObj));
            } else if (helperUtils.isFunction(_script)) {
                __properties.scripts.push(new __Script(_script).bind(____thisObj));
            }
        }

        const renderer = (_script) => {
            if (helperUtils.isString(_script)) {
                const _newScript = __getScript(_script);
                __renderFunction = new __Script(_newScript).bind(____thisObj);
            } else if (helperUtils.isFunction(_script)) {
                __renderFunction = new __Script(_script).bind(____thisObj);
            }
        }

        const load = function () {
            if (isLoaded) return;
            if (_init) {
                _init = _init.bind(____thisObj);
                _init(____thisObj, ____engine);
            }

            __callRenderFunction();
            isLoaded = true;
        }
        const unload = () => {
            if (!isLoaded) return;
            
            __resetSpriteSheet();

            
            __properties.scripts.length = 0;
            isLoaded = false;
        }

        const tick = () => {
            __properties.scripts.forEach(_script => {
                _script(____thisObj, ____engine);
            });
        }
        const render = () => {
            if (helperUtils.isString(__properties.graphic.sprite)) {
                __commandUtils.drawSprite(__properties.graphic.sprite, props);
            }
        }
        const start = () => {
            __callRenderFunction();
        }
        const stop = () => {
            __resetSpriteSheet();
        }

        const ___unsafe = {
            ___overrideProps: (_props) => {
                if (!helperUtils.isObject(_props)) return;
                props._x = helperUtils.isDefined(_props._x) ? _props._x : props._x;
                props._y = helperUtils.isDefined(_props._y) ? _props._y : props._y;
                props._width = helperUtils.isDefined(_props._width) ? _props._width : props._width;
                props._height = helperUtils.isDefined(_props._height) ? _props._height : props._height;
                props._alpha = helperUtils.isDefined(_props._alpha) ? _props._alpha : props._alpha;
                props._visible = helperUtils.isDefined(_props._visible) ? _props._visible : props._visible;
            },
            ___pullOutInit: () => _init,
            ___pullOutProps: () => ({ ...props }),
            ___getSprite: () => __properties.graphic.sprite
        }

        const ____returns = new __constructors.Prefab({
            ___unsafe,
            state,
            hitTestPrefab,
            hitTestPoint,
            changeState,
            useState,
            setState,
            addScript,
            useSprite,
            useSpriteSheet,
            renderer,
            load,
            unload,
            tick,
            render,
            start,
            stop
        });
        
        
        
        
        
        
        Object.defineProperty(____returns, "_sprite", {
            get: function () { return __properties.graphic.name },
            enumerable: false,
            configurable: false
        });
        for (let prop of Object.keys(props)) {
            Object.defineProperty(____returns, prop, {
                get: function () { return props[prop] },
                set: function () { props[prop] = arguments[0] },
                enumerable: false,
                configurable: false
            });
        }

        const ____initFunc = function () {
            return ____returns;
        }
        const ____thisObj = new ____initFunc();



        if (_forceLoad) {
            load();
        }

        return ____returns;
    }

    let __symbolAutoAdder = 0;
    const __generateSymbolName = function (_symbol = "symbol") {
        const serializedID = String(Math.random()).substr(2);
        return `$${_symbol}_${__symbolAutoAdder++}_${serializedID}`;
    }
    const __SpriteSheet = function (_props = { _width: 100, _heighth: 100, cut: false, props: [] }, ..._definitions) {
        return new Promise(async (resolve, reject) => {
            let __spriteList = [];
            let scanvas, sctx, canvas, ctx;

            const { _width: w, _height: h, cut } = _props;

            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            canvas.width = w;
            canvas.height = h;

            async function cutSprite(_canvas, _width, _height, _cut) {
                if (!_cut) {
                    ctx.clearRect(0, 0, w, h);
                    ctx.drawImage(scanvas, 0, 0, w, h, 0, 0, w, h);

                    
                    const img = await __turnCanvasToImage(canvas);
                    
                    const pixelMapData = __turnCanvasToPixelData(canvas, ctx);

                    const returns = new __constructors.Sprite({
                        img,
                        pixelMap: {
                            data: pixelMapData,
                            _width: canvas.width,
                            _height: canvas.height
                        }
                    });

                    const _name = __generateSymbolName("spritesheet");
                    __library.sprites[_name] = returns;
                    __spriteList.push(_name);
                } else {
                    for (let sW = 0; sW < _width; sW += w) {
                        ctx.clearRect(0, 0, w, h);
                        ctx.drawImage(scanvas, sW, 0, w, h, 0, 0, w, h);

                        
                        const img = await __turnCanvasToImage(canvas);
                        
                        const pixelMapData = __turnCanvasToPixelData(canvas, ctx);

                        const returns = new __constructors.Sprite({
                            img,
                            pixelMap: {
                                data: pixelMapData,
                                _width: canvas.width,
                                _height: canvas.height
                            }
                        });

                        const _name = __generateSymbolName("spritesheet");
                        __library.sprites[_name] = returns;
                        __spriteList.push(_name);
                    }
                }
            }

            for (const i in _definitions) {
                let _definition = _definitions[i];
                if (helperUtils.isString(_definition)) {
                    try {
                        ___errorsM.checkSpriteNotExist(_definition);
                        __spriteList.push(_definition);
                    } catch{ }
                } else {
                    const prop = _props.props[i];
                    const sW = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop._width) ? prop._width : w) : w;
                    const sH = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop._height) ? prop._height : h) : h;
                    const sCut = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop.cut) ? prop.cut : cut) : cut;
                    if (!helperUtils.isFunction(_definition)) {
                        scanvas = __defaults.sprite;
                    } else if (helperUtils.isFunction(_definition)) {

                        scanvas = document.createElement('canvas');
                        sctx = scanvas.getContext('2d');
                        scanvas.width = sW;
                        scanvas.height = sH;

                        _definition = _definition.bind(sctx);
                        _definition(sctx, ____engine);
                    }

                    await cutSprite(scanvas, sW, sH, sCut);
                }
            }

            const ___returns = new __constructors.SpriteSheet({
                spriteList: __spriteList
            });
            resolve(___returns);
        });
    }

    const __turnCanvasToImage = function (_canvas) {
        return new Promise((resolve, reject) => {
            const _sprite = new Image(_canvas.width, _canvas.height);
            _sprite.onload = function () {
                resolve(_sprite);
            }
            _sprite.onerror = function () {
                reject();
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
                const pixelData = pixel.data;

                pixelMapData[dataRowColOffset] = pixelData;
            }
        }

        return pixelMapData;
    }

    const __Sprite = function (_props = { _width: 100, _height: 100 }, _definition) {
        return new Promise(async (resolve, reject) => {
            let canvas, ctx;
            if (!helperUtils.isFunction(_definition)) {
                canvas = __defaults.sprite;
                ctx = canvas.getContext('2d');
            } else {
                const { _width = 100, _height = 100 } = _props;
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('2d');
                canvas.width = _width;
                canvas.height = _height;

                _definition = _definition.bind(ctx);
                _definition(ctx, ____engine);
            }

            
            const img = await __turnCanvasToImage(canvas);

            
            const pixelMapData = __turnCanvasToPixelData(canvas, ctx);

            const ___returns = new __constructors.Sprite({
                img,
                pixelMap: {
                    data: pixelMapData,
                    _width: canvas.width,
                    _height: canvas.height
                }
            });
            resolve(___returns);
        });
    }


    const __getPrefab = function (_name) {
        ___errorsM.checkPrefabNotExist(_name);
        return __library.prefabs[_name];
    }
    const __getPrefabFromInstanceName = (_instanceName) => {
        
        if (properties.scene !== "") {
            const prefab = __library.scenes[properties.scene].___unsafe.___getPrefabFromInstanceName(_instanceName);
            if (prefab) return prefab;
        }

        
        for (const _name of Object.keys(__attachedPrefabs)) {
            if (__attachedPrefabs[_name].instanceName === _instanceName) {
                return __attachedPrefabs[_name].prefab;
            }
        }
        return undefined;
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
        __callRenderFunction();
    }
    const useState = (_objOrFunc) => { 
        if (helperUtils.isObject(_objOrFunc)) {
            const _newState = _objOrFunc;

            __clearState();
            __fillState(_newState);
            __callRenderFunction();
        } else if (helperUtils.isFunction(_objOrFunc)) {
            const prevState = helperUtils.deepClone(state);
            const _newState = _objOrFunc(prevState);

            __clearState();
            __fillState(_newState);
            __callRenderFunction();
        }
    }
    const setState = (_objOrFunc) => { 
        if (helperUtils.isObject(_objOrFunc)) {
            const _newState = _objOrFunc;

            __fillState(_newState);
            __callRenderFunction();
        } else if (helperUtils.isFunction(_objOrFunc)) {
            const prevState = helperUtils.deepClone(state);
            const _newState = _objOrFunc(prevState);

            __fillState(_newState);
            __callRenderFunction();
        }
    }

    const numberUtils = {
        lock: function (_num, _a, _b) {
            if (!helperUtils.isNumber(_num)) return 0;
            if (!helperUtils.isNumber(_a)) return _num;
            if (!helperUtils.isNumber(_b)) _b = _a;
            if (_num < _a) _num = _a;
            else if (_num > _b) _num = _b;
            return _num;
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
        }
    }
    const helperUtils = {
        clone: function (_obj) {
            if (_obj === null || typeof (_obj) !== 'object')
                return _obj;

            let _temp;
            
            
            _temp = new _obj.constructor();
            for (let _key in _obj)
            
            {
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
        },
        deepClone: (function () {
            const __ownedKeys = function () {
                try {
                    return Reflect.ownKeys;
                } catch (err) {
                    const gOPNs = Object.getOwnPropertyNames;
                    const gOPSs = Object.getOwnPropertySymbols;
                    return function (_obj) {

                        return gOPNs(_obj).concat(gOPSs ? gOPSs(_obj) : []);
                    };
                }
            }(), {
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
            return typeof _val === "string";
        },
        isNumber: function (_val) {
            return typeof _val === "number";
        },
        isBigInt: function (_val) {
            return typeof _val === "bigint";
        },
        isBoolean: function (_val) {
            return typeof _val === "boolean";
        },
        isObject: function (_val) {
            try {
                return _val.constructor === Object;
            } catch {
                return false;
            }
        },
        isArray: function (_val) {
            try {
                return _val.constructor === Array;
            } catch {
                return false;
            }
        },
        isPrefab: function (_val) {
            try {
                return _val.constructor === __constructors.Prefab;
            } catch {
                return false;
            }
        },
        isScene: function (_val) {
            try {
                return _val.constructor === __constructors.Scene;
            } catch {
                return false;
            }
        },
        isLayer: function (_val) {
            try {
                return _val.constructor === __constructors.Layer;
            } catch {
                return false;
            }
        },
        isScript: function (_val) {
            try {
                return _val.constructor === __constructors.Script;
            } catch {
                return false;
            }
        },
        isSprite: function (_val) {
            try {
                return _val.constructor === __constructors.Sprite;
            } catch {
                return false;
            }
        },
        isSpriteSheet: function (_val) {
            try {
                return _val.constructor === __constructors.SpriteSheet;
            } catch {
                return false;
            }
        },
        isEngine: function (_val) {
            try {
                return _val.constructor === __constructors.Engine;
            } catch {
                return false;
            }
        },
        isEngineNative: function (_val) {
            return this.isPrefab(_val) || this.isScene(_val) || this.isLayer(_val) || this.isScript(_val) || this.isSprite(_val) || this.isSpriteSheet(_val) || this.isEngine(_val);
        },
        isFunction: function (_val) {
            return typeof _val === "function";
        },
        isUndefined: function (_val) {
            return _val === undefined;
        },
        isNull: function (_val) {
            return !this.isUndefined(_val) && !this.isObject(_val) && _val !== undefined;
        },
        isDefined: function (_val) {
            return !this.isUndefined(_val);
        },
        typeOf: function (_val) {
            return this.isString(_val) ? "string" :
                this.isNumber(_val) ? "number" :
                    this.isBigInt(_val) ? "bigint" :
                        this.isBoolean(_val) ? "boolean" :
                            this.isObject(_val) ? "object" :
                                this.isPrefab(_val) ? "prefab" :
                                    this.isScene(_val) ? "scene" :
                                        this.isLayer(_val) ? "layer" :
                                            this.isScript(_val) ? "script" :
                                                this.isSprite(_val) ? "sprite" :
                                                    this.isSpriteSheet(_val) ? "spritesheet" :
                                                        this.isEngine(_val) ? "engine" :
                                                            this.isArray(_val) ? "array" :
                                                                this.isFunction(_val) ? "function" :
                                                                    this.isUndefined(_val) ? "undefined" :
                                                                        this.isNull(_val) ? "null" :
                                                                            "unknown";

        }
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
                    code: "sprite",
                    args: [...arguments]
                });
            },
            createSpriteSheet: function () {
                __loaderQueue.push({
                    type: "async",
                    code: "spritesheet",
                    args: [...arguments]
                });
            },
            createPrefab: function () {
                __loaderQueue.push({
                    type: "sync",
                    code: "prefab",
                    args: [...arguments]
                });
            },
            createScript: function () {
                __loaderQueue.push({
                    type: "sync",
                    code: "script",
                    args: [...arguments]
                });
            },
            createLayer: function () {
                __loaderQueue.push({
                    type: "sync",
                    code: "layer",
                    args: [...arguments]
                });
            },
            createScene: function () {
                __loaderQueue.push({
                    type: "sync",
                    code: "scene",
                    args: [...arguments]
                });
            }
        }
        const __loadPercentInc = (_counter, _count) => {
            const percent = Math.floor(_counter / _count * 100) / 100;
            __simulateLoad.drawLoadBar(__screen.ctx, percent);
        }
        const __loadFromQueue = async () => {
            const loadCount = __loaderQueue.filter(_val => _val.type === "async").length;
            let loadCounter = 0;
            __loadPercentInc(loadCounter, loadCount);
            for (const _id of Object.keys(__loaderQueue)) {
                const args = __loaderQueue[_id].args;
                switch (__loaderQueue[_id].code) {
                    case "sprite":
                        await createSprite(...args);
                        break;
                    case "spritesheet":
                        await createSpriteSheet(...args);
                        break;
                    case "prefab":
                        createPrefab(...args);
                        break;
                    case "layer":
                        createLayer(...args);
                        break;
                    case "script":
                        createScript(...args);
                        break;
                    case "scene":
                        createScene(...args);
                        break;
                }
                if (__loaderQueue[_id].type === "async") loadCounter++;
                __loadPercentInc(loadCounter, loadCount);
            }
        }
        const __simulateLoad = () => {
            return new Promise(async (resolve, reject) => {
                try {
                    await __simulateLoad.drawLoadStart(__screen.ctx);
                    __loadToQueue(__loaderObj, ____engine);
                    await __loadFromQueue();
                    await __simulateLoad.drawLoadEnd(__screen.ctx);
                    __loaderQueue.length = 0;
                } catch {
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
            logo: `<svg width="331" height="331" viewBox="0 0 331 331" fill="none" xmlns="http:
    <rect x="0.0936127" y="63.259" width="275" height="275" rx="27" transform="rotate(-13.279 0.0936127 63.259)" fill="#E44D26"/>
    <path d="M90.6 255V93H153.2V109.2H113.2V163.2H144.2V179.2H113.2V255H90.6ZM168.725 255V93H208.925C218.658 93 226.392 94.8 232.125 98.4C237.992 101.867 242.258 106.933 244.925 113.6C247.592 120.267 248.925 128.333 248.925 137.8C248.925 146.333 247.392 153.733 244.325 160C241.392 166.267 236.992 171.133 231.125 174.6C225.258 177.933 217.925 179.6 209.125 179.6H191.325V255H168.725ZM191.325 163.4H201.725C208.258 163.4 213.392 162.667 217.125 161.2C220.858 159.733 223.525 157.2 225.125 153.6C226.725 149.867 227.525 144.667 227.525 138C227.525 130.267 226.925 124.333 225.725 120.2C224.658 116.067 222.325 113.2 218.725 111.6C215.125 110 209.525 109.2 201.925 109.2H191.325V163.4Z" fill="#FBC5B7"/>
    </svg>`,
            loaded: `<svg width="322" height="34" viewBox="0 0 322 34" fill="none" xmlns="http:
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
                const logo = new Image();
                logo.onload = () => {
                    _ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                    resolve();
                }
                logo.onerror = () => {
                    _ctx.fillStyle = "#9F636F"
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
                const logo = new Image();
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
            if (helperUtils.isFunction(__loadToQueue)) {
                await __simulateLoad();
            }
            __loaderState = "ready";
            if (helperUtils.isFunction(onLoad)) onLoad();
        }
        const loader = function (_script) {
            if (helperUtils.isFunction(_script)) __loadToQueue = new __Script(_script).bind(__loaderObj);
            __callLoaderFunction();
        }
        const setOnLoad = function (_val) {
            onLoad = _val;
        }

        return {
            loader,
            setOnLoad,
            get state() {
                return __loaderState;
            }
        }
    })()

    const createPrefab = function (_name, _props, _init) {
        ___errorsM.checkPrefabExist(_name);
        __library.prefabs[_name] = new __Prefab(_props, _init);
    }

    const __attachedPrefabs = {};
    const attachPrefab = (_prefabOrInit,
        { name: instanceName, ..._props } = {}, _prefabName) => {
        if (_prefabName) {
            ___errorsM.checkCanUseName(_prefabName, "prefab");
        } else {
            _prefabName = __generateSymbolName("prefab");
        }

        if (helperUtils.isString(_prefabOrInit)) {
            const _name = _prefabOrInit;

            const originalPrefabSkeleton = __getPrefab(_name).___unsafe;
            const _init = originalPrefabSkeleton.___pullOutInit();
            const _oldProps = originalPrefabSkeleton.___pullOutProps();
            __attachedPrefabs[_prefabName] = {
                instanceName,
                prefab: new __Prefab({ ..._oldProps, ..._props }, _init, true)
            }
        } else if (helperUtils.isFunction(_prefabOrInit)) {
            const _init = _prefabOrInit;
            __attachedPrefabs[_prefabName] = {
                instanceName,
                prefab: new __Prefab(_props, _init, true)
            }
        }
    }
    const removePrefab = function (_prefabName) {
        if (__attachedPrefabs[_prefabName]) {
            __attachedPrefabs[_prefabName].prefab.unload();
            delete __attachedPrefabs[_prefabName];
        }
    }

    const createScene = function (_name, _init) {
        ___errorsM.checkSceneExist(_name);
        __library.scenes[_name] = new __Scene(_init);
    }
    const useScene = function (_name) {
        ___errorsM.checkSceneNotExist(_name);
        if (properties.scene !== "") {
            __library.scenes[properties.scene].unload();
        }
        properties.scene = _name;
        __library.scenes[properties.scene].load();
    }

    const getScene = function () {
        return properties.scene;
    }

    const createLayer = function (_name, _init) {
        ___errorsM.checkLayerExist(_name);
        __library.layers[_name] = new __Layer(_init);
    }
    const __getLayer = function (_name) {
        ___errorsM.checkLayerNotExist(_name);
        return __library.layers[_name];
    }

    const createScript = function (_name, _func) {
        ___errorsM.checkScriptExist(_name);
        __library.scripts[_name] = new __Script(_func);
    }
    const __getScript = function (_name) {
        ___errorsM.checkScriptNotExist(_name);
        return __library.scripts[_name];
    }
    const addScript = function (_script) {
        if (helperUtils.isString(_script)) {
            const _newScript = __getScript(_script);
            properties.scripts.push(new __Script(_newScript).bind(____thisObj));
        } else if (helperUtils.isFunction(_script)) {
            properties.scripts.push(new __Script(_script).bind(____thisObj));
        }
    }

    const createSprite = async function (_name, _props, _func) {
        ___errorsM.checkSpriteExist(_name);
        __library.sprites[_name] = await new __Sprite(_props, _func);
    }

    const createSpriteSheet = async function (_name, _props, ..._func) {
        ___errorsM.checkSpriteSheetExist(_name);
        __library.spritesheets[_name] = await new __SpriteSheet(_props, ..._func);
    }


    const createLoop = function (_func, _TPS, _start) {
        return __loopManager.addLoop(_func, _TPS, _start);
    }
    const pauseLoop = function (_id) {
        __loopManager.pauseLoop(_id);
    }
    const playLoop = function (_id, _start) {
        __loopManager.playLoop(_id, _start);
    }
    const deleteLoop = function (_id) {
        __loopManager.removeLoop(_id);
    }

    const __tick = function () {
        
        properties.scripts.forEach(_script => {
            _script(____thisObj, ____engine);
        });
        
        for (const _name of Object.keys(__attachedPrefabs)) {
            __attachedPrefabs[_name].prefab.tick();
        }

        
        try {
            if (properties.scene !== "")
                __library.scenes[properties.scene].tick();
        } catch (e) { console.error("Error on engine tick:", e) }

    }
    let __callDrawer = null;
    let drawerOrder = "end";
    const drawer = function (_func, options = {}) {
        __callDrawer = _func.bind(__screen.ctx);
        if (options.order && (options.order === "start" || options.order === "end")) drawerOrder = options.order;
    }
    const __render = function () {
        const hasDrawer = helperUtils.isFunction(__callDrawer);

        hasDrawer && (drawerOrder === "start") && __callDrawer(__screen.ctx);
        
        if (properties.scene !== "")
            __library.scenes[properties.scene].render();

        
        for (const _name of Object.keys(__attachedPrefabs)) {
            __attachedPrefabs[_name].prefab.render();
        }

        hasDrawer && (drawerOrder === "end") && __callDrawer(__screen.ctx);
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
    const __run = function () {


        __tick();

        __clearMouseStates();
        __clearKeyStates();
        if (__privateProperties.showingPage) {
            __clearScreen();
            __render();
        }
    }
    let __isRunning = false;
    const start = function (_interval) {
        
        if (LoaderManager.state === "false") {
            LoaderManager.loader();
        }
        if (LoaderManager.state === "loaded") return console.error("App loaded. Press any key to continue.");
        if (LoaderManager.state !== "ready") return console.error("Can't start app. Loading not complete.");

        
        stop();
        
        __isRunning = true;

        if (properties.scene !== "")
            __library.scenes[properties.scene].start();

        
        for (const _name of Object.keys(__attachedPrefabs)) {
            __attachedPrefabs[_name].prefab.start();
        }

        let lastLoop = performance.now();
        let engineFps = 0;
        let engineSpf = 0;

        __runID = createLoop(() => {
            const spfNow = performance.now();

            __run();

            const currentLoop = performance.now();

            engineSpf = Math.round((currentLoop - spfNow) * 10) / 10000;
            engineFps = Math.round(1000 / ((currentLoop - lastLoop) || 1));
            lastLoop = currentLoop;
        }, _interval);

        __fpsID = createLoop(() => {
            runitor.fps = engineFps;
            runitor.spf = engineSpf;
        }, 1000);
    }
    const stop = function () {
        
        deleteLoop(__runID);
        deleteLoop(__fpsID);


        
        for (const _name of Object.keys(__attachedPrefabs)) {
            __attachedPrefabs[_name].prefab.stop();
        }

        

        if (properties.scene !== "")
            __library.scenes[properties.scene].stop();

        __isRunning = false;
    }

    const __cancelContextMenu = function (_event) { _event.preventDefault(); _event.stopPropagation(); }
    const __handleVisibilityChanged = function () {
        if (document.hidden) {
            __privateProperties.showingPage = false;
        } else {
            __privateProperties.showingPage = true;
        }
    }
    const __load = function () {
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
          box-sizing: border-box;
        }
        `;
        
        const ref = document.querySelector('script');
        
        ref.parentNode.insertBefore(style, ref);
    }
    const __unload = function () {
        __screen.div.removeEventListener('contextmenu', __cancelContextMenu);
        __screen.div.removeEventListener('mousemove', __setMousePosition);
        __screen.div.removeEventListener('mousedown', __setMouseDown);
        __screen.div.removeEventListener('mouseup', __setMouseUp);
        __screen.div.removeEventListener('mouseleave', __setMouseLeave);
        __screen.div.removeEventListener("keydown", __setKeyDown);
        __screen.div.removeEventListener("keyup", __setKeyUp);
        __screen.div.onselectstart = null;
    }
    __load();

    const ____returns = new __constructors.Engine({
        Native,
        stage,
        properties,
        helperUtils,
        state,
        Key: KeyTypes,
        Mouse: MouseTypes,

        changeState,
        useState,
        setState,
        createPrefab,
        attachPrefab,
        removePrefab,
        getPrefab: __getPrefabFromInstanceName,
        createScene,
        useScene,
        getScene,
        createLayer,
        createScript,
        addScript,
        createSprite,
        createSpriteSheet,
        drawer,

        listPrefabs: propertyUtils.listPrefabs,
        listScripts: propertyUtils.listScripts,
        listScenes: propertyUtils.listScenes,
        listLayers: propertyUtils.listLayers,
        listSprites: propertyUtils.listSprites,
        listSpriteSheets: propertyUtils.listSpriteSheets,

        perXSeconds: numberUtils.perXSeconds,
        xPerSecond: numberUtils.xPerSecond,

        print: __commandUtils.print,

        createLoop,
        pauseLoop,
        playLoop,
        deleteLoop,
        pureLoop: __pureLoop,

        start,
        stop,
        load: LoaderManager.loader
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
        },
        onLoad: {
            set: function (val) { LoaderManager.setOnLoad(val); },
            enumerable: false,
            configurable: false
        },
    });

    const ____initFunc = function () {
        return ____returns;
    }
    const ____thisObj = new ____initFunc();
    const ____engine = ____thisObj;
    return ____returns;
}