import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

interface ImageEditorProps {
  width?: number;
  height?: number;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ width = 800, height = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const staticBackgroundImage = 'https://picsum.photos/800/600';

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#f0f0f0',
      });
      setCanvas(fabricCanvas);

      fabric.Image.fromURL(staticBackgroundImage, (img) => {
        img.scaleToWidth(width);
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
      });

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [width, height]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setBackgroundImage(imgUrl);
        fabric.Image.fromURL(imgUrl, (img) => {
          img.scaleToWidth(width);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const logShapePosition = (obj: fabric.Object) => {
    const boundingRect = obj.getBoundingRect();
    if (obj instanceof fabric.Circle) {
      const scaledRadius = (obj as fabric.Circle).radius * obj.scaleX;
      console.log(`Circle - Position: (${boundingRect.left.toFixed(2)}, ${boundingRect.top.toFixed(2)}), Radius: ${scaledRadius.toFixed(2)}`);
    } else {
      console.log(`Rectangle - Position: (${boundingRect.left.toFixed(2)}, ${boundingRect.top.toFixed(2)}), Size: ${boundingRect.width.toFixed(2)}x${boundingRect.height.toFixed(2)}`);
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on('object:moving', (e) => {
        if (e.target) logShapePosition(e.target);
      });
      canvas.on('object:modified', (e) => {
        if (e.target) logShapePosition(e.target);
      });

      return () => {
        canvas.off('object:moving');
        canvas.off('object:modified');
      };
    }
  }, [canvas]);

  const addShape = (type: 'rect' | 'circle') => {
    if (!canvas) return;

    let shape;
    if (type === 'rect') {
      shape = new fabric.Rect({
        width: 100,
        height: 100,
        fill: 'transparent',
        stroke: '#000000',
        strokeWidth: 2,
        left: 100,
        top: 100,
      });
    } else {
      shape = new fabric.Circle({
        radius: 50,
        fill: 'transparent',
        stroke: '#000000',
        strokeWidth: 2,
        left: 100,
        top: 100,
      });
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    logShapePosition(shape);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const exportCanvas = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });
    const link = document.createElement('a');
    link.download = 'canvas-export.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="image-editor">
      <div className="toolbar">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button onClick={() => addShape('rect')}>Add Rectangle</button>
        <button onClick={() => addShape('circle')}>Add Circle</button>
        <button onClick={deleteSelected}>Delete Selected</button>
        <button onClick={exportCanvas}>Export</button>
      </div>
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default ImageEditor;