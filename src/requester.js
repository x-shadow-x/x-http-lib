export default class Requester {
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
        const request = {
            url: this._url,
            header: {...this._header},
            method: this._method,
            query: options && options.query,
            body: options && options.body,
            other: options && options.other
        };
        const preHandlers = this._conf.preHandlers;
        for(let i = 0, len = preHandlers.length; i < len; i++) {
            const item = preHandlers[i];
            Object.prototype.toString.call(item) === '[object Function]' && item(request);
        }
    }

    setHeader(header) {
        this._header = header ? {...header} : {};
        return this;
    }
    
    _handleUrl(options) {
        const query = options.query || {};
        let url = this._urlFormat;
        for(let key in query) {
            url = url.replace(`{${key}}`, query[key]);
        }
        
        this._url = `${this._conf.domain}${url}`;
    }
}