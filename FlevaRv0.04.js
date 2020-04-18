function FlevaR(_div = document.body, _options = {}) {
    const __defaults = {
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
            version: "FlevaR Version 0.0.4"
        },
        stage: {
            _width: _options._width || 600,
            _height: _options._height || 500,
            _color: "#fff0"
        }
    }

    __config = {
        DEBUG: _options.debug
    }
    //Private
    const state = {};
    let __pixelResolution = 10;
    let __renderFunction = null;

    const __mouse = {
        _x: 0, _y: 0,
        movX: 0, movY: 0
    }
    const __mouselist = {
        leftDown: false,
        middleDown: false,
        rightDown: false,
        isHidden: false,
    };
    const MouseTypes = (function () {
        const LEFT = 0;
        const MIDDLE = 1;
        const RIGHT = 2;
        const isDown = function (_key) {
            if (_key === "left" || _key === LEFT) return __mouselist.leftDown;
            if (_key === "middle" || _key === MIDDLE) return __mouselist.middleDown;
            if (_key === "right" || _key === RIGHT) return __mouselist.rightDown;
            return false;
        }
        const isUp = function (_key) {
            return !isDown(_key);
        }
        const show = function () {
            __screen.div.style.cursor = 'default';
            if (__mouselist.isHidden) __mouselist.isHidden = false;
        }
        const hide = function () {
            __screen.div.style.cursor = 'none';
            if (!__mouselist.isHidden) __mouselist.isHidden = true;
        }

        return {
            isDown, isUp,
            show, hide,
            LEFT, MIDDLE, RIGHT
        }
    })();

    Object.defineProperties(MouseTypes, {
        hidden: {
            get: function () { return __mouselist.isHidden },
            enumerable: false,
            configurable: false
        }
    });

    const __setMousePosition = function (_event) {
        const rect = __screen.canvas.getBoundingClientRect(),
            scaleX = __screen.canvas.width / rect.width,
            scaleY = __screen.canvas.height / rect.height;

        __mouse.movX = parseInt((_event.clientX - rect.left) * scaleX);
        __mouse.movY = parseInt((_event.clientY - rect.top) * scaleY);
        __mouse._x = __mouse.movX;
        __mouse._y = __mouse.movY;
    }
    const __setMouseUp = function (_event) {
        if (_event.button === 0) {
            if (__mouselist.leftDown) __mouselist.leftDown = false;
        } else if (_event.button === 1) {
            if (__mouselist.middleDown) __mouselist.middleDown = false;
        } else if (_event.button === 2) {
            if (__mouselist.rightDown) __mouselist.rightDown = false;
        }
    }
    const __setMouseDown = function (_event) {
        //_event.button describes the mouse button that was clicked
        // 0 is left, 1 is middle, 2 is right
        if (_event.button === 0) {
            if (!__mouselist.leftDown) __mouselist.leftDown = true;
        } else if (_event.button === 1) {
            if (!__mouselist.middleDown) __mouselist.middleDown = true;
        } else if (_event.button === 2) {
            if (!__mouselist.rightDown) __mouselist.rightDown = true;
        }
    }

    const __keyslist = {};
    const __setKeyDown = function (_event) {
        __keyslist['code_' + _event.keyCode] = true;
        __keyslist['name_' + _event.key.toLowerCase()] = true;
    }
    const __setKeyUp = function (_event) {
        delete __keyslist['code_' + _event.keyCode];
        delete __keyslist['name_' + _event.key.toLowerCase()];
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
            if (typeof _key === "string" && MAP[_key.toLowerCase()]) _key = MAP[_key.toLowerCase()];

            const keyDown = __keyslist['code_' + _key] || __keyslist['name_' + _key] || false;
            return keyDown;
        }
        const isUp = function (_key) {
            return !isDown(_key);
        }
        return {
            isDown, isUp,
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

        //div
        const canvasdiv = document.createElement('div');
        canvasdiv.setAttribute("style", `border-style: solid; border-width: 2px; margin: 5px; width: ${__width}px; height: ${__height}px; position: relative;`);
        canvasdiv.style.overflow = "hidden";
        canvasdiv.style.outline = "none";
        canvasdiv.style.border = 'none';
        canvasdiv.tabIndex = "0";

        //canvas
        const canvas = document.createElement('canvas');
        canvas.setAttribute("style", "position: absolute;");
        canvas.width = __width;
        canvas.height = __height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        //add to body
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
        Script: function Script() { /* [native code] */ },
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
                // You could have some default stuff here too...
                if (this.errorFunc) this.errorFunc();
            }
            this.workFunc();
            this.expected += this.interval;
            __loopWorker.postMessage({ code: "step", id: this.id, interval: Math.max(0, this.interval - drift) });
        }
    }

    const __loopManager = (function () {
        const loops = {};
        let loopCount = 0;
        const addLoop = (_func, _TPS, _start) => {
            loops[loopCount] = new __pureLoop(loopCount, _func, _TPS);
            loops[loopCount].start(_start);
            return loopCount++;
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
        //Private
        const state = {};
        let __renderFunction = null;
        let isLoaded = false;

        const __callRenderFunction = () => {
            if (helperUtils.isFunction(__renderFunction)) {
                //hide all layers
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


        //Public
        const changeState = (_name, _value) => {
            state[_name] = _value;
            __callRenderFunction();
        }
        const useState = (_objOrFunc) => { //overwrites
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = helperUtils.clone(_objOrFunc);
                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.clone(state);
                const _newState = _objOrFunc(prevState);
                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            }
        }
        const setState = (_objOrFunc) => { //merges
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = helperUtils.clone(_objOrFunc);

                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.clone(state);
                const _newState = _objOrFunc(prevState);

                __fillState(_newState);
                __callRenderFunction();
            }
        }

        const addPrefab = (_prefabOrInit,
            { name: instanceName, preserve = false, ..._props } = { instanceName: undefined, preserve: false, _props: undefined }, _forceLoad) => {
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

        const addLayer = (_name, { preserve = false } = { preserve: false }) => {
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

            //load all prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.load();
            }

            //load all layers
            for (const _name of Object.keys(__properties.layers)) {
                __properties.layers[_name].layer.load();
            }

            __callRenderFunction();
            isLoaded = true;
        }
        const unload = () => {
            if (!isLoaded) return;
            //unload/clear all prefabs without preserve
            for (const _name of Object.keys(__properties.prefabs)) {
                if (!__properties.prefabs[_name].preserve) {
                    __properties.prefabs[_name].prefab.unload();
                    delete __properties.prefabs[_name];
                }
            }
            __prefabCount = 0;

            //unload/clear all layers without preserve
            for (const _name of Object.keys(__properties.layers)) {
                if (!__properties.layers[_name].preserve) {
                    __properties.layers[_name].layer.unload();
                    delete __properties.layers[_name];
                }
            }

            //clear all scripts
            __properties.scripts.length = 0;

            isLoaded = false;
        }

        const tick = function () {
            //loop scripts
            __properties.scripts.forEach(_script => {
                _script(____thisObj, ____engine);
            });

            //loop prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.tick();
            }

            //loop layers
            for (const _name of Object.keys(__properties.layers)) {
                __properties.layers[_name].layer.tick();
            }

        }
        const render = function () {
            //loop prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.render();
            }

            //loop layers
            for (const _name of Object.keys(__properties.layers)) {
                if (!__properties.layers[_name].hidden)
                    __properties.layers[_name].layer.render();
            }
        }
        const start = function () {
            //start prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.start();
            }

            //start layers
            for (const _name of Object.keys(__properties.layers)) {
                __properties.layers[_name].layer.start();
            }
        }
        const stop = function () {
            //stop prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.stop();
            }

            //stop layers
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
                //loop prefabs
                for (const _name of Object.keys(__properties.prefabs)) {
                    if (__properties.prefabs[_name].instanceName === _instanceName) {
                        return __properties.prefabs[_name].prefab;
                    }
                }
                //loop layers
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
        //Private
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


        //Public
        const changeState = (_name, _value) => {
            state[_name] = _value;
            __callRenderFunction();
        }
        const useState = (_objOrFunc) => { //overwrites
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = helperUtils.clone(_objOrFunc);
                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.clone(state);
                const _newState = _objOrFunc(prevState);
                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            }
        }
        const setState = (_objOrFunc) => { //merges
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = helperUtils.clone(_objOrFunc);

                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.clone(state);
                const _newState = _objOrFunc(prevState);

                __fillState(_newState);
                __callRenderFunction();
            }
        }

        const addPrefab = (_prefabOrInit,
            { name: instanceName, ..._props } = { instanceName: undefined, _props: undefined }) => {
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

            //load all prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.load();
            }

            isLoaded = true;
        }

        const unload = () => {
            if (!isLoaded) return;
            //unload all prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.unload();
                delete __properties.prefabs[_name];
            }
            __prefabCount = 0;

            //clear all scripts
            __properties.scripts.length = 0;

            isLoaded = false;
        }

        const tick = function () {
            //loop scripts
            __properties.scripts.forEach(_script => {
                _script(____thisObj, ____engine);
            });

            //loop prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.tick();
            }

        }
        const render = function () {
            //loop prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.render();
            }
        }

        const start = function () {
            //start prefabs
            for (const _name of Object.keys(__properties.prefabs)) {
                __properties.prefabs[_name].prefab.start();
            }
        }
        const stop = function () {
            //stop prefabs
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
                //loop prefabs
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
        //Private
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
        //Public
        const changeState = (_name, _value) => {
            state[_name] = _value;
            __callRenderFunction();
        }
        const useState = (_objOrFunc) => { //overwrites
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = helperUtils.clone(_objOrFunc);
                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.clone(state);
                const _newState = _objOrFunc(prevState);
                __clearState();
                __fillState(_newState);
                __callRenderFunction();
            }
        }
        const setState = (_objOrFunc) => { //merges
            if (helperUtils.isObject(_objOrFunc)) {
                const _newState = helperUtils.clone(_objOrFunc);

                __fillState(_newState);
                __callRenderFunction();
            } else if (helperUtils.isFunction(_objOrFunc)) {
                const prevState = helperUtils.clone(state);
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

        const hitTestPrefab = (_prefabOrName) => {
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
            //reset all loops
            __resetSpriteSheet();

            //clear all scripts
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
    const __getSymbolName = function (_symbol = "symbol") {
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

                    //turn to image
                    const img = await __turnCanvasToImage(canvas);
                    //build pixel map
                    const pixelMapData = __turnCanvasToPixelData(canvas, ctx);

                    const returns = new __constructors.Sprite({
                        img,
                        pixelMap: {
                            data: pixelMapData,
                            _width: canvas.width,
                            _height: canvas.height
                        }
                    });

                    const _name = __getSymbolName("spritesheet");
                    __library.sprites[_name] = returns;
                    __spriteList.push(_name);
                } else {
                    for (let sW = 0; sW < _width; sW += w) {
                        ctx.clearRect(0, 0, w, h);
                        ctx.drawImage(scanvas, sW, 0, w, h, 0, 0, w, h);

                        //turn to image
                        const img = await __turnCanvasToImage(canvas);
                        //build pixel map
                        const pixelMapData = __turnCanvasToPixelData(canvas, ctx);

                        const returns = new __constructors.Sprite({
                            img,
                            pixelMap: {
                                data: pixelMapData,
                                _width: canvas.width,
                                _height: canvas.height
                            }
                        });

                        const _name = __getSymbolName("spritesheet");
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

            //turn to image
            const img = await __turnCanvasToImage(canvas);

            //build pixel map
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
        //look in scene
        if (properties.scene !== "") {
            const prefab = __library.scenes[properties.scene].___unsafe.___getPrefabFromInstanceName(_instanceName);
            if (prefab) return prefab;
        }

        //loop prefabs
        for (const _name of Object.keys(__attachedPrefabs)) {
            if (__attachedPrefabs[_name].instanceName === _instanceName) {
                return __properties.prefabs[_name].prefab;
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


    //Public
    const changeState = (_name, _value) => {
        state[_name] = _value;
        __callRenderFunction();
    }
    const useState = (_objOrFunc) => { //overwrites
        if (helperUtils.isObject(_objOrFunc)) {
            const _newState = helperUtils.clone(_objOrFunc);
            __clearState();
            __fillState(_newState);
            __callRenderFunction();
        } else if (helperUtils.isFunction(_objOrFunc)) {
            const prevState = helperUtils.clone(state);
            const _newState = _objOrFunc(prevState);
            __clearState();
            __fillState(_newState);
            __callRenderFunction();
        }
    }
    const setState = (_objOrFunc) => { //merges
        if (helperUtils.isObject(_objOrFunc)) {
            const _newState = helperUtils.clone(_objOrFunc);

            __fillState(_newState);
            __callRenderFunction();
        } else if (helperUtils.isFunction(_objOrFunc)) {
            const prevState = helperUtils.clone(state);
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
            if (helperUtils.isEngineNative(_obj)) _temp = new _obj.constructor(_obj);
            else _temp = new _obj.constructor();
            for (let _key in _obj)
                _temp[_key] = this.clone(_obj[_key]);

            return _temp;
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
    const createPrefab = function (_name, _props, _init) {
        ___errorsM.checkPrefabExist(_name);
        __library.prefabs[_name] = new __Prefab(_props, _init);
    }

    const __attachedPrefabs = {};
    const attachPrefab = (_prefabOrInit,
        { name: instanceName, ..._props } = { instanceName: undefined, _props: undefined }, _prefabName) => {
        if (_prefabName) {
            ___errorsM.checkCanUseName(_prefabName, "prefab");
        } else {
            _prefabName = __getSymbolName("prefab");
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
        //loop scripts
        properties.scripts.forEach(_script => {
            _script(____thisObj, ____engine);
        });

        //run scenes
        if (properties.scene !== "")
            __library.scenes[properties.scene].tick();

        //loop attached prefabs
        for (const _name of Object.keys(__attachedPrefabs)) {
            __attachedPrefabs[_name].prefab.tick();
        }
    }

    const __render = function () {
        //run scenes
        if (properties.scene !== "")
            __library.scenes[properties.scene].render();

        //render attached prefabs
        for (const _name of Object.keys(__attachedPrefabs)) {
            __attachedPrefabs[_name].prefab.render();
        }
    }
    const __clearScreen = function () {
        __screen.ctx.clearRect(0, 0, __screen.canvas.width, __screen.canvas.height);
        __screen.ctx.fillStyle = __defaults.stage._color;
        __screen.ctx.fillRect(0, 0, __screen.canvas.width, __screen.canvas.height);
    }
    let __runID = 0;
    let __fpsID = 0;
    let runitor = { //pun on monitor
        fps: 0,
        spf: 0
    }
    const __run = function () {
        __clearScreen();
        __tick();
        __render();
    }
    const start = function (_interval) {
        //clear everything
        stop();
        //start scenes

        if (properties.scene !== "")
            __library.scenes[properties.scene].start();

        //start attached prefabs
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
        //stop main loop
        deleteLoop(__runID);
        deleteLoop(__fpsID);


        //stop attached prefabs
        for (const _name of Object.keys(__attachedPrefabs)) {
            __attachedPrefabs[_name].prefab.stop();
        }

        //stop scenes

        if (properties.scene !== "")
            __library.scenes[properties.scene].stop();
    }

    const __cancelContextMenu = function (_event) { _event.preventDefault(); _event.stopPropagation(); }
    const __load = function () {
        __screen.div.addEventListener('contextmenu', __cancelContextMenu);
        __screen.div.addEventListener('mousemove', __setMousePosition, false);
        __screen.div.addEventListener('mousedown', __setMouseDown, false);
        __screen.div.addEventListener('mouseup', __setMouseUp, false);
        __screen.div.addEventListener("keydown", __setKeyDown, false);
        __screen.div.addEventListener("keyup", __setKeyUp, false);
        __screen.div.onselectstart = function () { return false; }

        // Create our stylesheet
        const style = document.createElement('style');
        style.innerHTML = `
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        `;
        // Get the first script tag
        const ref = document.querySelector('script');
        // Insert our new styles before the first script tag
        ref.parentNode.insertBefore(style, ref);
    }
    const __unload = function () {
        __screen.div.removeEventListener('contextmenu', __cancelContextMenu);
        __screen.div.removeEventListener('mousemove', __setMousePosition);
        __screen.div.removeEventListener('mousedown', __setMouseDown);
        __screen.div.removeEventListener('mouseup', __setMouseUp);
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
        createScene,
        getPrefab: __getPrefabFromInstanceName,
        useScene,
        createLayer,
        createScript,
        addScript,
        createSprite,
        createSpriteSheet,

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
        deleteLoop,
        pureLoop: __pureLoop,

        start,
        stop
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
    const ____thisObj = new ____initFunc();
    const ____engine = ____thisObj;
    return ____returns;
}