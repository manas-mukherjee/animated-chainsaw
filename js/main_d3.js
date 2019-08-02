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

window.addEventListener('load', function() {
    console.log('All assets are loaded');
    updateSVG("EA");
})


function updateSVG(slide_name){
	if (typeof window.slide_name == 'undefined') {
    	window.slide_name = slide_name;
	}
	

	// var margin = {top: 10, right: 20, bottom: 100, left: 80},
	//     width = 960 - margin.left - margin.right,
	//     height = 500 - margin.top - margin.bottom;


	var margin = {top: 10, right: 120, bottom: 100, left: 80},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	// var formatPercent = d3.format(".0%");


	var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	    // .innerTickSize(-height)
	    // .outerTickSize(0)
	    // .tickPadding(10);

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

	var msg = "this\
	is a multi\
	line\
	string";
	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<strong>Avg # of commuters :</strong> <span style='color:red'>" + getSlideSpecificColumnValue(d) + "</span>" +
	    "\ <strong>Zone :</strong> <span style='color:red'>" + d.Zone + "</span>";
	  })

	var svg = d3.select("svg")
	    // .attr("width", width + margin.left + margin.right)
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    // .attr("border",1)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Border Path - New
	         //   	var borderPath = svg.append("rect")
       			// .attr("x", 0)
       			// .attr("y", 0)
       			// .attr("height", height)
       			// .attr("width", width)
       			// .style("stroke", "black")
       			// .style("fill", "none")
       			// .style("stroke-width", 1);
