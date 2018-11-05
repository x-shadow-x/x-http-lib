const reg = /{([a-zA-Z0-9]*)?([^}]*)?}/gi;

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
