var PeriodBarChart = function() {
    var DAY_SECS = 86400;

    var chart;
    var chartGroup;
    var element;

    var bucketedData;
    var rawData;

    var cfg = {
        chart: {
            axisPadding: 3,
            fontColor: 'rgb(245, 245, 245)',
            fontSize: '12',
            height: 240,
            opacity: '.95',
            topPadding: 15,
            title: 'Sleep Chart',
            width: 300
        },
        rect: {
            inactiveNightColor: 'rgb(200, 200, 200)',
            inactiveDayColor: 'rgb(220, 220, 220)',
            activeColor: '#299283'
        },
        xAxis: {
            days: 7,
            padding: 5
        },
        yAxis: {
            padding: 35
        }
    };


    var periodBarChart = function(_element, data, _cfg) {
        rawData = data;
        cfg = $.extend(true, {}, cfg, _cfg);
        if (cfg.xAxis.days !== -1) {
            data = trim(data);
        }
        cfg.data = pad(clean(data));
        bucketedData = bucket(cfg.data);
        element = _element;
        draw(element);
    };


    function clean(data) {
        // Segments objects with start and end Dates that span over multiple
        // days into separate objects that are contained within a day.
        var entries = [];
        var entry, midnight;

        for (var i = 0; i < data.length; i++) {
            entry = data[i];
            if (entry.sleep.getDate() == entry.wake.getDate() ||
                (entry.wake.getHours() === 0 && entry.wake.getMinutes() === 0)) {
                // Don't need to do anything if sleep and wake on same day.
                entries.push(entry);
                continue;
            }

            // TODO: Case where someone falls into a multi-day coma.
            midnight = new Date(entry.wake.getTime());
            midnight.setHours(0, 0);
            entries.push({
                sleep: midnight,
                wake: new Date(entry.wake.getTime())
            });
            entry.wake = midnight;
            entries.splice(entries.length - 1, entries, entry);
        }
        return entries;
    }


    function pad(data) {
        // Add missing dates with dummy data (assume sorted data).
        var entries = [];
        var todayDate, tmrDate, nextDate, currentDate;
        for (var i = 0; i < data.length; i++) {
            entries.push(data[i]);
            if (i === data.length - 1) {
                break;
            }

            // Lookahead.
            todayDate = data[i].sleep;
            tmrDate = new Date(data[i].sleep.getTime());
            tmrDate.setDate(tmrDate.getDate() + 1);
            nextDate = data[i + 1].sleep;

            if (todayDate.toDateString() != nextDate.toDateString() &&
                tmrDate.toDateString() != nextDate.toDateString()) {
                // If next date is not today or not tomorrow, fill gap.
                currentDate = tmrDate;
                currentDate.setHours(0, 0, 0);
                while (currentDate.toDateString() != nextDate.toDateString()) {
                    entries.push({
                        sleep: new Date(currentDate.getTime()),
                        wake: new Date(currentDate.getTime())
                    });
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }
        return entries;
    }


    function bucket(data) {
        // Bucket data by sleep date.
        var entries = [];
        var dayBucket = [];
        for (var i = 0; i < data.length; i++) {
            // Lookahead.
            if (dayBucket.length === 0 || ds(data[i]) == ds(dayBucket[0])) {
                dayBucket.push(data[i]);
            } else {
                entries.push(dayBucket);
                dayBucket = [data[i]];
            }
        }
        entries.push(dayBucket);
        return entries;
    }


    function trim(data) {
        // Trim to the last n days of data.
        var minDate = new Date();
        minDate.setDate(minDate.getDate() - cfg.xAxis.days);

        var entries = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].sleep > minDate) {
                entries.push(data[i]);
            }
        }
        return entries;
    }


    function draw(element) {
        // Create canvas.
        this.chart = d3.select(element)
            .append('svg:svg')
            .attr('width', cfg.chart.width)
            .attr('height', cfg.chart.height);

        // Create scales.
        var xScale = d3.scale.linear()
            .domain([0, bucketedData.length])
            .range([0, cfg.chart.width - cfg.yAxis.padding]);

        var yScale = d3.scale.linear()
            .domain([0, DAY_SECS])
            .range([cfg.chart.topPadding, cfg.chart.height - cfg.xAxis.padding - cfg.chart.topPadding]);

        // Group elements in the chart together to help padding.
        chartGroup = this.chart.append('g')
            .attr('transform',
                  'translate(' + cfg.yAxis.padding + ', ' +
                    0+ ')');

        var rectWidth = (cfg.chart.width - cfg.yAxis.padding) /
                        bucketedData.length;

        // Awake bars, morning.
        chartGroup.selectAll('rect.awake-morning')
            .data(cfg.data)
            .enter()
            .append('svg:rect')
            .attr('class', 'awake')
            .attr('fill', cfg.rect.inactiveNightColor)
            .attr('height', function(d, i) {
                // Midnight to 6am.
                return yScale(6 * 60 * 60);
            })
            .attr('opacity', cfg.rect.opacity)
            .attr('width', rectWidth)
            .attr('x', function(d, i) {
                return xScale(getBucketedIndex(d));
            })
            .attr('y', function(d, i) {
                // Midnight.
                return yScale(0);
            });

        // Awake bars, day.
        chartGroup.selectAll('rect.awake-day')
            .data(cfg.data)
            .enter()
            .append('svg:rect')
            .attr('fill', cfg.rect.inactiveDayColor)
            .attr('height', function(d, i) {// 6am to 6pm.
                return yScale(12 * 60 * 60);
            })
            .attr('opacity', cfg.rect.opacity)
            .attr('width', rectWidth)
            .attr('x', function(d, i) {
                return xScale(getBucketedIndex(d));
            })
            .attr('y', function(d, i) {
                // 6am.
                return yScale(6 * 60 * 60);
            });

        // Awake bars, night.
        chartGroup.selectAll('rect.awake-night')
            .data(cfg.data)
            .enter()
            .append('svg:rect')
            .attr('fill', cfg.rect.inactiveNightColor)
            .attr('height', function(d, i) {
                // 6pm to Midnight.
                return yScale(4 * 60 * 60);
            })
            .attr('opacity', cfg.rect.opacity)
            .attr('width', rectWidth)
            .attr('x', function(d, i) {
                return xScale(getBucketedIndex(d));
            })
            .attr('y', function(d, i) {
                // 6pm.
                return yScale(18 * 60 * 60);
            });

        // Sleep bars.
        chartGroup.selectAll('rect.sleep')
            .data(cfg.data)
            .enter()
            .append('svg:rect')
            .attr('class', 'sleep')
            .attr('fill', cfg.rect.activeColor)
            .attr('height', function(d, i) {
                return yScale((d.wake.getTime() - d.sleep.getTime()) / 1000) - yScale(0);
            })
            .attr('opacity', cfg.rect.opacity)
            .attr('width', rectWidth)
            .attr('x', function(d, i) {
                return xScale(getBucketedIndex(d));
            })
            .attr('y', function(d, i) {
                return yScale(_daySecs(d.sleep));
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
                return xScale(getBucketedIndex(d)) + rectWidth / 2;
            })
            .attr('y', cfg.chart.height - cfg.chart.axisPadding)
            .text(function(d, i) {
                var modDays = cfg.xAxis.days;
                if (cfg.xAxis.days === -1) {
                    // Case where we show every day.
                    modDays = bucketedData.length;
                }
                if (bucketedData.length <= 7 ||
                    getBucketedIndex(d) % Math.floor(modDays / 6) === 0) {
                    // Show only about every 7 dates on xAxis.
                    return d.sleep.getMonth() + 1 + '-' + d.sleep.getDate();
                }
            });

        // Y axis text.
        this.chart.selectAll('text.yAxis')
            .data(hourArray(0, 24, 3))
            .enter()
            .append('svg:text')
            .attr('class', 'yAxis')
            .attr('fill', cfg.chart.fontColor)
            .attr('font-size', cfg.chart.fontSize + 'px')
            .attr('x', cfg.chart.axisPadding)
            .attr('y', function(d) {
                return yScale(d) + cfg.chart.fontSize / 2 - 1;
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


    function changeDays(days) {
        cfg.xAxis.days = days;
        refresh();
    }


    function refresh() {
        $(element + ' svg').remove();
        periodBarChart(element, rawData);
    }


    function getBucketedIndex(d) {
        for (var i = 0; i < bucketedData.length; i++) {
            if (ds(d) == ds(bucketedData[i][0])) {
                return i;
            }
        }
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


    function ds(d) {
        return d.sleep.toDateString();
    }


    return {
        'periodBarChart': periodBarChart,
        'changeDays': changeDays,
        'refresh': refresh
    };
};
