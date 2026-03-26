# 🔢 MatrixVis - 线性代数AI可视化求解系统

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://your-app-url.streamlit.app)

一个基于AI技术的线性代数可视化求解系统，通过**拍题识别** + **过程可视化** + **知识推荐**的三重闭环，帮助大学生高效学习线性代数。

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red.svg)
![NumPy](https://img.shields.io/badge/NumPy-1.24+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ 核心功能

### 1. 多种输入方式
- ✏️ **手动输入**：交互式矩阵编辑器，支持2-10维矩阵
- 📷 **AI识图**：拍照识别手写/印刷矩阵（本地支持）
- 📁 **文件导入**：支持 CSV、Excel、TXT 格式

### 2. 矩阵运算可视化
- 📊 **行列式计算**：LU分解过程可视化
- 🔄 **逆矩阵计算**：高斯-约当消元步骤展示
- ⚡ **特征值计算**：QR迭代算法 + 几何解释
- 📐 **线性方程组**：完整消元过程
- 🔍 **矩阵秩计算**：行最简型展示

### 3. AI学习助手
- 🎓 **智能讲解**：基于规则模板的步骤解释
- 🗺️ **知识图谱**：线性代数知识点关联导航
- 📚 **学习路径**：基于使用习惯智能推荐

### 4. 导出功能
- 📝 LaTeX 报告生成
- 📊 JSON 数据导出
- 📋 CSV 矩阵导出

## 🚀 快速开始

### 在线体验
访问我们的 Streamlit Cloud 部署版本：
👉 [https://your-app-url.streamlit.app](https://your-app-url.streamlit.app)

### 本地安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/matrixvis.git
cd matrixvis

# 创建虚拟环境（推荐）
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# 安装依赖
pip install -r requirements.txt

# 运行应用
streamlit run app.py
```

### OCR功能（可选）
如需使用AI识图功能，需要额外安装：

```bash
pip install paddlepaddle paddleocr opencv-python
```

> ⚠️ **注意**：OCR功能在 Streamlit Cloud 上可能不可用，建议在本地使用。

## 📁 项目结构

```
matrixvis/
├── app.py                 # 主入口文件
├── requirements.txt       # Python依赖
├── packages.txt          # 系统依赖（Streamlit Cloud）
├── README.md             # 项目说明
├── core/                 # 核心算法模块
│   ├── __init__.py
│   └── matrix_ops.py     # 矩阵运算实现
├── ai/                   # AI功能模块
│   ├── __init__.py
│   ├── ocr_engine.py     # OCR识别（可选）
│   ├── knowledge_graph.py # 知识图谱
│   └── smart_tutor.py    # 智能讲解
├── viz/                  # 可视化模块
│   ├── __init__.py
│   └── plotly_charts.py  # Plotly图表
└── utils/                # 工具模块
    ├── __init__.py
    └── latex_export.py   # LaTeX导出
```

## 🛠️ 技术栈

- **前端框架**：Streamlit
- **数值计算**：NumPy, SciPy
- **数据可视化**：Plotly, Matplotlib
- **知识图谱**：NetworkX
- **OCR识别**：PaddleOCR（可选）

## 📝 使用指南

### 基本使用

1. **选择输入方式**：在侧边栏选择手动输入、AI识图或文件导入
2. **输入矩阵**：编辑矩阵数据或上传文件
3. **选择运算**：选择要执行的矩阵运算类型
4. **开始计算**：点击"开始计算"按钮
5. **查看结果**：在"计算过程"和"可视化"标签页查看详细结果

### 矩阵编辑快捷操作

- 🔄 **转置**：矩阵转置
- ➕ **加单位矩阵**：矩阵加上单位矩阵
- ✖️ **乘2**：矩阵乘以2
- 🎲 **随机扰动**：添加随机噪声

## 🎯 算法说明

### LU分解（带部分主元）
```python
# 核心算法
for k in range(n-1):
    # 部分主元选择
    max_idx = argmax(|A[k:, k]|) + k
    # 行交换
    A[[k, max_idx]] = A[[max_idx, k]]
    # 消元
    for i in range(k+1, n):
        L[i, k] = A[i, k] / A[k, k]
        A[i, k:] -= L[i, k] * A[k, k:]
```

### QR迭代算法
```python
# 核心算法
for iter in range(max_iter):
    Q, R = qr(A)
    A = R @ Q
    if off_diagonal(A) < tol:
        break
# 特征值为对角线元素
eigenvalues = diag(A)
```

## 🔧 部署说明

### Streamlit Cloud 部署

1. Fork 本仓库到您的 GitHub 账号
2. 访问 [Streamlit Cloud](https://share.streamlit.io)
3. 连接 GitHub 账号并选择本仓库
4. 点击部署，等待构建完成

### 注意事项

- Streamlit Cloud 上 OCR 功能可能不可用（缺少系统依赖）
- 如需完整功能，建议在本地或 VPS 部署
- 确保 `packages.txt` 中包含必要的系统依赖

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🏆 比赛信息

- **比赛**：2025中国大学生计算机设计大赛
- **团队**：海南师范大学参赛团队
- **作品类别**：软件应用与开发

## 📧 联系我们

如有问题或建议，欢迎通过以下方式联系：

- 邮箱：your-email@example.com
- GitHub Issues：[提交 Issue](https://github.com/yourusername/matrixvis/issues)

---

<p align="center">
  Made with ❤️ by 海南师范大学参赛团队
</p>
