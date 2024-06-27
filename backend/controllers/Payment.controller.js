import braintree from 'braintree'
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

class PaymentController {
    getToken(req, res) {
        try {
            gateway.clientToken.generate({}, function (err, response) {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.send(response)
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                success: false,
                message: 'Internal Server Error',
            })
        }
    }
    processPayment(req, res) {
        try {
            const nonceFromTheClient = req.body.paymentMethodNonce
            const amountFromTheClient = req.body.amount
            gateway.transaction.sale({
                amount: amountFromTheClient,
                paymentMethodNonce: nonceFromTheClient,
                options: {
                    submitForSettlement: true
                }
            }, function (err, result) {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.send(result)
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                success: false,
                message: 'Internal Server Error',
            })
        }

    }
}
export default new PaymentController()