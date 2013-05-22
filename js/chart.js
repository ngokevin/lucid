var PeriodBarChart = function() {
    var DAY_SECS = 86400;

    var chart;
    var chartGroup;
    var element;

    var cfg = {
        chart: {
            fontColor: 'rgb(245, 245, 245)',
            fontSize: '12',
            height: 200,
            opacity: '.95',
            topPadding: 15,
            title: 'Sleep Chart',
            width: 300
        },
        rect: {
            inactiveColor: 'rgb(220, 220, 220)',
            activeColor: '#299283'
        },
        xAxis: {
            title: 'Date',
            padding: 12
        },
        yAxis: {
            title: 'Time',
            padding: 30
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
        cfg.data = clean(data);
        for (var key in _cfg) {
            cfg[key] = _cfg[key];
        } element = _element;
        draw(element);
    };


    function clean(data) {
        // Segments objects with start and end Dates that span over multiple
        // days into separate objects that are contained within a day.
        var entry, midnight;
        for (var i = 0; i < data.length; i++) {
            entry = data[i];
            if (entry.sleep.getDate() == entry.wake.getDate() ||
                (entry.wake.getHours() == 0 && entry.wake.getMinutes() == 0)) {
                // Don't need to do anything if sleep and wake on same day.
                continue;
            }

            midnight = new Date(entry.wake.getTime());
            midnight.setHours(0, 0);
            data.push({
                sleep: midnight,
                wake: new Date(entry.wake.getTime())
            });

            entry.wake = midnight;
        }
        return data;
    }


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
            .range([cfg.chart.topPadding, cfg.chart.height - cfg.xAxis.padding - cfg.chart.topPadding]);

        // Group elements in the chart together to help padding.
        chartGroup = this.chart.append('g')
            .attr('transform',
                  'translate(' + cfg.yAxis.padding + ', ' +
                    0+ ')');

        // Awake bars.
        var rectWidth = (cfg.chart.width - cfg.yAxis.padding) / cfg.data.length;
        chartGroup.selectAll('rect.awake')
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
        chartGroup.selectAll('rect.sleep')
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
                return cfg.chart.height - cfg.xAxis.padding - yScale(DAY_SECS - _daySecs(d.sleep));
            });

        // X axis text.
        chartGroup.selectAll('text.xAxis')
            .data(cfg.data)
            .enter()
            .append('svg:text')
            .attr('class', 'xAxis')
            .attr('fill', cfg.chart.fontColor)
            .attr('font-size', cfg.chart.fontSize + 'px')
            .attr('text-anchor', 'middle')
            .attr('x', function(d, i) {
                return xScale(i) + rectWidth / 2;
            })
            .attr('y', cfg.chart.height)
            .text(function(d, i) {
                return d.sleep.getMonth() + 1 + '-' + d.sleep.getDate();
            });

        // Y axis text.
        this.chart.selectAll('text.yAxis')
            .data(hourArray(0, 24, 3))
            .enter()
            .append('svg:text')
            .attr('class', 'yAxis')
            .attr('fill', cfg.chart.fontColor)
            .attr('font-size', cfg.chart.fontSize + 'px')
            .attr('y', function(d) {
                return yScale(d) + cfg.chart.fontSize / 2 - 2;
            })
            .text(function(d, i) {
                var hour = d / 60 / 60;
                if (hour === 0 || hour == 24) {
                    return 'M';
                } else if (hour == 12) {
                    return 'N';
                } else if (hour > 12) {
                    hour -= 12;
                    hour += 'pm';
                } else if (hour < 12) {
                    hour += 'am';
                }
                return hour;
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
