var PeriodBarChart = function() {
    var DAY_SECS = 86400;

    var chart;
    var chartGroup;
    var axisGroup;
    var element;

    var cfg = {
        chart: {
            height: 200,
            opacity: '.95',
            padding: 0,
            title: 'Sleep Chart',
            width: 300
        },
        rect: {
            inactiveColor: 'rgb(220, 220, 220)',
            activeColor: '#299283',
        },
        xAxis: {
            title: 'Date',
            padding: 15
        },
        yAxis: {
            title: 'Time',
            padding: 22
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
        } element = _element;
        draw(element);
    };


    function draw(element) {
        // Create canvas.
        this.chart = d3.select(element)
            .append('svg:svg')
            .attr('width', cfg.chart.width)
            .attr('height', cfg.chart.height);

        // Create scales.
        var xScale = d3.scale.linear()
            .domain([0, cfg.data.length])
            .range([0, cfg.chart.width - cfg.yAxis.padding]);

        var yScale = d3.scale.linear()
            .domain([0, DAY_SECS])
            .range([0, cfg.chart.height - cfg.xAxis.padding]);

        yAxisGroup = this.chart.append('g')
            .attr('transform', 'translate(0, ' + cfg.xAxis.padding + ')');

        // Group elements in the chart together to help padding.
        chartGroup = this.chart.append('g')
            .attr('transform',
                  'translate(' + cfg.yAxis.padding + ', ' +
                   0 + ')');

        // Awake bars.
        var rectWidth = (cfg.chart.width - cfg.yAxis.padding) / cfg.data.length;
        var rects = chartGroup.selectAll('rect.awake')
            .data(cfg.data)
            .enter()
            .append('svg:rect')
            .attr('class', 'awake')
            .attr('fill', cfg.rect.inactiveColor)
            .attr('height', function(d, i) {
                return yScale(DAY_SECS);
            })
            .attr('opacity', cfg.rect.opacity)
            .attr('width', rectWidth)
            .attr('x', function(d, i) {
                return xScale(i);
            })
            .attr('y', function(d, i) {
                return yScale(0);
            });

        // Sleep bars.
        var rects = chartGroup.selectAll('rect.sleep')
            .data(cfg.data)
            .enter()
            .append('svg:rect')
            .attr('class', 'sleep')
            .attr('fill', cfg.rect.activeColor)
            .attr('height', function(d, i) {
                return yScale((d.wake.getTime() - d.sleep.getTime()) / 1000);
            })
            .attr('opacity', cfg.rect.opacity)
            .attr('width', rectWidth)
            .attr('x', function(d, i) {
                return xScale(i);
            })
            .attr('y', function(d, i) {
                return cfg.chart.height - yScale(DAY_SECS - _daySecs(d.sleep));
            });

        // X axis text.
        this.chart.selectAll('text.xAxis')
            .data(cfg.data)
            .enter()
            .append('svg:text')
            .attr('class', 'xAxis')
            .text(function(d, i) {
                return d.sleep.getMonth() + '/' + d.sleep.getDay();
            })
            .attr('x', function(d, i) {
                return xScale(i) + rectWidth;
            })
            .attr('y', cfg.chart.height)
            .attr('text-anchor', 'middle');

        // Y axis text.
        yAxisGroup.selectAll('text.yAxis')
            .data(hourArray(0, 24, 3))
            .enter()
            .append('svg:text')
            .attr('class', 'yAxis')
            .text(function(d, i) {
                return d / 60 / 60;
            })
            .attr('y', function(d) {
                return yScale(d);
            });
    }


    function hourArray(start, end, mod) {
        var foo = [];
        for (var i = start; i <= end; i++) {
            if (i % mod === 0) {
                foo.push(i * 60 * 60);
            }
        }
        return foo;
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
