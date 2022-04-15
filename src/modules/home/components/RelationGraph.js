import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import  { domains } from '../../../utils/enums';
import { filterByDomain } from '../../../utils/filters';


function getId(sI,tI){
  return `p${sI}-${tI}`; //p is neccesary because ids must begin with letter
}

function getData(fetchedRelations){

  return fetchedRelations.map( (r,i) => {
    //this gets sorted because it simplifies the filtering by domain
    const d1 = r.lessons[0].domain;
    const d2 = r.lessons[1].domain;
    const sortedDomains =  [d1,d2].sort();
    return {
      source: sortedDomains[0],
      target: sortedDomains[1],
      value: 1
    }
  })
}

function getMatrix(dom,data){
  const index = new Map(dom.map((d, i) => [d, i]));
  const matrix  = Array.from(index, () => new Array(dom.length).fill(0));
  for (const {source, target, value} of data) matrix[index.get(source)][index.get(target)] += value;
  return matrix;

}

const width = 945;
const height=width*0.5;
const innerRadius = Math.min(width, height) * 0.3;
const outerRadius = innerRadius + 10;


const chord = d3.chord()
  .padAngle(10 / innerRadius)
  .sortSubgroups(d3.descending)
  .sortChords(d3.descending)
const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius);
const ribbon = d3.ribbonArrow()
  .radius(innerRadius - 1)
  .padAngle(1 / innerRadius);
  

function RelationGraph({ relations, setOpenList, setRelationsToShow, setFilters }) {
  const data = useMemo(()=>getData(relations),[relations])
  const names = domains;
  const matrix = useMemo(()=>getMatrix(names,data),[names,data])


  const d3Ref = useRef()

  useEffect(()=>{
      const color = d3.scaleOrdinal(names, d3.quantize(d3.interpolateRainbow, names.length));

      const svgEl = d3.select(d3Ref.current);
      svgEl.selectAll("*").remove();
      const svg = svgEl.attr("viewBox", [-width / 2, -height / 2, width, height]);
      
      const chords = chord(matrix);

      const group = svg.append("g")
          .attr("font-family", "HomepageBaukasten, Arial")
          .attr("font-size", 6)
          .selectAll("g")
          .data(chords.groups)
          .join("g");

      group.append("path")
          .attr("fill", d => color(names[d.index]))
          .attr("d", arc)
          ;
    
      group.append("text")
          .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
          .attr("dy", "0.35em")
          .attr("transform", d => `
            rotate(${(d.angle * 180 / Math.PI - 90)})
            translate(${outerRadius + 5})
            ${d.angle > Math.PI ? "rotate(180)" : ""}
          `)
          .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
          .text(d => names[d.index])
          ;
    
      group.append("title")
          .text(d => {
const total_relations = d3.sum(chords, c => (c.source.index === d.index) * c.source.value) + d3.sum(chords, c => (c.target.index === d.index) * c.source.value);
return `${names[d.index]}
${total_relations} ${total_relations > 1 ? "relations" : "relation"}`
})

      svg.append("g")
          .attr("fill-opacity", 0.75)
          .selectAll("path")
          .data(chords)
          .join("path")
          .style("mix-blend-mode", "multiply")
          .attr("fill", d => color(names[d.target.index]))
          .attr("d", ribbon)
          .attr("id", d => getId(d.source.index,d.target.index))
          .on("click",(e,d)=>{
            const d1 = domains[d.source.index];
            const d2 = domains[d.target.index];
            setRelationsToShow(filterByDomain(relations,[d1,d2]))
            setFilters(`${d1} and ${d2}`)
            setOpenList(true)
          })
          .on("mouseover",(e,d)=>{
            d3.select(`#${getId(d.source.index,d.target.index)}`).attr("fill-opacity", 1)
          })
          .on("mouseout",(e,d)=>{
            d3.select(`#${getId(d.source.index,d.target.index)}`).attr("fill-opacity", 0.75)
          })
          .append("title")
            .text(d => 
`${names[d.source.index]} ⇔ ${names[d.target.index]} 
${d.source.value} ${d.source.value > 1 ? "relations" : "relation"}`)
;

    },[ relations, matrix, names, setFilters, setOpenList, setRelationsToShow ]
  );

  return (
    <svg ref={d3Ref}></svg>
  );
}

export default RelationGraph;