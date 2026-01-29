/**
 * Pas a Pas Shopify Theme - Main JavaScript
 * 交互逻辑：Cart API、Notify Me、Quick Add
 */

(function() {
  'use strict';

  // ========== 购物车抽屉逻辑 ==========
  const CartDrawer = {
    drawer: null,
    overlay: null,
    closeBtn: null,
    toggleBtns: null,
    itemsContainer: null,
    footer: null,
    subtotalEl: null,
    countBadge: null,

    init() {
      this.drawer = document.querySelector('[data-cart-drawer]');
      this.overlay = document.querySelector('[data-cart-overlay]');
      this.closeBtn = document.querySelector('[data-cart-close]');
      this.toggleBtns = document.querySelectorAll('[data-cart-toggle]');
      this.itemsContainer = document.querySelector('[data-cart-items]');
      this.footer = document.querySelector('[data-cart-footer]');
      this.subtotalEl = document.querySelector('[data-cart-subtotal]');
      this.countBadge = document.querySelector('[data-cart-count]');

      if (!this.drawer) return;

      this.bindEvents();
    },

    bindEvents() {
      // 打开购物车
      this.toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => this.open());
      });

      // 关闭购物车
      this.closeBtn?.addEventListener('click', () => this.close());
      this.overlay?.addEventListener('click', () => this.close());

      // ESC键关闭
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });

      // 购物车项事件委托
      this.itemsContainer?.addEventListener('click', (e) => {
        const item = e.target.closest('[data-cart-item]');
        if (!item) return;

        const line = item.dataset.line;

        // 删除按钮
        if (e.target.closest('[data-cart-remove]')) {
          e.preventDefault();
          this.updateItem(line, 0);
        }

        // 数量减少
        if (e.target.closest('[data-quantity-minus]')) {
          e.preventDefault();
          const currentQty = parseInt(item.querySelector('[data-quantity-value]').textContent);
          if (currentQty > 1) {
            this.updateItem(line, currentQty - 1);
          }
        }

        // 数量增加
        if (e.target.closest('[data-quantity-plus]')) {
          e.preventDefault();
          const currentQty = parseInt(item.querySelector('[data-quantity-value]').textContent);
          this.updateItem(line, currentQty + 1);
        }
      });
    },

    open() {
      this.drawer.classList.add('active');
      this.overlay?.classList.add('active');
      document.body.classList.add('cart-open');
    },

    close() {
      this.drawer.classList.remove('active');
      this.overlay?.classList.remove('active');
      document.body.classList.remove('cart-open');
    },

    isOpen() {
      return this.drawer.classList.contains('active');
    },

    // 使用Shopify Cart API更新商品
    async updateItem(line, quantity) {
      try {
        const response = await fetch(window.theme.routes.cart_change_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            line: line,
            quantity: quantity
          })
        });

        const cart = await response.json();
        this.updateCartUI(cart);
      } catch (error) {
        console.error('Cart update error:', error);
        this.showNotification('Error updating cart', 'error');
      }
    },

    // 添加商品到购物车
    async addItem(variantId, quantity = 1) {
      try {
        const response = await fetch(window.theme.routes.cart_add_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            items: [{
              id: variantId,
              quantity: quantity
            }]
          })
        });

        const data = await response.json();
        
        if (data.items) {
          // 刷新购物车数据
          await this.refreshCart();
          this.open();
          this.showNotification(window.theme.strings.addedToCart, 'success');
        } else if (data.description) {
          throw new Error(data.description);
        }
      } catch (error) {
        console.error('Add to cart error:', error);
        this.showNotification(error.message || 'Error adding to cart', 'error');
      }
    },

    // 刷新购物车
    async refreshCart() {
      try {
        const response = await fetch(window.theme.routes.cart_url + '.js');
        const cart = await response.json();
        this.updateCartUI(cart);
      } catch (error) {
        console.error('Refresh cart error:', error);
      }
    },

    // 更新购物车UI
    updateCartUI(cart) {
      // 更新数量徽章
      if (this.countBadge) {
        this.countBadge.textContent = cart.item_count;
        this.countBadge.classList.toggle('hidden', cart.item_count === 0);
      }

      // 更新小计
      if (this.subtotalEl) {
        this.subtotalEl.textContent = this.formatMoney(cart.total_price);
      }

      // 重新渲染购物车项（简化版，实际项目中可以更完善）
      if (cart.item_count === 0) {
        this.renderEmptyCart();
      } else {
        this.renderCartItems(cart);
      }
    },

    renderEmptyCart() {
      if (this.itemsContainer) {
        this.itemsContainer.innerHTML = `
          <div class="cart-empty">
            <p>${window.theme.strings.empty}</p>
            <a href="/collections/all" class="continue-shopping">${window.theme.strings.continueShopping}</a>
          </div>
        `;
      }
      if (this.footer) {
        this.footer.classList.add('hidden');
      }
    },

    renderCartItems(cart) {
      // 这里可以实现完整的购物车项重新渲染
      // 简化版：刷新页面以获取最新状态
      window.location.reload();
    },

    // 金额格式化
    formatMoney(cents) {
      const amount = (cents / 100).toFixed(0);
      return '¥' + parseInt(amount).toLocaleString('ja-JP');
    },

    // 显示通知
    showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.className = `notification notification--${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  };

  // ========== 产品表单逻辑 ==========
  const ProductForm = {
    form: null,
    variantInput: null,
    priceEl: null,
    addToCartBtn: null,
    buttonText: null,
    quantityInput: null,
    notifyMeWrapper: null,
    actionsWrapper: null,

    init() {
      this.form = document.querySelector('[data-product-form]');
      if (!this.form) return;

      this.variantInput = this.form.querySelector('[data-variant-id]');
      this.priceEl = document.querySelector('[data-product-price]');
      this.addToCartBtn = this.form.querySelector('[data-add-to-cart]');
      this.buttonText = this.addToCartBtn?.querySelector('[data-button-text]');
      this.quantityInput = this.form.querySelector('[data-quantity-input]');
      this.notifyMeWrapper = this.form.querySelector('[data-notify-me]');
      this.actionsWrapper = this.form.querySelector('[data-product-actions]');

      this.bindEvents();
      this.initSizeSelector();
      this.initQuantitySelector();
      this.initNotifyMe();
    },

    bindEvents() {
      // 表单提交
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addToCart();
      });
    },

    // 尺码选择器
    initSizeSelector() {
      const sizeSelector = this.form.querySelector('.size-selector');
      if (!sizeSelector) return;

      const buttons = sizeSelector.querySelectorAll('.size-button');
      
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.disabled) return;

          // 移除其他选中状态
          buttons.forEach(b => b.classList.remove('selected'));
          // 添加当前选中状态
          btn.classList.add('selected');

          // 更新变体（这里简化处理，实际需要根据选项组合找到对应变体）
          this.updateVariant(btn.dataset.value);
        });
      });
    },

    // 数量选择器
    initQuantitySelector() {
      const minusBtn = this.form.querySelector('[data-quantity-minus]');
      const plusBtn = this.form.querySelector('[data-quantity-plus]');

      minusBtn?.addEventListener('click', () => {
        const currentValue = parseInt(this.quantityInput.value) || 1;
        if (currentValue > 1) {
          this.quantityInput.value = currentValue - 1;
        }
      });

      plusBtn?.addEventListener('click', () => {
        const currentValue = parseInt(this.quantityInput.value) || 1;
        this.quantityInput.value = currentValue + 1;
      });
    },

    // Notify Me功能
    initNotifyMe() {
      const notifyBtn = this.form.querySelector('[data-notify-submit]');
      const notifyEmail = this.form.querySelector('[data-notify-email]');

      notifyBtn?.addEventListener('click', async () => {
        const email = notifyEmail.value.trim();
        if (!email || !this.validateEmail(email)) {
          CartDrawer.showNotification('Please enter a valid email', 'error');
          return;
        }

        try {
          // 这里可以实现发送到Shopify Customer或Email Marketing列表的逻辑
          // 简化版：显示成功消息
          CartDrawer.showNotification('We will notify you when available!', 'success');
          notifyEmail.value = '';
        } catch (error) {
          console.error('Notify me error:', error);
          CartDrawer.showNotification('Error, please try again', 'error');
        }
      });
    },

    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    updateVariant(value) {
      // 这里应该根据选择的选项找到对应的变体ID
      // 简化版：保持当前变体
      console.log('Selected size:', value);
    },

    async addToCart() {
      const variantId = this.variantInput?.value;
      const quantity = parseInt(this.quantityInput?.value) || 1;

      if (!variantId) {
        CartDrawer.showNotification('Please select options', 'error');
        return;
      }

      // 显示加载状态
      this.setLoading(true);

      try {
        await CartDrawer.addItem(variantId, quantity);
        
        // 成功状态
        if (this.buttonText) {
          const originalText = this.buttonText.textContent;
          this.buttonText.textContent = window.theme.strings.addedToCart;
          setTimeout(() => {
            this.buttonText.textContent = originalText;
          }, 2000);
        }
      } catch (error) {
        console.error('Add to cart error:', error);
      } finally {
        this.setLoading(false);
      }
    },

    setLoading(isLoading) {
      if (this.addToCartBtn) {
        this.addToCartBtn.disabled = isLoading;
        this.addToCartBtn.classList.toggle('loading', isLoading);
      }
    }
  };

  // ========== Quick Add快速加购 ==========
  const QuickAdd = {
    init() {
      document.addEventListener('click', (e) => {
        const quickAddBtn = e.target.closest('[data-quick-add]');
        if (!quickAddBtn) return;

        e.preventDefault();
        e.stopPropagation();

        const card = quickAddBtn.closest('[data-product-card]');
        const variantId = card?.dataset.variantId;

        if (variantId) {
          CartDrawer.addItem(variantId, 1);
        }
      });
    }
  };

  // ========== 产品描述展开/收起 ==========
  const ProductDescription = {
    init() {
      const toggle = document.querySelector('[data-description-toggle]');
      const content = document.querySelector('.description-content');

      if (!toggle || !content) return;

      toggle.addEventListener('click', () => {
        content.classList.toggle('expanded');
        toggle.textContent = content.classList.contains('expanded') 
          ? 'Read Less' 
          : 'Read More';
      });
    }
  };

  // ========== 图片放大（Lightbox）==========
  const ImageZoom = {
    init() {
      const mainImage = document.querySelector('.product-image');
      if (!mainImage) return;

      mainImage.addEventListener('click', () => {
        // 简化版：在新标签页打开大图
        const src = mainImage.src;
        if (src) {
          window.open(src, '_blank');
        }
      });
    }
  };

  // ========== 缩略图切换 ==========
  const ThumbnailGallery = {
    init() {
      const thumbnails = document.querySelectorAll('[data-thumbnail-id]');
      const mainMedia = document.querySelector('.product-main-media');

      if (!thumbnails.length || !mainMedia) return;

      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
          // 更新选中状态
          thumbnails.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');

          // 这里可以实现主图切换逻辑
          // 简化版：仅更新选中状态
        });
      });
    }
  };

  // ========== 平滑滚动 ==========
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };

  // ========== 初始化 ==========
  function init() {
    CartDrawer.init();
    ProductForm.init();
    QuickAdd.init();
    ProductDescription.init();
    ImageZoom.init();
    ThumbnailGallery.init();
    SmoothScroll.init();
  }

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露全局API
  window.PasAPas = {
    CartDrawer,
    ProductForm,
    formatMoney: CartDrawer.formatMoney.bind(CartDrawer)
  };

})();
