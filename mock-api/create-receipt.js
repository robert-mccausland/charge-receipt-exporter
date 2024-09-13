export function createReceipt(started, stopped, totalEnergy) {
  const receiptId = Math.floor(Math.random() * 1000000);
  return {
    id: receiptId,
    startedOn: started,
    stoppedOn: stopped,
    totalEnergy: totalEnergy,
  };
}
