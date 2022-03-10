(() => {

    const FormData = require('form-data');
    const { ServerError } = require('./exceptions');
    const store = require('store');
    const config = require('./config');
    const DownloadWorker = require('./download.worker');
    const Axios = require('axios');
    const tus = require('tus-js-client');
    
    function enableOrganization() {
        return { org: config.organizationID || '' };
    }

    class ServerProxy2{
        constructor(){
            Axios.defaults.withCredentials = true;
            Axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
            Axios.defaults.xsrfCookieName = 'csrftoken';
            Axios.interceptors.request.use((reqConfig) => {
                if ('params' in reqConfig && 'org' in reqConfig.params) {
                    return reqConfig;
                }

                reqConfig.params = { ...enableOrganization(), ...(reqConfig.params || {}) };
                return reqConfig;
            });
            let token = store.get('token');
            if (token) {
                Axios.defaults.headers.common.Authorization = `Token ${token}`;
            }
            async function note(tid){
                console.log("successfully created class serverProxy");
                const { backendAPI } = config;

                let response = null;
                try {
                    response = await Axios.get(`${backendAPI}/tasks/${tid}/autoanno`, {
                        proxy: config.proxy,
                    });
                } catch (errorData) {
                    console.log("Error!!!");
                }

                return response;
            }
            Object.defineProperties(
                this,
                Object.freeze({
                    server: {
                        value: Object.freeze({
                            note,
                        }),
                        writable: false,
                    },
                }
                )
            )
        }
    }
    
    
    const serverProxy2 = new ServerProxy2();
    module.exports = serverProxy2;

})();