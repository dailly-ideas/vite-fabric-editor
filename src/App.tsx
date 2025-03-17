import './App.css'
import ImageEditor from './components/ImageEditor'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Image Editor</h1>
        <p>A powerful yet simple tool for editing images right in your browser</p>
        <div className="features">
          <div className="feature">
            <h3>Upload Images</h3>
            <p>Start by uploading your image</p>
          </div>
          <div className="feature">
            <h3>Add Shapes</h3>
            <p>Customize with rectangles and circles</p>
          </div>
          <div className="feature">
            <h3>Export</h3>
            <p>Download your edited image</p>
          </div>
        </div>
      </header>
      <main className="editor-section">
        <h2>Start Editing</h2>
        <ImageEditor />
      </main>
    </div>
  )
}

export default App
