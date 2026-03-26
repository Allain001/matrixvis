name: Deploy to Streamlit Cloud

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Test imports
      run: |
        python -c "from core.matrix_ops import *; from viz.plotly_charts import *; from utils.latex_export import *; print('All imports successful!')"
    
    - name: Test matrix operations
      run: |
        python -c "
        import numpy as np
        from core.matrix_ops import compute_determinant_lu, compute_inverse_gauss_jordan, compute_eigenvalue_qr
        m = np.array([[4, 7], [2, 6]])
        det = compute_determinant_lu(m)
        inv = compute_inverse_gauss_jordan(m)
        eigen = compute_eigenvalue_qr(m)
        print('Matrix operations test passed!')
        print(f'Determinant: {det[\"value\"]}')
        print(f'Eigenvalues: {eigen[\"values\"]}')
        "

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Streamlit Cloud
      run: |
        echo "🚀 Ready for Streamlit Cloud deployment!"
        echo "Please connect your GitHub repository at: https://share.streamlit.io"
        echo "Repository: ${{ github.repository }}"
