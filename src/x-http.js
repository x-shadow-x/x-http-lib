import { configureFnList, Conf, Configure } from './configure.js';
import Requester from './requester.js';

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
                })
            }
            return this;
        }
    }
});

export default XHttp;