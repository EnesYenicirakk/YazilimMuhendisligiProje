import PropTypes from 'prop-types'

function sinifBirlestir(...siniflar) {
  return siniflar.filter(Boolean).join(' ')
}

function baslikDugumuOlustur(title) {
  if (typeof title === 'string') {
    return <h2>{title}</h2>
  }

  return title
}

function SectionToolbar({
  title,
  leftMeta,
  rightSlot,
  className = '',
}) {
  return (
    <div className={sinifBirlestir('panel-ust-cizgi', className)}>
      <div>
        {baslikDugumuOlustur(title)}
        {leftMeta}
      </div>
      {rightSlot}
    </div>
  )
}

SectionToolbar.propTypes = {
  title: PropTypes.node.isRequired,
  leftMeta: PropTypes.node,
  rightSlot: PropTypes.node,
  className: PropTypes.string,
}

export default SectionToolbar
