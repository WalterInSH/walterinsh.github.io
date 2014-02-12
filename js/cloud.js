 cloud = {
  make: function(options) {

    if(options == undefined) options = {}
    if(options.width == undefined) options.width = 300
    if(options.height == undefined) options.height = 300
    if(options.font == undefined) options.font = "Arial"
    if(options.container == undefined) options.container = "body"
    if(options.words == undefined) options.words = [{text: "This", size: 40}, {text: "is", size: 40}, {text: "an", size: 40}, {text: "Example", size: 40}]

    var fill = d3.scale.category20();
  
    d3.layout.cloud().size([options.width, options.height])
    .words(options.words)
    .rotate(function(d) { return ~~(Math.random() * 3) * 45 - 45; })
    .font(options.font)
    .fontSize(function(d) { return d.size; })
    .on("end", function(words) {
      d3.select(options.container).append("svg")
      .attr("width", options.width)
      .attr("height", options.height)
      .append("g")
      .attr("transform", "translate(" + (options.width/2) + "," + (options.height/2) + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", options.font)
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
    })
    .start();
  }
}

cloud.make({
   width: 1000,
   height: 800,
   font: "Helvetica",
   container: "#keyword_cloud",
   words: [
        {text: "Linux", size: 12000},
        {text: "Java", size: 15000},
        {text: "MySQL", size: 10500},
        {text: "Virgo", size: 10000},
        {text: "1990", size: 12000},
        {text: "NUC", size: 9000},
        {text: "Shanghai", size: 11200},
        {text: "JSLC", size: 8000},
        {text: "Chrome", size: 12000},
        {text: "Maven", size: 9800},
        {text: "Github", size: 10300},
        {text: "Spring", size: 11200},
        {text: "MyBatis", size: 10800},
        {text: "Geek", size: 7000},
        {text: "Scrum", size: 10000},
        {text: "HTTP", size: 9300},
        {text: "D3", size: 6800},
        {text: "IDEA", size: 9900},
        {text: "Changzhi", size: 3000},
        {text: "Taiyuan", size: 6000},
        {text: "TDD", size: 5000},
        {text: "Ruby", size: 2500},
        {text: "Python", size: 3100},
        {text: "Daguu", size: 3500},
        {text: "Bootstrap", size: 2100},
        {text: "Bitbucket", size: 3100},
        {text: "stackoverflow", size: 2600},  
        {text: "creative", size: 2300},  
        {text: "reliable", size: 2050}
        ].map(function(d) {return {text: d.text, size: (d.size/100)};})
  })