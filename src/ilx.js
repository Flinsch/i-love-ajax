
(function() {

    var ilx = (function() {

        var ilx = {};
        ilx.options = {};

        var defaultOptions = {
            selectors: {
                result: '.ilx-result',
                success: '.ilx-result .ilx-success',
                error: '.ilx-result .ilx-error',
                warning: '.ilx-result .ilx-warning',
                info: '.ilx-result .ilx-info',
                content: ':not(.ilx-result)'
            }
        };

        $.expand(ilx.options, defaultOptions);

        ilx.setOptions = function(options) {
            $.expand(ilx.options, options);
        };

        ilx.setOption = function(name, value) {
            if (typeof value === 'object' && name in ilx.options && typeof ilx.options[name] === 'object') {
                $.expand(ilx.options[name], value);
            } else {
                ilx.options[name] = value;
            }
        };

        ilx.getOption = function(name) {
            return ilx.options[name];
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
            selector = selector || ilx.options.selectors.result;
            return ilx.filterResponse($response, selector);
        };

        ilx.filterSuccess = function($response) {
            return ilx.filterResponse($response, ilx.options.selectors.success);
        };

        ilx.filterError = function($response) {
            return ilx.filterResponse($response, ilx.options.selectors.error);
        };

        ilx.filterWarning = function($response) {
            return ilx.filterResponse($response, ilx.options.selectors.warning);
        };

        ilx.filterInfo = function($response) {
            return ilx.filterResponse($response, ilx.options.selectors.info);
        };

        ilx.filterContent = function($response) {
            return ilx.filterResponse($response, ilx.options.selectors.content);
        };

        return ilx;
    })();

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = ilx;
    } else {
        window.ilx = ilx;
    }
})();
