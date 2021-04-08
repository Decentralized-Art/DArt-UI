import React, {useState, useEffect} from "react";
import CanvasTitlebar from "./canvas_title";
import Drawing from "./drawing";


const Canvas = (canvasProps) => {
    return(
        <div style={{backgroundColor:"black", height: "100vw"}}>
        <CanvasTitlebar titleProps={canvasProps}/>
        <div style={{border:"2 px solid black",padding:100}}>
        <Drawing drawingProps={canvasProps}/>
        </div>
        </div>
    );
};

export default Canvas;
