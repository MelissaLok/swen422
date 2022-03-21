// https://observablehq.com/@d3/line-chart@188
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["format_data.csv",new URL("./format_data.csv",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Line Chart

This static time series line chart shows the daily close of Apple stock. Compare to a [log *y*-scale showing change](/@d3/change-line-chart), an [area chart](/@d3/area-chart), a [horizon chart](/@d3/horizon-chart-ii), a [candlestick chart](/@d3/candlestick-chart), and an [index chart](/@d3/index-chart). To inspect values, consider a [tooltip](/@d3/line-chart-with-tooltip).

Data: [Yahoo Finance](https://finance.yahoo.com/lookup)`
)});

main.variable(observer("viewof dataName")).define("viewof dataName", ["html"], function(html){return(
  html`<select>
    <option value="appregistrations">App Registrations</option>
    <option value="qrcodesgenerated">QR Codes Generated</option>
    <option value="registeredbusinesses">Registered Businesses</option>
    <option value="scans">Scans</option>
    <option value="manualentries">Manual Entries</option>
    <option value="activedevices">Active Devices</option>
    <option value="bluetoothActive">BlueTooth Active</option>
    </select>`
  )});
    main.variable(observer("dataName")).define("dataName", ["Generators", "viewof dataName"], (G, _) => G.input(_));

    main.variable(observer("viewof labelStartDate")).define("viewof labelStartDate", ["html"], function(html){return(
      html`
        <label> Start Date </label>`
      )});



    main.variable(observer("viewof startDate")).define("viewof startDate", ["html"], function(html){return(
      html`
        <input type="date" id="dateInput" />`
      )});
        main.variable(observer("startDate")).define("startDate", ["Generators", "viewof startDate"], (G, _) => G.input(_));
        main.variable(observer("viewof labelEndDate")).define("viewof labelEndDate", ["html"], function(html){return(
          html`
            <label> End Date </label>`
          )});
        main.variable(observer("viewof endDate")).define("viewof endDate", ["html"], function(html){return(
          html`
            <input type="date" id="dateInput" />`
          )});
            main.variable(observer("endDate")).define("endDate", ["Generators", "viewof endDate"], (G, _) => G.input(_));

    
   
main.variable(observer("chart")).define("chart", ["d3","DOM","width","height","xAxis","yAxis","data","line","bisect","x","y","callout","formatValue","formatDate"], function(d3,DOM,width,height,xAxis,yAxis,data,line,bisect,x,y,callout,formatValue,formatDate)
            {

  
  // console.log(startDate)
  // console.log(endDate)

  
  const svg = d3.select(DOM.svg(width, height))
  .style("-webkit-tap-highlight-color", "transparent")
  .style("overflow", "visible");

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

      const tooltip = svg.append("g");

  svg.on("touchmove mousemove", function(event) {
    const {date, value} = bisect(d3.pointer(event, this)[0]);

    tooltip
        .attr("transform", `translate(${x(date)},${y(value)})`)
        .call(callout, `${formatValue(value)}
${formatDate(date)}`);
  });

  svg.on("touchend mouseleave", () => tooltip.call(callout, null));

  return svg.node();
}
);

