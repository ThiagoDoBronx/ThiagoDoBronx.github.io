/** wa.me link that opens a WhatsApp chat with `number` and a pre-filled message. */
export function whatsappUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
