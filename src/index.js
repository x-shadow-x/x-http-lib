import XHttp from './x-http';
import { Base64 } from 'js-base64';
import axios from 'axios';
console.log(Base64);

const MyPlugin = {
    install(instance, options) {
        instance.setRequest((requestArgs) => {
			// axios.defaults.withCredentials=true;
            return axios.get(requestArgs.url, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			});
        })
    }
}

XHttp.use(MyPlugin).bindDirective("b", value => {
	return Base64.encode(value);
});;

const xHttp = new XHttp();
xHttp.setDomin("http://miniptapi.innourl.com");
xHttp.addRequests({
	getUserPlayInfo: "/Redpacket/User/GetUserPlayInfo/{userId:b}&{brandId}"
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