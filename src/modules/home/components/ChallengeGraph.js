import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import  { domains } from '../../../utils/enums';
import { filterByDomain } from '../../../utils/filters';


const width = 400;
const height = width*0.5;
const challengeRadius = 100;
const c = 10;
    

function ChallengeGraph({ challenge, challengeRelations, setOpenDetail }) {

  const d3Ref = useRef()

  useEffect(()=>{

      const svgEl = d3.select(d3Ref.current);
      svgEl.selectAll("*").remove();
      const svg = svgEl.attr("viewBox", [-width / 2, -height / 2, width, height]);


   svg.append("circle")
        .attr('cx', c)
        .attr('cy', c)
        .attr('r', 50)
        //.attr('stroke', 'black')
        .attr('fill', '#69a3b2')
        .on("click",() => {
            setOpenDetail(true);
        })
        ;

        svg.append("text")
            .text(`Challenge ${challenge.id}`)
            .attr("font-family", "HomepageBaukasten, Arial")
            .attr("font-size", 10)
            .attr('stroke', 'black')
            .attr('x',c-25)
            .attr('y',c)


    },[ challenge, challengeRelations ]
  );

  return (
    <svg ref={d3Ref}></svg>
  );
}

export default ChallengeGraph;