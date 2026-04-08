import PropTypes from 'prop-types'

function sinifBirlestir(...siniflar) {
  return siniflar.filter(Boolean).join(' ')
}

function PageHeader({
  title,
  description,
  actions,
  className = '',
}) {
  return (
    <header className={sinifBirlestir('ust-baslik', className)}>
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions}
    </header>
  )
}

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
}

export default PageHeader
