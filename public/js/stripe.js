import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51OD1SRSIu9GGgRXbBvZS4VWpjay2FnOQkh1AOAvadc7efqximopixdRcyywQnVOAHPBaooOAviHoTmUKGgzkcVyW00bWbaAmSK'
);

export const bookTour = async (tourId) => {
  try {
    // 1 get the session from the server
    const session = await axios.get(
      `http://localhost:5000/api/v1/booking/checkout-session/${tourId}`
    );

    console.log(session);

    // 2 create checkout form + process credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err, 5);
  }
};
