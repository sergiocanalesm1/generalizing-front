import { useTheme } from '@emotion/react';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';


const width = 400;
const height = width*0.5;
const c = 10;
    

function ChallengeGraph({ challenge, challengeRelations, setOpenDetail }) {

  const theme = useTheme();

  const d3Ref = useRef()

  useEffect(()=>{
      const svgEl = d3.select(d3Ref.current);
      svgEl.selectAll("*").remove();
      const svg = svgEl.attr("viewBox", [-width / 2, -height / 2, width, height]);


   svg.append("circle")
        .attr('cx', c)
        .attr('cy', c)
        .attr('r', 50)
        .attr("class","circle1")
        //.attr('stroke', 'black')
        .attr('fill', theme.palette.primary.main )
        .on("click",() => {
            setOpenDetail(true);
        })
        .on("mouseover", ()=>{
          d3.selectAll("circle").attr("opacity", 0.5)
        })
        .on("mouseout", ()=>{
          d3.selectAll("circle").attr("opacity", 1)
        })
        ;

        svg.append("text")
            .text(`Challenge ${challenge.id}`)
            .attr("font-family", "HomepageBaukasten, Arial")
            .attr("font-size", 10)
            .attr('stroke', theme.palette.secondary.main )
            .attr('x',c-27)
            .attr('y',c)
            .on("click",() => {
              setOpenDetail(true);
            })  


    },[ challenge, challengeRelations, setOpenDetail ]
  );

  return (
    <svg ref={d3Ref}></svg>
  );
}

export default ChallengeGraph;