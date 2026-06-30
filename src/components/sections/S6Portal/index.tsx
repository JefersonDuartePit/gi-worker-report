import PortalShell from '../../portal/PortalShell'

function S6Portal() {
  return (
    <div className="min-h-screen bg-white py-16 px-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gi-navy">Portal do Worker</h2>
          <p className="text-xl text-gi-text mt-3">
            Protótipo navegável de alta fidelidade. Passe o mouse sobre os elementos
            destacados para ver qual dor cada funcionalidade resolve.
          </p>
        </div>
        <PortalShell />
      </div>
    </div>
  )
}

export default S6Portal
