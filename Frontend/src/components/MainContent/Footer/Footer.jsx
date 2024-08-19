const Footer = () => {
  return (
    <div className="px-2 py-2 flex flex-col lg:flex-row w-full justify-around bg-zinc-600 lg:px-56 lg:py-3">
      <div className="pb-3">
        <h3 className="text-left text-gray-400 font-bold text-md">ACERCA DE</h3>
        <p className="text-md font-extralight text-slate-300">Información</p>
        <p className="text-md font-extralight text-slate-300">Preguntas frecuentes</p>
      </div>

      <div className="pb-3">
        <h3 className="text-left text-gray-400 font-bold text-md">SECCIONES</h3>
        <p className="text-md font-extralight text-slate-300">Favoritos</p>
        <p className="text-md font-extralight text-slate-300">Ofertas</p>
      </div>

      <div className="">
        <h3 className="text-left text-gray-400 font-bold text-md">SEGUINOS</h3>
        <p className="text-md font-extralight text-slate-300">Facebook</p>
        <p className="text-md font-extralight text-slate-300">Instagram</p>
        <p className="text-md font-extralight text-slate-300">Twitter</p>
      </div>
    </div>
  )
}

export default Footer
