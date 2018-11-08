import XHttp from './index';
import { Base64 } from 'js-base64';
import axios from 'axios';

const MyPlugin = {
    install(instance, options) {
        instance.setRequest((requestArgs) => {
			// axios.defaults.crossDomain = true;
			// axios.defaults.withCredentials  = true;
            return axios({
				url: requestArgs.url,
				method: requestArgs.method,
				headers: requestArgs.header,
			});
        })
    }
}

XHttp.use(MyPlugin).bindDirective("b", value => {
	return Base64.encode(value);
}).bindPreHandles(() => {
	console.log(11111);
});

const xHttp = new XHttp();
xHttp.setDomin("http://miniptapi.innourl.com");
xHttp.addRequests({
	getUserPlayInfo: "/Redpacket/User/GetUserPlayInfo/{userId:b}&{brandId}"
}).bindPreHandles((request) => {
	console.log(666777);
});

xHttp.getUserPlayInfo({
	query: {
		userId: 2,
		brandId: "1003"
	}
}).then(res => {
	console.log(res);
});