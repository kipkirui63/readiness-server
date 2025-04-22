const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { price, email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `AI Learning Plan - $${price}` },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `https://your-frontend-url.com/dashboard?success=true&email=${email}`,
      cancel_url: `https://your-frontend-url.com/dashboard?cancel=true`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Stripe server running on port ${port}`));
