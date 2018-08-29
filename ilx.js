
(function() {

    var ilx = (function() {

        var ilx = {};
        ilx.config = {};

        var defaultConfig = {
            selectors: {
                result: '.ilx-result',
                success: '.ilx-result .ilx-success',
                error: '.ilx-result .ilx-error',
                warning: '.ilx-result .ilx-warning',
                info: '.ilx-result .ilx-info',
                content: ':not(.ilx-result)'
            }
        };

        ilx.init = function(config) {
            ilx.config = $.expand({}, defaultConfig, config);
            return ilx;
        };

        ilx.isHtmlResponse = function(jqXHR) {
            var content_type = jqXHR.getResponseHeader('content-type');
            return content_type && content_type.indexOf('html') > -1;
        };

        ilx.isJsonResponse = function(jqXHR) {
            var content_type = jqXHR.getResponseHeader('content-type');
            return content_type && content_type.indexOf('json') > -1;
        };

        ilx.filterResponse = function($response, selector) {
            $response = $(response);
            return $response.filter(selector);
        };

        ilx.filterResult = function($response, selector) {
            selector = selector || ilx.config.selectors.result;
            return ilx.filterResponse($response, selector);
        };

        ilx.filterSuccess = function($response) {
            return ilx.filterResponse($response, ilx.config.selectors.success);
        };

        ilx.filterError = function($response) {
            return ilx.filterResponse($response, ilx.config.selectors.error);
        };

        ilx.filterWarning = function($response) {
            return ilx.filterResponse($response, ilx.config.selectors.warning);
        };

        ilx.filterInfo = function($response) {
            return ilx.filterResponse($response, ilx.config.selectors.info);
        };

        ilx.filterContent = function($response) {
            return ilx.filterResponse($response, ilx.config.selectors.content);
        };

    })();

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = ilx;
    } else {
        window.ilx = ilx;
    }
})();
