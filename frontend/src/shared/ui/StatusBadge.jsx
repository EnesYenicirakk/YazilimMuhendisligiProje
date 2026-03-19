import PropTypes from 'prop-types'

const STATUS_VARIANTS = new Set(['soft', 'solid', 'outline'])
const STATUS_TONES = new Set(['neutral', 'info', 'success', 'warning', 'danger'])

const badgeClassHaritasi = {
  soft: {
    neutral: 'panel-bilgi-rozet',
    info: 'durum-baloncuk durum-yolda',
    success: 'odeme-durumu odendi',
    warning: 'odeme-durumu beklemede',
    danger: 'tedarik-durum iptal',
  },
  solid: {
    neutral: 'stok-log-rozet',
    info: 'stok-log-rozet',
    success: 'stok-log-rozet',
    warning: 'stok-log-rozet',
    danger: 'stok-log-rozet',
  },
  outline: {
    neutral: 'tedarik-durum',
    info: 'tedarik-durum hazirlaniyor',
    success: 'tedarik-durum teslim',
    warning: 'tedarik-durum bekliyor',
    danger: 'tedarik-durum iptal',
  },
}

function sinifBirlestir(...siniflar) {
  return siniflar.filter(Boolean).join(' ')
}

function StatusBadge({
  label,
  tone = 'neutral',
  variant = 'soft',
  className = '',
  title,
}) {
  const guvenliVariant = STATUS_VARIANTS.has(variant) ? variant : 'soft'
  const guvenliTone = STATUS_TONES.has(tone) ? tone : 'neutral'

  return (
    <span
      className={sinifBirlestir(badgeClassHaritasi[guvenliVariant][guvenliTone], className)}
      title={title}
    >
      {label}
    </span>
  )
}

StatusBadge.propTypes = {
  label: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(['neutral', 'info', 'success', 'warning', 'danger']),
  variant: PropTypes.oneOf(['soft', 'solid', 'outline']),
  className: PropTypes.string,
  title: PropTypes.string,
}

export default StatusBadge
