import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Calculator, Grid3X3 } from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('quadratic')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header với thanh điều hướng */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Calculator className="h-8 w-8 text-blue-600" />
              Giải Phương Trình
            </h1>
            
            {/* Thanh điều hướng với 2 nút */}
            <nav className="flex gap-2">
              <Button
                variant={activeTab === 'quadratic' ? 'default' : 'outline'}
                onClick={() => setActiveTab('quadratic')}
                className="flex items-center gap-2 px-6 py-2 transition-all duration-200 hover:scale-105"
              >
                <Calculator className="h-4 w-4" />
                Giải Phương Trình Bậc 2
              </Button>
              
              <Button
                variant={activeTab === 'system' ? 'default' : 'outline'}
                onClick={() => setActiveTab('system')}
                className="flex items-center gap-2 px-6 py-2 transition-all duration-200 hover:scale-105"
              >
                <Grid3X3 className="h-4 w-4" />
                Giải Hệ Phương Trình
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'quadratic' && <QuadraticEquationSolver />}
        {activeTab === 'system' && (() => {
          window.open('http://localhost:5000', '_blank');
          return null; // Không render gì cả, chỉ chuyển hướng
        })()}
      </main>
    </div>
  )
}

// Component giải phương trình bậc 2
function QuadraticEquationSolver() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [result, setResult] = useState(null)

  const solveEquation = () => {
    const numA = parseFloat(a)
    const numB = parseFloat(b)
    const numC = parseFloat(c)

    // Kiểm tra input
    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setResult({ error: 'Vui lòng nhập các hệ số hợp lệ!' })
      return
    }

    if (numA === 0) {
      setResult({ error: 'Hệ số a phải khác 0 để có phương trình bậc 2!' })
      return
    }

    // Tính delta
    const delta = numB * numB - 4 * numA * numC

    if (delta < 0) {
      setResult({
        delta,
        message: 'Phương trình vô nghiệm (delta < 0)',
        solutions: []
      })
    } else if (delta === 0) {
      const x = -numB / (2 * numA)
      setResult({
        delta,
        message: 'Phương trình có nghiệm kép',
        solutions: [x]
      })
    } else {
      const x1 = (-numB + Math.sqrt(delta)) / (2 * numA)
      const x2 = (-numB - Math.sqrt(delta)) / (2 * numA)
      setResult({
        delta,
        message: 'Phương trình có 2 nghiệm phân biệt',
        solutions: [x1, x2]
      })
    }
  }

  const clearForm = () => {
    setA('')
    setB('')
    setC('')
    setResult(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Giải Phương Trình Bậc 2
      </h2>
      
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600 mb-2">Phương trình có dạng:</p>
        <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg inline-block">
          <span className="text-blue-600">a</span>x² + 
          <span className="text-green-600"> b</span>x + 
          <span className="text-purple-600"> c</span> = 0
        </div>
      </div>

      {/* Form nhập liệu */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hệ số a:
          </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="Nhập hệ số a"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hệ số b:
          </label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Nhập hệ số b"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hệ số c:
          </label>
          <input
            type="number"
            value={c}
            onChange={(e) => setC(e.target.value)}
            placeholder="Nhập hệ số c"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Nút điều khiển */}
      <div className="flex gap-4 justify-center mb-8">
        <Button
          onClick={solveEquation}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
        >
          Giải Phương Trình
        </Button>
        
        <Button
          onClick={clearForm}
          variant="outline"
          className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-all duration-200"
        >
          Xóa Dữ Liệu
        </Button>
      </div>

      {/* Kết quả */}
      {result && (
        <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Kết Quả:</h3>
          
          {result.error ? (
            <div className="text-red-600 font-medium">
              ❌ {result.error}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-gray-700">
                <strong>Delta (Δ):</strong> {result.delta}
              </div>
              
              <div className="text-gray-700">
                <strong>Kết luận:</strong> {result.message}
              </div>
              
              {result.solutions.length > 0 && (
                <div className="text-gray-700">
                  <strong>Nghiệm:</strong>
                  <div className="mt-2 space-y-1">
                    {result.solutions.map((solution, index) => (
                      <div key={index} className="bg-white p-3 rounded border font-mono text-lg">
                        x{result.solutions.length > 1 ? index + 1 : ''} = {solution.toFixed(4)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Component placeholder cho hệ phương trình - điều hướng đến cổng mới
function SystemEquationRedirect() {
  const handleRedirect = () => {
    // Mở tab mới với public URL cho chức năng giải hệ phương trình
    window.open('https://5000-ismhim41yrbzzo9lylsy6-02b2d609.manusvm.computer', '_blank')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Giải Hệ Phương Trình Tuyến Tính
      </h2>
      
      <div className="text-gray-600 text-lg mb-8">
        <Grid3X3 className="h-16 w-16 mx-auto mb-4 text-blue-600" />
        <p className="mb-4">Chức năng giải hệ phương trình đã được tách riêng thành một dịch vụ độc lập.</p>
        <p className="mb-6">Click vào nút bên dưới để mở ứng dụng giải hệ phương trình trong tab mới.</p>
      </div>

      <Button
        onClick={handleRedirect}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 text-lg"
      >
        <Grid3X3 className="h-5 w-5 mr-2" />
        Mở Ứng Dụng Giải Hệ Phương Trình
      </Button>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Dịch vụ đang chạy tại một cổng riêng biệt</p>
        <p className="mt-1 text-xs">Powered by Flask Backend API</p>
      </div>
    </div>
  )
}

export default App

