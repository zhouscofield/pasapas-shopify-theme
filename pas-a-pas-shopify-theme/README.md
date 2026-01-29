# Pas a Pas Shopify Theme

## 品牌信息
- **名称**: Pas a Pas（パ・ア・パ）
- **定位**: Y2K辣妹风女装，面向日本Z世代（18-25岁）
- **风格参考**: Balenciaga - 极简、先锋、高对比度
- **色调**: 纯黑(#000000) + 纯白(#FFFFFF) + 极灰(#F5F5F5)
- **字体**: Inter（Google Fonts），全站强制大写

---

## 文件目录结构

```
pas-a-pas-shopify-theme/
├── layout/
│   ├── theme.liquid          # 主布局，加载字体和全局CSS变量
│   └── password.liquid       # 密码保护页（装修期间用）
├── templates/
│   ├── index.json            # 首页模板
│   ├── product.json          # 产品页模板
│   ├── collection.json       # 集合页模板
│   ├── cart.json             # 购物车页模板
│   ├── page.json             # 静态页面模板
│   └── list-collections.json # 分类列表页
├── sections/
│   ├── header.liquid         # 透明导航栏（滚动变黑）
│   ├── hero.liquid           # 全屏超大字Hero
│   ├── featured-collection.liquid    # 非对称产品网格
│   ├── product-info.liquid   # 产品详情模块
│   ├── product-recommendations.liquid # 推荐产品
│   ├── footer.liquid         # 极简页脚
│   ├── main-cart.liquid      # 购物车页面
│   ├── main-page.liquid      # 静态页面
│   ├── list-collections.liquid       # 分类列表
│   └── collection-header.liquid      # 集合页头部
├── snippets/
│   ├── product-card.liquid   # 产品卡片
│   ├── cart-drawer.liquid    # 侧滑购物车
│   ├── icon-close.liquid     # SVG图标
│   ├── icon-cart.liquid
│   ├── icon-menu.liquid
│   ├── size-guide.liquid     # 尺码表弹窗
│   └── meta-tags.liquid      # Meta标签
├── assets/
│   ├── base.css              # CSS重置+变量定义
│   ├── balenciaga-theme.css  # 主题核心样式
│   └── theme.js              # 交互逻辑
├── config/
│   └── settings_schema.json  # 后台配置面板
└── locales/
    ├── en.json               # 英文
    └── ja.json               # 日文
```

---

## 打包成Shopify主题

### 方法1: 命令行打包

```bash
# 进入主题目录
cd pas-a-pas-shopify-theme

# 创建zip文件（Mac/Linux）
zip -r pas-a-pas-theme.zip . -x "*.DS_Store" -x "__MACOSX/*"

# 或者在Windows上使用PowerShell
Compress-Archive -Path * -DestinationPath pas-a-pas-theme.zip
```

### 方法2: 手动打包

1. 选中主题文件夹内的所有文件和文件夹
2. 右键 → 压缩为ZIP文件
3. 确保ZIP文件内直接包含所有文件夹（不要有多层嵌套）

---

## 上传到Shopify

### 步骤:

1. 登录 Shopify 后台
2. 点击左侧菜单 **Online Store** → **Themes**
3. 在 **Theme library** 区域点击 **Add theme** → **Upload zip file**
4. 选择 `pas-a-pas-theme.zip` 文件
5. 等待上传完成（约30秒-1分钟）
6. 点击 **Publish** 发布主题

### 上传路径:
```
Shopify Admin → Online Store → Themes → Add theme → Upload zip file
```

---

## 上传后必须配置的5个设置项

### 1. 绑定域名
- 路径: **Settings** → **Domains**
- 操作: 添加自定义域名或确认主域名

### 2. 设置货币为JPY（日元）
- 路径: **Settings** → **Store details** → **Store currency**
- 操作: 选择 **Japanese Yen (JPY)**
- 格式设置: ¥XX,XXX（无小数）

### 3. 设置主要市场为日本
- 路径: **Settings** → **Markets**
- 操作: 添加日本市场，设置为主要市场

### 4. 配置税费设置
- 路径: **Settings** → **Taxes and duties**
- 操作: 设置日本消费税（10%）

### 5. 配置配送设置
- 路径: **Settings** → **Shipping and delivery**
- 操作: 
  - 添加日本国内配送选项
  - 设置运费（如：全国一律¥800，满¥10,000免运费）

---

## 如何添加第一个产品测试

### 步骤:

1. 进入 **Products** → **Add product**

2. 填写产品信息:
   - **Title**: 例如 "OVERSIZED HOODIE"
   - **Description**: 产品描述（支持HTML）
   - **Media**: 上传产品图片（建议3:4比例）

3. 设置定价:
   - **Price**: ¥9,900
   - **Compare at price**: ¥12,900（如果有折扣）
   - **Cost per item**: ¥4,000（成本价，可选）

4. 设置库存:
   - **SKU**: PAS-HD-001
   - **Barcode**: （可选）
   - **Quantity**: 50

5. 添加变体（尺码）:
   - 点击 **Add options** → **Size**
   - 添加: S, M, L
   - 为每个尺码设置库存和价格

6. 设置运输:
   - **Weight**: 0.5 kg
   - **HS code**: 6109.10（服装类）

7. 点击 **Save**

8. 在 **Collections** 中创建集合:
   - 创建 "NEW DROP" 集合
   - 将产品添加到集合

---

## 主题配置指南

### 修改Logo文字
- 文件: `sections/header.liquid` 和 `sections/footer.liquid`
- 搜索: `<!-- 修改LOGO文字在这里 -->`
- 修改 `logo_text` 默认值

### 修改主色调
- 文件: `assets/base.css`
- 搜索: `/* 修改主色调在此 */`
- 修改 CSS 变量值

### 修改Hero内容
- 路径: **Online Store** → **Themes** → **Customize**
- 选择 **Hero** 区块
- 可修改:
  - 背景图片/视频
  - 标题文字
  - 副标题
  - 滚动指示器

### 修改产品网格
- 路径: **Online Store** → **Themes** → **Customize**
- 选择 **Featured Collection** 区块
- 可修改:
  - 标题（默认"NEW DROP"）
  - 选择集合
  - 显示数量
  - 列数

---

## 文件清单检查

### 必须存在的文件:

| 文件夹 | 文件名 | 状态 |
|--------|--------|------|
| layout/ | theme.liquid | ✅ |
| layout/ | password.liquid | ✅ |
| templates/ | index.json | ✅ |
| templates/ | product.json | ✅ |
| templates/ | collection.json | ✅ |
| templates/ | cart.json | ✅ |
| templates/ | page.json | ✅ |
| templates/ | list-collections.json | ✅ |
| sections/ | header.liquid | ✅ |
| sections/ | hero.liquid | ✅ |
| sections/ | featured-collection.liquid | ✅ |
| sections/ | product-info.liquid | ✅ |
| sections/ | product-recommendations.liquid | ✅ |
| sections/ | footer.liquid | ✅ |
| sections/ | main-cart.liquid | ✅ |
| sections/ | main-page.liquid | ✅ |
| sections/ | list-collections.liquid | ✅ |
| sections/ | collection-header.liquid | ✅ |
| snippets/ | product-card.liquid | ✅ |
| snippets/ | cart-drawer.liquid | ✅ |
| snippets/ | icon-close.liquid | ✅ |
| snippets/ | icon-cart.liquid | ✅ |
| snippets/ | icon-menu.liquid | ✅ |
| snippets/ | size-guide.liquid | ✅ |
| snippets/ | meta-tags.liquid | ✅ |
| assets/ | base.css | ✅ |
| assets/ | balenciaga-theme.css | ✅ |
| assets/ | theme.js | ✅ |
| config/ | settings_schema.json | ✅ |
| locales/ | en.json | ✅ |
| locales/ | ja.json | ✅ |

---

## 技术架构说明

### Shopify OS 2.0 特性
- **JSON Templates**: 页面结构通过JSON定义，支持可视化拖拽
- **Liquid Sections**: 模块化开发，可在Theme Editor中配置
- **Section Rendering API**: 支持AJAX加载区块
- **App Blocks**: 支持嵌入第三方应用

### 响应式断点
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px  
- **Mobile**: < 768px

### 浏览器支持
- Chrome (最新2个版本)
- Safari (最新2个版本)
- Firefox (最新2个版本)
- Edge (最新2个版本)

---

## 常见问题

### Q: 主题上传后显示错误？
A: 检查:
1. 所有JSON模板文件格式正确
2. settings_schema.json 无语法错误
3. 所有引用的文件都存在

### Q: 购物车不工作？
A: 确保:
1. theme.js 正确加载
2. 产品变体ID正确
3. 浏览器控制台无JavaScript错误

### Q: 字体没有加载？
A: 检查:
1. 网络连接正常
2. Google Fonts 未被防火墙阻止
3. theme.liquid 中字体链接正确

### Q: 如何修改尺码表内容？
A: 编辑 `snippets/size-guide.liquid` 中的表格数据

---

## 联系支持

如有问题，请参考:
- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)
- [Shopify Community Forums](https://community.shopify.com/)

---

**版本**: 1.0.0  
**创建日期**: 2024年  
**作者**: Pas a Pas Team