main.variable(observer("callout")).define("callout", function(){return(
  (g, value) => {
    if (!value) return g.style("display", "none");
  
    g
        .style("display", null)
        .style("pointer-events", "none")
        .style("font", "10px sans-serif");
  
    const path = g.selectAll("path")
      .data([null])
      .join("path")
        .attr("fill", "white")
        .attr("stroke", "black");
  
    const text = g.selectAll("text")
      .data([null])
      .join("text")
      .call(text => text
        .selectAll("tspan")
        .data((value + "").split(/\n/))
        .join("tspan")
          .attr("x", 0)
          .attr("y", (d, i) => `${i * 1.1}em`)
          .style("font-weight", (_, i) => i ? null : "bold")
          .text(d => d));
  
    const {x, y, width: w, height: h} = text.node().getBBox();
  
    text.attr("transform", `translate(${-w / 2},${15 - y})`);
    path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
  }
  )});
  main.variable(observer("data")).define("data", ["d3","FileAttachment", "dataName", "startDate", "endDate"], async function(d3,FileAttachment,dataName, startDate, endDate){
    var d = null
    if (dataName == "appregistrations") {
      d = Object.assign((d3.csvParse(await FileAttachment("format_data.csv").text(), d3.autoType)).map(({date, appregistrations}) => ({date: formatingDate(date), value: appregistrations})), {y: "Number"}) 
    } else if (dataName == "qrcodesgenerated") {
      d = Object.assign((d3.csvParse(await FileAttachment("format_data.csv").text(), d3.autoType)).map(({date, qrcodesgenerated}) => ({date: formatingDate(date), value: qrcodesgenerated})), {y: "Number"}) 
    }
    else if (dataName == "registeredbusinesses") {
      d = Object.assign((d3.csvParse(await FileAttachment("format_data.csv").text(), d3.autoType)).map(({date, registeredbusinesses}) => ({date: formatingDate(date), value: registeredbusinesses})), {y: "Number"}) 
    }
    else if (dataName == "scans") {
      d = Object.assign((d3.csvParse(await FileAttachment("format_data.csv").text(), d3.autoType)).map(({date, scans}) => ({date: formatingDate(date), value: scans})), {y: "Number"}) 
    }
    else if (dataName == "manualentries") {
      d = Object.assign((d3.csvParse(await FileAttachment("format_data.csv").text(), d3.autoType)).map(({date, manualentries}) => ({date: formatingDate(date), value: manualentries})), {y: "Number"}) 
    }
    else if (dataName == "activedevices") {
      d = Object.assign((d3.csvParse(await FileAttachment("format_data.csv").text(), d3.autoType)).map(({date, activedevices}) => ({date: formatingDate(date), value: activedevices})), {y: "Number"}) 
    }
    else if (dataName == "bluetoothActive") {
      d = Object.assign((d3.csvParse(await FileAttachment("format_data.csv").text(), d3.autoType)).map(({date, bluetoothActive}) => ({date: formaingtDate(date), value: bluetoothActive})), {y: "Number"}) 
    } else {
    
      d = Object.assign((d3.csvParse(await FileAttachment("format_data.csv").text(), d3.autoType)).map(({date, scans}) => ({date: formatingDate(date), value: scans})), {y: "Number"}) 
    }
    if (startDate == null) {
      startDate = formatingDate("19/05/2020")
    }
    if (endDate == null) {
      endDate = formatingDate("24/08/2021")
    }
    d = d.filter(function(a) {
      return a.date > startDate && a.date < endDate;
    })
    return(
      d
)}
);
  main.variable(observer("line")).define("line", ["d3","x","y"], function(d3,x,y){return(
d3.line()
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y(d => y(d.value))
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data"], function(margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y))
)});
main.variable(observer("formatValue")).define("formatValue", function(){return(
  function formatValue(value) {
    return value.toLocaleString("en", {
      style: "decimal",
    });
  }
  )});
    main.variable(observer("formatDate")).define("formatDate", function(){return(
  function formatDate(date) {
    return date.toLocaleString("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });
  }
  )});
    main.variable(observer("bisect")).define("bisect", ["d3","x","data"], function(d3,x,data)
  {
    const bisect = d3.bisector(d => d.date).left;
    return mx => {
      const date = x.invert(mx);
      const index = bisect(data, date, 1);
      const a = data[index - 1];
      const b = data[index];
      return b && (date - a.date > b.date - date) ? b : a;
    };
  }
  );

  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 30, left: 60}
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
function formatingDate(date)  {
  var ss = date.split("/")
    var day = ss[0];
    var month = ss[1];
    var sy =  ss[2].split(" ")
    var c = new Date(sy[0] + "-" + month + "-" + day)
    return c
}
