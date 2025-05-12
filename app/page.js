"use client"

import {useState, useEffect} from "react";

import { Image as KonvaImage } from "react-konva";
import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';
import "konva/lib/shapes/Image";

export default function Home() {

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const [rulerRatio, setRulerRatio] = useState(100);

  const [status, setStatus] = useState("ready")

  const [rulerPositions, setRulerPositions] = useState([])

  const rulerBtnClickHandler = () => {
    setRulerPositions([[0, 0], [0, 0]])
    setStatus("selectingRuler")
  }

  const polygonBtnClickHandler = () => {
    setPolygonPoints([])
    setStatus("selectingPolygon")
  }

  const calculateDistance = (point1, point2) => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  const calculatePolygonArea = (rulerPositions, vertices) => {

    if (rulerPositions.length < 2) {
      alert("Please select ruler with at least 2 points first")
    }

    if (vertices.length < 3) {
      alert("Please select vertices with at least 3 points first")
    }

    let rulerLength = calculateDistance(rulerPositions[0], rulerPositions[1])
    let ratio = Math.pow(100 / rulerLength, 2)

    let area = 0;
    let numPoints = vertices.length;

    for (let i = 0; i < numPoints; i++) {
      let j = (i + 1) % numPoints; // Next vertex (wraps around)
      area += vertices[i].x * vertices[j].y;
      area -= vertices[j].x * vertices[i].y;
    }

    console.log("ruler length", rulerLength)
    console.log("area", area);

    let actualArea = Math.abs(area / 2) * ratio;

    alert(actualArea)
  }

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [polygonPoints, setPolygonPoints] = useState([]);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/p-2.jpeg";
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
      setBackgroundImage(img);
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1"
          onClick={rulerBtnClickHandler}>Ruler</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1"
          onClick={polygonBtnClickHandler}>Polygon</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1"
          onClick={() => calculatePolygonArea(rulerPositions, polygonPoints)}>Calculate Area</button>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Stage width={imageSize.width} height={imageSize.height} onClick={(e) => {
          const stage = e.target.getStage();
          const pointerPos = stage.getPointerPosition();

          console.log(status)
          console.log(rulerPositions)
          if (status == "selectingRuler") {
            let updatedRulerPositions = [...rulerPositions]
            if (rulerPositions.length == 2) {
              updatedRulerPositions = [{ x: pointerPos.x, y: pointerPos.y }]
            } else {
              updatedRulerPositions = [...rulerPositions, { x: pointerPos.x, y: pointerPos.y }]
            }
            setRulerPositions(updatedRulerPositions)
          } else if (status == "selectingPolygon") {
            setPolygonPoints([...polygonPoints, { x: pointerPos.x, y: pointerPos.y }]);
          }

        }}>
          <Layer>
            {backgroundImage && <KonvaImage image={backgroundImage} x={0} y={0} width={imageSize.width} height={imageSize.height} />}
            <Line
              points={rulerPositions.flatMap(p => [p.x, p.y])}
              closed
              stroke="red"
              strokeWidth={2}
              fill="rgba(255,0,0,0.3)"
            />
            <Line
              points={polygonPoints.flatMap(p => [p.x, p.y])}
              closed
              stroke="green"
              strokeWidth={2}
              fill="rgba(255,0,0,0.3)"
            />
          </Layer>
        </Stage>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Copyright by Sonik Global Limited @ 2025
      </footer>
    </div>
  );
}