// Border Path - New

	svg.call(tip);

	d3.csv("data/4thKingDestination.csv", type, function(error, data) {
	  x.domain(data.map(function(d) { return d.Origin_Name; }));
	  y.domain([0, d3.max(data, function(d) { 
	  	 return getSlideSpecificColumnValue(d);
	  })]);

	var y_new = d3.scale.log().base(2).domain([1, 2048]).range([height, 0]);
	var yAxis_new = d3.svg.axis().scale(y_new)
					.orient("left")
				    .innerTickSize(-width)
				    .outerTickSize(0)
				    .tickPadding(10);


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
	      .attr("fill", function(d) {
		    if (d.Zone === "1") {
		      return "red";
		    } else if (d.Zone === "2") {
		      return "blue";
		    } else if (d.Zone === "3"){
		      return "orange";
		    } else if (d.Zone === "4"){
		      return "green";
		    } else if(d.Zone === "5") {
		      return "violet";
		  	} else if(d.Zone === "6") {
		      return "yellow";
		  	}

		  })
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
	    // .append("text")
	    //   .attr("transform", "rotate(-90)")
	    //   .attr("y", 6)
	    //   .attr("dy", ".71em")
	    //   .style("text-anchor", "end")
	      // .text("Weekly average number of people commuting");

	      // text label for the y axis
	  svg.append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0 - margin.left)
	      .attr("x",0 - (height / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .text("Avg. number(in log) of weekday boardings");        


	  average_ridership_data = function(d) {
	  	// 14.07142857	386.28	34	183.7272727	28.6875	2.965517241
	  	val = 0;
	  	if (slide_name === "EA"){
	  		val = 14.07142857;
	  	}else if (slide_name === "AM"){
	  		val = 386.28;
	  	}else if (slide_name === "MD"){
	  		val = 34;
	  	}else if (slide_name === "PM"){
	  		val = 183.7272727;
	  	}else if(slide_name === "EV"){
	  		val = 28.6875;
	  	}
	  	
	  	return val; 
	  }

	  svg.append('line')
        .style("stroke", "red")
        .style("stroke-width", 3)
        .style("stroke-dasharray","5,5")
        .attr("x1", 0)
        .attr("y1", function(d){return y_new(average_ridership_data(d))})
        .attr("x2", width)
        .attr("y2", function(d){return y_new(average_ridership_data(d))}); 

	  svg.append("text")
	      // .attr("transform", "rotate(-90)")
	      .attr("y", function(d){return y_new(average_ridership_data(d))})
	      .attr("x", width-60)
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .text("Avg commuters"); 

		var annotations = [
		  {
		    "cx": 327,
		    "cy": 200,
		    "r": 20,
		    "text": "A bit high number of commuters at this time. Reason is not known",
		    "textWidth": 200,
		    "textOffset": [
		      0,
		      -50
		    ]
		  },
		  {
		    "cx": 590,
		    "cy": 220,
		    "r": 20,
		    "text": "Because of the International airport and university, this station is always busy",
		    "textWidth": 200,
		    "textOffset": [
		      0,
		      -50
		    ]
		  },
		  {
		    "cx": 430,
		    "cy": 80,
		    "r": 90,
		    "text": "Many tech people stay at Zone3 and commute to the city",
		    "textWidth": 200,
		    "textOffset": [
		      0,
		      -50
		    ]
		  },
		  {
		    "cx": 590,
		    "cy": 100,
		    "r": 20,
		    "text": "Because of the International airport and university, this station is always busy",
		    "textWidth": 200,
		    "textOffset": [
		      0,
		      -50
		    ]
		  },
		  {
		    "cx": 720,
		    "cy": 200,
		    "r": 50,
		    "text": "This is the only time-segment where people commute from Gilroy to SFO(distance ~80 miles)",
		    "textWidth": 200,
		    "textOffset": [
		      -15,
		      -50
		    ]
		  },
		  {
		    "cx": 380,
		    "cy": 150,
		    "r": 25,
		    "text": "University and major software companies keep it busy even in the mid-day.",
		    "textWidth": 200,
		    "textOffset": [
		      0,
		      -50
		    ]
		  },
		  {
		    "cx": 590,
		    "cy": 230,
		    "r": 20,
		    "text": "Because of the International airport and university, this station is always busy",
		    "textWidth": 200,
		    "textOffset": [
		      0,
		      -50
		    ]
		  },
		  {
		    "cx": 430,
		    "cy": 80,
		    "r": 90,
		    "text": "Many people from SFO, work for big companies like FB, Google, Intuit etc.",
		    "textWidth": 200,
		    "textOffset": [
		      0,
		      -50
		    ]
		  },
		  {
		    "cx": 590,
		    "cy": 130,
		    "r": 20,
		    "text": "Because of the International airport and university, this station is always busy",
		    "textWidth": 200,
		    "textOffset": [
		      0,
		      -50
		    ]
		  },
		  {
		    "cx": 430,
		    "cy": 120,
		    "r": 60,
		    "text": "Many people from SFO, work for big companies like FB, Google, Intuit etc.",
		    "textWidth": 200,
		    "textOffset": [
		      -20,
		      -50
		    ]
		  }
		];

	      
	   var ringNote = d3.ringNote().draggable(false);

	   svg.append("g")
	     .attr("class", "annotations")
	     .call(ringNote, function(d) { 
	     	val = null;
		  	if (slide_name === "EA"){
		  		val = annotations.slice(0,2);
		  	}else if (slide_name === "AM"){
		  		val = annotations.slice(2,5);
		  	}else if (slide_name === "MD"){
		  		val = annotations.slice(5,7);
		  	}else if (slide_name === "PM"){
		  		val = annotations.slice(7,9);
		  	}else if(slide_name === "EV"){
		  		val = annotations.slice(9,11);
		  	}
	     	return val;
	     });

		   //  if (d.Zone === "1") {
		   //    return "red";
		   //  } else if (d.Zone === "2") {
		   //    return "blue";
		   //  } else if (d.Zone === "3"){
		   //    return "orange";
		   //  } else if (d.Zone === "4"){
		   //    return "green";
		   //  } else if(d.Zone === "5") {
		   //    return "violet";
		  	// } else if(d.Zone === "6") {
		   //    return "yellow";

		 color_array = ["red", "blue", "orange", "green", "violet", "Maroon"];  
		 zone_array  = ["Zone-1","Zone-2","Zone-3","Zone-4","Zone-5","Zone-6"];

	     //Draw the Rectangle
	     var data = [0, 30, 60, 90, 120, 150];
		 var rectangle = svg.append("g")
                            .attr("transform", "translate("+15+","+0+")")
                            .selectAll("rect")
                            .data(data)
                            .enter()
                            .append("rect")
		                            .attr("x", width)
		                            .attr("y", function(d){return d})
		                            .attr("width", 20)
		                            .attr("height",20)
		                            .attr("border", 1)
		                            .attr("fill", function(d, i) {return color_array[i]; })

		 var text = svg.append("g")
                            .attr("transform", "translate("+60+","+15+")")
                            .selectAll("text")
                            .data(data)
                            .enter()		                            
		                    .append("text")
		                    	  .attr("x", width+20+20 )
							      .attr("y", function(d){return d})
							      // .attr("dy", "0em")
							      .style("text-anchor", "end")
							      .text(function(d, i){return zone_array[i]});  

	});
}

function type(d) {
  // d.AM = +d.AM;
  return d;
}




