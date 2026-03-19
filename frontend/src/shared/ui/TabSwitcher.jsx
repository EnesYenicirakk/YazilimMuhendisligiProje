import PropTypes from 'prop-types'

function sinifBirlestir(...siniflar) {
  return siniflar.filter(Boolean).join(' ')
}

function TabSwitcher({
  value,
  options,
  onChange,
  className = '',
  wrap = false,
}) {
  return (
    <div className={sinifBirlestir('odeme-sekme-alani', wrap ? 'kategori-sekme-alani' : '', className)}>
      {options.map((secenek) => (
        <button
          key={secenek.id}
          type="button"
          className={sinifBirlestir('odeme-sekme', value === secenek.id ? 'aktif' : '')}
          disabled={secenek.disabled}
          onClick={() => onChange(secenek.id)}
        >
          {secenek.label}
        </button>
      ))}
    </div>
  )
}

TabSwitcher.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  wrap: PropTypes.bool,
}

export default TabSwitcher
