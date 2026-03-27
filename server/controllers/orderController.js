import { sequelize, Order, OrderItem, CartItem, Book, Coupon } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Create new order (Transaction-Based Isolation)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { couponCode } = req.body;

    // Phase 1: Lock Cart Items and their corresponding Books
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{ model: Book, required: true }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'No items in cart' });
    }

    // Phase 2: Check Stock atomically and calculate secure total
    let calculatedTotal = 0;
    for (const item of cartItems) {
      if (item.Book.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for book: ${item.Book.title}. Currently ${item.Book.stock} remaining.` 
        });
      }
      calculatedTotal += item.quantity * Number(item.Book.price);
    }

    // Phase 2.5: Apply Coupon Logic
    if (couponCode) {
      const coupon = await Coupon.findOne({
        where: {
          code: couponCode.toUpperCase(),
          is_active: true,
          expiry_date: { [Op.gt]: new Date() }
        },
        transaction: t
      });

      if (!coupon) {
        await t.rollback();
        return res.status(400).json({ message: 'Invalid or expired coupon applied to checkout.' });
      }

      const discount = calculatedTotal * (Number(coupon.discount_percentage) / 100);
      calculatedTotal -= discount;
    }

    const { shippingAddress, paymentMethod, shippingPrice } = req.body;

    // Phase 3: Create Order wrapper
    const newOrder = await Order.create({
      userId: req.user.id,
      totalAmount: calculatedTotal + (Number(shippingPrice) || 0),
      status: 'pending',
      paymentStatus: paymentMethod === 'COD' ? 'unpaid' : 'paid', // Simulate auto-pay for Card/PayPal
      shippingAddress: JSON.stringify(shippingAddress),
      paymentMethod: paymentMethod || 'COD',
      shippingPrice: Number(shippingPrice) || 0
    }, { transaction: t });

    const orderItemsPayload = [];

    // Phase 4: Reduce Stock and Map Items
    for (const item of cartItems) {
      const currentBook = item.Book;
      currentBook.stock -= item.quantity;
      await currentBook.save({ transaction: t });

      orderItemsPayload.push({
        orderId: newOrder.id,
        bookId: currentBook.id,
        quantity: item.quantity,
        price: currentBook.price
      });
    }

    // Phase 5: Insert Order Items
    await OrderItem.bulkCreate(orderItemsPayload, { transaction: t });

    // Phase 6: Clear User Cart
    await CartItem.destroy({
      where: { userId: req.user.id },
      transaction: t
    });

    // Phase 7: Commit full transaction
    await t.commit();
    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder.id });

  } catch (error) {
    if(!t.finished) await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server Error during checkout transaction' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ 
          model: OrderItem, 
          include: [{ model: Book, attributes: ['title', 'coverImageUrl', 'author'] }] 
      }],
      order: [['createdAt', 'DESC']]
    });

    // Format structure to mimic frontend expectations
    const formattedOrders = orders.map(order => ({
        id: order.id,
        total_amount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
        shippingPrice: order.shippingPrice,
        trackingNumber: order.trackingNumber,
        carrierName: order.carrierName,
        created_at: order.createdAt,
        items: order.OrderItems.map(item => ({
            book_id: item.bookId,
            title: item.Book?.title || 'Unknown',
            image_url: item.Book?.coverImageUrl || '',
            author: item.Book?.author || '',
            quantity: item.quantity,
            price: item.price
        }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, include: [Book] },
        { association: 'User', attributes: ['name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Map to frontend expectation
    const formatted = orders.map(order => ({
      id: order.id,
      user_name: order.User.name,
      user_email: order.User.email,
      total_amount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      shippingPrice: order.shippingPrice,
      trackingNumber: order.trackingNumber,
      carrierName: order.carrierName,
      created_at: order.createdAt,
      items: order.OrderItems.map(item => ({
        id: item.id,
        title: item.Book?.title || 'Unknown',
        price: item.price,
        quantity: item.quantity
      }))
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber, carrierName } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if(status) order.status = status;
    if(paymentStatus) order.paymentStatus = paymentStatus;
    if(trackingNumber) order.trackingNumber = trackingNumber;
    if(carrierName) order.carrierName = carrierName;
    order.updatedBy = req.user.id;

    await order.save();
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
