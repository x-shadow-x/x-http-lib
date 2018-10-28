/**
 * x-http类公共默认配置以及具体实例的单独配置项功能类
 * 配置包括每个x-http实例的域名，请求头配置，前、后置处理器
 * 还可配置默认的公共配置，通过此文件单独new出来的Conf导出
 */

const configureFnList = {
    setDomin: 'setDomin'
}

class Configure {
    [configureFnList.setDomin](domain) {
        console.log(domain);
        this.domain = domain;
    }
}

const Conf = new Configure();

export {
    configureFnList, 
    Conf,
    Configure
};