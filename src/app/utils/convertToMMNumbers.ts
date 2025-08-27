// utils/formatMyanmarNumber.ts
export function convertToMyanmarNumber(num: number): string {
  const myanmarDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];

  // Format number with commas (e.g., 1234567 => "1,234,567")
  const formatted = num.toLocaleString("en-US");

  // Convert digits to Myanmar
  return formatted.replace(/\d/g, (d) => myanmarDigits[+d]);
}
