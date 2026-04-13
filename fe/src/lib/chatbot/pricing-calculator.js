// Pure pricing logic. Source of truth: ai_agents/yeu cau.txt §3-§6.
// Kept LLM-free so we never hallucinate prices.

const TRUCK_HOURLY_RATE = 80;
const PIECE_PRICE = 4;
const MIN_PIECES_PER_HALF_HOUR = 50;

// One-way travel time tiers (minutes → fee USD)
export function distanceFee(travelMinutes) {
  if (travelMinutes <= 30) return 0;
  if (travelMinutes <= 45) return 25;
  if (travelMinutes <= 60) return 50;
  if (travelMinutes <= 75) return 100;
  // Beyond table: extrapolate +$50 per extra 15-min block
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
  const truckFee =
    serviceType === 'truck' ? TRUCK_HOURLY_RATE * Math.max(1, hours) : 0;
  const travelFee = distanceFee(travelTimeMinutes);
  const iceCreamCost = billedQty * PIECE_PRICE;
  const tax = iceCreamCost * taxRate;
  const total = truckFee + travelFee + iceCreamCost + tax;

  return {
    breakdown: {
      truckFee: round2(truckFee),
      travelFee: round2(travelFee),
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
