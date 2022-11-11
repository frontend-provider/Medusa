import { AbstractPaymentService } from "@medusajs/medusa"

class TestPayService extends AbstractPaymentService {
  static identifier = "test-pay"

  constructor(_) {
    super(_)
  }

  async getStatus(paymentData) {
    return "authorized"
  }

  async retrieveSavedMethods(customer) {
    return []
  }

  async createPayment(cart) {
    const fields = [
      "total",
      "subtotal",
      "tax_total",
      "discount_total",
      "shipping_total",
      "gift_card_total",
    ]

    const data = {}
    for (const k of fields) {
      data[k] = cart[k]
    }

    return data
  }

  async createPaymentNew(inputData) {
    return inputData
  }

  async retrievePayment(data) {
    return {}
  }

  async getPaymentData(sessionData) {
    return {}
  }

  async authorizePayment(sessionData, context = {}) {
    if (
      sessionData.cart_id === "cart-id-tax-line-testing-for-pending-payment"
    ) {
      return { data: {}, status: "pending" }
    }

    return { data: {}, status: "authorized" }
  }

  async updatePaymentData(sessionData, update) {
    return {}
  }

  async updatePayment(sessionData, cart) {
    return {}
  }

  async updatePaymentNew(sessionData) {
    return sessionData
  }

  async deletePayment(payment) {
    return {}
  }

  async capturePayment(payment) {
    return {}
  }

  async refundPayment(payment, amountToRefund) {
    return {}
  }

  async cancelPayment(payment) {
    return {}
  }
}

export default TestPayService
