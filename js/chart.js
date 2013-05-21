var PeriodBarChart = function() {
    var DAY_SECS = 86400;

    var chart;
    var chartGroup;
    var element;

    var cfg = {
        chart: {
            height: 200,
            opacity: '.95',
            padding: 0,
            title: 'Sleep Chart',
            width: 300
        },
        color: '#AAAAEE',
        rect: {
            padding: 10,
        },
        xAxis: {
            title: 'Date'
        },
        yAxis: {
            title: 'Time'
        }
    };

    var _cfg = function(attr, val) {
        if (val) {
            cfg[attr] = val;

            // Redraw.
            d3.select(element).remove();
            draw(element);
        } else {
            return cfg[attr];
        }
    };


    var periodBarChart = function(_element, data, _cfg) {
        cfg.data = data;
        for (var key in _cfg) {
            cfg[key] = _cfg[key];
        }
        element = _element;
        draw(element);
    };


    function draw(element) {
        var widthPadding = cfg.chart.padding * 3;
        var heightPadding = cfg.chart.padding * 5;

        // Create canvas.
        this.chart = d3.select(element)
            .append('svg:svg')
            .attr('width', cfg.chart.width + widthPadding)
            .attr('height', cfg.chart.height + heightPadding);

        // Create scales.
        var xScale = d3.scale.linear()
            .domain([0, cfg.data.length])
            .range([0, cfg.chart.width]);

        var yScale = d3.scale.linear()
            .domain([0, DAY_SECS])
            .range([0, cfg.chart.height]);

        // Group elements in the chart together to help padding.
        chartGroup = this.chart.append('g')
            .attr('transform',
                  'translate(' + cfg.chart.padding * 3 + ', ' +
                   cfg.chart.padding * 2 + ')');

        // Bars.
        var rects = chartGroup.selectAll('rect')
            .data(cfg.data)
            .enter()
            .append('svg:rect')
            .attr('class', 'bar')
            .attr('fill', cfg.rect.color)
            .attr('height', function(d, i) {
                return yScale(d.wake.getTime() - d.sleep.getTime());
            })
            .attr('opacity', cfg.rect.opacity)
            .attr('width', cfg.chart.width / cfg.data.length - 20)
            .attr('x', function(d, i) {
                return xScale(i);
            })
            .attr('y', function(d, i) {
                return yScale(DAY_SECS - _daySecs(d.sleep));
            });

        // Chart title.
        if (cfg.chart.title) {
            chartGroup.append('svg:text')
                .attr('class', 'title')
                .text(cfg.chart.title)
                .attr('x', cfg.chart.width / 2)
                .attr('y', -1 * cfg.chart.padding)
                .attr('text-anchor', 'middle');
        }

        // X axis title.
        if (cfg.xAxis.title) {
            chartGroup.append('svg:text')
                .attr('class', 'xAxisTitle')
                .text(cfg.xAxis.title)
                .attr('x', cfg.chart.width / 2)
                .attr('y', cfg.chart.height + cfg.chart.padding * 2)
                .attr('text-anchor', 'middle');
        }

        // Y axis title.
        if (cfg.yAxis.title) {
            chartGroup.append('svg:text')
                .attr('class', 'yAxisTitle')
                .text(cfg.yAxis.title)
                // Rotate, X<->Y.
                .attr('x', -1 * cfg.chart.height / 2)
                .attr('y', -2 * cfg.chart.padding)
                .attr('text-anchor', 'middle')
                .attr('transform', 'rotate(-90)');
        }

        // X axis text.
        chartGroup.selectAll('text.xAxis')
            .data(cfg.data)
            .enter()
            .append('svg:text')
            .attr('class', 'xAxis')
            .text(function(d) {
                return d[0];
            })
            .attr('x', function(d, i) {
                return xScale(i) + cfg.rect.width / 2;
            })
            .attr('y', cfg.chart.height + cfg.chart.padding)
            .attr('text-anchor', 'middle');

        // Y axis text.
        chartGroup.selectAll('text.yAxis')
            .data(yScale.ticks(24))
            .enter()
            .append('svg:text')
            .attr('class', 'yAxis')
            .text(function(d) {
                return d;
            })
            .attr('x', -1.25 * cfg.chart.padding)
            .attr('y', function(d) {
                return cfg.chart.height - yScale(d);
            });
    }


    function _daySecs(date) {
        return (
            date.getTime() -
            new Date(date.getTime()).setHours(0, 0, 0, 0)) / 1000;
    }


    return {
        'periodBarChart': periodBarChart,
        'cfg': _cfg
    };
};
