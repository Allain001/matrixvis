# 🚀 MatrixVis 部署指南

## 快速部署到 Streamlit Cloud

### 方法一：通过 GitHub 部署（推荐）

#### 1. 创建 GitHub 仓库

```bash
# 在 GitHub 上创建新仓库，然后执行：
git init
git add -A
git commit -m "Initial commit: MatrixVis v1.1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/matrixvis.git
git push -u origin main
```

#### 2. 连接 Streamlit Cloud

1. 访问 [Streamlit Cloud](https://share.streamlit.io)
2. 使用 GitHub 账号登录
3. 点击 "New app"
4. 选择你的仓库和分支
5. 主文件路径填写：`app.py`
6. 点击 "Deploy"

#### 3. 等待部署完成

- 首次部署可能需要 3-5 分钟
- Streamlit Cloud 会自动安装 `requirements.txt` 中的依赖
- 系统依赖会从 `packages.txt` 自动安装

### 方法二：直接上传部署

如果你不想使用 GitHub，可以直接在 Streamlit Cloud 上传文件：

1. 访问 [Streamlit Cloud](https://share.streamlit.io)
2. 点击 "New app"
3. 选择 "Upload files"
4. 上传整个项目文件夹
5. 主文件路径填写：`app.py`
6. 点击 "Deploy"

## 🔧 本地部署

### 环境要求

- Python 3.9 或更高版本
- 至少 2GB 内存（OCR功能需要更多）

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/matrixvis.git
cd matrixvis

# 2. 创建虚拟环境
python -m venv venv

# 3. 激活虚拟环境
# Windows:
venv\\Scripts\\activate
# macOS/Linux:
source venv/bin/activate

# 4. 安装依赖
pip install -r requirements.txt

# 5. 运行应用
streamlit run app.py
```

应用将在 http://localhost:8501 启动

### OCR功能（可选）

如需使用AI识图功能，需要额外安装：

```bash
# 安装 PaddleOCR 和 OpenCV
pip install paddlepaddle paddleocr opencv-python
```

> ⚠️ **注意**：OCR功能在 Streamlit Cloud 上可能不可用，建议在本地使用。

## 📋 部署配置说明

### 文件说明

| 文件 | 用途 |
|------|------|
| `app.py` | 主应用入口 |
| `requirements.txt` | Python 依赖列表 |
| `packages.txt` | 系统依赖（OpenCV等） |
| `.streamlit/config.toml` | Streamlit 配置 |
| `.gitignore` | Git 忽略规则 |

### 系统依赖 (packages.txt)

```
libgl1-mesa-glx      # OpenCV 图形库
libglib2.0-0         # GLib 库
libsm6               # X11 Session Management
libxext6             # X11 扩展库
libxrender-dev       # X11 渲染扩展
libgomp1             # OpenMP 运行时
fonts-noto-cjk       # 中日韩字体
```

## 🔍 故障排除

### 问题1：OpenCV 导入失败

**症状**：`ImportError: libGL.so.1: cannot open shared object file`

**解决**：确保 `packages.txt` 中包含 `libgl1-mesa-glx`

### 问题2：PaddleOCR 无法加载

**症状**：OCR功能显示"不可用"

**解决**：这是正常现象，Streamlit Cloud 不支持 PaddleOCR。如需 OCR，请在本地部署。

### 问题3：内存不足

**症状**：部署失败或运行时崩溃

**解决**：
- 减小矩阵维度（默认最大10维）
- 禁用 OCR 模块
- 升级 Streamlit Cloud 套餐

### 问题4：可视化图表不显示

**症状**：Plotly 图表空白

**解决**：
- 检查网络连接
- 清除浏览器缓存
- 尝试使用其他浏览器

## 🌐 自定义域名

Streamlit Cloud 支持自定义域名：

1. 在 Streamlit Cloud 设置中添加域名
2. 在 DNS 服务商处添加 CNAME 记录
3. 等待 DNS 生效（通常 24-48 小时）

## 📊 性能优化

### 缓存配置

应用已配置以下缓存策略：
- 矩阵运算结果缓存
- 知识图谱数据缓存
- OCR 模型懒加载

### 内存优化

- 限制矩阵最大维度为 10x10
- 可视化最多显示 6 个步骤
- 历史记录最多保留 10 条

## 🔒 安全注意事项

1. **不要在代码中硬编码敏感信息**
2. **使用 Streamlit Secrets 管理密钥**
3. **定期更新依赖包**
4. **启用 GitHub 分支保护**

## 📝 更新日志

### v1.1.0 (2025-03-26)
- ✅ Streamlit Cloud 兼容性优化
- ✅ OCR 功能改为可选模块
- ✅ 添加优雅降级机制
- ✅ 优化依赖版本控制
- ✅ 添加系统依赖配置

### v1.0.0 (2025-03-01)
- 🎉 初始版本发布
- 📊 矩阵运算可视化
- 🤖 AI 识图功能
- 🗺️ 知识图谱导航

## 💡 获取更多帮助

- 📖 [Streamlit 文档](https://docs.streamlit.io)
- 🐛 [提交 Issue](https://github.com/YOUR_USERNAME/matrixvis/issues)
- 💬 [Streamlit 论坛](https://discuss.streamlit.io)

---

**祝您部署顺利！** 🎉
