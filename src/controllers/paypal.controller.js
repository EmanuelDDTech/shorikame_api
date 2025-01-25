import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} from '@paypal/paypal-server-sdk';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8080 } = process.env;

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);
const paymentsController = new PaymentsController(client);

const order = async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart, total } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart, total.toString());
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
};

const createOrder = async (cart, total) => {
  const collect = {
    body: {
      intent: 'CAPTURE',
      purchaseUnits: [
        {
          amount: {
            currencyCode: 'MXN',
            value: total,
            breakdown: {
              item_total: {
                currencyCode: 'MXN',
                value: total,
              },
              shipping: {
                currencyCode: 'MXN',
                value: '0',
              },
            },
          },
          // items: cart,
        },
      ],
    },
    prefer: 'return=minimal',
  };

  try {
    const { body, ...httpResponse } = await ordersController.ordersCreate(collect);
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message);
    }
  }
};

const captureOrder = async (orderID) => {
  const collect = {
    id: orderID,
    prefer: 'return=minimal',
  };

  try {
    const { body, ...httpResponse } = await ordersController.ordersCapture(collect);
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message);
    }
  }
};

const capture = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to capture order.' });
  }
};

export { order, capture };
