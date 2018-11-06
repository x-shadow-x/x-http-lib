import axios from 'axios';

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
    setDirective: 'setDirective',
    use: 'use'
};

class Configure {
    constructor() {
        this._preHandlers = [];
        this._postHandles = [];
        this._directive = null;
    }

    [configureFnList.setDomin](domain) {
        this._domain = domain;
        return this;
    }

    [configureFnList.bindPreHandles](preHandles) {
        if (Object.prototype.toString.call(preHandles) == "[object Array]") {
            this._preHandlers = [...this._preHandlers, ...preHandles];
        } else {
            this._preHandlers.push(preHandles);
        }
        return this;
    }

    [configureFnList.bindPostHandles](postHandles) {
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

const reg = /{([a-zA-Z0-9]*)?([^}]*)?}/gi;

class Requester {
    constructor(conf, requestSetting) {
        this._conf = conf;
        this._header = conf.header || {};
        if(Object.prototype.toString.call(requestSetting) === '[object String]') {
            this._urlFormat = requestSetting;
            this._method = 'GET';
        } else {
            this._urlFormat = (requestSetting && requestSetting.url) || '';
            this._method = (requestSetting && requestSetting.method) || 'GET';
        }
    }

    handler(options) {
        this._handleUrl(options);
        const request = {
            url: this._url,
            header: options.header ? { ...this._header, ...options.header } : { ...this._header },
            method: this._method,
            query: options && options.query,
            body: options && options.body,
            other: options && options.other
        };

        const preHandlers = this._conf.preHandlers;
        const postHandles = this._conf.postHandles;
        const requestFn = this._conf.requestFn;
        for(let i = 0, len = preHandlers.length; i < len; i++) {
            const item = preHandlers[i];
            Object.prototype.toString.call(item) === '[object Function]' && item(request);
        }
        return requestFn(request).then(res => {
            for(let i = 0, len = postHandles.length; i < len; i++) {
                const item = postHandles[i];
                res = Object.prototype.toString.call(item) === '[object Function]' && item(res) || res;
            }
            return res;
        });
    }

    setHeader(header) {
        this._header = header ? {...header} : {};
        return this;
    }

    extendHeader(header) {
        this._header = header ? {...this._header, ...header} : {};
        return this;
    }
    
    _handleUrl(options) {
        const query = options.query || {};
        let url = this._urlFormat;
        url = url.replace(reg, ($1, $2, $3) => {
            let result = query[$2];
            if ($3) {
                const directiveList = $3.split(":");
                for (let index = 0, len = directiveList.length; index < len; index++) {
                    const directiveName = directiveList[index];
                    const directive = directiveName && this._conf.directive[directiveName];
                    result = (directive && directive(result)) || result;
                }
            }
            return result;
        });
        
        this._url = `${this._conf.domain}${url}`;
    }
}

const [_conf, _interfaceList] = [
    Symbol('Configure'),
    Symbol('InterfaceSet')
];

class XHttp {
    constructor() {
        this.name = 'XHttp';
        this[_conf] = new Configure();
    }
}

for(let key in configureFnList) {
    Object.defineProperty(XHttp, key, {
        enumerable: false,
        configurable: false,
        get: function() {
            return (...args) => {
                Conf[key](...args);
                return this;
            }
        }
    });

    Object.defineProperty(XHttp.prototype, key, {
        enumerable: false,
        configurable: false,
        get: function() {
            return (...args) => {
                this[_conf][key](...args);
                return this;
            }
        }
    });
}

Object.defineProperty(XHttp.prototype, 'addRequests', {
    enumerable: false,
    configurable: false,
    get: function () {
        return (requestList) => {
            this[_interfaceList] = this[_interfaceList] || {};
            for(let key in requestList) {
                this[_interfaceList][key] = new Requester(this[_conf], requestList[key]);
                Object.defineProperty(this, key, {
                    get: function() {
                        return this[_interfaceList][key].handler.bind(this[_interfaceList][key]);
                    }
                });
            }
            return this;
        }
    }
});

const MyPlugin = {
    install(instance, options) {
        instance.setRequest((requestArgs) => {
            return axios(requestArgs);
        });
    }
};

XHttp.use(MyPlugin);

const xHttp = new XHttp();
xHttp.setDomin("http://miniptapi.innourl.com");
xHttp.addRequests({
	getUserPlayInfo: "/Redpacket/User/GetUserPlayInfo/{userId}&{brandId}"
}).bindPreHandles((request) => {
	console.log(request);
});

xHttp.getUserPlayInfo({
	query: {
		userId: 2,
		brandId: "1003"
	}
}).then(res => {
	console.log(res);
});

console.log(123123123);
