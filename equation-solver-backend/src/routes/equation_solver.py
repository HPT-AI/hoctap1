import numpy as np
from flask import Blueprint, request, jsonify, render_template_string

equation_solver_bp = Blueprint('equation_solver', __name__)

def solve_linear_equations(A, b):
    """
    Giải hệ phương trình tuyến tính Ax = b bằng numpy.linalg.solve.

    Args:
        A (numpy.array): Ma trận hệ số.
        b (numpy.array): Vector vế phải.

    Returns:
        numpy.array: Vector nghiệm x.
        str: Thông báo lỗi nếu có lỗi.
    """
    try:
        x = np.linalg.solve(A, b)
        return x.tolist(), None
    except np.linalg.LinAlgError:
        return None, "Hệ phương trình vô nghiệm hoặc có vô số nghiệm."

@equation_solver_bp.route('/api/solve', methods=['POST'])
def solve_equation():
    """API endpoint để giải hệ phương trình"""
    try:
        data = request.get_json()
        
        if not data or 'matrix' not in data or 'vector' not in data:
            return jsonify({'error': 'Dữ liệu không hợp lệ. Cần có matrix và vector.'}), 400
        
        matrix = np.array(data['matrix'])
        vector = np.array(data['vector'])
        
        # Kiểm tra kích thước
        if matrix.shape[0] != matrix.shape[1]:
            return jsonify({'error': 'Ma trận phải là ma trận vuông.'}), 400
        
        if matrix.shape[0] != len(vector):
            return jsonify({'error': 'Kích thước ma trận và vector không khớp.'}), 400
        
        solution, error = solve_linear_equations(matrix, vector)
        
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify({
            'success': True,
            'solution': solution,
            'message': 'Giải hệ phương trình thành công'
        })
        
    except Exception as e:
        return jsonify({'error': f'Có lỗi xảy ra: {str(e)}'}), 500

@equation_solver_bp.route('/')
def index():
    """Trang chủ của ứng dụng giải hệ phương trình"""
    html_template = """
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giải Hệ Phương Trình Tuyến Tính</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">
                🧮 Giải Hệ Phương Trình Tuyến Tính
            </h1>
            <p class="text-lg text-gray-600">
                Dịch vụ chuyên dụng để giải hệ phương trình dạng Ax = b
            </p>
        </header>

        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kích thước hệ phương trình:
                </label>
                <select id="size" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="2">2x2</option>
                    <option value="3">3x3</option>
                    <option value="4">4x4</option>
                </select>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-3 text-gray-800">Ma trận hệ số A:</h3>
                    <div id="matrix-container" class="grid gap-2">
                        <!-- Ma trận sẽ được tạo động bằng JavaScript -->
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-3 text-gray-800">Vector vế phải b:</h3>
                    <div id="vector-container" class="grid gap-2">
                        <!-- Vector sẽ được tạo động bằng JavaScript -->
                    </div>
                </div>
            </div>

            <div class="flex gap-4 justify-center mt-8">
                <button id="solve-btn" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105">
                    Giải Hệ Phương Trình
                </button>
                <button id="clear-btn" class="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-all duration-200">
                    Xóa Dữ Liệu
                </button>
            </div>

            <div id="result" class="mt-8 hidden">
                <!-- Kết quả sẽ được hiển thị ở đây -->
            </div>
        </div>
    </div>

    <script>
        let currentSize = 2;

        function createMatrix(size) {
            const container = document.getElementById('matrix-container');
            container.innerHTML = '';
            container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
            
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.id = `a${i}${j}`;
                    input.placeholder = `a${i+1}${j+1}`;
                    input.className = 'w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center';
                    input.value = i === j ? '1' : '0'; // Ma trận đơn vị mặc định
                    container.appendChild(input);
                }
            }
        }

        function createVector(size) {
            const container = document.getElementById('vector-container');
            container.innerHTML = '';
            container.style.gridTemplateColumns = '1fr';
            
            for (let i = 0; i < size; i++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.id = `b${i}`;
                input.placeholder = `b${i+1}`;
                input.className = 'w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 text-center';
                input.value = '1'; // Giá trị mặc định
                container.appendChild(input);
            }
        }

        function initializeSystem(size) {
            currentSize = size;
            createMatrix(size);
            createVector(size);
            document.getElementById('result').classList.add('hidden');
        }

        function getMatrixData() {
            const matrix = [];
            for (let i = 0; i < currentSize; i++) {
                const row = [];
                for (let j = 0; j < currentSize; j++) {
                    const value = parseFloat(document.getElementById(`a${i}${j}`).value) || 0;
                    row.push(value);
                }
                matrix.push(row);
            }
            return matrix;
        }

        function getVectorData() {
            const vector = [];
            for (let i = 0; i < currentSize; i++) {
                const value = parseFloat(document.getElementById(`b${i}`).value) || 0;
                vector.push(value);
            }
            return vector;
        }

        function displayResult(data) {
            const resultDiv = document.getElementById('result');
            resultDiv.classList.remove('hidden');
            
            if (data.error) {
                resultDiv.innerHTML = `
                    <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <h3 class="text-lg font-semibold text-red-800 mb-2">Lỗi:</h3>
                        <p class="text-red-700">${data.error}</p>
                    </div>
                `;
            } else {
                let solutionHtml = '';
                data.solution.forEach((value, index) => {
                    solutionHtml += `
                        <div class="bg-white p-3 rounded border font-mono text-lg">
                            x<sub>${index + 1}</sub> = ${value.toFixed(6)}
                        </div>
                    `;
                });
                
                resultDiv.innerHTML = `
                    <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <h3 class="text-lg font-semibold text-green-800 mb-4">Kết Quả:</h3>
                        <div class="space-y-2">
                            ${solutionHtml}
                        </div>
                    </div>
                `;
            }
        }

        async function solveEquation() {
            const matrix = getMatrixData();
            const vector = getVectorData();
            
            try {
                const response = await fetch('/api/solve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ matrix, vector })
                });
                
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                displayResult({ error: 'Có lỗi xảy ra khi gửi yêu cầu: ' + error.message });
            }
        }

        function clearData() {
            initializeSystem(currentSize);
        }

        // Event listeners
        document.getElementById('size').addEventListener('change', (e) => {
            initializeSystem(parseInt(e.target.value));
        });

        document.getElementById('solve-btn').addEventListener('click', solveEquation);
        document.getElementById('clear-btn').addEventListener('click', clearData);

        // Khởi tạo ban đầu
        initializeSystem(2);
    </script>
</body>
</html>
    """
    return render_template_string(html_template)

