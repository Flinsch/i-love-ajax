
(function(factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        window.ilx = factory(jQuery);
    }
})(function($) {
    var ilx = {};
    ilx.options = {};

    var defaultOptions = {
        selectors: {
            result: '.ilx-result',
            success: '.ilx-result .ilx-success',
            error: '.ilx-result .ilx-error',
            warning: '.ilx-result .ilx-warning',
            info: '.ilx-result .ilx-info',
            content: ':not(.ilx-result)',
            fetchToggle: '.ilx-fetch',
            fetchReplaceable: '.ilx-fetch-replaceable',
            fetchData: '[name][name!=""]'
        },
        classes: {
            fetchPlaceholder: 'ilx-fetch-placeholder',
            fetchPlaceholderSpinner: 'ilx-fetch-loading-spinner',
        },
        html: {
            fetchPlaceholder: {
                'table, tbody': ['tr', 'td', 'span'],
                'ol, ul': 'li',
                '*': 'div'
            },
            colspan: 1000
        },
    };

    $.extend(true, ilx.options, defaultOptions);

    ilx.setOptions = function(options) {
        $.extend(true, ilx.options, options);
    };

    ilx.setOption = function(name, value) {
        if (typeof value === 'object' && name in ilx.options && typeof ilx.options[name] === 'object') {
            $.extend(true, ilx.options[name], value);
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

    ilx.checkResponse = function(jqXHR) {
        var response = {
            isHTML: false,
            isJSON: false,
            $: $(),
            data: {}
        };
        try {
            response.$ = $(jqXHR.responseText);
            response.isHTML = true;
        } catch (e) {}
        try {
            response.data = JSON.parse(jqXHR.responseText);
            response.isJSON = true;
        } catch (e) {}
        return response;
    };

    ilx.filterResponse = function($response, selector) {
        $response = $($response);
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

    var _fetching = {};

    ilx.fetch = function($toggle, replaceable) {
        $toggle.trigger($.Event('ilx.fetch.before', {}));

        var url = $toggle.attr('data-ilx-fetch-url') || $toggle.attr('action');
        if (typeof url === 'undefined' || url.length === 0 || url in _fetching) {
            return;
        }
        var method = $toggle.attr('data-ilx-fetch-method') || $toggle.attr('method') || 'get';
        var data = $toggle.find(ilx.options.selectors.fetchData).serialize();

        var $replaceable = $toggle.closest(ilx.options.selectors.fetchReplaceable);
        if (typeof replaceable !== 'undefined') {
            $replaceable = $(replaceable);
        }
        var $parent = $replaceable.parent();
        var $placeholder = _setFetchPlaceholder($replaceable, ilx.options);

        _fetching[url] = true;

        var settings = {
            url: url,
            data: data,
            method: method,
            complete: function(jqXHR, textStatus) {
                var response = ilx.checkResponse(jqXHR);
                if (response.isHTML) {
                    var $response = response.$;
                    var $content = ilx.filterContent($response);
                    $placeholder.replaceWith($content);
                }

                delete _fetching[url];

                $parent.trigger($.Event('ilx.fetch.after', {
                    jqXHR: jqXHR
                }));
            }
        };
        $.ajax(settings);
    };

    ilx._class2selector = function(className) {
        return '.' + className.replace(/\s+/g, '.');
    };

    ilx._selector2class = function(selector) {
        return selector.replace(/\./g, ' ').trim();
    };

    $(document).on('click', ilx.options.selectors.fetchToggle, function(e) {
        ilx.fetch($(this));
        e.preventDefault();
    });

    var _setFetchPlaceholder = function($replaceable, options, html_fetchPlaceholder) {
        html_fetchPlaceholder = typeof html_fetchPlaceholder !== 'undefined' ? html_fetchPlaceholder : options.html.fetchPlaceholder;

        if (typeof html_fetchPlaceholder === 'object' && html_fetchPlaceholder !== null) {
            for (var selector in html_fetchPlaceholder) {
                if (html_fetchPlaceholder.hasOwnProperty(selector)) {
                    if ($replaceable.parent().is(selector)) {
                        return _setFetchPlaceholder($replaceable, options, html_fetchPlaceholder[selector]);
                    } // check selector
                }
            } // for each selector
        }

        if (!$.isArray(html_fetchPlaceholder) && typeof html_fetchPlaceholder !== 'string') {
            return;
        }

        var tagNames = $.isArray(html_fetchPlaceholder) ? html_fetchPlaceholder : [html_fetchPlaceholder];
        var $placeholder = $('<'+tagNames[0]+'/>', { 'class': options.classes.fetchPlaceholder });
        var $spinner = $placeholder;

        for (var i = 1; i < tagNames.length; ++i) {
            var $e = $('<'+tagNames[i]+'/>');
            if (tagNames[i] === 'td' || tagNames[i] === 'th') {
                $e.attr('colspan', options.html.colspan);
            }
            $spinner.append($e);
            $spinner = $e;
        }

        $spinner.addClass(options.classes.fetchPlaceholderSpinner);
        $replaceable.replaceWith($placeholder);
        return $placeholder;
    };

    return ilx;
});
