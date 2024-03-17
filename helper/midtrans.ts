// @ts-ignore
import midtransClient from "midtrans-client";

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const midtrans = async (
  transaction_id: string,
  gross_amount: Number,
  products: Array<object>,
  name: string,
  email: string,
) => {
  const payload = {
    transaction_details: {
      order_id: transaction_id,
      gross_amount,
    },
    customer_details: {
      first_name: name,
      email,
    },
    callbacks: {
      finish: `https://bunus.vercel.app/payment/success`,
      error: `https://bunus.vercel.app/payment/error`,
    },
  };
  const data = await snap.createTransaction(payload);
  return data;
};

export { midtrans };
