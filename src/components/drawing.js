import React,{createRef, useState} from 'react';
import CanvasDraw from "react-canvas-draw";
import {CirclePicker} from "react-color";
import { Button } from "@material-ui/core";
import { useScreenshot, createFileName} from 'use-react-screenshot'

const styles = {
    button: {backgroundColor:"green",
            color:"white",
            position:"absolute",
            left:"40%",
            top:"80%"}
  };

// class Drawing extends Component {
//     state = {
//         brushColor: "pink",
//         width: 1700,
//         height: 600
//     };
//     handleChange = (color,event) => {
//         this.setState({brushColor: color.hex});
//     };
//   render(){
//   return (
//     <div>
//     <CanvasDraw id="canvas" brushColor={this.state.brushColor} canvasWidth={this.state.width} canvasHeight={this.state.height}/>
//     <Button style={styles.button} onClick={async () => {
        
//     }}><h2>Create Merge Request</h2></Button>
//     <CirclePicker color={this.state.brushColor} onChangeComplete={this.handleChange}/>;
//     </div>
//   );
// }
// }

const Drawing =() => {

    const [Color,setColor] = useState(false);
    const ref = createRef(null);
    const width = 1700;
    const height = 600;
    const [image, takeScreenshot] = useScreenshot({
        type: "image/png",
        quality: 1.0
    });
    const download = (image, { name = "new_img", extension = "png" } = {}) => {
        const a = document.createElement("a");
        a.href = image;
        a.download = createFileName(extension, name);
        a.click();
      };
    const getImage = () => takeScreenshot(ref.current).then(download);
      return (
        <div>
        <div ref={ref}>
        <CanvasDraw brushColor={Color} canvasWidth={width} canvasHeight={height}/>
        </div>
        <button style={styles.button} onClick={getImage}><h2>Create Merge Request</h2></button>
        <CirclePicker color="pink" onChangeComplete={(color,event) => setColor(color.hex)}/>;
        </div>
      );
    }

export default Drawing;
