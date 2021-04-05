import React, {useState, useEffect} from "react";
import Canvas_titlebar from "./canvas_title";
import Drawing from "./drawing";


const Canvas = () => {
    return(
        <div style={{backgroundColor:"black", height: "100vw"}}>
        <Canvas_titlebar/>
        <div style={{borderWidth:10,borderColor:"black",padding:100}}>
        <Drawing/>
        </div>
        </div>
    );
};

export default Canvas;
