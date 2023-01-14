const svgEl = document.getElementById('chart')
const svgWidth = svgEl.getAttribute('width')
const svgHeight = svgEl.getAttribute('height')
const vizPadding = 80
const svg = d3.select('#chart')
const color1 = '#b942f5'
const color2 = '#998711'
const textColor = '#194d30'
const pieRadius = 30
g = svg.append("g").attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
	var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

const describeArc = (x, y, radius, startAngle, endAngle) => {

	var start = polarToCartesian(x, y, radius, endAngle)
	var end = polarToCartesian(x, y, radius, startAngle)

	var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

	var d = [
	    "M", start.x, start.y, 
	    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ")

	return d + `L ${x} ${y} Z`       
}

// when you need to make the slice of the pie chart : 
// describeArc(pieRadius/2, pieRadius/2, pieRadius, 0, (360*percentage))

const data = d3.csvParse(dataset, d => {
	return {
		companyType : d.companyType,
		nCompanies : +d.nCompanies,
		percControlled : +d.percControlled,
		evasion : +d.evasion
	}
})

const xScale = d3.scaleLinear()
	.domain([0, data.length]) // the number of records in the dataset (the bars)
	.range([vizPadding, svgWidth-vizPadding]) // the output range (the size of the svg except the padding)

const yScale = d3.scaleLinear()
	.domain([0, d3.max(data, d => d.evasion)]) // the dataset values' range (from 0 to its max)
	.range([svgHeight - vizPadding, vizPadding])

const yAxis = d3.axisLeft(yScale)
	.ticks(10)
	.tickSize(- (svgWidth - (vizPadding * 2)))

const yTicks = svg
	.append('g')
	.attr('transform', `translate(${vizPadding}, 0)`)
	.call(yAxis)
	
// colouring the ticks
svg
	.selectAll('.tick line')
	.style('stroke', '#D3D3D3')

// colouring the ticks' text
svg
	.selectAll('.tick text')
	.style('color', textColor)

// hiding the vertical ticks' line
svg
	.selectAll('path.domain')
	.style('stroke-width', 0)


	const group = svg
    .selectAll('g.piechart')
    .data(data)
    .enter()
    .append('g')
        .attr('class', 'piechart')
        .attr('transform',(d,i) => `translate(${xScale(i)}, ${yScale(d.evasion)})`)
    

const circles = group
     .append('circle')
         .attr('cx', vizPadding)
         .attr('cy', 0)
         .attr('r',pieRadius)
         .attr('fill',color1) 


const arcs = group
     .append('path')
        .attr('d', d => describeArc((vizPadding), 0, pieRadius, 0, (d.percControlled * 360)))
        .attr('fill', color2)

const textsType = group
    .append('text')
    .text(function(d){ return d.companyType})
    .attr("transform", `translate(${vizPadding}, ${1.5 * pieRadius})`)
    .style("text-anchor", "middle")
    .style("font-size", 14)

const textsPerc = group
    .append('text')
    .text(function(d){ return parseInt(d.percControlled*100) + '%'})
    .attr("transform", `translate(${ pieRadius+ vizPadding}, -20)`)

var legenda = d3.select("#my_dataviz")

// Handmade legend
legenda.append("text").attr("x", 30).attr("y", 20).text("Legenda").style("font-size", "15px").attr("alignment-baseline","middle").style("font-weight", "bold")
legenda.append("circle").attr("cx",50).attr("cy",60).attr("r", 6).style("fill", color2)
legenda.append("circle").attr("cx",50).attr("cy",80).attr("r", 6).style("fill", color1)
legenda.append("text").attr("x", 60).attr("y", 60).text("Percentuale delle aziende controllate").style("font-size", "15px").attr("alignment-baseline","middle")
legenda.append("text").attr("x", 60).attr("y", 80).text("Percentuale delle aziende non controllate").style("font-size", "15px").attr("alignment-baseline","middle")
console.log(data)

/*END*/