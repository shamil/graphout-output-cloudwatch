/**
 * cloudwatch output for graphout
 */
AWS = require('aws-sdk');

// constructor
var CloudWatchOutput = module.exports = function(events, log, params) {
    // let's first validate required params
    validateParams(params);

    // set cloudwatch options
    var cloudwatch_opts = {
        accessKeyId:     params.accessKeyId,
        secretAccessKey: params.secretAccessKey,
        region:          params.region
    };

    // create CloudWatch instance
    var CloudWatch = new AWS.CloudWatch(cloudwatch_opts),
        self       = this;

    // add item to payload on result
    events.on('result', function(result, options) {
        var key = (params.namespace + options.name).replace(/\.+/g, '.').split('.');

        // in DOT notation, only last element is a metric name
        // other elements are part of namespace
        if (params.dot_notation) {
            var metric    = key.pop(),
                namespace = key.join('/');
        }
        // if DOT notation not used, only first element is a namespace,
        // other elements are part of metric name
        else {
            var namespace = key.shift(),
                metric    = key.join('.');
        }

        // prepare metric data
        var metric_data = {
            Namespace: namespace,
            MetricData: [{
                MetricName: metric,
                Value: result
            }]
        }

        log.debug('putting metric', {namespace: namespace, metric: metric, value: result});
        CloudWatch.putMetricData(metric_data, function(err, res) {
            if (err) {
                log.error('put failed', {error: err.message});
                return;
            }

            log.debug('response', res);
        });
    });
};

function validateParams(params) {
    ['accessKeyId', 'secretAccessKey', 'region', 'namespace', 'dot_notation'].forEach(function(param) {
        switch (param) {
            case 'namespace':
                params[param] = params[param] ? params[param] + '.' : 'Graphout.';
                break;

            case 'dot_notation':
                params[param] = (typeof params[param] !== 'undefined') ? params[param] : true;
                break;

            default:
                if (typeof params[param] === 'undefined')
                    throw new Error('param ' + param + ' missing');
        }
    });
}
