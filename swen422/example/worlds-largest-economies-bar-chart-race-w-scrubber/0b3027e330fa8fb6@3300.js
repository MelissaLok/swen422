// https://observablehq.com/@talyellin/worlds-largest-economies-bar-chart-race-w-scrubber@3300
import define1 from "./450051d7f1174df8@254.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["countries-final.csv", new URL("./files/29f6b06f7918618405bfed0554c0c5a62a3e471351f2f34d0c99c4aa2de74b96a4988f38cf0c62d58db699891b0312c3869e5b8c2cec6b6299df199afa53a752", import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`# World's largest economies (bar chart race w/ scrubber)`
    )
  });
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`This chart animates the value in billions (USD) of the world's economies from 1980 to 2024 (estimates). 
Data: IMF`
    )
  });
  main.variable(observer("viewof keyframe")).define("viewof keyframe", ["Scrubber", "keyframes", "formatDate", "duration"], function (Scrubber, keyframes, formatDate, duration) {
    return (
      Scrubber(keyframes, {
        format: ([date]) => formatDate(date),
        delay: duration,
        loop: false
      })
    )
  });
  main.variable(observer("keyframe")).define("keyframe", ["Generators", "viewof keyframe"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3", "width", "height", "bars", "axis", "labels", "ticker", "invalidation", "duration", "x"], function (d3, width, height, bars, axis, labels, ticker, invalidation, duration, x) {
    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);


    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);

    invalidation.then(() => svg.interrupt());

    return Object.assign(svg.node(), {
      update(keyframe) {
        const transition = svg.transition()
          .duration(duration)
          .ease(d3.easeLinear);

        // Extract the top bar’s value.
        x.domain([0, keyframe[1][0].value]);

        updateAxis(keyframe, transition);
        updateBars(keyframe, transition);
        updateLabels(keyframe, transition);
        updateTicker(keyframe, transition);
      }
    });
  }
  );
  main.variable(observer()).define(["chart", "keyframe"], function (chart, keyframe) {
    return (
      chart.update(keyframe)
    )
  });
  main.variable(observer("data")).define("data", ["d3", "FileAttachment"], async function (d3, FileAttachment) {
    return (
      d3.csvParse(await FileAttachment("countries-final.csv").text(), d3.autoType)
    )
  });
  main.variable(observer("n")).define("n", function () {
    return (
      12
    )
  });
  main.variable(observer("duration")).define("duration", function () {
    return (
      175
    )
  });
  main.variable(observer("names")).define("names", ["data"], function (data) {
    return (
      new Set(data.map(d => d.name))
    )
  });
  main.variable(observer("datevalues")).define("datevalues", ["d3", "data"], function (d3, data) {
    return (
      Array.from(d3.rollup(data, ([d]) => d.value, d => +d.date, d => d.name))
        .map(([date, data]) => [new Date(date), data])
        .sort(([a], [b]) => d3.ascending(a, b))
    )
  });
  main.variable(observer("rank")).define("rank", ["names", "d3", "n"], function (names, d3, n) {
    return (
      function rank(value) {
        const data = Array.from(names, name => ({ name, value: value(name) || 0 }));
        data.sort((a, b) => d3.descending(a.value, b.value));
        for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
        return data;
      }
    )
  });
  main.variable(observer("k")).define("k", function () {
    return (
      10
    )
  });
  main.variable(observer("keyframes")).define("keyframes", ["d3", "datevalues", "k", "rank"], function (d3, datevalues, k, rank) {
    const keyframes = [];
    let ka, a, kb, b;
    for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
      for (let i = 0; i < k; ++i) {
        const t = i / k;
        keyframes.push([
          new Date(ka * (1 - t) + kb * t),
          rank(name => a.get(name) * (1 - t) + b.get(name) * t)
        ]);
      }
    }
    keyframes.push([new Date(kb), rank(name => b.get(name))]);
    return keyframes;
  }
  );
  main.variable(observer("nameframes")).define("nameframes", ["d3", "keyframes"], function (d3, keyframes) {
    return (
      d3.groups(keyframes.flatMap(([, data]) => data), d => d.name)
    )
  });
  main.variable(observer("bars")).define("bars", ["n", "color", "y", "x"], function (n, color, y, x) {
    return (
      function bars(svg) {
        let bar = svg.append("g")
          .attr("fill-opacity", 0.6)
          .selectAll("rect");

        return ([date, data], transition) => bar = bar
          .data(data.slice(0, n), d => d.name)
          .join(
            enter => enter.append("rect")
              .attr("class", d => d.name)
              .attr("fill", color)
              .attr("height", y.bandwidth())
              .attr("x", x(0))
              .attr("y", y(n))
              .attr("width", d => x(d.value) - x(0)),
            update => update,
            exit => exit.transition(transition).remove()
              .attr("y", y(n))
              .attr("width", d => x(d.value) - x(0))
          )
          .call(bar => bar.transition(transition)
            .attr("y", d => y(d.rank))
            .attr("width", d => x(d.value) - x(0)));
      }
    )
  });
  main.variable(observer("labels")).define("labels", ["n", "x", "y", "textTween", "parseNumber"], function (n, x, y, textTween, parseNumber) {
    return (
      function labels(svg) {
        let label = svg.append("g")
          .style("font", "bold 12px var(--sans-serif)")
          .style("font-variant-numeric", "tabular-nums")
          .attr("text-anchor", "end")
          .selectAll("text");

        return ([date, data], transition) => label = label
          .data(data.slice(0, n), d => d.name)
          .join(
            enter => enter.append("text")
              .attr("transform", d => `translate(${x(d.value)},${y(n)})`)
              .attr("y", y.bandwidth() / 2)
              .attr("x", -6)
              .attr("dy", "-0.25em")
              .text(d => d.name)
              .call(text => text.append("tspan")
                .attr("fill-opacity", 0.7)
                .attr("font-weight", "normal")
                .attr("x", -6)
                .attr("dy", "1.15em")),
            update => update,
            exit => exit.transition(transition).remove()
              .attr("transform", d => `translate(${x(d.value)},${y(n)})`)
          )
          .call(bar => bar.transition(transition)
            .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
            .call(g => g.select("tspan").tween("text", function (d) {
              return textTween(parseNumber(this.textContent), d.value);
            })));
      }
    )
  });
  main.variable(observer("textTween")).define("textTween", ["d3", "formatNumber"], function (d3, formatNumber) {
    return (
      function textTween(a, b) {
        const i = d3.interpolateNumber(a, b);
        return function (t) {
          this.textContent = formatNumber(i(t));
        };
      }
    )
  });
  main.variable(observer("parseNumber")).define("parseNumber", function () {
    return (
      string => +string.replace(/,/g, "")
    )
  });
  main.variable(observer("formatNumber")).define("formatNumber", ["d3"], function (d3) {
    return (
      d3.format(",d")
    )
  });
  main.variable(observer("tickFormat")).define("tickFormat", ["formatNumber"], function (formatNumber) {
    return (
      function tickFormat(d) {
        return "$" + formatNumber(d);
      }
    )
  });
  main.variable(observer("axis")).define("axis", ["margin", "d3", "x", "width", "tickFormat", "barSize", "n", "y"], function (margin, d3, x, width, tickFormat, barSize, n, y) {
    return (
      function axis(svg) {
        const g = svg.append("g")
          .attr("transform", `translate(0,${margin.top})`);

        const axis = d3.axisTop(x)
          .ticks(width / 160)
          .tickFormat(tickFormat)
          .tickSizeOuter(0)
          .tickSizeInner(-barSize * (n + y.padding()));

        return (_, transition) => {
          g.transition(transition).call(axis);
          g.select(".tick:first-of-type text").remove();
          g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
          g.select(".domain").remove();
        };
      }
    )
  });
  main.variable(observer("ticker")).define("ticker", ["barSize", "width", "margin", "n", "formatDate", "keyframes"], function (barSize, width, margin, n, formatDate, keyframes) {
    return (
      function ticker(svg) {
        const now = svg.append("text")
          .style("font", `bold ${barSize}px var(--sans-serif)`)
          .style("font-variant-numeric", "tabular-nums")
          .attr("text-anchor", "end")
          .attr("x", width - 6)
          .attr("y", margin.top + barSize * (n - 0.45))
          .attr("dy", "0.32em")
          .text(formatDate(keyframes[0][0]));

        return ([date], transition) => {
          transition.end().then(() => now.text(formatDate(date)));
        };
      }
    )
  });
  main.variable(observer("formatDate")).define("formatDate", ["d3"], function (d3) {
    return (
      d3.utcFormat("%Y")
    )
  });
  main.variable(observer("color")).define("color", function () {
    //const scale = d3.scaleOrdinal(['#000', '#bbb', '#cc0000']);
    //if (data.some(d => d.category !== undefined)) {
    //  const categoryByName = new Map(data.map(d => [d.name, d.category]))
    //  scale.domain(Array.from(categoryByName.values()));
    //  return d => scale(categoryByName.get(d.name));
    //}
    //return d => scale(d.name);
    return '#ccc';
  }
  );
  main.variable(observer("x")).define("x", ["d3", "margin", "width"], function (d3, margin, width) {
    return (
      d3.scaleLinear([0, 1], [margin.left, width - margin.right])
    )
  });
  main.variable(observer("y")).define("y", ["d3", "n", "margin", "barSize"], function (d3, n, margin, barSize) {
    return (
      d3.scaleBand()
        .domain(d3.range(n + 1))
        .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
        .padding(0.1)
    )
  });
  main.variable(observer("height")).define("height", ["margin", "barSize", "n"], function (margin, barSize, n) {
    return (
      margin.top + barSize * n + margin.bottom
    )
  });
  main.variable(observer("barSize")).define("barSize", function () {
    return (
      40
    )
  });
  main.variable(observer("margin")).define("margin", function () {
    return (
      { top: 16, right: 6, bottom: 6, left: 0 }
    )
  });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("d3@5", "d3-array@2")
    )
  });
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  return main;
}
