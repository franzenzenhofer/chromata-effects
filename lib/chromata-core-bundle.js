/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(1);

	var _utils2 = _interopRequireDefault(_utils);

	var _pathFinder = __webpack_require__(2);

	var _pathFinder2 = _interopRequireDefault(_pathFinder);

	var _pathRenderer = __webpack_require__(4);

	var _pathRenderer2 = _interopRequireDefault(_pathRenderer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Chromata = function () {
	    function Chromata(imageElement) {
	        var _this = this;

	        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        _classCallCheck(this, Chromata);

	        var renderCanvas = document.createElement('canvas'),
	            renderContext = renderCanvas.getContext('2d'),
	            sourceCanvas = document.createElement('canvas'),
	            sourceContext = sourceCanvas.getContext('2d'),
	            image = new Image(),
	            dimensions,
	            ready = false;

	        this.options = this._mergeOptions(options);

	        image.src = imageElement.src;
	        image.addEventListener('load', function () {
	            dimensions = _utils2.default._getOutputDimensions(imageElement, _this.options.outputSize);
	            sourceCanvas.width = renderCanvas.width = dimensions.width;
	            sourceCanvas.height = renderCanvas.height = dimensions.height;
	            sourceContext.drawImage(image, 0, 0, dimensions.width, dimensions.height);

	            _this.dimensions = dimensions;
	            _this.imageArray = _utils2.default._getImageArray(sourceContext);
	            _this.workingArray = _utils2.default._getWorkingArray(sourceContext);

	            ready = true;
	        });

	        this.loader = function (callback) {
	            if (!ready) {
	                setTimeout(function () {
	                    return _this.loader(callback);
	                }, 50);
	            } else {
	                callback();
	            }
	        };

	        this.imageArray = [];
	        this.sourceImageElement = imageElement;
	        this.sourceContext = sourceContext;
	        this.renderContext = renderContext;
	        this.isRunning = false;
	        this.iterationCount = 0;
	    }

	    /**
	     * Start the animation.
	     */


	    _createClass(Chromata, [{
	        key: 'start',
	        value: function start() {
	            var _this2 = this;

	            this.loader(function () {

	                _this2.isRunning = true;

	                if (typeof _this2._tick === 'undefined') {
	                    _this2._run();
	                } else {
	                    _this2._tick();
	                }
	            });
	        }

	        /**
	         * Stop the animation. Returns the current iteration count.
	         * @returns {number}
	         */

	    }, {
	        key: 'stop',
	        value: function stop() {
	            this.isRunning = false;
	            return this.iterationCount;
	        }

	        /**
	         * Start/stop the animation. If stopping, return the current iteration count.
	         * @returns {*}
	         */

	    }, {
	        key: 'toggle',
	        value: function toggle() {
	            if (this.isRunning) {
	                return this.stop();
	            } else {
	                return this.start();
	            }
	        }

	        /**
	         * Clear the canvas and set the animation back to the start.
	         */

	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.isRunning = false;
	            this._tick = undefined;
	            cancelAnimationFrame(this.raf);
	            this.renderContext.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
	            this.workingArray = _utils2.default._getWorkingArray(this.sourceContext);
	            this._removeRenderCanvas();
	        }

	        /**
	         * Merge any user-supplied config options with the defaults and perform some validation.
	         * @param options
	         * @private
	         */

	    }, {
	        key: '_mergeOptions',
	        value: function _mergeOptions(options) {

	            var defaults = {
	                colorMode: 'color',
	                compositeOperation: 'lighten',
	                iterationLimit: 0,
	                key: 'low',
	                lineWidth: 2,
	                lineMode: 'smooth',
	                origin: ['bottom'],
	                outputSize: 'original',
	                pathFinderCount: 30,
	                speed: 7,
	                turningAngle: Math.PI
	            };

	            var merged = {};

	            for (var prop in defaults) {
	                if (defaults.hasOwnProperty(prop)) {
	                    merged[prop] = options[prop] || defaults[prop];
	                }
	            }

	            // some validation
	            merged.origin = merged.origin.constructor === Array ? merged.origin : defaults.origin;
	            merged.pathFinderCount = this._limitToRange(merged.pathFinderCount, 1, 10000);
	            merged.lineWidth = this._limitToRange(merged.lineWidth, 1, 100);
	            merged.speed = this._limitToRange(merged.speed, 1, 100);
	            merged.turningAngle = this._limitToRange(merged.turningAngle, 0.1, 10);

	            return merged;
	        }
	    }, {
	        key: '_limitToRange',
	        value: function _limitToRange(val, low, high) {
	            return Math.min(Math.max(val, low), high);
	        }

	        /**
	         * Hide the source image element and append the render canvas directly after it in the DOM.
	         * @private
	         */

	    }, {
	        key: '_appendRenderCanvas',
	        value: function _appendRenderCanvas() {
	            var parentElement = this.sourceImageElement.parentNode;

	            this.sourceImageElement.style.display = 'none';
	            parentElement.insertBefore(this.renderContext.canvas, this.sourceImageElement.nextSibling);
	        }

	        /**
	         * Unhide the source image and remove the render canvas from the DOM.
	         * @private
	         */

	    }, {
	        key: '_removeRenderCanvas',
	        value: function _removeRenderCanvas() {
	            this.sourceImageElement.style.display = '';
	            this.renderContext.canvas.parentNode.removeChild(this.renderContext.canvas);
	        }

	        /**
	         * Set up the pathfinders and renderers and get the animation going.
	         * @private
	         */

	    }, {
	        key: '_run',
	        value: function _run() {
	            var _this3 = this;

	            var renderers = [],
	                pathFinders = this._initPathFinders(),
	                renderOptions = {
	                colorMode: this.options.colorMode,
	                lineWidth: this.options.lineWidth,
	                lineMode: this.options.lineMode,
	                speed: this.options.speed
	            };

	            this._appendRenderCanvas();

	            this.renderContext.globalCompositeOperation = this.options.compositeOperation;

	            pathFinders.forEach(function (pathFinder) {
	                renderers.push(new _pathRenderer2.default(_this3.renderContext, pathFinder, renderOptions));
	            });

	            this._tick = function () {

	                if (0 < _this3.options.iterationLimit && _this3.options.iterationLimit <= _this3.iterationCount) {
	                    _this3.isRunning = false;
	                    _this3.options.iterationLimit = 0;
	                }

	                renderers.forEach(function (renderer) {
	                    return renderer.drawNextLine();
	                });
	                _this3.iterationCount++;

	                if (_this3.isRunning) {
	                    _this3.raf = requestAnimationFrame(_this3._tick);
	                }
	            };

	            this._tick();
	        }

	        /**
	         * Create the pathfinders
	         * @returns {Array}
	         * @private
	         */

	    }, {
	        key: '_initPathFinders',
	        value: function _initPathFinders() {
	            var _this4 = this;

	            var pathFinders = [],
	                count = this.options.pathFinderCount,
	                origins = this.options.origin,
	                pathFindersPerOrigin = count / origins.length,
	                options = {
	                speed: this.options.speed,
	                turningAngle: this.options.turningAngle,
	                key: this.options.key
	            };

	            if (-1 < origins.indexOf('bottom')) {
	                this._seedBottom(pathFindersPerOrigin, pathFinders, options);
	            }
	            if (-1 < origins.indexOf('top')) {
	                this._seedTop(pathFindersPerOrigin, pathFinders, options);
	            }
	            if (-1 < origins.indexOf('left')) {
	                this._seedLeft(pathFindersPerOrigin, pathFinders, options);
	            }
	            if (-1 < origins.indexOf('right')) {
	                this._seedRight(pathFindersPerOrigin, pathFinders, options);
	            }

	            origins.forEach(function (origin) {
	                var matches = origin.match(/(\d{1,3})% (\d{1,3})%/);
	                if (matches) {
	                    _this4._seedPoint(pathFindersPerOrigin, pathFinders, options, matches[1], matches[2]);
	                }
	            });

	            return pathFinders;
	        }
	    }, {
	        key: '_seedTop',
	        value: function _seedTop(count, pathFinders, options) {
	            var _this5 = this;

	            var width = this.dimensions.width,
	                unit = width / count,
	                xPosFn = function xPosFn(i) {
	                return unit * i - unit / 2;
	            },
	                yPosFn = function yPosFn() {
	                return _this5.options.speed;
	            };

	            options.startingVelocity = [0, this.options.speed];
	            this._seedCreateLoop(count, pathFinders, xPosFn, yPosFn, options);
	        }
	    }, {
	        key: '_seedBottom',
	        value: function _seedBottom(count, pathFinders, options) {
	            var _this6 = this;

	            var width = this.dimensions.width,
	                height = this.dimensions.height,
	                unit = width / count,
	                xPosFn = function xPosFn(i) {
	                return unit * i - unit / 2;
	            },
	                yPosFn = function yPosFn() {
	                return height - _this6.options.speed;
	            };

	            options.startingVelocity = [0, -this.options.speed];
	            this._seedCreateLoop(count, pathFinders, xPosFn, yPosFn, options);
	        }
	    }, {
	        key: '_seedLeft',
	        value: function _seedLeft(count, pathFinders, options) {
	            var _this7 = this;

	            var height = this.dimensions.height,
	                unit = height / count,
	                xPosFn = function xPosFn() {
	                return _this7.options.speed;
	            },
	                yPosFn = function yPosFn(i) {
	                return unit * i - unit / 2;
	            };

	            options.startingVelocity = [this.options.speed, 0];
	            this._seedCreateLoop(count, pathFinders, xPosFn, yPosFn, options);
	        }
	    }, {
	        key: '_seedRight',
	        value: function _seedRight(count, pathFinders, options) {
	            var _this8 = this;

	            var width = this.dimensions.width,
	                height = this.dimensions.height,
	                unit = height / count,
	                xPosFn = function xPosFn() {
	                return width - _this8.options.speed;
	            },
	                yPosFn = function yPosFn(i) {
	                return unit * i - unit / 2;
	            };

	            options.startingVelocity = [-this.options.speed, 0];
	            this._seedCreateLoop(count, pathFinders, xPosFn, yPosFn, options);
	        }
	    }, {
	        key: '_seedPoint',
	        value: function _seedPoint(count, pathFinders, options, xPc, yPc) {
	            var xPos = Math.floor(this.dimensions.width * xPc / 100),
	                yPos = Math.floor(this.dimensions.height * yPc / 100);

	            for (var i = 1; i < count + 1; i++) {
	                var color = _utils2.default._indexToRgbString(i),
	                    direction = i % 4;

	                switch (direction) {
	                    case 0:
	                        options.startingVelocity = [-this.options.speed, 0];
	                        break;
	                    case 1:
	                        options.startingVelocity = [0, this.options.speed];
	                        break;
	                    case 2:
	                        options.startingVelocity = [this.options.speed, 0];
	                        break;
	                    case 3:
	                        options.startingVelocity = [0, -this.options.speed];
	                        break;
	                }

	                pathFinders.push(new _pathFinder2.default(this.imageArray, this.workingArray, color, xPos, yPos, options));
	            }
	        }
	    }, {
	        key: '_seedCreateLoop',
	        value: function _seedCreateLoop(count, pathFinders, xPosFn, yPosFn, options) {
	            for (var i = 1; i < count + 1; i++) {
	                var color = _utils2.default._indexToRgbString(i),
	                    xPos = xPosFn(i),
	                    yPos = yPosFn(i);

	                pathFinders.push(new _pathFinder2.default(this.imageArray, this.workingArray, color, xPos, yPos, options));
	            }
	        }
	    }]);

	    return Chromata;
	}();

	exports.default = Chromata;


	window.Chromata = Chromata;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Static utilities class containing helper functions
	 */
	var Utils = function () {
	    function Utils() {
	        _classCallCheck(this, Utils);
	    }

	    _createClass(Utils, null, [{
	        key: '_indexToRgbString',
	        value: function _indexToRgbString(i) {
	            var color;
	            if (i % 3 === 0) {
	                color = '#0000ff';
	            } else if (i % 2 === 0) {
	                color = '#00ff00';
	            } else {
	                color = '#ff0000';
	            }
	            return color;
	        }

	        /**
	         * Get a 2d array (width x height) representing each pixel of the source as an [r,g,b,a] array.
	         * @param sourceContext
	         */

	    }, {
	        key: '_getImageArray',
	        value: function _getImageArray(sourceContext) {
	            var width = sourceContext.canvas.width,
	                height = sourceContext.canvas.height,
	                imageData = sourceContext.getImageData(0, 0, width, height),
	                imageArray = [];

	            for (var row = 0; row < height; row++) {

	                imageArray.push([]);

	                for (var col = 0; col < width; col++) {
	                    var pixel = [],
	                        position = row * width * 4 + col * 4;

	                    for (var part = 0; part < 4; part++) {
	                        pixel[part] = imageData.data[position + part];
	                    }

	                    imageArray[row].push(pixel);
	                }
	            }

	            return imageArray;
	        }

	        /**
	         * Create a 2d array with the same dimensions as the image, but filled with "null" pixels that
	         * will get filled in when a pathFinder visits each pixel. Allows multiple pathFinders to
	         * communicate which pixels have been covered.
	         *
	         * @param sourceContext
	         * @returns {Array}
	         * @private
	         */

	    }, {
	        key: '_getWorkingArray',
	        value: function _getWorkingArray(sourceContext) {
	            var width = sourceContext.canvas.width,
	                height = sourceContext.canvas.height,
	                workingArray = [];

	            for (var row = 0; row < height; row++) {

	                workingArray.push([]);

	                for (var col = 0; col < width; col++) {
	                    workingArray[row].push([false, false, false]);
	                }
	            }

	            return workingArray;
	        }
	    }, {
	        key: '_getOutputDimensions',
	        value: function _getOutputDimensions(image, size) {

	            var width, height;

	            if (size === 'original') {
	                width = image.width;
	                height = image.height;
	            } else {
	                var container = image.parentNode,
	                    ratioW = container.clientWidth / image.width,
	                    ratioH = container.clientHeight / image.height,
	                    smallerRatio = ratioH <= ratioW ? ratioH : ratioW;

	                width = image.width * smallerRatio;
	                height = image.height * smallerRatio;
	            }

	            return {
	                width: width,
	                height: height
	            };
	        }
	    }]);

	    return Utils;
	}();

	exports.default = Utils;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _pathQueue = __webpack_require__(3);

	var _pathQueue2 = _interopRequireDefault(_pathQueue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MAX = 255;

	var PathFinder = function () {
	    function PathFinder(pixelArray, workingArray, targetColor) {
	        var initX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	        var initY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	        var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

	        _classCallCheck(this, PathFinder);

	        this.pixelArray = pixelArray;
	        this.workingArray = workingArray;
	        this.arrayWidth = pixelArray[0].length;
	        this.arrayHeight = pixelArray.length;
	        this.x = Math.round(initX);
	        this.y = Math.round(initY);
	        this.options = options;
	        this.pathQueue = new _pathQueue2.default(10);
	        this.velocity = options.startingVelocity;

	        this.targetColor = typeof targetColor === 'string' ? this._hexToRgb(targetColor) : targetColor;
	        this.rgbIndex = this._getRgbIndex(this.targetColor);

	        if (this.options.key === 'low') {
	            this.comparatorFn = function (distance, closest) {
	                return 0 < distance && distance < closest;
	            };
	        } else {
	            this.comparatorFn = function (distance, closest) {
	                return closest < distance && distance < MAX;
	            };
	        }
	    }

	    /**
	     * Get next coordinate point in path.
	     *
	     * @returns {[int, int, int]}
	     */


	    _createClass(PathFinder, [{
	        key: 'getNextPoint',
	        value: function getNextPoint() {

	            var result,
	                i = 0,
	                limit = 5; // prevent an infinite loop

	            do {
	                result = this._getNextPixel();
	                i++;
	            } while (i <= limit && result.isPristine === false);

	            return result.nextPixel;
	        }

	        /**
	         * Algorithm for finding the next point by picking the closest match out of an arc-shaped array of possible pixels
	         * arranged pointing in the direction of velocity.
	         *
	         * @returns {{nextPixel: [int, int, int], isPristine: boolean}}
	         * @private
	         */

	    }, {
	        key: '_getNextPixel',
	        value: function _getNextPixel() {
	            var theta = this._getVelocityAngle(),
	                isPristine,
	                closestColor = this.options.key === 'low' ? 100000 : 0,
	                nextPixel,
	                defaultNextPixel,
	                arcSize = this.options.turningAngle,
	                radius = Math.round(Math.sqrt(Math.pow(this.velocity[0], 2) + Math.pow(this.velocity[1], 2))),
	                sampleSize = 4; // how many surrounding pixels to test for next point

	            for (var angle = theta - arcSize / 2, deviance = -sampleSize / 2; angle <= theta + arcSize / 2; angle += arcSize / sampleSize, deviance++) {
	                var x = this.x + Math.round(radius * Math.cos(angle)),
	                    y = this.y + Math.round(radius * Math.sin(angle)),
	                    colorDistance = MAX;

	                if (this._isInRange(x, y)) {

	                    var visited = this.workingArray[y][x][this.rgbIndex],
	                        currentPixel = this.pixelArray[y][x],
	                        alpha = currentPixel[3];

	                    colorDistance = this._getColorDistance(currentPixel);

	                    if (this.comparatorFn(colorDistance, closestColor) && !visited && alpha === MAX) {
	                        nextPixel = [x, y, MAX - colorDistance];
	                        closestColor = colorDistance;
	                    }
	                }

	                if (deviance === 0) {
	                    var pa = this.pixelArray;
	                    if (pa[y] && pa[y][x] && pa[y][x][3] === MAX) {
	                        defaultNextPixel = [x, y, MAX - colorDistance];
	                    } else {
	                        defaultNextPixel = this.pathQueue.get(-2);
	                    }
	                }
	            }

	            isPristine = typeof nextPixel !== 'undefined';
	            nextPixel = nextPixel || defaultNextPixel;

	            if (nextPixel) {
	                this.velocity = [nextPixel[0] - this.x, nextPixel[1] - this.y];
	                this.y = nextPixel[1];
	                this.x = nextPixel[0];
	                this._updateWorkingArray(nextPixel[1], nextPixel[0]);
	                this.pathQueue.put(nextPixel);
	            }

	            return {
	                nextPixel: nextPixel,
	                isPristine: isPristine
	            };
	        }

	        /**
	         * Get an [r, g, b] array of the target color.
	         * @returns {{r: *, g: *, b: *}}
	         */

	    }, {
	        key: 'getColor',
	        value: function getColor() {
	            return {
	                r: this.targetColor[0],
	                g: this.targetColor[1],
	                b: this.targetColor[2]
	            };
	        }

	        /**
	         * Get the angle indicated by the velocity vector, correcting for the case that the angle would
	         * take the pathfinder off the image canvas, in which case the angle will be set towards the
	         * centre of the canvas.
	         *
	         * @returns {*}
	         * @private
	         */

	    }, {
	        key: '_getVelocityAngle',
	        value: function _getVelocityAngle() {
	            var projectedX = this.x + this.velocity[0],
	                projectedY = this.y + this.velocity[1],
	                margin = this.options.speed,
	                dy = this.y + this.velocity[1] - this.y,
	                dx = this.x + this.velocity[0] - this.x,
	                angle;

	            // has it gone out of bounds on the x axis?
	            if (projectedX <= margin || this.arrayWidth - margin <= projectedX) {
	                dx *= -1;
	            }

	            // has it gone out of bounds on the y axis?
	            if (projectedY <= margin || this.arrayHeight - margin <= projectedY) {
	                dy *= -1;
	            }

	            angle = Math.atan2(dy, dx);
	            return angle;
	        }

	        /**
	         * From http://stackoverflow.com/a/5624139/772859
	         * @param hex
	         * @returns {{r: Number, g: Number, b: Number}}
	         * @private
	         */

	    }, {
	        key: '_hexToRgb',
	        value: function _hexToRgb(hex) {
	            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
	                return r + r + g + g + b + b;
	            });

	            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	            return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
	        }
	    }, {
	        key: '_getColorDistance',
	        value: function _getColorDistance(pixel) {
	            return MAX - pixel[this.rgbIndex];
	        }

	        /**
	         * Return true if the x, y points lie within the image dimensions.
	         * @param x
	         * @param y
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isInRange',
	        value: function _isInRange(x, y) {
	            return 0 < x && x < this.arrayWidth && 0 < y && y < this.arrayHeight;
	        }
	    }, {
	        key: '_updateWorkingArray',
	        value: function _updateWorkingArray(row, col) {
	            this.workingArray[row][col][this.rgbIndex] = true;
	        }
	    }, {
	        key: '_getRgbIndex',
	        value: function _getRgbIndex(targetColorArray) {
	            var i;
	            for (i = 0; i < 2; i++) {
	                if (targetColorArray[i] !== 0) {
	                    break;
	                }
	            }

	            return i;
	        }
	    }]);

	    return PathFinder;
	}();

	exports.default = PathFinder;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Implementation of a queue of a fixed size.
	 */
	var PathQueue = function () {
	    function PathQueue(size) {
	        _classCallCheck(this, PathQueue);

	        this.queue = [];
	        this.size = size;
	    }

	    /**
	     * Put a new item in the queue. If this causes the queue to exceed its size limit, the oldest
	     * item will be discarded.
	     * @param item
	     */


	    _createClass(PathQueue, [{
	        key: "put",
	        value: function put(item) {
	            this.queue.push(item);
	            if (this.size < this.queue.length) {
	                this.queue.shift();
	            }
	        }

	        /**
	         * Get an item from the queue, specified by index. 0 gets the oldest item in the queue, 1 the second oldest etc.
	         * -1 gets the newest item, -2 the second newest etc.
	         *
	         * @param index
	         * @returns {*}
	         */

	    }, {
	        key: "get",
	        value: function get() {
	            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	            var length = this.queue.length;
	            if (0 <= index && index <= length) {
	                return this.queue[index];
	            } else if (index < 0 && Math.abs(index) <= length) {
	                return this.queue[length + index];
	            } else {
	                return undefined;
	            }
	        }
	    }, {
	        key: "contains",
	        value: function contains(item) {
	            var matches = this.queue.filter(function (point) {
	                return point[0] === item[0] && point[1] === item[1];
	            });

	            return 0 < matches.length;
	        }
	    }]);

	    return PathQueue;
	}();

	exports.default = PathQueue;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Renders the points created by a Pathfinder
	 */
	var PathRenderer = function () {
	    function PathRenderer(context, pathFinder, options) {
	        _classCallCheck(this, PathRenderer);

	        this.context = context;
	        this.pathFinder = pathFinder;
	        this.options = options;
	        this.color = pathFinder.getColor();
	    }

	    _createClass(PathRenderer, [{
	        key: 'drawNextLine',
	        value: function drawNextLine() {
	            if (this.options.lineMode === 'smooth') {
	                this._drawLineSmooth();
	            } else if (this.options.lineMode === 'square') {
	                this._drawLineSquare();
	            } else {
	                this._drawPoint();
	            }
	        }
	    }, {
	        key: '_drawLineSmooth',
	        value: function _drawLineSmooth() {
	            var midX,
	                midY,
	                midColor,
	                lineLength,
	                nextPoint = this.pathFinder.getNextPoint(this.context);

	            if (nextPoint) {

	                if (typeof this.currentPoint === 'undefined') {
	                    this.currentPoint = nextPoint;
	                }
	                if (typeof this.controlPoint === 'undefined') {
	                    this.controlPoint = nextPoint;
	                }

	                midX = Math.round((this.controlPoint[0] + nextPoint[0]) / 2);
	                midY = Math.round((this.controlPoint[1] + nextPoint[1]) / 2);
	                midColor = Math.floor((this.currentPoint[2] + nextPoint[2]) / 2);
	                lineLength = this._getLineLength(this.currentPoint, nextPoint);

	                if (lineLength <= this.options.speed * 3) {
	                    var grad = void 0,
	                        startColorValue = this.currentPoint[2],
	                        endColorValue = nextPoint[2];

	                    grad = this._createGradient(this.currentPoint, nextPoint, startColorValue, endColorValue);
	                    this.context.strokeStyle = grad;

	                    this.context.lineWidth = this.options.lineWidth;
	                    this.context.lineCap = 'round';
	                    this.context.beginPath();

	                    this.context.moveTo(this.currentPoint[0], this.currentPoint[1]);
	                    this.context.quadraticCurveTo(this.controlPoint[0], this.controlPoint[1], midX, midY);
	                    this.context.stroke();
	                }

	                this.currentPoint = [midX, midY, midColor];
	                this.controlPoint = nextPoint;
	            }
	        }
	    }, {
	        key: '_drawLineSquare',
	        value: function _drawLineSquare() {
	            var lineLength,
	                nextPoint = this.pathFinder.getNextPoint(this.context);

	            if (nextPoint) {

	                if (typeof this.currentPoint === 'undefined') {
	                    this.currentPoint = nextPoint;
	                }

	                lineLength = this._getLineLength(this.currentPoint, nextPoint);

	                if (lineLength <= this.options.speed + 1) {
	                    var grad = void 0,
	                        startColorValue = this.currentPoint[2],
	                        endColorValue = nextPoint[2];

	                    grad = this._createGradient(this.currentPoint, nextPoint, startColorValue, endColorValue);

	                    this.context.strokeStyle = grad;
	                    this.context.lineWidth = this.options.lineWidth;
	                    this.context.lineCap = 'round';
	                    this.context.beginPath();

	                    this.context.moveTo(this.currentPoint[0], this.currentPoint[1]);
	                    this.context.lineTo(nextPoint[0], nextPoint[1]);
	                    this.context.stroke();
	                }
	                this.currentPoint = nextPoint;
	            }
	        }
	    }, {
	        key: '_drawPoint',
	        value: function _drawPoint() {
	            var lineLength,
	                nextPoint = this.pathFinder.getNextPoint(this.context);

	            if (nextPoint) {

	                if (typeof this.currentPoint === 'undefined') {
	                    this.currentPoint = nextPoint;
	                }

	                lineLength = this._getLineLength(this.currentPoint, nextPoint);

	                if (lineLength >= this.options.speed * 2) {
	                    this.context.beginPath();

	                    this.context.arc(nextPoint[0], nextPoint[1], this.options.lineWidth, 0, 2 * Math.PI, false);
	                    this.context.fillStyle = this._getStrokeColor(nextPoint[2]);
	                    this.context.fill();

	                    this.currentPoint = nextPoint;
	                }
	            }
	        }
	    }, {
	        key: '_getLineLength',
	        value: function _getLineLength(p1, p2) {
	            var dx = p2[0] - p1[0];
	            var dy = p2[1] - p1[1];
	            return Math.round(Math.sqrt(dx * dx + dy * dy));
	        }
	    }, {
	        key: '_createGradient',
	        value: function _createGradient(p1, p2, color1, color2) {
	            var grad = this.context.createLinearGradient(p1[0], p1[1], p2[0], p2[1]);
	            grad.addColorStop(0, this._getStrokeColor(color1));
	            grad.addColorStop(1, this._getStrokeColor(color2));
	            return grad;
	        }

	        /**
	         * Get an rgba color string based on the color value and the pathRenderer's color and color mode.
	         *
	         * @param colorValue
	         * @returns {*}
	         * @private
	         */

	    }, {
	        key: '_getStrokeColor',
	        value: function _getStrokeColor(colorValue) {
	            var colorString;

	            if (this.options.colorMode === 'color') {
	                colorString = 'rgba(' + (this.color.r !== 0 ? colorValue : 0) + ', ' + (this.color.g !== 0 ? colorValue : 0) + ', ' + (this.color.b !== 0 ? colorValue : 0) + ', ' + 1 + ')';
	            } else {
	                // greyscale
	                colorString = 'rgba(' + colorValue + ', ' + colorValue + ', ' + colorValue + ', ' + 1 + ')';
	            }

	            return colorString;
	        }
	    }]);

	    return PathRenderer;
	}();

	exports.default = PathRenderer;

/***/ }
/******/ ]);