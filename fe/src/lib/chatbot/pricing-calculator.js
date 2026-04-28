// Pure pricing logic. Source of truth: ai_agents/yeu cau.txt §3-§6.
// Kept LLM-free so we never hallucinate prices.

const TRUCK_HOURLY_RATE = 100;
const TRUCK_MIN_FEE = 90;
const PUSHCART_BASE_FEE = 200;
const PUSHCART_TRAVEL_MULTIPLIER = 2;
const PIECE_PRICE = 4;
const MIN_PIECES_PER_HALF_HOUR = 50;

// One-way travel time tiers (minutes → fee USD).
// Travel time should be measured at peak traffic, not free-flow.
export function distanceFee(travelMinutes) {
  if (travelMinutes <= 30) return 0;
  if (travelMinutes <= 45) return 25;
  if (travelMinutes <= 60) return 50;
  if (travelMinutes <= 75) return 100;
  const extraBlocks = Math.ceil((travelMinutes - 75) / 15);
  return 100 + extraBlocks * 50;
}

// 50 pieces per 30 min of serving time
export function minPieces(hours) {
  return Math.ceil(hours * 2) * MIN_PIECES_PER_HALF_HOUR;
}

export function calculateEstimate({
  serviceType,
  hours,
  travelTimeMinutes,
  quantity,
  taxRate,
}) {
  const billedQty = Math.max(quantity, minPieces(hours));
  const oneWayTravelFee = distanceFee(travelTimeMinutes);

  // Truck: $100/hr (min $90 floor for 30-min visits) + standard travel fee.
  // Pushcart: $200 base + 2× travel fee, no hourly rate, no separate travel fee.
  let truckFee = 0;
  let truckTravelFee = 0;
  let pushcartBaseFee = 0;
  let pushcartDeliveryFee = 0;
  if (serviceType === 'truck') {
    truckFee = Math.max(TRUCK_MIN_FEE, TRUCK_HOURLY_RATE * hours);
    truckTravelFee = oneWayTravelFee;
  } else if (serviceType === 'pushcart') {
    pushcartBaseFee = PUSHCART_BASE_FEE;
    pushcartDeliveryFee = oneWayTravelFee * PUSHCART_TRAVEL_MULTIPLIER;
  }

  const iceCreamCost = billedQty * PIECE_PRICE;
  const tax = iceCreamCost * taxRate;
  const total =
    truckFee +
    truckTravelFee +
    pushcartBaseFee +
    pushcartDeliveryFee +
    iceCreamCost +
    tax;

  return {
    breakdown: {
      truckFee: round2(truckFee),
      travelFee: round2(truckTravelFee),
      pushcartBaseFee: round2(pushcartBaseFee),
      pushcartDeliveryFee: round2(pushcartDeliveryFee),
      iceCreamCost: round2(iceCreamCost),
      tax: round2(tax),
      billedQty,
      minRequired: minPieces(hours),
      requestedQty: quantity,
    },
    total: round2(total),
    currency: 'USD',
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
