function updateData(name) {
	window.slide_name = name;
	// https://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
	$("#only_svg").empty();
	updateSVG(name);
	// alert(name);
}

function getSlideSpecificColumnValue(d){
		val = 0;
	  	if (slide_name === "EA"){
	  		val = parseInt(d.EA);
	  	}else if (slide_name === "AM"){
	  		val = parseInt(d.AM);
	  	}else if (slide_name === "MD"){
	  		val = parseInt(d.MD);
	  	}else if (slide_name === "PM"){
	  		val = parseInt(d.PM);
	  	}else if(slide_name === "EV"){
	  		val = parseInt(d.EV);
	  	}
	  	
	  	return val; 
}

updateSVG("EA");

function updateSVG(slide_name){
	if (typeof window.slide_name == 'undefined') {
    	window.slide_name = slide_name;
	}
	

	var margin = {top: 40, right: 20, bottom: 110, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	// var formatPercent = d3.format(".0%");


	var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var y = d3.scale.linear().domain([0, 100]).range([height, 0]);
	// var yScale = d3.scale.linear().domain([0, 100]).range([height - padding, padding]);


	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("right")
	    // .tickFormat(formatPercent);

	//Draw a grid
	var numberOfTicks = 6;

	var yAxisGrid = yAxis.ticks(numberOfTicks)
	    .tickSize(width, 0)
	    .tickFormat("")
	    .orient("right");


	d3.select("svg").append("g")
	    .classed('y', true)
	    .classed('grid', true)
	    .call(yAxisGrid);
	//Draw a grid

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<strong>Frequency:</strong> <span style='color:red'>" + getSlideSpecificColumnValue(d) + "</span>";
	  })

	var svg = d3.select("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	d3.csv("data/4thKingDestination.csv", type, function(error, data) {
	  x.domain(data.map(function(d) { return d.Origin_Name; }));
	  y.domain([0, d3.max(data, function(d) { 
	  	 return getSlideSpecificColumnValue(d);
	  })]);

	var y_new = d3.scale.log().base(2).domain([1, 2048]).range([height, 0]);
	var yAxis_new = d3.svg.axis().scale(y_new).orient("right")


	yAxis_new.scale(y_new).tickFormat(function (d) {
        return y_new.tickFormat(4,d3.format(",d"))(d)
	})


	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.Origin_Name); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y_new(getSlideSpecificColumnValue(d)); 
	  	  })
	      .attr("height", function(d) { return height - y_new(parseInt(getSlideSpecificColumnValue(d))); })
	      .on('mouseover', tip.show)
	      .on('mouseout', tip.hide)

	  // Axis
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	  .selectAll("text")
	    .attr("y", 0)
	    .attr("x", 1)
	    .attr("dx", "0.8em")
	    .attr("dy", ".30em")
	    .attr("transform", "rotate(90)")
	    .style("text-anchor", "start");

	  svg.append("g")
	      .attr("class", "y axis")
	      // .call(d3.axisLeft(y))
	      .call(yAxis_new)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      // .text("Weekly average number of people commuting");


	});

}

function type(d) {
  // d.AM = +d.AM;
  return d;
}


