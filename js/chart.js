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
            color: '#299283',
        },
        xAxis: {
            title: 'Date',
            padding: 20
        },
        yAxis: {
            title: 'Time',
            padding: 10
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

        axisGroup = this.chart.append('g')
            .attr('transform',
                  'translate(' + cfg.yAxis.padding + ', ' +
                   cfg.xAxis.padding + ')');

        // Group elements in the chart together to help padding.
        chartGroup = this.chart.append('g')
            .attr('transform',
                  'translate(' + cfg.yAxis.padding + ', ' +
                   cfg.xAxis.padding + ')');

        // Bars.
        var rectWidth = (cfg.chart.width - cfg.yAxis.padding) / cfg.data.length;
        var rects = chartGroup.selectAll('rect')
            .data(cfg.data)
            .enter()
            .append('svg:rect')
            .attr('class', 'bar')
            .attr('fill', cfg.rect.color)
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
        axisGroup.selectAll('text.xAxis')
            .data(cfg.data)
            .enter()
            .append('svg:text')
            .attr('class', 'xAxis')
            .text(function(d) {
                return d[0];
            })
            .attr('x', function(d, i) {
                return xScale(i) + rectWidth / 2;
            })

            .attr('text-anchor', 'middle');

        // Y axis text.
        axisGroup.selectAll('text.yAxis')
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
