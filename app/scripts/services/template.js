/**
 *  Module
 *
 * Description
 */
angular.module('app.services.template', []).
service('TemplateService', ['$templateCache', '$log', '$http', 'Environment', '$q', function($templateCache, $log, $http, Environment, $q) {
    /**
     * @ngdoc method
     * @name getTemplate
     * @methodOf ui.grid.service:GridUtil
     * @description Get's template from cache / element / url
     *
     * @param {string|element|promise} Either a string representing the template id, a string representing the template url,
     *   an jQuery/Angualr element, or a promise that returns the template contents to use.
     * @returns {object} a promise resolving to template contents
     *
     * @example
     <pre>
     TemplateService.getTemplate(url).then(function (contents) {
          alert(contents);
        })
     </pre>
     */
    'use strict';
    
    this.getTemplate = function(template) {
        // Try to fetch the template out of the templateCache
        if (Environment.isDev()) {
            $templateCache.remove(template);    
        }
        
        if ($templateCache.get(template)) {
            return $q.when($templateCache.get(template));
        }

        // See if the template is itself a promise
        if (template.hasOwnProperty('then')) {
            return template;
        }

        // If the template is an element, return the element
        try {
            if (angular.element(template).length > 0) {
                return $q.when(template);
            }
        } catch (err) {
            //do nothing; not valid html
        }

        $log.debug('Fetching url', template);

        // Default to trying to fetch the template as a url with $http
        return $http({
                method: 'GET',
                url: template
            })
            .then(
                function(result) {
                    var templateHtml = result.data.trim();
                    //put in templateCache for next call
                    $templateCache.put(template, templateHtml);
                    return templateHtml;
                },
                function(err) {
                    throw new Error("Could not get template " + template + ": " + err);
                }
            );
    };
}]);

export default 'app.services.template';