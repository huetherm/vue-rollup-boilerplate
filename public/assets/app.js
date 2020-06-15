
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
  'use strict';

  /*!
   * Vue.js v2.6.11
   * (c) 2014-2019 Evan You
   * Released under the MIT License.
   */
  /*  */

  var emptyObject = Object.freeze({});

  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef (v) {
    return v === undefined || v === null
  }

  function isDef (v) {
    return v !== undefined && v !== null
  }

  function isTrue (v) {
    return v === true
  }

  function isFalse (v) {
    return v === false
  }

  /**
   * Check if value is primitive.
   */
  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  var _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex (val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  function isPromise (val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString (val) {
    return val == null
      ? ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if an attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array.
   */
  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }

  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop (a, b, c) {}

  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };

  /* eslint-enable no-unused-vars */

  /**
   * Return the same value.
   */
  var identity = function (_) { return _; };

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
  ];

  /*  */



  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "production" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "production" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  var isPhantomJS = UA && /phantomjs/.test(UA);
  var isFF = UA && UA.match(/firefox\/(\d+)/);

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get () {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = /*@__PURE__*/(function () {
      function Set () {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has (key) {
        return this.set[key] === true
      };
      Set.prototype.add = function add (key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear () {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop;

  /*  */

  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  /*  */

  var VNode = function VNode (
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties( VNode.prototype, prototypeAccessors );

  var createEmptyVNode = function (text) {
    if ( text === void 0 ) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;

  function toggleObserving (value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;

    var keys = hasSymbol
      ? Reflect.ownKeys(from)
      : Object.keys(from);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      // in case the object is already observed...
      if (key === '__ob__') { continue }
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (
        toVal !== fromVal &&
        isPlainObject(toVal) &&
        isPlainObject(fromVal)
      ) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    var res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal;
    return res
      ? dedupeHooks(res)
      : res
  }

  function dedupeHooks (hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }
    return res
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (
    parentVal,
    childVal,
    vm,
    key
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    if (childVal && "production" !== 'production') {
      assertObjectType(key, childVal);
    }
    if (!parentVal) { return childVal }
    var ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) { extend(ret, childVal); }
    return ret
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject (options, vm) {
    var inject = options.inject;
    if (!inject) { return }
    var normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def$$1 = dirs[key];
        if (typeof def$$1 === 'function') {
          dirs[key] = { bind: def$$1, update: def$$1 };
        }
      }
    }
  }

  function assertObjectType (name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".");
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child);
    normalizeInject(child);
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }
      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
    }

    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) { return assets[id] }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    return res
  }

  /*  */



  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        var stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType (a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex (type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  /*  */

  function handleError (err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
      if (vm) {
        var cur = vm;
        while ((cur = cur.$parent)) {
          var hooks = cur.$options.errorCaptured;
          if (hooks) {
            for (var i = 0; i < hooks.length; i++) {
              try {
                var capture = hooks[i].call(cur, err, vm, info) === false;
                if (capture) { return }
              } catch (e) {
                globalHandleError(e, cur, 'errorCaptured hook');
              }
            }
          }
        }
      }
      globalHandleError(err, vm, info);
    } finally {
      popTarget();
    }
  }

  function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }

  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        // if the user intentionally throws the original error in the handler,
        // do not log it twice
        if (e !== err) {
          logError(e);
        }
      }
    }
    logError(err);
  }

  function logError (err, vm, info) {
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */

  var isUsingMicroTask = false;

  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }

  /*  */

  var seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    }
  });

  function createFnInvoker (fns, vm) {
    function invoker () {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    createOnceHandler,
    vm
  ) {
    var name, def$$1, cur, old, event;
    for (name in on) {
      def$$1 = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (isUndef(cur)) ; else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }
        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }
        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook () {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData (
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren (children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren (children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren (children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key]);
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // #6574 in case the inject object is observed...
        if (key === '__ob__') { continue }
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          }
        }
      }
      return result
    }
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace (node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  /*  */

  function normalizeScopedSlots (
    slots,
    normalSlots,
    prevSlots
  ) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
    var key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (var key$1 in slots) {
        if (slots[key$1] && key$1[0] !== '$') {
          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (var key$2 in normalSlots) {
      if (!(key$2 in res)) {
        res[key$2] = proxyNormalSlot(normalSlots, key$2);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }

  function normalizeScopedSlot(normalSlots, key, fn) {
    var normalized = function () {
      var res = arguments.length ? fn.apply(null, arguments) : fn({});
      res = res && typeof res === 'object' && !Array.isArray(res)
        ? [res] // single vnode
        : normalizeChildren(res);
      return res && (
        res.length === 0 ||
        (res.length === 1 && res[0].isComment) // #9658
      ) ? undefined
        : res
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
      Object.defineProperty(normalSlots, key, {
        get: normalized,
        enumerable: true,
        configurable: true
      });
    }
    return normalized
  }

  function proxyNormalSlot(slots, key) {
    return function () { return slots[key]; }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        var iterator = val[Symbol.iterator]();
        var result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot (
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      nodes = this.$slots[name] || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id) || identity
  }

  /*  */

  function isKeyNotMatch (expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes (
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps (
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) ; else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function ( key ) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          var camelizedKey = camelize(key);
          var hyphenatedKey = hyphenate(key);
          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop( key );
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic (
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic (
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners (data, value) {
    if (value) {
      if (!isPlainObject(value)) ; else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function resolveScopedSlots (
    fns, // see flow/vnode
    res,
    // the following are added in 2.6
    hasDynamicKeys,
    contentHashKey
  ) {
    res = res || { $stable: !hasDynamicKeys };
    for (var i = 0; i < fns.length; i++) {
      var slot = fns[i];
      if (Array.isArray(slot)) {
        resolveScopedSlots(slot, res, hasDynamicKeys);
      } else if (slot) {
        // marker for reverse proxying v-slot without scope on this.$slots
        if (slot.proxy) {
          slot.fn.proxy = true;
        }
        res[slot.key] = slot.fn;
      }
    }
    if (contentHashKey) {
      (res).$key = contentHashKey;
    }
    return res
  }

  /*  */

  function bindDynamicKeys (baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
      var key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      }
    }
    return baseObj
  }

  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier (value, symbol) {
    return typeof value === 'string' ? symbol + value : value
  }

  /*  */

  function installRenderHelpers (target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  /*  */

  function FunctionalRenderContext (
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var this$1 = this;

    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () {
      if (!this$1.$slots) {
        normalizeScopedSlots(
          data.scopedSlots,
          this$1.$slots = resolveSlots(children, parent)
        );
      }
      return this$1.$slots
    };

    Object.defineProperty(this, 'scopedSlots', ({
      enumerable: true,
      get: function get () {
        return normalizeScopedSlots(data.scopedSlots, this.slots())
      }
    }));

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps (to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  /*  */

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init (vnode, hydrating) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch: function prepatch (oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert: function insert (vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy (vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent // activeInstance in lifecycle state
  ) {
    var options = {
      _isComponent: true,
      _parentVnode: vnode,
      parent: parent
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks (data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var existing = hooks[key];
      var toMerge = componentVNodeHooks[key];
      if (existing !== toMerge && !(existing && existing._merged)) {
        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
      }
    }
  }

  function mergeHook$1 (f1, f2) {
    var merged = function (a, b) {
      // flow complains about extra args which is why we use any
      f1(a, b);
      f2(a, b);
    };
    merged._merged = true;
    return merged
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel (options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'
    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS (vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings (data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
    }
  }

  var currentRenderingInstance = null;

  function renderMixin (Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        // There's no need to maintain a stack because all render fns are called
        // separately from one another. Nested component's render fns are called
        // when parent component is patched.
        currentRenderingInstance = vm;
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it
      if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0];
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  /*  */

  function ensureCtor (comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder (
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent (
    factory,
    baseCtor
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
      // already pending
      factory.owners.push(owner);
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (owner && !isDef(factory.owners)) {
      var owners = factory.owners = [owner];
      var sync = true;
      var timerLoading = null;
      var timerTimeout = null

      ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

      var forceRender = function (renderCompleted) {
        for (var i = 0, l = owners.length; i < l; i++) {
          (owners[i]).$forceUpdate();
        }

        if (renderCompleted) {
          owners.length = 0;
          if (timerLoading !== null) {
            clearTimeout(timerLoading);
            timerLoading = null;
          }
          if (timerTimeout !== null) {
            clearTimeout(timerTimeout);
            timerTimeout = null;
          }
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender(true);
        } else {
          owners.length = 0;
        }
      });

      var reject = once(function (reason) {
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender(true);
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (isPromise(res)) {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              timerLoading = setTimeout(function () {
                timerLoading = null;
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender(false);
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            timerTimeout = setTimeout(function () {
              timerTimeout = null;
              if (isUndef(factory.resolved)) {
                reject(
                   null
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add (event, fn) {
    target.$on(event, fn);
  }

  function remove$1 (event, fn) {
    target.$off(event, fn);
  }

  function createOnceHandler (event, fn) {
    var _target = target;
    return function onceHandler () {
      var res = fn.apply(null, arguments);
      if (res !== null) {
        _target.$off(event, onceHandler);
      }
    }
  }

  function updateComponentListeners (
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
    target = undefined;
  }

  function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          vm.$off(event[i$1], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        var info = "event handler for \"" + event + "\"";
        for (var i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }

  /*  */

  var activeInstance = null;

  function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function () {
      activeInstance = prevActiveInstance;
    }
  }

  function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance();
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.

    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm.$scopedSlots;
    var hasDynamicScopedSlot = !!(
      (newScopedSlots && !newScopedSlots.$stable) ||
      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
    );

    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    var needsForceUpdate = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      hasDynamicScopedSlot
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }
  }

  function isInInactiveTree (vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp.
  var getNow = Date.now;

  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
    var performance$1 = window.performance;
    if (
      performance$1 &&
      typeof performance$1.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is
      // smaller than it, it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listener timestamps as
      // well.
      getNow = function () { return performance$1.now(); };
    }
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow();
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      if (watcher.before) {
        watcher.before();
      }
      id = watcher.id;
      has[id] = null;
      watcher.run();
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks (queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent (vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks (queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */



  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression =  '';
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function ( key ) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        defineReactive$$1(props, key, value);
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop( key );
    toggleObserving(true);
  }

  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      if (props && hasOwn(props, key)) ; else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }

  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () { return this._data };
    var propsDef = {};
    propsDef.get = function () { return this._props };
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
        }
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  /*  */

  var uid$3 = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        vm._renderProxy = vm;
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions (Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = latest[key];
      }
    }
    return modified
  }

  function Vue (options) {
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name;

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1 (Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1 (Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  /*  */



  function getComponentName (opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches (pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache (keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry (
    cache,
    key,
    keys,
    current
  ) {
    var cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  var patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created: function created () {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed: function destroyed () {
      for (var key in this.cache) {
        pruneCacheEntry(this.cache, key, this.keys);
      }
    },

    mounted: function mounted () {
      var this$1 = this;

      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    render: function render () {
      var slot = this.$slots.default;
      var vnode = getFirstComponentChild(slot);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        var ref$1 = this;
        var cache = ref$1.cache;
        var keys = ref$1.keys;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    // 2.6 explicit observable API
    Vue.observable = function (obj) {
      observe(obj);
      return obj
    };

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get () {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.6.11';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

  var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false'
      ? 'false'
      // allow arbitrary string value for contenteditable
      : key === 'contenteditable' && isValidContentEditableValue(value)
        ? value
        : 'true'
  };

  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass (
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray (value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) { res += ' '; }
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject (value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) { res += ' '; }
        res += key;
      }
    }
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function setStyleScope (node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction (backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove$$1 () {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1
    }

    function removeNode (el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {

        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          insert(parentElm, vnode.elm, refElm);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert (parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (nodeOps.parentNode(ref$$1) === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable (vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) { i.create(emptyNode, vnode); }
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook (vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function findIdxInOld (node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    function patchVnode (
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
    ) {
      if (oldVnode === vnode) {
        return
      }

      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
        return
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm = nodeOps.parentNode(oldElm);

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm)) {
            removeVnodes([oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update (oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, convertEnumeratedValue(key, value));
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr (el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && value !== '' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  /*  */

  /*  */

  /*  */

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents (on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler$1 (event, handler, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler () {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

  function add$1 (
    name,
    handler,
    capture,
    passive
  ) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
      var attachedTimestamp = currentFlushTimestamp;
      var original = handler;
      handler = original._wrapper = function (e) {
        if (
          // no bubbling, should always fire.
          // this is just a safety net in case event.timeStamp is unreliable in
          // certain weird environments...
          e.target === e.currentTarget ||
          // event is fired after handler attachment
          e.timeStamp >= attachedTimestamp ||
          // bail for environments that have buggy event.timeStamp implementations
          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
          // #9681 QtWebEngine event.timeStamp is negative value
          e.timeStamp <= 0 ||
          // #9448 bail if event is fired in another document in a multi-page
          // electron/nw.js app, since event.timeStamp will be using a different
          // starting reference
          e.target.ownerDocument !== document
        ) {
          return original.apply(this, arguments)
        }
      };
    }
    target$1.addEventListener(
      name,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2 (
    name,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      name,
      handler._wrapper || handler,
      capture
    );
  }

  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  var svgContainer;

  function updateDOMProps (oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (!(key in props)) {
        elm[key] = '';
      }
    }

    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) { vnode.children.length = 0; }
        if (cur === oldProps[key]) { continue }
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value' && elm.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
        // IE doesn't support innerHTML for SVG elements
        svgContainer = svgContainer || document.createElement('div');
        svgContainer.innerHTML = "<svg>" + cur + "</svg>";
        var svg = svgContainer.firstChild;
        while (elm.firstChild) {
          elm.removeChild(elm.firstChild);
        }
        while (svg.firstChild) {
          elm.appendChild(svg.firstChild);
        }
      } else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecesarry `checked` update.
        cur !== oldProps[key]
      ) {
        // some property updates can throw
        // e.g. `value` on <progress> w/ non-finite value
        try {
          elm[key] = cur;
        } catch (e) {}
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue (elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty (elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers (elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData (data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding (bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle (vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  var whitespaceRE = /\s+/;

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition (def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame (fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs (s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /*  */

  function enter (vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show && el.parentNode) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  function isValidDuration (val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength (fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter (_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1 (vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var directive = {
    inserted: function inserted (el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    actuallySetSelected(el, binding);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding);
      }, 0);
    }
  }

  function actuallySetSelected (el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind (el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update (el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind (
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show: show
  };

  /*  */

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder (h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

  var isVShowDirective = function (d) { return d.name === 'show'; };

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render (h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(isNotTextNode);
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      var mode = this.mode;

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    beforeMount: function beforeMount () {
      var this$1 = this;

      var update = this._update;
      this._update = function (vnode, hydrating) {
        var restoreActiveInstance = setActiveInstance(this$1);
        // force removing pass
        this$1.__patch__(
          this$1._vnode,
          this$1.kept,
          false, // hydrating
          true // removeOnly (!important, avoids unnecessary moves)
        );
        this$1._vnode = this$1.kept;
        restoreActiveInstance();
        update.call(this$1, vnode, hydrating);
      };
    },

    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    updated: function updated () {
      var children = this.prevChildren;
      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (e && e.target !== el) {
              return
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        }
      }
    }, 0);
  }

  function functionalThemeClasses(context) {
    const vm = { ...context.props,
      ...context.injections
    };
    const isDark = Themeable.options.computed.isDark.call(vm);
    return Themeable.options.computed.themeClasses.call({
      isDark
    });
  }
  /* @vue/component */

  const Themeable = Vue.extend().extend({
    name: 'themeable',

    provide() {
      return {
        theme: this.themeableProvide
      };
    },

    inject: {
      theme: {
        default: {
          isDark: false
        }
      }
    },
    props: {
      dark: {
        type: Boolean,
        default: null
      },
      light: {
        type: Boolean,
        default: null
      }
    },

    data() {
      return {
        themeableProvide: {
          isDark: false
        }
      };
    },

    computed: {
      appIsDark() {
        return this.$vuetify.theme.dark || false;
      },

      isDark() {
        if (this.dark === true) {
          // explicitly dark
          return true;
        } else if (this.light === true) {
          // explicitly light
          return false;
        } else {
          // inherit from parent, or default false if there is none
          return this.theme.isDark;
        }
      },

      themeClasses() {
        return {
          'theme--dark': this.isDark,
          'theme--light': !this.isDark
        };
      },

      /** Used by menus and dialogs, inherits from v-app instead of the parent */
      rootIsDark() {
        if (this.dark === true) {
          // explicitly dark
          return true;
        } else if (this.light === true) {
          // explicitly light
          return false;
        } else {
          // inherit from v-app
          return this.appIsDark;
        }
      },

      rootThemeClasses() {
        return {
          'theme--dark': this.rootIsDark,
          'theme--light': !this.rootIsDark
        };
      }

    },
    watch: {
      isDark: {
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.themeableProvide.isDark = this.isDark;
          }
        },

        immediate: true
      }
    }
  });

  /* eslint-disable max-len, import/export, no-use-before-define */
  function mixins(...args) {
    return Vue.extend({
      mixins: args
    });
  }

  // Styles
  /* @vue/component */

  var VApp = mixins(Themeable).extend({
    name: 'v-app',
    props: {
      dark: {
        type: Boolean,
        default: undefined
      },
      id: {
        type: String,
        default: 'app'
      },
      light: {
        type: Boolean,
        default: undefined
      }
    },
    computed: {
      isDark() {
        return this.$vuetify.theme.dark;
      }

    },

    beforeCreate() {
      if (!this.$vuetify || this.$vuetify === this.$root) {
        throw new Error('Vuetify is not properly initialized, see https://vuetifyjs.com/getting-started/quick-start#bootstrapping-the-vuetify-object');
      }
    },

    render(h) {
      const wrapper = h('div', {
        staticClass: 'v-application--wrap'
      }, this.$slots.default);
      return h('div', {
        staticClass: 'v-application',
        class: {
          'v-application--is-rtl': this.$vuetify.rtl,
          'v-application--is-ltr': !this.$vuetify.rtl,
          ...this.themeClasses
        },
        attrs: {
          'data-app': true
        },
        domProps: {
          id: this.id
        }
      }, [wrapper]);
    }

  });

  /**
   * This mixin provides `attrs$` and `listeners$` to work around
   * vue bug https://github.com/vuejs/vue/issues/10115
   */

  function makeWatcher(property) {
    return function (val, oldVal) {
      for (const attr in oldVal) {
        if (!Object.prototype.hasOwnProperty.call(val, attr)) {
          this.$delete(this.$data[property], attr);
        }
      }

      for (const attr in val) {
        this.$set(this.$data[property], attr, val[attr]);
      }
    };
  }

  var BindsAttrs = Vue.extend({
    data: () => ({
      attrs$: {},
      listeners$: {}
    }),

    created() {
      // Work around unwanted re-renders: https://github.com/vuejs/vue/issues/10115
      // Make sure to use `attrs$` instead of `$attrs` (confusing right?)
      this.$watch('$attrs', makeWatcher('attrs$'), {
        immediate: true
      });
      this.$watch('$listeners', makeWatcher('listeners$'), {
        immediate: true
      });
    }

  });

  function createMessage(message, vm, parent) {
    if (parent) {
      vm = {
        _isVue: true,
        $parent: parent,
        $options: vm
      };
    }

    if (vm) {
      // Only show each message once per instance
      vm.$_alreadyWarned = vm.$_alreadyWarned || [];
      if (vm.$_alreadyWarned.includes(message)) return;
      vm.$_alreadyWarned.push(message);
    }

    return `[Vuetify] ${message}` + (vm ? generateComponentTrace(vm) : '');
  }
  function consoleWarn(message, vm, parent) {
    const newMessage = createMessage(message, vm, parent);
    newMessage != null && console.warn(newMessage);
  }
  function consoleError(message, vm, parent) {
    const newMessage = createMessage(message, vm, parent);
    newMessage != null && console.error(newMessage);
  }
  function breaking(original, replacement, vm, parent) {
    consoleError(`[BREAKING] '${original}' has been removed, use '${replacement}' instead. For more information, see the upgrade guide https://github.com/vuetifyjs/vuetify/releases/tag/v2.0.0#user-content-upgrade-guide`, vm, parent);
  }
  function removed(original, vm, parent) {
    consoleWarn(`[REMOVED] '${original}' has been removed. You can safely omit it.`, vm, parent);
  }
  /**
   * Shamelessly stolen from vuejs/vue/blob/dev/src/core/util/debug.js
   */

  const classifyRE = /(?:^|[-_])(\w)/g;

  const classify = str => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');

  function formatComponentName(vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>';
    }

    const options = typeof vm === 'function' && vm.cid != null ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm || {};
    let name = options.name || options._componentTag;
    const file = options.__file;

    if (!name && file) {
      const match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (name ? `<${classify(name)}>` : `<Anonymous>`) + (file && includeFile !== false ? ` at ${file}` : '');
  }

  function generateComponentTrace(vm) {
    if (vm._isVue && vm.$parent) {
      const tree = [];
      let currentRecursiveSequence = 0;

      while (vm) {
        if (tree.length > 0) {
          const last = tree[tree.length - 1];

          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue;
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }

        tree.push(vm);
        vm = vm.$parent;
      }

      return '\n\nfound in\n\n' + tree.map((vm, i) => `${i === 0 ? '---> ' : ' '.repeat(5 + i * 2)}${Array.isArray(vm) ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)` : formatComponentName(vm)}`).join('\n');
    } else {
      return `\n\n(found in ${formatComponentName(vm)})`;
    }
  }

  function isCssColor(color) {
    return !!color && !!color.match(/^(#|var\(--|(rgb|hsl)a?\()/);
  }

  var Colorable = Vue.extend({
    name: 'colorable',
    props: {
      color: String
    },
    methods: {
      setBackgroundColor(color, data = {}) {
        if (typeof data.style === 'string') {
          // istanbul ignore next
          consoleError('style must be an object', this); // istanbul ignore next

          return data;
        }

        if (typeof data.class === 'string') {
          // istanbul ignore next
          consoleError('class must be an object', this); // istanbul ignore next

          return data;
        }

        if (isCssColor(color)) {
          data.style = { ...data.style,
            'background-color': `${color}`,
            'border-color': `${color}`
          };
        } else if (color) {
          data.class = { ...data.class,
            [color]: true
          };
        }

        return data;
      },

      setTextColor(color, data = {}) {
        if (typeof data.style === 'string') {
          // istanbul ignore next
          consoleError('style must be an object', this); // istanbul ignore next

          return data;
        }

        if (typeof data.class === 'string') {
          // istanbul ignore next
          consoleError('class must be an object', this); // istanbul ignore next

          return data;
        }

        if (isCssColor(color)) {
          data.style = { ...data.style,
            color: `${color}`,
            'caret-color': `${color}`
          };
        } else if (color) {
          const [colorName, colorModifier] = color.toString().trim().split(' ', 2);
          data.class = { ...data.class,
            [colorName + '--text']: true
          };

          if (colorModifier) {
            data.class['text--' + colorModifier] = true;
          }
        }

        return data;
      }

    }
  });

  var Elevatable = Vue.extend({
    name: 'elevatable',
    props: {
      elevation: [Number, String]
    },
    computed: {
      computedElevation() {
        return this.elevation;
      },

      elevationClasses() {
        const elevation = this.computedElevation;
        if (elevation == null) return {};
        if (isNaN(parseInt(elevation))) return {};
        return {
          [`elevation-${this.elevation}`]: true
        };
      }

    }
  });

  function createSimpleFunctional(c, el = 'div', name) {
    return Vue.extend({
      name: name || c.replace(/__/g, '-'),
      functional: true,

      render(h, {
        data,
        children
      }) {
        data.staticClass = `${c} ${data.staticClass || ''}`.trim();
        return h(el, data, children);
      }

    });
  }
  let passiveSupported = false;

  try {
    if (typeof window !== 'undefined') {
      const testListenerOpts = Object.defineProperty({}, 'passive', {
        get: () => {
          passiveSupported = true;
        }
      });
      window.addEventListener('testListener', testListenerOpts, testListenerOpts);
      window.removeEventListener('testListener', testListenerOpts, testListenerOpts);
    }
  } catch (e) {
    console.warn(e);
  }
  function getNestedValue(obj, path, fallback) {
    const last = path.length - 1;
    if (last < 0) return obj === undefined ? fallback : obj;

    for (let i = 0; i < last; i++) {
      if (obj == null) {
        return fallback;
      }

      obj = obj[path[i]];
    }

    if (obj == null) return fallback;
    return obj[path[last]] === undefined ? fallback : obj[path[last]];
  }
  function deepEqual(a, b) {
    if (a === b) return true;

    if (a instanceof Date && b instanceof Date) {
      // If the values are Date, they were convert to timestamp with getTime and compare it
      if (a.getTime() !== b.getTime()) return false;
    }

    if (a !== Object(a) || b !== Object(b)) {
      // If the values aren't objects, they were already checked for equality
      return false;
    }

    const props = Object.keys(a);

    if (props.length !== Object.keys(b).length) {
      // Different number of props, don't bother to check
      return false;
    }

    return props.every(p => deepEqual(a[p], b[p]));
  }
  function getObjectValueByPath(obj, path, fallback) {
    // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
    if (obj == null || !path || typeof path !== 'string') return fallback;
    if (obj[path] !== undefined) return obj[path];
    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties

    path = path.replace(/^\./, ''); // strip a leading dot

    return getNestedValue(obj, path.split('.'), fallback);
  }
  function getPropertyFromItem(item, property, fallback) {
    if (property == null) return item === undefined ? fallback : item;
    if (item !== Object(item)) return fallback === undefined ? item : fallback;
    if (typeof property === 'string') return getObjectValueByPath(item, property, fallback);
    if (Array.isArray(property)) return getNestedValue(item, property, fallback);
    if (typeof property !== 'function') return fallback;
    const value = property(item, fallback);
    return typeof value === 'undefined' ? fallback : value;
  }
  function getZIndex(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return 0;
    const index = +window.getComputedStyle(el).getPropertyValue('z-index');
    if (!index) return getZIndex(el.parentNode);
    return index;
  }
  const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };
  function escapeHTML(str) {
    return str.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag);
  }
  function filterObjectOnKeys(obj, keys) {
    const filtered = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (typeof obj[key] !== 'undefined') {
        filtered[key] = obj[key];
      }
    }

    return filtered;
  }
  function convertToUnit(str, unit = 'px') {
    if (str == null || str === '') {
      return undefined;
    } else if (isNaN(+str)) {
      return String(str);
    } else {
      return `${Number(str)}${unit}`;
    }
  }
  function kebabCase(str) {
    return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  function isObject$1(obj) {
    return obj !== null && typeof obj === 'object';
  } // KeyboardEvent.keyCode aliases

  const keyCodes = Object.freeze({
    enter: 13,
    tab: 9,
    delete: 46,
    esc: 27,
    space: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    end: 35,
    home: 36,
    del: 46,
    backspace: 8,
    insert: 45,
    pageup: 33,
    pagedown: 34
  }); // This remaps internal names like '$cancel' or '$vuetify.icons.cancel'
  // to the current name or component for that icon.

  function remapInternalIcon(vm, iconName) {
    if (!iconName.startsWith('$')) {
      return iconName;
    } // Get the target icon name


    const iconPath = `$vuetify.icons.values.${iconName.split('$').pop().split('.').pop()}`; // Now look up icon indirection name,
    // e.g. '$vuetify.icons.values.cancel'

    return getObjectValueByPath(vm, iconPath, iconName);
  }
  function keys(o) {
    return Object.keys(o);
  }
  /**
   * Camelize a hyphen-delimited string.
   */

  const camelizeRE$1 = /-(\w)/g;
  const camelize$1 = str => {
    return str.replace(camelizeRE$1, (_, c) => c ? c.toUpperCase() : '');
  };
  /**
   * Makes the first character of a string uppercase
   */

  function upperFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function wrapInArray(v) {
    return v != null ? Array.isArray(v) ? v : [v] : [];
  }
  /**
   * Returns:
   *  - 'normal' for old style slots - `<template slot="default">`
   *  - 'scoped' for old style scoped slots (`<template slot="default" slot-scope="data">`) or bound v-slot (`#default="data"`)
   *  - 'v-slot' for unbound v-slot (`#default`) - only if the third param is true, otherwise counts as scoped
   */

  function getSlotType(vm, name, split) {
    if (vm.$slots[name] && vm.$scopedSlots[name] && vm.$scopedSlots[name].name) {
      return split ? 'v-slot' : 'scoped';
    }

    if (vm.$slots[name]) return 'normal';
    if (vm.$scopedSlots[name]) return 'scoped';
  }
  function getSlot(vm, name = 'default', data, optional = false) {
    if (vm.$scopedSlots[name]) {
      return vm.$scopedSlots[name](data instanceof Function ? data() : data);
    } else if (vm.$slots[name] && (!data || optional)) {
      return vm.$slots[name];
    }

    return undefined;
  }
  function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
  }
  function mergeDeep(source = {}, target = {}) {
    for (const key in target) {
      const sourceProperty = source[key];
      const targetProperty = target[key]; // Only continue deep merging if
      // both properties are objects

      if (isObject$1(sourceProperty) && isObject$1(targetProperty)) {
        source[key] = mergeDeep(sourceProperty, targetProperty);
        continue;
      }

      source[key] = targetProperty;
    }

    return source;
  }

  // Helpers
  var Measurable = Vue.extend({
    name: 'measurable',
    props: {
      height: [Number, String],
      maxHeight: [Number, String],
      maxWidth: [Number, String],
      minHeight: [Number, String],
      minWidth: [Number, String],
      width: [Number, String]
    },
    computed: {
      measurableStyles() {
        const styles = {};
        const height = convertToUnit(this.height);
        const minHeight = convertToUnit(this.minHeight);
        const minWidth = convertToUnit(this.minWidth);
        const maxHeight = convertToUnit(this.maxHeight);
        const maxWidth = convertToUnit(this.maxWidth);
        const width = convertToUnit(this.width);
        if (height) styles.height = height;
        if (minHeight) styles.minHeight = minHeight;
        if (minWidth) styles.minWidth = minWidth;
        if (maxHeight) styles.maxHeight = maxHeight;
        if (maxWidth) styles.maxWidth = maxWidth;
        if (width) styles.width = width;
        return styles;
      }

    }
  });

  // Styles
  /* @vue/component */

  var VSheet = mixins(BindsAttrs, Colorable, Elevatable, Measurable, Themeable).extend({
    name: 'v-sheet',
    props: {
      tag: {
        type: String,
        default: 'div'
      },
      tile: Boolean
    },
    computed: {
      classes() {
        return {
          'v-sheet': true,
          'v-sheet--tile': this.tile,
          ...this.themeClasses,
          ...this.elevationClasses
        };
      },

      styles() {
        return this.measurableStyles;
      }

    },

    render(h) {
      const data = {
        class: this.classes,
        style: this.styles,
        on: this.listeners$
      };
      return h(this.tag, this.setBackgroundColor(this.color, data), this.$slots.default);
    }

  });

  function inserted(el, binding) {
    const modifiers = binding.modifiers || {};
    const value = binding.value;
    const {
      handler,
      options
    } = typeof value === 'object' ? value : {
      handler: value,
      options: {}
    };
    const observer = new IntersectionObserver((entries = [], observer) => {
      /* istanbul ignore if */
      if (!el._observe) return; // Just in case, should never fire
      // If is not quiet or has already been
      // initted, invoke the user callback

      if (handler && (!modifiers.quiet || el._observe.init)) {
        const isIntersecting = Boolean(entries.find(entry => entry.isIntersecting));
        handler(entries, observer, isIntersecting);
      } // If has already been initted and
      // has the once modifier, unbind


      if (el._observe.init && modifiers.once) unbind(el); // Otherwise, mark the observer as initted
      else el._observe.init = true;
    }, options);
    el._observe = {
      init: false,
      observer
    };
    observer.observe(el);
  }

  function unbind(el) {
    /* istanbul ignore if */
    if (!el._observe) return;

    el._observe.observer.unobserve(el);

    delete el._observe;
  }

  const Intersect = {
    inserted,
    unbind
  };

  /* @vue/component */

  var VResponsive = mixins(Measurable).extend({
    name: 'v-responsive',
    props: {
      aspectRatio: [String, Number]
    },
    computed: {
      computedAspectRatio() {
        return Number(this.aspectRatio);
      },

      aspectStyle() {
        return this.computedAspectRatio ? {
          paddingBottom: 1 / this.computedAspectRatio * 100 + '%'
        } : undefined;
      },

      __cachedSizer() {
        if (!this.aspectStyle) return [];
        return this.$createElement('div', {
          style: this.aspectStyle,
          staticClass: 'v-responsive__sizer'
        });
      }

    },
    methods: {
      genContent() {
        return this.$createElement('div', {
          staticClass: 'v-responsive__content'
        }, this.$slots.default);
      }

    },

    render(h) {
      return h('div', {
        staticClass: 'v-responsive',
        style: this.measurableStyles,
        on: this.$listeners
      }, [this.__cachedSizer, this.genContent()]);
    }

  });

  // Styles
  const hasIntersect = typeof window !== 'undefined' && 'IntersectionObserver' in window;
  /* @vue/component */

  var VImg = VResponsive.extend({
    name: 'v-img',
    directives: {
      intersect: Intersect
    },
    props: {
      alt: String,
      contain: Boolean,
      eager: Boolean,
      gradient: String,
      lazySrc: String,
      options: {
        type: Object,
        // For more information on types, navigate to:
        // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
        default: () => ({
          root: undefined,
          rootMargin: undefined,
          threshold: undefined
        })
      },
      position: {
        type: String,
        default: 'center center'
      },
      sizes: String,
      src: {
        type: [String, Object],
        default: ''
      },
      srcset: String,
      transition: {
        type: [Boolean, String],
        default: 'fade-transition'
      }
    },

    data() {
      return {
        currentSrc: '',
        image: null,
        isLoading: true,
        calculatedAspectRatio: undefined,
        naturalWidth: undefined
      };
    },

    computed: {
      computedAspectRatio() {
        return Number(this.normalisedSrc.aspect || this.calculatedAspectRatio);
      },

      normalisedSrc() {
        return typeof this.src === 'string' ? {
          src: this.src,
          srcset: this.srcset,
          lazySrc: this.lazySrc,
          aspect: Number(this.aspectRatio || 0)
        } : {
          src: this.src.src,
          srcset: this.srcset || this.src.srcset,
          lazySrc: this.lazySrc || this.src.lazySrc,
          aspect: Number(this.aspectRatio || this.src.aspect)
        };
      },

      __cachedImage() {
        if (!(this.normalisedSrc.src || this.normalisedSrc.lazySrc)) return [];
        const backgroundImage = [];
        const src = this.isLoading ? this.normalisedSrc.lazySrc : this.currentSrc;
        if (this.gradient) backgroundImage.push(`linear-gradient(${this.gradient})`);
        if (src) backgroundImage.push(`url("${src}")`);
        const image = this.$createElement('div', {
          staticClass: 'v-image__image',
          class: {
            'v-image__image--preload': this.isLoading,
            'v-image__image--contain': this.contain,
            'v-image__image--cover': !this.contain
          },
          style: {
            backgroundImage: backgroundImage.join(', '),
            backgroundPosition: this.position
          },
          key: +this.isLoading
        });
        /* istanbul ignore if */

        if (!this.transition) return image;
        return this.$createElement('transition', {
          attrs: {
            name: this.transition,
            mode: 'in-out'
          }
        }, [image]);
      }

    },
    watch: {
      src() {
        // Force re-init when src changes
        if (!this.isLoading) this.init(undefined, undefined, true);else this.loadImage();
      },

      '$vuetify.breakpoint.width': 'getSrc'
    },

    mounted() {
      this.init();
    },

    methods: {
      init(entries, observer, isIntersecting) {
        // If the current browser supports the intersection
        // observer api, the image is not observable, and
        // the eager prop isn't being used, do not load
        if (hasIntersect && !isIntersecting && !this.eager) return;

        if (this.normalisedSrc.lazySrc) {
          const lazyImg = new Image();
          lazyImg.src = this.normalisedSrc.lazySrc;
          this.pollForSize(lazyImg, null);
        }
        /* istanbul ignore else */


        if (this.normalisedSrc.src) this.loadImage();
      },

      onLoad() {
        this.getSrc();
        this.isLoading = false;
        this.$emit('load', this.src);
      },

      onError() {
        consoleError(`Image load failed\n\n` + `src: ${this.normalisedSrc.src}`, this);
        this.$emit('error', this.src);
      },

      getSrc() {
        /* istanbul ignore else */
        if (this.image) this.currentSrc = this.image.currentSrc || this.image.src;
      },

      loadImage() {
        const image = new Image();
        this.image = image;

        image.onload = () => {
          /* istanbul ignore if */
          if (image.decode) {
            image.decode().catch(err => {
              consoleWarn(`Failed to decode image, trying to render anyway\n\n` + `src: ${this.normalisedSrc.src}` + (err.message ? `\nOriginal error: ${err.message}` : ''), this);
            }).then(this.onLoad);
          } else {
            this.onLoad();
          }
        };

        image.onerror = this.onError;
        image.src = this.normalisedSrc.src;
        this.sizes && (image.sizes = this.sizes);
        this.normalisedSrc.srcset && (image.srcset = this.normalisedSrc.srcset);
        this.aspectRatio || this.pollForSize(image);
        this.getSrc();
      },

      pollForSize(img, timeout = 100) {
        const poll = () => {
          const {
            naturalHeight,
            naturalWidth
          } = img;

          if (naturalHeight || naturalWidth) {
            this.naturalWidth = naturalWidth;
            this.calculatedAspectRatio = naturalWidth / naturalHeight;
          } else {
            timeout != null && setTimeout(poll, timeout);
          }
        };

        poll();
      },

      genContent() {
        const content = VResponsive.options.methods.genContent.call(this);

        if (this.naturalWidth) {
          this._b(content.data, 'div', {
            style: {
              width: `${this.naturalWidth}px`
            }
          });
        }

        return content;
      },

      __genPlaceholder() {
        if (this.$slots.placeholder) {
          const placeholder = this.isLoading ? [this.$createElement('div', {
            staticClass: 'v-image__placeholder'
          }, this.$slots.placeholder)] : [];
          if (!this.transition) return placeholder[0];
          return this.$createElement('transition', {
            props: {
              appear: true,
              name: this.transition
            }
          }, placeholder);
        }
      }

    },

    render(h) {
      const node = VResponsive.options.render.call(this, h);
      node.data.staticClass += ' v-image'; // Only load intersect directive if it
      // will work in the current browser.

      if (hasIntersect) {
        node.data.directives = [{
          name: 'intersect',
          modifiers: {
            once: true
          },
          value: {
            handler: this.init,
            options: this.options
          }
        }];
      }

      node.data.attrs = {
        role: this.alt ? 'img' : undefined,
        'aria-label': this.alt
      };
      node.children = [this.__cachedSizer, this.__cachedImage, this.__genPlaceholder(), this.genContent()];
      return h(node.tag, node.data, node.children);
    }

  });

  // Styles
  /* @vue/component */

  var VToolbar = VSheet.extend({
    name: 'v-toolbar',
    props: {
      absolute: Boolean,
      bottom: Boolean,
      collapse: Boolean,
      dense: Boolean,
      extended: Boolean,
      extensionHeight: {
        default: 48,
        type: [Number, String]
      },
      flat: Boolean,
      floating: Boolean,
      prominent: Boolean,
      short: Boolean,
      src: {
        type: [String, Object],
        default: ''
      },
      tag: {
        type: String,
        default: 'header'
      },
      tile: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      isExtended: false
    }),
    computed: {
      computedHeight() {
        const height = this.computedContentHeight;
        if (!this.isExtended) return height;
        const extensionHeight = parseInt(this.extensionHeight);
        return this.isCollapsed ? height : height + (!isNaN(extensionHeight) ? extensionHeight : 0);
      },

      computedContentHeight() {
        if (this.height) return parseInt(this.height);
        if (this.isProminent && this.dense) return 96;
        if (this.isProminent && this.short) return 112;
        if (this.isProminent) return 128;
        if (this.dense) return 48;
        if (this.short || this.$vuetify.breakpoint.smAndDown) return 56;
        return 64;
      },

      classes() {
        return { ...VSheet.options.computed.classes.call(this),
          'v-toolbar': true,
          'v-toolbar--absolute': this.absolute,
          'v-toolbar--bottom': this.bottom,
          'v-toolbar--collapse': this.collapse,
          'v-toolbar--collapsed': this.isCollapsed,
          'v-toolbar--dense': this.dense,
          'v-toolbar--extended': this.isExtended,
          'v-toolbar--flat': this.flat,
          'v-toolbar--floating': this.floating,
          'v-toolbar--prominent': this.isProminent
        };
      },

      isCollapsed() {
        return this.collapse;
      },

      isProminent() {
        return this.prominent;
      },

      styles() {
        return { ...this.measurableStyles,
          height: convertToUnit(this.computedHeight)
        };
      }

    },

    created() {
      const breakingProps = [['app', '<v-app-bar app>'], ['manual-scroll', '<v-app-bar :value="false">'], ['clipped-left', '<v-app-bar clipped-left>'], ['clipped-right', '<v-app-bar clipped-right>'], ['inverted-scroll', '<v-app-bar inverted-scroll>'], ['scroll-off-screen', '<v-app-bar scroll-off-screen>'], ['scroll-target', '<v-app-bar scroll-target>'], ['scroll-threshold', '<v-app-bar scroll-threshold>'], ['card', '<v-app-bar flat>']];
      /* istanbul ignore next */

      breakingProps.forEach(([original, replacement]) => {
        if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
      });
    },

    methods: {
      genBackground() {
        const props = {
          height: convertToUnit(this.computedHeight),
          src: this.src
        };
        const image = this.$scopedSlots.img ? this.$scopedSlots.img({
          props
        }) : this.$createElement(VImg, {
          props
        });
        return this.$createElement('div', {
          staticClass: 'v-toolbar__image'
        }, [image]);
      },

      genContent() {
        return this.$createElement('div', {
          staticClass: 'v-toolbar__content',
          style: {
            height: convertToUnit(this.computedContentHeight)
          }
        }, getSlot(this));
      },

      genExtension() {
        return this.$createElement('div', {
          staticClass: 'v-toolbar__extension',
          style: {
            height: convertToUnit(this.extensionHeight)
          }
        }, getSlot(this, 'extension'));
      }

    },

    render(h) {
      this.isExtended = this.extended || !!this.$scopedSlots.extension;
      const children = [this.genContent()];
      const data = this.setBackgroundColor(this.color, {
        class: this.classes,
        style: this.styles,
        on: this.$listeners
      });
      if (this.isExtended) children.push(this.genExtension());
      if (this.src || this.$scopedSlots.img) children.unshift(this.genBackground());
      return h(this.tag, data, children);
    }

  });

  function inserted$1(el, binding) {
    const callback = binding.value;
    const options = binding.options || {
      passive: true
    };
    const target = binding.arg ? document.querySelector(binding.arg) : window;
    if (!target) return;
    target.addEventListener('scroll', callback, options);
    el._onScroll = {
      callback,
      options,
      target
    };
  }

  function unbind$1(el) {
    if (!el._onScroll) return;
    const {
      callback,
      options,
      target
    } = el._onScroll;
    target.removeEventListener('scroll', callback, options);
    delete el._onScroll;
  }

  const Scroll = {
    inserted: inserted$1,
    unbind: unbind$1
  };

  const availableProps = {
    absolute: Boolean,
    bottom: Boolean,
    fixed: Boolean,
    left: Boolean,
    right: Boolean,
    top: Boolean
  };
  function factory(selected = []) {
    return Vue.extend({
      name: 'positionable',
      props: selected.length ? filterObjectOnKeys(availableProps, selected) : availableProps
    });
  }
  var Positionable = factory(); // Add a `*` before the second `/`

  /* Tests /
  let single = factory(['top']).extend({
    created () {
      this.top
      this.bottom
      this.absolute
    }
  })

  let some = factory(['top', 'bottom']).extend({
    created () {
      this.top
      this.bottom
      this.absolute
    }
  })

  let all = factory().extend({
    created () {
      this.top
      this.bottom
      this.absolute
      this.foobar
    }
  })
  /**/

  function applicationable(value, events = []) {
    /* @vue/component */
    return mixins(factory(['absolute', 'fixed'])).extend({
      name: 'applicationable',
      props: {
        app: Boolean
      },
      computed: {
        applicationProperty() {
          return value;
        }

      },
      watch: {
        // If previous value was app
        // reset the provided prop
        app(x, prev) {
          prev ? this.removeApplication(true) : this.callUpdate();
        },

        applicationProperty(newVal, oldVal) {
          this.$vuetify.application.unregister(this._uid, oldVal);
        }

      },

      activated() {
        this.callUpdate();
      },

      created() {
        for (let i = 0, length = events.length; i < length; i++) {
          this.$watch(events[i], this.callUpdate);
        }

        this.callUpdate();
      },

      mounted() {
        this.callUpdate();
      },

      deactivated() {
        this.removeApplication();
      },

      destroyed() {
        this.removeApplication();
      },

      methods: {
        callUpdate() {
          if (!this.app) return;
          this.$vuetify.application.register(this._uid, this.applicationProperty, this.updateApplication());
        },

        removeApplication(force = false) {
          if (!force && !this.app) return;
          this.$vuetify.application.unregister(this._uid, this.applicationProperty);
        },

        updateApplication: () => 0
      }
    });
  }

  function closeConditional() {
    return false;
  }

  function directive$1(e, el, binding) {
    // Args may not always be supplied
    binding.args = binding.args || {}; // If no closeConditional was supplied assign a default

    const isActive = binding.args.closeConditional || closeConditional; // The include element callbacks below can be expensive
    // so we should avoid calling them when we're not active.
    // Explicitly check for false to allow fallback compatibility
    // with non-toggleable components

    if (!e || isActive(e) === false) return; // If click was triggered programmaticaly (domEl.click()) then
    // it shouldn't be treated as click-outside
    // Chrome/Firefox support isTrusted property
    // IE/Edge support pointerType property (empty if not triggered
    // by pointing device)

    if ('isTrusted' in e && !e.isTrusted || 'pointerType' in e && !e.pointerType) return; // Check if additional elements were passed to be included in check
    // (click must be outside all included elements, if any)

    const elements = (binding.args.include || (() => []))(); // Add the root element for the component this directive was defined on


    elements.push(el); // Check if it's a click outside our elements, and then if our callback returns true.
    // Non-toggleable components should take action in their callback and return falsy.
    // Toggleable can return true if it wants to deactivate.
    // Note that, because we're in the capture phase, this callback will occur before
    // the bubbling click event on any outside elements.

    !elements.some(el => el.contains(e.target)) && setTimeout(() => {
      isActive(e) && binding.value && binding.value(e);
    }, 0);
  }

  const ClickOutside = {
    // [data-app] may not be found
    // if using bind, inserted makes
    // sure that the root element is
    // available, iOS does not support
    // clicks on body
    inserted(el, binding) {
      const onClick = e => directive$1(e, el, binding); // iOS does not recognize click events on document
      // or body, this is the entire purpose of the v-app
      // component and [data-app], stop removing this


      const app = document.querySelector('[data-app]') || document.body; // This is only for unit tests

      app.addEventListener('click', onClick, true);
      el._clickOutside = onClick;
    },

    unbind(el) {
      if (!el._clickOutside) return;
      const app = document.querySelector('[data-app]') || document.body; // This is only for unit tests

      app && app.removeEventListener('click', el._clickOutside, true);
      delete el._clickOutside;
    }

  };

  function inserted$2(el, binding) {
    const callback = binding.value;
    const options = binding.options || {
      passive: true
    };
    window.addEventListener('resize', callback, options);
    el._onResize = {
      callback,
      options
    };

    if (!binding.modifiers || !binding.modifiers.quiet) {
      callback();
    }
  }

  function unbind$2(el) {
    if (!el._onResize) return;
    const {
      callback,
      options
    } = el._onResize;
    window.removeEventListener('resize', callback, options);
    delete el._onResize;
  }

  const Resize = {
    inserted: inserted$2,
    unbind: unbind$2
  };

  // Styles

  function transform(el, value) {
    el.style['transform'] = value;
    el.style['webkitTransform'] = value;
  }

  function opacity(el, value) {
    el.style['opacity'] = value.toString();
  }

  function isTouchEvent(e) {
    return e.constructor.name === 'TouchEvent';
  }

  function isKeyboardEvent(e) {
    return e.constructor.name === 'KeyboardEvent';
  }

  const calculate = (e, el, value = {}) => {
    let localX = 0;
    let localY = 0;

    if (!isKeyboardEvent(e)) {
      const offset = el.getBoundingClientRect();
      const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e;
      localX = target.clientX - offset.left;
      localY = target.clientY - offset.top;
    }

    let radius = 0;
    let scale = 0.3;

    if (el._ripple && el._ripple.circle) {
      scale = 0.15;
      radius = el.clientWidth / 2;
      radius = value.center ? radius : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;
    } else {
      radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;
    }

    const centerX = `${(el.clientWidth - radius * 2) / 2}px`;
    const centerY = `${(el.clientHeight - radius * 2) / 2}px`;
    const x = value.center ? centerX : `${localX - radius}px`;
    const y = value.center ? centerY : `${localY - radius}px`;
    return {
      radius,
      scale,
      x,
      y,
      centerX,
      centerY
    };
  };

  const ripples = {
    /* eslint-disable max-statements */
    show(e, el, value = {}) {
      if (!el._ripple || !el._ripple.enabled) {
        return;
      }

      const container = document.createElement('span');
      const animation = document.createElement('span');
      container.appendChild(animation);
      container.className = 'v-ripple__container';

      if (value.class) {
        container.className += ` ${value.class}`;
      }

      const {
        radius,
        scale,
        x,
        y,
        centerX,
        centerY
      } = calculate(e, el, value);
      const size = `${radius * 2}px`;
      animation.className = 'v-ripple__animation';
      animation.style.width = size;
      animation.style.height = size;
      el.appendChild(container);
      const computed = window.getComputedStyle(el);

      if (computed && computed.position === 'static') {
        el.style.position = 'relative';
        el.dataset.previousPosition = 'static';
      }

      animation.classList.add('v-ripple__animation--enter');
      animation.classList.add('v-ripple__animation--visible');
      transform(animation, `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`);
      opacity(animation, 0);
      animation.dataset.activated = String(performance.now());
      setTimeout(() => {
        animation.classList.remove('v-ripple__animation--enter');
        animation.classList.add('v-ripple__animation--in');
        transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
        opacity(animation, 0.25);
      }, 0);
    },

    hide(el) {
      if (!el || !el._ripple || !el._ripple.enabled) return;
      const ripples = el.getElementsByClassName('v-ripple__animation');
      if (ripples.length === 0) return;
      const animation = ripples[ripples.length - 1];
      if (animation.dataset.isHiding) return;else animation.dataset.isHiding = 'true';
      const diff = performance.now() - Number(animation.dataset.activated);
      const delay = Math.max(250 - diff, 0);
      setTimeout(() => {
        animation.classList.remove('v-ripple__animation--in');
        animation.classList.add('v-ripple__animation--out');
        opacity(animation, 0);
        setTimeout(() => {
          const ripples = el.getElementsByClassName('v-ripple__animation');

          if (ripples.length === 1 && el.dataset.previousPosition) {
            el.style.position = el.dataset.previousPosition;
            delete el.dataset.previousPosition;
          }

          animation.parentNode && el.removeChild(animation.parentNode);
        }, 300);
      }, delay);
    }

  };

  function isRippleEnabled(value) {
    return typeof value === 'undefined' || !!value;
  }

  function rippleShow(e) {
    const value = {};
    const element = e.currentTarget;
    if (!element || !element._ripple || element._ripple.touched) return;

    if (isTouchEvent(e)) {
      element._ripple.touched = true;
      element._ripple.isTouch = true;
    } else {
      // It's possible for touch events to fire
      // as mouse events on Android/iOS, this
      // will skip the event call if it has
      // already been registered as touch
      if (element._ripple.isTouch) return;
    }

    value.center = element._ripple.centered || isKeyboardEvent(e);

    if (element._ripple.class) {
      value.class = element._ripple.class;
    }

    ripples.show(e, element, value);
  }

  function rippleHide(e) {
    const element = e.currentTarget;
    if (!element) return;
    window.setTimeout(() => {
      if (element._ripple) {
        element._ripple.touched = false;
      }
    });
    ripples.hide(element);
  }

  let keyboardRipple = false;

  function keyboardRippleShow(e) {
    if (!keyboardRipple && (e.keyCode === keyCodes.enter || e.keyCode === keyCodes.space)) {
      keyboardRipple = true;
      rippleShow(e);
    }
  }

  function keyboardRippleHide(e) {
    keyboardRipple = false;
    rippleHide(e);
  }

  function updateRipple(el, binding, wasEnabled) {
    const enabled = isRippleEnabled(binding.value);

    if (!enabled) {
      ripples.hide(el);
    }

    el._ripple = el._ripple || {};
    el._ripple.enabled = enabled;
    const value = binding.value || {};

    if (value.center) {
      el._ripple.centered = true;
    }

    if (value.class) {
      el._ripple.class = binding.value.class;
    }

    if (value.circle) {
      el._ripple.circle = value.circle;
    }

    if (enabled && !wasEnabled) {
      el.addEventListener('touchstart', rippleShow, {
        passive: true
      });
      el.addEventListener('touchend', rippleHide, {
        passive: true
      });
      el.addEventListener('touchcancel', rippleHide);
      el.addEventListener('mousedown', rippleShow);
      el.addEventListener('mouseup', rippleHide);
      el.addEventListener('mouseleave', rippleHide);
      el.addEventListener('keydown', keyboardRippleShow);
      el.addEventListener('keyup', keyboardRippleHide); // Anchor tags can be dragged, causes other hides to fail - #1537

      el.addEventListener('dragstart', rippleHide, {
        passive: true
      });
    } else if (!enabled && wasEnabled) {
      removeListeners(el);
    }
  }

  function removeListeners(el) {
    el.removeEventListener('mousedown', rippleShow);
    el.removeEventListener('touchstart', rippleShow);
    el.removeEventListener('touchend', rippleHide);
    el.removeEventListener('touchcancel', rippleHide);
    el.removeEventListener('mouseup', rippleHide);
    el.removeEventListener('mouseleave', rippleHide);
    el.removeEventListener('keydown', keyboardRippleShow);
    el.removeEventListener('keyup', keyboardRippleHide);
    el.removeEventListener('dragstart', rippleHide);
  }

  function directive$2(el, binding, node) {
    updateRipple(el, binding, false);
  }

  function unbind$3(el) {
    delete el._ripple;
    removeListeners(el);
  }

  function update(el, binding) {
    if (binding.value === binding.oldValue) {
      return;
    }

    const wasEnabled = isRippleEnabled(binding.oldValue);
    updateRipple(el, binding, wasEnabled);
  }

  const Ripple = {
    bind: directive$2,
    unbind: unbind$3,
    update
  };

  // Directives
  /**
   * Scrollable
   *
   * Used for monitoring scrolling and
   * invoking functions based upon
   * scrolling thresholds being
   * met.
   */

  /* @vue/component */

  var Scrollable = Vue.extend({
    name: 'scrollable',
    directives: {
      Scroll
    },
    props: {
      scrollTarget: String,
      scrollThreshold: [String, Number]
    },
    data: () => ({
      currentScroll: 0,
      currentThreshold: 0,
      isActive: false,
      isScrollingUp: false,
      previousScroll: 0,
      savedScroll: 0,
      target: null
    }),
    computed: {
      /**
       * A computed property that returns
       * whether scrolling features are
       * enabled or disabled
       */
      canScroll() {
        return typeof window !== 'undefined';
      },

      /**
       * The threshold that must be met before
       * thresholdMet function is invoked
       */
      computedScrollThreshold() {
        return this.scrollThreshold ? Number(this.scrollThreshold) : 300;
      }

    },
    watch: {
      isScrollingUp() {
        this.savedScroll = this.savedScroll || this.currentScroll;
      },

      isActive() {
        this.savedScroll = 0;
      }

    },

    mounted() {
      if (this.scrollTarget) {
        this.target = document.querySelector(this.scrollTarget);

        if (!this.target) {
          consoleWarn(`Unable to locate element with identifier ${this.scrollTarget}`, this);
        }
      }
    },

    methods: {
      onScroll() {
        if (!this.canScroll) return;
        this.previousScroll = this.currentScroll;
        this.currentScroll = this.target ? this.target.scrollTop : window.pageYOffset;
        this.isScrollingUp = this.currentScroll < this.previousScroll;
        this.currentThreshold = Math.abs(this.currentScroll - this.computedScrollThreshold);
        this.$nextTick(() => {
          if (Math.abs(this.currentScroll - this.savedScroll) > this.computedScrollThreshold) this.thresholdMet();
        });
      },

      /**
       * The method invoked when
       * scrolling in any direction
       * has exceeded the threshold
       */
      thresholdMet() {}

    }
  });

  /**
   * SSRBootable
   *
   * @mixin
   *
   * Used in layout components (drawer, toolbar, content)
   * to avoid an entry animation when using SSR
   */

  var SSRBootable = Vue.extend({
    name: 'ssr-bootable',
    data: () => ({
      isBooted: false
    }),

    mounted() {
      // Use setAttribute instead of dataset
      // because dataset does not work well
      // with unit tests
      window.requestAnimationFrame(() => {
        this.$el.setAttribute('data-booted', 'true');
        this.isBooted = true;
      });
    }

  });

  function factory$1(prop = 'value', event = 'input') {
    return Vue.extend({
      name: 'toggleable',
      model: {
        prop,
        event
      },
      props: {
        [prop]: {
          required: false
        }
      },

      data() {
        return {
          isActive: !!this[prop]
        };
      },

      watch: {
        [prop](val) {
          this.isActive = !!val;
        },

        isActive(val) {
          !!val !== this[prop] && this.$emit(event, val);
        }

      }
    });
  }
  /* eslint-disable-next-line no-redeclare */

  const Toggleable = factory$1();

  // Styles
  const baseMixins = mixins(VToolbar, Scrollable, SSRBootable, Toggleable, applicationable('top', ['clippedLeft', 'clippedRight', 'computedHeight', 'invertedScroll', 'isExtended', 'isProminent', 'value']));
  /* @vue/component */

  var VAppBar = baseMixins.extend({
    name: 'v-app-bar',
    directives: {
      Scroll
    },
    props: {
      clippedLeft: Boolean,
      clippedRight: Boolean,
      collapseOnScroll: Boolean,
      elevateOnScroll: Boolean,
      fadeImgOnScroll: Boolean,
      hideOnScroll: Boolean,
      invertedScroll: Boolean,
      scrollOffScreen: Boolean,
      shrinkOnScroll: Boolean,
      value: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        isActive: this.value
      };
    },

    computed: {
      applicationProperty() {
        return !this.bottom ? 'top' : 'bottom';
      },

      canScroll() {
        return Scrollable.options.computed.canScroll.call(this) && (this.invertedScroll || this.elevateOnScroll || this.hideOnScroll || this.collapseOnScroll || this.isBooted || // If falsey, user has provided an
        // explicit value which should
        // overwrite anything we do
        !this.value);
      },

      classes() {
        return { ...VToolbar.options.computed.classes.call(this),
          'v-toolbar--collapse': this.collapse || this.collapseOnScroll,
          'v-app-bar': true,
          'v-app-bar--clipped': this.clippedLeft || this.clippedRight,
          'v-app-bar--fade-img-on-scroll': this.fadeImgOnScroll,
          'v-app-bar--elevate-on-scroll': this.elevateOnScroll,
          'v-app-bar--fixed': !this.absolute && (this.app || this.fixed),
          'v-app-bar--hide-shadow': this.hideShadow,
          'v-app-bar--is-scrolled': this.currentScroll > 0,
          'v-app-bar--shrink-on-scroll': this.shrinkOnScroll
        };
      },

      computedContentHeight() {
        if (!this.shrinkOnScroll) return VToolbar.options.computed.computedContentHeight.call(this);
        const height = this.computedOriginalHeight;
        const min = this.dense ? 48 : 56;
        const max = height;
        const difference = max - min;
        const iteration = difference / this.computedScrollThreshold;
        const offset = this.currentScroll * iteration;
        return Math.max(min, max - offset);
      },

      computedFontSize() {
        if (!this.isProminent) return undefined;
        const max = this.dense ? 96 : 128;
        const difference = max - this.computedContentHeight;
        const increment = 0.00347; // 1.5rem to a minimum of 1.25rem

        return Number((1.50 - difference * increment).toFixed(2));
      },

      computedLeft() {
        if (!this.app || this.clippedLeft) return 0;
        return this.$vuetify.application.left;
      },

      computedMarginTop() {
        if (!this.app) return 0;
        return this.$vuetify.application.bar;
      },

      computedOpacity() {
        if (!this.fadeImgOnScroll) return undefined;
        const opacity = Math.max((this.computedScrollThreshold - this.currentScroll) / this.computedScrollThreshold, 0);
        return Number(parseFloat(opacity).toFixed(2));
      },

      computedOriginalHeight() {
        let height = VToolbar.options.computed.computedContentHeight.call(this);
        if (this.isExtended) height += parseInt(this.extensionHeight);
        return height;
      },

      computedRight() {
        if (!this.app || this.clippedRight) return 0;
        return this.$vuetify.application.right;
      },

      computedScrollThreshold() {
        if (this.scrollThreshold) return Number(this.scrollThreshold);
        return this.computedOriginalHeight - (this.dense ? 48 : 56);
      },

      computedTransform() {
        if (!this.canScroll || this.elevateOnScroll && this.currentScroll === 0 && this.isActive) return 0;
        if (this.isActive) return 0;
        const scrollOffScreen = this.scrollOffScreen ? this.computedHeight : this.computedContentHeight;
        return this.bottom ? scrollOffScreen : -scrollOffScreen;
      },

      hideShadow() {
        if (this.elevateOnScroll && this.isExtended) {
          return this.currentScroll < this.computedScrollThreshold;
        }

        if (this.elevateOnScroll) {
          return this.currentScroll === 0 || this.computedTransform < 0;
        }

        return (!this.isExtended || this.scrollOffScreen) && this.computedTransform !== 0;
      },

      isCollapsed() {
        if (!this.collapseOnScroll) {
          return VToolbar.options.computed.isCollapsed.call(this);
        }

        return this.currentScroll > 0;
      },

      isProminent() {
        return VToolbar.options.computed.isProminent.call(this) || this.shrinkOnScroll;
      },

      styles() {
        return { ...VToolbar.options.computed.styles.call(this),
          fontSize: convertToUnit(this.computedFontSize, 'rem'),
          marginTop: convertToUnit(this.computedMarginTop),
          transform: `translateY(${convertToUnit(this.computedTransform)})`,
          left: convertToUnit(this.computedLeft),
          right: convertToUnit(this.computedRight)
        };
      }

    },
    watch: {
      canScroll: 'onScroll',

      computedTransform() {
        // Normally we do not want the v-app-bar
        // to update the application top value
        // to avoid screen jump. However, in
        // this situation, we must so that
        // the clipped drawer can update
        // its top value when scrolled
        if (!this.canScroll || !this.clippedLeft && !this.clippedRight) return;
        this.callUpdate();
      },

      invertedScroll(val) {
        this.isActive = !val || this.currentScroll !== 0;
      }

    },

    created() {
      if (this.invertedScroll) this.isActive = false;
    },

    methods: {
      genBackground() {
        const render = VToolbar.options.methods.genBackground.call(this);
        render.data = this._b(render.data || {}, render.tag, {
          style: {
            opacity: this.computedOpacity
          }
        });
        return render;
      },

      updateApplication() {
        return this.invertedScroll ? 0 : this.computedHeight + this.computedTransform;
      },

      thresholdMet() {
        if (this.invertedScroll) {
          this.isActive = this.currentScroll > this.computedScrollThreshold;
          return;
        }

        if (this.hideOnScroll) {
          this.isActive = this.isScrollingUp || this.currentScroll < this.computedScrollThreshold;
        }

        if (this.currentThreshold < this.computedScrollThreshold) return;
        this.savedScroll = this.currentScroll;
      }

    },

    render(h) {
      const render = VToolbar.options.render.call(this, h);
      render.data = render.data || {};

      if (this.canScroll) {
        render.data.directives = render.data.directives || [];
        render.data.directives.push({
          arg: this.scrollTarget,
          name: 'scroll',
          value: this.onScroll
        });
      }

      return render;
    }

  });

  var Sizeable = Vue.extend({
    name: 'sizeable',
    props: {
      large: Boolean,
      small: Boolean,
      xLarge: Boolean,
      xSmall: Boolean
    },
    computed: {
      medium() {
        return Boolean(!this.xSmall && !this.small && !this.large && !this.xLarge);
      },

      sizeableClasses() {
        return {
          'v-size--x-small': this.xSmall,
          'v-size--small': this.small,
          'v-size--default': this.medium,
          'v-size--large': this.large,
          'v-size--x-large': this.xLarge
        };
      }

    }
  });

  var SIZE_MAP;

  (function (SIZE_MAP) {
    SIZE_MAP["xSmall"] = "12px";
    SIZE_MAP["small"] = "16px";
    SIZE_MAP["default"] = "24px";
    SIZE_MAP["medium"] = "28px";
    SIZE_MAP["large"] = "36px";
    SIZE_MAP["xLarge"] = "40px";
  })(SIZE_MAP || (SIZE_MAP = {}));

  function isFontAwesome5(iconType) {
    return ['fas', 'far', 'fal', 'fab', 'fad'].some(val => iconType.includes(val));
  }

  function isSvgPath(icon) {
    return /^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(icon) && /[\dz]$/i.test(icon) && icon.length > 4;
  }

  const VIcon = mixins(BindsAttrs, Colorable, Sizeable, Themeable
  /* @vue/component */
  ).extend({
    name: 'v-icon',
    props: {
      dense: Boolean,
      disabled: Boolean,
      left: Boolean,
      right: Boolean,
      size: [Number, String],
      tag: {
        type: String,
        required: false,
        default: 'i'
      }
    },
    computed: {
      medium() {
        return false;
      },

      hasClickListener() {
        return Boolean(this.listeners$.click || this.listeners$['!click']);
      }

    },
    methods: {
      getIcon() {
        let iconName = '';
        if (this.$slots.default) iconName = this.$slots.default[0].text.trim();
        return remapInternalIcon(this, iconName);
      },

      getSize() {
        const sizes = {
          xSmall: this.xSmall,
          small: this.small,
          medium: this.medium,
          large: this.large,
          xLarge: this.xLarge
        };
        const explicitSize = keys(sizes).find(key => sizes[key]);
        return explicitSize && SIZE_MAP[explicitSize] || convertToUnit(this.size);
      },

      // Component data for both font and svg icon.
      getDefaultData() {
        const data = {
          staticClass: 'v-icon notranslate',
          class: {
            'v-icon--disabled': this.disabled,
            'v-icon--left': this.left,
            'v-icon--link': this.hasClickListener,
            'v-icon--right': this.right,
            'v-icon--dense': this.dense
          },
          attrs: {
            'aria-hidden': !this.hasClickListener,
            disabled: this.hasClickListener && this.disabled,
            type: this.hasClickListener ? 'button' : undefined,
            ...this.attrs$
          },
          on: this.listeners$
        };
        return data;
      },

      applyColors(data) {
        data.class = { ...data.class,
          ...this.themeClasses
        };
        this.setTextColor(this.color, data);
      },

      renderFontIcon(icon, h) {
        const newChildren = [];
        const data = this.getDefaultData();
        let iconType = 'material-icons'; // Material Icon delimiter is _
        // https://material.io/icons/

        const delimiterIndex = icon.indexOf('-');
        const isMaterialIcon = delimiterIndex <= -1;

        if (isMaterialIcon) {
          // Material icon uses ligatures.
          newChildren.push(icon);
        } else {
          iconType = icon.slice(0, delimiterIndex);
          if (isFontAwesome5(iconType)) iconType = '';
        }

        data.class[iconType] = true;
        data.class[icon] = !isMaterialIcon;
        const fontSize = this.getSize();
        if (fontSize) data.style = {
          fontSize
        };
        this.applyColors(data);
        return h(this.hasClickListener ? 'button' : this.tag, data, newChildren);
      },

      renderSvgIcon(icon, h) {
        const fontSize = this.getSize();
        const wrapperData = { ...this.getDefaultData(),
          style: fontSize ? {
            fontSize,
            height: fontSize,
            width: fontSize
          } : undefined
        };
        wrapperData.class['v-icon--svg'] = true;
        this.applyColors(wrapperData);
        const svgData = {
          attrs: {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            height: fontSize || '24',
            width: fontSize || '24',
            role: 'img',
            'aria-hidden': true
          }
        };
        return h(this.hasClickListener ? 'button' : 'span', wrapperData, [h('svg', svgData, [h('path', {
          attrs: {
            d: icon
          }
        })])]);
      },

      renderSvgIconComponent(icon, h) {
        const data = this.getDefaultData();
        data.class['v-icon--is-component'] = true;
        const size = this.getSize();

        if (size) {
          data.style = {
            fontSize: size,
            height: size,
            width: size
          };
        }

        this.applyColors(data);
        const component = icon.component;
        data.props = icon.props;
        data.nativeOn = data.on;
        return h(component, data);
      }

    },

    render(h) {
      const icon = this.getIcon();

      if (typeof icon === 'string') {
        if (isSvgPath(icon)) {
          return this.renderSvgIcon(icon, h);
        }

        return this.renderFontIcon(icon, h);
      }

      return this.renderSvgIconComponent(icon, h);
    }

  });
  var VIcon$1 = Vue.extend({
    name: 'v-icon',
    $_wrapperFor: VIcon,
    functional: true,

    render(h, {
      data,
      children
    }) {
      let iconName = ''; // Support usage of v-text and v-html

      if (data.domProps) {
        iconName = data.domProps.textContent || data.domProps.innerHTML || iconName; // Remove nodes so it doesn't
        // overwrite our changes

        delete data.domProps.textContent;
        delete data.domProps.innerHTML;
      }

      return h(VIcon, data, iconName ? [iconName] : children);
    }

  });

  // Styles
  /* @vue/component */

  var VProgressCircular = Colorable.extend({
    name: 'v-progress-circular',
    props: {
      button: Boolean,
      indeterminate: Boolean,
      rotate: {
        type: [Number, String],
        default: 0
      },
      size: {
        type: [Number, String],
        default: 32
      },
      width: {
        type: [Number, String],
        default: 4
      },
      value: {
        type: [Number, String],
        default: 0
      }
    },
    data: () => ({
      radius: 20
    }),
    computed: {
      calculatedSize() {
        return Number(this.size) + (this.button ? 8 : 0);
      },

      circumference() {
        return 2 * Math.PI * this.radius;
      },

      classes() {
        return {
          'v-progress-circular--indeterminate': this.indeterminate,
          'v-progress-circular--button': this.button
        };
      },

      normalizedValue() {
        if (this.value < 0) {
          return 0;
        }

        if (this.value > 100) {
          return 100;
        }

        return parseFloat(this.value);
      },

      strokeDashArray() {
        return Math.round(this.circumference * 1000) / 1000;
      },

      strokeDashOffset() {
        return (100 - this.normalizedValue) / 100 * this.circumference + 'px';
      },

      strokeWidth() {
        return Number(this.width) / +this.size * this.viewBoxSize * 2;
      },

      styles() {
        return {
          height: convertToUnit(this.calculatedSize),
          width: convertToUnit(this.calculatedSize)
        };
      },

      svgStyles() {
        return {
          transform: `rotate(${Number(this.rotate)}deg)`
        };
      },

      viewBoxSize() {
        return this.radius / (1 - Number(this.width) / +this.size);
      }

    },
    methods: {
      genCircle(name, offset) {
        return this.$createElement('circle', {
          class: `v-progress-circular__${name}`,
          attrs: {
            fill: 'transparent',
            cx: 2 * this.viewBoxSize,
            cy: 2 * this.viewBoxSize,
            r: this.radius,
            'stroke-width': this.strokeWidth,
            'stroke-dasharray': this.strokeDashArray,
            'stroke-dashoffset': offset
          }
        });
      },

      genSvg() {
        const children = [this.indeterminate || this.genCircle('underlay', 0), this.genCircle('overlay', this.strokeDashOffset)];
        return this.$createElement('svg', {
          style: this.svgStyles,
          attrs: {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`
          }
        }, children);
      },

      genInfo() {
        return this.$createElement('div', {
          staticClass: 'v-progress-circular__info'
        }, this.$slots.default);
      }

    },

    render(h) {
      return h('div', this.setTextColor(this.color, {
        staticClass: 'v-progress-circular',
        attrs: {
          role: 'progressbar',
          'aria-valuemin': 0,
          'aria-valuemax': 100,
          'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue
        },
        class: this.classes,
        style: this.styles,
        on: this.$listeners
      }), [this.genSvg(), this.genInfo()]);
    }

  });

  function generateWarning(child, parent) {
    return () => consoleWarn(`The ${child} component must be used inside a ${parent}`);
  }

  function inject(namespace, child, parent) {
    const defaultImpl = child && parent ? {
      register: generateWarning(child, parent),
      unregister: generateWarning(child, parent)
    } : null;
    return Vue.extend({
      name: 'registrable-inject',
      inject: {
        [namespace]: {
          default: defaultImpl
        }
      }
    });
  }

  // Mixins
  function factory$2(namespace, child, parent) {
    // TODO: ts 3.4 broke directly returning this
    const R = inject(namespace, child, parent).extend({
      name: 'groupable',
      props: {
        activeClass: {
          type: String,

          default() {
            if (!this[namespace]) return undefined;
            return this[namespace].activeClass;
          }

        },
        disabled: Boolean
      },

      data() {
        return {
          isActive: false
        };
      },

      computed: {
        groupClasses() {
          if (!this.activeClass) return {};
          return {
            [this.activeClass]: this.isActive
          };
        }

      },

      created() {
        this[namespace] && this[namespace].register(this);
      },

      beforeDestroy() {
        this[namespace] && this[namespace].unregister(this);
      },

      methods: {
        toggle() {
          this.$emit('change');
        }

      }
    });
    return R;
  }
  /* eslint-disable-next-line no-redeclare */

  const Groupable = factory$2('itemGroup');

  var Routable = Vue.extend({
    name: 'routable',
    directives: {
      Ripple
    },
    props: {
      activeClass: String,
      append: Boolean,
      disabled: Boolean,
      exact: {
        type: Boolean,
        default: undefined
      },
      exactActiveClass: String,
      link: Boolean,
      href: [String, Object],
      to: [String, Object],
      nuxt: Boolean,
      replace: Boolean,
      ripple: {
        type: [Boolean, Object],
        default: null
      },
      tag: String,
      target: String
    },
    data: () => ({
      isActive: false,
      proxyClass: ''
    }),
    computed: {
      classes() {
        const classes = {};
        if (this.to) return classes;
        if (this.activeClass) classes[this.activeClass] = this.isActive;
        if (this.proxyClass) classes[this.proxyClass] = this.isActive;
        return classes;
      },

      computedRipple() {
        return this.ripple != null ? this.ripple : !this.disabled && this.isClickable;
      },

      isClickable() {
        if (this.disabled) return false;
        return Boolean(this.isLink || this.$listeners.click || this.$listeners['!click'] || this.$attrs.tabindex);
      },

      isLink() {
        return this.to || this.href || this.link;
      },

      styles: () => ({})
    },
    watch: {
      $route: 'onRouteChange'
    },
    methods: {
      click(e) {
        this.$emit('click', e);
      },

      generateRouteLink() {
        let exact = this.exact;
        let tag;
        const data = {
          attrs: {
            tabindex: 'tabindex' in this.$attrs ? this.$attrs.tabindex : undefined
          },
          class: this.classes,
          style: this.styles,
          props: {},
          directives: [{
            name: 'ripple',
            value: this.computedRipple
          }],
          [this.to ? 'nativeOn' : 'on']: { ...this.$listeners,
            click: this.click
          },
          ref: 'link'
        };

        if (typeof this.exact === 'undefined') {
          exact = this.to === '/' || this.to === Object(this.to) && this.to.path === '/';
        }

        if (this.to) {
          // Add a special activeClass hook
          // for component level styles
          let activeClass = this.activeClass;
          let exactActiveClass = this.exactActiveClass || activeClass;

          if (this.proxyClass) {
            activeClass = `${activeClass} ${this.proxyClass}`.trim();
            exactActiveClass = `${exactActiveClass} ${this.proxyClass}`.trim();
          }

          tag = this.nuxt ? 'nuxt-link' : 'router-link';
          Object.assign(data.props, {
            to: this.to,
            exact,
            activeClass,
            exactActiveClass,
            append: this.append,
            replace: this.replace
          });
        } else {
          tag = this.href && 'a' || this.tag || 'div';
          if (tag === 'a' && this.href) data.attrs.href = this.href;
        }

        if (this.target) data.attrs.target = this.target;
        return {
          tag,
          data
        };
      },

      onRouteChange() {
        if (!this.to || !this.$refs.link || !this.$route) return;
        const activeClass = `${this.activeClass} ${this.proxyClass || ''}`.trim();
        const path = `_vnode.data.class.${activeClass}`;
        this.$nextTick(() => {
          /* istanbul ignore else */
          if (getObjectValueByPath(this.$refs.link, path)) {
            this.toggle();
          }
        });
      },

      toggle: () => {}
    }
  });

  // Styles
  const baseMixins$1 = mixins(VSheet, Routable, Positionable, Sizeable, factory$2('btnToggle'), factory$1('inputValue')
  /* @vue/component */
  );
  var VBtn = baseMixins$1.extend().extend({
    name: 'v-btn',
    props: {
      activeClass: {
        type: String,

        default() {
          if (!this.btnToggle) return '';
          return this.btnToggle.activeClass;
        }

      },
      block: Boolean,
      depressed: Boolean,
      fab: Boolean,
      icon: Boolean,
      loading: Boolean,
      outlined: Boolean,
      retainFocusOnClick: Boolean,
      rounded: Boolean,
      tag: {
        type: String,
        default: 'button'
      },
      text: Boolean,
      type: {
        type: String,
        default: 'button'
      },
      value: null
    },
    data: () => ({
      proxyClass: 'v-btn--active'
    }),
    computed: {
      classes() {
        return {
          'v-btn': true,
          ...Routable.options.computed.classes.call(this),
          'v-btn--absolute': this.absolute,
          'v-btn--block': this.block,
          'v-btn--bottom': this.bottom,
          'v-btn--contained': this.contained,
          'v-btn--depressed': this.depressed || this.outlined,
          'v-btn--disabled': this.disabled,
          'v-btn--fab': this.fab,
          'v-btn--fixed': this.fixed,
          'v-btn--flat': this.isFlat,
          'v-btn--icon': this.icon,
          'v-btn--left': this.left,
          'v-btn--loading': this.loading,
          'v-btn--outlined': this.outlined,
          'v-btn--right': this.right,
          'v-btn--round': this.isRound,
          'v-btn--rounded': this.rounded,
          'v-btn--router': this.to,
          'v-btn--text': this.text,
          'v-btn--tile': this.tile,
          'v-btn--top': this.top,
          ...this.themeClasses,
          ...this.groupClasses,
          ...this.elevationClasses,
          ...this.sizeableClasses
        };
      },

      contained() {
        return Boolean(!this.isFlat && !this.depressed && // Contained class only adds elevation
        // is not needed if user provides value
        !this.elevation);
      },

      computedRipple() {
        const defaultRipple = this.icon || this.fab ? {
          circle: true
        } : true;
        if (this.disabled) return false;else return this.ripple != null ? this.ripple : defaultRipple;
      },

      isFlat() {
        return Boolean(this.icon || this.text || this.outlined);
      },

      isRound() {
        return Boolean(this.icon || this.fab);
      },

      styles() {
        return { ...this.measurableStyles
        };
      }

    },

    created() {
      const breakingProps = [['flat', 'text'], ['outline', 'outlined'], ['round', 'rounded']];
      /* istanbul ignore next */

      breakingProps.forEach(([original, replacement]) => {
        if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
      });
    },

    methods: {
      click(e) {
        // TODO: Remove this in v3
        !this.retainFocusOnClick && !this.fab && e.detail && this.$el.blur();
        this.$emit('click', e);
        this.btnToggle && this.toggle();
      },

      genContent() {
        return this.$createElement('span', {
          staticClass: 'v-btn__content'
        }, this.$slots.default);
      },

      genLoader() {
        return this.$createElement('span', {
          class: 'v-btn__loader'
        }, this.$slots.loader || [this.$createElement(VProgressCircular, {
          props: {
            indeterminate: true,
            size: 23,
            width: 2
          }
        })]);
      }

    },

    render(h) {
      const children = [this.genContent(), this.loading && this.genLoader()];
      const setColor = !this.isFlat ? this.setBackgroundColor : this.setTextColor;
      const {
        tag,
        data
      } = this.generateRouteLink();

      if (tag === 'button') {
        data.attrs.type = this.type;
        data.attrs.disabled = this.disabled;
      }

      data.attrs.value = ['string', 'number'].includes(typeof this.value) ? this.value : JSON.stringify(this.value);
      return h(tag, this.disabled ? data : setColor(this.color, data), children);
    }

  });

  const pattern = {
    styleList: /;(?![^(]*\))/g,
    styleProp: /:(.*)/
  };

  function parseStyle(style) {
    const styleMap = {};

    for (const s of style.split(pattern.styleList)) {
      let [key, val] = s.split(pattern.styleProp);
      key = key.trim();

      if (!key) {
        continue;
      } // May be undefined if the `key: value` pair is incomplete.


      if (typeof val === 'string') {
        val = val.trim();
      }

      styleMap[camelize$1(key)] = val;
    }

    return styleMap;
  }

  function mergeData$1() {
    const mergeTarget = {};
    let i = arguments.length;
    let prop;
    let event; // Allow for variadic argument length.

    while (i--) {
      // Iterate through the data properties and execute merge strategies
      // Object.keys eliminates need for hasOwnProperty call
      for (prop of Object.keys(arguments[i])) {
        switch (prop) {
          // Array merge strategy (array concatenation)
          case 'class':
          case 'style':
          case 'directives':
            if (!arguments[i][prop]) {
              break;
            }

            if (!Array.isArray(mergeTarget[prop])) {
              mergeTarget[prop] = [];
            }

            if (prop === 'style') {
              let style;

              if (Array.isArray(arguments[i].style)) {
                style = arguments[i].style;
              } else {
                style = [arguments[i].style];
              }

              for (let j = 0; j < style.length; j++) {
                const s = style[j];

                if (typeof s === 'string') {
                  style[j] = parseStyle(s);
                }
              }

              arguments[i].style = style;
            } // Repackaging in an array allows Vue runtime
            // to merge class/style bindings regardless of type.


            mergeTarget[prop] = mergeTarget[prop].concat(arguments[i][prop]);
            break;
          // Space delimited string concatenation strategy

          case 'staticClass':
            if (!arguments[i][prop]) {
              break;
            }

            if (mergeTarget[prop] === undefined) {
              mergeTarget[prop] = '';
            }

            if (mergeTarget[prop]) {
              // Not an empty string, so concatenate
              mergeTarget[prop] += ' ';
            }

            mergeTarget[prop] += arguments[i][prop].trim();
            break;
          // Object, the properties of which to merge via array merge strategy (array concatenation).
          // Callback merge strategy merges callbacks to the beginning of the array,
          // so that the last defined callback will be invoked first.
          // This is done since to mimic how Object.assign merging
          // uses the last given value to assign.

          case 'on':
          case 'nativeOn':
            if (!arguments[i][prop]) {
              break;
            }

            if (!mergeTarget[prop]) {
              mergeTarget[prop] = {};
            }

            const listeners = mergeTarget[prop];

            for (event of Object.keys(arguments[i][prop] || {})) {
              // Concat function to array of functions if callback present.
              if (listeners[event]) {
                // Insert current iteration data in beginning of merged array.
                listeners[event] = Array().concat( // eslint-disable-line
                listeners[event], arguments[i][prop][event]);
              } else {
                // Straight assign.
                listeners[event] = arguments[i][prop][event];
              }
            }

            break;
          // Object merge strategy

          case 'attrs':
          case 'props':
          case 'domProps':
          case 'scopedSlots':
          case 'staticStyle':
          case 'hook':
          case 'transition':
            if (!arguments[i][prop]) {
              break;
            }

            if (!mergeTarget[prop]) {
              mergeTarget[prop] = {};
            }

            mergeTarget[prop] = { ...arguments[i][prop],
              ...mergeTarget[prop]
            };
            break;
          // Reassignment strategy (no merge)

          case 'slot':
          case 'key':
          case 'ref':
          case 'tag':
          case 'show':
          case 'keepAlive':
          default:
            if (!mergeTarget[prop]) {
              mergeTarget[prop] = arguments[i][prop];
            }

        }
      }
    }

    return mergeTarget;
  }

  function mergeTransitions(dest = [], ...transitions) {
    /* eslint-disable-next-line no-array-constructor */
    return Array().concat(dest, ...transitions);
  }

  function createSimpleTransition(name, origin = 'top center 0', mode) {
    return {
      name,
      functional: true,
      props: {
        group: {
          type: Boolean,
          default: false
        },
        hideOnLeave: {
          type: Boolean,
          default: false
        },
        leaveAbsolute: {
          type: Boolean,
          default: false
        },
        mode: {
          type: String,
          default: mode
        },
        origin: {
          type: String,
          default: origin
        }
      },

      render(h, context) {
        const tag = `transition${context.props.group ? '-group' : ''}`;
        const data = {
          props: {
            name,
            mode: context.props.mode
          },
          on: {
            beforeEnter(el) {
              el.style.transformOrigin = context.props.origin;
              el.style.webkitTransformOrigin = context.props.origin;
            }

          }
        };

        if (context.props.leaveAbsolute) {
          data.on.leave = mergeTransitions(data.on.leave, el => el.style.position = 'absolute');
        }

        if (context.props.hideOnLeave) {
          data.on.leave = mergeTransitions(data.on.leave, el => el.style.display = 'none');
        }

        return h(tag, mergeData$1(context.data, data), context.children);
      }

    };
  }
  function createJavascriptTransition(name, functions, mode = 'in-out') {
    return {
      name,
      functional: true,
      props: {
        mode: {
          type: String,
          default: mode
        }
      },

      render(h, context) {
        return h('transition', mergeData$1(context.data, {
          props: {
            name
          },
          on: functions
        }), context.children);
      }

    };
  }

  function ExpandTransitionGenerator (expandedParentClass = '', x = false) {
    const sizeProperty = x ? 'width' : 'height';
    const offsetProperty = `offset${upperFirst(sizeProperty)}`;
    return {
      beforeEnter(el) {
        el._parent = el.parentNode;
        el._initialStyle = {
          transition: el.style.transition,
          visibility: el.style.visibility,
          overflow: el.style.overflow,
          [sizeProperty]: el.style[sizeProperty]
        };
      },

      enter(el) {
        const initialStyle = el._initialStyle;
        const offset = `${el[offsetProperty]}px`;
        el.style.setProperty('transition', 'none', 'important');
        el.style.visibility = 'hidden';
        el.style.visibility = initialStyle.visibility;
        el.style.overflow = 'hidden';
        el.style[sizeProperty] = '0';
        void el.offsetHeight; // force reflow

        el.style.transition = initialStyle.transition;

        if (expandedParentClass && el._parent) {
          el._parent.classList.add(expandedParentClass);
        }

        requestAnimationFrame(() => {
          el.style[sizeProperty] = offset;
        });
      },

      afterEnter: resetStyles,
      enterCancelled: resetStyles,

      leave(el) {
        el._initialStyle = {
          transition: '',
          visibility: '',
          overflow: el.style.overflow,
          [sizeProperty]: el.style[sizeProperty]
        };
        el.style.overflow = 'hidden';
        el.style[sizeProperty] = `${el[offsetProperty]}px`;
        void el.offsetHeight; // force reflow

        requestAnimationFrame(() => el.style[sizeProperty] = '0');
      },

      afterLeave,
      leaveCancelled: afterLeave
    };

    function afterLeave(el) {
      if (expandedParentClass && el._parent) {
        el._parent.classList.remove(expandedParentClass);
      }

      resetStyles(el);
    }

    function resetStyles(el) {
      const size = el._initialStyle[sizeProperty];
      el.style.overflow = el._initialStyle.overflow;
      if (size != null) el.style[sizeProperty] = size;
      delete el._initialStyle;
    }
  }

  const VFadeTransition = createSimpleTransition('fade-transition');
  const VSlideXTransition = createSimpleTransition('slide-x-transition');

  const VExpandTransition = createJavascriptTransition('expand-transition', ExpandTransitionGenerator());
  const VExpandXTransition = createJavascriptTransition('expand-x-transition', ExpandTransitionGenerator('', true));

  // Styles
  /* @vue/component */

  var VChip = mixins(Colorable, Sizeable, Routable, Themeable, factory$2('chipGroup'), factory$1('inputValue')).extend({
    name: 'v-chip',
    props: {
      active: {
        type: Boolean,
        default: true
      },
      activeClass: {
        type: String,

        default() {
          if (!this.chipGroup) return '';
          return this.chipGroup.activeClass;
        }

      },
      close: Boolean,
      closeIcon: {
        type: String,
        default: '$delete'
      },
      disabled: Boolean,
      draggable: Boolean,
      filter: Boolean,
      filterIcon: {
        type: String,
        default: '$complete'
      },
      label: Boolean,
      link: Boolean,
      outlined: Boolean,
      pill: Boolean,
      tag: {
        type: String,
        default: 'span'
      },
      textColor: String,
      value: null
    },
    data: () => ({
      proxyClass: 'v-chip--active'
    }),
    computed: {
      classes() {
        return {
          'v-chip': true,
          ...Routable.options.computed.classes.call(this),
          'v-chip--clickable': this.isClickable,
          'v-chip--disabled': this.disabled,
          'v-chip--draggable': this.draggable,
          'v-chip--label': this.label,
          'v-chip--link': this.isLink,
          'v-chip--no-color': !this.color,
          'v-chip--outlined': this.outlined,
          'v-chip--pill': this.pill,
          'v-chip--removable': this.hasClose,
          ...this.themeClasses,
          ...this.sizeableClasses,
          ...this.groupClasses
        };
      },

      hasClose() {
        return Boolean(this.close);
      },

      isClickable() {
        return Boolean(Routable.options.computed.isClickable.call(this) || this.chipGroup);
      }

    },

    created() {
      const breakingProps = [['outline', 'outlined'], ['selected', 'input-value'], ['value', 'active'], ['@input', '@active.sync']];
      /* istanbul ignore next */

      breakingProps.forEach(([original, replacement]) => {
        if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
      });
    },

    methods: {
      click(e) {
        this.$emit('click', e);
        this.chipGroup && this.toggle();
      },

      genFilter() {
        const children = [];

        if (this.isActive) {
          children.push(this.$createElement(VIcon$1, {
            staticClass: 'v-chip__filter',
            props: {
              left: true
            }
          }, this.filterIcon));
        }

        return this.$createElement(VExpandXTransition, children);
      },

      genClose() {
        return this.$createElement(VIcon$1, {
          staticClass: 'v-chip__close',
          props: {
            right: true,
            size: 18
          },
          on: {
            click: e => {
              e.stopPropagation();
              e.preventDefault();
              this.$emit('click:close');
              this.$emit('update:active', false);
            }
          }
        }, this.closeIcon);
      },

      genContent() {
        return this.$createElement('span', {
          staticClass: 'v-chip__content'
        }, [this.filter && this.genFilter(), this.$slots.default, this.hasClose && this.genClose()]);
      }

    },

    render(h) {
      const children = [this.genContent()];
      let {
        tag,
        data
      } = this.generateRouteLink();
      data.attrs = { ...data.attrs,
        draggable: this.draggable ? 'true' : undefined,
        tabindex: this.chipGroup && !this.disabled ? 0 : data.attrs.tabindex
      };
      data.directives.push({
        name: 'show',
        value: this.active
      });
      data = this.setBackgroundColor(this.color, data);
      const color = this.textColor || this.outlined && this.color;
      return h(tag, this.setTextColor(color, data), children);
    }

  });

  // Mixins
  /* @vue/component */

  var VThemeProvider = Themeable.extend({
    name: 'v-theme-provider',
    props: {
      root: Boolean
    },
    computed: {
      isDark() {
        return this.root ? this.rootIsDark : Themeable.options.computed.isDark.call(this);
      }

    },

    render() {
      /* istanbul ignore next */
      return this.$slots.default && this.$slots.default.find(node => !node.isComment && node.text !== ' ');
    }

  });

  /**
   * Delayable
   *
   * @mixin
   *
   * Changes the open or close delay time for elements
   */

  var Delayable = Vue.extend().extend({
    name: 'delayable',
    props: {
      openDelay: {
        type: [Number, String],
        default: 0
      },
      closeDelay: {
        type: [Number, String],
        default: 0
      }
    },
    data: () => ({
      openTimeout: undefined,
      closeTimeout: undefined
    }),
    methods: {
      /**
       * Clear any pending delay timers from executing
       */
      clearDelay() {
        clearTimeout(this.openTimeout);
        clearTimeout(this.closeTimeout);
      },

      /**
       * Runs callback after a specified delay
       */
      runDelay(type, cb) {
        this.clearDelay();
        const delay = parseInt(this[`${type}Delay`], 10);
        this[`${type}Timeout`] = setTimeout(cb || (() => {
          this.isActive = {
            open: true,
            close: false
          }[type];
        }), delay);
      }

    }
  });

  // Mixins
  const baseMixins$2 = mixins(Delayable, Toggleable);
  /* @vue/component */

  var Activatable = baseMixins$2.extend({
    name: 'activatable',
    props: {
      activator: {
        default: null,
        validator: val => {
          return ['string', 'object'].includes(typeof val);
        }
      },
      disabled: Boolean,
      internalActivator: Boolean,
      openOnHover: Boolean
    },
    data: () => ({
      // Do not use this directly, call getActivator() instead
      activatorElement: null,
      activatorNode: [],
      events: ['click', 'mouseenter', 'mouseleave'],
      listeners: {}
    }),
    watch: {
      activator: 'resetActivator',
      openOnHover: 'resetActivator'
    },

    mounted() {
      const slotType = getSlotType(this, 'activator', true);

      if (slotType && ['v-slot', 'normal'].includes(slotType)) {
        consoleError(`The activator slot must be bound, try '<template v-slot:activator="{ on }"><v-btn v-on="on">'`, this);
      }

      this.addActivatorEvents();
    },

    beforeDestroy() {
      this.removeActivatorEvents();
    },

    methods: {
      addActivatorEvents() {
        if (!this.activator || this.disabled || !this.getActivator()) return;
        this.listeners = this.genActivatorListeners();
        const keys = Object.keys(this.listeners);

        for (const key of keys) {
          this.getActivator().addEventListener(key, this.listeners[key]);
        }
      },

      genActivator() {
        const node = getSlot(this, 'activator', Object.assign(this.getValueProxy(), {
          on: this.genActivatorListeners(),
          attrs: this.genActivatorAttributes()
        })) || [];
        this.activatorNode = node;
        return node;
      },

      genActivatorAttributes() {
        return {
          role: 'button',
          'aria-haspopup': true,
          'aria-expanded': String(this.isActive)
        };
      },

      genActivatorListeners() {
        if (this.disabled) return {};
        const listeners = {};

        if (this.openOnHover) {
          listeners.mouseenter = e => {
            this.getActivator(e);
            this.runDelay('open');
          };

          listeners.mouseleave = e => {
            this.getActivator(e);
            this.runDelay('close');
          };
        } else {
          listeners.click = e => {
            const activator = this.getActivator(e);
            if (activator) activator.focus();
            e.stopPropagation();
            this.isActive = !this.isActive;
          };
        }

        return listeners;
      },

      getActivator(e) {
        // If we've already fetched the activator, re-use
        if (this.activatorElement) return this.activatorElement;
        let activator = null;

        if (this.activator) {
          const target = this.internalActivator ? this.$el : document;

          if (typeof this.activator === 'string') {
            // Selector
            activator = target.querySelector(this.activator);
          } else if (this.activator.$el) {
            // Component (ref)
            activator = this.activator.$el;
          } else {
            // HTMLElement | Element
            activator = this.activator;
          }
        } else if (this.activatorNode.length === 1 || this.activatorNode.length && !e) {
          // Use the contents of the activator slot
          // There's either only one element in it or we
          // don't have a click event to use as a last resort
          const vm = this.activatorNode[0].componentInstance;

          if (vm && vm.$options.mixins && //                         Activatable is indirectly used via Menuable
          vm.$options.mixins.some(m => m.options && ['activatable', 'menuable'].includes(m.options.name))) {
            // Activator is actually another activatible component, use its activator (#8846)
            activator = vm.getActivator();
          } else {
            activator = this.activatorNode[0].elm;
          }
        } else if (e) {
          // Activated by a click event
          activator = e.currentTarget || e.target;
        }

        this.activatorElement = activator;
        return this.activatorElement;
      },

      getContentSlot() {
        return getSlot(this, 'default', this.getValueProxy(), true);
      },

      getValueProxy() {
        const self = this;
        return {
          get value() {
            return self.isActive;
          },

          set value(isActive) {
            self.isActive = isActive;
          }

        };
      },

      removeActivatorEvents() {
        if (!this.activator || !this.activatorElement) return;
        const keys = Object.keys(this.listeners);

        for (const key of keys) {
          this.activatorElement.removeEventListener(key, this.listeners[key]);
        }

        this.listeners = {};
      },

      resetActivator() {
        this.removeActivatorEvents();
        this.activatorElement = null;
        this.getActivator();
        this.addActivatorEvents();
      }

    }
  });

  function searchChildren(children) {
    const results = [];

    for (let index = 0; index < children.length; index++) {
      const child = children[index];

      if (child.isActive && child.isDependent) {
        results.push(child);
      } else {
        results.push(...searchChildren(child.$children));
      }
    }

    return results;
  }
  /* @vue/component */


  var Dependent = mixins().extend({
    name: 'dependent',

    data() {
      return {
        closeDependents: true,
        isActive: false,
        isDependent: true
      };
    },

    watch: {
      isActive(val) {
        if (val) return;
        const openDependents = this.getOpenDependents();

        for (let index = 0; index < openDependents.length; index++) {
          openDependents[index].isActive = false;
        }
      }

    },
    methods: {
      getOpenDependents() {
        if (this.closeDependents) return searchChildren(this.$children);
        return [];
      },

      getOpenDependentElements() {
        const result = [];
        const openDependents = this.getOpenDependents();

        for (let index = 0; index < openDependents.length; index++) {
          result.push(...openDependents[index].getClickableDependentElements());
        }

        return result;
      },

      getClickableDependentElements() {
        const result = [this.$el];
        if (this.$refs.content) result.push(this.$refs.content);
        if (this.overlay) result.push(this.overlay.$el);
        result.push(...this.getOpenDependentElements());
        return result;
      }

    }
  });

  // Utilities
  /**
   * Bootable
   * @mixin
   *
   * Used to add lazy content functionality to components
   * Looks for change in "isActive" to automatically boot
   * Otherwise can be set manually
   */

  /* @vue/component */

  var Bootable = Vue.extend().extend({
    name: 'bootable',
    props: {
      eager: Boolean
    },
    data: () => ({
      isBooted: false
    }),
    computed: {
      hasContent() {
        return this.isBooted || this.eager || this.isActive;
      }

    },
    watch: {
      isActive() {
        this.isBooted = true;
      }

    },

    created() {
      /* istanbul ignore next */
      if ('lazy' in this.$attrs) {
        removed('lazy', this);
      }
    },

    methods: {
      showLazyContent(content) {
        return this.hasContent && content ? content() : [this.$createElement()];
      }

    }
  });

  // Mixins

  function validateAttachTarget(val) {
    const type = typeof val;
    if (type === 'boolean' || type === 'string') return true;
    return val.nodeType === Node.ELEMENT_NODE;
  }
  /* @vue/component */


  var Detachable = mixins(Bootable).extend({
    name: 'detachable',
    props: {
      attach: {
        default: false,
        validator: validateAttachTarget
      },
      contentClass: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      activatorNode: null,
      hasDetached: false
    }),
    watch: {
      attach() {
        this.hasDetached = false;
        this.initDetach();
      },

      hasContent() {
        this.$nextTick(this.initDetach);
      }

    },

    beforeMount() {
      this.$nextTick(() => {
        if (this.activatorNode) {
          const activator = Array.isArray(this.activatorNode) ? this.activatorNode : [this.activatorNode];
          activator.forEach(node => {
            if (!node.elm) return;
            if (!this.$el.parentNode) return;
            const target = this.$el === this.$el.parentNode.firstChild ? this.$el : this.$el.nextSibling;
            this.$el.parentNode.insertBefore(node.elm, target);
          });
        }
      });
    },

    mounted() {
      this.hasContent && this.initDetach();
    },

    deactivated() {
      this.isActive = false;
    },

    beforeDestroy() {
      // IE11 Fix
      try {
        if (this.$refs.content && this.$refs.content.parentNode) {
          this.$refs.content.parentNode.removeChild(this.$refs.content);
        }

        if (this.activatorNode) {
          const activator = Array.isArray(this.activatorNode) ? this.activatorNode : [this.activatorNode];
          activator.forEach(node => {
            node.elm && node.elm.parentNode && node.elm.parentNode.removeChild(node.elm);
          });
        }
      } catch (e) {
        console.log(e);
      }
    },

    methods: {
      getScopeIdAttrs() {
        const scopeId = getObjectValueByPath(this.$vnode, 'context.$options._scopeId');
        return scopeId && {
          [scopeId]: ''
        };
      },

      initDetach() {
        if (this._isDestroyed || !this.$refs.content || this.hasDetached || // Leave menu in place if attached
        // and dev has not changed target
        this.attach === '' || // If used as a boolean prop (<v-menu attach>)
        this.attach === true || // If bound to a boolean (<v-menu :attach="true">)
        this.attach === 'attach' // If bound as boolean prop in pug (v-menu(attach))
        ) return;
        let target;

        if (this.attach === false) {
          // Default, detach to app
          target = document.querySelector('[data-app]');
        } else if (typeof this.attach === 'string') {
          // CSS selector
          target = document.querySelector(this.attach);
        } else {
          // DOM Element
          target = this.attach;
        }

        if (!target) {
          consoleWarn(`Unable to locate target ${this.attach || '[data-app]'}`, this);
          return;
        }

        target.appendChild(this.$refs.content);
        this.hasDetached = true;
      }

    }
  });

  /* @vue/component */

  var Stackable = Vue.extend().extend({
    name: 'stackable',

    data() {
      return {
        stackElement: null,
        stackExclude: null,
        stackMinZIndex: 0,
        isActive: false
      };
    },

    computed: {
      activeZIndex() {
        if (typeof window === 'undefined') return 0;
        const content = this.stackElement || this.$refs.content; // Return current zindex if not active

        const index = !this.isActive ? getZIndex(content) : this.getMaxZIndex(this.stackExclude || [content]) + 2;
        if (index == null) return index; // Return max current z-index (excluding self) + 2
        // (2 to leave room for an overlay below, if needed)

        return parseInt(index);
      }

    },
    methods: {
      getMaxZIndex(exclude = []) {
        const base = this.$el; // Start with lowest allowed z-index or z-index of
        // base component's element, whichever is greater

        const zis = [this.stackMinZIndex, getZIndex(base)]; // Convert the NodeList to an array to
        // prevent an Edge bug with Symbol.iterator
        // https://github.com/vuetifyjs/vuetify/issues/2146

        const activeElements = [...document.getElementsByClassName('v-menu__content--active'), ...document.getElementsByClassName('v-dialog__content--active')]; // Get z-index for all active dialogs

        for (let index = 0; index < activeElements.length; index++) {
          if (!exclude.includes(activeElements[index])) {
            zis.push(getZIndex(activeElements[index]));
          }
        }

        return Math.max(...zis);
      }

    }
  });

  // Mixins

  const baseMixins$3 = mixins(Stackable, Positionable, Activatable);
  /* @vue/component */

  var Menuable = baseMixins$3.extend().extend({
    name: 'menuable',
    props: {
      allowOverflow: Boolean,
      light: Boolean,
      dark: Boolean,
      maxWidth: {
        type: [Number, String],
        default: 'auto'
      },
      minWidth: [Number, String],
      nudgeBottom: {
        type: [Number, String],
        default: 0
      },
      nudgeLeft: {
        type: [Number, String],
        default: 0
      },
      nudgeRight: {
        type: [Number, String],
        default: 0
      },
      nudgeTop: {
        type: [Number, String],
        default: 0
      },
      nudgeWidth: {
        type: [Number, String],
        default: 0
      },
      offsetOverflow: Boolean,
      openOnClick: Boolean,
      positionX: {
        type: Number,
        default: null
      },
      positionY: {
        type: Number,
        default: null
      },
      zIndex: {
        type: [Number, String],
        default: null
      }
    },
    data: () => ({
      absoluteX: 0,
      absoluteY: 0,
      activatedBy: null,
      activatorFixed: false,
      dimensions: {
        activator: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 0,
          height: 0,
          offsetTop: 0,
          scrollHeight: 0,
          offsetLeft: 0
        },
        content: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 0,
          height: 0,
          offsetTop: 0,
          scrollHeight: 0
        }
      },
      hasJustFocused: false,
      hasWindow: false,
      inputActivator: false,
      isContentActive: false,
      pageWidth: 0,
      pageYOffset: 0,
      stackClass: 'v-menu__content--active',
      stackMinZIndex: 6
    }),
    computed: {
      computedLeft() {
        const a = this.dimensions.activator;
        const c = this.dimensions.content;
        const activatorLeft = (this.attach !== false ? a.offsetLeft : a.left) || 0;
        const minWidth = Math.max(a.width, c.width);
        let left = 0;
        left += this.left ? activatorLeft - (minWidth - a.width) : activatorLeft;

        if (this.offsetX) {
          const maxWidth = isNaN(Number(this.maxWidth)) ? a.width : Math.min(a.width, Number(this.maxWidth));
          left += this.left ? -maxWidth : a.width;
        }

        if (this.nudgeLeft) left -= parseInt(this.nudgeLeft);
        if (this.nudgeRight) left += parseInt(this.nudgeRight);
        return left;
      },

      computedTop() {
        const a = this.dimensions.activator;
        const c = this.dimensions.content;
        let top = 0;
        if (this.top) top += a.height - c.height;
        if (this.attach !== false) top += a.offsetTop;else top += a.top + this.pageYOffset;
        if (this.offsetY) top += this.top ? -a.height : a.height;
        if (this.nudgeTop) top -= parseInt(this.nudgeTop);
        if (this.nudgeBottom) top += parseInt(this.nudgeBottom);
        return top;
      },

      hasActivator() {
        return !!this.$slots.activator || !!this.$scopedSlots.activator || !!this.activator || !!this.inputActivator;
      }

    },
    watch: {
      disabled(val) {
        val && this.callDeactivate();
      },

      isActive(val) {
        if (this.disabled) return;
        val ? this.callActivate() : this.callDeactivate();
      },

      positionX: 'updateDimensions',
      positionY: 'updateDimensions'
    },

    beforeMount() {
      this.hasWindow = typeof window !== 'undefined';
    },

    methods: {
      absolutePosition() {
        return {
          offsetTop: 0,
          offsetLeft: 0,
          scrollHeight: 0,
          top: this.positionY || this.absoluteY,
          bottom: this.positionY || this.absoluteY,
          left: this.positionX || this.absoluteX,
          right: this.positionX || this.absoluteX,
          height: 0,
          width: 0
        };
      },

      activate() {},

      calcLeft(menuWidth) {
        return convertToUnit(this.attach !== false ? this.computedLeft : this.calcXOverflow(this.computedLeft, menuWidth));
      },

      calcTop() {
        return convertToUnit(this.attach !== false ? this.computedTop : this.calcYOverflow(this.computedTop));
      },

      calcXOverflow(left, menuWidth) {
        const xOverflow = left + menuWidth - this.pageWidth + 12;

        if ((!this.left || this.right) && xOverflow > 0) {
          left = Math.max(left - xOverflow, 0);
        } else {
          left = Math.max(left, 12);
        }

        return left + this.getOffsetLeft();
      },

      calcYOverflow(top) {
        const documentHeight = this.getInnerHeight();
        const toTop = this.pageYOffset + documentHeight;
        const activator = this.dimensions.activator;
        const contentHeight = this.dimensions.content.height;
        const totalHeight = top + contentHeight;
        const isOverflowing = toTop < totalHeight; // If overflowing bottom and offset
        // TODO: set 'bottom' position instead of 'top'

        if (isOverflowing && this.offsetOverflow && // If we don't have enough room to offset
        // the overflow, don't offset
        activator.top > contentHeight) {
          top = this.pageYOffset + (activator.top - contentHeight); // If overflowing bottom
        } else if (isOverflowing && !this.allowOverflow) {
          top = toTop - contentHeight - 12; // If overflowing top
        } else if (top < this.pageYOffset && !this.allowOverflow) {
          top = this.pageYOffset + 12;
        }

        return top < 12 ? 12 : top;
      },

      callActivate() {
        if (!this.hasWindow) return;
        this.activate();
      },

      callDeactivate() {
        this.isContentActive = false;
        this.deactivate();
      },

      checkForPageYOffset() {
        if (this.hasWindow) {
          this.pageYOffset = this.activatorFixed ? 0 : this.getOffsetTop();
        }
      },

      checkActivatorFixed() {
        if (this.attach !== false) return;
        let el = this.getActivator();

        while (el) {
          if (window.getComputedStyle(el).position === 'fixed') {
            this.activatorFixed = true;
            return;
          }

          el = el.offsetParent;
        }

        this.activatorFixed = false;
      },

      deactivate() {},

      genActivatorListeners() {
        const listeners = Activatable.options.methods.genActivatorListeners.call(this);
        const onClick = listeners.click;

        listeners.click = e => {
          if (this.openOnClick) {
            onClick && onClick(e);
          }

          this.absoluteX = e.clientX;
          this.absoluteY = e.clientY;
        };

        return listeners;
      },

      getInnerHeight() {
        if (!this.hasWindow) return 0;
        return window.innerHeight || document.documentElement.clientHeight;
      },

      getOffsetLeft() {
        if (!this.hasWindow) return 0;
        return window.pageXOffset || document.documentElement.scrollLeft;
      },

      getOffsetTop() {
        if (!this.hasWindow) return 0;
        return window.pageYOffset || document.documentElement.scrollTop;
      },

      getRoundedBoundedClientRect(el) {
        const rect = el.getBoundingClientRect();
        return {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          bottom: Math.round(rect.bottom),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      },

      measure(el) {
        if (!el || !this.hasWindow) return null;
        const rect = this.getRoundedBoundedClientRect(el); // Account for activator margin

        if (this.attach !== false) {
          const style = window.getComputedStyle(el);
          rect.left = parseInt(style.marginLeft);
          rect.top = parseInt(style.marginTop);
        }

        return rect;
      },

      sneakPeek(cb) {
        requestAnimationFrame(() => {
          const el = this.$refs.content;

          if (!el || el.style.display !== 'none') {
            cb();
            return;
          }

          el.style.display = 'inline-block';
          cb();
          el.style.display = 'none';
        });
      },

      startTransition() {
        return new Promise(resolve => requestAnimationFrame(() => {
          this.isContentActive = this.hasJustFocused = this.isActive;
          resolve();
        }));
      },

      updateDimensions() {
        this.hasWindow = typeof window !== 'undefined';
        this.checkActivatorFixed();
        this.checkForPageYOffset();
        this.pageWidth = document.documentElement.clientWidth;
        const dimensions = {
          activator: { ...this.dimensions.activator
          },
          content: { ...this.dimensions.content
          }
        }; // Activator should already be shown

        if (!this.hasActivator || this.absolute) {
          dimensions.activator = this.absolutePosition();
        } else {
          const activator = this.getActivator();
          if (!activator) return;
          dimensions.activator = this.measure(activator);
          dimensions.activator.offsetLeft = activator.offsetLeft;

          if (this.attach !== false) {
            // account for css padding causing things to not line up
            // this is mostly for v-autocomplete, hopefully it won't break anything
            dimensions.activator.offsetTop = activator.offsetTop;
          } else {
            dimensions.activator.offsetTop = 0;
          }
        } // Display and hide to get dimensions


        this.sneakPeek(() => {
          this.$refs.content && (dimensions.content = this.measure(this.$refs.content));
          this.dimensions = dimensions;
        });
      }

    }
  });

  /* @vue/component */

  var Returnable = Vue.extend({
    name: 'returnable',
    props: {
      returnValue: null
    },
    data: () => ({
      isActive: false,
      originalValue: null
    }),
    watch: {
      isActive(val) {
        if (val) {
          this.originalValue = this.returnValue;
        } else {
          this.$emit('update:return-value', this.originalValue);
        }
      }

    },
    methods: {
      save(value) {
        this.originalValue = value;
        setTimeout(() => {
          this.isActive = false;
        });
      }

    }
  });

  // Styles
  const baseMixins$4 = mixins(Dependent, Delayable, Detachable, Menuable, Returnable, Toggleable, Themeable);
  /* @vue/component */

  var VMenu = baseMixins$4.extend({
    name: 'v-menu',

    provide() {
      return {
        isInMenu: true,
        // Pass theme through to default slot
        theme: this.theme
      };
    },

    directives: {
      ClickOutside,
      Resize
    },
    props: {
      auto: Boolean,
      closeOnClick: {
        type: Boolean,
        default: true
      },
      closeOnContentClick: {
        type: Boolean,
        default: true
      },
      disabled: Boolean,
      disableKeys: Boolean,
      maxHeight: {
        type: [Number, String],
        default: 'auto'
      },
      offsetX: Boolean,
      offsetY: Boolean,
      openOnClick: {
        type: Boolean,
        default: true
      },
      openOnHover: Boolean,
      origin: {
        type: String,
        default: 'top left'
      },
      transition: {
        type: [Boolean, String],
        default: 'v-menu-transition'
      }
    },

    data() {
      return {
        calculatedTopAuto: 0,
        defaultOffset: 8,
        hasJustFocused: false,
        listIndex: -1,
        resizeTimeout: 0,
        selectedIndex: null,
        tiles: []
      };
    },

    computed: {
      activeTile() {
        return this.tiles[this.listIndex];
      },

      calculatedLeft() {
        const menuWidth = Math.max(this.dimensions.content.width, parseFloat(this.calculatedMinWidth));
        if (!this.auto) return this.calcLeft(menuWidth) || '0';
        return convertToUnit(this.calcXOverflow(this.calcLeftAuto(), menuWidth)) || '0';
      },

      calculatedMaxHeight() {
        const height = this.auto ? '200px' : convertToUnit(this.maxHeight);
        return height || '0';
      },

      calculatedMaxWidth() {
        return convertToUnit(this.maxWidth) || '0';
      },

      calculatedMinWidth() {
        if (this.minWidth) {
          return convertToUnit(this.minWidth) || '0';
        }

        const minWidth = Math.min(this.dimensions.activator.width + Number(this.nudgeWidth) + (this.auto ? 16 : 0), Math.max(this.pageWidth - 24, 0));
        const calculatedMaxWidth = isNaN(parseInt(this.calculatedMaxWidth)) ? minWidth : parseInt(this.calculatedMaxWidth);
        return convertToUnit(Math.min(calculatedMaxWidth, minWidth)) || '0';
      },

      calculatedTop() {
        const top = !this.auto ? this.calcTop() : convertToUnit(this.calcYOverflow(this.calculatedTopAuto));
        return top || '0';
      },

      hasClickableTiles() {
        return Boolean(this.tiles.find(tile => tile.tabIndex > -1));
      },

      styles() {
        return {
          maxHeight: this.calculatedMaxHeight,
          minWidth: this.calculatedMinWidth,
          maxWidth: this.calculatedMaxWidth,
          top: this.calculatedTop,
          left: this.calculatedLeft,
          transformOrigin: this.origin,
          zIndex: this.zIndex || this.activeZIndex
        };
      }

    },
    watch: {
      isActive(val) {
        if (!val) this.listIndex = -1;
      },

      isContentActive(val) {
        this.hasJustFocused = val;
      },

      listIndex(next, prev) {
        if (next in this.tiles) {
          const tile = this.tiles[next];
          tile.classList.add('v-list-item--highlighted');
          this.$refs.content.scrollTop = tile.offsetTop - tile.clientHeight;
        }

        prev in this.tiles && this.tiles[prev].classList.remove('v-list-item--highlighted');
      }

    },

    created() {
      /* istanbul ignore next */
      if (this.$attrs.hasOwnProperty('full-width')) {
        removed('full-width', this);
      }
    },

    mounted() {
      this.isActive && this.callActivate();
    },

    methods: {
      activate() {
        // Update coordinates and dimensions of menu
        // and its activator
        this.updateDimensions(); // Start the transition

        requestAnimationFrame(() => {
          // Once transitioning, calculate scroll and top position
          this.startTransition().then(() => {
            if (this.$refs.content) {
              this.calculatedTopAuto = this.calcTopAuto();
              this.auto && (this.$refs.content.scrollTop = this.calcScrollPosition());
            }
          });
        });
      },

      calcScrollPosition() {
        const $el = this.$refs.content;
        const activeTile = $el.querySelector('.v-list-item--active');
        const maxScrollTop = $el.scrollHeight - $el.offsetHeight;
        return activeTile ? Math.min(maxScrollTop, Math.max(0, activeTile.offsetTop - $el.offsetHeight / 2 + activeTile.offsetHeight / 2)) : $el.scrollTop;
      },

      calcLeftAuto() {
        return parseInt(this.dimensions.activator.left - this.defaultOffset * 2);
      },

      calcTopAuto() {
        const $el = this.$refs.content;
        const activeTile = $el.querySelector('.v-list-item--active');

        if (!activeTile) {
          this.selectedIndex = null;
        }

        if (this.offsetY || !activeTile) {
          return this.computedTop;
        }

        this.selectedIndex = Array.from(this.tiles).indexOf(activeTile);
        const tileDistanceFromMenuTop = activeTile.offsetTop - this.calcScrollPosition();
        const firstTileOffsetTop = $el.querySelector('.v-list-item').offsetTop;
        return this.computedTop - tileDistanceFromMenuTop - firstTileOffsetTop - 1;
      },

      changeListIndex(e) {
        // For infinite scroll and autocomplete, re-evaluate children
        this.getTiles();

        if (!this.isActive || !this.hasClickableTiles) {
          return;
        } else if (e.keyCode === keyCodes.tab) {
          this.isActive = false;
          return;
        } else if (e.keyCode === keyCodes.down) {
          this.nextTile();
        } else if (e.keyCode === keyCodes.up) {
          this.prevTile();
        } else if (e.keyCode === keyCodes.enter && this.listIndex !== -1) {
          this.tiles[this.listIndex].click();
        } else {
          return;
        } // One of the conditions was met, prevent default action (#2988)


        e.preventDefault();
      },

      closeConditional(e) {
        const target = e.target;
        return this.isActive && !this._isDestroyed && this.closeOnClick && !this.$refs.content.contains(target);
      },

      genActivatorAttributes() {
        const attributes = Activatable.options.methods.genActivatorAttributes.call(this);

        if (this.activeTile && this.activeTile.id) {
          return { ...attributes,
            'aria-activedescendant': this.activeTile.id
          };
        }

        return attributes;
      },

      genActivatorListeners() {
        const listeners = Menuable.options.methods.genActivatorListeners.call(this);

        if (!this.disableKeys) {
          listeners.keydown = this.onKeyDown;
        }

        return listeners;
      },

      genTransition() {
        const content = this.genContent();
        if (!this.transition) return content;
        return this.$createElement('transition', {
          props: {
            name: this.transition
          }
        }, [content]);
      },

      genDirectives() {
        const directives = [{
          name: 'show',
          value: this.isContentActive
        }]; // Do not add click outside for hover menu

        if (!this.openOnHover && this.closeOnClick) {
          directives.push({
            name: 'click-outside',
            value: () => {
              this.isActive = false;
            },
            args: {
              closeConditional: this.closeConditional,
              include: () => [this.$el, ...this.getOpenDependentElements()]
            }
          });
        }

        return directives;
      },

      genContent() {
        const options = {
          attrs: { ...this.getScopeIdAttrs(),
            role: 'role' in this.$attrs ? this.$attrs.role : 'menu'
          },
          staticClass: 'v-menu__content',
          class: { ...this.rootThemeClasses,
            'v-menu__content--auto': this.auto,
            'v-menu__content--fixed': this.activatorFixed,
            menuable__content__active: this.isActive,
            [this.contentClass.trim()]: true
          },
          style: this.styles,
          directives: this.genDirectives(),
          ref: 'content',
          on: {
            click: e => {
              const target = e.target;
              if (target.getAttribute('disabled')) return;
              if (this.closeOnContentClick) this.isActive = false;
            },
            keydown: this.onKeyDown
          }
        };

        if (!this.disabled && this.openOnHover) {
          options.on = options.on || {};
          options.on.mouseenter = this.mouseEnterHandler;
        }

        if (this.openOnHover) {
          options.on = options.on || {};
          options.on.mouseleave = this.mouseLeaveHandler;
        }

        return this.$createElement('div', options, this.getContentSlot());
      },

      getTiles() {
        if (!this.$refs.content) return;
        this.tiles = Array.from(this.$refs.content.querySelectorAll('.v-list-item'));
      },

      mouseEnterHandler() {
        this.runDelay('open', () => {
          if (this.hasJustFocused) return;
          this.hasJustFocused = true;
          this.isActive = true;
        });
      },

      mouseLeaveHandler(e) {
        // Prevent accidental re-activation
        this.runDelay('close', () => {
          if (this.$refs.content.contains(e.relatedTarget)) return;
          requestAnimationFrame(() => {
            this.isActive = false;
            this.callDeactivate();
          });
        });
      },

      nextTile() {
        const tile = this.tiles[this.listIndex + 1];

        if (!tile) {
          if (!this.tiles.length) return;
          this.listIndex = -1;
          this.nextTile();
          return;
        }

        this.listIndex++;
        if (tile.tabIndex === -1) this.nextTile();
      },

      prevTile() {
        const tile = this.tiles[this.listIndex - 1];

        if (!tile) {
          if (!this.tiles.length) return;
          this.listIndex = this.tiles.length;
          this.prevTile();
          return;
        }

        this.listIndex--;
        if (tile.tabIndex === -1) this.prevTile();
      },

      onKeyDown(e) {
        if (e.keyCode === keyCodes.esc) {
          // Wait for dependent elements to close first
          setTimeout(() => {
            this.isActive = false;
          });
          const activator = this.getActivator();
          this.$nextTick(() => activator && activator.focus());
        } else if (!this.isActive && [keyCodes.up, keyCodes.down].includes(e.keyCode)) {
          this.isActive = true;
        } // Allow for isActive watcher to generate tile list


        this.$nextTick(() => this.changeListIndex(e));
      },

      onResize() {
        if (!this.isActive) return; // Account for screen resize
        // and orientation change
        // eslint-disable-next-line no-unused-expressions

        this.$refs.content.offsetWidth;
        this.updateDimensions(); // When resizing to a smaller width
        // content width is evaluated before
        // the new activator width has been
        // set, causing it to not size properly
        // hacky but will revisit in the future

        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(this.updateDimensions, 100);
      }

    },

    render(h) {
      const data = {
        staticClass: 'v-menu',
        class: {
          'v-menu--attached': this.attach === '' || this.attach === true || this.attach === 'attach'
        },
        directives: [{
          arg: '500',
          name: 'resize',
          value: this.onResize
        }]
      };
      return h('div', data, [!this.activator && this.genActivator(), this.showLazyContent(() => [this.$createElement(VThemeProvider, {
        props: {
          root: true,
          light: this.light,
          dark: this.dark
        }
      }, [this.genTransition()])])]);
    }

  });

  var VSimpleCheckbox = Vue.extend({
    name: 'v-simple-checkbox',
    functional: true,
    directives: {
      ripple: Ripple
    },
    props: { ...Colorable.options.props,
      ...Themeable.options.props,
      disabled: Boolean,
      ripple: {
        type: Boolean,
        default: true
      },
      value: Boolean,
      indeterminate: Boolean,
      indeterminateIcon: {
        type: String,
        default: '$checkboxIndeterminate'
      },
      onIcon: {
        type: String,
        default: '$checkboxOn'
      },
      offIcon: {
        type: String,
        default: '$checkboxOff'
      }
    },

    render(h, {
      props,
      data
    }) {
      const children = [];

      if (props.ripple && !props.disabled) {
        const ripple = h('div', Colorable.options.methods.setTextColor(props.color, {
          staticClass: 'v-input--selection-controls__ripple',
          directives: [{
            name: 'ripple',
            value: {
              center: true
            }
          }]
        }));
        children.push(ripple);
      }

      let icon = props.offIcon;
      if (props.indeterminate) icon = props.indeterminateIcon;else if (props.value) icon = props.onIcon;
      children.push(h(VIcon$1, Colorable.options.methods.setTextColor(props.value && props.color, {
        props: {
          disabled: props.disabled,
          dark: props.dark,
          light: props.light
        }
      }), icon));
      const classes = {
        'v-simple-checkbox': true,
        'v-simple-checkbox--disabled': props.disabled
      };
      return h('div', { ...data,
        class: classes,
        on: {
          click: e => {
            e.stopPropagation();

            if (data.on && data.on.input && !props.disabled) {
              wrapInArray(data.on.input).forEach(f => f(!props.value));
            }
          }
        }
      }, children);
    }

  });

  // Styles
  var VDivider = Themeable.extend({
    name: 'v-divider',
    props: {
      inset: Boolean,
      vertical: Boolean
    },

    render(h) {
      // WAI-ARIA attributes
      let orientation;

      if (!this.$attrs.role || this.$attrs.role === 'separator') {
        orientation = this.vertical ? 'vertical' : 'horizontal';
      }

      return h('hr', {
        class: {
          'v-divider': true,
          'v-divider--inset': this.inset,
          'v-divider--vertical': this.vertical,
          ...this.themeClasses
        },
        attrs: {
          role: 'separator',
          'aria-orientation': orientation,
          ...this.$attrs
        },
        on: this.$listeners
      });
    }

  });

  // Styles
  var VSubheader = mixins(Themeable
  /* @vue/component */
  ).extend({
    name: 'v-subheader',
    props: {
      inset: Boolean
    },

    render(h) {
      return h('div', {
        staticClass: 'v-subheader',
        class: {
          'v-subheader--inset': this.inset,
          ...this.themeClasses
        },
        attrs: this.$attrs,
        on: this.$listeners
      }, this.$slots.default);
    }

  });

  // Styles
  /* @vue/component */

  var VList = VSheet.extend().extend({
    name: 'v-list',

    provide() {
      return {
        isInList: true,
        list: this
      };
    },

    inject: {
      isInMenu: {
        default: false
      },
      isInNav: {
        default: false
      }
    },
    props: {
      dense: Boolean,
      disabled: Boolean,
      expand: Boolean,
      flat: Boolean,
      nav: Boolean,
      rounded: Boolean,
      shaped: Boolean,
      subheader: Boolean,
      threeLine: Boolean,
      tile: {
        type: Boolean,
        default: true
      },
      twoLine: Boolean
    },
    data: () => ({
      groups: []
    }),
    computed: {
      classes() {
        return { ...VSheet.options.computed.classes.call(this),
          'v-list--dense': this.dense,
          'v-list--disabled': this.disabled,
          'v-list--flat': this.flat,
          'v-list--nav': this.nav,
          'v-list--rounded': this.rounded,
          'v-list--shaped': this.shaped,
          'v-list--subheader': this.subheader,
          'v-list--two-line': this.twoLine,
          'v-list--three-line': this.threeLine
        };
      }

    },
    methods: {
      register(content) {
        this.groups.push(content);
      },

      unregister(content) {
        const index = this.groups.findIndex(g => g._uid === content._uid);
        if (index > -1) this.groups.splice(index, 1);
      },

      listClick(uid) {
        if (this.expand) return;

        for (const group of this.groups) {
          group.toggle(uid);
        }
      }

    },

    render(h) {
      const data = {
        staticClass: 'v-list',
        class: this.classes,
        style: this.styles,
        attrs: {
          role: this.isInNav || this.isInMenu ? undefined : 'list',
          ...this.attrs$
        }
      };
      return h(this.tag, this.setBackgroundColor(this.color, data), [this.$slots.default]);
    }

  });

  // Styles
  const baseMixins$5 = mixins(Colorable, Routable, Themeable, factory$2('listItemGroup'), factory$1('inputValue'));
  /* @vue/component */

  var VListItem = baseMixins$5.extend().extend({
    name: 'v-list-item',
    directives: {
      Ripple
    },
    inheritAttrs: false,
    inject: {
      isInGroup: {
        default: false
      },
      isInList: {
        default: false
      },
      isInMenu: {
        default: false
      },
      isInNav: {
        default: false
      }
    },
    props: {
      activeClass: {
        type: String,

        default() {
          if (!this.listItemGroup) return '';
          return this.listItemGroup.activeClass;
        }

      },
      dense: Boolean,
      inactive: Boolean,
      link: Boolean,
      selectable: {
        type: Boolean
      },
      tag: {
        type: String,
        default: 'div'
      },
      threeLine: Boolean,
      twoLine: Boolean,
      value: null
    },
    data: () => ({
      proxyClass: 'v-list-item--active'
    }),
    computed: {
      classes() {
        return {
          'v-list-item': true,
          ...Routable.options.computed.classes.call(this),
          'v-list-item--dense': this.dense,
          'v-list-item--disabled': this.disabled,
          'v-list-item--link': this.isClickable && !this.inactive,
          'v-list-item--selectable': this.selectable,
          'v-list-item--three-line': this.threeLine,
          'v-list-item--two-line': this.twoLine,
          ...this.themeClasses
        };
      },

      isClickable() {
        return Boolean(Routable.options.computed.isClickable.call(this) || this.listItemGroup);
      }

    },

    created() {
      /* istanbul ignore next */
      if (this.$attrs.hasOwnProperty('avatar')) {
        removed('avatar', this);
      }
    },

    methods: {
      click(e) {
        if (e.detail) this.$el.blur();
        this.$emit('click', e);
        this.to || this.toggle();
      },

      genAttrs() {
        const attrs = {
          'aria-disabled': this.disabled ? true : undefined,
          tabindex: this.isClickable && !this.disabled ? 0 : -1,
          ...this.$attrs
        };

        if (this.$attrs.hasOwnProperty('role')) ; else if (this.isInNav) ; else if (this.isInGroup) {
          attrs.role = 'listitem';
          attrs['aria-selected'] = String(this.isActive);
        } else if (this.isInMenu) {
          attrs.role = this.isClickable ? 'menuitem' : undefined;
          attrs.id = attrs.id || `list-item-${this._uid}`;
        } else if (this.isInList) {
          attrs.role = 'listitem';
        }

        return attrs;
      }

    },

    render(h) {
      let {
        tag,
        data
      } = this.generateRouteLink();
      data.attrs = { ...data.attrs,
        ...this.genAttrs()
      };
      data[this.to ? 'nativeOn' : 'on'] = { ...data[this.to ? 'nativeOn' : 'on'],
        keydown: e => {
          /* istanbul ignore else */
          if (e.keyCode === keyCodes.enter) this.click(e);
          this.$emit('keydown', e);
        }
      };
      if (this.inactive) tag = 'div';

      if (this.inactive && this.to) {
        data.on = data.nativeOn;
        delete data.nativeOn;
      }

      const children = this.$scopedSlots.default ? this.$scopedSlots.default({
        active: this.isActive,
        toggle: this.toggle
      }) : this.$slots.default;
      return h(tag, this.setTextColor(this.color, data), children);
    }

  });

  function factory$3(prop = 'value', event = 'change') {
    return Vue.extend({
      name: 'proxyable',
      model: {
        prop,
        event
      },
      props: {
        [prop]: {
          required: false
        }
      },

      data() {
        return {
          internalLazyValue: this[prop]
        };
      },

      computed: {
        internalValue: {
          get() {
            return this.internalLazyValue;
          },

          set(val) {
            if (val === this.internalLazyValue) return;
            this.internalLazyValue = val;
            this.$emit(event, val);
          }

        }
      },
      watch: {
        [prop](val) {
          this.internalLazyValue = val;
        }

      }
    });
  }
  /* eslint-disable-next-line no-redeclare */

  const Proxyable = factory$3();

  // Types
  /* @vue/component */

  var VListItemAction = Vue.extend({
    name: 'v-list-item-action',
    functional: true,

    render(h, {
      data,
      children = []
    }) {
      data.staticClass = data.staticClass ? `v-list-item__action ${data.staticClass}` : 'v-list-item__action';
      const filteredChild = children.filter(VNode => {
        return VNode.isComment === false && VNode.text !== ' ';
      });
      if (filteredChild.length > 1) data.staticClass += ' v-list-item__action--stack';
      return h('div', data, children);
    }

  });

  const VListItemActionText = createSimpleFunctional('v-list-item__action-text', 'span');
  const VListItemContent = createSimpleFunctional('v-list-item__content', 'div');
  const VListItemTitle = createSimpleFunctional('v-list-item__title', 'div');
  const VListItemSubtitle = createSimpleFunctional('v-list-item__subtitle', 'div');

  // Components
  /* @vue/component */

  var VSelectList = mixins(Colorable, Themeable).extend({
    name: 'v-select-list',
    // https://github.com/vuejs/vue/issues/6872
    directives: {
      ripple: Ripple
    },
    props: {
      action: Boolean,
      dense: Boolean,
      hideSelected: Boolean,
      items: {
        type: Array,
        default: () => []
      },
      itemDisabled: {
        type: [String, Array, Function],
        default: 'disabled'
      },
      itemText: {
        type: [String, Array, Function],
        default: 'text'
      },
      itemValue: {
        type: [String, Array, Function],
        default: 'value'
      },
      noDataText: String,
      noFilter: Boolean,
      searchInput: null,
      selectedItems: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      parsedItems() {
        return this.selectedItems.map(item => this.getValue(item));
      },

      tileActiveClass() {
        return Object.keys(this.setTextColor(this.color).class || {}).join(' ');
      },

      staticNoDataTile() {
        const tile = {
          attrs: {
            role: undefined
          },
          on: {
            mousedown: e => e.preventDefault()
          }
        };
        return this.$createElement(VListItem, tile, [this.genTileContent(this.noDataText)]);
      }

    },
    methods: {
      genAction(item, inputValue) {
        return this.$createElement(VListItemAction, [this.$createElement(VSimpleCheckbox, {
          props: {
            color: this.color,
            value: inputValue
          },
          on: {
            input: () => this.$emit('select', item)
          }
        })]);
      },

      genDivider(props) {
        return this.$createElement(VDivider, {
          props
        });
      },

      genFilteredText(text) {
        text = text || '';
        if (!this.searchInput || this.noFilter) return escapeHTML(text);
        const {
          start,
          middle,
          end
        } = this.getMaskedCharacters(text);
        return `${escapeHTML(start)}${this.genHighlight(middle)}${escapeHTML(end)}`;
      },

      genHeader(props) {
        return this.$createElement(VSubheader, {
          props
        }, props.header);
      },

      genHighlight(text) {
        return `<span class="v-list-item__mask">${escapeHTML(text)}</span>`;
      },

      getMaskedCharacters(text) {
        const searchInput = (this.searchInput || '').toString().toLocaleLowerCase();
        const index = text.toLocaleLowerCase().indexOf(searchInput);
        if (index < 0) return {
          start: '',
          middle: text,
          end: ''
        };
        const start = text.slice(0, index);
        const middle = text.slice(index, index + searchInput.length);
        const end = text.slice(index + searchInput.length);
        return {
          start,
          middle,
          end
        };
      },

      genTile({
        item,
        index,
        disabled = null,
        value = false
      }) {
        if (!value) value = this.hasItem(item);

        if (item === Object(item)) {
          disabled = disabled !== null ? disabled : this.getDisabled(item);
        }

        const tile = {
          attrs: {
            // Default behavior in list does not
            // contain aria-selected by default
            'aria-selected': String(value),
            id: `list-item-${this._uid}-${index}`,
            role: 'option'
          },
          on: {
            mousedown: e => {
              // Prevent onBlur from being called
              e.preventDefault();
            },
            click: () => disabled || this.$emit('select', item)
          },
          props: {
            activeClass: this.tileActiveClass,
            disabled,
            ripple: true,
            inputValue: value
          }
        };

        if (!this.$scopedSlots.item) {
          return this.$createElement(VListItem, tile, [this.action && !this.hideSelected && this.items.length > 0 ? this.genAction(item, value) : null, this.genTileContent(item, index)]);
        }

        const parent = this;
        const scopedSlot = this.$scopedSlots.item({
          parent,
          item,
          attrs: { ...tile.attrs,
            ...tile.props
          },
          on: tile.on
        });
        return this.needsTile(scopedSlot) ? this.$createElement(VListItem, tile, scopedSlot) : scopedSlot;
      },

      genTileContent(item, index = 0) {
        const innerHTML = this.genFilteredText(this.getText(item));
        return this.$createElement(VListItemContent, [this.$createElement(VListItemTitle, {
          domProps: {
            innerHTML
          }
        })]);
      },

      hasItem(item) {
        return this.parsedItems.indexOf(this.getValue(item)) > -1;
      },

      needsTile(slot) {
        return slot.length !== 1 || slot[0].componentOptions == null || slot[0].componentOptions.Ctor.options.name !== 'v-list-item';
      },

      getDisabled(item) {
        return Boolean(getPropertyFromItem(item, this.itemDisabled, false));
      },

      getText(item) {
        return String(getPropertyFromItem(item, this.itemText, item));
      },

      getValue(item) {
        return getPropertyFromItem(item, this.itemValue, this.getText(item));
      }

    },

    render() {
      const children = [];
      const itemsLength = this.items.length;

      for (let index = 0; index < itemsLength; index++) {
        const item = this.items[index];
        if (this.hideSelected && this.hasItem(item)) continue;
        if (item == null) children.push(this.genTile({
          item,
          index
        }));else if (item.header) children.push(this.genHeader(item));else if (item.divider) children.push(this.genDivider(item));else children.push(this.genTile({
          item,
          index
        }));
      }

      children.length || children.push(this.$slots['no-data'] || this.staticNoDataTile);
      this.$slots['prepend-item'] && children.unshift(this.$slots['prepend-item']);
      this.$slots['append-item'] && children.push(this.$slots['append-item']);
      return this.$createElement(VList, {
        staticClass: 'v-select-list',
        class: this.themeClasses,
        attrs: {
          role: 'listbox',
          tabindex: -1
        },
        props: {
          dense: this.dense
        }
      }, children);
    }

  });

  // Styles
  /* @vue/component */

  var VLabel = mixins(Themeable).extend({
    name: 'v-label',
    functional: true,
    props: {
      absolute: Boolean,
      color: {
        type: String,
        default: 'primary'
      },
      disabled: Boolean,
      focused: Boolean,
      for: String,
      left: {
        type: [Number, String],
        default: 0
      },
      right: {
        type: [Number, String],
        default: 'auto'
      },
      value: Boolean
    },

    render(h, ctx) {
      const {
        children,
        listeners,
        props
      } = ctx;
      const data = {
        staticClass: 'v-label',
        class: {
          'v-label--active': props.value,
          'v-label--is-disabled': props.disabled,
          ...functionalThemeClasses(ctx)
        },
        attrs: {
          for: props.for,
          'aria-hidden': !props.for
        },
        on: listeners,
        style: {
          left: convertToUnit(props.left),
          right: convertToUnit(props.right),
          position: props.absolute ? 'absolute' : 'relative'
        },
        ref: 'label'
      };
      return h('label', Colorable.options.methods.setTextColor(props.focused && props.color, data), children);
    }

  });

  // Styles
  /* @vue/component */

  var VMessages = mixins(Colorable, Themeable).extend({
    name: 'v-messages',
    props: {
      value: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      genChildren() {
        return this.$createElement('transition-group', {
          staticClass: 'v-messages__wrapper',
          attrs: {
            name: 'message-transition',
            tag: 'div'
          }
        }, this.value.map(this.genMessage));
      },

      genMessage(message, key) {
        return this.$createElement('div', {
          staticClass: 'v-messages__message',
          key
        }, getSlot(this, 'default', {
          message,
          key
        }) || [message]);
      }

    },

    render(h) {
      return h('div', this.setTextColor(this.color, {
        staticClass: 'v-messages',
        class: this.themeClasses
      }), [this.genChildren()]);
    }

  });

  // Mixins
  /* @vue/component */

  var Validatable = mixins(Colorable, inject('form'), Themeable).extend({
    name: 'validatable',
    props: {
      disabled: Boolean,
      error: Boolean,
      errorCount: {
        type: [Number, String],
        default: 1
      },
      errorMessages: {
        type: [String, Array],
        default: () => []
      },
      messages: {
        type: [String, Array],
        default: () => []
      },
      readonly: Boolean,
      rules: {
        type: Array,
        default: () => []
      },
      success: Boolean,
      successMessages: {
        type: [String, Array],
        default: () => []
      },
      validateOnBlur: Boolean,
      value: {
        required: false
      }
    },

    data() {
      return {
        errorBucket: [],
        hasColor: false,
        hasFocused: false,
        hasInput: false,
        isFocused: false,
        isResetting: false,
        lazyValue: this.value,
        valid: false
      };
    },

    computed: {
      computedColor() {
        if (this.disabled) return undefined;
        if (this.color) return this.color; // It's assumed that if the input is on a
        // dark background, the user will want to
        // have a white color. If the entire app
        // is setup to be dark, then they will
        // like want to use their primary color

        if (this.isDark && !this.appIsDark) return 'white';else return 'primary';
      },

      hasError() {
        return this.internalErrorMessages.length > 0 || this.errorBucket.length > 0 || this.error;
      },

      // TODO: Add logic that allows the user to enable based
      // upon a good validation
      hasSuccess() {
        return this.internalSuccessMessages.length > 0 || this.success;
      },

      externalError() {
        return this.internalErrorMessages.length > 0 || this.error;
      },

      hasMessages() {
        return this.validationTarget.length > 0;
      },

      hasState() {
        if (this.disabled) return false;
        return this.hasSuccess || this.shouldValidate && this.hasError;
      },

      internalErrorMessages() {
        return this.genInternalMessages(this.errorMessages);
      },

      internalMessages() {
        return this.genInternalMessages(this.messages);
      },

      internalSuccessMessages() {
        return this.genInternalMessages(this.successMessages);
      },

      internalValue: {
        get() {
          return this.lazyValue;
        },

        set(val) {
          this.lazyValue = val;
          this.$emit('input', val);
        }

      },

      shouldValidate() {
        if (this.externalError) return true;
        if (this.isResetting) return false;
        return this.validateOnBlur ? this.hasFocused && !this.isFocused : this.hasInput || this.hasFocused;
      },

      validations() {
        return this.validationTarget.slice(0, Number(this.errorCount));
      },

      validationState() {
        if (this.disabled) return undefined;
        if (this.hasError && this.shouldValidate) return 'error';
        if (this.hasSuccess) return 'success';
        if (this.hasColor) return this.computedColor;
        return undefined;
      },

      validationTarget() {
        if (this.internalErrorMessages.length > 0) {
          return this.internalErrorMessages;
        } else if (this.successMessages.length > 0) {
          return this.internalSuccessMessages;
        } else if (this.messages.length > 0) {
          return this.internalMessages;
        } else if (this.shouldValidate) {
          return this.errorBucket;
        } else return [];
      }

    },
    watch: {
      rules: {
        handler(newVal, oldVal) {
          if (deepEqual(newVal, oldVal)) return;
          this.validate();
        },

        deep: true
      },

      internalValue() {
        // If it's the first time we're setting input,
        // mark it with hasInput
        this.hasInput = true;
        this.validateOnBlur || this.$nextTick(this.validate);
      },

      isFocused(val) {
        // Should not check validation
        // if disabled
        if (!val && !this.disabled) {
          this.hasFocused = true;
          this.validateOnBlur && this.$nextTick(this.validate);
        }
      },

      isResetting() {
        setTimeout(() => {
          this.hasInput = false;
          this.hasFocused = false;
          this.isResetting = false;
          this.validate();
        }, 0);
      },

      hasError(val) {
        if (this.shouldValidate) {
          this.$emit('update:error', val);
        }
      },

      value(val) {
        this.lazyValue = val;
      }

    },

    beforeMount() {
      this.validate();
    },

    created() {
      this.form && this.form.register(this);
    },

    beforeDestroy() {
      this.form && this.form.unregister(this);
    },

    methods: {
      genInternalMessages(messages) {
        if (!messages) return [];else if (Array.isArray(messages)) return messages;else return [messages];
      },

      /** @public */
      reset() {
        this.isResetting = true;
        this.internalValue = Array.isArray(this.internalValue) ? [] : undefined;
      },

      /** @public */
      resetValidation() {
        this.isResetting = true;
      },

      /** @public */
      validate(force = false, value) {
        const errorBucket = [];
        value = value || this.internalValue;
        if (force) this.hasInput = this.hasFocused = true;

        for (let index = 0; index < this.rules.length; index++) {
          const rule = this.rules[index];
          const valid = typeof rule === 'function' ? rule(value) : rule;

          if (valid === false || typeof valid === 'string') {
            errorBucket.push(valid || '');
          } else if (typeof valid !== 'boolean') {
            consoleError(`Rules should return a string or boolean, received '${typeof valid}' instead`, this);
          }
        }

        this.errorBucket = errorBucket;
        this.valid = errorBucket.length === 0;
        return this.valid;
      }

    }
  });

  // Styles
  const baseMixins$6 = mixins(BindsAttrs, Validatable);
  /* @vue/component */

  var VInput = baseMixins$6.extend().extend({
    name: 'v-input',
    inheritAttrs: false,
    props: {
      appendIcon: String,
      backgroundColor: {
        type: String,
        default: ''
      },
      dense: Boolean,
      height: [Number, String],
      hideDetails: [Boolean, String],
      hint: String,
      id: String,
      label: String,
      loading: Boolean,
      persistentHint: Boolean,
      prependIcon: String,
      value: null
    },

    data() {
      return {
        lazyValue: this.value,
        hasMouseDown: false
      };
    },

    computed: {
      classes() {
        return {
          'v-input--has-state': this.hasState,
          'v-input--hide-details': !this.showDetails,
          'v-input--is-label-active': this.isLabelActive,
          'v-input--is-dirty': this.isDirty,
          'v-input--is-disabled': this.disabled,
          'v-input--is-focused': this.isFocused,
          // <v-switch loading>.loading === '' so we can't just cast to boolean
          'v-input--is-loading': this.loading !== false && this.loading != null,
          'v-input--is-readonly': this.readonly,
          'v-input--dense': this.dense,
          ...this.themeClasses
        };
      },

      computedId() {
        return this.id || `input-${this._uid}`;
      },

      hasDetails() {
        return this.messagesToDisplay.length > 0;
      },

      hasHint() {
        return !this.hasMessages && !!this.hint && (this.persistentHint || this.isFocused);
      },

      hasLabel() {
        return !!(this.$slots.label || this.label);
      },

      // Proxy for `lazyValue`
      // This allows an input
      // to function without
      // a provided model
      internalValue: {
        get() {
          return this.lazyValue;
        },

        set(val) {
          this.lazyValue = val;
          this.$emit(this.$_modelEvent, val);
        }

      },

      isDirty() {
        return !!this.lazyValue;
      },

      isDisabled() {
        return this.disabled || this.readonly;
      },

      isLabelActive() {
        return this.isDirty;
      },

      messagesToDisplay() {
        if (this.hasHint) return [this.hint];
        if (!this.hasMessages) return [];
        return this.validations.map(validation => {
          if (typeof validation === 'string') return validation;
          const validationResult = validation(this.internalValue);
          return typeof validationResult === 'string' ? validationResult : '';
        }).filter(message => message !== '');
      },

      showDetails() {
        return this.hideDetails === false || this.hideDetails === 'auto' && this.hasDetails;
      }

    },
    watch: {
      value(val) {
        this.lazyValue = val;
      }

    },

    beforeCreate() {
      // v-radio-group needs to emit a different event
      // https://github.com/vuetifyjs/vuetify/issues/4752
      this.$_modelEvent = this.$options.model && this.$options.model.event || 'input';
    },

    methods: {
      genContent() {
        return [this.genPrependSlot(), this.genControl(), this.genAppendSlot()];
      },

      genControl() {
        return this.$createElement('div', {
          staticClass: 'v-input__control'
        }, [this.genInputSlot(), this.genMessages()]);
      },

      genDefaultSlot() {
        return [this.genLabel(), this.$slots.default];
      },

      genIcon(type, cb, extraData = {}) {
        const icon = this[`${type}Icon`];
        const eventName = `click:${kebabCase(type)}`;
        const hasListener = !!(this.listeners$[eventName] || cb);
        const data = mergeData$1({
          attrs: {
            'aria-label': hasListener ? kebabCase(type).split('-')[0] + ' icon' : undefined,
            color: this.validationState,
            dark: this.dark,
            disabled: this.disabled,
            light: this.light
          },
          on: !hasListener ? undefined : {
            click: e => {
              e.preventDefault();
              e.stopPropagation();
              this.$emit(eventName, e);
              cb && cb(e);
            },
            // Container has g event that will
            // trigger menu open if enclosed
            mouseup: e => {
              e.preventDefault();
              e.stopPropagation();
            }
          }
        }, extraData);
        return this.$createElement('div', {
          staticClass: `v-input__icon`,
          class: type ? `v-input__icon--${kebabCase(type)}` : undefined
        }, [this.$createElement(VIcon$1, data, icon)]);
      },

      genInputSlot() {
        return this.$createElement('div', this.setBackgroundColor(this.backgroundColor, {
          staticClass: 'v-input__slot',
          style: {
            height: convertToUnit(this.height)
          },
          on: {
            click: this.onClick,
            mousedown: this.onMouseDown,
            mouseup: this.onMouseUp
          },
          ref: 'input-slot'
        }), [this.genDefaultSlot()]);
      },

      genLabel() {
        if (!this.hasLabel) return null;
        return this.$createElement(VLabel, {
          props: {
            color: this.validationState,
            dark: this.dark,
            disabled: this.disabled,
            focused: this.hasState,
            for: this.computedId,
            light: this.light
          }
        }, this.$slots.label || this.label);
      },

      genMessages() {
        if (!this.showDetails) return null;
        return this.$createElement(VMessages, {
          props: {
            color: this.hasHint ? '' : this.validationState,
            dark: this.dark,
            light: this.light,
            value: this.messagesToDisplay
          },
          attrs: {
            role: this.hasMessages ? 'alert' : null
          },
          scopedSlots: {
            default: props => getSlot(this, 'message', props)
          }
        });
      },

      genSlot(type, location, slot) {
        if (!slot.length) return null;
        const ref = `${type}-${location}`;
        return this.$createElement('div', {
          staticClass: `v-input__${ref}`,
          ref
        }, slot);
      },

      genPrependSlot() {
        const slot = [];

        if (this.$slots.prepend) {
          slot.push(this.$slots.prepend);
        } else if (this.prependIcon) {
          slot.push(this.genIcon('prepend'));
        }

        return this.genSlot('prepend', 'outer', slot);
      },

      genAppendSlot() {
        const slot = []; // Append icon for text field was really
        // an appended inner icon, v-text-field
        // will overwrite this method in order to obtain
        // backwards compat

        if (this.$slots.append) {
          slot.push(this.$slots.append);
        } else if (this.appendIcon) {
          slot.push(this.genIcon('append'));
        }

        return this.genSlot('append', 'outer', slot);
      },

      onClick(e) {
        this.$emit('click', e);
      },

      onMouseDown(e) {
        this.hasMouseDown = true;
        this.$emit('mousedown', e);
      },

      onMouseUp(e) {
        this.hasMouseDown = false;
        this.$emit('mouseup', e);
      }

    },

    render(h) {
      return h('div', this.setTextColor(this.validationState, {
        staticClass: 'v-input',
        class: this.classes
      }), this.genContent());
    }

  });

  // Styles
  /* @vue/component */

  var VCounter = mixins(Themeable).extend({
    name: 'v-counter',
    functional: true,
    props: {
      value: {
        type: [Number, String],
        default: ''
      },
      max: [Number, String]
    },

    render(h, ctx) {
      const {
        props
      } = ctx;
      const max = parseInt(props.max, 10);
      const value = parseInt(props.value, 10);
      const content = max ? `${value} / ${max}` : String(props.value);
      const isGreater = max && value > max;
      return h('div', {
        staticClass: 'v-counter',
        class: {
          'error--text': isGreater,
          ...functionalThemeClasses(ctx)
        }
      }, content);
    }

  });

  // Directives
  function intersectable(options) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // do nothing because intersection observer is not available
      return Vue.extend({
        name: 'intersectable'
      });
    }

    return Vue.extend({
      name: 'intersectable',

      mounted() {
        Intersect.inserted(this.$el, {
          name: 'intersect',
          value: {
            handler: this.onObserve
          }
        });
      },

      destroyed() {
        Intersect.unbind(this.$el);
      },

      methods: {
        onObserve(entries, observer, isIntersecting) {
          if (!isIntersecting) return;

          for (let i = 0, length = options.onVisible.length; i < length; i++) {
            const callback = this[options.onVisible[i]];

            if (typeof callback === 'function') {
              callback();
              continue;
            }

            consoleWarn(options.onVisible[i] + ' method is not available on the instance but referenced in intersectable mixin options');
          }
        }

      }
    });
  }

  const baseMixins$7 = mixins(Colorable, factory(['absolute', 'fixed', 'top', 'bottom']), Proxyable, Themeable);
  /* @vue/component */

  var VProgressLinear = baseMixins$7.extend({
    name: 'v-progress-linear',
    props: {
      active: {
        type: Boolean,
        default: true
      },
      backgroundColor: {
        type: String,
        default: null
      },
      backgroundOpacity: {
        type: [Number, String],
        default: null
      },
      bufferValue: {
        type: [Number, String],
        default: 100
      },
      color: {
        type: String,
        default: 'primary'
      },
      height: {
        type: [Number, String],
        default: 4
      },
      indeterminate: Boolean,
      query: Boolean,
      rounded: Boolean,
      stream: Boolean,
      striped: Boolean,
      value: {
        type: [Number, String],
        default: 0
      }
    },

    data() {
      return {
        internalLazyValue: this.value || 0
      };
    },

    computed: {
      __cachedBackground() {
        return this.$createElement('div', this.setBackgroundColor(this.backgroundColor || this.color, {
          staticClass: 'v-progress-linear__background',
          style: this.backgroundStyle
        }));
      },

      __cachedBar() {
        return this.$createElement(this.computedTransition, [this.__cachedBarType]);
      },

      __cachedBarType() {
        return this.indeterminate ? this.__cachedIndeterminate : this.__cachedDeterminate;
      },

      __cachedBuffer() {
        return this.$createElement('div', {
          staticClass: 'v-progress-linear__buffer',
          style: this.styles
        });
      },

      __cachedDeterminate() {
        return this.$createElement('div', this.setBackgroundColor(this.color, {
          staticClass: `v-progress-linear__determinate`,
          style: {
            width: convertToUnit(this.normalizedValue, '%')
          }
        }));
      },

      __cachedIndeterminate() {
        return this.$createElement('div', {
          staticClass: 'v-progress-linear__indeterminate',
          class: {
            'v-progress-linear__indeterminate--active': this.active
          }
        }, [this.genProgressBar('long'), this.genProgressBar('short')]);
      },

      __cachedStream() {
        if (!this.stream) return null;
        return this.$createElement('div', this.setTextColor(this.color, {
          staticClass: 'v-progress-linear__stream',
          style: {
            width: convertToUnit(100 - this.normalizedBuffer, '%')
          }
        }));
      },

      backgroundStyle() {
        const backgroundOpacity = this.backgroundOpacity == null ? this.backgroundColor ? 1 : 0.3 : parseFloat(this.backgroundOpacity);
        return {
          opacity: backgroundOpacity,
          [this.$vuetify.rtl ? 'right' : 'left']: convertToUnit(this.normalizedValue, '%'),
          width: convertToUnit(this.normalizedBuffer - this.normalizedValue, '%')
        };
      },

      classes() {
        return {
          'v-progress-linear--absolute': this.absolute,
          'v-progress-linear--fixed': this.fixed,
          'v-progress-linear--query': this.query,
          'v-progress-linear--reactive': this.reactive,
          'v-progress-linear--rounded': this.rounded,
          'v-progress-linear--striped': this.striped,
          ...this.themeClasses
        };
      },

      computedTransition() {
        return this.indeterminate ? VFadeTransition : VSlideXTransition;
      },

      normalizedBuffer() {
        return this.normalize(this.bufferValue);
      },

      normalizedValue() {
        return this.normalize(this.internalLazyValue);
      },

      reactive() {
        return Boolean(this.$listeners.change);
      },

      styles() {
        const styles = {};

        if (!this.active) {
          styles.height = 0;
        }

        if (!this.indeterminate && parseFloat(this.normalizedBuffer) !== 100) {
          styles.width = convertToUnit(this.normalizedBuffer, '%');
        }

        return styles;
      }

    },
    methods: {
      genContent() {
        const slot = getSlot(this, 'default', {
          value: this.internalLazyValue
        });
        if (!slot) return null;
        return this.$createElement('div', {
          staticClass: 'v-progress-linear__content'
        }, slot);
      },

      genListeners() {
        const listeners = this.$listeners;

        if (this.reactive) {
          listeners.click = this.onClick;
        }

        return listeners;
      },

      genProgressBar(name) {
        return this.$createElement('div', this.setBackgroundColor(this.color, {
          staticClass: 'v-progress-linear__indeterminate',
          class: {
            [name]: true
          }
        }));
      },

      onClick(e) {
        if (!this.reactive) return;
        const {
          width
        } = this.$el.getBoundingClientRect();
        this.internalValue = e.offsetX / width * 100;
      },

      normalize(value) {
        if (value < 0) return 0;
        if (value > 100) return 100;
        return parseFloat(value);
      }

    },

    render(h) {
      const data = {
        staticClass: 'v-progress-linear',
        attrs: {
          role: 'progressbar',
          'aria-valuemin': 0,
          'aria-valuemax': this.normalizedBuffer,
          'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue
        },
        class: this.classes,
        style: {
          bottom: this.bottom ? 0 : undefined,
          height: this.active ? convertToUnit(this.height) : 0,
          top: this.top ? 0 : undefined
        },
        on: this.genListeners()
      };
      return h('div', data, [this.__cachedStream, this.__cachedBackground, this.__cachedBuffer, this.__cachedBar, this.genContent()]);
    }

  });

  /**
   * Loadable
   *
   * @mixin
   *
   * Used to add linear progress bar to components
   * Can use a default bar with a specific color
   * or designate a custom progress linear bar
   */

  /* @vue/component */

  var Loadable = Vue.extend().extend({
    name: 'loadable',
    props: {
      loading: {
        type: [Boolean, String],
        default: false
      },
      loaderHeight: {
        type: [Number, String],
        default: 2
      }
    },
    methods: {
      genProgress() {
        if (this.loading === false) return null;
        return this.$slots.progress || this.$createElement(VProgressLinear, {
          props: {
            absolute: true,
            color: this.loading === true || this.loading === '' ? this.color || 'primary' : this.loading,
            height: this.loaderHeight,
            indeterminate: true
          }
        });
      }

    }
  });

  // Styles
  const baseMixins$8 = mixins(VInput, intersectable({
    onVisible: ['setLabelWidth', 'setPrefixWidth', 'setPrependWidth', 'tryAutofocus']
  }), Loadable);
  const dirtyTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month'];
  /* @vue/component */

  var VTextField = baseMixins$8.extend().extend({
    name: 'v-text-field',
    directives: {
      ripple: Ripple
    },
    inheritAttrs: false,
    props: {
      appendOuterIcon: String,
      autofocus: Boolean,
      clearable: Boolean,
      clearIcon: {
        type: String,
        default: '$clear'
      },
      counter: [Boolean, Number, String],
      counterValue: Function,
      filled: Boolean,
      flat: Boolean,
      fullWidth: Boolean,
      label: String,
      outlined: Boolean,
      placeholder: String,
      prefix: String,
      prependInnerIcon: String,
      reverse: Boolean,
      rounded: Boolean,
      shaped: Boolean,
      singleLine: Boolean,
      solo: Boolean,
      soloInverted: Boolean,
      suffix: String,
      type: {
        type: String,
        default: 'text'
      }
    },
    data: () => ({
      badInput: false,
      labelWidth: 0,
      prefixWidth: 0,
      prependWidth: 0,
      initialValue: null,
      isBooted: false,
      isClearing: false
    }),
    computed: {
      classes() {
        return { ...VInput.options.computed.classes.call(this),
          'v-text-field': true,
          'v-text-field--full-width': this.fullWidth,
          'v-text-field--prefix': this.prefix,
          'v-text-field--single-line': this.isSingle,
          'v-text-field--solo': this.isSolo,
          'v-text-field--solo-inverted': this.soloInverted,
          'v-text-field--solo-flat': this.flat,
          'v-text-field--filled': this.filled,
          'v-text-field--is-booted': this.isBooted,
          'v-text-field--enclosed': this.isEnclosed,
          'v-text-field--reverse': this.reverse,
          'v-text-field--outlined': this.outlined,
          'v-text-field--placeholder': this.placeholder,
          'v-text-field--rounded': this.rounded,
          'v-text-field--shaped': this.shaped
        };
      },

      computedColor() {
        const computedColor = Validatable.options.computed.computedColor.call(this);
        if (!this.soloInverted || !this.isFocused) return computedColor;
        return this.color || 'primary';
      },

      computedCounterValue() {
        if (typeof this.counterValue === 'function') {
          return this.counterValue(this.internalValue);
        }

        return (this.internalValue || '').toString().length;
      },

      hasCounter() {
        return this.counter !== false && this.counter != null;
      },

      hasDetails() {
        return VInput.options.computed.hasDetails.call(this) || this.hasCounter;
      },

      internalValue: {
        get() {
          return this.lazyValue;
        },

        set(val) {
          this.lazyValue = val;
          this.$emit('input', this.lazyValue);
        }

      },

      isDirty() {
        return this.lazyValue != null && this.lazyValue.toString().length > 0 || this.badInput;
      },

      isEnclosed() {
        return this.filled || this.isSolo || this.outlined;
      },

      isLabelActive() {
        return this.isDirty || dirtyTypes.includes(this.type);
      },

      isSingle() {
        return this.isSolo || this.singleLine || this.fullWidth || // https://material.io/components/text-fields/#filled-text-field
        this.filled && !this.hasLabel;
      },

      isSolo() {
        return this.solo || this.soloInverted;
      },

      labelPosition() {
        let offset = this.prefix && !this.labelValue ? this.prefixWidth : 0;
        if (this.labelValue && this.prependWidth) offset -= this.prependWidth;
        return this.$vuetify.rtl === this.reverse ? {
          left: offset,
          right: 'auto'
        } : {
          left: 'auto',
          right: offset
        };
      },

      showLabel() {
        return this.hasLabel && (!this.isSingle || !this.isLabelActive && !this.placeholder);
      },

      labelValue() {
        return !this.isSingle && Boolean(this.isFocused || this.isLabelActive || this.placeholder);
      }

    },
    watch: {
      labelValue: 'setLabelWidth',
      outlined: 'setLabelWidth',

      label() {
        this.$nextTick(this.setLabelWidth);
      },

      prefix() {
        this.$nextTick(this.setPrefixWidth);
      },

      isFocused: 'updateValue',

      value(val) {
        this.lazyValue = val;
      }

    },

    created() {
      /* istanbul ignore next */
      if (this.$attrs.hasOwnProperty('box')) {
        breaking('box', 'filled', this);
      }
      /* istanbul ignore next */


      if (this.$attrs.hasOwnProperty('browser-autocomplete')) {
        breaking('browser-autocomplete', 'autocomplete', this);
      }
      /* istanbul ignore if */


      if (this.shaped && !(this.filled || this.outlined || this.isSolo)) {
        consoleWarn('shaped should be used with either filled or outlined', this);
      }
    },

    mounted() {
      this.autofocus && this.tryAutofocus();
      this.setLabelWidth();
      this.setPrefixWidth();
      this.setPrependWidth();
      requestAnimationFrame(() => this.isBooted = true);
    },

    methods: {
      /** @public */
      focus() {
        this.onFocus();
      },

      /** @public */
      blur(e) {
        // https://github.com/vuetifyjs/vuetify/issues/5913
        // Safari tab order gets broken if called synchronous
        window.requestAnimationFrame(() => {
          this.$refs.input && this.$refs.input.blur();
        });
      },

      clearableCallback() {
        this.$refs.input && this.$refs.input.focus();
        this.$nextTick(() => this.internalValue = null);
      },

      genAppendSlot() {
        const slot = [];

        if (this.$slots['append-outer']) {
          slot.push(this.$slots['append-outer']);
        } else if (this.appendOuterIcon) {
          slot.push(this.genIcon('appendOuter'));
        }

        return this.genSlot('append', 'outer', slot);
      },

      genPrependInnerSlot() {
        const slot = [];

        if (this.$slots['prepend-inner']) {
          slot.push(this.$slots['prepend-inner']);
        } else if (this.prependInnerIcon) {
          slot.push(this.genIcon('prependInner'));
        }

        return this.genSlot('prepend', 'inner', slot);
      },

      genIconSlot() {
        const slot = [];

        if (this.$slots['append']) {
          slot.push(this.$slots['append']);
        } else if (this.appendIcon) {
          slot.push(this.genIcon('append'));
        }

        return this.genSlot('append', 'inner', slot);
      },

      genInputSlot() {
        const input = VInput.options.methods.genInputSlot.call(this);
        const prepend = this.genPrependInnerSlot();

        if (prepend) {
          input.children = input.children || [];
          input.children.unshift(prepend);
        }

        return input;
      },

      genClearIcon() {
        if (!this.clearable) return null;
        const data = this.isDirty ? undefined : {
          attrs: {
            disabled: true
          }
        };
        return this.genSlot('append', 'inner', [this.genIcon('clear', this.clearableCallback, data)]);
      },

      genCounter() {
        if (!this.hasCounter) return null;
        const max = this.counter === true ? this.attrs$.maxlength : this.counter;
        return this.$createElement(VCounter, {
          props: {
            dark: this.dark,
            light: this.light,
            max,
            value: this.computedCounterValue
          }
        });
      },

      genDefaultSlot() {
        return [this.genFieldset(), this.genTextFieldSlot(), this.genClearIcon(), this.genIconSlot(), this.genProgress()];
      },

      genFieldset() {
        if (!this.outlined) return null;
        return this.$createElement('fieldset', {
          attrs: {
            'aria-hidden': true
          }
        }, [this.genLegend()]);
      },

      genLabel() {
        if (!this.showLabel) return null;
        const data = {
          props: {
            absolute: true,
            color: this.validationState,
            dark: this.dark,
            disabled: this.disabled,
            focused: !this.isSingle && (this.isFocused || !!this.validationState),
            for: this.computedId,
            left: this.labelPosition.left,
            light: this.light,
            right: this.labelPosition.right,
            value: this.labelValue
          }
        };
        return this.$createElement(VLabel, data, this.$slots.label || this.label);
      },

      genLegend() {
        const width = !this.singleLine && (this.labelValue || this.isDirty) ? this.labelWidth : 0;
        const span = this.$createElement('span', {
          domProps: {
            innerHTML: '&#8203;'
          }
        });
        return this.$createElement('legend', {
          style: {
            width: !this.isSingle ? convertToUnit(width) : undefined
          }
        }, [span]);
      },

      genInput() {
        const listeners = Object.assign({}, this.listeners$);
        delete listeners['change']; // Change should not be bound externally

        return this.$createElement('input', {
          style: {},
          domProps: {
            value: this.type === 'number' && Object.is(this.lazyValue, -0) ? '-0' : this.lazyValue
          },
          attrs: { ...this.attrs$,
            autofocus: this.autofocus,
            disabled: this.disabled,
            id: this.computedId,
            placeholder: this.placeholder,
            readonly: this.readonly,
            type: this.type
          },
          on: Object.assign(listeners, {
            blur: this.onBlur,
            input: this.onInput,
            focus: this.onFocus,
            keydown: this.onKeyDown
          }),
          ref: 'input'
        });
      },

      genMessages() {
        if (!this.showDetails) return null;
        const messagesNode = VInput.options.methods.genMessages.call(this);
        const counterNode = this.genCounter();
        return this.$createElement('div', {
          staticClass: 'v-text-field__details'
        }, [messagesNode, counterNode]);
      },

      genTextFieldSlot() {
        return this.$createElement('div', {
          staticClass: 'v-text-field__slot'
        }, [this.genLabel(), this.prefix ? this.genAffix('prefix') : null, this.genInput(), this.suffix ? this.genAffix('suffix') : null]);
      },

      genAffix(type) {
        return this.$createElement('div', {
          class: `v-text-field__${type}`,
          ref: type
        }, this[type]);
      },

      onBlur(e) {
        this.isFocused = false;
        e && this.$nextTick(() => this.$emit('blur', e));
      },

      onClick() {
        if (this.isFocused || this.disabled || !this.$refs.input) return;
        this.$refs.input.focus();
      },

      onFocus(e) {
        if (!this.$refs.input) return;

        if (document.activeElement !== this.$refs.input) {
          return this.$refs.input.focus();
        }

        if (!this.isFocused) {
          this.isFocused = true;
          e && this.$emit('focus', e);
        }
      },

      onInput(e) {
        const target = e.target;
        this.internalValue = target.value;
        this.badInput = target.validity && target.validity.badInput;
      },

      onKeyDown(e) {
        if (e.keyCode === keyCodes.enter) this.$emit('change', this.internalValue);
        this.$emit('keydown', e);
      },

      onMouseDown(e) {
        // Prevent input from being blurred
        if (e.target !== this.$refs.input) {
          e.preventDefault();
          e.stopPropagation();
        }

        VInput.options.methods.onMouseDown.call(this, e);
      },

      onMouseUp(e) {
        if (this.hasMouseDown) this.focus();
        VInput.options.methods.onMouseUp.call(this, e);
      },

      setLabelWidth() {
        if (!this.outlined) return;
        this.labelWidth = this.$refs.label ? Math.min(this.$refs.label.scrollWidth * 0.75 + 6, this.$el.offsetWidth - 24) : 0;
      },

      setPrefixWidth() {
        if (!this.$refs.prefix) return;
        this.prefixWidth = this.$refs.prefix.offsetWidth;
      },

      setPrependWidth() {
        if (!this.outlined || !this.$refs['prepend-inner']) return;
        this.prependWidth = this.$refs['prepend-inner'].offsetWidth;
      },

      tryAutofocus() {
        if (!this.autofocus || typeof document === 'undefined' || !this.$refs.input || document.activeElement === this.$refs.input) return false;
        this.$refs.input.focus();
        return true;
      },

      updateValue(val) {
        // Sets validationState from validatable
        this.hasColor = val;

        if (val) {
          this.initialValue = this.lazyValue;
        } else if (this.initialValue !== this.lazyValue) {
          this.$emit('change', this.lazyValue);
        }
      }

    }
  });

  var Comparable = Vue.extend({
    name: 'comparable',
    props: {
      valueComparator: {
        type: Function,
        default: deepEqual
      }
    }
  });

  /* @vue/component */

  var Filterable = Vue.extend({
    name: 'filterable',
    props: {
      noDataText: {
        type: String,
        default: '$vuetify.noDataText'
      }
    }
  });

  // Styles
  const defaultMenuProps = {
    closeOnClick: false,
    closeOnContentClick: false,
    disableKeys: true,
    openOnClick: false,
    maxHeight: 304
  }; // Types

  const baseMixins$9 = mixins(VTextField, Comparable, Filterable);
  /* @vue/component */

  var VSelect = baseMixins$9.extend().extend({
    name: 'v-select',
    directives: {
      ClickOutside
    },
    props: {
      appendIcon: {
        type: String,
        default: '$dropdown'
      },
      attach: {
        type: null,
        default: false
      },
      cacheItems: Boolean,
      chips: Boolean,
      clearable: Boolean,
      deletableChips: Boolean,
      disableLookup: Boolean,
      eager: Boolean,
      hideSelected: Boolean,
      items: {
        type: Array,
        default: () => []
      },
      itemColor: {
        type: String,
        default: 'primary'
      },
      itemDisabled: {
        type: [String, Array, Function],
        default: 'disabled'
      },
      itemText: {
        type: [String, Array, Function],
        default: 'text'
      },
      itemValue: {
        type: [String, Array, Function],
        default: 'value'
      },
      menuProps: {
        type: [String, Array, Object],
        default: () => defaultMenuProps
      },
      multiple: Boolean,
      openOnClear: Boolean,
      returnObject: Boolean,
      smallChips: Boolean
    },

    data() {
      return {
        cachedItems: this.cacheItems ? this.items : [],
        menuIsBooted: false,
        isMenuActive: false,
        lastItem: 20,
        // As long as a value is defined, show it
        // Otherwise, check if multiple
        // to determine which default to provide
        lazyValue: this.value !== undefined ? this.value : this.multiple ? [] : undefined,
        selectedIndex: -1,
        selectedItems: [],
        keyboardLookupPrefix: '',
        keyboardLookupLastTime: 0
      };
    },

    computed: {
      /* All items that the select has */
      allItems() {
        return this.filterDuplicates(this.cachedItems.concat(this.items));
      },

      classes() {
        return { ...VTextField.options.computed.classes.call(this),
          'v-select': true,
          'v-select--chips': this.hasChips,
          'v-select--chips--small': this.smallChips,
          'v-select--is-menu-active': this.isMenuActive,
          'v-select--is-multi': this.multiple
        };
      },

      /* Used by other components to overwrite */
      computedItems() {
        return this.allItems;
      },

      computedOwns() {
        return `list-${this._uid}`;
      },

      computedCounterValue() {
        return this.multiple ? this.selectedItems.length : (this.getText(this.selectedItems[0]) || '').toString().length;
      },

      directives() {
        return this.isFocused ? [{
          name: 'click-outside',
          value: this.blur,
          args: {
            closeConditional: this.closeConditional
          }
        }] : undefined;
      },

      dynamicHeight() {
        return 'auto';
      },

      hasChips() {
        return this.chips || this.smallChips;
      },

      hasSlot() {
        return Boolean(this.hasChips || this.$scopedSlots.selection);
      },

      isDirty() {
        return this.selectedItems.length > 0;
      },

      listData() {
        const scopeId = this.$vnode && this.$vnode.context.$options._scopeId;
        const attrs = scopeId ? {
          [scopeId]: true
        } : {};
        return {
          attrs: { ...attrs,
            id: this.computedOwns
          },
          props: {
            action: this.multiple,
            color: this.itemColor,
            dense: this.dense,
            hideSelected: this.hideSelected,
            items: this.virtualizedItems,
            itemDisabled: this.itemDisabled,
            itemText: this.itemText,
            itemValue: this.itemValue,
            noDataText: this.$vuetify.lang.t(this.noDataText),
            selectedItems: this.selectedItems
          },
          on: {
            select: this.selectItem
          },
          scopedSlots: {
            item: this.$scopedSlots.item
          }
        };
      },

      staticList() {
        if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
          consoleError('assert: staticList should not be called if slots are used');
        }

        return this.$createElement(VSelectList, this.listData);
      },

      virtualizedItems() {
        return this.$_menuProps.auto ? this.computedItems : this.computedItems.slice(0, this.lastItem);
      },

      menuCanShow: () => true,

      $_menuProps() {
        let normalisedProps = typeof this.menuProps === 'string' ? this.menuProps.split(',') : this.menuProps;

        if (Array.isArray(normalisedProps)) {
          normalisedProps = normalisedProps.reduce((acc, p) => {
            acc[p.trim()] = true;
            return acc;
          }, {});
        }

        return { ...defaultMenuProps,
          eager: this.eager,
          value: this.menuCanShow && this.isMenuActive,
          nudgeBottom: normalisedProps.offsetY ? 1 : 0,
          ...normalisedProps
        };
      }

    },
    watch: {
      internalValue(val) {
        this.initialValue = val;
        this.setSelectedItems();
      },

      menuIsBooted() {
        window.setTimeout(() => {
          if (this.getContent() && this.getContent().addEventListener) {
            this.getContent().addEventListener('scroll', this.onScroll, false);
          }
        });
      },

      isMenuActive(val) {
        window.setTimeout(() => this.onMenuActiveChange(val));
        if (!val) return;
        this.menuIsBooted = true;
      },

      items: {
        immediate: true,

        handler(val) {
          if (this.cacheItems) {
            // Breaks vue-test-utils if
            // this isn't calculated
            // on the next tick
            this.$nextTick(() => {
              this.cachedItems = this.filterDuplicates(this.cachedItems.concat(val));
            });
          }

          this.setSelectedItems();
        }

      }
    },
    methods: {
      /** @public */
      blur(e) {
        VTextField.options.methods.blur.call(this, e);
        this.isMenuActive = false;
        this.isFocused = false;
        this.selectedIndex = -1;
      },

      /** @public */
      activateMenu() {
        if (this.disabled || this.readonly || this.isMenuActive) return;
        this.isMenuActive = true;
      },

      clearableCallback() {
        this.setValue(this.multiple ? [] : undefined);
        this.setMenuIndex(-1);
        this.$nextTick(() => this.$refs.input && this.$refs.input.focus());
        if (this.openOnClear) this.isMenuActive = true;
      },

      closeConditional(e) {
        if (!this.isMenuActive) return true;
        return !this._isDestroyed && ( // Click originates from outside the menu content
        // Multiple selects don't close when an item is clicked
        !this.getContent() || !this.getContent().contains(e.target)) && // Click originates from outside the element
        this.$el && !this.$el.contains(e.target) && e.target !== this.$el;
      },

      filterDuplicates(arr) {
        const uniqueValues = new Map();

        for (let index = 0; index < arr.length; ++index) {
          const item = arr[index];
          const val = this.getValue(item); // TODO: comparator

          !uniqueValues.has(val) && uniqueValues.set(val, item);
        }

        return Array.from(uniqueValues.values());
      },

      findExistingIndex(item) {
        const itemValue = this.getValue(item);
        return (this.internalValue || []).findIndex(i => this.valueComparator(this.getValue(i), itemValue));
      },

      getContent() {
        return this.$refs.menu && this.$refs.menu.$refs.content;
      },

      genChipSelection(item, index) {
        const isDisabled = this.disabled || this.readonly || this.getDisabled(item);
        return this.$createElement(VChip, {
          staticClass: 'v-chip--select',
          attrs: {
            tabindex: -1
          },
          props: {
            close: this.deletableChips && !isDisabled,
            disabled: isDisabled,
            inputValue: index === this.selectedIndex,
            small: this.smallChips
          },
          on: {
            click: e => {
              if (isDisabled) return;
              e.stopPropagation();
              this.selectedIndex = index;
            },
            'click:close': () => this.onChipInput(item)
          },
          key: JSON.stringify(this.getValue(item))
        }, this.getText(item));
      },

      genCommaSelection(item, index, last) {
        const color = index === this.selectedIndex && this.computedColor;
        const isDisabled = this.disabled || this.getDisabled(item);
        return this.$createElement('div', this.setTextColor(color, {
          staticClass: 'v-select__selection v-select__selection--comma',
          class: {
            'v-select__selection--disabled': isDisabled
          },
          key: JSON.stringify(this.getValue(item))
        }), `${this.getText(item)}${last ? '' : ', '}`);
      },

      genDefaultSlot() {
        const selections = this.genSelections();
        const input = this.genInput(); // If the return is an empty array
        // push the input

        if (Array.isArray(selections)) {
          selections.push(input); // Otherwise push it into children
        } else {
          selections.children = selections.children || [];
          selections.children.push(input);
        }

        return [this.genFieldset(), this.$createElement('div', {
          staticClass: 'v-select__slot',
          directives: this.directives
        }, [this.genLabel(), this.prefix ? this.genAffix('prefix') : null, selections, this.suffix ? this.genAffix('suffix') : null, this.genClearIcon(), this.genIconSlot(), this.genHiddenInput()]), this.genMenu(), this.genProgress()];
      },

      genIcon(type, cb, extraData) {
        const icon = VInput.options.methods.genIcon.call(this, type, cb, extraData);

        if (type === 'append') {
          // Don't allow the dropdown icon to be focused
          icon.children[0].data = mergeData$1(icon.children[0].data, {
            attrs: {
              tabindex: icon.children[0].componentOptions.listeners && '-1',
              'aria-hidden': 'true',
              'aria-label': undefined
            }
          });
        }

        return icon;
      },

      genInput() {
        const input = VTextField.options.methods.genInput.call(this);
        delete input.data.attrs.name;
        input.data = mergeData$1(input.data, {
          domProps: {
            value: null
          },
          attrs: {
            readonly: true,
            type: 'text',
            'aria-readonly': String(this.readonly),
            'aria-activedescendant': getObjectValueByPath(this.$refs.menu, 'activeTile.id'),
            autocomplete: getObjectValueByPath(input.data, 'attrs.autocomplete', 'off')
          },
          on: {
            keypress: this.onKeyPress
          }
        });
        return input;
      },

      genHiddenInput() {
        return this.$createElement('input', {
          domProps: {
            value: this.lazyValue
          },
          attrs: {
            type: 'hidden',
            name: this.attrs$.name
          }
        });
      },

      genInputSlot() {
        const render = VTextField.options.methods.genInputSlot.call(this);
        render.data.attrs = { ...render.data.attrs,
          role: 'button',
          'aria-haspopup': 'listbox',
          'aria-expanded': String(this.isMenuActive),
          'aria-owns': this.computedOwns
        };
        return render;
      },

      genList() {
        // If there's no slots, we can use a cached VNode to improve performance
        if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
          return this.genListWithSlot();
        } else {
          return this.staticList;
        }
      },

      genListWithSlot() {
        const slots = ['prepend-item', 'no-data', 'append-item'].filter(slotName => this.$slots[slotName]).map(slotName => this.$createElement('template', {
          slot: slotName
        }, this.$slots[slotName])); // Requires destructuring due to Vue
        // modifying the `on` property when passed
        // as a referenced object

        return this.$createElement(VSelectList, { ...this.listData
        }, slots);
      },

      genMenu() {
        const props = this.$_menuProps;
        props.activator = this.$refs['input-slot']; // Attach to root el so that
        // menu covers prepend/append icons

        if ( // TODO: make this a computed property or helper or something
        this.attach === '' || // If used as a boolean prop (<v-menu attach>)
        this.attach === true || // If bound to a boolean (<v-menu :attach="true">)
        this.attach === 'attach' // If bound as boolean prop in pug (v-menu(attach))
        ) {
            props.attach = this.$el;
          } else {
          props.attach = this.attach;
        }

        return this.$createElement(VMenu, {
          attrs: {
            role: undefined
          },
          props,
          on: {
            input: val => {
              this.isMenuActive = val;
              this.isFocused = val;
            }
          },
          ref: 'menu'
        }, [this.genList()]);
      },

      genSelections() {
        let length = this.selectedItems.length;
        const children = new Array(length);
        let genSelection;

        if (this.$scopedSlots.selection) {
          genSelection = this.genSlotSelection;
        } else if (this.hasChips) {
          genSelection = this.genChipSelection;
        } else {
          genSelection = this.genCommaSelection;
        }

        while (length--) {
          children[length] = genSelection(this.selectedItems[length], length, length === children.length - 1);
        }

        return this.$createElement('div', {
          staticClass: 'v-select__selections'
        }, children);
      },

      genSlotSelection(item, index) {
        return this.$scopedSlots.selection({
          attrs: {
            class: 'v-chip--select'
          },
          parent: this,
          item,
          index,
          select: e => {
            e.stopPropagation();
            this.selectedIndex = index;
          },
          selected: index === this.selectedIndex,
          disabled: this.disabled || this.readonly
        });
      },

      getMenuIndex() {
        return this.$refs.menu ? this.$refs.menu.listIndex : -1;
      },

      getDisabled(item) {
        return getPropertyFromItem(item, this.itemDisabled, false);
      },

      getText(item) {
        return getPropertyFromItem(item, this.itemText, item);
      },

      getValue(item) {
        return getPropertyFromItem(item, this.itemValue, this.getText(item));
      },

      onBlur(e) {
        e && this.$emit('blur', e);
      },

      onChipInput(item) {
        if (this.multiple) this.selectItem(item);else this.setValue(null); // If all items have been deleted,
        // open `v-menu`

        if (this.selectedItems.length === 0) {
          this.isMenuActive = true;
        } else {
          this.isMenuActive = false;
        }

        this.selectedIndex = -1;
      },

      onClick(e) {
        if (this.isDisabled) return;

        if (!this.isAppendInner(e.target)) {
          this.isMenuActive = true;
        }

        if (!this.isFocused) {
          this.isFocused = true;
          this.$emit('focus');
        }

        this.$emit('click', e);
      },

      onEscDown(e) {
        e.preventDefault();

        if (this.isMenuActive) {
          e.stopPropagation();
          this.isMenuActive = false;
        }
      },

      onKeyPress(e) {
        if (this.multiple || this.readonly || this.disableLookup) return;
        const KEYBOARD_LOOKUP_THRESHOLD = 1000; // milliseconds

        const now = performance.now();

        if (now - this.keyboardLookupLastTime > KEYBOARD_LOOKUP_THRESHOLD) {
          this.keyboardLookupPrefix = '';
        }

        this.keyboardLookupPrefix += e.key.toLowerCase();
        this.keyboardLookupLastTime = now;
        const index = this.allItems.findIndex(item => {
          const text = (this.getText(item) || '').toString();
          return text.toLowerCase().startsWith(this.keyboardLookupPrefix);
        });
        const item = this.allItems[index];

        if (index !== -1) {
          this.lastItem = Math.max(this.lastItem, index + 5);
          this.setValue(this.returnObject ? item : this.getValue(item));
          this.$nextTick(() => this.$refs.menu.getTiles());
          setTimeout(() => this.setMenuIndex(index));
        }
      },

      onKeyDown(e) {
        if (this.readonly && e.keyCode !== keyCodes.tab) return;
        const keyCode = e.keyCode;
        const menu = this.$refs.menu; // If enter, space, open menu

        if ([keyCodes.enter, keyCodes.space].includes(keyCode)) this.activateMenu();
        this.$emit('keydown', e);
        if (!menu) return; // If menu is active, allow default
        // listIndex change from menu

        if (this.isMenuActive && keyCode !== keyCodes.tab) {
          this.$nextTick(() => {
            menu.changeListIndex(e);
            this.$emit('update:list-index', menu.listIndex);
          });
        } // If menu is not active, up and down can do
        // one of 2 things. If multiple, opens the
        // menu, if not, will cycle through all
        // available options


        if (!this.isMenuActive && [keyCodes.up, keyCodes.down].includes(keyCode)) return this.onUpDown(e); // If escape deactivate the menu

        if (keyCode === keyCodes.esc) return this.onEscDown(e); // If tab - select item or close menu

        if (keyCode === keyCodes.tab) return this.onTabDown(e); // If space preventDefault

        if (keyCode === keyCodes.space) return this.onSpaceDown(e);
      },

      onMenuActiveChange(val) {
        // If menu is closing and mulitple
        // or menuIndex is already set
        // skip menu index recalculation
        if (this.multiple && !val || this.getMenuIndex() > -1) return;
        const menu = this.$refs.menu;
        if (!menu || !this.isDirty) return; // When menu opens, set index of first active item

        for (let i = 0; i < menu.tiles.length; i++) {
          if (menu.tiles[i].getAttribute('aria-selected') === 'true') {
            this.setMenuIndex(i);
            break;
          }
        }
      },

      onMouseUp(e) {
        if (this.hasMouseDown && e.which !== 3 && !this.isDisabled) {
          // If append inner is present
          // and the target is itself
          // or inside, toggle menu
          if (this.isAppendInner(e.target)) {
            this.$nextTick(() => this.isMenuActive = !this.isMenuActive); // If user is clicking in the container
            // and field is enclosed, activate it
          } else if (this.isEnclosed) {
            this.isMenuActive = true;
          }
        }

        VTextField.options.methods.onMouseUp.call(this, e);
      },

      onScroll() {
        if (!this.isMenuActive) {
          requestAnimationFrame(() => this.getContent().scrollTop = 0);
        } else {
          if (this.lastItem >= this.computedItems.length) return;
          const showMoreItems = this.getContent().scrollHeight - (this.getContent().scrollTop + this.getContent().clientHeight) < 200;

          if (showMoreItems) {
            this.lastItem += 20;
          }
        }
      },

      onSpaceDown(e) {
        e.preventDefault();
      },

      onTabDown(e) {
        const menu = this.$refs.menu;
        if (!menu) return;
        const activeTile = menu.activeTile; // An item that is selected by
        // menu-index should toggled

        if (!this.multiple && activeTile && this.isMenuActive) {
          e.preventDefault();
          e.stopPropagation();
          activeTile.click();
        } else {
          // If we make it here,
          // the user has no selected indexes
          // and is probably tabbing out
          this.blur(e);
        }
      },

      onUpDown(e) {
        const menu = this.$refs.menu;
        if (!menu) return;
        e.preventDefault(); // Multiple selects do not cycle their value
        // when pressing up or down, instead activate
        // the menu

        if (this.multiple) return this.activateMenu();
        const keyCode = e.keyCode; // Cycle through available values to achieve
        // select native behavior

        menu.isBooted = true;
        window.requestAnimationFrame(() => {
          menu.getTiles();
          keyCodes.up === keyCode ? menu.prevTile() : menu.nextTile();
          menu.activeTile && menu.activeTile.click();
        });
      },

      selectItem(item) {
        if (!this.multiple) {
          this.setValue(this.returnObject ? item : this.getValue(item));
          this.isMenuActive = false;
        } else {
          const internalValue = (this.internalValue || []).slice();
          const i = this.findExistingIndex(item);
          i !== -1 ? internalValue.splice(i, 1) : internalValue.push(item);
          this.setValue(internalValue.map(i => {
            return this.returnObject ? i : this.getValue(i);
          })); // When selecting multiple
          // adjust menu after each
          // selection

          this.$nextTick(() => {
            this.$refs.menu && this.$refs.menu.updateDimensions();
          }); // We only need to reset list index for multiple
          // to keep highlight when an item is toggled
          // on and off

          if (!this.multiple) return;
          const listIndex = this.getMenuIndex();
          this.setMenuIndex(-1); // There is no item to re-highlight
          // when selections are hidden

          if (this.hideSelected) return;
          this.$nextTick(() => this.setMenuIndex(listIndex));
        }
      },

      setMenuIndex(index) {
        this.$refs.menu && (this.$refs.menu.listIndex = index);
      },

      setSelectedItems() {
        const selectedItems = [];
        const values = !this.multiple || !Array.isArray(this.internalValue) ? [this.internalValue] : this.internalValue;

        for (const value of values) {
          const index = this.allItems.findIndex(v => this.valueComparator(this.getValue(v), this.getValue(value)));

          if (index > -1) {
            selectedItems.push(this.allItems[index]);
          }
        }

        this.selectedItems = selectedItems;
      },

      setValue(value) {
        const oldValue = this.internalValue;
        this.internalValue = value;
        value !== oldValue && this.$emit('change', value);
      },

      isAppendInner(target) {
        // return true if append inner is present
        // and the target is itself or inside
        const appendInner = this.$refs['append-inner'];
        return appendInner && (appendInner === target || appendInner.contains(target));
      }

    }
  });

  // Directives
  var Rippleable = Vue.extend({
    name: 'rippleable',
    directives: {
      ripple: Ripple
    },
    props: {
      ripple: {
        type: [Boolean, Object],
        default: true
      }
    },
    methods: {
      genRipple(data = {}) {
        if (!this.ripple) return null;
        data.staticClass = 'v-input--selection-controls__ripple';
        data.directives = data.directives || [];
        data.directives.push({
          name: 'ripple',
          value: {
            center: true
          }
        });
        data.on = Object.assign({
          click: this.onChange
        }, this.$listeners);
        return this.$createElement('div', data);
      },

      onChange() {}

    }
  });

  // Components
  /* @vue/component */

  var Selectable = mixins(VInput, Rippleable, Comparable).extend({
    name: 'selectable',
    model: {
      prop: 'inputValue',
      event: 'change'
    },
    props: {
      id: String,
      inputValue: null,
      falseValue: null,
      trueValue: null,
      multiple: {
        type: Boolean,
        default: null
      },
      label: String
    },

    data() {
      return {
        hasColor: this.inputValue,
        lazyValue: this.inputValue
      };
    },

    computed: {
      computedColor() {
        if (!this.isActive) return undefined;
        if (this.color) return this.color;
        if (this.isDark && !this.appIsDark) return 'white';
        return 'primary';
      },

      isMultiple() {
        return this.multiple === true || this.multiple === null && Array.isArray(this.internalValue);
      },

      isActive() {
        const value = this.value;
        const input = this.internalValue;

        if (this.isMultiple) {
          if (!Array.isArray(input)) return false;
          return input.some(item => this.valueComparator(item, value));
        }

        if (this.trueValue === undefined || this.falseValue === undefined) {
          return value ? this.valueComparator(value, input) : Boolean(input);
        }

        return this.valueComparator(input, this.trueValue);
      },

      isDirty() {
        return this.isActive;
      },

      rippleState() {
        return !this.disabled && !this.validationState ? undefined : this.validationState;
      }

    },
    watch: {
      inputValue(val) {
        this.lazyValue = val;
        this.hasColor = val;
      }

    },
    methods: {
      genLabel() {
        const label = VInput.options.methods.genLabel.call(this);
        if (!label) return label;
        label.data.on = {
          click: e => {
            // Prevent label from
            // causing the input
            // to focus
            e.preventDefault();
            this.onChange();
          }
        };
        return label;
      },

      genInput(type, attrs) {
        return this.$createElement('input', {
          attrs: Object.assign({
            'aria-checked': this.isActive.toString(),
            disabled: this.isDisabled,
            id: this.computedId,
            role: type,
            type
          }, attrs),
          domProps: {
            value: this.value,
            checked: this.isActive
          },
          on: {
            blur: this.onBlur,
            change: this.onChange,
            focus: this.onFocus,
            keydown: this.onKeydown
          },
          ref: 'input'
        });
      },

      onBlur() {
        this.isFocused = false;
      },

      onChange() {
        if (this.isDisabled) return;
        const value = this.value;
        let input = this.internalValue;

        if (this.isMultiple) {
          if (!Array.isArray(input)) {
            input = [];
          }

          const length = input.length;
          input = input.filter(item => !this.valueComparator(item, value));

          if (input.length === length) {
            input.push(value);
          }
        } else if (this.trueValue !== undefined && this.falseValue !== undefined) {
          input = this.valueComparator(input, this.trueValue) ? this.falseValue : this.trueValue;
        } else if (value) {
          input = this.valueComparator(input, value) ? null : value;
        } else {
          input = !input;
        }

        this.validate(true, input);
        this.internalValue = input;
        this.hasColor = input;
      },

      onFocus() {
        this.isFocused = true;
      },

      /** @abstract */
      onKeydown(e) {}

    }
  });

  // Styles
  /* @vue/component */

  var VCheckbox = Selectable.extend({
    name: 'v-checkbox',
    props: {
      indeterminate: Boolean,
      indeterminateIcon: {
        type: String,
        default: '$checkboxIndeterminate'
      },
      offIcon: {
        type: String,
        default: '$checkboxOff'
      },
      onIcon: {
        type: String,
        default: '$checkboxOn'
      }
    },

    data() {
      return {
        inputIndeterminate: this.indeterminate
      };
    },

    computed: {
      classes() {
        return { ...VInput.options.computed.classes.call(this),
          'v-input--selection-controls': true,
          'v-input--checkbox': true,
          'v-input--indeterminate': this.inputIndeterminate
        };
      },

      computedIcon() {
        if (this.inputIndeterminate) {
          return this.indeterminateIcon;
        } else if (this.isActive) {
          return this.onIcon;
        } else {
          return this.offIcon;
        }
      },

      // Do not return undefined if disabled,
      // according to spec, should still show
      // a color when disabled and active
      validationState() {
        if (this.disabled && !this.inputIndeterminate) return undefined;
        if (this.hasError && this.shouldValidate) return 'error';
        if (this.hasSuccess) return 'success';
        if (this.hasColor !== null) return this.computedColor;
        return undefined;
      }

    },
    watch: {
      indeterminate(val) {
        // https://github.com/vuetifyjs/vuetify/issues/8270
        this.$nextTick(() => this.inputIndeterminate = val);
      },

      inputIndeterminate(val) {
        this.$emit('update:indeterminate', val);
      },

      isActive() {
        if (!this.indeterminate) return;
        this.inputIndeterminate = false;
      }

    },
    methods: {
      genCheckbox() {
        return this.$createElement('div', {
          staticClass: 'v-input--selection-controls__input'
        }, [this.$createElement(VIcon$1, this.setTextColor(this.validationState, {
          props: {
            dense: this.dense,
            dark: this.dark,
            light: this.light
          }
        }), this.computedIcon), this.genInput('checkbox', { ...this.attrs$,
          'aria-checked': this.inputIndeterminate ? 'mixed' : this.isActive.toString()
        }), this.genRipple(this.setTextColor(this.rippleState))]);
      },

      genDefaultSlot() {
        return [this.genCheckbox(), this.genLabel()];
      }

    }
  });

  const srgbForwardMatrix = [[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.2040, 1.0570]]; // Forward gamma adjust

  const srgbForwardTransform = C => C <= 0.0031308 ? C * 12.92 : 1.055 * C ** (1 / 2.4) - 0.055; // For converting sRGB to XYZ


  const srgbReverseMatrix = [[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]; // Reverse gamma adjust

  const srgbReverseTransform = C => C <= 0.04045 ? C / 12.92 : ((C + 0.055) / 1.055) ** 2.4;

  function fromXYZ(xyz) {
    const rgb = Array(3);
    const transform = srgbForwardTransform;
    const matrix = srgbForwardMatrix; // Matrix transform, then gamma adjustment

    for (let i = 0; i < 3; ++i) {
      rgb[i] = Math.round(clamp(transform(matrix[i][0] * xyz[0] + matrix[i][1] * xyz[1] + matrix[i][2] * xyz[2])) * 255);
    } // Rescale back to [0, 255]


    return (rgb[0] << 16) + (rgb[1] << 8) + (rgb[2] << 0);
  }
  function toXYZ(rgb) {
    const xyz = [0, 0, 0];
    const transform = srgbReverseTransform;
    const matrix = srgbReverseMatrix; // Rescale from [0, 255] to [0, 1] then adjust sRGB gamma to linear RGB

    const r = transform((rgb >> 16 & 0xff) / 255);
    const g = transform((rgb >> 8 & 0xff) / 255);
    const b = transform((rgb >> 0 & 0xff) / 255); // Matrix color space transform

    for (let i = 0; i < 3; ++i) {
      xyz[i] = matrix[i][0] * r + matrix[i][1] * g + matrix[i][2] * b;
    }

    return xyz;
  }

  function colorToInt(color) {
    let rgb;

    if (typeof color === 'number') {
      rgb = color;
    } else if (typeof color === 'string') {
      let c = color[0] === '#' ? color.substring(1) : color;

      if (c.length === 3) {
        c = c.split('').map(char => char + char).join('');
      }

      if (c.length !== 6) {
        consoleWarn(`'${color}' is not a valid rgb color`);
      }

      rgb = parseInt(c, 16);
    } else {
      throw new TypeError(`Colors can only be numbers or strings, recieved ${color == null ? color : color.constructor.name} instead`);
    }

    if (rgb < 0) {
      consoleWarn(`Colors cannot be negative: '${color}'`);
      rgb = 0;
    } else if (rgb > 0xffffff || isNaN(rgb)) {
      consoleWarn(`'${color}' is not a valid rgb color`);
      rgb = 0xffffff;
    }

    return rgb;
  }
  function intToHex(color) {
    let hexColor = color.toString(16);
    if (hexColor.length < 6) hexColor = '0'.repeat(6 - hexColor.length) + hexColor;
    return '#' + hexColor;
  }
  function colorToHex(color) {
    return intToHex(colorToInt(color));
  }

  // Styles
  /* @vue/component */

  var VContent = SSRBootable.extend({
    name: 'v-content',
    props: {
      tag: {
        type: String,
        default: 'main'
      }
    },
    computed: {
      styles() {
        const {
          bar,
          top,
          right,
          footer,
          insetFooter,
          bottom,
          left
        } = this.$vuetify.application;
        return {
          paddingTop: `${top + bar}px`,
          paddingRight: `${right}px`,
          paddingBottom: `${footer + insetFooter + bottom}px`,
          paddingLeft: `${left}px`
        };
      }

    },

    render(h) {
      const data = {
        staticClass: 'v-content',
        style: this.styles,
        ref: 'content'
      };
      return h(this.tag, data, [h('div', {
        staticClass: 'v-content__wrap'
      }, this.$slots.default)]);
    }

  });

  var VSpacer = createSimpleFunctional('spacer', 'div', 'v-spacer');

  function install(Vue$1, args = {}) {
    if (install.installed) return;
    install.installed = true;

    if (Vue !== Vue$1) {
      consoleError('Multiple instances of Vue detected\nSee https://github.com/vuetifyjs/vuetify/issues/4068\n\nIf you\'re seeing "$attrs is readonly", it\'s caused by this');
    }

    const components = args.components || {};
    const directives = args.directives || {};

    for (const name in directives) {
      const directive = directives[name];
      Vue$1.directive(name, directive);
    }

    (function registerComponents(components) {
      if (components) {
        for (const key in components) {
          const component = components[key];

          if (component && !registerComponents(component.$_vuetify_subcomponents)) {
            Vue$1.component(key, component);
          }
        }

        return true;
      }

      return false;
    })(components); // Used to avoid multiple mixins being setup
    // when in dev mode and hot module reload
    // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111


    if (Vue$1.$_vuetify_installed) return;
    Vue$1.$_vuetify_installed = true;
    Vue$1.mixin({
      beforeCreate() {
        const options = this.$options;

        if (options.vuetify) {
          options.vuetify.init(this, options.ssrContext);
          this.$vuetify = Vue$1.observable(options.vuetify.framework);
        } else {
          this.$vuetify = options.parent && options.parent.$vuetify || this;
        }
      }

    });
  }

  class Service {
    constructor() {
      this.framework = {};
    }

    init(root, ssrContext) {}

  }

  // Extensions
  class Application extends Service {
    constructor() {
      super(...arguments);
      this.bar = 0;
      this.top = 0;
      this.left = 0;
      this.insetFooter = 0;
      this.right = 0;
      this.bottom = 0;
      this.footer = 0;
      this.application = {
        bar: {},
        top: {},
        left: {},
        insetFooter: {},
        right: {},
        bottom: {},
        footer: {}
      };
    }

    register(uid, location, size) {
      this.application[location] = {
        [uid]: size
      };
      this.update(location);
    }

    unregister(uid, location) {
      if (this.application[location][uid] == null) return;
      delete this.application[location][uid];
      this.update(location);
    }

    update(location) {
      this[location] = Object.values(this.application[location]).reduce((acc, cur) => acc + cur, 0);
    }

  }
  Application.property = 'application';

  // Extensions
  class Breakpoint extends Service {
    constructor(preset) {
      super(); // Public

      this.xs = false;
      this.sm = false;
      this.md = false;
      this.lg = false;
      this.xl = false;
      this.xsOnly = false;
      this.smOnly = false;
      this.smAndDown = false;
      this.smAndUp = false;
      this.mdOnly = false;
      this.mdAndDown = false;
      this.mdAndUp = false;
      this.lgOnly = false;
      this.lgAndDown = false;
      this.lgAndUp = false;
      this.xlOnly = false;
      this.name = '';
      this.height = 0;
      this.width = 0;
      this.resizeTimeout = 0;
      const {
        scrollBarWidth,
        thresholds
      } = preset[Breakpoint.property];
      this.scrollBarWidth = scrollBarWidth;
      this.thresholds = thresholds;
      this.init();
    }

    init() {
      /* istanbul ignore if */
      if (typeof window === 'undefined') return;
      window.addEventListener('resize', this.onResize.bind(this), {
        passive: true
      });
      this.update();
    }

    onResize() {
      clearTimeout(this.resizeTimeout); // Added debounce to match what
      // v-resize used to do but was
      // removed due to a memory leak
      // https://github.com/vuetifyjs/vuetify/pull/2997

      this.resizeTimeout = window.setTimeout(this.update.bind(this), 200);
    }
    /* eslint-disable-next-line max-statements */


    update() {
      const height = this.getClientHeight();
      const width = this.getClientWidth();
      const xs = width < this.thresholds.xs;
      const sm = width < this.thresholds.sm && !xs;
      const md = width < this.thresholds.md - this.scrollBarWidth && !(sm || xs);
      const lg = width < this.thresholds.lg - this.scrollBarWidth && !(md || sm || xs);
      const xl = width >= this.thresholds.lg - this.scrollBarWidth;
      this.height = height;
      this.width = width;
      this.xs = xs;
      this.sm = sm;
      this.md = md;
      this.lg = lg;
      this.xl = xl;
      this.xsOnly = xs;
      this.smOnly = sm;
      this.smAndDown = (xs || sm) && !(md || lg || xl);
      this.smAndUp = !xs && (sm || md || lg || xl);
      this.mdOnly = md;
      this.mdAndDown = (xs || sm || md) && !(lg || xl);
      this.mdAndUp = !(xs || sm) && (md || lg || xl);
      this.lgOnly = lg;
      this.lgAndDown = (xs || sm || md || lg) && !xl;
      this.lgAndUp = !(xs || sm || md) && (lg || xl);
      this.xlOnly = xl;

      switch (true) {
        case xs:
          this.name = 'xs';
          break;

        case sm:
          this.name = 'sm';
          break;

        case md:
          this.name = 'md';
          break;

        case lg:
          this.name = 'lg';
          break;

        default:
          this.name = 'xl';
          break;
      }
    } // Cross-browser support as described in:
    // https://stackoverflow.com/questions/1248081


    getClientWidth() {
      /* istanbul ignore if */
      if (typeof document === 'undefined') return 0; // SSR

      return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    getClientHeight() {
      /* istanbul ignore if */
      if (typeof document === 'undefined') return 0; // SSR

      return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

  }
  Breakpoint.property = 'breakpoint';

  // linear
  const linear = t => t; // accelerating from zero velocity

  const easeInQuad = t => t ** 2; // decelerating to zero velocity

  const easeOutQuad = t => t * (2 - t); // acceleration until halfway, then deceleration

  const easeInOutQuad = t => t < 0.5 ? 2 * t ** 2 : -1 + (4 - 2 * t) * t; // accelerating from zero velocity

  const easeInCubic = t => t ** 3; // decelerating to zero velocity

  const easeOutCubic = t => --t ** 3 + 1; // acceleration until halfway, then deceleration

  const easeInOutCubic = t => t < 0.5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; // accelerating from zero velocity

  const easeInQuart = t => t ** 4; // decelerating to zero velocity

  const easeOutQuart = t => 1 - --t ** 4; // acceleration until halfway, then deceleration

  const easeInOutQuart = t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t; // accelerating from zero velocity

  const easeInQuint = t => t ** 5; // decelerating to zero velocity

  const easeOutQuint = t => 1 + --t ** 5; // acceleration until halfway, then deceleration

  const easeInOutQuint = t => t < 0.5 ? 16 * t ** 5 : 1 + 16 * --t ** 5;

  var easingPatterns = /*#__PURE__*/Object.freeze({
    __proto__: null,
    linear: linear,
    easeInQuad: easeInQuad,
    easeOutQuad: easeOutQuad,
    easeInOutQuad: easeInOutQuad,
    easeInCubic: easeInCubic,
    easeOutCubic: easeOutCubic,
    easeInOutCubic: easeInOutCubic,
    easeInQuart: easeInQuart,
    easeOutQuart: easeOutQuart,
    easeInOutQuart: easeInOutQuart,
    easeInQuint: easeInQuint,
    easeOutQuint: easeOutQuint,
    easeInOutQuint: easeInOutQuint
  });

  // Return target's cumulative offset from the top
  function getOffset(target) {
    if (typeof target === 'number') {
      return target;
    }

    let el = $(target);

    if (!el) {
      throw typeof target === 'string' ? new Error(`Target element "${target}" not found.`) : new TypeError(`Target must be a Number/Selector/HTMLElement/VueComponent, received ${type(target)} instead.`);
    }

    let totalOffset = 0;

    while (el) {
      totalOffset += el.offsetTop;
      el = el.offsetParent;
    }

    return totalOffset;
  }
  function getContainer(container) {
    const el = $(container);
    if (el) return el;
    throw typeof container === 'string' ? new Error(`Container element "${container}" not found.`) : new TypeError(`Container must be a Selector/HTMLElement/VueComponent, received ${type(container)} instead.`);
  }

  function type(el) {
    return el == null ? el : el.constructor.name;
  }

  function $(el) {
    if (typeof el === 'string') {
      return document.querySelector(el);
    } else if (el && el._isVue) {
      return el.$el;
    } else if (el instanceof HTMLElement) {
      return el;
    } else {
      return null;
    }
  }

  // Extensions
  function goTo(_target, _settings = {}) {
    const settings = {
      container: document.scrollingElement || document.body || document.documentElement,
      duration: 500,
      offset: 0,
      easing: 'easeInOutCubic',
      appOffset: true,
      ..._settings
    };
    const container = getContainer(settings.container);
    /* istanbul ignore else */

    if (settings.appOffset && goTo.framework.application) {
      const isDrawer = container.classList.contains('v-navigation-drawer');
      const isClipped = container.classList.contains('v-navigation-drawer--clipped');
      const {
        bar,
        top
      } = goTo.framework.application;
      settings.offset += bar;
      /* istanbul ignore else */

      if (!isDrawer || isClipped) settings.offset += top;
    }

    const startTime = performance.now();
    let targetLocation;

    if (typeof _target === 'number') {
      targetLocation = getOffset(_target) - settings.offset;
    } else {
      targetLocation = getOffset(_target) - getOffset(container) - settings.offset;
    }

    const startLocation = container.scrollTop;
    if (targetLocation === startLocation) return Promise.resolve(targetLocation);
    const ease = typeof settings.easing === 'function' ? settings.easing : easingPatterns[settings.easing];
    /* istanbul ignore else */

    if (!ease) throw new TypeError(`Easing function "${settings.easing}" not found.`); // Cannot be tested properly in jsdom
    // tslint:disable-next-line:promise-must-complete

    /* istanbul ignore next */

    return new Promise(resolve => requestAnimationFrame(function step(currentTime) {
      const timeElapsed = currentTime - startTime;
      const progress = Math.abs(settings.duration ? Math.min(timeElapsed / settings.duration, 1) : 1);
      container.scrollTop = Math.floor(startLocation + (targetLocation - startLocation) * ease(progress));
      const clientHeight = container === document.body ? document.documentElement.clientHeight : container.clientHeight;

      if (progress === 1 || clientHeight + container.scrollTop === container.scrollHeight) {
        return resolve(targetLocation);
      }

      requestAnimationFrame(step);
    }));
  }
  goTo.framework = {};

  goTo.init = () => {};

  class Goto extends Service {
    constructor() {
      super();
      return goTo;
    }

  }
  Goto.property = 'goTo';

  const icons = {
    complete: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z',
    cancel: 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z',
    close: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
    delete: 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z',
    clear: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
    success: 'M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z',
    info: 'M13,9H11V7H13M13,17H11V11H13M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z',
    warning: 'M11,4.5H13V15.5H11V4.5M13,17.5V19.5H11V17.5H13Z',
    error: 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z',
    prev: 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z',
    next: 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z',
    checkboxOn: 'M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z',
    checkboxOff: 'M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z',
    checkboxIndeterminate: 'M17,13H7V11H17M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z',
    delimiter: 'M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z',
    sort: 'M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z',
    expand: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
    menu: 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z',
    subgroup: 'M7,10L12,15L17,10H7Z',
    dropdown: 'M7,10L12,15L17,10H7Z',
    radioOn: 'M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,7C9.24,7 7,9.24 7,12C7,14.76 9.24,17 12,17C14.76,17 17,14.76 17,12C17,9.24 14.76,7 12,7Z',
    radioOff: 'M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z',
    edit: 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z',
    ratingEmpty: 'M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z',
    ratingFull: 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z',
    ratingHalf: 'M12,15.4V6.1L13.71,10.13L18.09,10.5L14.77,13.39L15.76,17.67M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z',
    loading: 'M19,8L15,12H18C18,15.31 15.31,18 12,18C11,18 10.03,17.75 9.2,17.3L7.74,18.76C8.97,19.54 10.43,20 12,20C16.42,20 20,16.42 20,12H23M6,12C6,8.69 8.69,6 12,6C13,6 13.97,6.25 14.8,6.7L16.26,5.24C15.03,4.46 13.57,4 12,4C7.58,4 4,7.58 4,12H1L5,16L9,12',
    first: 'M18.41,16.59L13.82,12L18.41,7.41L17,6L11,12L17,18L18.41,16.59M6,6H8V18H6V6Z',
    last: 'M5.59,7.41L10.18,12L5.59,16.59L7,18L13,12L7,6L5.59,7.41M16,6H18V18H16V6Z',
    unfold: 'M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z',
    file: 'M16.5,6V17.5C16.5,19.71 14.71,21.5 12.5,21.5C10.29,21.5 8.5,19.71 8.5,17.5V5C8.5,3.62 9.62,2.5 11,2.5C12.38,2.5 13.5,3.62 13.5,5V15.5C13.5,16.05 13.05,16.5 12.5,16.5C11.95,16.5 11.5,16.05 11.5,15.5V6H10V15.5C10,16.88 11.12,18 12.5,18C13.88,18 15,16.88 15,15.5V5C15,2.79 13.21,1 11,1C8.79,1 7,2.79 7,5V17.5C7,20.54 9.46,23 12.5,23C15.54,23 18,20.54 18,17.5V6H16.5Z',
    plus: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
    minus: 'M19,13H5V11H19V13Z'
  };

  const icons$1 = {
    complete: 'check',
    cancel: 'cancel',
    close: 'close',
    delete: 'cancel',
    clear: 'clear',
    success: 'check_circle',
    info: 'info',
    warning: 'priority_high',
    error: 'warning',
    prev: 'chevron_left',
    next: 'chevron_right',
    checkboxOn: 'check_box',
    checkboxOff: 'check_box_outline_blank',
    checkboxIndeterminate: 'indeterminate_check_box',
    delimiter: 'fiber_manual_record',
    sort: 'arrow_upward',
    expand: 'keyboard_arrow_down',
    menu: 'menu',
    subgroup: 'arrow_drop_down',
    dropdown: 'arrow_drop_down',
    radioOn: 'radio_button_checked',
    radioOff: 'radio_button_unchecked',
    edit: 'edit',
    ratingEmpty: 'star_border',
    ratingFull: 'star',
    ratingHalf: 'star_half',
    loading: 'cached',
    first: 'first_page',
    last: 'last_page',
    unfold: 'unfold_more',
    file: 'attach_file',
    plus: 'add',
    minus: 'remove'
  };

  const icons$2 = {
    complete: 'mdi-check',
    cancel: 'mdi-close-circle',
    close: 'mdi-close',
    delete: 'mdi-close-circle',
    clear: 'mdi-close',
    success: 'mdi-check-circle',
    info: 'mdi-information',
    warning: 'mdi-exclamation',
    error: 'mdi-alert',
    prev: 'mdi-chevron-left',
    next: 'mdi-chevron-right',
    checkboxOn: 'mdi-checkbox-marked',
    checkboxOff: 'mdi-checkbox-blank-outline',
    checkboxIndeterminate: 'mdi-minus-box',
    delimiter: 'mdi-circle',
    sort: 'mdi-arrow-up',
    expand: 'mdi-chevron-down',
    menu: 'mdi-menu',
    subgroup: 'mdi-menu-down',
    dropdown: 'mdi-menu-down',
    radioOn: 'mdi-radiobox-marked',
    radioOff: 'mdi-radiobox-blank',
    edit: 'mdi-pencil',
    ratingEmpty: 'mdi-star-outline',
    ratingFull: 'mdi-star',
    ratingHalf: 'mdi-star-half',
    loading: 'mdi-cached',
    first: 'mdi-page-first',
    last: 'mdi-page-last',
    unfold: 'mdi-unfold-more-horizontal',
    file: 'mdi-paperclip',
    plus: 'mdi-plus',
    minus: 'mdi-minus'
  };

  const icons$3 = {
    complete: 'fas fa-check',
    cancel: 'fas fa-times-circle',
    close: 'fas fa-times',
    delete: 'fas fa-times-circle',
    clear: 'fas fa-times-circle',
    success: 'fas fa-check-circle',
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation',
    error: 'fas fa-exclamation-triangle',
    prev: 'fas fa-chevron-left',
    next: 'fas fa-chevron-right',
    checkboxOn: 'fas fa-check-square',
    checkboxOff: 'far fa-square',
    checkboxIndeterminate: 'fas fa-minus-square',
    delimiter: 'fas fa-circle',
    sort: 'fas fa-sort-up',
    expand: 'fas fa-chevron-down',
    menu: 'fas fa-bars',
    subgroup: 'fas fa-caret-down',
    dropdown: 'fas fa-caret-down',
    radioOn: 'far fa-dot-circle',
    radioOff: 'far fa-circle',
    edit: 'fas fa-edit',
    ratingEmpty: 'far fa-star',
    ratingFull: 'fas fa-star',
    ratingHalf: 'fas fa-star-half',
    loading: 'fas fa-sync',
    first: 'fas fa-step-backward',
    last: 'fas fa-step-forward',
    unfold: 'fas fa-arrows-alt-v',
    file: 'fas fa-paperclip',
    plus: 'fas fa-plus',
    minus: 'fas fa-minus'
  };

  const icons$4 = {
    complete: 'fa fa-check',
    cancel: 'fa fa-times-circle',
    close: 'fa fa-times',
    delete: 'fa fa-times-circle',
    clear: 'fa fa-times-circle',
    success: 'fa fa-check-circle',
    info: 'fa fa-info-circle',
    warning: 'fa fa-exclamation',
    error: 'fa fa-exclamation-triangle',
    prev: 'fa fa-chevron-left',
    next: 'fa fa-chevron-right',
    checkboxOn: 'fa fa-check-square',
    checkboxOff: 'fa fa-square-o',
    checkboxIndeterminate: 'fa fa-minus-square',
    delimiter: 'fa fa-circle',
    sort: 'fa fa-sort-up',
    expand: 'fa fa-chevron-down',
    menu: 'fa fa-bars',
    subgroup: 'fa fa-caret-down',
    dropdown: 'fa fa-caret-down',
    radioOn: 'fa fa-dot-circle-o',
    radioOff: 'fa fa-circle-o',
    edit: 'fa fa-pencil',
    ratingEmpty: 'fa fa-star-o',
    ratingFull: 'fa fa-star',
    ratingHalf: 'fa fa-star-half-o',
    loading: 'fa fa-refresh',
    first: 'fa fa-step-backward',
    last: 'fa fa-step-forward',
    unfold: 'fa fa-angle-double-down',
    file: 'fa fa-paperclip',
    plus: 'fa fa-plus',
    minus: 'fa fa-minus'
  };

  function convertToComponentDeclarations(component, iconSet) {
    const result = {};

    for (const key in iconSet) {
      result[key] = {
        component,
        props: {
          icon: iconSet[key].split(' fa-')
        }
      };
    }

    return result;
  }
  var faSvg = convertToComponentDeclarations('font-awesome-icon', icons$3);

  var presets = Object.freeze({
    mdiSvg: icons,
    md: icons$1,
    mdi: icons$2,
    fa: icons$3,
    fa4: icons$4,
    faSvg
  });

  // Extensions
  class Icons extends Service {
    constructor(preset) {
      super();
      const {
        iconfont,
        values
      } = preset[Icons.property];
      this.iconfont = iconfont;
      this.values = mergeDeep(presets[iconfont], values);
    }

  }
  Icons.property = 'icons';

  // Extensions
  const LANG_PREFIX = '$vuetify.';
  const fallback = Symbol('Lang fallback');

  function getTranslation(locale, key, usingDefault = false, defaultLocale) {
    const shortKey = key.replace(LANG_PREFIX, '');
    let translation = getObjectValueByPath(locale, shortKey, fallback);

    if (translation === fallback) {
      if (usingDefault) {
        consoleError(`Translation key "${shortKey}" not found in fallback`);
        translation = key;
      } else {
        consoleWarn(`Translation key "${shortKey}" not found, falling back to default`);
        translation = getTranslation(defaultLocale, key, true, defaultLocale);
      }
    }

    return translation;
  }

  class Lang extends Service {
    constructor(preset) {
      super();
      this.defaultLocale = 'en';
      const {
        current,
        locales,
        t
      } = preset[Lang.property];
      this.current = current;
      this.locales = locales;
      this.translator = t || this.defaultTranslator;
    }

    currentLocale(key) {
      const translation = this.locales[this.current];
      const defaultLocale = this.locales[this.defaultLocale];
      return getTranslation(translation, key, false, defaultLocale);
    }

    t(key, ...params) {
      if (!key.startsWith(LANG_PREFIX)) return this.replace(key, params);
      return this.translator(key, ...params);
    }

    defaultTranslator(key, ...params) {
      return this.replace(this.currentLocale(key), params);
    }

    replace(str, params) {
      return str.replace(/\{(\d+)\}/g, (match, index) => {
        /* istanbul ignore next */
        return String(params[+index]);
      });
    }

  }
  Lang.property = 'lang';

  var en = {
    badge: 'Badge',
    close: 'Close',
    dataIterator: {
      noResultsText: 'No matching records found',
      loadingText: 'Loading items...'
    },
    dataTable: {
      itemsPerPageText: 'Rows per page:',
      ariaLabel: {
        sortDescending: 'Sorted descending.',
        sortAscending: 'Sorted ascending.',
        sortNone: 'Not sorted.',
        activateNone: 'Activate to remove sorting.',
        activateDescending: 'Activate to sort descending.',
        activateAscending: 'Activate to sort ascending.'
      },
      sortBy: 'Sort by'
    },
    dataFooter: {
      itemsPerPageText: 'Items per page:',
      itemsPerPageAll: 'All',
      nextPage: 'Next page',
      prevPage: 'Previous page',
      firstPage: 'First page',
      lastPage: 'Last page',
      pageText: '{0}-{1} of {2}'
    },
    datePicker: {
      itemsSelected: '{0} selected'
    },
    noDataText: 'No data available',
    carousel: {
      prev: 'Previous visual',
      next: 'Next visual',
      ariaLabel: {
        delimiter: 'Carousel slide {0} of {1}'
      }
    },
    calendar: {
      moreEvents: '{0} more'
    },
    fileInput: {
      counter: '{0} files',
      counterSize: '{0} files ({1} in total)'
    },
    timePicker: {
      am: 'AM',
      pm: 'PM'
    }
  };

  // Styles
  const preset = {
    breakpoint: {
      scrollBarWidth: 16,
      thresholds: {
        xs: 600,
        sm: 960,
        md: 1280,
        lg: 1920
      }
    },
    icons: {
      // TODO: remove v3
      iconfont: 'mdi',
      values: {}
    },
    lang: {
      current: 'en',
      locales: {
        en
      },
      // Default translator exists in lang service
      t: undefined
    },
    rtl: false,
    theme: {
      dark: false,
      default: 'light',
      disable: false,
      options: {
        cspNonce: undefined,
        customProperties: undefined,
        minifyTheme: undefined,
        themeCache: undefined
      },
      themes: {
        light: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00'
        },
        dark: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00'
        }
      }
    }
  };

  // Preset
  class Presets extends Service {
    constructor(parentPreset, parent) {
      super(); // The default preset

      const defaultPreset = mergeDeep({}, preset); // The user provided preset

      const {
        userPreset
      } = parent; // The user provided global preset

      const {
        preset: globalPreset = {},
        ...preset$1
      } = userPreset;

      if (globalPreset.preset != null) {
        consoleWarn('Global presets do not support the **preset** option, it can be safely omitted');
      }

      parent.preset = mergeDeep(mergeDeep(defaultPreset, globalPreset), preset$1);
    }

  }
  Presets.property = 'presets';

  const delta = 0.20689655172413793; // 6÷29

  const cielabForwardTransform = t => t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta ** 2) + 4 / 29;

  const cielabReverseTransform = t => t > delta ? t ** 3 : 3 * delta ** 2 * (t - 4 / 29);

  function fromXYZ$1(xyz) {
    const transform = cielabForwardTransform;
    const transformedY = transform(xyz[1]);
    return [116 * transformedY - 16, 500 * (transform(xyz[0] / 0.95047) - transformedY), 200 * (transformedY - transform(xyz[2] / 1.08883))];
  }
  function toXYZ$1(lab) {
    const transform = cielabReverseTransform;
    const Ln = (lab[0] + 16) / 116;
    return [transform(Ln + lab[1] / 500) * 0.95047, transform(Ln), transform(Ln - lab[2] / 200) * 1.08883];
  }

  function parse(theme, isItem = false) {
    const {
      anchor,
      ...variant
    } = theme;
    const colors = Object.keys(variant);
    const parsedTheme = {};

    for (let i = 0; i < colors.length; ++i) {
      const name = colors[i];
      const value = theme[name];
      if (value == null) continue;

      if (isItem) {
        /* istanbul ignore else */
        if (name === 'base' || name.startsWith('lighten') || name.startsWith('darken')) {
          parsedTheme[name] = colorToHex(value);
        }
      } else if (typeof value === 'object') {
        parsedTheme[name] = parse(value, true);
      } else {
        parsedTheme[name] = genVariations(name, colorToInt(value));
      }
    }

    if (!isItem) {
      parsedTheme.anchor = anchor || parsedTheme.base || parsedTheme.primary.base;
    }

    return parsedTheme;
  }
  /**
   * Generate the CSS for a base color (.primary)
   */

  const genBaseColor = (name, value) => {
    return `
.v-application .${name} {
  background-color: ${value} !important;
  border-color: ${value} !important;
}
.v-application .${name}--text {
  color: ${value} !important;
  caret-color: ${value} !important;
}`;
  };
  /**
   * Generate the CSS for a variant color (.primary.darken-2)
   */


  const genVariantColor = (name, variant, value) => {
    const [type, n] = variant.split(/(\d)/, 2);
    return `
.v-application .${name}.${type}-${n} {
  background-color: ${value} !important;
  border-color: ${value} !important;
}
.v-application .${name}--text.text--${type}-${n} {
  color: ${value} !important;
  caret-color: ${value} !important;
}`;
  };

  const genColorVariableName = (name, variant = 'base') => `--v-${name}-${variant}`;

  const genColorVariable = (name, variant = 'base') => `var(${genColorVariableName(name, variant)})`;

  function genStyles(theme, cssVar = false) {
    const {
      anchor,
      ...variant
    } = theme;
    const colors = Object.keys(variant);
    if (!colors.length) return '';
    let variablesCss = '';
    let css = '';
    const aColor = cssVar ? genColorVariable('anchor') : anchor;
    css += `.v-application a { color: ${aColor}; }`;
    cssVar && (variablesCss += `  ${genColorVariableName('anchor')}: ${anchor};\n`);

    for (let i = 0; i < colors.length; ++i) {
      const name = colors[i];
      const value = theme[name];
      css += genBaseColor(name, cssVar ? genColorVariable(name) : value.base);
      cssVar && (variablesCss += `  ${genColorVariableName(name)}: ${value.base};\n`);
      const variants = Object.keys(value);

      for (let i = 0; i < variants.length; ++i) {
        const variant = variants[i];
        const variantValue = value[variant];
        if (variant === 'base') continue;
        css += genVariantColor(name, variant, cssVar ? genColorVariable(name, variant) : variantValue);
        cssVar && (variablesCss += `  ${genColorVariableName(name, variant)}: ${variantValue};\n`);
      }
    }

    if (cssVar) {
      variablesCss = `:root {\n${variablesCss}}\n\n`;
    }

    return variablesCss + css;
  }
  function genVariations(name, value) {
    const values = {
      base: intToHex(value)
    };

    for (let i = 5; i > 0; --i) {
      values[`lighten${i}`] = intToHex(lighten(value, i));
    }

    for (let i = 1; i <= 4; ++i) {
      values[`darken${i}`] = intToHex(darken(value, i));
    }

    return values;
  }
  function lighten(value, amount) {
    const lab = fromXYZ$1(toXYZ(value));
    lab[0] = lab[0] + amount * 10;
    return fromXYZ(toXYZ$1(lab));
  }
  function darken(value, amount) {
    const lab = fromXYZ$1(toXYZ(value));
    lab[0] = lab[0] - amount * 10;
    return fromXYZ(toXYZ$1(lab));
  }

  /* eslint-disable no-multi-spaces */
  class Theme extends Service {
    constructor(preset) {
      super();
      this.disabled = false;
      this.isDark = null;
      this.vueInstance = null;
      this.vueMeta = null;
      const {
        dark,
        disable,
        options,
        themes
      } = preset[Theme.property];
      this.dark = Boolean(dark);
      this.defaults = this.themes = themes;
      this.options = options;

      if (disable) {
        this.disabled = true;
        return;
      }

      this.themes = {
        dark: this.fillVariant(themes.dark, true),
        light: this.fillVariant(themes.light, false)
      };
    } // When setting css, check for element
    // and apply new values


    set css(val) {
      if (this.vueMeta) {
        if (this.isVueMeta23) {
          this.applyVueMeta23();
        }

        return;
      }

      this.checkOrCreateStyleElement() && (this.styleEl.innerHTML = val);
    }

    set dark(val) {
      const oldDark = this.isDark;
      this.isDark = val; // Only apply theme after dark
      // has already been set before

      oldDark != null && this.applyTheme();
    }

    get dark() {
      return Boolean(this.isDark);
    } // Apply current theme default
    // only called on client side


    applyTheme() {
      if (this.disabled) return this.clearCss();
      this.css = this.generatedStyles;
    }

    clearCss() {
      this.css = '';
    } // Initialize theme for SSR and SPA
    // Attach to ssrContext head or
    // apply new theme to document


    init(root, ssrContext) {
      if (this.disabled) return;
      /* istanbul ignore else */

      if (root.$meta) {
        this.initVueMeta(root);
      } else if (ssrContext) {
        this.initSSR(ssrContext);
      }

      this.initTheme();
    } // Allows for you to set target theme


    setTheme(theme, value) {
      this.themes[theme] = Object.assign(this.themes[theme], value);
      this.applyTheme();
    } // Reset theme defaults


    resetThemes() {
      this.themes.light = Object.assign({}, this.defaults.light);
      this.themes.dark = Object.assign({}, this.defaults.dark);
      this.applyTheme();
    } // Check for existence of style element


    checkOrCreateStyleElement() {
      this.styleEl = document.getElementById('vuetify-theme-stylesheet');
      /* istanbul ignore next */

      if (this.styleEl) return true;
      this.genStyleElement(); // If doesn't have it, create it

      return Boolean(this.styleEl);
    }

    fillVariant(theme = {}, dark) {
      const defaultTheme = this.themes[dark ? 'dark' : 'light'];
      return Object.assign({}, defaultTheme, theme);
    } // Generate the style element
    // if applicable


    genStyleElement() {
      /* istanbul ignore if */
      if (typeof document === 'undefined') return;
      /* istanbul ignore next */

      const options = this.options || {};
      this.styleEl = document.createElement('style');
      this.styleEl.type = 'text/css';
      this.styleEl.id = 'vuetify-theme-stylesheet';

      if (options.cspNonce) {
        this.styleEl.setAttribute('nonce', options.cspNonce);
      }

      document.head.appendChild(this.styleEl);
    }

    initVueMeta(root) {
      this.vueMeta = root.$meta();

      if (this.isVueMeta23) {
        // vue-meta needs to apply after mounted()
        root.$nextTick(() => {
          this.applyVueMeta23();
        });
        return;
      }

      const metaKeyName = typeof this.vueMeta.getOptions === 'function' ? this.vueMeta.getOptions().keyName : 'metaInfo';
      const metaInfo = root.$options[metaKeyName] || {};

      root.$options[metaKeyName] = () => {
        metaInfo.style = metaInfo.style || [];
        const vuetifyStylesheet = metaInfo.style.find(s => s.id === 'vuetify-theme-stylesheet');

        if (!vuetifyStylesheet) {
          metaInfo.style.push({
            cssText: this.generatedStyles,
            type: 'text/css',
            id: 'vuetify-theme-stylesheet',
            nonce: (this.options || {}).cspNonce
          });
        } else {
          vuetifyStylesheet.cssText = this.generatedStyles;
        }

        return metaInfo;
      };
    }

    applyVueMeta23() {
      const {
        set
      } = this.vueMeta.addApp('vuetify');
      set({
        style: [{
          cssText: this.generatedStyles,
          type: 'text/css',
          id: 'vuetify-theme-stylesheet',
          nonce: (this.options || {}).cspNonce
        }]
      });
    }

    initSSR(ssrContext) {
      const options = this.options || {}; // SSR

      const nonce = options.cspNonce ? ` nonce="${options.cspNonce}"` : '';
      ssrContext.head = ssrContext.head || '';
      ssrContext.head += `<style type="text/css" id="vuetify-theme-stylesheet"${nonce}>${this.generatedStyles}</style>`;
    }

    initTheme() {
      // Only watch for reactivity on client side
      if (typeof document === 'undefined') return; // If we get here somehow, ensure
      // existing instance is removed

      if (this.vueInstance) this.vueInstance.$destroy(); // Use Vue instance to track reactivity
      // TODO: Update to use RFC if merged
      // https://github.com/vuejs/rfcs/blob/advanced-reactivity-api/active-rfcs/0000-advanced-reactivity-api.md

      this.vueInstance = new Vue({
        data: {
          themes: this.themes
        },
        watch: {
          themes: {
            immediate: true,
            deep: true,
            handler: () => this.applyTheme()
          }
        }
      });
    }

    get currentTheme() {
      const target = this.dark ? 'dark' : 'light';
      return this.themes[target];
    }

    get generatedStyles() {
      const theme = this.parsedTheme;
      /* istanbul ignore next */

      const options = this.options || {};
      let css;

      if (options.themeCache != null) {
        css = options.themeCache.get(theme);
        /* istanbul ignore if */

        if (css != null) return css;
      }

      css = genStyles(theme, options.customProperties);

      if (options.minifyTheme != null) {
        css = options.minifyTheme(css);
      }

      if (options.themeCache != null) {
        options.themeCache.set(theme, css);
      }

      return css;
    }

    get parsedTheme() {
      /* istanbul ignore next */
      const theme = this.currentTheme || {};
      return parse(theme);
    } // Is using v2.3 of vue-meta
    // https://github.com/nuxt/vue-meta/releases/tag/v2.3.0


    get isVueMeta23() {
      return typeof this.vueMeta.addApp === 'function';
    }

  }
  Theme.property = 'theme';

  class Vuetify {
    constructor(userPreset = {}) {
      this.framework = {};
      this.installed = [];
      this.preset = {};
      this.userPreset = {};
      this.userPreset = userPreset;
      this.use(Presets);
      this.use(Application);
      this.use(Breakpoint);
      this.use(Goto);
      this.use(Icons);
      this.use(Lang);
      this.use(Theme);
    } // Called on the new vuetify instance
    // bootstrap in install beforeCreate
    // Exposes ssrContext if available


    init(root, ssrContext) {
      this.installed.forEach(property => {
        const service = this.framework[property];
        service.framework = this.framework;
        service.init(root, ssrContext);
      }); // rtl is not installed and
      // will never be called by
      // the init process

      this.framework.rtl = Boolean(this.preset.rtl);
    } // Instantiate a VuetifyService


    use(Service) {
      const property = Service.property;
      if (this.installed.includes(property)) return; // TODO maybe a specific type for arg 2?

      this.framework[property] = new Service(this.preset, this);
      this.installed.push(property);
    }

  }
  Vuetify.install = install;
  Vuetify.installed = false;
  Vuetify.version = "2.2.33";

  var script = {
    name: "App",
    components: {
      VImg,
      VSpacer,
      VIcon: VIcon$1,
      VBtn,
      VAppBar,
      VContent,
      VApp
    },
    data: () => {
      return {};
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "v-app",
      [
        _c(
          "v-app-bar",
          { attrs: { app: "", color: "primary", dark: "" } },
          [
            _c(
              "div",
              { staticClass: "d-flex align-center" },
              [
                _c("v-img", {
                  staticClass: "shrink mr-2",
                  attrs: {
                    alt: "Vuetify Logo",
                    contain: "",
                    src:
                      "https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png",
                    transition: "scale-transition",
                    width: "40"
                  }
                }),
                _vm._v(" "),
                _c("v-img", {
                  staticClass: "shrink mt-1 hidden-sm-and-down",
                  attrs: {
                    alt: "Vuetify Name",
                    contain: "",
                    "min-width": "100",
                    src:
                      "https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png",
                    width: "100"
                  }
                })
              ],
              1
            ),
            _vm._v(" "),
            _c("v-spacer"),
            _vm._v(" "),
            _c(
              "v-btn",
              {
                attrs: {
                  href: "https://github.com/vuetifyjs/vuetify/releases/latest",
                  target: "_blank",
                  text: ""
                }
              },
              [
                _c("span", { staticClass: "mr-2" }, [_vm._v("Latest Release")]),
                _vm._v(" "),
                _c("v-icon", [_vm._v("mdi-open-in-new")])
              ],
              1
            )
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "v-content",
          [
            _c("router-link", { attrs: { to: "/" } }, [
              _vm._v("\n      Go to Home\n    ")
            ]),
            _vm._v(" "),
            _c("router-link", { attrs: { to: "/vuelidate" } }, [
              _vm._v("\n      Go to Vuelidate\n    ")
            ]),
            _vm._v(" "),
            _c("router-link", { attrs: { to: "/counter" } }, [
              _vm._v("\n      Go to Counter\n    ")
            ]),
            _vm._v(" "),
            _c("br"),
            _vm._v(" "),
            _c("router-view")
          ],
          1
        )
      ],
      1
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  Vue.use(Vuetify);
  var vuetify2 = new Vuetify({});

  /*!
    * vue-router v3.3.2
    * (c) 2020 Evan You
    * @license MIT
    */

  function isError (err) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1
  }

  function isRouterError (err, errorType) {
    return isError(err) && err._isRouter && (errorType == null || err.type === errorType)
  }

  function extend$1 (a, b) {
    for (var key in b) {
      a[key] = b[key];
    }
    return a
  }

  var View = {
    name: 'RouterView',
    functional: true,
    props: {
      name: {
        type: String,
        default: 'default'
      }
    },
    render: function render (_, ref) {
      var props = ref.props;
      var children = ref.children;
      var parent = ref.parent;
      var data = ref.data;

      // used by devtools to display a router-view badge
      data.routerView = true;

      // directly use parent context's createElement() function
      // so that components rendered by router-view can resolve named slots
      var h = parent.$createElement;
      var name = props.name;
      var route = parent.$route;
      var cache = parent._routerViewCache || (parent._routerViewCache = {});

      // determine current view depth, also check to see if the tree
      // has been toggled inactive but kept-alive.
      var depth = 0;
      var inactive = false;
      while (parent && parent._routerRoot !== parent) {
        var vnodeData = parent.$vnode ? parent.$vnode.data : {};
        if (vnodeData.routerView) {
          depth++;
        }
        if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
          inactive = true;
        }
        parent = parent.$parent;
      }
      data.routerViewDepth = depth;

      // render previous view if the tree is inactive and kept-alive
      if (inactive) {
        var cachedData = cache[name];
        var cachedComponent = cachedData && cachedData.component;
        if (cachedComponent) {
          // #2301
          // pass props
          if (cachedData.configProps) {
            fillPropsinData(cachedComponent, data, cachedData.route, cachedData.configProps);
          }
          return h(cachedComponent, data, children)
        } else {
          // render previous empty view
          return h()
        }
      }

      var matched = route.matched[depth];
      var component = matched && matched.components[name];

      // render empty node if no matched route or no config component
      if (!matched || !component) {
        cache[name] = null;
        return h()
      }

      // cache component
      cache[name] = { component: component };

      // attach instance registration hook
      // this will be called in the instance's injected lifecycle hooks
      data.registerRouteInstance = function (vm, val) {
        // val could be undefined for unregistration
        var current = matched.instances[name];
        if (
          (val && current !== vm) ||
          (!val && current === vm)
        ) {
          matched.instances[name] = val;
        }
      }

      // also register instance in prepatch hook
      // in case the same component instance is reused across different routes
      ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
        matched.instances[name] = vnode.componentInstance;
      };

      // register instance in init hook
      // in case kept-alive component be actived when routes changed
      data.hook.init = function (vnode) {
        if (vnode.data.keepAlive &&
          vnode.componentInstance &&
          vnode.componentInstance !== matched.instances[name]
        ) {
          matched.instances[name] = vnode.componentInstance;
        }
      };

      var configProps = matched.props && matched.props[name];
      // save route and configProps in cachce
      if (configProps) {
        extend$1(cache[name], {
          route: route,
          configProps: configProps
        });
        fillPropsinData(component, data, route, configProps);
      }

      return h(component, data, children)
    }
  };

  function fillPropsinData (component, data, route, configProps) {
    // resolve props
    var propsToPass = data.props = resolveProps(route, configProps);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend$1({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }
  }

  function resolveProps (route, config) {
    switch (typeof config) {
      case 'undefined':
        return
      case 'object':
        return config
      case 'function':
        return config(route)
      case 'boolean':
        return config ? route.params : undefined
    }
  }

  /*  */

  var encodeReserveRE = /[!'()*]/g;
  var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
  var commaRE = /%2C/g;

  // fixed encodeURIComponent which is more conformant to RFC3986:
  // - escapes [!'()*]
  // - preserve commas
  var encode = function (str) { return encodeURIComponent(str)
    .replace(encodeReserveRE, encodeReserveReplacer)
    .replace(commaRE, ','); };

  var decode = decodeURIComponent;

  function resolveQuery (
    query,
    extraQuery,
    _parseQuery
  ) {
    if ( extraQuery === void 0 ) extraQuery = {};

    var parse = _parseQuery || parseQuery;
    var parsedQuery;
    try {
      parsedQuery = parse(query || '');
    } catch (e) {
      parsedQuery = {};
    }
    for (var key in extraQuery) {
      parsedQuery[key] = extraQuery[key];
    }
    return parsedQuery
  }

  function parseQuery (query) {
    var res = {};

    query = query.trim().replace(/^(\?|#|&)/, '');

    if (!query) {
      return res
    }

    query.split('&').forEach(function (param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      var key = decode(parts.shift());
      var val = parts.length > 0
        ? decode(parts.join('='))
        : null;

      if (res[key] === undefined) {
        res[key] = val;
      } else if (Array.isArray(res[key])) {
        res[key].push(val);
      } else {
        res[key] = [res[key], val];
      }
    });

    return res
  }

  function stringifyQuery (obj) {
    var res = obj ? Object.keys(obj).map(function (key) {
      var val = obj[key];

      if (val === undefined) {
        return ''
      }

      if (val === null) {
        return encode(key)
      }

      if (Array.isArray(val)) {
        var result = [];
        val.forEach(function (val2) {
          if (val2 === undefined) {
            return
          }
          if (val2 === null) {
            result.push(encode(key));
          } else {
            result.push(encode(key) + '=' + encode(val2));
          }
        });
        return result.join('&')
      }

      return encode(key) + '=' + encode(val)
    }).filter(function (x) { return x.length > 0; }).join('&') : null;
    return res ? ("?" + res) : ''
  }

  /*  */

  var trailingSlashRE = /\/?$/;

  function createRoute (
    record,
    location,
    redirectedFrom,
    router
  ) {
    var stringifyQuery = router && router.options.stringifyQuery;

    var query = location.query || {};
    try {
      query = clone(query);
    } catch (e) {}

    var route = {
      name: location.name || (record && record.name),
      meta: (record && record.meta) || {},
      path: location.path || '/',
      hash: location.hash || '',
      query: query,
      params: location.params || {},
      fullPath: getFullPath(location, stringifyQuery),
      matched: record ? formatMatch(record) : []
    };
    if (redirectedFrom) {
      route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
    }
    return Object.freeze(route)
  }

  function clone (value) {
    if (Array.isArray(value)) {
      return value.map(clone)
    } else if (value && typeof value === 'object') {
      var res = {};
      for (var key in value) {
        res[key] = clone(value[key]);
      }
      return res
    } else {
      return value
    }
  }

  // the starting route that represents the initial state
  var START = createRoute(null, {
    path: '/'
  });

  function formatMatch (record) {
    var res = [];
    while (record) {
      res.unshift(record);
      record = record.parent;
    }
    return res
  }

  function getFullPath (
    ref,
    _stringifyQuery
  ) {
    var path = ref.path;
    var query = ref.query; if ( query === void 0 ) query = {};
    var hash = ref.hash; if ( hash === void 0 ) hash = '';

    var stringify = _stringifyQuery || stringifyQuery;
    return (path || '/') + stringify(query) + hash
  }

  function isSameRoute (a, b) {
    if (b === START) {
      return a === b
    } else if (!b) {
      return false
    } else if (a.path && b.path) {
      return (
        a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
        a.hash === b.hash &&
        isObjectEqual(a.query, b.query)
      )
    } else if (a.name && b.name) {
      return (
        a.name === b.name &&
        a.hash === b.hash &&
        isObjectEqual(a.query, b.query) &&
        isObjectEqual(a.params, b.params)
      )
    } else {
      return false
    }
  }

  function isObjectEqual (a, b) {
    if ( a === void 0 ) a = {};
    if ( b === void 0 ) b = {};

    // handle null value #1566
    if (!a || !b) { return a === b }
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false
    }
    return aKeys.every(function (key) {
      var aVal = a[key];
      var bVal = b[key];
      // check nested equality
      if (typeof aVal === 'object' && typeof bVal === 'object') {
        return isObjectEqual(aVal, bVal)
      }
      return String(aVal) === String(bVal)
    })
  }

  function isIncludedRoute (current, target) {
    return (
      current.path.replace(trailingSlashRE, '/').indexOf(
        target.path.replace(trailingSlashRE, '/')
      ) === 0 &&
      (!target.hash || current.hash === target.hash) &&
      queryIncludes(current.query, target.query)
    )
  }

  function queryIncludes (current, target) {
    for (var key in target) {
      if (!(key in current)) {
        return false
      }
    }
    return true
  }

  /*  */

  function resolvePath (
    relative,
    base,
    append
  ) {
    var firstChar = relative.charAt(0);
    if (firstChar === '/') {
      return relative
    }

    if (firstChar === '?' || firstChar === '#') {
      return base + relative
    }

    var stack = base.split('/');

    // remove trailing segment if:
    // - not appending
    // - appending to trailing slash (last segment is empty)
    if (!append || !stack[stack.length - 1]) {
      stack.pop();
    }

    // resolve relative path
    var segments = relative.replace(/^\//, '').split('/');
    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      if (segment === '..') {
        stack.pop();
      } else if (segment !== '.') {
        stack.push(segment);
      }
    }

    // ensure leading slash
    if (stack[0] !== '') {
      stack.unshift('');
    }

    return stack.join('/')
  }

  function parsePath$1 (path) {
    var hash = '';
    var query = '';

    var hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      hash = path.slice(hashIndex);
      path = path.slice(0, hashIndex);
    }

    var queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1);
      path = path.slice(0, queryIndex);
    }

    return {
      path: path,
      query: query,
      hash: hash
    }
  }

  function cleanPath (path) {
    return path.replace(/\/\//g, '/')
  }

  var isarray = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
  };

  /**
   * Expose `pathToRegexp`.
   */
  var pathToRegexp_1 = pathToRegexp;
  var parse_1 = parse$1;
  var compile_1 = compile;
  var tokensToFunction_1 = tokensToFunction;
  var tokensToRegExp_1 = tokensToRegExp;

  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */
  var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
  ].join('|'), 'g');

  /**
   * Parse a string for the raw tokens.
   *
   * @param  {string}  str
   * @param  {Object=} options
   * @return {!Array}
   */
  function parse$1 (str, options) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var defaultDelimiter = options && options.delimiter || '/';
    var res;

    while ((res = PATH_REGEXP.exec(str)) != null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length;

      // Ignore already escaped sequences.
      if (escaped) {
        path += escaped[1];
        continue
      }

      var next = str[index];
      var prefix = res[2];
      var name = res[3];
      var capture = res[4];
      var group = res[5];
      var modifier = res[6];
      var asterisk = res[7];

      // Push the current path onto the tokens.
      if (path) {
        tokens.push(path);
        path = '';
      }

      var partial = prefix != null && next != null && next !== prefix;
      var repeat = modifier === '+' || modifier === '*';
      var optional = modifier === '?' || modifier === '*';
      var delimiter = res[2] || defaultDelimiter;
      var pattern = capture || group;

      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        partial: partial,
        asterisk: !!asterisk,
        pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
      });
    }

    // Match any characters still remaining.
    if (index < str.length) {
      path += str.substr(index);
    }

    // If the path exists, push it onto the end.
    if (path) {
      tokens.push(path);
    }

    return tokens
  }

  /**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @param  {Object=}            options
   * @return {!function(Object=, Object=)}
   */
  function compile (str, options) {
    return tokensToFunction(parse$1(str, options), options)
  }

  /**
   * Prettier encoding of URI path segments.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeURIComponentPretty (str) {
    return encodeURI(str).replace(/[\/?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeAsterisk (str) {
    return encodeURI(str).replace(/[?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Expose a method for transforming tokens into the path function.
   */
  function tokensToFunction (tokens, options) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length);

    // Compile all the patterns before compilation.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'object') {
        matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
      }
    }

    return function (obj, opts) {
      var path = '';
      var data = obj || {};
      var options = opts || {};
      var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          path += token;

          continue
        }

        var value = data[token.name];
        var segment;

        if (value == null) {
          if (token.optional) {
            // Prepend partial segment prefixes.
            if (token.partial) {
              path += token.prefix;
            }

            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to be defined')
          }
        }

        if (isarray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
          }

          if (value.length === 0) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to not be empty')
            }
          }

          for (var j = 0; j < value.length; j++) {
            segment = encode(value[j]);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment;
          }

          continue
        }

        segment = token.asterisk ? encodeAsterisk(value) : encode(value);

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
        }

        path += token.prefix + segment;
      }

      return path
    }
  }

  /**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */
  function escapeString (str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
  }

  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */
  function escapeGroup (group) {
    return group.replace(/([=!:$\/()])/g, '\\$1')
  }

  /**
   * Attach the keys as a property of the regexp.
   *
   * @param  {!RegExp} re
   * @param  {Array}   keys
   * @return {!RegExp}
   */
  function attachKeys (re, keys) {
    re.keys = keys;
    return re
  }

  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {string}
   */
  function flags (options) {
    return options && options.sensitive ? '' : 'i'
  }

  /**
   * Pull out keys from a regexp.
   *
   * @param  {!RegExp} path
   * @param  {!Array}  keys
   * @return {!RegExp}
   */
  function regexpToRegexp (path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          partial: false,
          asterisk: false,
          pattern: null
        });
      }
    }

    return attachKeys(path, keys)
  }

  /**
   * Transform an array into a regexp.
   *
   * @param  {!Array}  path
   * @param  {Array}   keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function arrayToRegexp (path, keys, options) {
    var parts = [];

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source);
    }

    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

    return attachKeys(regexp, keys)
  }

  /**
   * Create a path regexp from string input.
   *
   * @param  {string}  path
   * @param  {!Array}  keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function stringToRegexp (path, keys, options) {
    return tokensToRegExp(parse$1(path, options), keys, options)
  }

  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {!Array}          tokens
   * @param  {(Array|Object)=} keys
   * @param  {Object=}         options
   * @return {!RegExp}
   */
  function tokensToRegExp (tokens, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options);
      keys = [];
    }

    options = options || {};

    var strict = options.strict;
    var end = options.end !== false;
    var route = '';

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        route += escapeString(token);
      } else {
        var prefix = escapeString(token.prefix);
        var capture = '(?:' + token.pattern + ')';

        keys.push(token);

        if (token.repeat) {
          capture += '(?:' + prefix + capture + ')*';
        }

        if (token.optional) {
          if (!token.partial) {
            capture = '(?:' + prefix + '(' + capture + '))?';
          } else {
            capture = prefix + '(' + capture + ')?';
          }
        } else {
          capture = prefix + '(' + capture + ')';
        }

        route += capture;
      }
    }

    var delimiter = escapeString(options.delimiter || '/');
    var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    if (!strict) {
      route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
    }

    if (end) {
      route += '$';
    } else {
      // In non-ending mode, we need the capturing groups to match as much as
      // possible by using a positive lookahead to the end or next path segment.
      route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
    }

    return attachKeys(new RegExp('^' + route, flags(options)), keys)
  }

  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(string|RegExp|Array)} path
   * @param  {(Array|Object)=}       keys
   * @param  {Object=}               options
   * @return {!RegExp}
   */
  function pathToRegexp (path, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options);
      keys = [];
    }

    options = options || {};

    if (path instanceof RegExp) {
      return regexpToRegexp(path, /** @type {!Array} */ (keys))
    }

    if (isarray(path)) {
      return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
    }

    return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
  }
  pathToRegexp_1.parse = parse_1;
  pathToRegexp_1.compile = compile_1;
  pathToRegexp_1.tokensToFunction = tokensToFunction_1;
  pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

  /*  */

  // $flow-disable-line
  var regexpCompileCache = Object.create(null);

  function fillParams (
    path,
    params,
    routeMsg
  ) {
    params = params || {};
    try {
      var filler =
        regexpCompileCache[path] ||
        (regexpCompileCache[path] = pathToRegexp_1.compile(path));

      // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
      // and fix #3106 so that you can work with location descriptor object having params.pathMatch equal to empty string
      if (typeof params.pathMatch === 'string') { params[0] = params.pathMatch; }

      return filler(params, { pretty: true })
    } catch (e) {
      return ''
    } finally {
      // delete the 0 if it was added
      delete params[0];
    }
  }

  /*  */

  function normalizeLocation (
    raw,
    current,
    append,
    router
  ) {
    var next = typeof raw === 'string' ? { path: raw } : raw;
    // named target
    if (next._normalized) {
      return next
    } else if (next.name) {
      next = extend$1({}, raw);
      var params = next.params;
      if (params && typeof params === 'object') {
        next.params = extend$1({}, params);
      }
      return next
    }

    // relative params
    if (!next.path && next.params && current) {
      next = extend$1({}, next);
      next._normalized = true;
      var params$1 = extend$1(extend$1({}, current.params), next.params);
      if (current.name) {
        next.name = current.name;
        next.params = params$1;
      } else if (current.matched.length) {
        var rawPath = current.matched[current.matched.length - 1].path;
        next.path = fillParams(rawPath, params$1, ("path " + (current.path)));
      }
      return next
    }

    var parsedPath = parsePath$1(next.path || '');
    var basePath = (current && current.path) || '/';
    var path = parsedPath.path
      ? resolvePath(parsedPath.path, basePath, append || next.append)
      : basePath;

    var query = resolveQuery(
      parsedPath.query,
      next.query,
      router && router.options.parseQuery
    );

    var hash = next.hash || parsedPath.hash;
    if (hash && hash.charAt(0) !== '#') {
      hash = "#" + hash;
    }

    return {
      _normalized: true,
      path: path,
      query: query,
      hash: hash
    }
  }

  /*  */

  // work around weird flow bug
  var toTypes = [String, Object];
  var eventTypes = [String, Array];

  var noop$1 = function () {};

  var Link = {
    name: 'RouterLink',
    props: {
      to: {
        type: toTypes,
        required: true
      },
      tag: {
        type: String,
        default: 'a'
      },
      exact: Boolean,
      append: Boolean,
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      ariaCurrentValue: {
        type: String,
        default: 'page'
      },
      event: {
        type: eventTypes,
        default: 'click'
      }
    },
    render: function render (h) {
      var this$1 = this;

      var router = this.$router;
      var current = this.$route;
      var ref = router.resolve(
        this.to,
        current,
        this.append
      );
      var location = ref.location;
      var route = ref.route;
      var href = ref.href;

      var classes = {};
      var globalActiveClass = router.options.linkActiveClass;
      var globalExactActiveClass = router.options.linkExactActiveClass;
      // Support global empty active class
      var activeClassFallback =
        globalActiveClass == null ? 'router-link-active' : globalActiveClass;
      var exactActiveClassFallback =
        globalExactActiveClass == null
          ? 'router-link-exact-active'
          : globalExactActiveClass;
      var activeClass =
        this.activeClass == null ? activeClassFallback : this.activeClass;
      var exactActiveClass =
        this.exactActiveClass == null
          ? exactActiveClassFallback
          : this.exactActiveClass;

      var compareTarget = route.redirectedFrom
        ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router)
        : route;

      classes[exactActiveClass] = isSameRoute(current, compareTarget);
      classes[activeClass] = this.exact
        ? classes[exactActiveClass]
        : isIncludedRoute(current, compareTarget);

      var ariaCurrentValue = classes[exactActiveClass] ? this.ariaCurrentValue : null;

      var handler = function (e) {
        if (guardEvent(e)) {
          if (this$1.replace) {
            router.replace(location, noop$1);
          } else {
            router.push(location, noop$1);
          }
        }
      };

      var on = { click: guardEvent };
      if (Array.isArray(this.event)) {
        this.event.forEach(function (e) {
          on[e] = handler;
        });
      } else {
        on[this.event] = handler;
      }

      var data = { class: classes };

      var scopedSlot =
        !this.$scopedSlots.$hasNormal &&
        this.$scopedSlots.default &&
        this.$scopedSlots.default({
          href: href,
          route: route,
          navigate: handler,
          isActive: classes[activeClass],
          isExactActive: classes[exactActiveClass]
        });

      if (scopedSlot) {
        if (scopedSlot.length === 1) {
          return scopedSlot[0]
        } else if (scopedSlot.length > 1 || !scopedSlot.length) {
          return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot)
        }
      }

      if (this.tag === 'a') {
        data.on = on;
        data.attrs = { href: href, 'aria-current': ariaCurrentValue };
      } else {
        // find the first <a> child and apply listener and href
        var a = findAnchor(this.$slots.default);
        if (a) {
          // in case the <a> is a static node
          a.isStatic = false;
          var aData = (a.data = extend$1({}, a.data));
          aData.on = aData.on || {};
          // transform existing events in both objects into arrays so we can push later
          for (var event in aData.on) {
            var handler$1 = aData.on[event];
            if (event in on) {
              aData.on[event] = Array.isArray(handler$1) ? handler$1 : [handler$1];
            }
          }
          // append new listeners for router-link
          for (var event$1 in on) {
            if (event$1 in aData.on) {
              // on[event] is always a function
              aData.on[event$1].push(on[event$1]);
            } else {
              aData.on[event$1] = handler;
            }
          }

          var aAttrs = (a.data.attrs = extend$1({}, a.data.attrs));
          aAttrs.href = href;
          aAttrs['aria-current'] = ariaCurrentValue;
        } else {
          // doesn't have <a> child, apply listener to self
          data.on = on;
        }
      }

      return h(this.tag, data, this.$slots.default)
    }
  };

  function guardEvent (e) {
    // don't redirect with control keys
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
    // don't redirect when preventDefault called
    if (e.defaultPrevented) { return }
    // don't redirect on right click
    if (e.button !== undefined && e.button !== 0) { return }
    // don't redirect if `target="_blank"`
    if (e.currentTarget && e.currentTarget.getAttribute) {
      var target = e.currentTarget.getAttribute('target');
      if (/\b_blank\b/i.test(target)) { return }
    }
    // this may be a Weex event which doesn't have this method
    if (e.preventDefault) {
      e.preventDefault();
    }
    return true
  }

  function findAnchor (children) {
    if (children) {
      var child;
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.tag === 'a') {
          return child
        }
        if (child.children && (child = findAnchor(child.children))) {
          return child
        }
      }
    }
  }

  var _Vue;

  function install$1 (Vue) {
    if (install$1.installed && _Vue === Vue) { return }
    install$1.installed = true;

    _Vue = Vue;

    var isDef = function (v) { return v !== undefined; };

    var registerInstance = function (vm, callVal) {
      var i = vm.$options._parentVnode;
      if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
        i(vm, callVal);
      }
    };

    Vue.mixin({
      beforeCreate: function beforeCreate () {
        if (isDef(this.$options.router)) {
          this._routerRoot = this;
          this._router = this.$options.router;
          this._router.init(this);
          Vue.util.defineReactive(this, '_route', this._router.history.current);
        } else {
          this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
        }
        registerInstance(this, this);
      },
      destroyed: function destroyed () {
        registerInstance(this);
      }
    });

    Object.defineProperty(Vue.prototype, '$router', {
      get: function get () { return this._routerRoot._router }
    });

    Object.defineProperty(Vue.prototype, '$route', {
      get: function get () { return this._routerRoot._route }
    });

    Vue.component('RouterView', View);
    Vue.component('RouterLink', Link);

    var strats = Vue.config.optionMergeStrategies;
    // use the same hook merging strategy for route hooks
    strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
  }

  /*  */

  var inBrowser$1 = typeof window !== 'undefined';

  /*  */

  function createRouteMap (
    routes,
    oldPathList,
    oldPathMap,
    oldNameMap
  ) {
    // the path list is used to control path matching priority
    var pathList = oldPathList || [];
    // $flow-disable-line
    var pathMap = oldPathMap || Object.create(null);
    // $flow-disable-line
    var nameMap = oldNameMap || Object.create(null);

    routes.forEach(function (route) {
      addRouteRecord(pathList, pathMap, nameMap, route);
    });

    // ensure wildcard routes are always at the end
    for (var i = 0, l = pathList.length; i < l; i++) {
      if (pathList[i] === '*') {
        pathList.push(pathList.splice(i, 1)[0]);
        l--;
        i--;
      }
    }

    return {
      pathList: pathList,
      pathMap: pathMap,
      nameMap: nameMap
    }
  }

  function addRouteRecord (
    pathList,
    pathMap,
    nameMap,
    route,
    parent,
    matchAs
  ) {
    var path = route.path;
    var name = route.name;

    var pathToRegexpOptions =
      route.pathToRegexpOptions || {};
    var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);

    if (typeof route.caseSensitive === 'boolean') {
      pathToRegexpOptions.sensitive = route.caseSensitive;
    }

    var record = {
      path: normalizedPath,
      regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
      components: route.components || { default: route.component },
      instances: {},
      name: name,
      parent: parent,
      matchAs: matchAs,
      redirect: route.redirect,
      beforeEnter: route.beforeEnter,
      meta: route.meta || {},
      props:
        route.props == null
          ? {}
          : route.components
            ? route.props
            : { default: route.props }
    };

    if (route.children) {
      route.children.forEach(function (child) {
        var childMatchAs = matchAs
          ? cleanPath((matchAs + "/" + (child.path)))
          : undefined;
        addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
      });
    }

    if (!pathMap[record.path]) {
      pathList.push(record.path);
      pathMap[record.path] = record;
    }

    if (route.alias !== undefined) {
      var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];
      for (var i = 0; i < aliases.length; ++i) {
        var alias = aliases[i];

        var aliasRoute = {
          path: alias,
          children: route.children
        };
        addRouteRecord(
          pathList,
          pathMap,
          nameMap,
          aliasRoute,
          parent,
          record.path || '/' // matchAs
        );
      }
    }

    if (name) {
      if (!nameMap[name]) {
        nameMap[name] = record;
      }
    }
  }

  function compileRouteRegex (
    path,
    pathToRegexpOptions
  ) {
    var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
    return regex
  }

  function normalizePath (
    path,
    parent,
    strict
  ) {
    if (!strict) { path = path.replace(/\/$/, ''); }
    if (path[0] === '/') { return path }
    if (parent == null) { return path }
    return cleanPath(((parent.path) + "/" + path))
  }

  /*  */



  function createMatcher (
    routes,
    router
  ) {
    var ref = createRouteMap(routes);
    var pathList = ref.pathList;
    var pathMap = ref.pathMap;
    var nameMap = ref.nameMap;

    function addRoutes (routes) {
      createRouteMap(routes, pathList, pathMap, nameMap);
    }

    function match (
      raw,
      currentRoute,
      redirectedFrom
    ) {
      var location = normalizeLocation(raw, currentRoute, false, router);
      var name = location.name;

      if (name) {
        var record = nameMap[name];
        if (!record) { return _createRoute(null, location) }
        var paramNames = record.regex.keys
          .filter(function (key) { return !key.optional; })
          .map(function (key) { return key.name; });

        if (typeof location.params !== 'object') {
          location.params = {};
        }

        if (currentRoute && typeof currentRoute.params === 'object') {
          for (var key in currentRoute.params) {
            if (!(key in location.params) && paramNames.indexOf(key) > -1) {
              location.params[key] = currentRoute.params[key];
            }
          }
        }

        location.path = fillParams(record.path, location.params);
        return _createRoute(record, location, redirectedFrom)
      } else if (location.path) {
        location.params = {};
        for (var i = 0; i < pathList.length; i++) {
          var path = pathList[i];
          var record$1 = pathMap[path];
          if (matchRoute(record$1.regex, location.path, location.params)) {
            return _createRoute(record$1, location, redirectedFrom)
          }
        }
      }
      // no match
      return _createRoute(null, location)
    }

    function redirect (
      record,
      location
    ) {
      var originalRedirect = record.redirect;
      var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

      if (typeof redirect === 'string') {
        redirect = { path: redirect };
      }

      if (!redirect || typeof redirect !== 'object') {
        return _createRoute(null, location)
      }

      var re = redirect;
      var name = re.name;
      var path = re.path;
      var query = location.query;
      var hash = location.hash;
      var params = location.params;
      query = re.hasOwnProperty('query') ? re.query : query;
      hash = re.hasOwnProperty('hash') ? re.hash : hash;
      params = re.hasOwnProperty('params') ? re.params : params;

      if (name) {
        // resolved named direct
        var targetRecord = nameMap[name];
        return match({
          _normalized: true,
          name: name,
          query: query,
          hash: hash,
          params: params
        }, undefined, location)
      } else if (path) {
        // 1. resolve relative redirect
        var rawPath = resolveRecordPath(path, record);
        // 2. resolve params
        var resolvedPath = fillParams(rawPath, params);
        // 3. rematch with existing query and hash
        return match({
          _normalized: true,
          path: resolvedPath,
          query: query,
          hash: hash
        }, undefined, location)
      } else {
        return _createRoute(null, location)
      }
    }

    function alias (
      record,
      location,
      matchAs
    ) {
      var aliasedPath = fillParams(matchAs, location.params);
      var aliasedMatch = match({
        _normalized: true,
        path: aliasedPath
      });
      if (aliasedMatch) {
        var matched = aliasedMatch.matched;
        var aliasedRecord = matched[matched.length - 1];
        location.params = aliasedMatch.params;
        return _createRoute(aliasedRecord, location)
      }
      return _createRoute(null, location)
    }

    function _createRoute (
      record,
      location,
      redirectedFrom
    ) {
      if (record && record.redirect) {
        return redirect(record, redirectedFrom || location)
      }
      if (record && record.matchAs) {
        return alias(record, location, record.matchAs)
      }
      return createRoute(record, location, redirectedFrom, router)
    }

    return {
      match: match,
      addRoutes: addRoutes
    }
  }

  function matchRoute (
    regex,
    path,
    params
  ) {
    var m = path.match(regex);

    if (!m) {
      return false
    } else if (!params) {
      return true
    }

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = regex.keys[i - 1];
      var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
      if (key) {
        // Fix #1994: using * with props: true generates a param named 0
        params[key.name || 'pathMatch'] = val;
      }
    }

    return true
  }

  function resolveRecordPath (path, record) {
    return resolvePath(path, record.parent ? record.parent.path : '/', true)
  }

  /*  */

  // use User Timing api (if present) for more accurate key precision
  var Time =
    inBrowser$1 && window.performance && window.performance.now
      ? window.performance
      : Date;

  function genStateKey () {
    return Time.now().toFixed(3)
  }

  var _key = genStateKey();

  function getStateKey () {
    return _key
  }

  function setStateKey (key) {
    return (_key = key)
  }

  /*  */

  var positionStore = Object.create(null);

  function setupScroll () {
    // Prevent browser scroll behavior on History popstate
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Fix for #1585 for Firefox
    // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
    // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with
    // window.location.protocol + '//' + window.location.host
    // location.host contains the port and location.hostname doesn't
    var protocolAndPath = window.location.protocol + '//' + window.location.host;
    var absolutePath = window.location.href.replace(protocolAndPath, '');
    // preserve existing history state as it could be overriden by the user
    var stateCopy = extend$1({}, window.history.state);
    stateCopy.key = getStateKey();
    window.history.replaceState(stateCopy, '', absolutePath);
    window.addEventListener('popstate', handlePopState);
    return function () {
      window.removeEventListener('popstate', handlePopState);
    }
  }

  function handleScroll (
    router,
    to,
    from,
    isPop
  ) {
    if (!router.app) {
      return
    }

    var behavior = router.options.scrollBehavior;
    if (!behavior) {
      return
    }

    // wait until re-render finishes before scrolling
    router.app.$nextTick(function () {
      var position = getScrollPosition();
      var shouldScroll = behavior.call(
        router,
        to,
        from,
        isPop ? position : null
      );

      if (!shouldScroll) {
        return
      }

      if (typeof shouldScroll.then === 'function') {
        shouldScroll
          .then(function (shouldScroll) {
            scrollToPosition((shouldScroll), position);
          })
          .catch(function (err) {
          });
      } else {
        scrollToPosition(shouldScroll, position);
      }
    });
  }

  function saveScrollPosition () {
    var key = getStateKey();
    if (key) {
      positionStore[key] = {
        x: window.pageXOffset,
        y: window.pageYOffset
      };
    }
  }

  function handlePopState (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  }

  function getScrollPosition () {
    var key = getStateKey();
    if (key) {
      return positionStore[key]
    }
  }

  function getElementPosition (el, offset) {
    var docEl = document.documentElement;
    var docRect = docEl.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - docRect.left - offset.x,
      y: elRect.top - docRect.top - offset.y
    }
  }

  function isValidPosition (obj) {
    return isNumber(obj.x) || isNumber(obj.y)
  }

  function normalizePosition (obj) {
    return {
      x: isNumber(obj.x) ? obj.x : window.pageXOffset,
      y: isNumber(obj.y) ? obj.y : window.pageYOffset
    }
  }

  function normalizeOffset (obj) {
    return {
      x: isNumber(obj.x) ? obj.x : 0,
      y: isNumber(obj.y) ? obj.y : 0
    }
  }

  function isNumber (v) {
    return typeof v === 'number'
  }

  var hashStartsWithNumberRE = /^#\d/;

  function scrollToPosition (shouldScroll, position) {
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      // getElementById would still fail if the selector contains a more complicated query like #main[data-attr]
      // but at the same time, it doesn't make much sense to select an element with an id and an extra selector
      var el = hashStartsWithNumberRE.test(shouldScroll.selector) // $flow-disable-line
        ? document.getElementById(shouldScroll.selector.slice(1)) // $flow-disable-line
        : document.querySelector(shouldScroll.selector);

      if (el) {
        var offset =
          shouldScroll.offset && typeof shouldScroll.offset === 'object'
            ? shouldScroll.offset
            : {};
        offset = normalizeOffset(offset);
        position = getElementPosition(el, offset);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  }

  /*  */

  var supportsPushState =
    inBrowser$1 &&
    (function () {
      var ua = window.navigator.userAgent;

      if (
        (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1
      ) {
        return false
      }

      return window.history && typeof window.history.pushState === 'function'
    })();

  function pushState (url, replace) {
    saveScrollPosition();
    // try...catch the pushState call to get around Safari
    // DOM Exception 18 where it limits to 100 pushState calls
    var history = window.history;
    try {
      if (replace) {
        // preserve existing history state as it could be overriden by the user
        var stateCopy = extend$1({}, history.state);
        stateCopy.key = getStateKey();
        history.replaceState(stateCopy, '', url);
      } else {
        history.pushState({ key: setStateKey(genStateKey()) }, '', url);
      }
    } catch (e) {
      window.location[replace ? 'replace' : 'assign'](url);
    }
  }

  function replaceState (url) {
    pushState(url, true);
  }

  /*  */

  function runQueue (queue, fn, cb) {
    var step = function (index) {
      if (index >= queue.length) {
        cb();
      } else {
        if (queue[index]) {
          fn(queue[index], function () {
            step(index + 1);
          });
        } else {
          step(index + 1);
        }
      }
    };
    step(0);
  }

  /*  */

  function resolveAsyncComponents (matched) {
    return function (to, from, next) {
      var hasAsync = false;
      var pending = 0;
      var error = null;

      flatMapComponents(matched, function (def, _, match, key) {
        // if it's a function and doesn't have cid attached,
        // assume it's an async component resolve function.
        // we are not using Vue's default async resolving mechanism because
        // we want to halt the navigation until the incoming component has been
        // resolved.
        if (typeof def === 'function' && def.cid === undefined) {
          hasAsync = true;
          pending++;

          var resolve = once$1(function (resolvedDef) {
            if (isESModule(resolvedDef)) {
              resolvedDef = resolvedDef.default;
            }
            // save resolved on async factory in case it's used elsewhere
            def.resolved = typeof resolvedDef === 'function'
              ? resolvedDef
              : _Vue.extend(resolvedDef);
            match.components[key] = resolvedDef;
            pending--;
            if (pending <= 0) {
              next();
            }
          });

          var reject = once$1(function (reason) {
            var msg = "Failed to resolve async component " + key + ": " + reason;
            if (!error) {
              error = isError(reason)
                ? reason
                : new Error(msg);
              next(error);
            }
          });

          var res;
          try {
            res = def(resolve, reject);
          } catch (e) {
            reject(e);
          }
          if (res) {
            if (typeof res.then === 'function') {
              res.then(resolve, reject);
            } else {
              // new syntax in Vue 2.3
              var comp = res.component;
              if (comp && typeof comp.then === 'function') {
                comp.then(resolve, reject);
              }
            }
          }
        }
      });

      if (!hasAsync) { next(); }
    }
  }

  function flatMapComponents (
    matched,
    fn
  ) {
    return flatten(matched.map(function (m) {
      return Object.keys(m.components).map(function (key) { return fn(
        m.components[key],
        m.instances[key],
        m, key
      ); })
    }))
  }

  function flatten (arr) {
    return Array.prototype.concat.apply([], arr)
  }

  var hasSymbol$1 =
    typeof Symbol === 'function' &&
    typeof Symbol.toStringTag === 'symbol';

  function isESModule (obj) {
    return obj.__esModule || (hasSymbol$1 && obj[Symbol.toStringTag] === 'Module')
  }

  // in Webpack 2, require.ensure now also returns a Promise
  // so the resolve/reject functions may get called an extra time
  // if the user uses an arrow function shorthand that happens to
  // return that Promise.
  function once$1 (fn) {
    var called = false;
    return function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (called) { return }
      called = true;
      return fn.apply(this, args)
    }
  }

  var NavigationFailureType = {
    redirected: 1,
    aborted: 2,
    cancelled: 3,
    duplicated: 4
  };

  function createNavigationRedirectedError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.redirected,
      ("Redirected from \"" + (from.fullPath) + "\" to \"" + (stringifyRoute(to)) + "\" via a navigation guard.")
    )
  }

  function createNavigationDuplicatedError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.duplicated,
      ("Avoided redundant navigation to current location: \"" + (from.fullPath) + "\".")
    )
  }

  function createNavigationCancelledError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.cancelled,
      ("Navigation cancelled from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" with a new navigation.")
    )
  }

  function createNavigationAbortedError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.aborted,
      ("Navigation aborted from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" via a navigation guard.")
    )
  }

  function createRouterError (from, to, type, message) {
    var error = new Error(message);
    error._isRouter = true;
    error.from = from;
    error.to = to;
    error.type = type;

    return error
  }

  var propertiesToLog = ['params', 'query', 'hash'];

  function stringifyRoute (to) {
    if (typeof to === 'string') { return to }
    if ('path' in to) { return to.path }
    var location = {};
    propertiesToLog.forEach(function (key) {
      if (key in to) { location[key] = to[key]; }
    });
    return JSON.stringify(location, null, 2)
  }

  /*  */

  var History = function History (router, base) {
    this.router = router;
    this.base = normalizeBase(base);
    // start with a route object that stands for "nowhere"
    this.current = START;
    this.pending = null;
    this.ready = false;
    this.readyCbs = [];
    this.readyErrorCbs = [];
    this.errorCbs = [];
    this.listeners = [];
  };

  History.prototype.listen = function listen (cb) {
    this.cb = cb;
  };

  History.prototype.onReady = function onReady (cb, errorCb) {
    if (this.ready) {
      cb();
    } else {
      this.readyCbs.push(cb);
      if (errorCb) {
        this.readyErrorCbs.push(errorCb);
      }
    }
  };

  History.prototype.onError = function onError (errorCb) {
    this.errorCbs.push(errorCb);
  };

  History.prototype.transitionTo = function transitionTo (
    location,
    onComplete,
    onAbort
  ) {
      var this$1 = this;

    var route = this.router.match(location, this.current);
    this.confirmTransition(
      route,
      function () {
        var prev = this$1.current;
        this$1.updateRoute(route);
        onComplete && onComplete(route);
        this$1.ensureURL();
        this$1.router.afterHooks.forEach(function (hook) {
          hook && hook(route, prev);
        });

        // fire ready cbs once
        if (!this$1.ready) {
          this$1.ready = true;
          this$1.readyCbs.forEach(function (cb) {
            cb(route);
          });
        }
      },
      function (err) {
        if (onAbort) {
          onAbort(err);
        }
        if (err && !this$1.ready) {
          this$1.ready = true;
          this$1.readyErrorCbs.forEach(function (cb) {
            cb(err);
          });
        }
      }
    );
  };

  History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
      var this$1 = this;

    var current = this.current;
    var abort = function (err) {
      // changed after adding errors with
      // https://github.com/vuejs/vue-router/pull/3047 before that change,
      // redirect and aborted navigation would produce an err == null
      if (!isRouterError(err) && isError(err)) {
        if (this$1.errorCbs.length) {
          this$1.errorCbs.forEach(function (cb) {
            cb(err);
          });
        } else {
          console.error(err);
        }
      }
      onAbort && onAbort(err);
    };
    if (
      isSameRoute(route, current) &&
      // in the case the route map has been dynamically appended to
      route.matched.length === current.matched.length
    ) {
      this.ensureURL();
      return abort(createNavigationDuplicatedError(current, route))
    }

    var ref = resolveQueue(
      this.current.matched,
      route.matched
    );
      var updated = ref.updated;
      var deactivated = ref.deactivated;
      var activated = ref.activated;

    var queue = [].concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // in-config enter guards
      activated.map(function (m) { return m.beforeEnter; }),
      // async components
      resolveAsyncComponents(activated)
    );

    this.pending = route;
    var iterator = function (hook, next) {
      if (this$1.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      try {
        hook(route, current, function (to) {
          if (to === false) {
            // next(false) -> abort navigation, ensure current URL
            this$1.ensureURL(true);
            abort(createNavigationAbortedError(current, route));
          } else if (isError(to)) {
            this$1.ensureURL(true);
            abort(to);
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort(createNavigationRedirectedError(current, route));
            if (typeof to === 'object' && to.replace) {
              this$1.replace(to);
            } else {
              this$1.push(to);
            }
          } else {
            // confirm transition and pass on the value
            next(to);
          }
        });
      } catch (e) {
        abort(e);
      }
    };

    runQueue(queue, iterator, function () {
      var postEnterCbs = [];
      var isValid = function () { return this$1.current === route; };
      // wait until async components are resolved before
      // extracting in-component enter guards
      var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
      var queue = enterGuards.concat(this$1.router.resolveHooks);
      runQueue(queue, iterator, function () {
        if (this$1.pending !== route) {
          return abort(createNavigationCancelledError(current, route))
        }
        this$1.pending = null;
        onComplete(route);
        if (this$1.router.app) {
          this$1.router.app.$nextTick(function () {
            postEnterCbs.forEach(function (cb) {
              cb();
            });
          });
        }
      });
    });
  };

  History.prototype.updateRoute = function updateRoute (route) {
    this.current = route;
    this.cb && this.cb(route);
  };

  History.prototype.setupListeners = function setupListeners () {
    // Default implementation is empty
  };

  History.prototype.teardownListeners = function teardownListeners () {
    this.listeners.forEach(function (cleanupListener) {
      cleanupListener();
    });
    this.listeners = [];
  };

  function normalizeBase (base) {
    if (!base) {
      if (inBrowser$1) {
        // respect <base> tag
        var baseEl = document.querySelector('base');
        base = (baseEl && baseEl.getAttribute('href')) || '/';
        // strip full URL origin
        base = base.replace(/^https?:\/\/[^\/]+/, '');
      } else {
        base = '/';
      }
    }
    // make sure there's the starting slash
    if (base.charAt(0) !== '/') {
      base = '/' + base;
    }
    // remove trailing slash
    return base.replace(/\/$/, '')
  }

  function resolveQueue (
    current,
    next
  ) {
    var i;
    var max = Math.max(current.length, next.length);
    for (i = 0; i < max; i++) {
      if (current[i] !== next[i]) {
        break
      }
    }
    return {
      updated: next.slice(0, i),
      activated: next.slice(i),
      deactivated: current.slice(i)
    }
  }

  function extractGuards (
    records,
    name,
    bind,
    reverse
  ) {
    var guards = flatMapComponents(records, function (def, instance, match, key) {
      var guard = extractGuard(def, name);
      if (guard) {
        return Array.isArray(guard)
          ? guard.map(function (guard) { return bind(guard, instance, match, key); })
          : bind(guard, instance, match, key)
      }
    });
    return flatten(reverse ? guards.reverse() : guards)
  }

  function extractGuard (
    def,
    key
  ) {
    if (typeof def !== 'function') {
      // extend now so that global mixins are applied.
      def = _Vue.extend(def);
    }
    return def.options[key]
  }

  function extractLeaveGuards (deactivated) {
    return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
  }

  function extractUpdateHooks (updated) {
    return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
  }

  function bindGuard (guard, instance) {
    if (instance) {
      return function boundRouteGuard () {
        return guard.apply(instance, arguments)
      }
    }
  }

  function extractEnterGuards (
    activated,
    cbs,
    isValid
  ) {
    return extractGuards(
      activated,
      'beforeRouteEnter',
      function (guard, _, match, key) {
        return bindEnterGuard(guard, match, key, cbs, isValid)
      }
    )
  }

  function bindEnterGuard (
    guard,
    match,
    key,
    cbs,
    isValid
  ) {
    return function routeEnterGuard (to, from, next) {
      return guard(to, from, function (cb) {
        if (typeof cb === 'function') {
          cbs.push(function () {
            // #750
            // if a router-view is wrapped with an out-in transition,
            // the instance may not have been registered at this time.
            // we will need to poll for registration until current route
            // is no longer valid.
            poll(cb, match.instances, key, isValid);
          });
        }
        next(cb);
      })
    }
  }

  function poll (
    cb, // somehow flow cannot infer this is a function
    instances,
    key,
    isValid
  ) {
    if (
      instances[key] &&
      !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
    ) {
      cb(instances[key]);
    } else if (isValid()) {
      setTimeout(function () {
        poll(cb, instances, key, isValid);
      }, 16);
    }
  }

  /*  */

  var HTML5History = /*@__PURE__*/(function (History) {
    function HTML5History (router, base) {
      History.call(this, router, base);

      this._startLocation = getLocation(this.base);
    }

    if ( History ) HTML5History.__proto__ = History;
    HTML5History.prototype = Object.create( History && History.prototype );
    HTML5History.prototype.constructor = HTML5History;

    HTML5History.prototype.setupListeners = function setupListeners () {
      var this$1 = this;

      if (this.listeners.length > 0) {
        return
      }

      var router = this.router;
      var expectScroll = router.options.scrollBehavior;
      var supportsScroll = supportsPushState && expectScroll;

      if (supportsScroll) {
        this.listeners.push(setupScroll());
      }

      var handleRoutingEvent = function () {
        var current = this$1.current;

        // Avoiding first `popstate` event dispatched in some browsers but first
        // history route not updated since async guard at the same time.
        var location = getLocation(this$1.base);
        if (this$1.current === START && location === this$1._startLocation) {
          return
        }

        this$1.transitionTo(location, function (route) {
          if (supportsScroll) {
            handleScroll(router, route, current, true);
          }
        });
      };
      window.addEventListener('popstate', handleRoutingEvent);
      this.listeners.push(function () {
        window.removeEventListener('popstate', handleRoutingEvent);
      });
    };

    HTML5History.prototype.go = function go (n) {
      window.history.go(n);
    };

    HTML5History.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(location, function (route) {
        pushState(cleanPath(this$1.base + route.fullPath));
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      }, onAbort);
    };

    HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(location, function (route) {
        replaceState(cleanPath(this$1.base + route.fullPath));
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      }, onAbort);
    };

    HTML5History.prototype.ensureURL = function ensureURL (push) {
      if (getLocation(this.base) !== this.current.fullPath) {
        var current = cleanPath(this.base + this.current.fullPath);
        push ? pushState(current) : replaceState(current);
      }
    };

    HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
      return getLocation(this.base)
    };

    return HTML5History;
  }(History));

  function getLocation (base) {
    var path = decodeURI(window.location.pathname);
    if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
      path = path.slice(base.length);
    }
    return (path || '/') + window.location.search + window.location.hash
  }

  /*  */

  var HashHistory = /*@__PURE__*/(function (History) {
    function HashHistory (router, base, fallback) {
      History.call(this, router, base);
      // check history fallback deeplinking
      if (fallback && checkFallback(this.base)) {
        return
      }
      ensureSlash();
    }

    if ( History ) HashHistory.__proto__ = History;
    HashHistory.prototype = Object.create( History && History.prototype );
    HashHistory.prototype.constructor = HashHistory;

    // this is delayed until the app mounts
    // to avoid the hashchange listener being fired too early
    HashHistory.prototype.setupListeners = function setupListeners () {
      var this$1 = this;

      if (this.listeners.length > 0) {
        return
      }

      var router = this.router;
      var expectScroll = router.options.scrollBehavior;
      var supportsScroll = supportsPushState && expectScroll;

      if (supportsScroll) {
        this.listeners.push(setupScroll());
      }

      var handleRoutingEvent = function () {
        var current = this$1.current;
        if (!ensureSlash()) {
          return
        }
        this$1.transitionTo(getHash(), function (route) {
          if (supportsScroll) {
            handleScroll(this$1.router, route, current, true);
          }
          if (!supportsPushState) {
            replaceHash(route.fullPath);
          }
        });
      };
      var eventType = supportsPushState ? 'popstate' : 'hashchange';
      window.addEventListener(
        eventType,
        handleRoutingEvent
      );
      this.listeners.push(function () {
        window.removeEventListener(eventType, handleRoutingEvent);
      });
    };

    HashHistory.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(
        location,
        function (route) {
          pushHash(route.fullPath);
          handleScroll(this$1.router, route, fromRoute, false);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(
        location,
        function (route) {
          replaceHash(route.fullPath);
          handleScroll(this$1.router, route, fromRoute, false);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    HashHistory.prototype.go = function go (n) {
      window.history.go(n);
    };

    HashHistory.prototype.ensureURL = function ensureURL (push) {
      var current = this.current.fullPath;
      if (getHash() !== current) {
        push ? pushHash(current) : replaceHash(current);
      }
    };

    HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
      return getHash()
    };

    return HashHistory;
  }(History));

  function checkFallback (base) {
    var location = getLocation(base);
    if (!/^\/#/.test(location)) {
      window.location.replace(cleanPath(base + '/#' + location));
      return true
    }
  }

  function ensureSlash () {
    var path = getHash();
    if (path.charAt(0) === '/') {
      return true
    }
    replaceHash('/' + path);
    return false
  }

  function getHash () {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    var href = window.location.href;
    var index = href.indexOf('#');
    // empty path
    if (index < 0) { return '' }

    href = href.slice(index + 1);
    // decode the hash but not the search or hash
    // as search(query) is already decoded
    // https://github.com/vuejs/vue-router/issues/2708
    var searchIndex = href.indexOf('?');
    if (searchIndex < 0) {
      var hashIndex = href.indexOf('#');
      if (hashIndex > -1) {
        href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
      } else { href = decodeURI(href); }
    } else {
      href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
    }

    return href
  }

  function getUrl (path) {
    var href = window.location.href;
    var i = href.indexOf('#');
    var base = i >= 0 ? href.slice(0, i) : href;
    return (base + "#" + path)
  }

  function pushHash (path) {
    if (supportsPushState) {
      pushState(getUrl(path));
    } else {
      window.location.hash = path;
    }
  }

  function replaceHash (path) {
    if (supportsPushState) {
      replaceState(getUrl(path));
    } else {
      window.location.replace(getUrl(path));
    }
  }

  /*  */

  var AbstractHistory = /*@__PURE__*/(function (History) {
    function AbstractHistory (router, base) {
      History.call(this, router, base);
      this.stack = [];
      this.index = -1;
    }

    if ( History ) AbstractHistory.__proto__ = History;
    AbstractHistory.prototype = Object.create( History && History.prototype );
    AbstractHistory.prototype.constructor = AbstractHistory;

    AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      this.transitionTo(
        location,
        function (route) {
          this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
          this$1.index++;
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      this.transitionTo(
        location,
        function (route) {
          this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    AbstractHistory.prototype.go = function go (n) {
      var this$1 = this;

      var targetIndex = this.index + n;
      if (targetIndex < 0 || targetIndex >= this.stack.length) {
        return
      }
      var route = this.stack[targetIndex];
      this.confirmTransition(
        route,
        function () {
          this$1.index = targetIndex;
          this$1.updateRoute(route);
        },
        function (err) {
          if (isRouterError(err, NavigationFailureType.duplicated)) {
            this$1.index = targetIndex;
          }
        }
      );
    };

    AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
      var current = this.stack[this.stack.length - 1];
      return current ? current.fullPath : '/'
    };

    AbstractHistory.prototype.ensureURL = function ensureURL () {
      // noop
    };

    return AbstractHistory;
  }(History));

  /*  */



  var VueRouter = function VueRouter (options) {
    if ( options === void 0 ) options = {};

    this.app = null;
    this.apps = [];
    this.options = options;
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];
    this.matcher = createMatcher(options.routes || [], this);

    var mode = options.mode || 'hash';
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
    if (this.fallback) {
      mode = 'hash';
    }
    if (!inBrowser$1) {
      mode = 'abstract';
    }
    this.mode = mode;

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base);
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback);
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base);
        break
    }
  };

  var prototypeAccessors$1 = { currentRoute: { configurable: true } };

  VueRouter.prototype.match = function match (
    raw,
    current,
    redirectedFrom
  ) {
    return this.matcher.match(raw, current, redirectedFrom)
  };

  prototypeAccessors$1.currentRoute.get = function () {
    return this.history && this.history.current
  };

  VueRouter.prototype.init = function init (app /* Vue component instance */) {
      var this$1 = this;

    this.apps.push(app);

    // set up app destroyed handler
    // https://github.com/vuejs/vue-router/issues/2639
    app.$once('hook:destroyed', function () {
      // clean out app from this.apps array once destroyed
      var index = this$1.apps.indexOf(app);
      if (index > -1) { this$1.apps.splice(index, 1); }
      // ensure we still have a main app or null if no apps
      // we do not release the router so it can be reused
      if (this$1.app === app) { this$1.app = this$1.apps[0] || null; }

      if (!this$1.app) {
        // clean up event listeners
        // https://github.com/vuejs/vue-router/issues/2341
        this$1.history.teardownListeners();
      }
    });

    // main app previously initialized
    // return as we don't need to set up new history listener
    if (this.app) {
      return
    }

    this.app = app;

    var history = this.history;

    if (history instanceof HTML5History || history instanceof HashHistory) {
      var setupListeners = function () {
        history.setupListeners();
      };
      history.transitionTo(history.getCurrentLocation(), setupListeners, setupListeners);
    }

    history.listen(function (route) {
      this$1.apps.forEach(function (app) {
        app._route = route;
      });
    });
  };

  VueRouter.prototype.beforeEach = function beforeEach (fn) {
    return registerHook(this.beforeHooks, fn)
  };

  VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
    return registerHook(this.resolveHooks, fn)
  };

  VueRouter.prototype.afterEach = function afterEach (fn) {
    return registerHook(this.afterHooks, fn)
  };

  VueRouter.prototype.onReady = function onReady (cb, errorCb) {
    this.history.onReady(cb, errorCb);
  };

  VueRouter.prototype.onError = function onError (errorCb) {
    this.history.onError(errorCb);
  };

  VueRouter.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        this$1.history.push(location, resolve, reject);
      })
    } else {
      this.history.push(location, onComplete, onAbort);
    }
  };

  VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        this$1.history.replace(location, resolve, reject);
      })
    } else {
      this.history.replace(location, onComplete, onAbort);
    }
  };

  VueRouter.prototype.go = function go (n) {
    this.history.go(n);
  };

  VueRouter.prototype.back = function back () {
    this.go(-1);
  };

  VueRouter.prototype.forward = function forward () {
    this.go(1);
  };

  VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
    var route = to
      ? to.matched
        ? to
        : this.resolve(to).route
      : this.currentRoute;
    if (!route) {
      return []
    }
    return [].concat.apply([], route.matched.map(function (m) {
      return Object.keys(m.components).map(function (key) {
        return m.components[key]
      })
    }))
  };

  VueRouter.prototype.resolve = function resolve (
    to,
    current,
    append
  ) {
    current = current || this.history.current;
    var location = normalizeLocation(
      to,
      current,
      append,
      this
    );
    var route = this.match(location, current);
    var fullPath = route.redirectedFrom || route.fullPath;
    var base = this.history.base;
    var href = createHref(base, fullPath, this.mode);
    return {
      location: location,
      route: route,
      href: href,
      // for backwards compat
      normalizedTo: location,
      resolved: route
    }
  };

  VueRouter.prototype.addRoutes = function addRoutes (routes) {
    this.matcher.addRoutes(routes);
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation());
    }
  };

  Object.defineProperties( VueRouter.prototype, prototypeAccessors$1 );

  function registerHook (list, fn) {
    list.push(fn);
    return function () {
      var i = list.indexOf(fn);
      if (i > -1) { list.splice(i, 1); }
    }
  }

  function createHref (base, fullPath, mode) {
    var path = mode === 'hash' ? '#' + fullPath : fullPath;
    return base ? cleanPath(base + '/' + path) : path
  }

  VueRouter.install = install$1;
  VueRouter.version = '3.3.2';

  if (inBrowser$1 && window.Vue) {
    window.Vue.use(VueRouter);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  	  path: basedir,
  	  exports: {},
  	  require: function (path, base) {
        return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
      }
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var vval = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.patchChildren = patchChildren;
  exports.h = h;

  function isUndef(v) {
    return v === null || v === undefined;
  }

  function isDef(v) {
    return v !== null && v !== undefined;
  }

  function sameVval(oldVval, vval) {
    return vval.tag === oldVval.tag && vval.key === oldVval.key;
  }

  function createVm(vval) {
    var Vm = vval.tag;
    vval.vm = new Vm({
      data: vval.args
    });
  }

  function updateVval(vval) {
    var keys = Object.keys(vval.args);

    for (var i = 0; i < keys.length; i++) {
      keys.forEach(function (k) {
        vval.vm[k] = vval.args[k];
      });
    }
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};

    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) map[key] = i;
    }

    return map;
  }

  function updateChildren(oldCh, newCh) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVval = oldCh[0];
    var oldEndVval = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVval = newCh[0];
    var newEndVval = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVval)) {
        oldStartVval = oldCh[++oldStartIdx];
      } else if (isUndef(oldEndVval)) {
        oldEndVval = oldCh[--oldEndIdx];
      } else if (sameVval(oldStartVval, newStartVval)) {
        patchVval(oldStartVval, newStartVval);
        oldStartVval = oldCh[++oldStartIdx];
        newStartVval = newCh[++newStartIdx];
      } else if (sameVval(oldEndVval, newEndVval)) {
        patchVval(oldEndVval, newEndVval);
        oldEndVval = oldCh[--oldEndIdx];
        newEndVval = newCh[--newEndIdx];
      } else if (sameVval(oldStartVval, newEndVval)) {
        patchVval(oldStartVval, newEndVval);
        oldStartVval = oldCh[++oldStartIdx];
        newEndVval = newCh[--newEndIdx];
      } else if (sameVval(oldEndVval, newStartVval)) {
        patchVval(oldEndVval, newStartVval);
        oldEndVval = oldCh[--oldEndIdx];
        newStartVval = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = isDef(newStartVval.key) ? oldKeyToIdx[newStartVval.key] : null;

        if (isUndef(idxInOld)) {
          createVm(newStartVval);
          newStartVval = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];

          if (sameVval(elmToMove, newStartVval)) {
            patchVval(elmToMove, newStartVval);
            oldCh[idxInOld] = undefined;
            newStartVval = newCh[++newStartIdx];
          } else {
            createVm(newStartVval);
            newStartVval = newCh[++newStartIdx];
          }
        }
      }
    }

    if (oldStartIdx > oldEndIdx) {
      addVvals(newCh, newStartIdx, newEndIdx);
    } else if (newStartIdx > newEndIdx) {
      removeVvals(oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function addVvals(vvals, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      createVm(vvals[startIdx]);
    }
  }

  function removeVvals(vvals, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vvals[startIdx];

      if (isDef(ch)) {
        ch.vm.$destroy();
        ch.vm = null;
      }
    }
  }

  function patchVval(oldVval, vval) {
    if (oldVval === vval) {
      return;
    }

    vval.vm = oldVval.vm;
    updateVval(vval);
  }

  function patchChildren(oldCh, ch) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(oldCh, ch);
    } else if (isDef(ch)) {
      addVvals(ch, 0, ch.length - 1);
    } else if (isDef(oldCh)) {
      removeVvals(oldCh, 0, oldCh.length - 1);
    }
  }

  function h(tag, key, args) {
    return {
      tag: tag,
      key: key,
      args: args
    };
  }
  });

  unwrapExports(vval);
  var vval_1 = vval.patchChildren;
  var vval_2 = vval.h;

  var params = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.pushParams = pushParams;
  exports.popParams = popParams;
  exports.withParams = withParams;
  exports._setTarget = exports.target = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var stack = [];
  var target = null;
  exports.target = target;

  var _setTarget = function _setTarget(x) {
    exports.target = target = x;
  };

  exports._setTarget = _setTarget;

  function pushParams() {
    if (target !== null) {
      stack.push(target);
    }

    exports.target = target = {};
  }

  function popParams() {
    var lastTarget = target;
    var newTarget = exports.target = target = stack.pop() || null;

    if (newTarget) {
      if (!Array.isArray(newTarget.$sub)) {
        newTarget.$sub = [];
      }

      newTarget.$sub.push(lastTarget);
    }

    return lastTarget;
  }

  function addParams(params) {
    if (_typeof(params) === 'object' && !Array.isArray(params)) {
      exports.target = target = _objectSpread({}, target, {}, params);
    } else {
      throw new Error('params must be an object');
    }
  }

  function withParamsDirect(params, validator) {
    return withParamsClosure(function (add) {
      return function () {
        add(params);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return validator.apply(this, args);
      };
    });
  }

  function withParamsClosure(closure) {
    var validator = closure(addParams);
    return function () {
      pushParams();

      try {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return validator.apply(this, args);
      } finally {
        popParams();
      }
    };
  }

  function withParams(paramsOrClosure, maybeValidator) {
    if (_typeof(paramsOrClosure) === 'object' && maybeValidator !== undefined) {
      return withParamsDirect(paramsOrClosure, maybeValidator);
    }

    return withParamsClosure(paramsOrClosure);
  }
  });

  unwrapExports(params);
  var params_1 = params.pushParams;
  var params_2 = params.popParams;
  var params_3 = params.withParams;
  var params_4 = params._setTarget;
  var params_5 = params.target;

  var lib = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Vuelidate = Vuelidate;
  Object.defineProperty(exports, "withParams", {
    enumerable: true,
    get: function get() {
      return params.withParams;
    }
  });
  exports.default = exports.validationMixin = void 0;





  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var NIL = function NIL() {
    return null;
  };

  var buildFromKeys = function buildFromKeys(keys, fn, keyFn) {
    return keys.reduce(function (build, key) {
      build[keyFn ? keyFn(key) : key] = fn(key);
      return build;
    }, {});
  };

  function isFunction(val) {
    return typeof val === 'function';
  }

  function isObject(val) {
    return val !== null && (_typeof(val) === 'object' || isFunction(val));
  }

  function isPromise(object) {
    return isObject(object) && isFunction(object.then);
  }

  var getPath = function getPath(ctx, obj, path, fallback) {
    if (typeof path === 'function') {
      return path.call(ctx, obj, fallback);
    }

    path = Array.isArray(path) ? path : path.split('.');

    for (var i = 0; i < path.length; i++) {
      if (obj && _typeof(obj) === 'object') {
        obj = obj[path[i]];
      } else {
        return fallback;
      }
    }

    return typeof obj === 'undefined' ? fallback : obj;
  };

  var __isVuelidateAsyncVm = '__isVuelidateAsyncVm';

  function makePendingAsyncVm(Vue, promise) {
    var asyncVm = new Vue({
      data: {
        p: true,
        v: false
      }
    });
    promise.then(function (value) {
      asyncVm.p = false;
      asyncVm.v = value;
    }, function (error) {
      asyncVm.p = false;
      asyncVm.v = false;
      throw error;
    });
    asyncVm[__isVuelidateAsyncVm] = true;
    return asyncVm;
  }

  var validationGetters = {
    $invalid: function $invalid() {
      var _this = this;

      var proxy = this.proxy;
      return this.nestedKeys.some(function (nested) {
        return _this.refProxy(nested).$invalid;
      }) || this.ruleKeys.some(function (rule) {
        return !proxy[rule];
      });
    },
    $dirty: function $dirty() {
      var _this2 = this;

      if (this.dirty) {
        return true;
      }

      if (this.nestedKeys.length === 0) {
        return false;
      }

      return this.nestedKeys.every(function (key) {
        return _this2.refProxy(key).$dirty;
      });
    },
    $anyDirty: function $anyDirty() {
      var _this3 = this;

      if (this.dirty) {
        return true;
      }

      if (this.nestedKeys.length === 0) {
        return false;
      }

      return this.nestedKeys.some(function (key) {
        return _this3.refProxy(key).$anyDirty;
      });
    },
    $error: function $error() {
      return this.$dirty && !this.$pending && this.$invalid;
    },
    $anyError: function $anyError() {
      var _this4 = this;

      if (this.$error) return true;
      return this.nestedKeys.some(function (key) {
        return _this4.refProxy(key).$anyError;
      });
    },
    $pending: function $pending() {
      var _this5 = this;

      return this.ruleKeys.some(function (key) {
        return _this5.getRef(key).$pending;
      }) || this.nestedKeys.some(function (key) {
        return _this5.refProxy(key).$pending;
      });
    },
    $params: function $params() {
      var _this6 = this;

      var vals = this.validations;
      return _objectSpread({}, buildFromKeys(this.nestedKeys, function (key) {
        return vals[key] && vals[key].$params || null;
      }), {}, buildFromKeys(this.ruleKeys, function (key) {
        return _this6.getRef(key).$params;
      }));
    }
  };

  function setDirtyRecursive(newState) {
    this.dirty = newState;
    var proxy = this.proxy;
    var method = newState ? '$touch' : '$reset';
    this.nestedKeys.forEach(function (key) {
      proxy[key][method]();
    });
  }

  var validationMethods = {
    $touch: function $touch() {
      setDirtyRecursive.call(this, true);
    },
    $reset: function $reset() {
      setDirtyRecursive.call(this, false);
    },
    $flattenParams: function $flattenParams() {
      var proxy = this.proxy;
      var params = [];

      for (var key in this.$params) {
        if (this.isNested(key)) {
          var childParams = proxy[key].$flattenParams();

          for (var j = 0; j < childParams.length; j++) {
            childParams[j].path.unshift(key);
          }

          params = params.concat(childParams);
        } else {
          params.push({
            path: [],
            name: key,
            params: this.$params[key]
          });
        }
      }

      return params;
    }
  };
  var getterNames = Object.keys(validationGetters);
  var methodNames = Object.keys(validationMethods);
  var _cachedComponent = null;

  var getComponent = function getComponent(Vue) {
    if (_cachedComponent) {
      return _cachedComponent;
    }

    var VBase = Vue.extend({
      computed: {
        refs: function refs() {
          var oldVval = this._vval;
          this._vval = this.children;
          (0, vval.patchChildren)(oldVval, this._vval);
          var refs = {};

          this._vval.forEach(function (c) {
            refs[c.key] = c.vm;
          });

          return refs;
        }
      },
      beforeCreate: function beforeCreate() {
        this._vval = null;
      },
      beforeDestroy: function beforeDestroy() {
        if (this._vval) {
          (0, vval.patchChildren)(this._vval);
          this._vval = null;
        }
      },
      methods: {
        getModel: function getModel() {
          return this.lazyModel ? this.lazyModel(this.prop) : this.model;
        },
        getModelKey: function getModelKey(key) {
          var model = this.getModel();

          if (model) {
            return model[key];
          }
        },
        hasIter: function hasIter() {
          return false;
        }
      }
    });
    var ValidationRule = VBase.extend({
      data: function data() {
        return {
          rule: null,
          lazyModel: null,
          model: null,
          lazyParentModel: null,
          rootModel: null
        };
      },
      methods: {
        runRule: function runRule(parent) {
          var model = this.getModel();
          (0, params.pushParams)();
          var rawOutput = this.rule.call(this.rootModel, model, parent);
          var output = isPromise(rawOutput) ? makePendingAsyncVm(Vue, rawOutput) : rawOutput;
          var rawParams = (0, params.popParams)();
          var params$1 = rawParams && rawParams.$sub ? rawParams.$sub.length > 1 ? rawParams : rawParams.$sub[0] : null;
          return {
            output: output,
            params: params$1
          };
        }
      },
      computed: {
        run: function run() {
          var _this7 = this;

          var parent = this.lazyParentModel();

          var isArrayDependant = Array.isArray(parent) && parent.__ob__;

          if (isArrayDependant) {
            var arrayDep = parent.__ob__.dep;
            arrayDep.depend();
            var target = arrayDep.constructor.target;

            if (!this._indirectWatcher) {
              var Watcher = target.constructor;
              this._indirectWatcher = new Watcher(this, function () {
                return _this7.runRule(parent);
              }, null, {
                lazy: true
              });
            }

            var model = this.getModel();

            if (!this._indirectWatcher.dirty && this._lastModel === model) {
              this._indirectWatcher.depend();

              return target.value;
            }

            this._lastModel = model;

            this._indirectWatcher.evaluate();

            this._indirectWatcher.depend();
          } else if (this._indirectWatcher) {
            this._indirectWatcher.teardown();

            this._indirectWatcher = null;
          }

          return this._indirectWatcher ? this._indirectWatcher.value : this.runRule(parent);
        },
        $params: function $params() {
          return this.run.params;
        },
        proxy: function proxy() {
          var output = this.run.output;

          if (output[__isVuelidateAsyncVm]) {
            return !!output.v;
          }

          return !!output;
        },
        $pending: function $pending() {
          var output = this.run.output;

          if (output[__isVuelidateAsyncVm]) {
            return output.p;
          }

          return false;
        }
      },
      destroyed: function destroyed() {
        if (this._indirectWatcher) {
          this._indirectWatcher.teardown();

          this._indirectWatcher = null;
        }
      }
    });
    var Validation = VBase.extend({
      data: function data() {
        return {
          dirty: false,
          validations: null,
          lazyModel: null,
          model: null,
          prop: null,
          lazyParentModel: null,
          rootModel: null
        };
      },
      methods: _objectSpread({}, validationMethods, {
        refProxy: function refProxy(key) {
          return this.getRef(key).proxy;
        },
        getRef: function getRef(key) {
          return this.refs[key];
        },
        isNested: function isNested(key) {
          return typeof this.validations[key] !== 'function';
        }
      }),
      computed: _objectSpread({}, validationGetters, {
        nestedKeys: function nestedKeys() {
          return this.keys.filter(this.isNested);
        },
        ruleKeys: function ruleKeys() {
          var _this8 = this;

          return this.keys.filter(function (k) {
            return !_this8.isNested(k);
          });
        },
        keys: function keys() {
          return Object.keys(this.validations).filter(function (k) {
            return k !== '$params';
          });
        },
        proxy: function proxy() {
          var _this9 = this;

          var keyDefs = buildFromKeys(this.keys, function (key) {
            return {
              enumerable: true,
              configurable: true,
              get: function get() {
                return _this9.refProxy(key);
              }
            };
          });
          var getterDefs = buildFromKeys(getterNames, function (key) {
            return {
              enumerable: true,
              configurable: true,
              get: function get() {
                return _this9[key];
              }
            };
          });
          var methodDefs = buildFromKeys(methodNames, function (key) {
            return {
              enumerable: false,
              configurable: true,
              get: function get() {
                return _this9[key];
              }
            };
          });
          var iterDefs = this.hasIter() ? {
            $iter: {
              enumerable: true,
              value: Object.defineProperties({}, _objectSpread({}, keyDefs))
            }
          } : {};
          return Object.defineProperties({}, _objectSpread({}, keyDefs, {}, iterDefs, {
            $model: {
              enumerable: true,
              get: function get() {
                var parent = _this9.lazyParentModel();

                if (parent != null) {
                  return parent[_this9.prop];
                } else {
                  return null;
                }
              },
              set: function set(value) {
                var parent = _this9.lazyParentModel();

                if (parent != null) {
                  parent[_this9.prop] = value;

                  _this9.$touch();
                }
              }
            }
          }, getterDefs, {}, methodDefs));
        },
        children: function children() {
          var _this10 = this;

          return [].concat(_toConsumableArray(this.nestedKeys.map(function (key) {
            return renderNested(_this10, key);
          })), _toConsumableArray(this.ruleKeys.map(function (key) {
            return renderRule(_this10, key);
          }))).filter(Boolean);
        }
      })
    });
    var GroupValidation = Validation.extend({
      methods: {
        isNested: function isNested(key) {
          return typeof this.validations[key]() !== 'undefined';
        },
        getRef: function getRef(key) {
          var vm = this;
          return {
            get proxy() {
              return vm.validations[key]() || false;
            }

          };
        }
      }
    });
    var EachValidation = Validation.extend({
      computed: {
        keys: function keys() {
          var model = this.getModel();

          if (isObject(model)) {
            return Object.keys(model);
          } else {
            return [];
          }
        },
        tracker: function tracker() {
          var _this11 = this;

          var trackBy = this.validations.$trackBy;
          return trackBy ? function (key) {
            return "".concat(getPath(_this11.rootModel, _this11.getModelKey(key), trackBy));
          } : function (x) {
            return "".concat(x);
          };
        },
        getModelLazy: function getModelLazy() {
          var _this12 = this;

          return function () {
            return _this12.getModel();
          };
        },
        children: function children() {
          var _this13 = this;

          var def = this.validations;
          var model = this.getModel();

          var validations = _objectSpread({}, def);

          delete validations['$trackBy'];
          var usedTracks = {};
          return this.keys.map(function (key) {
            var track = _this13.tracker(key);

            if (usedTracks.hasOwnProperty(track)) {
              return null;
            }

            usedTracks[track] = true;
            return (0, vval.h)(Validation, track, {
              validations: validations,
              prop: key,
              lazyParentModel: _this13.getModelLazy,
              model: model[key],
              rootModel: _this13.rootModel
            });
          }).filter(Boolean);
        }
      },
      methods: {
        isNested: function isNested() {
          return true;
        },
        getRef: function getRef(key) {
          return this.refs[this.tracker(key)];
        },
        hasIter: function hasIter() {
          return true;
        }
      }
    });

    var renderNested = function renderNested(vm, key) {
      if (key === '$each') {
        return (0, vval.h)(EachValidation, key, {
          validations: vm.validations[key],
          lazyParentModel: vm.lazyParentModel,
          prop: key,
          lazyModel: vm.getModel,
          rootModel: vm.rootModel
        });
      }

      var validations = vm.validations[key];

      if (Array.isArray(validations)) {
        var root = vm.rootModel;
        var refVals = buildFromKeys(validations, function (path) {
          return function () {
            return getPath(root, root.$v, path);
          };
        }, function (v) {
          return Array.isArray(v) ? v.join('.') : v;
        });
        return (0, vval.h)(GroupValidation, key, {
          validations: refVals,
          lazyParentModel: NIL,
          prop: key,
          lazyModel: NIL,
          rootModel: root
        });
      }

      return (0, vval.h)(Validation, key, {
        validations: validations,
        lazyParentModel: vm.getModel,
        prop: key,
        lazyModel: vm.getModelKey,
        rootModel: vm.rootModel
      });
    };

    var renderRule = function renderRule(vm, key) {
      return (0, vval.h)(ValidationRule, key, {
        rule: vm.validations[key],
        lazyParentModel: vm.lazyParentModel,
        lazyModel: vm.getModel,
        rootModel: vm.rootModel
      });
    };

    _cachedComponent = {
      VBase: VBase,
      Validation: Validation
    };
    return _cachedComponent;
  };

  var _cachedVue = null;

  function getVue(rootVm) {
    if (_cachedVue) return _cachedVue;
    var Vue = rootVm.constructor;

    while (Vue.super) {
      Vue = Vue.super;
    }

    _cachedVue = Vue;
    return Vue;
  }

  var validateModel = function validateModel(model, validations) {
    var Vue = getVue(model);

    var _getComponent = getComponent(Vue),
        Validation = _getComponent.Validation,
        VBase = _getComponent.VBase;

    var root = new VBase({
      computed: {
        children: function children() {
          var vals = typeof validations === 'function' ? validations.call(model) : validations;
          return [(0, vval.h)(Validation, '$v', {
            validations: vals,
            lazyParentModel: NIL,
            prop: '$v',
            model: model,
            rootModel: model
          })];
        }
      }
    });
    return root;
  };

  var validationMixin = {
    data: function data() {
      var vals = this.$options.validations;

      if (vals) {
        this._vuelidate = validateModel(this, vals);
      }

      return {};
    },
    beforeCreate: function beforeCreate() {
      var options = this.$options;
      var vals = options.validations;
      if (!vals) return;
      if (!options.computed) options.computed = {};
      if (options.computed.$v) return;

      options.computed.$v = function () {
        return this._vuelidate ? this._vuelidate.refs.$v.proxy : null;
      };
    },
    beforeDestroy: function beforeDestroy() {
      if (this._vuelidate) {
        this._vuelidate.$destroy();

        this._vuelidate = null;
      }
    }
  };
  exports.validationMixin = validationMixin;

  function Vuelidate(Vue) {
    Vue.mixin(validationMixin);
  }

  var _default = Vuelidate;
  exports.default = _default;
  });

  unwrapExports(lib);
  var lib_1 = lib.Vuelidate;
  var lib_2 = lib.withParams;
  var lib_3 = lib.validationMixin;

  var withParamsBrowser = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.withParams = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var root = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : {};

  var fakeWithParams = function fakeWithParams(paramsOrClosure, maybeValidator) {
    if (_typeof(paramsOrClosure) === 'object' && maybeValidator !== undefined) {
      return maybeValidator;
    }

    return paramsOrClosure(function () {});
  };

  var withParams = root.vuelidate ? root.vuelidate.withParams : fakeWithParams;
  exports.withParams = withParams;
  });

  unwrapExports(withParamsBrowser);
  var withParamsBrowser_1 = withParamsBrowser.withParams;

  var withParams_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var withParams =  withParamsBrowser.withParams ;
  var _default = withParams;
  exports.default = _default;
  });

  unwrapExports(withParams_1);

  var common = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "withParams", {
    enumerable: true,
    get: function get() {
      return _withParams.default;
    }
  });
  exports.regex = exports.ref = exports.len = exports.req = void 0;

  var _withParams = _interopRequireDefault(withParams_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var req = function req(value) {
    if (Array.isArray(value)) return !!value.length;

    if (value === undefined || value === null) {
      return false;
    }

    if (value === false) {
      return true;
    }

    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }

    if (_typeof(value) === 'object') {
      for (var _ in value) {
        return true;
      }

      return false;
    }

    return !!String(value).length;
  };

  exports.req = req;

  var len = function len(value) {
    if (Array.isArray(value)) return value.length;

    if (_typeof(value) === 'object') {
      return Object.keys(value).length;
    }

    return String(value).length;
  };

  exports.len = len;

  var ref = function ref(reference, vm, parentVm) {
    return typeof reference === 'function' ? reference.call(vm, parentVm) : parentVm[reference];
  };

  exports.ref = ref;

  var regex = function regex(type, expr) {
    return (0, _withParams.default)({
      type: type
    }, function (value) {
      return !req(value) || expr.test(value);
    });
  };

  exports.regex = regex;
  });

  unwrapExports(common);
  var common_1 = common.withParams;
  var common_2 = common.regex;
  var common_3 = common.ref;
  var common_4 = common.len;
  var common_5 = common.req;

  var alpha = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('alpha', /^[a-zA-Z]*$/);

  exports.default = _default;
  });

  unwrapExports(alpha);

  var alphaNum = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('alphaNum', /^[a-zA-Z0-9]*$/);

  exports.default = _default;
  });

  unwrapExports(alphaNum);

  var numeric = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('numeric', /^[0-9]*$/);

  exports.default = _default;
  });

  unwrapExports(numeric);

  var between = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(min, max) {
    return (0, common.withParams)({
      type: 'between',
      min: min,
      max: max
    }, function (value) {
      return !(0, common.req)(value) || (!/\s/.test(value) || value instanceof Date) && +min <= +value && +max >= +value;
    });
  };

  exports.default = _default;
  });

  unwrapExports(between);

  var email = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;

  var _default = (0, common.regex)('email', emailRegex);

  exports.default = _default;
  });

  unwrapExports(email);

  var ipAddress = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.withParams)({
    type: 'ipAddress'
  }, function (value) {
    if (!(0, common.req)(value)) {
      return true;
    }

    if (typeof value !== 'string') {
      return false;
    }

    var nibbles = value.split('.');
    return nibbles.length === 4 && nibbles.every(nibbleValid);
  });

  exports.default = _default;

  var nibbleValid = function nibbleValid(nibble) {
    if (nibble.length > 3 || nibble.length === 0) {
      return false;
    }

    if (nibble[0] === '0' && nibble !== '0') {
      return false;
    }

    if (!nibble.match(/^\d+$/)) {
      return false;
    }

    var numeric = +nibble | 0;
    return numeric >= 0 && numeric <= 255;
  };
  });

  unwrapExports(ipAddress);

  var macAddress = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default() {
    var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ':';
    return (0, common.withParams)({
      type: 'macAddress'
    }, function (value) {
      if (!(0, common.req)(value)) {
        return true;
      }

      if (typeof value !== 'string') {
        return false;
      }

      var parts = typeof separator === 'string' && separator !== '' ? value.split(separator) : value.length === 12 || value.length === 16 ? value.match(/.{2}/g) : null;
      return parts !== null && (parts.length === 6 || parts.length === 8) && parts.every(hexValid);
    });
  };

  exports.default = _default;

  var hexValid = function hexValid(hex) {
    return hex.toLowerCase().match(/^[0-9a-f]{2}$/);
  };
  });

  unwrapExports(macAddress);

  var maxLength = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(length) {
    return (0, common.withParams)({
      type: 'maxLength',
      max: length
    }, function (value) {
      return !(0, common.req)(value) || (0, common.len)(value) <= length;
    });
  };

  exports.default = _default;
  });

  unwrapExports(maxLength);

  var minLength = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(length) {
    return (0, common.withParams)({
      type: 'minLength',
      min: length
    }, function (value) {
      return !(0, common.req)(value) || (0, common.len)(value) >= length;
    });
  };

  exports.default = _default;
  });

  unwrapExports(minLength);

  var required = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.withParams)({
    type: 'required'
  }, function (value) {
    if (typeof value === 'string') {
      return (0, common.req)(value.trim());
    }

    return (0, common.req)(value);
  });

  exports.default = _default;
  });

  unwrapExports(required);

  var requiredIf = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(prop) {
    return (0, common.withParams)({
      type: 'requiredIf',
      prop: prop
    }, function (value, parentVm) {
      return (0, common.ref)(prop, this, parentVm) ? (0, common.req)(value) : true;
    });
  };

  exports.default = _default;
  });

  unwrapExports(requiredIf);

  var requiredUnless = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(prop) {
    return (0, common.withParams)({
      type: 'requiredUnless',
      prop: prop
    }, function (value, parentVm) {
      return !(0, common.ref)(prop, this, parentVm) ? (0, common.req)(value) : true;
    });
  };

  exports.default = _default;
  });

  unwrapExports(requiredUnless);

  var sameAs = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(equalTo) {
    return (0, common.withParams)({
      type: 'sameAs',
      eq: equalTo
    }, function (value, parentVm) {
      return value === (0, common.ref)(equalTo, this, parentVm);
    });
  };

  exports.default = _default;
  });

  unwrapExports(sameAs);

  var url = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  var _default = (0, common.regex)('url', urlRegex);

  exports.default = _default;
  });

  unwrapExports(url);

  var or = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default() {
    for (var _len = arguments.length, validators = new Array(_len), _key = 0; _key < _len; _key++) {
      validators[_key] = arguments[_key];
    }

    return (0, common.withParams)({
      type: 'or'
    }, function () {
      var _this = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return validators.length > 0 && validators.reduce(function (valid, fn) {
        return valid || fn.apply(_this, args);
      }, false);
    });
  };

  exports.default = _default;
  });

  unwrapExports(or);

  var and = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default() {
    for (var _len = arguments.length, validators = new Array(_len), _key = 0; _key < _len; _key++) {
      validators[_key] = arguments[_key];
    }

    return (0, common.withParams)({
      type: 'and'
    }, function () {
      var _this = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return validators.length > 0 && validators.reduce(function (valid, fn) {
        return valid && fn.apply(_this, args);
      }, true);
    });
  };

  exports.default = _default;
  });

  unwrapExports(and);

  var not = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(validator) {
    return (0, common.withParams)({
      type: 'not'
    }, function (value, vm) {
      return !(0, common.req)(value) || !validator.call(this, value, vm);
    });
  };

  exports.default = _default;
  });

  unwrapExports(not);

  var minValue = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(min) {
    return (0, common.withParams)({
      type: 'minValue',
      min: min
    }, function (value) {
      return !(0, common.req)(value) || (!/\s/.test(value) || value instanceof Date) && +value >= +min;
    });
  };

  exports.default = _default;
  });

  unwrapExports(minValue);

  var maxValue = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(max) {
    return (0, common.withParams)({
      type: 'maxValue',
      max: max
    }, function (value) {
      return !(0, common.req)(value) || (!/\s/.test(value) || value instanceof Date) && +value <= +max;
    });
  };

  exports.default = _default;
  });

  unwrapExports(maxValue);

  var integer = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('integer', /(^[0-9]*$)|(^-[0-9]+$)/);

  exports.default = _default;
  });

  unwrapExports(integer);

  var decimal = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('decimal', /^[-]?\d*(\.\d+)?$/);

  exports.default = _default;
  });

  unwrapExports(decimal);

  var validators = createCommonjsModule(function (module, exports) {

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "alpha", {
    enumerable: true,
    get: function get() {
      return _alpha.default;
    }
  });
  Object.defineProperty(exports, "alphaNum", {
    enumerable: true,
    get: function get() {
      return _alphaNum.default;
    }
  });
  Object.defineProperty(exports, "numeric", {
    enumerable: true,
    get: function get() {
      return _numeric.default;
    }
  });
  Object.defineProperty(exports, "between", {
    enumerable: true,
    get: function get() {
      return _between.default;
    }
  });
  Object.defineProperty(exports, "email", {
    enumerable: true,
    get: function get() {
      return _email.default;
    }
  });
  Object.defineProperty(exports, "ipAddress", {
    enumerable: true,
    get: function get() {
      return _ipAddress.default;
    }
  });
  Object.defineProperty(exports, "macAddress", {
    enumerable: true,
    get: function get() {
      return _macAddress.default;
    }
  });
  Object.defineProperty(exports, "maxLength", {
    enumerable: true,
    get: function get() {
      return _maxLength.default;
    }
  });
  Object.defineProperty(exports, "minLength", {
    enumerable: true,
    get: function get() {
      return _minLength.default;
    }
  });
  Object.defineProperty(exports, "required", {
    enumerable: true,
    get: function get() {
      return _required.default;
    }
  });
  Object.defineProperty(exports, "requiredIf", {
    enumerable: true,
    get: function get() {
      return _requiredIf.default;
    }
  });
  Object.defineProperty(exports, "requiredUnless", {
    enumerable: true,
    get: function get() {
      return _requiredUnless.default;
    }
  });
  Object.defineProperty(exports, "sameAs", {
    enumerable: true,
    get: function get() {
      return _sameAs.default;
    }
  });
  Object.defineProperty(exports, "url", {
    enumerable: true,
    get: function get() {
      return _url.default;
    }
  });
  Object.defineProperty(exports, "or", {
    enumerable: true,
    get: function get() {
      return _or.default;
    }
  });
  Object.defineProperty(exports, "and", {
    enumerable: true,
    get: function get() {
      return _and.default;
    }
  });
  Object.defineProperty(exports, "not", {
    enumerable: true,
    get: function get() {
      return _not.default;
    }
  });
  Object.defineProperty(exports, "minValue", {
    enumerable: true,
    get: function get() {
      return _minValue.default;
    }
  });
  Object.defineProperty(exports, "maxValue", {
    enumerable: true,
    get: function get() {
      return _maxValue.default;
    }
  });
  Object.defineProperty(exports, "integer", {
    enumerable: true,
    get: function get() {
      return _integer.default;
    }
  });
  Object.defineProperty(exports, "decimal", {
    enumerable: true,
    get: function get() {
      return _decimal.default;
    }
  });
  exports.helpers = void 0;

  var _alpha = _interopRequireDefault(alpha);

  var _alphaNum = _interopRequireDefault(alphaNum);

  var _numeric = _interopRequireDefault(numeric);

  var _between = _interopRequireDefault(between);

  var _email = _interopRequireDefault(email);

  var _ipAddress = _interopRequireDefault(ipAddress);

  var _macAddress = _interopRequireDefault(macAddress);

  var _maxLength = _interopRequireDefault(maxLength);

  var _minLength = _interopRequireDefault(minLength);

  var _required = _interopRequireDefault(required);

  var _requiredIf = _interopRequireDefault(requiredIf);

  var _requiredUnless = _interopRequireDefault(requiredUnless);

  var _sameAs = _interopRequireDefault(sameAs);

  var _url = _interopRequireDefault(url);

  var _or = _interopRequireDefault(or);

  var _and = _interopRequireDefault(and);

  var _not = _interopRequireDefault(not);

  var _minValue = _interopRequireDefault(minValue);

  var _maxValue = _interopRequireDefault(maxValue);

  var _integer = _interopRequireDefault(integer);

  var _decimal = _interopRequireDefault(decimal);

  var helpers = _interopRequireWildcard(common);

  exports.helpers = helpers;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  });

  unwrapExports(validators);
  var validators_1 = validators.alpha;
  var validators_2 = validators.alphaNum;
  var validators_3 = validators.numeric;
  var validators_4 = validators.between;
  var validators_5 = validators.email;
  var validators_6 = validators.ipAddress;
  var validators_7 = validators.macAddress;
  var validators_8 = validators.maxLength;
  var validators_9 = validators.minLength;
  var validators_10 = validators.required;
  var validators_11 = validators.requiredIf;
  var validators_12 = validators.requiredUnless;
  var validators_13 = validators.sameAs;
  var validators_14 = validators.url;
  var validators_15 = validators.or;
  var validators_16 = validators.and;
  var validators_17 = validators.not;
  var validators_18 = validators.minValue;
  var validators_19 = validators.maxValue;
  var validators_20 = validators.integer;
  var validators_21 = validators.decimal;
  var validators_22 = validators.helpers;

  var script$1 = {
    components: {
      VTextField,
      VSelect,
      VCheckbox,
      VBtn
    },
    mixins: [lib_3],
    validations: {
      name: {
        required: validators_10,
        maxLength: validators_8(10)
      },
      email: {
        required: validators_10,
        email: validators_5
      },
      select: {
        required: validators_10
      },
      checkbox: {
        checked(val) {
          return val;
        }
      }
    },
    data: () => {
      return {
        name: "",
        email: "",
        select: null,
        items: ["Item 1", "Item 2", "Item 3", "Item 4"],
        checkbox: false
      };
    },
    computed: {
      checkboxErrors() {
        const errors = [];
        if (!this.$v.checkbox.$dirty)
          return errors;
        !this.$v.checkbox.checked && errors.push("You must agree to continue!");
        return errors;
      },
      selectErrors() {
        const errors = [];
        if (!this.$v.select.$dirty)
          return errors;
        !this.$v.select.required && errors.push("Item is required");
        return errors;
      },
      nameErrors() {
        const errors = [];
        if (!this.$v.name.$dirty)
          return errors;
        !this.$v.name.maxLength && errors.push("Name must be at most 10 characters long");
        !this.$v.name.required && errors.push("Name is required.");
        return errors;
      },
      emailErrors() {
        const errors = [];
        if (!this.$v.email.$dirty)
          return errors;
        !this.$v.email.email && errors.push("Must be valid e-mail");
        !this.$v.email.required && errors.push("E-mail is required");
        return errors;
      }
    },
    methods: {
      submit() {
        this.$v.$touch();
      },
      clear() {
        this.$v.$reset();
        this.name = "";
        this.email = "";
        this.select = null;
        this.checkbox = false;
      }
    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "form",
      [
        _c("v-text-field", {
          attrs: {
            "error-messages": _vm.nameErrors,
            counter: 10,
            label: "Name",
            required: ""
          },
          on: {
            input: function($event) {
              return _vm.$v.name.$touch()
            },
            blur: function($event) {
              return _vm.$v.name.$touch()
            }
          },
          model: {
            value: _vm.name,
            callback: function($$v) {
              _vm.name = $$v;
            },
            expression: "name"
          }
        }),
        _vm._v(" "),
        _c("v-text-field", {
          attrs: {
            "error-messages": _vm.emailErrors,
            label: "E-mail",
            required: ""
          },
          on: {
            input: function($event) {
              return _vm.$v.email.$touch()
            },
            blur: function($event) {
              return _vm.$v.email.$touch()
            }
          },
          model: {
            value: _vm.email,
            callback: function($$v) {
              _vm.email = $$v;
            },
            expression: "email"
          }
        }),
        _vm._v(" "),
        _c("v-select", {
          attrs: {
            items: _vm.items,
            "error-messages": _vm.selectErrors,
            label: "Item",
            required: ""
          },
          on: {
            change: function($event) {
              return _vm.$v.select.$touch()
            },
            blur: function($event) {
              return _vm.$v.select.$touch()
            }
          },
          model: {
            value: _vm.select,
            callback: function($$v) {
              _vm.select = $$v;
            },
            expression: "select"
          }
        }),
        _vm._v(" "),
        _c("v-checkbox", {
          attrs: {
            "error-messages": _vm.checkboxErrors,
            label: "Do you agree?",
            required: ""
          },
          on: {
            change: function($event) {
              return _vm.$v.checkbox.$touch()
            },
            blur: function($event) {
              return _vm.$v.checkbox.$touch()
            }
          },
          model: {
            value: _vm.checkbox,
            callback: function($$v) {
              _vm.checkbox = $$v;
            },
            expression: "checkbox"
          }
        }),
        _vm._v(" "),
        _c("v-btn", { staticClass: "mr-4", on: { click: _vm.submit } }, [
          _vm._v("\n    submit\n  ")
        ]),
        _vm._v(" "),
        _c("v-btn", { on: { click: _vm.clear } }, [_vm._v("\n    clear\n  ")])
      ],
      1
    )
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = undefined;
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$2 = {};

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("span", { staticClass: "intro" }, [_vm._v("Home")])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      undefined,
      undefined,
      undefined
    );

  const store = Vue.observable({
    counter: 0
  });
  const mutations = {
    setCounter(counter) {
      store.counter = counter;
    },
    resetCounter() {
      store.counter = 0;
    }
  };

  var script$3 = {
    components: {
      VIcon: VIcon$1,
      VBtn
    },
    computed: {
      counter() {
        return store.counter;
      }
    },
    methods: {
      setCounter: mutations.setCounter,
      resetCounter: mutations.resetCounter
    }
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _c("p", [_vm._v(_vm._s(_vm.counter))]),
        _vm._v(" "),
        _c(
          "v-btn",
          {
            attrs: { icon: "" },
            on: {
              click: function($event) {
                return _vm.setCounter(_vm.counter + 1)
              }
            }
          },
          [_c("v-icon", [_vm._v("mdi-plus")])],
          1
        ),
        _vm._v(" "),
        _c(
          "v-btn",
          {
            attrs: { icon: "" },
            on: {
              click: function($event) {
                return _vm.setCounter(_vm.counter - 1)
              }
            }
          },
          [_c("v-icon", [_vm._v("mdi-minus")])],
          1
        ),
        _vm._v(" "),
        _c(
          "v-btn",
          {
            attrs: { icon: "" },
            on: {
              click: function($event) {
                return _vm.resetCounter()
              }
            }
          },
          [
            _c("v-icon", { attrs: { left: "" } }, [
              _vm._v("\n      mdi-delete\n    ")
            ])
          ],
          1
        )
      ],
      1
    )
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      undefined,
      undefined,
      undefined
    );

  const routes = [{
    path: "/",
    name: "HelloWorld",
    component: __vue_component__$2
  }, {
    path: "/vuelidate",
    name: "Vuelidate",
    component: __vue_component__$1
  }, {
    path: "/counter",
    name: "Counter",
    component: __vue_component__$3
  }];
  Vue.use(VueRouter);
  var router = new VueRouter({
    routes
  });

  Vue.config.productionTip = false;
  new Vue({
    vuetify: vuetify2,
    router,
    render: (h) => h(__vue_component__)
  }).$mount("#app");

}());
