/**
 * x-http类公共默认配置以及具体实例的单独配置项功能类
 * 配置包括每个x-http实例的域名，请求头配置，前、后置处理器
 * 还可配置默认的公共配置，通过此文件单独new出来的Conf导出
 */

const configureFnList = {
    setDomin: 'setDomin',
    bindPreHandles: 'bindPreHandles',
    setPreHandles: 'setPreHandles',
    bindPostHandles: 'bindPostHandles',
    setPostHandles: 'setPostHandles',
    setRequest: 'setRequest',
    bindDirective: 'bindDirective',
    setDirective: 'setDirective',
    use: 'use'
}

class Configure {
    constructor() {
        this._preHandlers = null;
        this._postHandles = null;
        this._directive = null;
    }

    [configureFnList.setDomin](domain) {
        this._domain = domain;
        return this;
    }

    [configureFnList.bindPreHandles](preHandles) {
        this._preHandlers = this._preHandlers || (Conf._preHandlers && [...Conf._preHandlers]) || [];
        if (Object.prototype.toString.call(preHandles) == "[object Array]") {
            this._preHandlers = [...this._preHandlers, ...preHandles];
        } else {
            this._preHandlers.push(preHandles);
        }
        return this;
    }

    [configureFnList.setPreHandles](preHandles) {
        this._preHandlers = [];
        if (Object.prototype.toString.call(preHandles) == "[object Array]") {
            this._preHandlers = [...this._preHandlers, ...preHandles];
        } else {
            this._preHandlers.push(preHandles);
        }
        return this;
    }

    [configureFnList.bindPostHandles](postHandles) {
        this._postHandles = this._postHandles || (Conf._postHandles && [...Conf._postHandles]) || [];
        if (Object.prototype.toString.call(postHandles) == "[object Array]") {
            this._postHandles = [...this._postHandles, ...postHandles];
        } else {
            this._postHandles.push(postHandles);
        }
        return this;
    }

    [configureFnList.setPostHandles](postHandles) {
        this._postHandles = [];
        if (Object.prototype.toString.call(postHandles) == "[object Array]") {
            this._postHandles = [...this._postHandles, ...postHandles];
        } else {
            this._postHandles.push(postHandles);
        }
        return this;
    }

    [configureFnList.setRequest](fn) {
        this._requestFn = fn;
        return this;
    }

    [configureFnList.bindDirective](directiveName, fn) {
        this._directive = this._directive || { ...Conf._directive } || {};
        if (fn && Object.prototype.toString.call(fn) === '[object Function]') {
            this._directive[directiveName] = fn;
        }
        return this;
    }

    [configureFnList.setDirective](directiveName, fn) {
        this._directive = {};
        if (fn && Object.prototype.toString.call(fn) === '[object Function]') {
            this._directive[directiveName] = fn;
        }
        return this;
    }

    [configureFnList.use](plugin, options) {
        plugin.install(this, options);
    }

    get domain() {
        return this._domain || Conf._domain || '';
    }

    get header() {
        return this._header || Conf._header || {
            'Content-Type': 'application/json'
        }
    }

    get preHandlers() {
        return this._preHandlers || Conf._preHandlers || [];
    }

    get postHandles() {
        return this._postHandles || Conf._postHandles || [];
    }

    get directive() {
        return this._directive || Conf._directive || [];
    }

    get requestFn() {
        return this._requestFn || Conf._requestFn || null;
    }
}

const Conf = new Configure();

export {
    configureFnList, 
    Conf,
    Configure
};