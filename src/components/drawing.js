import React,{createRef, useState} from 'react';
import CanvasDraw from "react-canvas-draw";
import {CirclePicker} from "react-color";
import ipfs from "./ipfs";
import { useScreenshot, createFileName} from 'use-react-screenshot'

var fs = require("fs");

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

const Drawing =(props) => {

    const [Color,setColor] = useState(false);
    const ref = createRef(null);
    // console.log(props);
    const width = props.drawingProps.location.canvasProps.width.canvWidth;
    const height = props.drawingProps.location.canvasProps.height.canvHeight;
    const [userHash,setUserHash] = useState(false);
    const [finalHash, setFinalHash] = useState(false);
    const [image, takeScreenshot] = useScreenshot({
        type: "image/png",
        quality: 1.0
    });
    const download = async(image, { name = "new_img", extension = "png" } = {}) => {
        
        console.log(image);
        // let img_name = createFileName(extension,name);
        // let img = new Buffer(image,"base64");
        // var contents = fs.write("new_img.png",img,'utf8');
        // const a = document.createElement("a");
        // a.href = image;
        // a.download = createFileName(extension, name);
        // a.click();
        // const {cid} = await ipfs.add(img);
        
        // await fetch("http://127.0.0.1:5000/push_change",{
        //       method: "GET",
        //       mode:"cors",
        //       headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //       },
        //     }).then(data => data.json())
        //     .then(data => {
        //       setUserHash(data["hash"]);
        //       console.log("new_hash:",data["hash"]);
        //     }).catch(error => console.log(error));
        
        // console.log("userHash:",cid.string);
        // setUserHash(cid.string);
        await fetch("http://127.0.0.1:5000/concat",{
              method: "POST",
              mode:"cors",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "orig_hash": props.drawingProps.location.canvasProps.hash,
                "new_img": image,
                "start": [0,0],
                "end": [height,width]
              })
            }).then(data => data.json())
            .then(data => {
              setFinalHash(data["hash"]);
              console.log(data["hash"]);
            }).catch(error => console.log(error))
        
      };
    const getImage = () => {
        takeScreenshot(ref.current).then(download);
        console.log(width,height);      
        console.log(props.drawingProps.location.canvasProps.hash);  
    };
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
