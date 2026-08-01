// function toCents(amount) {
//   return Math.round(Number(amount || 0) * 100);
// }

// function fromCents(cents) {
//   return Number((cents / 100).toFixed(2));
// }

// function addDays(date, days) {
//   const result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// }

// export function calculateInstallments({
//   totalAmount,
//   installments = 4,
//   firstInstallmentPercent = null,
//   startDate = new Date(),
//   intervalDays = 14,
// }) {
//   const totalCents = toCents(totalAmount);

//   if (!Number.isFinite(totalCents) || totalCents <= 0) {
//     throw new Error("totalAmount must be greater than 0");
//   }

//   if (!Number.isInteger(installments) || installments < 2) {
//     throw new Error("installments must be at least 2");
//   }

//   let firstInstallmentCents;

//   if (firstInstallmentPercent) {
//     firstInstallmentCents = Math.round(
//       totalCents * (Number(firstInstallmentPercent) / 100)
//     );
//   } else {
//     firstInstallmentCents = Math.floor(totalCents / installments);
//   }

//   const remainingCents = totalCents - firstInstallmentCents;
//   const remainingInstallments = installments - 1;

//   const baseRemainingCents = Math.floor(
//     remainingCents / remainingInstallments
//   );

//   let remainderCents =
//     remainingCents - baseRemainingCents * remainingInstallments;

//   const schedule = [];

//   schedule.push({
//     installmentNumber: 1,
//     amount: fromCents(firstInstallmentCents),
//     amountCents: firstInstallmentCents,
//     dueDate: new Date(startDate).toISOString(),
//     label: "First installment",
//   });

//   for (let i = 2; i <= installments; i++) {
//     let installmentCents = baseRemainingCents;

//     if (remainderCents > 0) {
//       installmentCents += 1;
//       remainderCents -= 1;
//     }

//     schedule.push({
//       installmentNumber: i,
//       amount: fromCents(installmentCents),
//       amountCents: installmentCents,
//       dueDate: addDays(startDate, intervalDays * (i - 1)).toISOString(),
//       label: `Installment ${i}`,
//     });
//   }

//   const totalScheduledCents = schedule.reduce(
//     (sum, item) => sum + item.amountCents,
//     0
//   );

//   return {
//     totalAmount: fromCents(totalCents),
//     totalAmountCents: totalCents,
//     installments,
//     firstInstallment: schedule[0].amount,
//     firstInstallmentCents: schedule[0].amountCents,
//     remainingAmount: fromCents(totalCents - schedule[0].amountCents),
//     remainingAmountCents: totalCents - schedule[0].amountCents,
//     intervalDays,
//     schedule,
//     isBalanced: totalScheduledCents === totalCents,
//   };
// }



// utils/installmentCalculator.js

export function calculateInstallments({
  totalAmount,
  installments = 4,
  intervalDays = 14,
}) {
  const total = Number(totalAmount);

  const base = Math.floor(total / installments);
  const remainder = total - base * installments;

  const schedule = [];

  for (let i = 0; i < installments; i++) {
    schedule.push({
      installmentNumber: i + 1,
      amount: i === 0 ? base + remainder : base,
      dueInDays: i * intervalDays,
    });
  }

  return {
    totalAmount: total,
    installments,
    schedule,
    firstInstallment: schedule[0].amount,
  };
}