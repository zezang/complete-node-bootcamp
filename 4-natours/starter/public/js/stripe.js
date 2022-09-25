const stripe = Stripe('pk_test_51LllcnL4PbIAiDVvLEpFhNvj4rdleenRZPJaNIfaZffI9zIlLTywslAQig5FEkIszz8V82sMN8AiFOdPmeSqQXno00XWgcfSvi');

const bookTour = async tourId => {
    const session = await fetch(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    })
};