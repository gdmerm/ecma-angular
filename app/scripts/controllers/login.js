class LoginController {
    constructor($location, esWebApi, esGlobals, esUser, $routeParams, UrlManager) {
        this.$location = $location;
        this.esWebApi = esWebApi;
        this.esGlobals = esGlobals;
        this.esUser = esUser;
        this.$routeParams = $routeParams;
        this.UrlManager = UrlManager;

        this.user = {
            UserID: null,
            Password: null
        };

        this.credentials = {
            UserID: '',
            Password: '',
            BranchID: '\u0391\u0398', // 'ΑΘ' unicode escape. There seems to be a problem with jspm build tool
            LangID: 'el-GR'
        };
    }

    /**
     * log a user to the system
     */
    doLogin() {
        //abort in case of validation errors
        if (this.user.UserID === '' ||
             this.user.Password === '' || 
             this.user.UserID === null || 
             this.user.Password === null ) { return; }

        //update with user credentials
        angular.extend(this.credentials, this.user);

        //call webapi to login the user
        this.esWebApi.openSession(this.credentials)
            .success( ($user, status, headers, config) => {
                var user = new this.esUser();
                var redirect = (this.$routeParams.onsuccessredirect) ? this.$routeParams.onsuccessredirect : '/home';
                $location.path(redirect);              
                $location.search('onsuccessredirect', null);
                if (this.UrlManager.redirectQueryString) {
                    for (var paramName in this.UrlManager.redirectQueryString) {
                        this.$location.search(paramName, this.UrlManager.redirectQueryString[paramName]);
                    }
                    this.UrlManager.redirectQueryString = '';
                }
            })
            .error(function (data, status, headers, config) {
                if (data.UserMessage)
                    return toastr.error(data.UserMessage);
            });
    } //doLogin()
}

LoginController.$inject = [
    '$location', 
    'es.Services.WebApi',
    'es.Services.Globals',
    'EsUser',
    '$routeParams',
    'UrlManager'
];
angular.module('app.controllers.login', []).controller('LoginController', LoginController);

export default 'app.controllers.login';
