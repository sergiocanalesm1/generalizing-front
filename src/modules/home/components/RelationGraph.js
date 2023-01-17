import { useHookstate } from '@hookstate/core';
import * as d3 from 'd3';
import React, { useEffect, useMemo, useRef } from 'react';


import { filterByDomain } from '../../../utils/filters';
import { domainsState, lessonsState,relationsState, relationsToListState } from '../../../globalState/globalState'


function getId(sI,tI){
  return `p${sI}-${tI}`; // P is neccesary because ids must begin with letter
}

const heightConstant = window.innerWidth < 700 ? 1.2 : 0.5;
const width = 945;
const height=width*heightConstant;
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
  

function RelationGraph({ setOpenList, setFilters }) { // Domain blending but, origin blending?

  const relations = useHookstate(relationsState);
  const lessons = useHookstate(lessonsState);
  const domains = useHookstate(domainsState);
  const relationsToList = useHookstate(relationsToListState);

  const data = useMemo(() => {
    let d1; 
    let d2; 
    let sortedDomains = [];
    return Object.keys(relations).map( id => {
      d1 = domains.get()[ lessons.get()[relations.get()[id].lessons[0]].domain ].domain;
      d2 = domains.get()[ lessons.get()[relations.get()[id].lessons[1]].domain ].domain;
    // This gets sorted because it simplifies the filtering by domain
      sortedDomains =  [d1,d2].sort();
  
      return {
        source: sortedDomains[0],
        target: sortedDomains[1],
        value: 1
      }
    })
  },[relations, lessons, domains] )

  const names = useMemo(() => Object.keys(domains.get()).map( id => domains.get()[id].domain ),[domains])

  const matrix = useMemo(()=> {
    const index = new Map(names.map((d, i) => [d, i]));
    const matrix  = Array.from(index, () => new Array(names.length).fill(0));
    for (const {source, target, value} of data) 
      matrix[index.get(source)][index.get(target)] += value;
    return matrix;
  },[names,data])
  
  const d3Ref = useRef();


  useEffect(()=>{
      const isMounted = true;
      if( isMounted ){
        
      const color = d3.scaleOrdinal(names, d3.quantize(d3.interpolateRainbow, names.length));

      const svgEl = d3.select(d3Ref.current);
      svgEl.selectAll("*").remove();
      const svg = svgEl.attr("viewBox", [-width / 2, -height / 2, width, height]);
      
      const chords = chord(matrix);

      const group = svg.append("g")
          .attr("font-family", "HomepageBaukasten, Arial")
          .attr("font-size", window.innerWidth > 700 ? 6 : 12)
          .selectAll("g")
          .data(chords.groups)
          .join("g");

      group.append("path")
          .attr("fill", d => color(names[d.index]))
          .attr("d", arc)
          ;
    
      group.append("text")
          // eslint-disable-next-line no-return-assign
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
            
      const totalRelations = d3.sum(chords, c => (c.source.index === d.index) * c.source.value) + d3.sum(chords, c => (c.target.index === d.index) * c.source.value);

      return `${names[d.index]}
${totalRelations} ${totalRelations > 1 ? "relations" : "relation"}`
  })

      svg.append("g")
          .attr("fill-opacity", 0.7)
          .selectAll("path")
          .data(chords)
          .join("path")
          .style("mix-blend-mode", "multiply")
          .attr("fill", d => color(names[d.target.index]))
          .attr("d", ribbon)
          .attr("id", d => getId(d.source.index,d.target.index))
          .on("click",(e,d)=>{
            const d1 = names[d.source.index];
            const d2 = names[d.target.index];
            relationsToList.set( filterByDomain( relations.get(), lessons.get(), [d1,d2], domains.get() ) ) 
            setFilters(`${d1} and ${d2}`)
            setOpenList(true)
          })
          .on("mouseover",(e,d)=>{
            d3.select(`#${getId(d.source.index,d.target.index)}`).attr("fill-opacity", 0.9)
          })
          .on("mouseout",(e,d)=>{
            d3.select(`#${getId(d.source.index,d.target.index)}`).attr("fill-opacity", 0.7)
          })
          .append("title")
            .text(d => 
`${names[d.source.index]} ⇔ ${names[d.target.index]} 
${d.source.value} ${d.source.value > 1 ? "relations" : "relation"}`)
;}

    },[ relations, lessons, domains, matrix, names, relationsToList, setFilters, setOpenList ]
  );

  return (
    <svg ref={d3Ref} />
  );
}

export default RelationGraph;