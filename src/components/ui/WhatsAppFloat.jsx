import { IconWa } from './Icons'
import { CONTACT_PHONE, WHATSAPP_URL } from '../../utils/contact'

export default function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={`WhatsApp ile yazın, ${CONTACT_PHONE}`}
    >
      <IconWa />
    </a>
  )
}
