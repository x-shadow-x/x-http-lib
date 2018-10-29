import { configureFnList, Conf, Configure } from './configure.js';

const [_conf] = [
    Symbol('Configure')
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
            return () => {
                Conf[key]();
                return this;
            }
        }
    });

    Object.defineProperty(XHttp.prototype, key, {
        enumerable: false,
        configurable: false,
        get: function() {
            return () => {
                this[_conf][key]();
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
            for(let key in requestList) {
                Object.defineProperty(this, key, {
                    enumerable: false,
                    configurable: false,
                    get: function() {
                        return (options) => {
                            
                        }
                    }
                });
            }
        }
    }
});

// const xHttp = new XHttp()
// .setDomin("https://miniptapi.innourl.com")
// .addRequests({
//     getUserPlayInfo: '/Redpacket/User/GetUserPlayInfo/{userId}&{brandId}'
// });
    
// xHttp.getUserPlayInfo({
//     params: {
//         userId: 2,
//         brandId: 1003
//     }
// });