var BarChart = function() {
    var chart;
    var chartGroup;
    var element;

    var config = {
        BAR_WIDTH: 70;
        CHART_HEIGHT: 400;
        COLOR: '#AAAAEE';
        OPACITY: '.95';
        PADDING: 40;
        RECT_PADDING: 10;
        Y_TICKS: 10;
    };

    var _config = function(attr, val) {
        if (val) {
            config[attr] = val;

            // Redraw.
            d3.select(element).remove();
            draw(element);
        } else {
            return config[attr];
        }
    };


    var barChart = function(_element, config) {
        config = config;
        element = _element;
        draw(element);
    };


    function draw(element) {
        var width = (config.rect.width +
                     (config.rect.padding || RECT_PADDING)) *
            config.data.length;
        var widthPadding = config.padding * 3;
        var heightPadding = config.padding * 5;

        // Create canvas.
        this.chart = d3.select(element)
            .append('svg:svg')
            .attr('width', width + widthPadding)
            .attr('height', config.height + heightPadding);

        // Create scales.
        var xScale = d3.scale.linear()
            .domain([0, config.data.length])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([0, max(config.data)])
            .range([0, config.height]);

        // Group elements in the chart together to help padding.
        chartGroup = this.chart.append('g')
            .attr('transform',
                  'translate(' + config.padding * 3 + ', ' + config.padding * 2 + ')');

        // Rectangles.
        var rects = chartGroup.selectAll('rect')
            .data(config.data)
            .enter()
            .append('svg:rect')
            .attr('class', 'bar')
            .attr('x', function(d, i) {
                return xScale(i);
            })
            .attr('y', config.height)
            .attr('width', config.rect.width)
            .attr('fill', config.rect.color)
            .attr('opacity', config.rect.opacity)
            .transition()
                .duration(500)
                .delay(function(d, i) {
                    return i * 80;
                })
                .attr('y', function(d) {
                    return config.height - yScale(d[1]);
                })
                .attr('height', function(d) {
                    return yScale(d[1]);
                });

        // Events.
        var rects = chartGroup.selectAll('rect');
        if (config.mouseover) {
            rects.on('mouseover', function(d, i) {
               config.mouseover.call(this, d, i);
            });
        }
        if (config.mouseout) {
            rects.on('mouseout', function(d, i) {
               config.mouseout.call(this, d, i);
            });
        }
        if (config.click) {
            rects.on('click', function(d, i) {
               config.click.call(this, d, i);
            });
        }

        // Chart title.
        if (config.title) {
            chartGroup.append('svg:text')
                .attr('class', 'title')
                .text(config.title)
                .attr('x', width / 2)
                .attr('y', -1 * config.padding)
                .attr('text-anchor', 'middle');
        }

        // X axis title.
        if (config.xAxis.title) {
            chartGroup.append('svg:text')
                .attr('class', 'xAxisTitle')
                .text(config.xAxis.title)
                .attr('x', width / 2)
                .attr('y', config.height + config.padding * 2)
                .attr('text-anchor', 'middle');
        }

        // Y axis title.
        if (config.yAxis.title) {
            chartGroup.append('svg:text')
                .attr('class', 'yAxisTitle')
                .text(config.yAxis.title)
                // Rotate, X<->Y.
                .attr('x', -1 * config.height / 2)
                .attr('y', -2 * config.padding)
                .attr('text-anchor', 'middle')
                .attr('transform', 'rotate(-90)');
        }

        // X axis text.
        chartGroup.selectAll('text.xAxis')
            .data(config.data)
            .enter()
            .append('svg:text')
            .attr('class', 'xAxis')
            .text(function(d) {
                return d[0];
            })
            .attr('x', function(d, i) {
                return xScale(i) + config.rect.width / 2;
            })
            .attr('y', config.height + config.padding)
            .attr('text-anchor', 'middle');

        // Y axis text.
        chartGroup.selectAll('text.yAxis')
            .data(yScale.ticks(config.ticks || Y_TICKS))
            .enter()
            .append('svg:text')
            .attr('class', 'yAxis')
            .text(function(d) {
                return d.toFixed(1);
            })
            .attr('x', -1.25 * config.padding)
            .attr('y', function(d) {
                return config.height - yScale(d);
            });
    }


    function max(data) {
        var max = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i][1] > max) {
                max = data[i][1];
            }
        }
        return max;
    }


    return {
        'barChart': barChart,
        'config': _config
    };
}
