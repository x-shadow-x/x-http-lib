/**
 * x-http类公共默认配置以及具体实例的单独配置项功能类
 * 配置包括每个x-http实例的域名，请求头配置，前、后置处理器
 * 还可配置默认的公共配置，通过此文件单独new出来的Conf导出
 */

const configureFnList = {
    setDomin: 'setDomin',
    bindPreHandles: 'bindPreHandles',
    bindPostHandles: 'bindPostHandles',
    setRequest: 'setRequest',
    bindDirective: 'bindDirective',
    use: 'use'
}

class Configure {
    constructor() {
        this._preHandlers = [];
        this._postHandles = [];
    }

    [configureFnList.setDomin](domain) {
        this.domain = domain;
        return this;
    }

    [configureFnList.bindPreHandles](preHandles) {
        if(Object.prototype.toString.call(preHandles) == '[object Array]') {
            this._preHandlers = [...this._preHandlers, ...preHandles]
        } else {
            this._preHandlers.push(preHandles);
        }
        return this;
    }

    [configureFnList.bindPostHandles](postHandles) {
        if(Object.prototype.toString.call(postHandles) == '[object Array]') {
            this._postHandles = [...this._postHandles, ...postHandles]
        } else {
            this._postHandles.push(postHandles);
        }
        return this;
    }

    [configureFnList.setRequest](fn) {
        this._requestFn = fn;
        return this;
    }

    [configureFnList.use](plugin, options) {
        plugin.install(this, options);
    }

    get preHandlers() {
        return this._preHandlers || Conf._preHandlers || [];
    }

    get postHandles() {
        return this._postHandles || Conf._postHandles || [];
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