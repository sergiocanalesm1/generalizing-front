import * as d3 from 'd3';
import { useMemo } from 'react';
import { useD3 } from '../../../common/hooks/useD3';
import  { domains } from '../../../utils/enums';

/*
function getData(fetchedRelations,fetchedLessons) {
  //create a map that relates domain name with index on json.children.children
  const domainsMap = new Map();
  const data = {
    name:"relations",
    children:[]
  };

  domains.forEach( (domain, index) => {
    domainsMap.set(domain,index);
    data.children.push({
      name:domain,
    });
  });

  //create  a map that relates lesson to index
  const lessonMap = new Map();
  fetchedLessons.forEach( lesson => {
    const jsonDomainIndex = domainsMap.get( lesson.domain );
    if(!Array.isArray( data.children[ jsonDomainIndex ].children)) {
      data.children[ jsonDomainIndex ].children = []
    }
    data.children[ jsonDomainIndex ]?.children?.push({
      name: lesson.name,
      relations: []
    })
    if(data.children[ jsonDomainIndex ].children){
      lessonMap.set( lesson.name, data.children[ jsonDomainIndex ].children.length - 1 );
    }
  })
  fetchedRelations.forEach( relation => {
    let jsonDomainIndex = domainsMap.get( relation.lessons[0].domain );
    let jsonLessonIndex = lessonMap.get( relation.lessons[0].name );
    data.children[ jsonDomainIndex ].children[ jsonLessonIndex ].relations.push( relation.lessons[1].name );

    //jsonDomainIndex = domainsMap( relation.lesson2.domain );
    //jsonLessonIndex = lessonMap( relation.lesson2.name );
    //json.children[ jsonDomainIndex ].children[ jsonLessonIndex ].relations.push( relation.lesson1.name );
  })
  return data;
}
*/

function getData(fetchedRelations){

  /*
  for(let i=0; i<500;i++){
    relations.push({
      source: `domain ${random}`,
      target: `domain ${(random + r(max)) % max}`,
      //value: `relation ${i}`
      value: i
    })
  }
  */
  return fetchedRelations.map( (r,i) => ({
    source: r.lessons[0].domain,
    target: r.lessons[1].domain,
    value: i+1
  }))
}

function getMatrix(dom,data){
  const index = new Map(dom.map((d, i) => [d, i]));
  const matrix  = Array.from(index, () => new Array(dom.length).fill(0));
  for (const {source, target, value} of data) matrix[index.get(source)][index.get(target)] = value;
  return matrix;

}

const width = 954;
const height=width;
const innerRadius = Math.min(width, height) * 0.5 - 90;
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
  

function RelationGraph({ relations, setOpenList }) {
  const data = useMemo(()=>getData(relations),[relations])
  const names = domains;
  const matrix = useMemo(()=>getMatrix(names,data),[names,data])

  const ref = useD3(
    (svg) => {
      const color = d3.scaleOrdinal(names, d3.quantize(d3.interpolateRainbow, names.length));

      svg.attr("viewBox", [-width / 2, -height / 2, width, height]);
      
      const chords = chord(matrix);

      const group = svg.append("g")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif")
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
          .text(d => `${names[d.index]}
    ${d3.sum(chords, c => (c.source.index === d.index) * c.source.value)} outgoing →
    ${d3.sum(chords, c => (c.target.index === d.index) * c.source.value)} incoming ←`);


      svg.append("g")
          .attr("fill-opacity", 0.75)
        .selectAll("path")
        .data(chords)
        .join("path")
          .style("mix-blend-mode", "multiply")
          .attr("fill", d => color(names[d.target.index]))
          .attr("d", ribbon)
        .append("title")
          .text(d => `${names[d.source.index]} → ${names[d.target.index]} ${d.source.value}`);

      svg.selectAll("path")
        .attr("opacity",d=>{
          if( d.value  > 0 ) {
            return relations[d.value-1].user === parseInt(localStorage.getItem('user')?.uuid ) ? 1 :  0.3 //FIX
          }
          return 0.3
        })
        .on("click",(d)=>console.log(relations[d.target.__data__.source.value-1]))
      //d.target.__data__.source.index


    },
    []
  );

  return (
    <svg
      ref={ref}
    >
    </svg>
  );
}

export default RelationGraph;