import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

export const stripeController = async (req, res) => {
  try {
    // Recebendo os dados da requisição
    const { paymentMethod, price, name, quantity, imageUrl} = req.body;

    // Criando a sessão de checkout do Stripe com os dados da requisição
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [paymentMethod], // Ex: 'card' ou outro método
      line_items: [
        {
          price_data: {
            currency: 'brl', // Pode-se ajustar para outra moeda
            product_data: {
              name: name, // Nome do produto vindo da requisição,
              images: [imageUrl], // URL da imagem do produto
            },
            unit_amount: price, // Preço em centavos
          },
          quantity: quantity, // Quantidade vinda da requisição
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/sucesso',
      cancel_url: 'http://localhost:5173/cancelar',
    });

    // Retornando o ID da sessão de checkout
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao criar a sessão de pagamento');
  }
}