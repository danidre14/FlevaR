function FlevaR(_div = document.body, _options = {}) {
    __config = {
        DEBUG: _options.debug
    }
    //Private
    const state = {};
    let __pixelResolution = 10;
    let __renderFunction = null;

    const __callRenderFunction = () => {
        if (helperUtils.isFunction(__renderFunction)) {
            __renderFunction(____thisObj, ____engine);
        }
    }
    const __screen = (function () {
        const canvas = document.createElement('canvas');
        canvas.setAttribute("style", "border-style: solid; border-width: 2px; margin:5px");
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        _div.appendChild(canvas);
        return {
            ctx,
            canvas
        }
    })();
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
        })()
    }
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
        drawSprite: (_name, { _x: x = 0, _y: y = 0, _w: width = 50, _h: height = 50, _a: _alpha = 1, _v: _visible }) => {
            ___errorsM.checkSpriteNotExist(_name);
            if (_visible) {
                const { ctx } = __screen;
                if (helperUtils.isDefined(_alpha) && _alpha !== 1) ctx.globalAlpha = _alpha;
                ctx.drawImage(__library.sprites[_name].img, x, y, width, height);
                if (helperUtils.isDefined(_alpha) && _alpha !== 1) ctx.globalAlpha = 1;
            }
        },
        getPixelMap: (_name) => {
            ___errorsM.checkSpriteNotExist(_name);
            return __library.sprites[_name].pixelMap;
        },
        boxHitTest: function (_source, _target) {
            return !(
                ((_source._y + _source._h) < (_target._y)) ||
                (_source._y > (_target._y + _target._h)) ||
                ((_source._x + _source._w) < _target._x) ||
                (_source._x > (_target._x + _target._w))
            );
        },
        boxHitTestPoint: function (_source, _point) {
            return !(
                ((_source._y + _source._h) < (_point._y)) ||
                (_source._y > _point._y) ||
                ((_source._x + _source._w) < _point._x) ||
                (_source._x > _point._x)
            );
        },
        pixelHitTest: function (_source, _target) {
            return true;
        },
        pixelHitTestPoint: function (_source, _point) {
            const spriteX = (_point._x - _source._x) * (_source.pixelMap._w / _source._w);
            const spriteY = (_point._y - _source._y) * (_source.pixelMap._h / _source._h);

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

    const __pureLoop = class pureLoop {
        constructor(workFunc, interval, errorFunc) {
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
            this.timeout = setTimeout(this.step, intv);
        }

        stop() {
            if (!this.isRunning) return;

            this.isRunning = false;
            clearTimeout(this.timeout);

        }

        step() {
            let drift = Date.now() - this.expected;
            if (drift > this.interval) {
                if (this.errorFunc) this.errorFunc();
            }
            this.workFunc();
            this.expected += this.interval;
            this.timeout = setTimeout(this.step, Math.max(0, this.interval - drift));
        }
    }

    const __loopManager = (function () {
        const loops = {};
        let loopCount = 0;
        const addLoop = (_run, _TPS) => {
            loops[loopCount] = new __pureLoop(_run, _TPS);
            loops[loopCount].start();
            return loopCount++;
        }
        const removeLoop = (_id) => {
            if (!loops[_id]) return
            loops[_id].stop();
            delete loops[_id];
        }

        return {
            addLoop,
            removeLoop
        }
    })();

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
            { name: instanceName, preserve = false, ..._props } = { instanceName: undefined, preserve: false, _props: undefined }) => {
            if (helperUtils.isString(_prefabOrInit)) {
                const _name = _prefabOrInit;

                if (!(__properties.prefabs[__prefabCount] && __properties.prefabs[__prefabCount].preserve && preserve)) {
                    const originalPrefabSkeleton = __getPrefab(_name).___unsafe;
                    const _init = originalPrefabSkeleton.___pullOutInit();
                    const _oldProps = originalPrefabSkeleton.___pullOutProps();
                    __properties.prefabs[__prefabCount] = {
                        instanceName,
                        preserve,
                        prefab: new __Prefab({ ..._oldProps, ..._props }, _init)
                    }
                }
                __prefabCount++;
            } else if (helperUtils.isFunction(_prefabOrInit)) {
                if (!(__properties.prefabs[__prefabCount] && __properties.prefabs[__prefabCount].preserve && preserve)) {
                    const _init = _prefabOrInit;
                    __properties.prefabs[__prefabCount] = {
                        instanceName,
                        preserve,
                        prefab: new __Prefab(_props, _init)
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
            stop,
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
                for (const _name of Object.keys(__properties.prefabs)) {
                    if (__properties.prefabs[_name].instanceName === _instanceName)
                        return __properties.prefabs[_name].prefab;
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
    const __Prefab = function (_props = { x: 0, y: 0, w: 50, h: 50, a: 1, v: true }, _init) {
        //Private
        const state = {}, props = { _x: 0, _y: 0, _w: 50, _h: 50, _a: 1, _v: true };
        let __renderFunction = null;
        let isLoaded = false;

        const __callRenderFunction = () => {
            if (helperUtils.isFunction(__renderFunction)) {
                __renderFunction(____thisObj, ____engine);
            }
        }
        if (_props) {
            if (!helperUtils.isObject(_props)) return;
            props._x = helperUtils.isDefined(_props.x) ? _props.x : props._x;
            props._y = helperUtils.isDefined(_props.y) ? _props.y : props._y;
            props._w = helperUtils.isDefined(_props.w) ? _props.w : props._w;
            props._h = helperUtils.isDefined(_props.h) ? _props.h : props._h;
            props._a = helperUtils.isDefined(_props.a) ? _props.a : props._a;
            props._v = helperUtils.isDefined(_props.v) ? _props.v : props._v;
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
            if (!helperUtils.isNumber(_x)) throw `Number expected for x point.`;
            if (!helperUtils.isNumber(_y)) throw `Number expected for y point.`;

            const sourceProps = props;
            const targetPoint = { _x, _y };
            if (!sourceProps._v) return false;
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
            const targetProps = prefab.___unsafe.___pullOutRawProps();
            if (!sourceProps._v || !targetProps._v) return false;

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
                __spriteSheetLoop.stop();
                __spriteSheetLoop = undefined;
                __spriteSheet = [];
                __spriteSheetID = 0;
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

            __spriteSheetLoop = new __pureLoop(() => {
                __spriteSheetID = numberUtils.cycle(__spriteSheetID, __spriteSheet.length - 1);
                const currentSprite = __spriteSheet[__spriteSheetID];
                __properties.graphic.sprite = currentSprite;
            }, _interval);
            __spriteSheetLoop.start(true);

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
        const stop = () => {
            __resetSpriteSheet();
        }

        const ___unsafe = {
            ___overrideProps: (_props) => {
                if (!helperUtils.isObject(_props)) return;
                props._x = helperUtils.isDefined(_props.x) ? _props.x : props._x;
                props._y = helperUtils.isDefined(_props.y) ? _props.y : props._y;
                props._w = helperUtils.isDefined(_props.w) ? _props.w : props._w;
                props._h = helperUtils.isDefined(_props.h) ? _props.h : props._h;
                props._a = helperUtils.isDefined(_props.a) ? _props.a : props._a;
                props._v = helperUtils.isDefined(_props.v) ? _props.v : props._v;
            },
            ___pullOutInit: () => _init,
            ___pullOutProps: () => ({ x: props._x, y: props._y, w: props._w, h: props._h, a: props._a, v: props._v }),
            ___pullOutRawProps: () => ({ ...props }),
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
        return ____returns;
    }

    let __spriteAutoAdder = 0;
    const __getSymbolName = function () {
        const serializedID = String(Math.random()).substr(2);
        return `$symbol_${__spriteAutoAdder++}_${serializedID}`;
    }
    const __SpriteSheet = function (_props = { w: 100, h: 100, cut: false, props: [] }, ..._definitions) {
        return new Promise(async (resolve, reject) => {
            let __spriteList = [];
            let scanvas, sctx, canvas, ctx;

            const { w, h, cut } = _props;

            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            canvas.width = w;
            canvas.height = h;

            async function cutSprite(_canvas, _w, _h, _cut) {
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
                            _w: canvas.width,
                            _h: canvas.height
                        }
                    });

                    const _name = __getSymbolName();
                    __library.sprites[_name] = returns;
                    __spriteList.push(_name);
                } else {
                    for (let sW = 0; sW < _w; sW += w) {
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
                                _w: canvas.width,
                                _h: canvas.height
                            }
                        });

                        const _name = __getSymbolName();
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
                    const sW = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop.w) ? prop.w : w) : w;
                    const sH = helperUtils.isDefined(prop) ? (helperUtils.isDefined(prop.h) ? prop.h : h) : h;
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

    const __Sprite = function (_props = { w: 100, h: 100 }, _definition) {
        return new Promise(async (resolve, reject) => {
            let canvas, ctx;
            if (!helperUtils.isFunction(_definition)) {
                canvas = __defaults.sprite;
                ctx = canvas.getContext('2d');
            } else {
                const { w = 100, h = 100 } = _props;
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('2d');
                canvas.width = w;
                canvas.height = h;

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
                    _w: canvas.width,
                    _h: canvas.height
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


    const createLoop = function (_func, _int) {
        return __loopManager.addLoop(_func, _int);
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
    }

    const __render = function () {
        if (properties.scene !== "")
            __library.scenes[properties.scene].render();
    }
    const __clearScreen = function () {
        __screen.ctx.clearRect(0, 0, __screen.canvas.width, __screen.canvas.height);
        __screen.ctx.fillStyle = "#863"
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
    const run = function (_interval) {
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

        //stop scenes

        if (properties.scene !== "")
            __library.scenes[properties.scene].stop();
    }
    const ____returns = new __constructors.Engine({
        properties,
        helperUtils,
        state,
        changeState,
        useState,
        setState,
        createPrefab,
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

        run,
        stop
    });

    Object.defineProperties(____returns.__proto__, {
        FPS: {
            get: function () { return runitor.fps },
            enumerable: false,
            configurable: true
        },
        SPF: {
            get: function () { return runitor.spf },
            enumerable: false,
            configurable: true
        }
    });

    const ____initFunc = function () {
        return ____returns;
    }
    const ____thisObj = new ____initFunc();
    const ____engine = ____thisObj;
    return ____returns;
}